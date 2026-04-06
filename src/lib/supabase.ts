import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para la base de datos
export interface Profile {
  id: string;
  username: string;
  balance: number;
  hashrate: number;
  level: number;
  energy_limit: number;
  created_at: string;
  updated_at: string;
}

export interface UserAsset {
  id: string;
  user_id: string;
  item_name: string;
  item_type: 'gpu' | 'psu' | 'cooling' | 'rack';
  quantity: number;
  created_at: string;
}

// Funciones de autenticación
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  });

  if (error) throw error;

  // Crear perfil inicial
  if (data.user) {
    await createProfile(data.user.id, username);
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Funciones de perfil
export async function createProfile(userId: string, username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        username,
        balance: 0,
        hashrate: 0,
        level: 1,
        energy_limit: 1000,
      },
    ]);

  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
}

// Funciones de assets/inventario
export async function getUserAssets(userId: string) {
  const { data, error } = await supabase
    .from('user_assets')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data as UserAsset[];
}

export async function addUserAsset(userId: string, itemName: string, itemType: UserAsset['item_type'], quantity: number = 1) {
  // Verificar si ya existe
  const { data: existing } = await supabase
    .from('user_assets')
    .select('*')
    .eq('user_id', userId)
    .eq('item_name', itemName)
    .single();

  if (existing) {
    // Actualizar cantidad
    const { data, error } = await supabase
      .from('user_assets')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id);

    if (error) throw error;
    return data;
  } else {
    // Crear nuevo
    const { data, error } = await supabase
      .from('user_assets')
      .insert([
        {
          user_id: userId,
          item_name: itemName,
          item_type: itemType,
          quantity,
        },
      ]);

    if (error) throw error;
    return data;
  }
}

// Guardar progreso completo
export async function saveGameProgress(
  userId: string,
  profile: Partial<Profile>,
  assets?: UserAsset[]
) {
  // Actualizar perfil
  await updateProfile(userId, profile);

  // Actualizar assets si se proporcionan
  if (assets) {
    for (const asset of assets) {
      await addUserAsset(userId, asset.item_name, asset.item_type, asset.quantity);
    }
  }
}
