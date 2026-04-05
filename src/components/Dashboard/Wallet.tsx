import { useGameStore } from '../../store/gameStore';
import { CRYPTOCURRENCIES } from '../../data/coins';

export function Wallet() {
  const { wallet, coinPrices } = useGameStore();

  // Ordenar por valor total
  const sortedWallet = [...wallet]
    .map(w => ({
      ...w,
      value: w.amount * (coinPrices[w.coinId] ?? 0),
      coin: CRYPTOCURRENCIES.find(c => c.id === w.coinId),
    }))
    .filter(w => w.coin && w.amount > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-cyber-border">
        <h2 className="text-lg font-bold text-cyber-accent">💰 Wallet</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedWallet.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">💸</p>
            <p>No tienes criptomonedas aún</p>
            <p className="text-sm">¡Mina para ganar!</p>
          </div>
        ) : (
          sortedWallet.map(item => (
            <div
              key={item.coinId}
              className="bg-cyber-panel p-3 rounded-lg border border-cyber-border flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${item.coin?.color ?? '#333'}22` }}
                >
                  {item.coin?.icon ?? '?'}
                </div>
                <div>
                  <p className="font-bold text-white">{item.coin?.symbol}</p>
                  <p className="text-xs text-gray-400">{item.coin?.name}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-cyber-accent">
                  {item.amount > 1000
                    ? `${(item.amount / 1000).toFixed(2)}K`
                    : item.amount.toFixed(item.amount < 1 ? 6 : 4)}
                </p>
                <p className="text-xs text-gray-400">
                  ${item.value.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
