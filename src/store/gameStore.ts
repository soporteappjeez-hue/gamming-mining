import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, WalletBalance, OwnedComponent, MiningAllocation, Coin } from '../types';
import { CRYPTOCURRENCIES, getCoinById } from '../data/coins';
import { getComponentById } from '../data/components';

interface GameStore extends GameState {
  // Acciones de wallet
  addToWallet: (coinId: string, amount: number) => void;
  spendFromWallet: (coinId: string, amount: number) => boolean;
  getWalletBalance: (coinId: string) => number;

  // Acciones de componentes
  buyComponent: (componentId: string) => boolean;
  sellComponent: (instanceId: string) => boolean;
  getOwnedComponents: () => OwnedComponent[];

  // Asignación de minado
  setMiningAllocation: (allocations: MiningAllocation[]) => void;
  getMiningAllocation: (coinId: string) => number;

  // Cálculos
  calculateHashrate: () => number;
  calculatePowerConsumption: () => number;
  calculateTemperature: () => number;
  calculateCoolingCapacity: () => number;

  // Tick de minado
  processMiningTick: (deltaMs: number) => void;

  // Mercado
  updateMarketPrices: () => void;

  // Utilidades
  resetGame: () => void;
  canAfford: (cost: number) => boolean;
}

const initialState: GameState = {
  wallet: CRYPTOCURRENCIES.map(c => ({
    coinId: c.id,
    amount: 0,
    lastUpdated: Date.now(),
  })),
  usdtBalance: 100, // Empezamos con 100 USDT
  ownedComponents: [],
  totalRacks: 3,
  unlockedRacks: 1,
  totalHashrate: 0,
  totalPowerConsumption: 0,
  averageTemperature: 25,
  coolingCapacity: 20,
  miningAllocations: [
    { coinId: 'btc', percentage: 50 },
    { coinId: 'eth', percentage: 30 },
    { coinId: 'ltc', percentage: 20 },
  ],
  level: 1,
  totalEarned: 0,
  coinPrices: Object.fromEntries(CRYPTOCURRENCIES.map(c => [c.id, c.price])),
  lastUpdate: Date.now(),
  playTime: 0,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Wallet
      addToWallet: (coinId, amount) => {
        set(state => ({
          wallet: state.wallet.map(w =>
            w.coinId === coinId
              ? { ...w, amount: w.amount + amount, lastUpdated: Date.now() }
              : w
          ),
        }));
      },

      spendFromWallet: (coinId, amount) => {
        const balance = get().getWalletBalance(coinId);
        if (balance < amount) return false;

        set(state => ({
          wallet: state.wallet.map(w =>
            w.coinId === coinId
              ? { ...w, amount: w.amount - amount, lastUpdated: Date.now() }
              : w
          ),
        }));
        return true;
      },

      getWalletBalance: (coinId) => {
        const wallet = get().wallet.find(w => w.coinId === coinId);
        return wallet?.amount ?? 0;
      },

      // Componentes
      buyComponent: (componentId) => {
        const component = getComponentById(componentId);
        if (!component) return false;

        const { ownedComponents, unlockedRacks, usdtBalance } = get();
        const maxSlots = unlockedRacks * 8; // 8 slots por rack
        if (ownedComponents.length >= maxSlots) return false;
        if (usdtBalance < component.cost) return false;

        const instanceId = `${componentId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const position = { rack: Math.floor(ownedComponents.length / 8) + 1, slot: ownedComponents.length % 8 };

        set(state => ({
          usdtBalance: state.usdtBalance - component.cost,
          ownedComponents: [
            ...state.ownedComponents,
            {
              instanceId,
              componentId,
              level: 1,
              isOverheating: false,
              position,
            },
          ],
        }));

        return true;
      },

      sellComponent: (instanceId) => {
        const owned = get().ownedComponents.find(c => c.instanceId === instanceId);
        if (!owned) return false;

        const component = getComponentById(owned.componentId);
        if (!component) return false;

        const sellPrice = component.cost * 0.6; // 60% del valor

        set(state => ({
          usdtBalance: state.usdtBalance + sellPrice,
          ownedComponents: state.ownedComponents.filter(c => c.instanceId !== instanceId),
        }));

        return true;
      },

      getOwnedComponents: () => get().ownedComponents,

      // Mining Allocation
      setMiningAllocation: (allocations) => {
        set({ miningAllocations: allocations });
      },

      getMiningAllocation: (coinId) => {
        const alloc = get().miningAllocations.find(a => a.coinId === coinId);
        return alloc?.percentage ?? 0;
      },

      // Cálculos
      calculateHashrate: () => {
        const { ownedComponents } = get();
        return ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          const levelMultiplier = 1 + (owned.level - 1) * 0.15;
          return total + component.hashrate * levelMultiplier;
        }, 0);
      },

      calculatePowerConsumption: () => {
        const { ownedComponents } = get();
        return ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          const levelMultiplier = 1 + (owned.level - 1) * 0.10;
          return total + component.powerConsumption * levelMultiplier;
        }, 0);
      },

      calculateCoolingCapacity: () => {
        const { ownedComponents } = get();
        return ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          return total + component.coolingEffect;
        }, 20); // Cooling base de 20
      },

      calculateTemperature: () => {
        const { ownedComponents } = get();
        const heatGenerated = ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          return total + component.heatGeneration;
        }, 0);

        const cooling = get().calculateCoolingCapacity();
        const baseTemp = 25;
        const tempChange = (heatGenerated - cooling) * 0.1;
        return Math.max(25, Math.min(120, baseTemp + tempChange));
      },

      // Mining Tick - LA FÓRMULA PRINCIPAL
      processMiningTick: (deltaMs) => {
        const { miningAllocations, wallet, coinPrices } = get();
        const hashrate = get().calculateHashrate();
        if (hashrate === 0) return;

        const tickSeconds = deltaMs / 1000;
        const efficiency = 0.85; // 85% de eficiencia

        const newEarnings: Record<string, number> = {};

        miningAllocations.forEach(alloc => {
          const coin = getCoinById(alloc.coinId);
          if (!coin || alloc.percentage === 0) return;

          // Fórmula: (hashrate * allocation% * coin hashrate factor * efficiency * delta) / coin price
          const coinHashrate = hashrate * (alloc.percentage / 100);
          const earningsPerSec = (coinHashrate * coin.hashrateContribution * efficiency) / coin.price;

          const earned = earningsPerSec * tickSeconds;
          newEarnings[alloc.coinId] = earned;

          // Agregar a wallet
          const walletEntry = wallet.find(w => w.coinId === alloc.coinId);
          if (walletEntry) {
            get().addToWallet(alloc.coinId, earned);
          }
        });

        // Calcular earnings totales en USDT para stats
        const totalUSDT = Object.entries(newEarnings).reduce((total, [coinId, amount]) => {
          const price = coinPrices[coinId] ?? 1;
          return total + amount * price;
        }, 0);

        set(state => ({
          totalHashrate: get().calculateHashrate(),
          totalPowerConsumption: get().calculatePowerConsumption(),
          averageTemperature: get().calculateTemperature(),
          coolingCapacity: get().calculateCoolingCapacity(),
          totalEarned: state.totalEarned + totalUSDT,
          lastUpdate: Date.now(),
          playTime: state.playTime + deltaMs,
        }));
      },

      // Mercado fluctuante
      updateMarketPrices: () => {
        const波动率 = 0.02; // 2% de variación máxima

        set(state => {
          const newPrices: Record<string, number> = {};
          CRYPTOCURRENCIES.forEach(coin => {
            const currentPrice = state.coinPrices[coin.id] ?? coin.price;
            const change = (Math.random() - 0.5) * 2 * 波动率;
            const newPrice = currentPrice * (1 + change);
            // Mantener precios realistas (no menos de 0.00001)
            newPrices[coin.id] = Math.max(0.00001, newPrice);
          });
          return { coinPrices: newPrices };
        });
      },

      // Utilidades
      resetGame: () => set(initialState),

      canAfford: (cost) => get().usdtBalance >= cost,
    }),
    {
      name: 'gamming-mining-storage',
    }
  )
);
