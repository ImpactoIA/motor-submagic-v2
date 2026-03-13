// ==================================================================================
// 🧠 TITAN ENGINE — CONTEXTO DE USUARIO Y SISTEMA DE COSTOS
// getUserContext: lee experto + avatar + knowledge base desde Supabase
// calculateTitanCost: calcula créditos según el modo y parámetros
// ==================================================================================

import { ContextoUsuario } from './types.ts';
import { MEMORIA_SISTEMA } from './constants.ts';
import { ExpertAuthoritySystem } from '../ExpertAuthoritySystem.ts';

// ==================================================================================
// 👤 OBTENER CONTEXTO COMPLETO DEL USUARIO
// Lee Expert Profile + Avatar + Knowledge Base en paralelo
// ==================================================================================

export async function getUserContext(
  supabase: any,
  expertId: string,
  avatarId: string,
  kbId: string
): Promise<ContextoUsuario> {
  const promises = [
    expertId ? supabase.from('expert_profiles').select('*').eq('id', expertId).single() : null,
    avatarId ? supabase.from('avatars').select('*').eq('id', avatarId).single() : null,
    kbId ? supabase.from('documents').select('content').eq('id', kbId).single() : null
  ].filter(Boolean);

  const results = await Promise.allSettled(promises as Promise<any>[]);

  const contexto: any = {
    nicho: 'General',
    avatar_ideal: 'Audiencia general',
    dolor_principal: 'N/A',
    deseo_principal: 'N/A',
    competencia_analizada: [],
    hooks_exitosos: [],
    patrones_virales: MEMORIA_SISTEMA.patrones_virales
  };

  // ─── Expert Profile ─────────────────────────────────────
  if (results[0]?.status === 'fulfilled') {
    const expert = results[0].value?.data;
    if (expert) {
      contexto.nicho = expert.niche || contexto.nicho;
      contexto.posicionamiento = expert.positioning || '';
      contexto.diferenciadores = expert.differentiators || [];
      contexto.expertProfile = expert;

      // Validación OLIMPO
      const profileValidation = ExpertAuthoritySystem.validateProfileCompleteness(expert);
      contexto.expertProfileValidation = profileValidation;
      if (!profileValidation.isOlimpo) {
        console.warn(`[CONTEXTO] ⚠️ Perfil OLIMPO incompleto — Score: ${profileValidation.score}/100`);
        console.warn(`[CONTEXTO] 📋 Campos faltantes: ${profileValidation.missing.join(', ')}`);
      } else {
        console.log(`[CONTEXTO] ✅ Perfil OLIMPO completo — Score: ${profileValidation.score}/100`);
      }
    }
  }

  // ─── Avatar ──────────────────────────────────────────────
  if (results[1]?.status === 'fulfilled') {
    const avatar = results[1].value?.data;
    if (avatar) {
      contexto.avatar_ideal = avatar.name || contexto.avatar_ideal;
      contexto.dolor_principal = avatar.dolor || avatar.pain_points || contexto.dolor_principal;
      contexto.deseo_principal = avatar.cielo || avatar.desires || contexto.deseo_principal;
      contexto.avatar_situacion_actual = avatar.current_situation || null;
      contexto.avatar_objetivo_primario = avatar.primary_goal || null;
      contexto.avatar_pain_points = avatar.pain_points || null;
    }
  }

  // ─── Knowledge Base ──────────────────────────────────────
  if (results[2]?.status === 'fulfilled') {
    const kb = results[2].value?.data;
    if (kb?.content) {
      contexto.knowledge_base_content = kb.content.substring(0, 5000);
    }
  }

  return contexto;
}

// ==================================================================================
// 💰 SISTEMA DE COSTOS TITAN V3.0
// Calcula créditos a cobrar según modo, duración y cantidad de URLs
// ==================================================================================

export function calculateTitanCost(
  mode: string,
  inputContext: string,
  whisperMinutes: number,
  settings: any,
  videoDurationSeconds?: number
): number {

  // ─── Ingeniería Inversa / Autopsia Viral (Sistema Dinámico) ─
  if (mode === 'autopsia_viral' || mode === 'recreate') {
    console.log('[COSTOS V3] 💰 Calculando costo dinámico para Ingeniería Inversa...');

    const urlCount = settings?.urlCount || 1;
    let baseCostPerUrl = 15;

    if (videoDurationSeconds && videoDurationSeconds > 0) {
      if (videoDurationSeconds <= 90)        baseCostPerUrl = 15;
      else if (videoDurationSeconds <= 600)  baseCostPerUrl = 45;
      else                                    baseCostPerUrl = 60;
    } else if (whisperMinutes > 0) {
      const estimatedSeconds = whisperMinutes * 60;
      if (estimatedSeconds <= 90)        baseCostPerUrl = 15;
      else if (estimatedSeconds <= 600)  baseCostPerUrl = 45;
      else                                baseCostPerUrl = 60;
    } else if (settings?.contentType) {
      if (settings.contentType === 'masterclass') baseCostPerUrl = 60;
      else if (settings.contentType === 'long')   baseCostPerUrl = 45;
      else                                         baseCostPerUrl = 15;
    }

    // Tabla de precios multi-URL V2
    const PRECIO_TABLA: Record<number, number[]> = {
      20: [20, 35, 50],   // Reels
      55: [55, 80, 105],  // Video Largo
      75: [75, 105, 135], // Masterclass
    };

    // Normalizar a nuevos valores
    if (baseCostPerUrl === 15) baseCostPerUrl = 20;
    else if (baseCostPerUrl === 45) baseCostPerUrl = 55;
    else if (baseCostPerUrl === 60) baseCostPerUrl = 75;

    const tabla = PRECIO_TABLA[baseCostPerUrl] || PRECIO_TABLA[20];
    let totalCost: number;

    if (urlCount <= 1)      totalCost = tabla[0];
    else if (urlCount <= 3) totalCost = tabla[1];
    else                    totalCost = tabla[2];

    console.log(`[COSTOS V3] 📊 URLs: ${urlCount} | TOTAL: ${totalCost} créditos`);
    return totalCost;
  }

  // ─── Resto de modos ─────────────────────────────────────
  if (mode === 'ideas_rapidas') {
    if (inputContext.toLowerCase().includes("10 ideas") || settings?.quantity === 10) return 7;
    return 3;
  }
  if (mode === 'calendar_generator') {
    const days = settings?.duration || 7;
    if (days <= 3) return 2;
    if (days <= 7) return 5;
    return 10;
  }
  if (mode === 'generar_guion' || mode === 'generador_guiones') {
    const durationSetting = settings?.duration || settings?.durationId || '';
    const isMasterclass =
      durationSetting === 'masterclass' || durationSetting === 'long' ||
      inputContext.toLowerCase().includes("masterclass") ||
      inputContext.toLowerCase().includes("30 minutos");
    if (isMasterclass) return 30;
    return 5;
  }
  if (mode === 'juez_viral') return 2;
  if (['audit_avatar', 'auditar_avatar'].includes(mode)) return 2;
  if (['audit_expert', 'auditar_experto'].includes(mode)) return 2;
  if (['mentor_ia', 'mentor_estrategico'].includes(mode)) return 2;
  if (['chat_avatar', 'chat_expert'].includes(mode)) return 1;
  if (['transcribe', 'transcriptor'].includes(mode)) {
    if (whisperMinutes > 60) return 45;
    if (whisperMinutes > 30) return 15;
    return 5;
  }
  if (['clean', 'authority', 'carousel', 'shorts', 'structure'].includes(mode)) return 2;
  if (mode === 'copy_expert') return 5;
  return 1;
}