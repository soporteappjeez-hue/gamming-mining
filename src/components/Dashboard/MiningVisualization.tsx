import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { useGameStore } from '../../store/gameStore';
import { getComponentById } from '../../data/components';

class MiningScene extends Phaser.Scene {
  ownedComponents: any[] = [];
  racks: Phaser.GameObjects.Container[] = [];
  ledLights: Map<string, Phaser.GameObjects.Rectangle> = new Map();

  constructor() {
    super({ key: 'MiningScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Fondo con gradiente
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x0a0a0f);
    bg.setDepth(0);

    // Grid lines para efecto tech
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x1e1e2e, 0.3);
    for (let x = 0; x < width; x += 40) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, height);
    }
    for (let y = 0; y < height; y += 40) {
      graphics.moveTo(0, y);
      graphics.lineTo(width, y);
    }
    graphics.strokePath();
    graphics.setDepth(1);

    // Crear racks
    this.createRacks();
  }

  createRacks() {
    const { width, height } = this.scale;
    const rackWidth = 120;
    const rackHeight = 300;
    const rackSpacing = 140;
    const startX = (width - 3 * rackSpacing) / 2 + rackSpacing / 2;
    const rackY = height / 2 + 30;

    this.racks.forEach(r => r.destroy());
    this.racks = [];

    for (let i = 0; i < 3; i++) {
      const rackX = startX + i * rackSpacing;
      const rack = this.createRack(rackX, rackY, rackWidth, rackHeight, i + 1);
      this.racks.push(rack);
    }
  }

  createRack(x: number, y: number, width: number, height: number, rackNumber: number) {
    const container = this.add.container(x, y);

    // Marco del rack
    const frame = this.add.rectangle(0, 0, width, height, 0x12121a, 0.9);
    frame.setStrokeStyle(2, 0x1e1e2e);
    container.add(frame);

    // Barra superior con número
    const header = this.add.rectangle(0, -height / 2 + 15, width, 30, 0x1e1e2e);
    container.add(header);

    const label = this.add.text(0, -height / 2 + 15, `RACK ${rackNumber}`, {
      fontSize: '12px',
      color: '#666',
    }).setOrigin(0.5);
    container.add(label);

    // Slots para componentes (8 slots por rack)
    const slotHeight = (height - 60) / 8;
    const slots: Phaser.GameObjects.Rectangle[] = [];

    for (let i = 0; i < 8; i++) {
      const slotY = -height / 2 + 45 + i * slotHeight + slotHeight / 2;
      const slot = this.add.rectangle(0, slotY, width - 16, slotHeight - 4, 0x0a0a0f, 0.5);
      slot.setStrokeStyle(1, 0x2a2a3a);
      container.add(slot);
      slots.push(slot);
    }

    container.setData('slots', slots);
    container.setData('rackNumber', rackNumber);

    return container;
  }

  updateComponents(ownedComponents: any[]) {
    const { width, height } = this.scale;
    const rackWidth = 120;
    const rackSpacing = 140;
    const startX = (width - 3 * rackSpacing) / 2 + rackSpacing / 2;
    const rackY = height / 2 + 30;

    // Limpiar componentes anteriores (excepto racks)
    this.children.list
      .filter((obj: any) => obj.getData?.('isComponent'))
      .forEach((obj: any) => obj.destroy());

    // Colocar componentes en racks
    ownedComponents.forEach((owned, index) => {
      const component = getComponentById(owned.componentId);
      if (!component) return;

      const rackIndex = Math.floor(index / 8);
      const slotIndex = index % 8;

      if (rackIndex >= 3) return; // Solo 3 racks visibles

      const rackX = startX + rackIndex * rackSpacing;
      const rackHeight = 300;
      const slotHeight = (rackHeight - 60) / 8;
      const slotY = -rackHeight / 2 + 45 + slotIndex * slotHeight + slotHeight / 2;

      // GPU o ASIC
      if (component.type === 'gpu' || component.type === 'asic') {
        this.createGPU(rackX, slotY, component, owned);
      }
    });
  }

  createGPU(x: number, y: number, component: any, owned: any) {
    const isOverheating = owned.isOverheating;
    const ledColor = isOverheating ? 0xff3366 : parseInt(component.color.replace('rgb(', '').replace(')', '').split(',').map(n => parseInt(n.trim())).reduce((acc, n, i) => i === 0 ? acc + (n << 16) : i === 1 ? acc + (n << 8) : acc + n, 0));

    // PCB de la GPU
    const pcb = this.add.rectangle(x, y, 100, 25, 0x1a3d1a);
    pcb.setData('isComponent', true);
    pcb.setStrokeStyle(1, 0x2a5a2a);

    // Chip de la GPU
    const chip = this.add.rectangle(x - 30, y, 20, 15, 0x333333);
    chip.setData('isComponent', true);

    // Memorias
    for (let i = 0; i < 4; i++) {
      const mem = this.add.rectangle(x + 15 + i * 12, y, 8, 12, 0x111111);
      mem.setData('isComponent', true);
    }

    // Fan (ventilador)
    const fan = this.add.circle(x + 25, y, 12, 0x222222);
    fan.setData('isComponent', true);
    fan.setStrokeStyle(2, 0x444444);

    // Línea del fan (para efecto de rotación)
    const fanLine = this.add.rectangle(x + 25, y, 2, 20, 0x666666);
    fanLine.setData('isComponent', true);
    fanLine.setBlendMode(Phaser.BlendModes.ADD);

    // LED indicador
    const led = this.add.rectangle(x + 45, y - 10, 4, 4, ledColor);
    led.setData('isComponent', true);
    if (isOverheating) {
      // Efecto de parpadeo para sobrecalentamiento
      this.tweens.add({
        targets: led,
        alpha: { from: 1, to: 0.3 },
        duration: 200,
        yoyo: true,
        repeat: -1,
      });
    } else {
      led.setBlendMode(Phaser.BlendModes.ADD);
    }

    this.ledLights.set(owned.instanceId, led);
  }
}

export function MiningVisualization() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { ownedComponents, averageTemperature, totalHashrate } = useGameStore();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 400,
      backgroundColor: '#0a0a0f',
      scene: MiningScene,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // Actualizar componentes cuando cambien
  useEffect(() => {
    if (gameRef.current) {
      const scene = gameRef.current.scene.getScene('MiningScene') as MiningScene;
      if (scene) {
        scene.updateComponents(ownedComponents);
      }
    }
  }, [ownedComponents]);

  // Efecto de temperatura en el fondo
  const getTempColor = () => {
    if (averageTemperature > 80) return 'from-red-900/30';
    if (averageTemperature > 60) return 'from-orange-900/20';
    return 'from-transparent';
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`w-full h-[400px] rounded-lg overflow-hidden bg-gradient-to-b ${getTempColor()} to-transparent`}
      />

      {/* Overlay con stats */}
      <div className="absolute top-4 left-4 bg-cyber-panel/80 backdrop-blur-sm rounded-lg p-3 border border-cyber-border">
        <h3 className="text-sm font-bold text-cyber-accent mb-2">🖥️ Sala de Minado</h3>
        <div className="text-xs space-y-1 text-gray-400">
          <p>Equipos: {ownedComponents.length}</p>
          <p>Hashrate: {totalHashrate.toFixed(0)} H/s</p>
        </div>
      </div>

      {/* Leyenda de temperatura */}
      <div className="absolute bottom-4 right-4 bg-cyber-panel/80 backdrop-blur-sm rounded-lg p-3 border border-cyber-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyber-accent" />
          <span className="text-xs text-gray-400">Óptimo</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-cyber-warning animate-pulse" />
          <span className="text-xs text-gray-400">Caliente</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-cyber-danger animate-pulse" />
          <span className="text-xs text-gray-400">Sobrecalentado</span>
        </div>
      </div>
    </div>
  );
}
