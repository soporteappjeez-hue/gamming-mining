# ⛏️ Gamming Mining - Cloud Mining Idle Game

Un juego de simulación de minería en la nube estilo idle/tycoon, inspirado en RollerCoin y plataformas como Genesis Mining.

![Cyberpunk Theme](https://img.shields.io/badge/Theme-Cyberpunk-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Phaser](https://img.shields.io/badge/Phaser-3-FF6B35?style=flat-square)

## 🎮 Características

### Mecánicas Principales
- **30 Criptomonedas** para minar (BTC, ETH, SOL, ADA, XRP, DOT, y más)
- **Sistema de Tienda** con GPUs, ASICs, fuentes de alimentación y sistemas de refrigeración
- **Economía Realista** con interés compuesto y balanceo de precios
- **Progresión Visual** - los componentes aparecen en la sala de minería

### Visualización
- **Sala de Minado 3D** con React Three Fiber (isométrica)
- **LEDs RGB** que indican estado (verde=óptimo, rojo=sobrecalentamiento)
- **Efecto Bloom** post-processing para glow neón
- **Partículas de calor** flotantes
- **Estilo Cyberpunk/High-Tech** con tema oscuro y acentos neón

### Sistema de Juego
- **Idle Loop** - el minado corre en segundo plano
- **Mercado Fluctuante** - precios simulados que cambian cada 5 segundos
- **Gestión Térmica** - equilibrio entre hashrate y refrigeración
- **Sistema de Niveles** - desbloquea componentes más potentes

## 🚀 Instalación

```bash
# Clonar o entrar al directorio
cd "gamming mining"

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
gamming mining/
├── src/
│   ├── components/
│   │   └── Dashboard/
│   │       ├── Header.tsx      # Barra superior con stats
│   │       ├── Shop.tsx        # Tienda de componentes
│   │       ├── MiningAllocation.tsx  # Asignación de hashrate
│   │       ├── MiningVisualization.tsx  # Visualización Phaser
│   │       ├── Wallet.tsx      # Billetera de criptomonedas
│   │       └── Dashboard.tsx   # Componente principal
│   ├── store/
│   │   └── gameStore.ts        # Estado global (Zustand)
│   ├── data/
│   │   ├── coins.ts            # 30 criptomonedas
│   │   └── components.ts       # Componentes de minería
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── workers/
│   │   └── mineWorker.ts        # Web Worker para idle loop
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # Tailwind + estilos cyberpunk
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## 🧮 Fórmulas del Juego

### Cálculo de Hashrate
```
hashrate_total = Σ (hashrate_componente × nivel × multiplicador)
```

### Earnings por Tick
```
earnings = (hashrate × alloc% × factor_moneda × eficiencia × delta_tiempo) / precio_moneda
```

### Temperatura
```
temperatura = max(25, min(120, 25 + (calor_generado - enfriamiento) × 0.1))
```

## 🎯 Cómo Jugar

1. **Empieza con 100 USDT** y una asignación inicial de minado
2. **Compra GPUs** en la tienda para generar hashrate
3. **Asigna tu hashrate** entre las criptomonedas que prefieras
4. **Gestiona la temperatura** comprando sistemas de refrigeración
5. **Reinvierte tus ganancias** en más y mejores componentes
6. **Sube de nivel** para desbloquear equipos más potentes

## 🛠️ Stack Tecnológico

- **React 18** - UI
- **TypeScript** - Tipado estático
- **Vite** - Bundler
- **Zustand** - State management
- **Three.js + React Three Fiber** - Motor 3D
- **@react-three/drei** - Utilidades 3D
- **@react-three/postprocessing** - Efectos (Bloom)
- **Tailwind CSS** - Estilos
- **Web Workers** - Idle loop optimizado

## 📝 Licencia

MIT - Libre para usar y modificar.

---

**¡Feliz minería!** ⛏️🚀
