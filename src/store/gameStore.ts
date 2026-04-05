import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, OwnedComponent, MiningAllocation } from '../types';
import { CRYPTOCURRENCIES, getCoinById } from '../data/coins';
import { getComponentById } from '../data/components';

interface GameStore extends GameState {
  addToWallet: (coinId: string, amount: number) => void;
  spendFromWallet: (coinId: string, amount: number) => boolean;
  getWalletBalance: (coinId: string) => number;
  buyComponent: (componentId: string) => boolean;
  sellComponent: (instanceId: string) => boolean;
  getOwnedComponents: () => OwnedComponent[];
  setMiningAllocation: (allocations: MiningAllocation[]) => void;
  getMiningAllocation: (coinId: string) => number;
  calculateHashrate: () => number;
  calculatePowerConsumption: () => number;
  calculateTemperature: () => number;
  calculateCoolingCapacity: () => number;
  processMiningTick: (deltaMs: number) => void;
  updateMarketPrices: () => void;
  resetGame: () => void;
  canAfford: (cost: number) => boolean;
}

const initialState: GameState = {
  wallet: CRYPTOCURRENCIES.map(c => ({
    coinId: c.id,
    amount: 0,
    lastUpdated: Date.now(),
  })),
  usdtBalance: 100,
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

      addToWallet: (coinId, amount) => {
        set(state => ({
          wallet: state.wallet.map(w =>
            w.coinId === coinId ? { ...w, amount: w.amount + amount, lastUpdated: Date.now() } : w
          ),
        }));
      },

      spendFromWallet: (coinId, amount) => {
        const balance = get().getWalletBalance(coinId);
        if (balance < amount) return false;
        set(state => ({
          wallet: state.wallet.map(w =>
            w.coinId === coinId ? { ...w, amount: w.amount - amount, lastUpdated: Date.now() } : w
          ),
        }));
        return true;
      },

      getWalletBalance: (coinId) => {
        const wallet = get().wallet.find(w => w.coinId === coinId);
        return wallet?.amount ?? 0;
      },

      buyComponent: (componentId) => {
        const component = getComponentById(componentId);
        if (!component) return false;
        const { ownedComponents, unlockedRacks, usdtBalance } = get();
        const maxSlots = unlockedRacks * 8;
        if (ownedComponents.length >= maxSlots) return false;
        if (usdtBalance < component.cost) return false;

        const instanceId = `${componentId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const position = { rack: Math.floor(ownedComponents.length / 8) + 1, slot: ownedComponents.length % 8 };

        set(state => ({
          usdtBalance: state.usdtBalance - component.cost,
          ownedComponents: [...state.ownedComponents, { instanceId, componentId, level: 1, isOverheating: false, position }],
        }));
        return true;
      },

      sellComponent: (instanceId) => {
        const owned = get().ownedComponents.find(c => c.instanceId === instanceId);
        if (!owned) return false;
        const component = getComponentById(owned.componentId);
        if (!component) return false;
        const sellPrice = component.cost * 0.6;
        set(state => ({
          usdtBalance: state.usdtBalance + sellPrice,
          ownedComponents: state.ownedComponents.filter(c => c.instanceId !== instanceId),
        }));
        return true;
      },

      getOwnedComponents: () => get().ownedComponents,

      setMiningAllocation: (allocations) => set({ miningAllocations: allocations }),

      getMiningAllocation: (coinId) => {
        const alloc = get().miningAllocations.find(a => a.coinId === coinId);
        return alloc?.percentage ?? 0;
      },

      calculateHashrate: () => {
        return get().ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          const levelMultiplier = 1 + (owned.level - 1) * 0.15;
          return total + component.hashrate * levelMultiplier;
        }, 0);
      },

      calculatePowerConsumption: () => {
        return get().ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          const levelMultiplier = 1 + (owned.level - 1) * 0.10;
          return total + component.powerConsumption * levelMultiplier;
        }, 0);
      },

      calculateCoolingCapacity: () => {
        return get().ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          return total + component.coolingEffect;
        }, 20);
      },

      calculateTemperature: () => {
        const heatGenerated = get().ownedComponents.reduce((total, owned) => {
          const component = getComponentById(owned.componentId);
          if (!component) return total;
          return total + component.heatGeneration;
        }, 0);
        const cooling = get().calculateCoolingCapacity();
        const baseTemp = 25;
        const tempChange = (heatGenerated - cooling) * 0.1;
        return Math.max(25, Math.min(120, baseTemp + tempChange));
      },

      processMiningTick: (deltaMs) => {
        const { miningAllocations, wallet, coinPrices } = get();
        const hashrate = get().calculateHashrate();
        if (hashrate === 0) return;

        const tickSeconds = deltaMs / 1000;
        const efficiency = 0.85;

        miningAllocations.forEach(alloc => {
          const coin = getCoinById(alloc.coinId);
          if (!coin || alloc.percentage === 0) return;
          const coinHashrate = hashrate * (alloc.percentage / 100);
          const earningsPerSec = (coinHashrate * coin.hashrateContribution * efficiency) / coin.price;
          const earned = earningsPerSec * tickSeconds;
          get().addToWallet(alloc.coinId, earned);
        });

        const totalUSDT = miningAllocations.reduce((total, alloc) => {
          const coin = getCoinById(alloc.coinId);
          if (!coin) return total;
          const coinHashrate = hashrate * (alloc.percentage / 100);
          const earningsPerSec = (coinHashrate * coin.hashrateContribution * efficiency) / coin.price;
          return total + earningsPerSec * (1) * coin.price;
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

      updateMarketPrices: () => {
        const volatilidad = 0.02;
        set(state => {
          const newPrices: Record<string, number> = {};
          CRYPTOCURRENCIES.forEach(coin => {
            const currentPrice = state.coinPrices[coin.id] ?? coin.price;
            const change = (Math.random() - 0.5) * 2 * volatilidad;
            const newPrice = currentPrice * (1 + change);
            newPrices[coin.id] = Math.max(0.00001, newPrice);
          });
          return { coinPrices: newPrices };
        });
      },

      resetGame: () => set(initialState),

      canAfford: (cost) => get().usdtBalance >= cost,
    }),
    { name: 'gamming-mining-storage' }
  )
);
