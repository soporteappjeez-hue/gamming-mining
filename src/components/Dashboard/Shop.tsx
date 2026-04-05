import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { COMPONENTS, getUnlockedComponents } from '../../data/components';
import { getComponentById } from '../../data/components';
import { Component } from '../../types';

type ShopCategory = 'all' | 'gpu' | 'asic' | 'psu' | 'cooling' | 'rack';

export function Shop() {
  const { buyComponent, sellComponent, usdtBalance, ownedComponents, level } = useGameStore();
  const [category, setCategory] = useState<ShopCategory>('all');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);

  const unlockedComponents = getUnlockedComponents(level);
  const filteredComponents = category === 'all'
    ? unlockedComponents
    : unlockedComponents.filter(c => c.type === category);

  const handleBuy = (component: Component) => {
    const success = buyComponent(component.id);
    if (success) {
      // Mostrar feedback visual
    }
  };

  const categories: { key: ShopCategory; label: string; icon: string }[] = [
    { key: 'all', label: 'Todos', icon: '📦' },
    { key: 'gpu', label: 'GPUs', icon: '🎮' },
    { key: 'asic', label: 'ASICs', icon: '⚡' },
    { key: 'psu', label: 'PSU', icon: '🔌' },
    { key: 'cooling', label: 'Cooling', icon: '❄️' },
    { key: 'rack', label: 'Racks', icon: '🗃' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header del Shop */}
      <div className="p-4 border-b border-cyber-border">
        <h2 className="text-lg font-bold text-cyber-accent mb-3">🏪 Tienda</h2>

        {/* Categorías */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-1 rounded text-sm transition-all ${
                category === cat.key
                  ? 'bg-cyber-accent/20 border border-cyber-accent text-cyber-accent'
                  : 'bg-cyber-dark border border-cyber-border text-gray-400 hover:text-white'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de componentes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredComponents.map(component => {
          const canAfford = usdtBalance >= component.cost;
          const isOwned = ownedComponents.some(c => c.componentId === component.id);

          return (
            <div
              key={component.id}
              onClick={() => setSelectedComponent(component)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedComponent?.id === component.id
                  ? 'border-cyber-accent bg-cyber-accent/10'
                  : canAfford
                  ? 'border-cyber-border bg-cyber-dark hover:border-cyber-accent/50'
                  : 'border-cyber-border/50 bg-cyber-dark/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${component.color}22` }}
                  >
                    {component.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{component.name}</h3>
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>⚡ {component.hashrate} H/s</span>
                      <span>🔌 {component.powerConsumption}W</span>
                      {component.coolingEffect > 0 && (
                        <span>❄️ {component.coolingEffect} cooling</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold ${canAfford ? 'text-cyber-accent' : 'text-cyber-danger'}`}>
                    ${component.cost.toLocaleString()}
                  </p>
                  {isOwned && (
                    <span className="text-xs text-cyber-secondary">✓ Comprado</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel de detalle */}
      {selectedComponent && (
        <div className="p-4 border-t border-cyber-border bg-cyber-dark">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-white">
              {selectedComponent.icon} {selectedComponent.name}
            </h3>
            <button
              onClick={() => setSelectedComponent(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-cyber-panel p-2 rounded">
              <span className="text-gray-400">Hashrate</span>
              <p className="text-cyber-accent font-bold">+{selectedComponent.hashrate} H/s</p>
            </div>
            <div className="bg-cyber-panel p-2 rounded">
              <span className="text-gray-400">Consumo</span>
              <p className="text-cyber-warning font-bold">{selectedComponent.powerConsumption}W</p>
            </div>
            <div className="bg-cyber-panel p-2 rounded">
              <span className="text-gray-400">Calor</span>
              <p className="text-cyber-danger font-bold">+{selectedComponent.heatGeneration}</p>
            </div>
            {selectedComponent.coolingEffect > 0 && (
              <div className="bg-cyber-panel p-2 rounded">
                <span className="text-gray-400">Cooling</span>
                <p className="text-cyber-secondary font-bold">+{selectedComponent.coolingEffect}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleBuy(selectedComponent)}
              disabled={usdtBalance < selectedComponent.cost}
              className={`flex-1 py-2 rounded font-bold transition-all ${
                usdtBalance >= selectedComponent.cost
                  ? 'bg-cyber-accent text-cyber-dark hover:bg-cyber-accent/80'
                  : 'bg-cyber-border text-gray-500 cursor-not-allowed'
              }`}
            >
              Comprar - ${selectedComponent.cost.toLocaleString()}
            </button>

            {/* Botón de vender si ya tiene */}
            {ownedComponents.some(c => c.componentId === selectedComponent.id) && (
              <button
                onClick={() => {
                  const owned = ownedComponents.find(c => c.componentId === selectedComponent.id);
                  if (owned) sellComponent(owned.instanceId);
                }}
                className="px-4 py-2 rounded border border-cyber-danger text-cyber-danger hover:bg-cyber-danger/10"
              >
                Vender ({selectedComponent.cost * 0.6.toFixed(0)})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
