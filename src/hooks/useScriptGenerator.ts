// ==================================================================================
// 🎣 useScriptGenerator.ts — Custom Hook V800
// Conectado con: Calendar, QuickIdeas, KnowledgeBase, ExpertProfile, AvatarProfile
// ==================================================================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ── Tipos públicos ─────────────────────────────────────────────────────────────

export interface ScriptResult {
  // Bloques V800 (Markdown estructurado)
  frase_miniatura?: string;
  teleprompter_script?: string;
  plan_audiovisual_director?: string;
  // Legacy (compatibilidad con otros handlers del sistema)
  hook?: string;
  guion_completo?: string;
  estructura_desglosada?: any;
  micro_loops_detectados?: any[];
  curva_emocional?: any;
  activadores_psicologicos?: any[];
  score_predictivo?: any;
  analisis_viral?: any;
  miniatura_dominante?: any;
  poder_del_guion?: any;
  metadata_guion?: Record<string, any>;
  estrategia_tca?: any;
  [key: string]: any;
}

export type StreamPhase = 'idle' | 'estratega' | 'generador' | 'complete' | 'error';

export interface StreamState {
  phase: StreamPhase;
  phaseMessage: string;
  streamedText: string;
  estrategia: any | null;
  result: ScriptResult | null;
  errorMessage: string | null;
}

export interface GeneratorConfig {
  // Origen
  topic: string;
  selectedImage: string | null;
  // Plataforma y duración
  selectedPlatform: { id: string; label: string; icon: any; color: string; border: string; bg: string };
  durationId: string;
  // Arquitectura
  selectedStructure: { id: string; label: string; desc: string; color: string; modes: any[] };
  selectedInternalMode: { id: string; label: string; desc: string };
  selectedNarrativeFormat: string;
  // Psicología
  strategyLoop: string;
  vectorEmocional: string;
  arquetipoVoz: string;
  awareness: string;
  situation: string;
  // Detonador
  selectedIntensity: string;
  closingObjective: string;
  hookMode: 'elite' | 'custom' | 'arsenal';
  eliteHookId: string;
  customHook: string;
  arsenalHook: string;
  culturalContext: string;
  // Recursos
  selectedExpertId: string;
  selectedKnowledgeBaseId: string;
  cost: number;
  // Origen especial (opcionales — se rellenan desde navigation state)
  fromCalendar?: boolean;
  calendarNotes?: string;
  calendarFormat?: string;
  fromIdeas?: boolean;
}

// ── Hook principal ─────────────────────────────────────────────────────────────

export function useScriptGenerator(config: GeneratorConfig) {
  const navigate = useNavigate();
  const { user, userProfile, refreshProfile } = useAuth();
  const abortControllerRef = useRef<AbortController | null>(null);

  const [streamState, setStreamState] = useState<StreamState>({
    phase: 'idle', phaseMessage: '', streamedText: '',
    estrategia: null, result: null, errorMessage: null,
  });

  const isGenerating = streamState.phase === 'estratega' || streamState.phase === 'generador';
  const result       = streamState.result;
  const error        = streamState.errorMessage;

  // Estados secundarios
  const [isSaving, setIsSaving]           = useState(false);
  const [saveSuccess, setSaveSuccess]     = useState(false);
  const [isAuditing, setIsAuditing]       = useState(false);
  const [auditResult, setAuditResult]     = useState<any>(null);
  const [showAudit, setShowAudit]         = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDate, setScheduleDate]   = useState(new Date().toISOString().split('T')[0]);
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [guionParaFeedback, setGuionParaFeedback] = useState<any>(null);

  // Cleanup en desmontaje
  useEffect(() => { return () => { abortControllerRef.current?.abort(); }; }, []);

  // ── Resolver hook activo ────────────────────────────────────────────────────
  const getActiveHookText = useCallback((): string => {
    if (config.hookMode === 'elite') {
      const ELITE_LABELS: Record<string, string> = {
        enemigo_comun:           '😡 El Enemigo Común',
        verdad_impopular:        '🚫 La Verdad Impopular',
        error_novato:            '❌ El Error de Novato',
        secreto_industria:       '🤫 El Secreto de la Industria',
        promesa_contraintuitiva: '🔄 Promesa Contraintuitiva',
      };
      return ELITE_LABELS[config.eliteHookId] || config.eliteHookId;
    }
    if (config.hookMode === 'custom') return config.customHook || '';
    return config.arsenalHook;
  }, [config.hookMode, config.eliteHookId, config.customHook, config.arsenalHook]);

  // ══════════════════════════════════════════════════════════════════════════════
  // GENERATE — lógica principal del stream
  // ══════════════════════════════════════════════════════════════════════════════
  const handleGenerate = useCallback(async () => {
    if (!config.topic.trim() && !config.selectedImage) {
      setStreamState(prev => ({ ...prev, errorMessage: 'Por favor escribe un tema o sube una imagen.', phase: 'idle' }));
      return;
    }

    if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < config.cost) {
      const ok = confirm(`⚠️ Saldo insuficiente. Necesitas ${config.cost} créditos. Tienes ${userProfile?.credits || 0}.\n\n¿Deseas recargar?`);
      if (ok) navigate('/dashboard/settings');
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setStreamState({
      phase: 'estratega', phaseMessage: '🧠 Analizando Estrategia y TCA...',
      streamedText: '', estrategia: null, result: null, errorMessage: null,
    });
    setAuditResult(null);
    setShowAudit(false);
    setSaveSuccess(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No hay sesión activa. Por favor inicia sesión.');

      // Resolver URL de la Edge Function
      const supabaseUrl = (supabase as any).supabaseUrl
        || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_SUPABASE_URL : '')
        || '';
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/process-url`;

      // ── Payload completo — TODAS las variables, sin omitir ninguna ────────────
      const requestBody = {
        selectedMode: config.selectedImage
          ? 'script_generator_vision'
          : 'script_generator_standard',
        text:          config.topic,
        image:         config.selectedImage   || undefined,
        expertId:      config.selectedExpertId      || undefined,
        avatarId:      userProfile?.active_avatar_id || undefined,
        knowledgeBaseId: config.selectedKnowledgeBaseId || undefined,
        estimatedCost: config.cost,

        settings: {
          // ─ Arquitectura ─
          structure:          config.selectedStructure.id,
          internalMode:       config.selectedInternalMode.id,
          narrativeFormat:    config.selectedNarrativeFormat,
          formato_narrativo:  config.selectedNarrativeFormat,

          // ─ Plataforma y duración ─
          platform:           config.selectedPlatform.id,
          duration:           config.durationId,
          durationId:         config.durationId,

          // ─ Gancho (todos los modos) ─
          hookType:           getActiveHookText(),
          hookMode:           config.hookMode,
          eliteHookId:        config.hookMode === 'elite'   ? config.eliteHookId   : undefined,
          customHook:         config.hookMode === 'custom'  ? config.customHook    : undefined,
          arsenalHook:        config.hookMode === 'arsenal' ? config.arsenalHook   : undefined,

          // ─ Psicología — todas las variables ─
          strategyLoop:       config.strategyLoop,
          strategy_loop:      config.strategyLoop,
          vector_emocional:   config.vectorEmocional,
          arquetipo_voz:      config.arquetipoVoz,
          awareness:          config.awareness,
          situation:          config.situation,

          // ─ Detonador ─
          intensity:          config.selectedIntensity,
          closingObjective:   config.closingObjective,
          closing_objective:  config.closingObjective,

          // ─ Contexto cultural ─
          culturalContext:              config.culturalContext || undefined,
          cultural_context_usuario:     config.culturalContext || undefined,

          // ─ Origen especial (para que el prompt sepa cómo tratar el input) ─
          fromCalendar:       config.fromCalendar    || false,
          calendarNotes:      config.calendarNotes   || undefined,
          calendarFormat:     config.calendarFormat  || undefined,
          fromIdeas:          config.fromIdeas        || false,
        },
      };

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      // ── Manejo de errores HTTP ──────────────────────────────────────────────
      if (!response.ok) {
        let errMsg = `Error del servidor: ${response.status}`;
        try { const b = await response.json(); errMsg = b?.error || errMsg; } catch {}
        throw new Error(errMsg);
      }

      const contentType = response.headers.get('content-type') || '';

      // ── Fallback JSON (handlers legacy no-stream) ───────────────────────────
      if (!contentType.includes('text/event-stream')) {
        const data = await response.json();
        if (!data?.success && !data?.generatedData) throw new Error(data?.error || 'Error desconocido del servidor');
        const finalResult: ScriptResult = data.generatedData || data;
        setStreamState({ phase: 'complete', phaseMessage: '✅ Guion listo', streamedText: '',
          estrategia: null, result: finalResult, errorMessage: null });
        setGuionParaFeedback(finalResult);
        if (refreshProfile) await refreshProfile();
        return;
      }

      // ── Lectura SSE chunk a chunk ────────────────────────────────────────────
      const reader  = response.body!.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === '[DONE]') continue;

          let event: any;
          try { event = JSON.parse(jsonStr); } catch { continue; }

          switch (event.type) {
            case 'status':
              setStreamState(prev => ({ ...prev, phase: event.phase as StreamPhase, phaseMessage: event.message }));
              break;
            case 'estrategia':
              setStreamState(prev => ({ ...prev, estrategia: event.data }));
              break;
            case 'chunk':
              // React 18 agrupa estos setState — cero congelamiento de UI
              setStreamState(prev => ({ ...prev, streamedText: prev.streamedText + (event.text || '') }));
              break;
            case 'complete': {
              const finalResult: ScriptResult = event.result || {};
              setStreamState({ phase: 'complete', phaseMessage: '✅ Guion listo',
                streamedText: '', estrategia: null, result: finalResult, errorMessage: null });
              setGuionParaFeedback(finalResult);
              if (refreshProfile) await refreshProfile();
              break;
            }
            case 'error':
              throw new Error(event.message || 'Error desconocido desde el servidor');
          }
        }
      }

    } catch (e: any) {
      if (e.name === 'AbortError') {
        setStreamState(prev => ({ ...prev, phase: 'idle', phaseMessage: '', errorMessage: null }));
        return;
      }
      console.error('[useScriptGenerator] Error:', e);
      setStreamState(prev => ({
        ...prev, phase: 'error', phaseMessage: '❌ Error en la generación',
        errorMessage: e.message || 'Error inesperado. Por favor intenta de nuevo.',
      }));
    }
  }, [config, userProfile, navigate, refreshProfile, getActiveHookText]);

  // ── CANCEL ──────────────────────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // ── SAVE EN LIBRERÍA ────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!result || !user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const { error: saveError } = await supabase.from('viral_generations').insert({
        user_id: user.id,
        type: 'generar_guion',
        content: result,
        original_url: null,
        cost_credits: config.cost,
        platform: config.selectedPlatform.label,
        tokens_used: 0,
        whisper_minutes: 0,
      });
      if (saveError) throw saveError;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e: any) { alert('Error al guardar: ' + e.message); }
    finally { setIsSaving(false); }
  }, [result, user, config.cost, config.selectedPlatform.label]);

  // ── GUARDAR EN CALENDARIO (tabla: content_items) ─────────────────────────────
  // Formato exacto que Calendar.tsx espera:
  //   content.guion_completo → muestra en el panel lateral (script)
  //   content.objetivo       → tipo del evento (viral, venta, etc.)
  //   content.formato        → formato del contenido
  //   content.description    → notas/gancho
  const handleSaveToCalendar = useCallback(async (scheduledDate: string) => {
    if (!result || !user) return;
    const teleprompter = result.teleprompter_script || result.guion_completo || '';
    const fraseMiniatura = result.frase_miniatura || result.hook || '';
    try {
      const { error: calError } = await supabase.from('content_items').insert({
        user_id:        user.id,
        type:           'calendar_event',
        title:          fraseMiniatura || config.topic.substring(0, 80),
        scheduled_date: scheduledDate,
        platform:       config.selectedPlatform.label,
        status:         'planned',
        content: {
          objetivo:        config.selectedStructure.id,
          formato:         config.selectedNarrativeFormat,
          description:     config.topic,
          guion_completo:  teleprompter,
          frase_miniatura: fraseMiniatura,
          plan_audiovisual:result.plan_audiovisual_director || '',
          metadata:        result.metadata_guion || {},
        },
      });
      if (calError) throw calError;
      alert(`✅ Guion agendado para el ${scheduledDate}`);
      setIsScheduleModalOpen(false);
    } catch (e: any) { alert('Error al agendar: ' + e.message); }
  }, [result, user, config]);

  // ── COPY TELEPROMPTER ───────────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    const text = result?.teleprompter_script || result?.guion_completo || '';
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => alert('✅ Teleprompter copiado'))
      .catch(() => alert('❌ Error al copiar'));
  }, [result]);

  // ── COPY FRASE MINIATURA ────────────────────────────────────────────────────
  const handleCopyMiniatura = useCallback(() => {
    const text = result?.frase_miniatura || result?.hook || '';
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => alert('✅ Frase miniatura copiada'))
      .catch(() => alert('❌ Error al copiar'));
  }, [result]);

  // ── SCHEDULE CONFIRM ────────────────────────────────────────────────────────
  const handleConfirmSchedule = useCallback(async () => {
    if (!scheduleDate) return alert('Selecciona una fecha.');
    await handleSaveToCalendar(scheduleDate);
  }, [scheduleDate, handleSaveToCalendar]);

  // ── JUEZ VIRAL ──────────────────────────────────────────────────────────────
  const handleAudit = useCallback(async () => {
    const scriptText = result?.teleprompter_script || result?.guion_completo || '';
    if (!scriptText || !user) return;
    setIsAuditing(true);
    setShowAudit(true);
    setAuditResult(null);
    try {
      const { data, error: auditError } = await supabase.functions.invoke('process-url', {
        body: {
          selectedMode: 'juez_viral',
          text: scriptText,
          expertId:  config.selectedExpertId          || undefined,
          avatarId:  userProfile?.active_avatar_id    || undefined,
          estimatedCost: 2,
        },
      });
      if (auditError) throw auditError;
      if (!data?.success || !data?.generatedData) throw new Error(data?.error || 'Error en la auditoría');
      setAuditResult(data.generatedData);
      if (refreshProfile) await refreshProfile();
    } catch (e: any) { alert('Error en auditoría: ' + e.message); setShowAudit(false); }
    finally { setIsAuditing(false); }
  }, [result, user, config.selectedExpertId, userProfile, refreshProfile]);

  // ── NAVEGAR A IDEAS RÁPIDAS (desde el generador, para buscar más ideas) ──────
  const handleGoToQuickIdeas = useCallback(() => {
    navigate('/dashboard/ideas-rapidas', {
      state: {
        topic: config.topic,
        platform: config.selectedPlatform.id,
        fromScriptGenerator: true,
      }
    });
  }, [navigate, config.topic, config.selectedPlatform.id]);

  return {
    // Stream
    streamState, isGenerating, result, error,
    // Acciones principales
    handleGenerate, handleCancel,
    handleSave, handleCopy, handleCopyMiniatura,
    handleSaveToCalendar, handleConfirmSchedule,
    handleAudit, handleGoToQuickIdeas,
    // Estado secundario
    isSaving, saveSuccess,
    isAuditing, auditResult, showAudit, setShowAudit,
    isScheduleModalOpen, setIsScheduleModalOpen,
    scheduleDate, setScheduleDate,
    mostrarFeedback, setMostrarFeedback,
    guionParaFeedback,
  };
}