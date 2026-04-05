/// <reference lib="webworker" />

// Web Worker para el loop de minado idle
// No bloquea el thread principal

interface MiningMessage {
  type: 'start' | 'stop' | 'updateAllocations' | 'tick';
  payload?: unknown;
}

interface MiningTickResult {
  type: 'tick';
  earnings: Record<string, number>;
  stats: {
    hashrate: number;
    powerConsumption: number;
    temperature: number;
    coolingCapacity: number;
  };
  deltaMs: number;
}

let isRunning = false;
let lastTimestamp = 0;
let animationFrameId: number | null = null;

const TICK_RATE = 1000 / 30; // 30 ticks por segundo para suavidad

function miningLoop(timestamp: number) {
  if (!isRunning) return;

  if (timestamp - lastTimestamp >= TICK_RATE) {
    const deltaMs = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    // Enviar mensaje de tick al main thread
    self.postMessage({ type: 'tick', deltaMs } as MiningTickResult);
  }

  animationFrameId = self.requestAnimationFrame(miningLoop);
}

self.onmessage = (e: MessageEvent<MiningMessage>) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'start':
      if (!isRunning) {
        isRunning = true;
        lastTimestamp = performance.now();
        animationFrameId = self.requestAnimationFrame(miningLoop);
      }
      break;

    case 'stop':
      isRunning = false;
      if (animationFrameId !== null) {
        self.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      break;

    case 'updateAllocations':
      // Se maneja en el main thread, solo acknowledge
      self.postMessage({ type: 'allocationsUpdated', payload });
      break;

    default:
      console.warn('Unknown message type:', type);
  }
};
