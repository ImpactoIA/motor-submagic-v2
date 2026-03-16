// ==================================================================================
// ✍️ HANDLER: SCRIPT GENERATOR (Generador de Guiones V700)
// Modos: idea corta | texto largo | imagen
// Con pre-análisis P1, análisis estructura P6, y sistema TCA
// ==================================================================================

import { ejecutarGeneradorGuiones, preAnalizarInput, analizarEstructuraImplicita, ejecutarSistemaTCA, guardarFeedbackTCA } from '../prompts/script-generator.ts';
import { analizarImagenEstrategica } from '../prompts/vision.ts';
import { ContextoUsuario } from '../lib/types.ts';
import { logger, createError, sanitizeContext } from '../lib/logger.ts';

export async function handleScriptGenerator(
  body: any,
  settings: any,
  processedContext: string,
  userContext: ContextoUsuario,
  openai: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('[HANDLER] ✨ Generar Guion V700 (Texto + Visión + Pre-Análisis)');

  let temaUsuario = "";
  let modoGeneracion: 'idea' | 'texto' | 'imagen' = 'idea';
  let preAnalisis: any = null;

  // ══════════════════════════════════════════════════════════
  // RUTA A: IMAGEN
  // ══════════════════════════════════════════════════════════
  if (body.image) {
    console.log('[MOTOR V700] 📸 Imagen detectada — activando análisis visual...');
    modoGeneracion = 'imagen';

    try {
      const conceptoVisual = await analizarImagenEstrategica(body.image, openai, {
        nicho: (userContext as any).nicho || settings.nicho || 'General',
        avatar_ideal: (userContext as any).avatar_ideal || 'Audiencia objetivo',
        dolor_principal: (userContext as any).dolor_principal || 'No especificado',
        deseo_principal: (userContext as any).deseo_principal || 'No especificado',
        plataforma: settings.platform || 'TikTok',
        formato_narrativo: settings.formato_narrativo || 'EDUCATIVO_AUTORIDAD',
        expertProfile: (userContext as any).expertProfile || null,
      });

      const contextoAdicional = body.text || body.userInput || "";
      const temaTexto = contextoAdicional?.trim();
      const temaFinal = temaTexto || conceptoVisual;
      const inputParaPreAnalisis = temaTexto || conceptoVisual;

      temaUsuario = `[TEMA PRINCIPAL DEL USUARIO]: ${temaFinal}

[INSTRUCCIÓN OBLIGATORIA PARA EL MOTOR]:
El guion DEBE hablar específicamente sobre: "${temaFinal}".
${temaTexto
  ? `El usuario escribió este tema: "${temaTexto}". La imagen complementa visualmente.`
  : `Tema extraído de la imagen. Úsalo como eje central.`}
PROHIBIDO: guion genérico. OBLIGATORIO: mencionar detalles concretos del tema.`;

      preAnalisis = await preAnalizarInput(inputParaPreAnalisis, 'imagen', openai);
      console.log('[MOTOR V700] 🧬 Fusión Visual + Pre-análisis completados.');

    } catch (imgError: any) {
      console.error('[ERROR VISION]', imgError);
      throw new Error("Error analizando la imagen. Asegúrate de que sea JPG/PNG válido.");
    }

  // ══════════════════════════════════════════════════════════
  // RUTA B: TEXTO LARGO (> 150 chars)
  // ══════════════════════════════════════════════════════════
  } else if (
    !body.image &&
    (body.text || body.userInput || processedContext) &&
    (body.text || body.userInput || processedContext || "").length > 150
  ) {
    const inputTexto = body.text || body.userInput || processedContext || "";
    console.log('[MOTOR V700] 📝 Texto largo — ejecutando análisis P1+P6...');
    modoGeneracion = 'texto';

    preAnalisis = await preAnalizarInput(inputTexto, 'texto', openai);
    const estructuraImplicita = await analizarEstructuraImplicita(inputTexto, openai);
    console.log(`[MOTOR V700] 🏗️ Estructura: ${estructuraImplicita.tipo_estructura} → ${estructuraImplicita.instruccion}`);

    let instruccionEstructura = '';
    if (estructuraImplicita.instruccion === 'preservar_y_elevar') {
      instruccionEstructura = `
[INSTRUCCIÓN P6 — PRESERVAR Y ELEVAR]:
El texto tiene estructura sólida (${estructuraImplicita.tipo_estructura}). NO la destruyas.
- Hook a preservar: "${estructuraImplicita.hook_existente}"
- Cierre a preservar: "${estructuraImplicita.cierre_existente}"
- Mantener: ${estructuraImplicita.elementos_fuertes.join(' | ')}
- Reemplazar: ${estructuraImplicita.elementos_debiles.join(' | ')}
MISIÓN: Misma arquitectura, 3x más potencia narrativa.`;
    } else if (estructuraImplicita.instruccion === 'extraer_y_reconstruir') {
      instruccionEstructura = `
[INSTRUCCIÓN P6 — EXTRAER Y RECONSTRUIR]:
EXTRAE elementos fuertes: ${estructuraImplicita.elementos_fuertes.join(' | ')}
DESCARTA débiles: ${estructuraImplicita.elementos_debiles.join(' | ')}
RECONSTRUYE con arquitectura de 6 bloques obligatoria.`;
    } else {
      instruccionEstructura = `
[INSTRUCCIÓN P6 — REESTRUCTURAR COMPLETO]:
El texto no tiene estructura aprovechable. Úsalo como fuente de datos, construye desde cero.`;
    }

    temaUsuario = `
[TEXTO ORIGINAL DEL USUARIO]:
${inputTexto.substring(0, 1500)}

[ADN NARRATIVO DETECTADO — P1]:
- Conflicto Central: ${preAnalisis.conflicto_central}
- Insight Explotable: ${preAnalisis.insight_explotable}
- Transformación: ${preAnalisis.transformacion_implicita}
- Emoción Dominante: ${preAnalisis.emocion_dominante}
- Tensión Base: ${preAnalisis.tension_detectada}/100
- Partes Débiles: ${preAnalisis.partes_planas.join(' | ') || 'Ninguna'}

[INSTRUCCIONES DEL PRE-ANÁLISIS — P1]:
${preAnalisis.instrucciones_para_generador}

${instruccionEstructura}`.trim();

    preAnalisis._estructura_implicita = {
      tipo: estructuraImplicita.tipo_estructura,
      instruccion: estructuraImplicita.instruccion,
      elementos_fuertes: estructuraImplicita.elementos_fuertes,
      elementos_debiles: estructuraImplicita.elementos_debiles,
      razon: estructuraImplicita.razon
    };

  // ══════════════════════════════════════════════════════════
  // RUTA C: IDEA CORTA
  // ══════════════════════════════════════════════════════════
  } else {
    temaUsuario = body.text || body.userInput || settings.topic || userContext.nicho || "Tema General";
    modoGeneracion = 'idea';

    if (!temaUsuario || temaUsuario === "Tema General") {
      throw new Error("⚠️ Debes ingresar un tema, texto o imagen para generar el guion.");
    }

    try {
      preAnalisis = await preAnalizarInput(temaUsuario, 'idea', openai);
      console.log(`[MOTOR V700] 💡 Idea pre-analizada | Tensión: ${preAnalisis.tension_detectada}/100`);
    } catch (e) {
      console.warn('[MOTOR V700] ⚠️ Pre-análisis falló — continúa sin él');
    }
  }

  // ══════════════════════════════════════════════════════════
  // CAPA 0 — SISTEMA TCA (expansión de alcance masivo)
  // ══════════════════════════════════════════════════════════
  let estrategiaTCA: any = null;

  if (!settings?.tca_preexpandido) {
    try {
      console.log('[TCA] 🌀 Ejecutando Sistema de Alcance Masivo...');
      console.log('Iniciando fetch de TCA...');
      
      // TODO: Refactorizar para consolidar en un solo prompt y evitar timeouts
      // BYPASS TEMPORAL: Simulamos respuesta rápida para evitar timeout
      const tcaResult = {
        tema_expandido: temaUsuario,
        estrategia_tca: {
          mass_appeal_score: 75,
          nivel_posicionamiento: 'N2-N3',
          sector_utilizado: 'General',
          tipo_contenido_embudo: 'TOFU',
          hook_sectorial: 'Hook simulado',
          capa_visible: 'Contenido masivo',
          capa_estrategica: 'Autoridad implícita'
        },
        aprobado: true,
        instruccion_tca: ''
      };
      
      console.log('Fetch TCA exitoso (simulado)');
      estrategiaTCA = tcaResult.estrategia_tca;

      if (tcaResult.aprobado && tcaResult.tema_expandido && tcaResult.tema_expandido !== temaUsuario) {
        temaUsuario = tcaResult.tema_expandido;
        if (tcaResult.instruccion_tca) {
          (settings as any)._tca_instruccion = tcaResult.instruccion_tca;
        }
        console.log(`[TCA] ✅ Tema expandido | Mass Appeal: ${estrategiaTCA?.mass_appeal_score || 0}/100`);
      }
    } catch (tcaError: any) {
      console.error('🚨 ERROR EN TCA:', tcaError);
      console.warn('[TCA] ⚠️ Bypass total:', tcaError.message);
    }
  } else {
    console.log('[TCA] ⚡ Pre-expandido desde Ideas Rápidas — bypass');
  }

  // ══════════════════════════════════════════════════════════
  // MOTOR V700 — GENERADOR PRINCIPAL
  // ══════════════════════════════════════════════════════════
  const contextoEnriquecido = {
    ...userContext,
    tema_especifico: temaUsuario,
    modo_generacion: modoGeneracion,
    pre_analisis: preAnalisis,
    estrategia_tca: estrategiaTCA
  };

  console.log('[MOTOR V700] 🚀 Ejecutando generadorGuiones...');
  const res = await ejecutarGeneradorGuiones(contextoEnriquecido, null, openai, settings);

  const result = {
    ...res.data,
    modo_generacion: modoGeneracion,
    ...(preAnalisis && {
      pre_analisis_input: {
        tipo: modoGeneracion,
        conflicto_detectado: preAnalisis.conflicto_central,
        tension_base: preAnalisis.tension_detectada,
        partes_elevadas: preAnalisis.partes_planas
      }
    })
  };

  console.log(`[MOTOR V700] ✅ Guion generado | Modo: ${modoGeneracion}`);
  return { result, tokensUsed: res.tokens };
}

// ==================================================================================
// 📊 TCA FEEDBACK (guardar resultado del video publicado)
// ==================================================================================

export async function handleTcaFeedback(
  body: any,
  userId: string,
  supabase: any
): Promise<{ result: any; tokensUsed: number }> {
  console.log('[HANDLER] 📊 Guardando feedback TCA...');

  await guardarFeedbackTCA(supabase, userId, body.guion_data || {}, {
    resultado_categoria: body.resultado_categoria || 'normal',
    vistas_48h: body.vistas_48h || null,
    notas: body.notas || null
  });

  return {
    result: { success: true, mensaje: '✅ Resultado guardado. El sistema aprende de tu experiencia.' },
    tokensUsed: 0
  };
}