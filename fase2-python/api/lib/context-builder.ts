import { supabase } from './supabase';
import { algo } from './utils.js'; // ✅ Esto funciona

export const getViralContext = async (userId: string) => {
  // 1. Obtener IDs activos
  const { data: userProfile } = await supabase.from('profiles').select('active_expert_id, active_avatar_id').eq('id', userId).single();
  
  if (!userProfile) return "";

  let expertContext = "";
  let avatarContext = "";
  let marketContext = "";
  // 2. CONTEXTO DEL EXPERTO (Formulario Modo Dios)
  if (userProfile.active_expert_id) {
      const { data: expert } = await supabase.from('expert_profiles').select('*').eq('id', userProfile.active_expert_id).single();
      if (expert) {
          expertContext = `
            PERFIL ESTRATÉGICO DEL EXPERTO (YO):
            - Nicho: ${expert.niche}
            - PROMESA DE TRANSFORMACIÓN: ${expert.big_promise || ""}
            - PROBLEMA COSTOSO QUE RESUELVO: ${expert.expensive_problem || ""}
            - Historia de Origen: ${expert.origin_story || expert.story}
            - Mecanismo Único (Mi Vehículo): ${expert.unique_mechanism || "Método Propio"}
            - Autoridad/Prueba Social: ${expert.achievements} (${expert.authority_anchors})
            - Estilo de Contenido: ${expert.content_style || "General"}
            - Tono de Voz: ${expert.tone}
            - Vocabulario Propio: ${expert.key_vocabulary || ""}
            - Valores: ${expert.values}
            - Enemigo Común (Anti-Nicho): ${expert.anti_niche}
            - CLIENTE PESADILLA (NO ATRAER): ${expert.nightmare_client || ""}
            - Oferta: ${expert.offer} (${expert.pricing_model})
            - Pilares de Contenido: ${expert.pillars}
          `;

          // Si hay inteligencia de mercado guardada
          if (expert.market_analysis) {
              const m = expert.market_analysis;
              // Manejo seguro de arrays por si vienen como strings
              const safeJoin = (arr: any) => Array.isArray(arr) ? arr.join(', ') : arr;
              
              marketContext = `
                INTELIGENCIA DE MERCADO (IA):
                - Tendencias Actuales: ${safeJoin(m.trends)}
                - Oportunidades (Gaps): ${safeJoin(m.gap_analysis)}
                - Ángulos Sugeridos: ${safeJoin(m.content_angles)}
                - Consejo Estratégico: ${m.strategic_advice}
              `;
          }
      }
  }

  // 3. CONTEXTO DEL AVATAR (Laboratorio de Empatía)
  if (userProfile.active_avatar_id) {
      const { data: avatar } = await supabase.from('saved_avatars').select('*').eq('id', userProfile.active_avatar_id).single();
      if (avatar) {
          avatarContext = `
            AVATAR OBJETIVO (PERFIL PSICOLÓGICO PROFUNDO):
            - Nombre Clave: ${avatar.name} (${avatar.age_range})
            - DOLOR PRIMARIO: ${avatar.primary_pain}
            
            DINÁMICA DE CAMBIO:
            - Infierno (Situación Actual): ${avatar.hell_situation}
            - Cielo (Situación Deseada): ${avatar.heaven_situation}
            - Miedo Oculto: ${avatar.hidden_fear}
            - Creencia Limitante: ${avatar.limiting_belief}
            - Objeción Central: ${avatar.central_objection}
            
            ESTADO DE CONCIENCIA:
            - Nivel: ${avatar.awareness_level}
            - Gatillo (Trigger): ${avatar.trigger_event}
            - Vehículo Pasado (Lo que falló): ${avatar.past_vehicle}
          `;
      }
  }

  // 4. RETORNO MAESTRO
  return `
    ==================================================
    CONTEXTO ESTRATÉGICO DEL USUARIO (BASE DE CONOCIMIENTO)
    ==================================================
    ${expertContext}
    
    ${marketContext}
    
    ${avatarContext}
    ==================================================
    INSTRUCCIÓN DEL SISTEMA:
    Actúa como mi Consultor de Contenidos. 
    Usa estrictamente la información de arriba.
    - Habla con mi Tono de Voz y usa mi Vocabulario.
    - Ataca a mi Enemigo Común.
    - Rechaza al Cliente Pesadilla.
    - Dirígete al AVATAR resolviendo su Dolor Primario y llevándolo de su Infierno a su Cielo.
    - Usa mi Mecanismo Único como la solución.
  `;
};