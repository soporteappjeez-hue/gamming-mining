import { User, Wallet, Zap, Cpu, LogOut, TrendingUp, Shield } from 'lucide-react';
import { signOut, type Profile } from '../../lib/supabase';

interface UserPanelProps {
  profile: Profile | null;
  onLogout: () => void;
}

export function UserPanel({ profile, onLogout }: UserPanelProps) {
  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!profile) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-20">
          <div className="w-6 h-6 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header con avatar y nombre */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-black" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{profile.username}</h3>
          <p className="text-gray-400 text-sm">Nivel {profile.level}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0d1117] rounded-xl p-3 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-xs">Balance</span>
          </div>
          <p className="text-lg font-bold text-white truncate">
            ${profile.balance.toLocaleString()}
          </p>
          <p className="text-[#00ff88] text-xs">USDT</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-3 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-xs">Hashrate</span>
          </div>
          <p className="text-lg font-bold text-white truncate">
            {profile.hashrate.toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs">H/s</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-3 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-xs">Energía</span>
          </div>
          <p className="text-lg font-bold text-white">
            {profile.energy_limit}
          </p>
          <p className="text-gray-400 text-xs">Watts</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-3 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#00ff88]" />
            <span className="text-gray-400 text-xs">Estado</span>
          </div>
          <p className="text-lg font-bold text-[#00ff88]">Activo</p>
          <p className="text-gray-400 text-xs">Minando</p>
        </div>
      </div>

      {/* Info adicional */}
      <div className="bg-[#0d1117] rounded-xl p-3 border border-[#00ff88]/10">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#00ff88]" />
          <span className="text-white font-medium text-sm">Cuenta</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Miembro desde:</span>
            <span className="text-white">{new Date(profile.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Última actualización:</span>
            <span className="text-white">{new Date(profile.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Botón de logout */}
      <button
        onClick={handleLogout}
        className="w-full py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <LogOut className="w-4 h-4" />
        Desconectarse
      </button>
    </div>
  );
}
