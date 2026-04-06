import { useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Wallet, TrendingUp, Clock } from 'lucide-react';
import { CRYPTOCURRENCIES, calculateDailyEarning } from '../../data/coins';
import { supabase } from '../../lib/supabase';

interface CoinSelection {
  coinId: string;
  allocation: number; // Porcentaje de hashrate asignado (0-100)
}

interface RealTimeMiningProps {
  userHashrate: number;
  onBalanceUpdate: (newBalance: number) => void;
}

export function RealTimeMining({ userHashrate, onBalanceUpdate }: RealTimeMiningProps) {
  const [isMining, setIsMining] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState<CoinSelection[]>([
    { coinId: 'btc', allocation: 50 },
    { coinId: 'eth', allocation: 30 },
    { coinId: 'usdt', allocation: 20 },
  ]);
  const [sessionEarnings, setSessionEarnings] = useState(0);
  const [totalMined, setTotalMined] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Calcular ganancia por segundo basada en hashrate y分配
  const calculateEarningsPerSecond = useCallback(() => {
    let totalEarningPerSecond = 0;
    
    selectedCoins.forEach(({ coinId, allocation }) => {
      const coin = CRYPTOCURRENCIES.find(c => c.id === coinId);
      if (coin && allocation > 0) {
        const allocatedHashrate = (userHashrate * allocation) / 100;
        const dailyEarning = calculateDailyEarning(allocatedHashrate, coin.hashrateContribution / 100);
        const earningPerSecond = dailyEarning / 86400; // 86400 segundos en un día
        totalEarningPerSecond += earningPerSecond;
      }
    });
    
    return totalEarningPerSecond;
  }, [userHashrate, selectedCoins]);

  // Minado en tiempo real
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isMining) {
      const earningsPerSecond = calculateEarningsPerSecond();
      
      interval = setInterval(() => {
        setSessionEarnings(prev => {
          const newEarning = prev + earningsPerSecond;
          return newEarning;
        });
        
        setTotalMined(prev => prev + earningsPerSecond);
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMining, calculateEarningsPerSecond]);

  // Guardar ganancias cada 30 segundos
  useEffect(() => {
    if (sessionEarnings > 0 && elapsedTime % 30 === 0) {
      saveEarnings();
    }
  }, [elapsedTime, sessionEarnings]);

  const saveEarnings = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user && sessionEarnings > 0) {
        // Actualizar balance en la base de datos
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.data.user.id)
          .single();
        
        if (profile) {
          const newBalance = profile.balance + sessionEarnings;
          await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', user.data.user.id);
          
          onBalanceUpdate(newBalance);
          setSessionEarnings(0); // Resetear ganancias de sesión después de guardar
        }
      }
    } catch (error) {
      console.error('Error saving earnings:', error);
    }
  };

  const toggleMining = () => {
    if (!isMining) {
      setStartTime(new Date());
      setIsMining(true);
    } else {
      saveEarnings();
      setIsMining(false);
    }
  };

  const resetSession = () => {
    saveEarnings();
    setSessionEarnings(0);
    setElapsedTime(0);
    setStartTime(null);
    setIsMining(false);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(8)}`;
  };

  const earningsPerSecond = calculateEarningsPerSecond();
  const earningsPerDay = earningsPerSecond * 86400;
  const earningsPer30Days = earningsPerDay * 30;

  return (
    <div className="bg-[#161b22] rounded-2xl border border-[#00ff88]/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Minado en Tiempo Real</h3>
            <p className="text-gray-400 text-sm">Hashrate: {userHashrate} H/s</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMining}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              isMining 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-[#00ff88] text-black hover:bg-[#00cc6a]'
            }`}
          >
            {isMining ? (
              <><Pause className="w-5 h-5" /> Pausar</>
            ) : (
              <><Play className="w-5 h-5" /> Iniciar Minado</>
            )}
          </button>
          
          <button
            onClick={resetSession}
            className="p-3 bg-[#0d1117] text-gray-400 rounded-xl hover:text-white transition-colors"
            title="Reiniciar sesión"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Tiempo</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {formatTime(elapsedTime)}
          </p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Sesión Actual</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88] font-mono">
            {formatCurrency(sessionEarnings)}
          </p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Por Día</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {formatCurrency(earningsPerDay)}
          </p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">30 Días</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88] font-mono">
            {formatCurrency(earningsPer30Days)}
          </p>
        </div>
      </div>

      {/* Ganancia en tiempo real grande */}
      <div className="bg-gradient-to-r from-[#00ff88]/10 to-[#00cc6a]/10 rounded-xl p-6 border border-[#00ff88]/30 mb-6">
        <p className="text-gray-400 text-sm mb-2">Ganancia en tiempo real</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-[#00ff88] font-mono">
            {formatCurrency(sessionEarnings)}
          </span>
          <span className="text-gray-400">USDT</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          +{formatCurrency(earningsPerSecond)}/segundo
        </p>
      </div>

      {/* Selección de criptomonedas */}
      <div>
        <h4 className="text-white font-semibold mb-4">Distribución de Minado</h4>
        <div className="space-y-3">
          {selectedCoins.map((selection, index) => {
            const coin = CRYPTOCURRENCIES.find(c => c.id === selection.coinId);
            if (!coin) return null;
            
            return (
              <div key={coin.id} className="flex items-center gap-4 bg-[#0d1117] rounded-xl p-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                  style={{ backgroundColor: coin.color + '20', color: coin.color }}
                >
                  {coin.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{coin.name}</span>
                    <span className="text-[#00ff88]">{selection.allocation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selection.allocation}
                    onChange={(e) => {
                      const newAllocation = parseInt(e.target.value);
                      setSelectedCoins(prev => prev.map((s, i) => 
                        i === index ? { ...s, allocation: newAllocation } : s
                      ));
                    }}
                    disabled={isMining}
                    className="w-full h-2 bg-[#161b22] rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {isMining && (
          <p className="text-yellow-400 text-sm mt-3">
            ⚠️ Pausa el minado para cambiar la distribución
          </p>
        )}
      </div>
    </div>
  );
}
