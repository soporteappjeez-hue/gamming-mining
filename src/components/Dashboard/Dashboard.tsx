import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Header } from './Header';
import { Shop } from './Shop';
import { MiningAllocation } from './MiningAllocation';
import { MiningVisualization3D } from './MiningVisualization3D';
import { Wallet } from './Wallet';
import { UserPanel } from './UserPanel';
import { RealTimeMining } from './RealTimeMining';
import { supabase, getCurrentUser, getProfile, type Profile } from '../../lib/supabase';
import { ArrowLeft, Home } from 'lucide-react';

type Tab = 'shop' | 'allocation' | 'wallet';

export function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<Tab>('shop');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const {
    processMiningTick,
    updateMarketPrices,
    totalHashrate
  } = useGameStore();

  // Cargar usuario y perfil
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await getProfile(currentUser.id);
        setProfile(profileData);
        setBalance(profileData.balance);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setBalance(newBalance);
  };

  // Loop principal de minado
  const gameLoop = useCallback((timestamp: number) => {
    const state = useGameStore.getState();
    const lastUpdate = state.lastUpdate;
    const now = Date.now();
    const deltaMs = Math.min(now - lastUpdate, 1000);

    if (deltaMs > 0 && state.totalHashrate > 0) {
      processMiningTick(deltaMs);
    }

    requestAnimationFrame(gameLoop);
  }, [processMiningTick]);

  // Iniciar loops
  useEffect(() => {
    const animationId = requestAnimationFrame(gameLoop);
    const marketInterval = setInterval(() => {
      updateMarketPrices();
    }, 5000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(marketInterval);
    };
  }, [gameLoop, updateMarketPrices]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
      </div>
    );
  }

  const userHashrate = profile?.hashrate || totalHashrate || 1;

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col overflow-hidden">
      {/* Header con navegación */}
      <header className="bg-[#161b22] border-b border-[#00ff88]/20 px-4 py-3 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Volver a Inicio</span>
            </Link>
            
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-400 hover:text-[#00ff88] transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Landing</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Balance</p>
              <p className="text-[#00ff88] font-bold">${balance.toFixed(4)} USDT</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar izquierdo */}
        <div className="w-80 bg-[#161b22] border-r border-[#00ff88]/20 flex flex-col">
          {/* User Panel */}
          <div className="flex-shrink-0 border-b border-[#00ff88]/20">
            <UserPanel profile={profile} onLogout={handleLogout} />
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-[#00ff88]/20">
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === 'shop'
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border-b-2 border-[#00ff88]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🛒 Tienda
            </button>
            <button
              onClick={() => setActiveTab('allocation')}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === 'allocation'
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border-b-2 border-[#00ff88]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⛏️ Minado
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === 'wallet'
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border-b-2 border-[#00ff88]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💰 Wallet
            </button>
          </div>

          {/* Contenido del tab */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'shop' && <Shop />}
            {activeTab === 'allocation' && <MiningAllocation />}
            {activeTab === 'wallet' && <Wallet />}
          </div>
        </div>

        {/* Área principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Minado en tiempo real */}
          <div className="flex-shrink-0 p-4">
            <RealTimeMining 
              userHashrate={userHashrate}
              onBalanceUpdate={handleBalanceUpdate}
            />
          </div>
          
          {/* Visualización 3D */}
          <div className="flex-1 p-4 pt-0 overflow-hidden">
            <MiningVisualization3D />
          </div>
        </div>
      </div>
    </div>
  );
}
