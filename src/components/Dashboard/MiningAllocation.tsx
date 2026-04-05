import { useGameStore } from '../../store/gameStore';
import { CRYPTOCURRENCIES } from '../../data/coins';

export function MiningAllocation() {
  const { miningAllocations, setMiningAllocation, totalHashrate, coinPrices } = useGameStore();

  const handleAllocationChange = (coinId: string, newPercentage: number) => {
    const updated = miningAllocations.map(a =>
      a.coinId === coinId ? { ...a, percentage: Math.max(0, Math.min(100, newPercentage)) } : a
    );
    setMiningAllocation(updated);
  };

  const addCoinToAllocation = (coinId: string) => {
    if (!miningAllocations.find(a => a.coinId === coinId)) {
      setMiningAllocation([...miningAllocations, { coinId, percentage: 0 }]);
    }
  };

  const removeCoinFromAllocation = (coinId: string) => {
    setMiningAllocation(miningAllocations.filter(a => a.coinId !== coinId));
  };

  const totalPercentage = miningAllocations.reduce((sum, a) => sum + a.percentage, 0);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cyber-border">
        <h2 className="text-lg font-bold text-cyber-accent mb-2">⛏️ Asignación de Minado</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Hashrate total:</span>
          <span className="text-white font-bold">{totalHashrate.toFixed(0)} H/s</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-400">Total asignado:</span>
          <span className={`font-bold ${totalPercentage === 100 ? 'text-cyber-accent' : 'text-cyber-warning'}`}>
            {totalPercentage}%
          </span>
        </div>
        {/* Barra de progreso */}
        <div className="w-full h-2 bg-cyber-dark rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-cyber-accent transition-all"
            style={{ width: `${Math.min(100, totalPercentage)}%` }}
          />
        </div>
      </div>

      {/* Lista de asignaciones */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {miningAllocations.map(alloc => {
          const coin = CRYPTOCURRENCIES.find(c => c.id === alloc.coinId);
          if (!coin) return null;

          const effectiveHashrate = totalHashrate * (alloc.percentage / 100);
          const earningsPerHour = (effectiveHashrate * coin.hashrateContribution * 0.85) / coin.price * 3600;

          return (
            <div key={alloc.coinId} className="bg-cyber-panel p-3 rounded-lg border border-cyber-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{coin.icon}</span>
                  <div>
                    <span className="font-bold text-white">{coin.symbol}</span>
                    <span className="text-xs text-gray-400 ml-2">${coinPrices[alloc.coinId]?.toFixed(coin.price < 1 ? 6 : 2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeCoinFromAllocation(alloc.coinId)}
                  className="text-gray-500 hover:text-cyber-danger text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={alloc.percentage}
                onChange={(e) => handleAllocationChange(alloc.coinId, parseInt(e.target.value))}
                className="w-full h-2 bg-cyber-dark rounded-full appearance-none cursor-pointer accent-cyber-accent"
              />

              <div className="flex justify-between text-sm mt-1">
                <span className="text-cyber-accent font-bold">{alloc.percentage}%</span>
                <span className="text-gray-400">
                  ~{earningsPerHour.toFixed(4)} {coin.symbol}/h
                </span>
              </div>
            </div>
          );
        })}

        {/* Agregar nueva moneda */}
        <div className="border border-dashed border-cyber-border rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">Agregar moneda:</p>
          <div className="flex flex-wrap gap-1">
            {CRYPTOCURRENCIES.filter(c => !miningAllocations.find(a => a.coinId === c.id))
              .slice(0, 10)
              .map(coin => (
                <button
                  key={coin.id}
                  onClick={() => addCoinToAllocation(coin.id)}
                  className="px-2 py-1 bg-cyber-dark rounded text-xs hover:bg-cyber-accent/20 hover:text-cyber-accent transition-all"
                >
                  {coin.icon} {coin.symbol}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
