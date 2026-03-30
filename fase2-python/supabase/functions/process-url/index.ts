// ==================================================================================
// 🚀 TITAN ENGINE V105 — SERVIDOR PRINCIPAL (REFACTORIZADO)
// 
// ARQUITECTURA:
//   lib/types.ts          → Interfaces y tipos
//   lib/constants.ts      → Config, CORS, estructuras narrativas
//   lib/security.ts       → sanitize, rateLimit, withTimeout
//   lib/scrapers.ts       → TikTok, Instagram, YouTube, Facebook, Whisper
//   lib/context.ts        → getUserContext, calculateTitanCost
//   handlers/             → Un handler por funcionalidad
//   prompts/              → Prompts V300 + funciones ejecutar*
//   ExpertAuthoritySystem.ts  → Sistema de validación de perfil OLIMPO
//   AvatarMiddleware.ts       → Middleware de personalidad del Avatar
// ==================================================================================

import { ExpertAuthoritySystem } from './ExpertAuthoritySystem.ts';
import AvatarMiddleware from './AvatarMiddleware.ts';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://esm.sh/openai@4';

import { corsHeaders, NO_SAVE_MODES, SKIP_AVATAR_MODES } from './lib/constants.ts';
import { checkRateLimit } from './lib/security.ts';
import { getUserContext, calculateTitanCost } from './lib/context.ts';

// ─── Handlers ────────────────────────────────────────────────
import { handleIdeasRapidas } from './handlers/ideas-rapidas.ts';
import { handleCalendar } from './handlers/calendar.ts';
import { handleAutopsiaViral, handleReCreate } from './handlers/autopsia-viral.ts';
import { handleScriptGenerator, handleTcaFeedback } from './handlers/script-generator.ts';
import {
  handleJuezViral,
  handleAuditExpert,
  handleAuditAvatar,
  handleMentor,
  handleCopyExpert
} from './handlers/other-handlers.ts';

// ==================================================================================
// 🔁 MODOS QUE USAN EL PATRÓN ASÍNCRONO (respuesta inmediata + background task)
// ==================================================================================

const ASYNC_BACKGROUND_MODES = ['recreate'];

// ==================================================================================
// 🏭 BACKGROUND TASK — procesa el recreate y actualiza la DB al terminar
// ==================================================================================

async function runRecreateBackground(params: {
  generationId: string;
  body: any;
  settings: any;
  platform: string;
  processedContext: string;
  userContext: any;
  openai: any;
  supabase: any;
  userId: string;
  estimatedCost: number;
  activeAvatar: any | null;
}): Promise<void> {
  const {
    generationId, body, settings, platform, processedContext,
    userContext, openai, supabase, userId, estimatedCost, activeAvatar,
  } = params;

  try {
    console.log(`[BACKGROUND] 🔁 Iniciando recreate para generation_id=${generationId}`);

    const r = await handleReCreate(body, settings, platform, processedContext, userContext, openai);
    const result        = r.result;
    const tokensUsed    = r.tokensUsed;
    const whisperMinutes   = r.whisperMinutes;
    const videoDurationSecs = r.videoDurationSecs;

    const calculatedPrice = calculateTitanCost(
      'recreate', processedContext, whisperMinutes, settings, videoDurationSecs
    );
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles')
        .select('credits, tier').eq('id', userId).single();
      if (profile?.tier !== 'admin') {
        const { error: creditError } = await supabase.rpc('decrement_credits', {
          user_uuid: userId,
          amount: finalCost,
        });
        if (creditError) console.error(`[BACKGROUND] ❌ Error cobrando créditos: ${creditError.message}`);
      }
    }

    if (activeAvatar) {
      try {
        const avatarMw = new AvatarMiddleware(supabase);
        await avatarMw.incrementContentCount();
      } catch (e) { console.error('[BACKGROUND] Error evolución avatar:', e); }
    }

    const { error: updateError } = await supabase
      .from('viral_generations')
      .update({
        status:          'completed',
        content:         result,
        cost_credits:    finalCost,
        tokens_used:     tokensUsed,
        whisper_minutes: whisperMinutes,
        updated_at:      new Date().toISOString(),
      })
      .eq('id', generationId);

    if (updateError) {
      console.error(`[BACKGROUND] ❌ Error actualizando registro: ${updateError.message}`);
    } else {
      console.log(`[BACKGROUND] ✅ recreate completado. generation_id=${generationId}`);
    }

  } catch (bgError: any) {
    console.error(`[BACKGROUND] 💥 Error fatal: ${bgError.message}`);
    await supabase
      .from('viral_generations')
      .update({
        status:     'error',
        content:    { error: bgError.message },
        updated_at: new Date().toISOString(),
      })
      .eq('id', generationId);
  }
}

// ==================================================================================
// 🌊 MODOS QUE DEVUELVEN UN ReadableStream (SSE) EN VEZ DE JSON
// ==================================================================================

const STREAMING_MODES = [
  'generar_guion',
  'generador_guiones',
  'script_generator_standard',
  'script_generator_vision',
];

// ==================================================================================
// 🚀 SERVIDOR PRINCIPAL
// ==================================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const startTime = Date.now();
  let userId: string | null = null;

  try {
    // ─── Inicializar clientes ──────────────────────────────
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const openaiKey   = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey || !openaiKey) {
      throw new Error('Faltan variables de entorno críticas');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const openai   = new OpenAI({ apiKey: openaiKey });

    // ─── Autenticación ────────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    );
    if (authError || !user) throw new Error('Usuario no autenticado');
    userId = user.id;

    if (!checkRateLimit(userId)) throw new Error('Límite de solicitudes excedido');

    // ─── Parsear body (JSON o FormData) ─────────────────────────────────────
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      body.selectedMode = formData.get('selectedMode');
      body.text = formData.get('text');
      body.expertId = formData.get('expertId') || undefined;
      body.avatarId = formData.get('avatarId') || undefined;
      body.knowledgeBaseId = formData.get('knowledgeBaseId') || undefined;
      body.estimatedCost = Number(formData.get('estimatedCost')) || 0;
      
      const settingsStr = formData.get('settings');
      if (settingsStr) {
        try { body.settings = JSON.parse(settingsStr.toString()); } catch(e) {}
      }
      
      const uploadedFile = formData.get('uploadedVideo');
      if (uploadedFile) {
        body.uploadedVideo = uploadedFile;
        body.uploadedFileName = formData.get('uploadedFileName');
      }
    } else {
      body = await req.json();
    }

    const {
      selectedMode,
      url,
      platform,
      expertId,
      avatarId,
      knowledgeBaseId,
      estimatedCost,
      strategyLoop,
      vectorEmocional,
      hookMode,
      customHook,
      format,
      architecture
    } = body || {};

    let processedContext = body.transcript || body.text || body.userInput
      || body.customPrompt || body.topic || body.query || "";

    // ─── Merge de settings ────────────────────────────────
    let settings: any = { ...(body.settings || {}) };
    if (body.quantity)          settings.quantity         = body.quantity;
    if (body.duration)          settings.duration         = body.duration;
    if (body.durationId)        settings.durationId       = body.durationId;
    if (body.structure)         settings.structure        = body.structure;
    if (body.awareness)         settings.awareness        = body.awareness;
    if (body.objective)         settings.objective        = body.objective;
    if (body.situation)         settings.situation        = body.situation;
    if (body.platform)          settings.platform         = body.platform;
    if (body.timing_context)    settings.timing_context   = body.timing_context;
    if (body.creative_lens)     settings.creative_lens    = body.creative_lens;
    if (body.internal_mode)     settings.internal_mode    = body.internal_mode;
    if (body.hook_style)        settings.hook_style       = body.hook_style;
    if (body.intensity)         settings.intensity        = body.intensity;
    if (body.closing_objective) settings.closing_objective = body.closing_objective;

    console.log(`[TITAN V105] 🚀 MODE: ${selectedMode} | USER: ${userId}`);

    // ─── Pre-validación de créditos ───────────────────────
    if (estimatedCost > 0) {
      const { data: p } = await supabase.from('profiles')
        .select('credits, tier').eq('id', userId).single();
      if (p?.tier !== 'admin' && (p?.credits || 0) < estimatedCost) {
        throw new Error(`Saldo insuficiente. Tienes ${p?.credits || 0} créditos, se requieren ${estimatedCost}.`);
      }
    }

    // ─── Contexto del usuario ─────────────────────────────
    const userContext = await getUserContext(
      supabase, expertId || '', avatarId || '', knowledgeBaseId || ''
    );

    // ─── Fallbacks para variables avanzadas ─────────────────────────────
    const safeStrategyLoop   = strategyLoop   || 'standard';
    const safeVectorEmocional = vectorEmocional || 'neutral';
    const safeHookMode       = hookMode        || 'direct';
    const safeCustomHook     = customHook      || '';
    const safeFormat         = format          || 'standard';
    const safeArchitecture   = architecture    || 'linear';

    // ==================================================================================
    // 🛡️ MIDDLEWARE DE AVATAR + INYECCIÓN DE PERSONALIDAD
    // ==================================================================================

    const skipMiddleware = SKIP_AVATAR_MODES.includes(selectedMode);
    let activeAvatar     = null;
    let avatarDirectives = "";

    if (!skipMiddleware) {
      try {
        const avatarMw = new AvatarMiddleware(supabase);
        const validation = await avatarMw.validateAndGetAvatar(userId);

        if (!validation.success) {
          return new Response(JSON.stringify({
            success: false,
            error: validation.error,
            warnings: validation.warnings,
            action: "REDIRECT_TO_AVATAR"
          }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 });
        }

        activeAvatar = validation.avatar;
        console.log(`[MIDDLEWARE] ✅ Avatar: ${activeAvatar.name}`);

        const requestContent = { mode: selectedMode, transcript: processedContext, ...settings };
        const safetyCheck = await avatarMw.filterContentRequest(requestContent, userId);

        if (!safetyCheck.approved) {
          return new Response(JSON.stringify({
            success: false,
            error: "CONTENT_VIOLATION",
            message: "Tu Avatar prohíbe este tipo de contenido.",
            warnings: safetyCheck.warnings
          }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        avatarDirectives = avatarMw.buildPromptWithAvatar("", activeAvatar, selectedMode);

        if (processedContext.trim().length > 0) {
          processedContext = processedContext
            + `\n\n[SISTEMA: INSTRUCCIONES DE PERSONALIDAD OBLIGATORIAS DEL AVATAR]:\n${avatarDirectives}`;
        }
        (userContext as any).avatarDirectives = avatarDirectives;
        (userContext as any).knowledge_base_content =
          ((userContext as any).knowledge_base_content || "")
          + `\n\n[PERSONALIDAD AVATAR]: ${avatarDirectives}`;

      } catch (middlewareError: any) {
        console.error('[MIDDLEWARE] ❌ Error:', middlewareError.message);
      }
    }

    // ==================================================================================
    // 🎯 ROUTER — DELEGACIÓN A HANDLERS
    // ==================================================================================

    // ── RUTA ESPECIAL: Modos que devuelven SSE (streaming) ────────────────────────────
    // handleScriptGenerator devuelve una Response directa (SSE), NO un { result, tokensUsed }.
    // La devolvemos inmediatamente sin pasar por el bloque de cobros/guardado normal,
    // ya que el guardado se hace de forma asíncrona después (o desde el cliente).
    if (STREAMING_MODES.includes(selectedMode)) {
      console.log(`[TITAN V105] 🌊 Modo streaming detectado: ${selectedMode}`);

      // Pre-cobro antes de empezar el stream (no podemos cobrar después en SSE)
      if (estimatedCost > 0) {
        const { data: profile } = await supabase.from('profiles')
          .select('credits, tier').eq('id', userId).single();

        if (profile?.tier !== 'admin') {
          if ((profile?.credits || 0) < estimatedCost) {
            // Devolvemos error JSON (el cliente aún no está en modo stream)
            return new Response(
              JSON.stringify({ success: false, error: `Saldo insuficiente. Costo: ${estimatedCost} créditos.` }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          // Cobrar antes del stream
          const { error: creditError } = await supabase.rpc('decrement_credits', {
            user_uuid: userId,
            amount: estimatedCost
          });
          if (creditError) {
            console.error(`[COBROS PRE-STREAM] ❌ Error: ${creditError.message}`);
          }
        }
      }

      // Llamar al handler — devuelve Response SSE directamente
      const streamingResponse = await handleScriptGenerator(
        body,
        settings,
        processedContext,
        userContext,
        openai,
        corsHeaders
      );

      // Registrar en historial de forma no-bloqueante (fire-and-forget)
      // No podemos esperar el contenido del stream porque ya está fluyendo
      if (!NO_SAVE_MODES.includes(selectedMode)) {
        supabase.from('viral_generations').insert({
          user_id:         userId,
          type:            selectedMode,
          content:         { info: 'Generado con streaming V800', tema: body.text?.substring(0, 200) || '' },
          original_url:    url || null,
          cost_credits:    estimatedCost || 0,
          platform:        platform || settings.platform || 'general',
          tokens_used:     0,
          whisper_minutes: 0
        }).then(() => {
          console.log('[HISTORIAL] ✅ Entrada de streaming guardada');
        }).catch((e: any) => {
          console.error('[HISTORIAL] ❌ Error guardando entrada streaming:', e.message);
        });
      }

      return streamingResponse;
    }

    // ==================================================================================
    // ⚡ RUTA ASÍNCRONA: recreate — responde en < 2s, proceso pesado en background
    // ==================================================================================

    if (ASYNC_BACKGROUND_MODES.includes(selectedMode)) {
      console.log(`[TITAN V105] ⚡ Modo asíncrono: ${selectedMode}`);

      const rawUrls: string[] = body.urls || (body.url ? [body.url] : []);

      const { data: genRecord, error: insertError } = await supabase
        .from('viral_generations')
        .insert({
          user_id:         userId,
          type:            selectedMode,
          content:         null,
          original_url:    rawUrls[0] || null,
          cost_credits:    estimatedCost || 0,
          platform:        platform || settings.platform || 'general',
          tokens_used:     0,
          whisper_minutes: 0,
          status:          'processing',
          metadata: {
            expertId:        expertId || null,
            avatarId:        avatarId || null,
            knowledgeBaseId: knowledgeBaseId || null,
          },
        })
        .select('id')
        .single();

      if (insertError || !genRecord) {
        throw new Error(`Error creando registro: ${insertError?.message}`);
      }

      const generationId = genRecord.id;
      console.log(`[ASYNC] ✅ Registro creado. generation_id=${generationId}`);

      const backgroundTask = runRecreateBackground({
        generationId,
        body,
        settings,
        platform:         platform || '',
        processedContext,
        userContext,
        openai,
        supabase,
        userId,
        estimatedCost:    estimatedCost || 0,
        activeAvatar,
      });

      try {
        // @ts-ignore — EdgeRuntime es global en Supabase Edge Functions
        EdgeRuntime.waitUntil(backgroundTask);
      } catch (_) {
        backgroundTask.catch((e: any) => {
          console.error('[BACKGROUND FALLBACK] Error:', e.message);
        });
      }

      return new Response(
        JSON.stringify({
          success:       true,
          async:         true,
          generation_id: generationId,
          message:       'Procesando en la nube. Escucha el canal Realtime para el resultado.',
          metadata:      { mode: selectedMode, duration: Date.now() - startTime },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }


    // ── RUTA NORMAL: Handlers que devuelven { result, tokensUsed } ────────────────────

    let result: any;
    let tokensUsed    = 0;
    let whisperMinutes = 0;

    switch (selectedMode) {

      case 'ideas_rapidas': {
        const r = await handleIdeasRapidas(body, settings, processedContext, userContext, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'calendar_generator': {
        const r = await handleCalendar(settings, userContext, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'autopsia_viral': {
        const r = await handleAutopsiaViral(body, settings, platform, processedContext, userContext, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        whisperMinutes = r.whisperMinutes;
        settings._videoDurationSecs = r.videoDurationSecs;
        break;
      }

      case 'recreate': {
        // ⚡ MODO ASÍNCRONO — el proceso pesado corre en background.
        // Este case NO debería alcanzarse porque el router asíncrono (más arriba)
        // intercepta 'recreate' antes del switch. Lo dejamos como guardia de seguridad.
        throw new Error('El modo recreate debe ser manejado por el router asíncrono. Verifica ASYNC_BACKGROUND_MODES.');
      }

      case 'tca_feedback': {
        const r = await handleTcaFeedback(body, userId, supabase);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'juez_viral': {
        const r = await handleJuezViral(body, settings, processedContext, userContext, userId, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'audit_expert':
      case 'auditar_experto': {
        const r = await handleAuditExpert(body, userContext, supabase, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'audit_avatar': {
        const r = await handleAuditAvatar(body, userContext, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'mentor_estrategico':
      case 'mentor_ia':
      case 'chat_expert':
      case 'chat_avatar': {
        const r = await handleMentor(processedContext, userContext, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        break;
      }

      case 'copy_expert': {
        const r = await handleCopyExpert(body, settings, processedContext, userContext, openai);
        result = r.result; tokensUsed = r.tokensUsed;
        whisperMinutes = r.whisperMinutes;
        break;
      }

      default:
        throw new Error(`Modo no reconocido: ${selectedMode}`);
    }

    // ==================================================================================
    // 💰 COBROS Y GUARDADO (solo para handlers no-streaming)
    // ==================================================================================

    const calculatedPrice = calculateTitanCost(
      selectedMode,
      processedContext,
      whisperMinutes,
      settings,
      settings._videoDurationSecs || 0
    );
    const finalCost = Math.max(calculatedPrice, estimatedCost || 0);

    // 1. Cobrar créditos
    if (finalCost > 0) {
      const { data: profile } = await supabase.from('profiles')
        .select('credits, tier').eq('id', userId).single();

      if (profile?.tier !== 'admin') {
        if ((profile?.credits || 0) < finalCost) {
          throw new Error(`Saldo insuficiente. Costo: ${finalCost} créditos.`);
        }
        const { error: creditError } = await supabase.rpc('decrement_credits', {
          user_uuid: userId,
          amount: finalCost
        });
        if (creditError) console.error(`[COBROS] ❌ Error: ${creditError.message}`);
      }
    }

    // 2. Guardar en historial
    if (!NO_SAVE_MODES.includes(selectedMode)) {
      await supabase.from('viral_generations').insert({
        user_id:         userId,
        type:            selectedMode,
        content:         result,
        original_url:    url || null,
        cost_credits:    finalCost,
        platform:        platform || 'general',
        tokens_used:     tokensUsed,
        whisper_minutes: whisperMinutes
      });
    }

    // 3. Evolución del Avatar
    if (activeAvatar && !NO_SAVE_MODES.includes(selectedMode)) {
      try {
        const avatarMw = new AvatarMiddleware(supabase);
        await avatarMw.incrementContentCount();
      } catch (e) { console.error("Error evolución avatar:", e); }
    }

    // ─── Respuesta final ──────────────────────────────────
    return new Response(
      JSON.stringify({
        success:       true,
        generatedData: result,
        finalCost,
        avatar_used:   activeAvatar ? { id: activeAvatar.id, name: activeAvatar.name } : null,
        metadata:      { mode: selectedMode, duration: Date.now() - startTime }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error(`[ERROR CRÍTICO]: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});