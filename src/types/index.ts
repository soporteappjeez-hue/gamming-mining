// Tipos para el juego de minería

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number; // Precio en USDT
  hashrateContribution: number; // Hashrate base por unidad
  icon: string;
  color?: string; // Color para la UI (opcional)
}

export interface WalletBalance {
  coinId: string;
  amount: number;
  lastUpdated: number;
}

export interface Component {
  id: string;
  name: string;
  type: 'gpu' | 'asic' | 'psu' | 'cooling' | 'rack';
  cost: number; // Costo en USDT base
  hashrate: number; // Hashrate que provee
  powerConsumption: number; // Watts
  heatGeneration: number; // Calor generado por tick
  coolingEffect: number; // Efecto de enfriamiento (cooling only)
  priceMultiplier: number; // Multiplicador de precio por nivel
  unlockLevel: number; // Nivel requerido para desbloquear
  icon: string;
  color: string; // Color RGB para LEDs
}

export interface OwnedComponent {
  instanceId: string;
  componentId: string;
  level: number;
  isOverheating: boolean;
  position: { rack: number; slot: number };
}

export interface MiningAllocation {
  coinId: string;
  percentage: number; // 0-100
}

export interface GameState {
  // Economía
  wallet: WalletBalance[];
  usdtBalance: number;

  // Componentes
  ownedComponents: OwnedComponent[];
  totalRacks: number;
  unlockedRacks: number;

  // Stats globales
  totalHashrate: number;
  totalPowerConsumption: number;
  averageTemperature: number;
  coolingCapacity: number;

  // Asignación de minado
  miningAllocations: MiningAllocation[];

  // Progreso
  level: number;
  totalEarned: number;

  // Mercado
  coinPrices: Record<string, number>;

  // Tiempo
  lastUpdate: number;
  playTime: number;
}

export interface MiningTick {
  timestamp: number;
  earnings: Record<string, number>;
  powerUsed: number;
  heatGenerated: number;
  temperature: number;
}
