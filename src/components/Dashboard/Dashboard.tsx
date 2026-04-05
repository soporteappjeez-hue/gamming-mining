import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Header } from './Header';
import { Shop } from './Shop';
import { MiningAllocation } from './MiningAllocation';
import { MiningVisualization3D } from './MiningVisualization3D';
import { Wallet } from './Wallet';

type Tab = 'shop' | 'allocation' | 'wallet';

export function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<Tab>('shop');
  const {
    processMiningTick,
    updateMarketPrices,
    miningAllocations,
    totalHashrate
  } = useGameStore();

  // Loop principal de minado
  const gameLoop = useCallback((timestamp: number) => {
    const state = useGameStore.getState();
    const lastUpdate = state.lastUpdate;
    const now = Date.now();
    const deltaMs = Math.min(now - lastUpdate, 1000); // Max 1 segundo por tick

    if (deltaMs > 0 && state.totalHashrate > 0) {
      processMiningTick(deltaMs);
    }

    requestAnimationFrame(gameLoop);
  }, [processMiningTick]);

  // Iniciar loops
  useEffect(() => {
    // Loop de minado
    const animationId = requestAnimationFrame(gameLoop);

    // Loop del mercado (actualiza precios cada 5 segundos)
    const marketInterval = setInterval(() => {
      updateMarketPrices();
    }, 5000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(marketInterval);
    };
  }, [gameLoop, updateMarketPrices]);

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col">
      {/* Header fijo */}
      <Header />

      {/* Contenido principal */}
      <div className="flex-1 flex">
        {/* Sidebar izquierdo - Tabs */}
        <div className="w-80 bg-cyber-panel border-r border-cyber-border flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-cyber-border">
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === 'shop'
                  ? 'bg-cyber-accent/10 text-cyber-accent border-b-2 border-cyber-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🛒 Tienda
            </button>
            <button
              onClick={() => setActiveTab('allocation')}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === 'allocation'
                  ? 'bg-cyber-accent/10 text-cyber-accent border-b-2 border-cyber-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ⛏️ Minado
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex-1 py-3 text-center transition-all ${
                activeTab === 'wallet'
                  ? 'bg-cyber-accent/10 text-cyber-accent border-b-2 border-cyber-accent'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              💰 Wallet
            </button>
          </div>

          {/* Contenido del tab */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'shop' && <Shop />}
            {activeTab === 'allocation' && <MiningAllocation />}
            {activeTab === 'wallet' && <Wallet />}
          </div>
        </div>

        {/* Área principal - Visualización */}
        <div className="flex-1 p-6">
          <MiningVisualization3D />

          {/* Instrucciones */}
          <div className="mt-6 bg-cyber-panel rounded-lg p-4 border border-cyber-border">
            <h3 className="text-lg font-bold text-cyber-accent mb-3">📖 Cómo Jugar</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-white font-bold mb-1">1. Compra Componentes</h4>
                <p className="text-gray-400">Ve a la tienda y compra GPUs o ASICs para empezar a minar.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">2. Asigna tu Hashrate</h4>
                <p className="text-gray-400">Decide qué criptomonedas minar y en qué porcentaje.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">3. Gestiona la Temperatura</h4>
                <p className="text-gray-400">Compra sistemas de refrigeración para evitar sobrecalentamiento.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">4. ¡Multiplica tus Ganancias!</h4>
                <p className="text-gray-400">Vende componentes o reinvierte para obtener más hashrate.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Necesito importar React para useState - FIX: ya está importado arriba
