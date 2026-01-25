import { createClient } from '@supabase/supabase-js';

// 🛡️ CONFIGURACIÓN SEGURA:
// Usamos el prefijo VITE_ para que las variables sean accesibles en el navegador.
// Usamos ?.trim() para evitar errores si copiaste un espacio extra en Vercel.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Verificación de seguridad en consola (F12)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 ERROR DE CONEXIÓN: Faltan llaves VITE_ en el entorno de Vercel.");
}

// Inicializamos el cliente con la ANON_KEY (Nunca con Service Role)
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);