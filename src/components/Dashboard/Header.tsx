import { useGameStore } from '../../store/gameStore';
import { CRYPTOCURRENCIES } from '../../data/coins';

export function Header() {
  const { usdtBalance, totalHashrate, averageTemperature, totalPowerConsumption, coinPrices, wallet } = useGameStore();

  // Calcular valor total del portfolio en USDT
  const totalPortfolio = wallet.reduce((total, w) => {
    const price = coinPrices[w.coinId] ?? 1;
    return total + w.amount * price;
  }, 0) + usdtBalance;

  return (
    <header className="bg-cyber-panel border-b border-cyber-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">⛏️</div>
          <div>
            <h1 className="text-xl font-bold text-cyber-accent glow-accent">GAMMING MINING</h1>
            <p className="text-xs text-gray-500">Cloud Mining Idle Game</p>
          </div>
        </div>

        {/* Stats principales */}
        <div className="flex gap-4">
          <div className="stat-card min-w-[120px]">
            <span className="text-xs text-gray-400">Balance USDT</span>
            <span className="text-lg font-bold text-cyber-accent">
              ${usdtBalance.toFixed(2)}
            </span>
          </div>

          <div className="stat-card min-w-[120px]">
            <span className="text-xs text-gray-400">Portfolio Total</span>
            <span className="text-lg font-bold text-cyber-secondary">
              ${totalPortfolio.toFixed(2)}
            </span>
          </div>

          <div className="stat-card min-w-[100px]">
            <span className="text-xs text-gray-400">Hashrate</span>
            <span className="text-lg font-bold text-white">
              {totalHashrate.toFixed(0)} <span className="text-xs">H/s</span>
            </span>
          </div>

          <div className="stat-card min-w-[100px]">
            <span className="text-xs text-gray-400">Temperatura</span>
            <span className={`text-lg font-bold ${
              averageTemperature > 80 ? 'text-cyber-danger' :
              averageTemperature > 60 ? 'text-cyber-warning' :
              'text-cyber-accent'
            }`}>
              {averageTemperature.toFixed(0)}°C
            </span>
          </div>

          <div className="stat-card min-w-[100px]">
            <span className="text-xs text-gray-400">Energía</span>
            <span className="text-lg font-bold text-cyber-warning">
              {totalPowerConsumption.toFixed(0)} <span className="text-xs">W</span>
            </span>
          </div>
        </div>

        {/* Nivel */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-gray-400">Nivel {useGameStore.getState().level}</p>
            <div className="w-24 h-2 bg-cyber-border rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-accent transition-all"
                style={{ width: `${Math.min(100, (useGameStore.getState().totalEarned / 1000) % 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Precios de monedas superiores */}
      <div className="flex gap-4 mt-3 overflow-x-auto pb-1">
        {CRYPTOCURRENCIES.slice(0, 15).map(coin => {
          const balance = wallet.find(w => w.coinId === coin.id)?.amount ?? 0;
          return (
            <div
              key={coin.id}
              className="flex items-center gap-2 bg-cyber-dark/50 px-3 py-1 rounded-full border border-cyber-border/50 flex-shrink-0"
            >
              <span className="text-sm">{coin.icon}</span>
              <span className="text-xs text-gray-400">{coin.symbol}</span>
              <span className="text-xs text-white font-mono">${coinPrices[coin.id]?.toFixed(coin.price < 1 ? 6 : 2)}</span>
              {balance > 0 && (
                <span className="text-xs text-cyber-accent font-bold">
                  {balance > 1000 ? `${(balance / 1000).toFixed(1)}K` : balance.toFixed(4)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </header>
  );
}
