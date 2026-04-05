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
