import { useEffect, useState } from 'react';
import { User, Wallet, Zap, Cpu, LogOut, TrendingUp, Shield } from 'lucide-react';
import { supabase, signOut, getProfile, type Profile } from '../../lib/supabase';

interface UserPanelProps {
  onLogout: () => void;
}

export function UserPanel({ onLogout }: UserPanelProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        const profileData = await getProfile(user.data.user.id);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#161b22] rounded-2xl border border-[#00ff88]/20 p-6">
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-[#161b22] rounded-2xl border border-[#00ff88]/20 p-6">
        <p className="text-gray-400 text-center">No se pudo cargar el perfil</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] rounded-2xl border border-[#00ff88]/20 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-xl flex items-center justify-center">
          <User className="w-8 h-8 text-black" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{profile.username}</h3>
          <p className="text-gray-400">Nivel {profile.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Balance</span>
          </div>
          <p className="text-2xl font-bold text-white">${profile.balance.toLocaleString()}</p>
          <p className="text-[#00ff88] text-sm">USDT</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Hashrate</span>
          </div>
          <p className="text-2xl font-bold text-white">{profile.hashrate.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">H/s</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Energía</span>
          </div>
          <p className="text-2xl font-bold text-white">{profile.energy_limit}</p>
          <p className="text-gray-400 text-sm">Watts</p>
        </div>

        <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#00ff88]" />
            <span className="text-gray-400 text-sm">Estado</span>
          </div>
          <p className="text-2xl font-bold text-[#00ff88]">Activo</p>
          <p className="text-gray-400 text-sm">Minando</p>
        </div>
      </div>

      <div className="bg-[#0d1117] rounded-xl p-4 border border-[#00ff88]/10 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-[#00ff88]" />
          <span className="text-white font-medium">Información de la cuenta</span>
        </div>
        <div className="space-y-2 text-sm">
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

      <button
        onClick={handleLogout}
        className="w-full py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Desconectarse
      </button>
    </div>
  );
}
