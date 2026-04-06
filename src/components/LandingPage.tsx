import { useEffect, useState } from 'react';
import { ArrowRight, Zap, Cpu, TrendingUp, Shield, Server, Wallet } from 'lucide-react';

interface CoinPrice {
  symbol: string;
  price: number;
  change: number;
}

export function LandingPage() {
  const [coinPrices, setCoinPrices] = useState<CoinPrice[]>([
    { symbol: 'BTC', price: 67234.52, change: 2.34 },
    { symbol: 'ETH', price: 3456.78, change: -1.23 },
    { symbol: 'SOL', price: 178.92, change: 5.67 },
    { symbol: 'XRP', price: 0.62, change: 0.89 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCoinPrices(prev => prev.map(coin => ({
        ...coin,
        price: coin.price * (1 + (Math.random() - 0.5) * 0.002),
        change: coin.change + (Math.random() - 0.5) * 0.1
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToDashboard = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#00ff88]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
                GAMMING MINING
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-400 hover:text-[#00ff88] transition-colors">Características</a>
              <a href="#stats" className="text-gray-400 hover:text-[#00ff88] transition-colors">Estadísticas</a>
              <button 
                onClick={scrollToDashboard}
                className="px-4 py-2 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00cc6a] transition-colors"
              >
                Jugar Ahora
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00ff88]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span>
            <span className="text-[#00ff88] text-sm font-medium">Nuevo: Sala de Minado 3D</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-[#00ff88] to-[#00cc6a] bg-clip-text text-transparent">
              El Simulador de Minería
            </span>
            <br />
            <span className="text-white">Más Avanzado</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Construye tu imperio de minería de criptomonedas. Gestiona GPUs, optimiza el enfriamiento 
            y maximiza tus ganancias en tiempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={scrollToDashboard}
              className="group px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/30 transition-all flex items-center justify-center gap-2"
            >
              Empezar a Minar Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-[#00ff88]/50 text-[#00ff88] font-semibold text-lg rounded-xl hover:bg-[#00ff88]/10 transition-all">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section id="stats" className="py-8 border-y border-[#00ff88]/20 bg-[#0d1117]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {coinPrices.map((coin) => (
              <div key={coin.symbol} className="text-center p-4 bg-[#161b22] rounded-xl border border-[#00ff88]/10">
                <div className="text-gray-400 text-sm mb-1">{coin.symbol}/USD</div>
                <div className="text-2xl font-bold text-white">
                  ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`text-sm ${coin.change >= 0 ? 'text-[#00ff88]' : 'text-red-500'}`}>
                  {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">Características </span>
              <span className="text-[#00ff88]">Principales</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para construir tu imperio de minería de criptomonedas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#161b22] rounded-2xl border border-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all group">
              <div className="w-14 h-14 bg-[#00ff88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors">
                <Server className="w-7 h-7 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Sala de Minado 3D</h3>
              <p className="text-gray-400">
                Visualiza tu granja de minería en 3D. Gestiona GPUs, racks y sistemas de enfriamiento en tiempo real.
              </p>
            </div>

            <div className="p-8 bg-[#161b22] rounded-2xl border border-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all group">
              <div className="w-14 h-14 bg-[#00ff88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors">
                <TrendingUp className="w-7 h-7 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Gestión de Energía</h3>
              <p className="text-gray-400">
                Optimiza el consumo eléctrico y balancea temperaturas para maximizar la eficiencia de tu granja.
              </p>
            </div>

            <div className="p-8 bg-[#161b22] rounded-2xl border border-[#00ff88]/20 hover:border-[#00ff88]/50 transition-all group">
              <div className="w-14 h-14 bg-[#00ff88]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors">
                <Cpu className="w-7 h-7 text-[#00ff88]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Mercado de Componentes</h3>
              <p className="text-gray-400">
                Compra y vende GPUs, PSUs y equipos de enfriamiento. Mejora tu granja con los últimos componentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0d1117] to-[#161b22]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#00ff88] mb-2">10K+</div>
              <div className="text-gray-400">Mineros Activos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00ff88] mb-2">$2.5M</div>
              <div className="text-gray-400">USDT Minados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00ff88] mb-2">50K+</div>
              <div className="text-gray-400">GPUs Instaladas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#00ff88] mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center p-12 bg-gradient-to-r from-[#00ff88]/10 to-[#00cc6a]/10 rounded-3xl border border-[#00ff88]/30">
          <h2 className="text-4xl font-bold mb-4 text-white">
            ¿Listo para empezar a minar?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Únete a miles de jugadores y construye tu imperio de minería hoy mismo.
            Es gratis y siempre lo será.
          </p>
          <button 
            onClick={scrollToDashboard}
            className="px-10 py-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-[#00ff88]/30 transition-all"
          >
            Comenzar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#00ff88]/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">GAMMING MINING</span>
            </div>
            
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors">
                <Wallet className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors">
                <Shield className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00ff88] transition-colors">
                <Server className="w-5 h-5" />
              </a>
            </div>
            
            <div className="text-gray-500 text-sm">
              Hecho por <span className="text-[#00ff88]">AppJeez</span> - Carlos Spegazzini Ezeiza
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
