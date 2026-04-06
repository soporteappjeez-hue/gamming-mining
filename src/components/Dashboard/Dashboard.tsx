import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Wallet } from './Wallet';
import { MiningVisualization3D } from './MiningVisualization3D';
import { MiningAllocation } from './MiningAllocation';
import { Shop } from './Shop';
import { UserPanel } from './UserPanel';
import { supabase, getCurrentUser } from '../../lib/supabase';

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de Usuario - Lado izquierdo */}
          <div className="lg:col-span-1">
            <UserPanel onLogout={handleLogout} />
          </div>

          {/* Contenido principal - Centro */}
          <div className="lg:col-span-2 space-y-6">
            <Wallet />
            <MiningVisualization3D />
            <MiningAllocation />
          </div>

          {/* Tienda - Lado derecho */}
          <div className="lg:col-span-1">
            <Shop />
          </div>
        </div>
      </main>
    </div>
  );
}

