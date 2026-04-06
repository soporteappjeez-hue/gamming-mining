import { Coin } from '../types';

export const CRYPTOCURRENCIES: Coin[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 67500, hashrateContribution: 100, icon: '₿' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 3450, hashrateContribution: 80, icon: 'Ξ' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', price: 1.00, hashrateContribution: 0.1, icon: '₮' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', price: 580, hashrateContribution: 50, icon: '◈' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', price: 145, hashrateContribution: 45, icon: '◎' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 0.58, hashrateContribution: 25, icon: '₳' },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP', price: 0.62, hashrateContribution: 25, icon: '✕' },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: 7.80, hashrateContribution: 30, icon: '●' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 0.12, hashrateContribution: 15, icon: 'Ð' },
  { id: 'avax', name: 'Avalanche', symbol: 'AVAX', price: 38, hashrateContribution: 35, icon: '▲' },
  { id: 'shib', name: 'Shiba Inu', symbol: 'SHIB', price: 0.000025, hashrateContribution: 5, icon: '🐕' },
  { id: 'link', name: 'Chainlink', symbol: 'LINK', price: 14.50, hashrateContribution: 40, icon: '⬡' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', price: 0.85, hashrateContribution: 20, icon: '⬢' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', price: 85, hashrateContribution: 60, icon: 'Ł' },
  { id: 'uni', name: 'Uniswap', symbol: 'UNI', price: 9.20, hashrateContribution: 30, icon: '🦄' },
  { id: 'atom', name: 'Cosmos', symbol: 'ATOM', price: 9.50, hashrateContribution: 28, icon: '⚛' },
  { id: 'xlm', name: 'Stellar', symbol: 'XLM', price: 0.12, hashrateContribution: 22, icon: '✧' },
  { id: 'bch', name: 'Bitcoin Cash', symbol: 'BCH', price: 480, hashrateContribution: 55, icon: '฿' },
  { id: 'etc', name: 'Ethereum Classic', symbol: 'ETC', price: 26, hashrateContribution: 35, icon: 'Ξ' },
  { id: 'apt', name: 'Aptos', symbol: 'APT', price: 9.80, hashrateContribution: 32, icon: '◆' },
  { id: 'fil', name: 'Filecoin', symbol: 'FIL', price: 5.80, hashrateContribution: 28, icon: '🔒' },
  { id: 'arb', name: 'Arbitrum', symbol: 'ARB', price: 1.15, hashrateContribution: 24, icon: '◇' },
  { id: 'op', name: 'Optimism', symbol: 'OP', price: 2.60, hashrateContribution: 24, icon: '⊕' },
  { id: 'near', name: 'NEAR Protocol', symbol: 'NEAR', price: 5.20, hashrateContribution: 26, icon: '◉' },
  { id: 'inj', name: 'Injective', symbol: 'INJ', price: 26, hashrateContribution: 30, icon: '◈' },
  { id: 'ftm', name: 'Fantom', symbol: 'FTM', price: 0.72, hashrateContribution: 22, icon: '👻' },
  { id: 'algo', name: 'Algorand', symbol: 'ALGO', price: 0.22, hashrateContribution: 18, icon: '🔷' },
  { id: 'sand', name: 'The Sandbox', symbol: 'SAND', price: 0.45, hashrateContribution: 15, icon: '🏖' },
  { id: 'mana', name: 'Decentraland', symbol: 'MANA', price: 0.42, hashrateContribution: 15, icon: '🗺' },
  { id: 'gala', name: 'Gala', symbol: 'GALA', price: 0.035, hashrateContribution: 12, icon: '🎭' },
];

export const getCoinById = (id: string): Coin | undefined =>
  CRYPTOCURRENCIES.find(c => c.id === id);

// Equipos de minería ampliados
export interface MiningComponent {
  id: string;
  name: string;
  type: 'gpu' | 'cpu' | 'asic' | 'psu' | 'cooling' | 'rack';
  hashrate: number; // H/s
  power: number; // Watts
  cooling?: number; // Cooling capacity
  price: number; // USD
  description: string;
}

export const MINING_COMPONENTS: MiningComponent[] = [
  // GPUs
  {
    id: 'rtx3060',
    name: 'NVIDIA RTX 3060',
    type: 'gpu',
    hashrate: 50,
    power: 170,
    price: 350,
    description: 'GPU de gama media con excelente rendimiento energético'
  },
  {
    id: 'rtx3070',
    name: 'NVIDIA RTX 3070',
    type: 'gpu',
    hashrate: 80,
    power: 220,
    price: 550,
    description: 'GPU potente para minería profesional'
  },
  {
    id: 'rtx3080',
    name: 'NVIDIA RTX 3080',
    type: 'gpu',
    hashrate: 120,
    power: 320,
    price: 850,
    description: 'Alta performance para minado intensivo'
  },
  {
    id: 'rtx3090',
    name: 'NVIDIA RTX 3090',
    type: 'gpu',
    hashrate: 180,
    power: 450,
    price: 1500,
    description: 'La mejor GPU para minería extrema'
  },
  {
    id: 'rx580',
    name: 'AMD RX 580',
    type: 'gpu',
    hashrate: 30,
    power: 185,
    price: 200,
    description: 'GPU económica para iniciarse en minería'
  },
  {
    id: 'rx6700',
    name: 'AMD RX 6700 XT',
    type: 'gpu',
    hashrate: 65,
    power: 230,
    price: 480,
    description: 'Buen balance entre precio y rendimiento'
  },
  // CPUs
  {
    id: 'ryzen5',
    name: 'AMD Ryzen 5 5600X',
    type: 'cpu',
    hashrate: 5,
    power: 65,
    price: 180,
    description: 'CPU para minado básico de altcoins'
  },
  {
    id: 'ryzen9',
    name: 'AMD Ryzen 9 5950X',
    type: 'cpu',
    hashrate: 15,
    power: 105,
    price: 550,
    description: 'CPU de alta gama para minado paralelo'
  },
  {
    id: 'i9',
    name: 'Intel Core i9-12900K',
    type: 'cpu',
    hashrate: 12,
    power: 125,
    price: 600,
    description: 'Procesador potente para múltiples tareas'
  },
  // ASICs
  {
    id: 'antminers9',
    name: 'Antminer S9',
    type: 'asic',
    hashrate: 13500,
    power: 1323,
    price: 800,
    description: 'ASIC clásico para Bitcoin'
  },
  {
    id: 'antminers19',
    name: 'Antminer S19 Pro',
    type: 'asic',
    hashrate: 110000,
    power: 3250,
    price: 4500,
    description: 'ASIC profesional de última generación'
  },
  {
    id: 'whatsminerm30',
    name: 'Whatsminer M30S++',
    type: 'asic',
    hashrate: 112000,
    power: 3472,
    price: 4800,
    description: 'Máxima eficiencia para granjas industriales'
  },
  // PSUs
  {
    id: 'psu500',
    name: 'PSU 500W 80 Plus',
    type: 'psu',
    hashrate: 0,
    power: 0,
    price: 60,
    description: 'Fuente básica para rigs pequeños'
  },
  {
    id: 'psu750',
    name: 'PSU 750W 80 Plus Gold',
    type: 'psu',
    hashrate: 0,
    power: 0,
    price: 120,
    description: 'Fuente eficiente para rigs medianos'
  },
  {
    id: 'psu1000',
    name: 'PSU 1000W 80 Plus Platinum',
    type: 'psu',
    hashrate: 0,
    power: 0,
    price: 250,
    description: 'Fuente premium para múltiples GPUs'
  },
  {
    id: 'psu1600',
    name: 'PSU 1600W Mining Edition',
    type: 'psu',
    hashrate: 0,
    power: 0,
    price: 400,
    description: 'Fuente industrial para granjas de minería'
  },
  // Cooling
  {
    id: 'fanbasic',
    name: 'Ventiladores Base 120mm',
    type: 'cooling',
    hashrate: 0,
    power: 15,
    cooling: 50,
    price: 40,
    description: 'Ventilación básica para rigs'
  },
  {
    id: 'fanpro',
    name: 'Sistema Cooling Pro',
    type: 'cooling',
    hashrate: 0,
    power: 45,
    cooling: 150,
    price: 120,
    description: 'Refrigeración avanzada para alta carga'
  },
  {
    id: 'liquid',
    name: 'Refrigeración Líquida',
    type: 'cooling',
    hashrate: 0,
    power: 80,
    cooling: 300,
    price: 280,
    description: 'Sistema líquido para temperaturas extremas'
  },
  // Racks
  {
    id: 'rackbasic',
    name: 'Rack Básico 4U',
    type: 'rack',
    hashrate: 0,
    power: 0,
    price: 150,
    description: 'Estructura simple para 4 GPUs'
  },
  {
    id: 'rackpro',
    name: 'Rack Profesional 8U',
    type: 'rack',
    hashrate: 0,
    power: 0,
    price: 350,
    description: 'Rack para hasta 8 GPUs con gestión de cables'
  },
  {
    id: 'rackindustrial',
    name: 'Rack Industrial 12U',
    type: 'rack',
    hashrate: 0,
    power: 0,
    price: 800,
    description: 'Rack industrial con sistema de monitoreo'
  },
];

// Cálculo de ganancias
// 1 H/s genera $1 en 30 días (aproximadamente $0.0333 por día)
export const BASE_EARNING_PER_HASH_PER_DAY = 0.033333;

export function calculateDailyEarning(hashrate: number, coinMultiplier: number = 1): number {
  // La ganancia se ajusta según el multiplicador de la moneda
  return hashrate * BASE_EARNING_PER_HASH_PER_DAY * coinMultiplier;
}

export function calculateEarningForPeriod(hashrate: number, days: number, coinMultiplier: number = 1): number {
  return calculateDailyEarning(hashrate, coinMultiplier) * days;
}
