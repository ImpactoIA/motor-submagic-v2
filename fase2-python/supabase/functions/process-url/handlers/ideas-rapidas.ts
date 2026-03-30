// ==================================================================================
// 💡 HANDLER: IDEAS RÁPIDAS
// Modo individual (1 plataforma) y multiplataforma (5 plataformas simultáneas)
// Exporta: handleIdeasRapidas
// ==================================================================================

import { ejecutarIdeasRapidas, ejecutarUnaIdeaMultiplatforma } from '../prompts/ideas-rapidas.ts';
import { ContextoUsuario } from '../lib/types.ts';
import { logger, createError, sanitizeContext } from '../lib/logger.ts';

export async function handleIdeasRapidas(
  body: any,
  settings: any,
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('🚀 [HANDLER] Ideas Rápidas Elite V2.0...');

  // ─── Extraer parámetros ────────────────────────────────
  const topic    = body.topic || body.userInput || processedContext || "Ideas Virales";
  const quantity = settings?.quantity || 3;
  const platform = settings?.platform || 'TikTok';

  // ─── Validación ───────────────────────────────────────
  if (!topic || topic === "Ideas Virales") {
    if (!processedContext) throw new Error("⚠️ Debes ingresar un tema para generar ideas.");
  }

  // ─── Nicho manual del usuario ─────────────────────────
  if (settings?.nicho && settings.nicho !== 'General') {
    (userContext as any).nicho = settings.nicho;
    console.log(`[IDEAS] 🎯 Nicho manual activo: "${settings.nicho}"`);
  }

  const isMultiplatform = settings?.multiplatform === true;

  // ==================================================================================
  // 🌐 MODO MULTIPLATAFORMA: 1 request por idea (anti-truncado)
  // ==================================================================================
  if (isMultiplatform) {
    console.log(`[MULTI] 🌐 Generando ${quantity} ideas × 5 plataformas`);
    const objective = settings?.objective || 'viralidad';
    const timing    = settings?.timing_context || 'evergreen';
    const ideasArray: any[] = [];
    let totalTokens = 0;

    for (let i = 0; i < quantity; i++) {
      console.log(`[MULTI] 🔄 Idea ${i + 1} de ${quantity}...`);
      const { idea, tokens } = await ejecutarUnaIdeaMultiplatforma(
        topic, i, quantity, objective, timing, userContext, openai, settings
      );
      if (idea && Object.keys(idea).length > 0) ideasArray.push(idea);
      totalTokens += tokens;
    }

    const result = {
      ideas: ideasArray,
      analisis_estrategico: {
        objetivo_dominante: settings?.objective || 'viralidad',
        lente_aplicado: settings?.creative_lens || 'auto',
        sector_detectado: ideasArray[0]?.tca?.sector_utilizado || 'Desarrollo Personal',
        expansion_realizada: `${quantity} ideas multiplataforma generadas secuencialmente`,
        razonamiento: `${ideasArray.length} ideas con 5 adaptaciones cada una`,
        advertencias: ['Adapta subtítulos por plataforma antes de publicar'],
        oportunidades: ['Publica en orden estratégico para maximizar algoritmos cruzados']
      },
      mejor_idea_recomendada: {
        idea_id: 1,
        razon: 'Primera idea generada con mayor fuerza narrativa',
        plataforma_prioritaria: 'TikTok — mayor velocidad de distribución inicial',
        plan_rapido: '1. Graba el video base\n2. Adapta captions por plataforma\n3. Publica en orden del plan_produccion'
      },
      insights_estrategicos: {
        tendencia_detectada: 'Contenido multiplataforma con identidad experta',
        brecha_mercado: 'Pocos creadores adaptan su mensaje al ADN de cada algoritmo',
        advertencia: 'No publiques el mismo caption en todas las redes',
        siguiente_paso_logico: 'Crear guion completo de la idea top con el Generador V600'
      }
    };
    return { result, tokensUsed: totalTokens };
  }

  // ==================================================================================
  // 🎯 MODO INDIVIDUAL: flujo clásico
  // ==================================================================================
  const res = await ejecutarIdeasRapidas(topic, quantity, platform, userContext, openai, settings);
  return { result: res.data, tokensUsed: res.tokens };
}