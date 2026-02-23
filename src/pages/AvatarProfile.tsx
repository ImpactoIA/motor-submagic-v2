import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Save, Plus, Trash2, Shield, Target, Brain, Zap, 
  AlertTriangle, TrendingUp, Crown, MessageSquare,
  Award, Flame, Heart, Lock, Unlock, Globe, Users
} from 'lucide-react';

import { AvatarWidget } from '../components/AvatarWidget';
import { MentorStrategic, ContextualSuggestions } from '../components/AvatarComponents';

// ============================================================
// 🧠 ADN COGNITIVO — 7 CAPAS OLIMPO ABSOLUTO
// ============================================================

export const AvatarProfile: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  
  const [avatarsList, setAvatarsList] = useState<any[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'core' | 'advanced' | 'evolution'>('core');
  const [nicheInput, setNicheInput] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [formData, setFormData] = useState({
    // CAPA 1 — IDENTIDAD BASE
    name: '',
    is_active: true,
    person_type: 'creador_contenido' as 'emprendedor' | 'creador_contenido' | 'marca_personal' | 'empresa' | 'profesional_independiente',
    experience_level: 'intermedio' as 'principiante' | 'intermedio' | 'avanzado' | 'experto',
    country_culture: '',
    industry: '',
    // CAPA 2 — OBJETIVO PRINCIPAL
    primary_goal: 'autoridad' as 'viralidad' | 'autoridad' | 'venta' | 'comunidad' | 'posicionamiento',
    secondary_goals: [] as string[],
    success_model: 'educador_serio' as 'educador_serio' | 'empresario_premium' | 'influencer_agresivo' | 'mentor_disruptivo' | 'experto_tecnico' | 'creativo_viral',
    risk_level: 'balanceado' as 'conservador' | 'balanceado' | 'agresivo',
    // CAPA 3 — DOLOR CENTRAL
    central_pain: '',
    frustrations: '',
    recurring_obstacles: '',
    hidden_fears: '',
    stagnation_feeling: '',
    // CAPA 4 — DESEO OCULTO
    hidden_desire: '',
    dominant_emotion: 'curiosidad' as 'curiosidad' | 'deseo' | 'miedo' | 'aspiracion' | 'autoridad',
    dream_outcome: '',
    status_aspiration: '',
    // CAPA 5 — LENGUAJE NATURAL
    communication_style: 'didactico' as 'directo' | 'analitico' | 'inspirador' | 'provocador' | 'didactico',
    formality_level: 'semiformial' as 'coloquial' | 'semiformial' | 'formal' | 'academico',
    mental_rhythm: 'moderado' as 'rapido' | 'moderado' | 'reflexivo',
    signature_vocabulary: [] as string[],
    banned_vocabulary: [] as string[],
    slang_or_expressions: '',
    preferred_length: 'medio' as 'micro' | 'corto' | 'medio' | 'largo',
    preferred_cta_style: 'directo' as 'directo' | 'suave' | 'urgencia' | 'curiosidad' | 'exclusividad',
    narrative_structure: 'problema_solucion' as string,
    content_priority: 'educativo' as 'educativo' | 'opinion' | 'storytelling' | 'venta_encubierta' | 'viral_corto',
    // CAPA 6 — OBJECIONES Y BLOQUEOS
    common_objections: '',
    time_objection: '',
    credibility_objection: '',
    competition_objection: '',
    self_doubt: '',
    // CAPA 7 — TRIGGERS EMOCIONALES
    emotional_triggers: '',
    urgency_trigger: '',
    status_trigger: '',
    belonging_trigger: '',
    loss_fear_trigger: '',
    // PROHIBICIONES
    prohibitions: {
      lenguaje_vulgar: false,
      promesas_exageradas: false,
      polemica_barata: false,
      clickbait_engañoso: false,
      venta_agresiva: false,
      comparaciones_directas: false,
      contenido_negativo: false
    },
    // CAPA OLIMPO — AUDIENCIA PROFUNDA
    awareness_level: '' as string,
    change_resistance: 'media' as string,
    audience_temperature: 'tibio' as string,
    internal_tone: '' as string,
    timeline_expectation: '' as string,
    social_pain: '' as string,
    transformation_point_a: '' as string,
    internal_obstacle: '' as string,
    external_obstacle: '' as string,
    emotional_friction: '' as string,
  });

  useEffect(() => { if (user?.id) fetchAvatars(); }, [user?.id]);

  const fetchAvatars = async (forceSelect = false) => {
    try {
      const { data } = await supabase.from('avatars').select('*').eq('user_id', user?.id).order('created_at', { ascending: false });
      if (data) {
        setAvatarsList(data);
        const yaHaySeleccionado = selectedAvatarId !== null;
        if (!yaHaySeleccionado || forceSelect) {
          const active = data.find((a: any) => a.is_active);
          if (active) selectAvatar(active);
          else if (data.length > 0) selectAvatar(data[0]);
        }
      }
    } catch (e) { console.error('Error fetching avatars:', e); }
  };
  const selectAvatar = (avatar: any) => {
    setSelectedAvatarId(avatar.id);
    setFormData({
      name: avatar.name || '', is_active: avatar.is_active ?? true,
      person_type: avatar.person_type || 'creador_contenido',
      experience_level: avatar.experience_level || 'intermedio',
      country_culture: avatar.country_culture || '', industry: avatar.industry || '',
      primary_goal: avatar.primary_goal || 'autoridad',
      secondary_goals: avatar.secondary_goals || [],
      success_model: avatar.success_model || 'educador_serio',
      risk_level: avatar.risk_level || 'balanceado',
      central_pain: avatar.central_pain || '', frustrations: avatar.frustrations || '',
      recurring_obstacles: avatar.recurring_obstacles || '',
      hidden_fears: avatar.hidden_fears || '', stagnation_feeling: avatar.stagnation_feeling || '',
      hidden_desire: avatar.hidden_desire || '',
      dominant_emotion: avatar.dominant_emotion || 'curiosidad',
      dream_outcome: avatar.dream_outcome || '', status_aspiration: avatar.status_aspiration || '',
      communication_style: avatar.communication_style || 'didactico',
      formality_level: avatar.formality_level || 'semiformial',
      mental_rhythm: avatar.mental_rhythm || 'moderado',
      signature_vocabulary: avatar.signature_vocabulary || [],
      banned_vocabulary: avatar.banned_vocabulary || [],
      slang_or_expressions: avatar.slang_or_expressions || '',
      preferred_length: avatar.preferred_length || 'medio',
      preferred_cta_style: avatar.preferred_cta_style || 'directo',
      narrative_structure: avatar.narrative_structure || 'problema_solucion',
      content_priority: avatar.content_priority || 'educativo',
      common_objections: avatar.common_objections || '',
      time_objection: avatar.time_objection || '',
      credibility_objection: avatar.credibility_objection || '',
      competition_objection: avatar.competition_objection || '',
      self_doubt: avatar.self_doubt || '',
      emotional_triggers: avatar.emotional_triggers || '',
      urgency_trigger: avatar.urgency_trigger || '',
      status_trigger: avatar.status_trigger || '',
      belonging_trigger: avatar.belonging_trigger || '',
      loss_fear_trigger: avatar.loss_fear_trigger || '',
      prohibitions: avatar.prohibitions || { lenguaje_vulgar: false, promesas_exageradas: false, polemica_barata: false, clickbait_engañoso: false, venta_agresiva: false, comparaciones_directas: false, contenido_negativo: false },
      awareness_level: avatar.awareness_level || '',
      change_resistance: avatar.change_resistance || 'media',
      audience_temperature: avatar.audience_temperature || 'tibio',
      internal_tone: avatar.internal_tone || '',
      timeline_expectation: avatar.timeline_expectation || '',
      social_pain: avatar.social_pain || '',
      transformation_point_a: avatar.transformation_point_a || '',
      internal_obstacle: avatar.internal_obstacle || '',
      external_obstacle: avatar.external_obstacle || '',
      emotional_friction: avatar.emotional_friction || '',
    });
  };

  const handleNewAvatar = () => {
    setSelectedAvatarId(null);
    setFormData({ name: '', is_active: true, person_type: 'creador_contenido', experience_level: 'intermedio', country_culture: '', industry: '', primary_goal: 'autoridad', secondary_goals: [], success_model: 'educador_serio', risk_level: 'balanceado', central_pain: '', frustrations: '', recurring_obstacles: '', hidden_fears: '', stagnation_feeling: '', hidden_desire: '', dominant_emotion: 'curiosidad', dream_outcome: '', status_aspiration: '', communication_style: 'didactico', formality_level: 'semiformial', mental_rhythm: 'moderado', signature_vocabulary: [], banned_vocabulary: [], slang_or_expressions: '', preferred_length: 'medio', preferred_cta_style: 'directo', narrative_structure: 'problema_solucion', content_priority: 'educativo', common_objections: '', time_objection: '', credibility_objection: '', competition_objection: '', self_doubt: '', emotional_triggers: '', urgency_trigger: '', status_trigger: '', belonging_trigger: '', loss_fear_trigger: '', prohibitions: { lenguaje_vulgar: false, promesas_exageradas: false, polemica_barata: false, clickbait_engañoso: false, venta_agresiva: false, comparaciones_directas: false, contenido_negativo: false } });
  };

  const handleSave = async () => {
    if (!formData.name) return alert('⚠️ El nombre del avatar es obligatorio');
    setLoading(true);
    try {
      if (formData.is_active) await supabase.from('avatars').update({ is_active: false }).eq('user_id', user?.id);
      const dataToSave = { ...formData, user_id: user?.id, updated_at: new Date().toISOString() };
      let result;
      if (selectedAvatarId) {
        result = await supabase.from('avatars').update(dataToSave).eq('id', selectedAvatarId).select().single();
      } else {
        result = await supabase.from('avatars').insert(dataToSave).select().single();
      }
      if (result.error) throw result.error;
      if (formData.is_active && result.data) {
        await supabase.from('profiles').update({ active_avatar_id: result.data.id }).eq('id', user?.id);
      }
      if (refreshProfile) refreshProfile();
      await fetchAvatars(true);
      alert('✅ Avatar guardado exitosamente');
    } catch (e: any) { alert(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  const handleAudit = async () => {
    if (!formData.name) return alert('⚠️ Ponle nombre antes de auditar.');
    setLoading(true);
    try {
      const avatarPayload = {
        capa1_identidad: { name: formData.name, person_type: formData.person_type, experience_level: formData.experience_level, country_culture: formData.country_culture, industry: formData.industry },
        capa2_objetivo: { primary_goal: formData.primary_goal, secondary_goals: formData.secondary_goals, success_model: formData.success_model, risk_level: formData.risk_level },
        capa3_dolor: { central_pain: formData.central_pain, frustrations: formData.frustrations, recurring_obstacles: formData.recurring_obstacles, hidden_fears: formData.hidden_fears, stagnation_feeling: formData.stagnation_feeling },
        capa4_deseo: { hidden_desire: formData.hidden_desire, dominant_emotion: formData.dominant_emotion, dream_outcome: formData.dream_outcome, status_aspiration: formData.status_aspiration },
        capa5_lenguaje: { communication_style: formData.communication_style, formality_level: formData.formality_level, mental_rhythm: formData.mental_rhythm, signature_vocabulary: formData.signature_vocabulary, banned_vocabulary: formData.banned_vocabulary, slang_or_expressions: formData.slang_or_expressions, preferred_length: formData.preferred_length, preferred_cta_style: formData.preferred_cta_style, narrative_structure: formData.narrative_structure },
        capa6_objeciones: { common_objections: formData.common_objections, time_objection: formData.time_objection, credibility_objection: formData.credibility_objection, competition_objection: formData.competition_objection, self_doubt: formData.self_doubt },
        capa7_triggers: { emotional_triggers: formData.emotional_triggers, urgency_trigger: formData.urgency_trigger, status_trigger: formData.status_trigger, belonging_trigger: formData.belonging_trigger, loss_fear_trigger: formData.loss_fear_trigger },
        config: { content_priority: formData.content_priority, prohibitions: formData.prohibitions }
      };
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: { selectedMode: 'audit_avatar', transcript: JSON.stringify(avatarPayload), estimatedCost: 2 }
      });
      if (error) throw error;
      const res = data.generatedData || data.result || "Análisis completado.";
      alert(`🛡️ VEREDICTO TITAN:\n\n${typeof res === 'string' ? res : JSON.stringify(res, null, 2)}`);
    } catch (e: any) { console.error(e); alert("Error de conexión. Revisa que tu Edge Function esté activa."); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!selectedAvatarId || !confirm('¿Eliminar este avatar?')) return;
    try {
      await supabase.from('avatars').delete().eq('id', selectedAvatarId);
      handleNewAvatar(); await fetchAvatars(true);
      if (refreshProfile) refreshProfile();
    } catch (e) { console.error('Error deleting avatar:', e); }
  };

  const handleGenerateWithAI = async () => {
    if (!nicheInput.trim()) return alert("Escribe tu nicho.");
    setGenerating(true);
    try {
      const n = nicheInput.toLowerCase();
      let style: any = 'didactico', goal: any = 'autoridad', emotion: any = 'curiosidad';
      if (n.includes('fitness')) { style = 'inspirador'; goal = 'comunidad'; emotion = 'aspiracion'; }
      else if (n.includes('marketing')) { style = 'directo'; goal = 'venta'; emotion = 'deseo'; }
      else if (n.includes('crypto') || n.includes('inversión')) { style = 'analitico'; goal = 'autoridad'; emotion = 'miedo'; }
      setFormData(prev => ({
        ...prev, name: `Experto en ${nicheInput}`, communication_style: style, primary_goal: goal,
        dominant_emotion: emotion, signature_vocabulary: ['estrategia', nicheInput],
        experience_level: 'avanzado', industry: nicheInput,
        central_pain: `Dificultad para destacar en ${nicheInput}`,
        hidden_desire: `Ser la referencia #1 en ${nicheInput}`,
        urgency_trigger: 'El mercado cambia rápido y quien no se posiciona hoy, pierde',
        content_priority: 'educativo'
      }));
      setShowGenerator(false);
      alert("✅ Perfil base generado. Completa las 7 capas para máximo poder.");
    } catch (e) { console.error(e); }
    finally { setGenerating(false); }
  };

  const layerComplete = (num: number) => {
    if (num === 1) return !!(formData.name && formData.industry);
    if (num === 2) return !!(formData.primary_goal && formData.success_model);
    if (num === 3) return !!(formData.central_pain && formData.frustrations);
    if (num === 4) return !!(formData.hidden_desire && formData.dream_outcome);
    if (num === 5) return !!(formData.communication_style && formData.slang_or_expressions);
    if (num === 6) return !!(formData.common_objections && formData.time_objection);
    if (num === 7) return !!(formData.urgency_trigger && formData.belonging_trigger);
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-end gap-4 pt-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <Shield size={12} /> Avatar Core — 7 Capas Olimpo Absoluto
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">ADN COGNITIVO</h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Modelo cognitivo + emocional + lingüístico que filtra TODAS las funciones de Titan
          </p>
        </div>
        <div className="flex gap-2">
          <select
            onChange={(e) => { const s = avatarsList.find((a: any) => a.id === e.target.value); if (s) selectAvatar(s); }}
            value={selectedAvatarId || ''}
            className="bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none"
          >
            <option value="" disabled>Seleccionar Avatar...</option>
            {avatarsList.map((a: any) => (
              <option key={a.id} value={a.id}>{a.name} {a.is_active ? '(Activo)' : ''}</option>
            ))}
          </select>
          <button onClick={handleNewAvatar} className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* GENERADOR IA */}
      {!selectedAvatarId && !showGenerator && (
        <button onClick={() => setShowGenerator(true)} className="w-full py-4 mb-6 border border-dashed border-gray-700 rounded-2xl text-gray-400 hover:border-indigo-500 hover:text-white transition-all flex justify-center items-center gap-2">
          <Zap size={16} className="text-yellow-500" /> Asistente de Creación con IA
        </button>
      )}
      {showGenerator && (
        <div className="bg-indigo-900/10 border border-indigo-500/30 p-6 rounded-2xl flex gap-3 mb-6 animate-in slide-in-from-top-2">
          <input type="text" value={nicheInput} onChange={e => setNicheInput(e.target.value)} placeholder="Ej: Coach de Marketing para emprendedores..." className="flex-1 bg-black/50 border border-gray-700 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500" />
          <button onClick={handleGenerateWithAI} disabled={generating} className="bg-white text-black font-bold px-6 rounded-xl hover:bg-gray-200">{generating ? 'Generando...' : 'Generar'}</button>
          <button onClick={() => setShowGenerator(false)} className="text-gray-500 hover:text-white">Cancelar</button>
        </div>
      )}

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* FORMULARIO */}
        <div className="lg:col-span-8 space-y-6">

          {/* TABS */}
          <div className="flex gap-2 bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
            {[
              { id: 'core', label: 'Capas 1–4 (Core)', icon: Shield, color: 'indigo' },
              { id: 'advanced', label: 'Capas 5–7 (Potencia)', icon: Brain, color: 'purple' },
              { id: 'evolution', label: 'Evolución', icon: TrendingUp, color: 'cyan' }
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              const bgMap: any = { indigo: 'bg-indigo-600', purple: 'bg-purple-600', cyan: 'bg-cyan-600' };
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${active ? `${bgMap[tab.color]} text-white shadow-lg` : 'text-gray-500 hover:text-white'}`}>
                  <Icon size={14} className="inline mr-1" />{tab.label}
                </button>
              );
            })}
          </div>

          {/* CONTENIDO TABS */}
          <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[600px]">

            {/* ---- TAB CORE: CAPAS 1,2,3,4 ---- */}
            {activeTab === 'core' && (
              <div className="space-y-8 animate-in fade-in">

                {/* CAPA 1 — IDENTIDAD BASE */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">1</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Identidad Base</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Marco mental del avatar</span>
                    {layerComplete(1) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-indigo-900/40">
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nombre del Avatar *</label>
                      <input type="text" value={formData.name} onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} className="input-avatar" placeholder="Ej: El Mentor Digital, Coach Premium..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tipo de Persona</label>
                        <select value={formData.person_type} onChange={e => setFormData(prev => ({...prev, person_type: e.target.value as any}))} className="input-avatar">
                          <option value="creador_contenido">Creador de Contenido</option>
                          <option value="emprendedor">Emprendedor</option>
                          <option value="marca_personal">Marca Personal</option>
                          <option value="empresa">Empresa</option>
                          <option value="profesional_independiente">Profesional Independiente</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nivel de Experiencia</label>
                        <select value={formData.experience_level} onChange={e => setFormData(prev => ({...prev, experience_level: e.target.value as any}))} className="input-avatar">
                          <option value="principiante">Principiante</option>
                          <option value="intermedio">Intermedio</option>
                          <option value="avanzado">Avanzado</option>
                          <option value="experto">Experto</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">País / Cultura</label>
                        <input type="text" value={formData.country_culture} onChange={e => setFormData(prev => ({...prev, country_culture: e.target.value}))} className="input-avatar" placeholder="Ej: México, España, Latam..." />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Industria / Nicho</label>
                        <input type="text" value={formData.industry} onChange={e => setFormData(prev => ({...prev, industry: e.target.value}))} className="input-avatar" placeholder="Ej: Marketing Digital, Fitness..." />
                      </div>
                    </div>
                    <div className={`p-4 rounded-xl border transition-colors ${formData.is_active ? 'bg-green-900/10 border-green-500/30' : 'bg-gray-900 border-gray-800'}`}>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData(prev => ({...prev, is_active: e.target.checked}))} className="w-5 h-5 accent-green-500" />
                        <div className="flex-1">
                          <span className="text-white font-bold text-sm block">Avatar Activo</span>
                          <span className="text-gray-400 text-xs">Controla TODAS las funciones de Titan</span>
                        </div>
                        {formData.is_active ? <Unlock className="text-green-400" size={18} /> : <Lock className="text-gray-500" size={18} />}
                      </label>
                    </div>
                  </div>
                </div>

                {/* CAPA 2 — OBJETIVO PRINCIPAL */}
                <div className="border-t border-gray-800 pt-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-black">2</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Objetivo Principal</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Un solo objetivo por ejecución</span>
                    {layerComplete(2) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-purple-900/40">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                        <label className="text-[10px] font-black text-purple-400 uppercase mb-2 block"><Target size={11} className="inline mr-1" />Objetivo Activo *</label>
                        <select value={formData.primary_goal} onChange={e => setFormData(prev => ({...prev, primary_goal: e.target.value as any}))} className="input-avatar">
                          <option value="autoridad">Autoridad</option>
                          <option value="viralidad">Viralidad</option>
                          <option value="venta">Venta</option>
                          <option value="comunidad">Comunidad</option>
                          <option value="posicionamiento">Posicionamiento</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nivel de Riesgo</label>
                        <select value={formData.risk_level} onChange={e => setFormData(prev => ({...prev, risk_level: e.target.value as any}))} className="input-avatar">
                          <option value="conservador">Conservador</option>
                          <option value="balanceado">Balanceado</option>
                          <option value="agresivo">Agresivo</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                      <label className="text-[10px] font-black text-indigo-400 uppercase mb-3 block"><Crown size={11} className="inline mr-1" />Modelo de Éxito (Referencia Cognitiva)</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: 'educador_serio', label: 'Educador Serio', ex: 'Gary Vee, Neil Patel' },
                          { value: 'empresario_premium', label: 'Empresario Premium', ex: 'Hormozi, Cardone' },
                          { value: 'influencer_agresivo', label: 'Influencer Agresivo', ex: 'Dan Lok, Tai Lopez' },
                          { value: 'mentor_disruptivo', label: 'Mentor Disruptivo', ex: 'Brunson, Robbins' },
                          { value: 'experto_tecnico', label: 'Experto Técnico', ex: 'Ferriss, Naval' },
                          { value: 'creativo_viral', label: 'Creativo Viral', ex: 'MrBeast, Casey N.' }
                        ].map(m => (
                          <button key={m.value} onClick={() => setFormData(prev => ({...prev, success_model: m.value as any})}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${formData.success_model === m.value ? 'border-indigo-500 bg-indigo-500/20' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}>
                            <p className="text-white font-bold text-xs mb-1">{m.label}</p>
                            <p className="text-gray-400 text-[10px]">{m.ex}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CAPA OLIMPO — AUDIENCIA PROFUNDA */}
<div className="border-t border-gray-800 pt-8">
  <div className="flex items-center gap-2 mb-5">
    <div className="w-7 h-7 rounded-full bg-yellow-600 flex items-center justify-center text-white text-xs font-black">★</div>
    <h3 className="text-white font-black text-sm uppercase tracking-wider">Audiencia Profunda (Olimpo)</h3>
    {layerComplete(8) && <span className="ml-auto text-[10px] text-yellow-400 font-black">✓ ACTIVA</span>}
  </div>
  <div className="space-y-4 pl-3 border-l border-yellow-900/40">
    
    {/* Nivel de Conciencia — EL MÁS CRÍTICO */}
    <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20">
      <label className="text-[10px] font-black text-yellow-400 uppercase mb-3 block">
        🧠 Nivel de Conciencia del Problema (CRÍTICO)
      </label>
      <div className="space-y-2">
        {[
          { v: 'inconsciente', l: '1️⃣ Inconsciente', d: 'No sabe que tiene el problema' },
          { v: 'consciente_problema', l: '2️⃣ Consciente del Problema', d: 'Sabe que sufre, no sabe por qué' },
          { v: 'consciente_solucion', l: '3️⃣ Consciente de Soluciones', d: 'Buscando opciones, no ha decidido' },
          { v: 'consciente_producto', l: '4️⃣ Conoce tu Producto', d: 'Te conoce pero no ha comprado' },
          { v: 'listo_decidir', l: '5️⃣ Listo para Decidir', d: 'Solo necesita el empujón final' },
        ].map(opt => (
          <button key={opt.v} onClick={() => setFormData(prev => ({...prev, awareness_level: opt.v as any})}
            className={`w-full p-3 rounded-lg border text-left transition-all ${formData.awareness_level === opt.v ? 'border-yellow-500 bg-yellow-500/20' : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'}`}>
            <p className="text-white font-bold text-xs">{opt.l}</p>
            <p className="text-gray-400 text-[10px]">{opt.d}</p>
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Resistencia al Cambio</label>
        <select value={formData.change_resistance || 'media'} onChange={e => setFormData(prev => ({...prev, change_resistance: e.target.value as any}))} className="input-avatar">
          <option value="baja">Baja — Listo para actuar</option>
          <option value="media">Media — Necesita evidencia</option>
          <option value="alta">Alta — Escéptico, resistente</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Temperatura de Audiencia</label>
        <select value={formData.audience_temperature || 'tibio'} onChange={e => setFormData(prev => ({...prev, audience_temperature: e.target.value as any}))} className="input-avatar">
          <option value="frio">❄️ Fría — No te conoce</option>
          <option value="tibio">🌤 Tibia — Te conoce algo</option>
          <option value="caliente">🔥 Caliente — Lista para comprar</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Tono Interno del Avatar</label>
        <select value={formData.internal_tone || ''} onChange={e => setFormData(prev => ({...prev, internal_tone: e.target.value as any}))} className="input-avatar">
          <option value="">Sin definir</option>
          <option value="victima">Víctima — Se siente atrapado</option>
          <option value="ambicioso">Ambicioso — Quiere más</option>
          <option value="confundido">Confundido — No sabe cómo</option>
          <option value="frustrado">Frustrado — Lo intentó y falló</option>
          <option value="esperanzado">Esperanzado — Cree que puede</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Horizonte Temporal</label>
        <select value={formData.timeline_expectation || ''} onChange={e => setFormData(prev => ({...prev, timeline_expectation: e.target.value}))} className="input-avatar">
          <option value="">Sin definir</option>
          <option value="inmediato">Inmediato (ya mismo)</option>
          <option value="30_dias">30 días</option>
          <option value="3_meses">3 meses</option>
          <option value="6_meses">6 meses</option>
          <option value="1_anio">1 año o más</option>
        </select>
      </div>
    </div>

    <div>
      <label className="text-[10px] font-black text-red-300 uppercase mb-2 block">Dolor Social (¿qué teme que otros piensen?)</label>
      <textarea value={formData.social_pain || ''} onChange={e => setFormData(prev => ({...prev, social_pain: e.target.value}))} className="textarea-avatar h-16" placeholder="Ej: Teme que sus amigos lo vean como un fracasado..." />
    </div>
    
    {/* Mapa de Transformación */}
    <div className="bg-indigo-900/10 p-4 rounded-xl border border-indigo-500/20">
      <label className="text-[10px] font-black text-indigo-400 uppercase mb-3 block">🗺️ Mapa de Transformación</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Punto A — Estado actual exacto</label>
          <textarea value={formData.transformation_point_a || ''} onChange={e => setFormData(prev => ({...prev, transformation_point_a: e.target.value}))} className="textarea-avatar h-16" placeholder="Ej: Publica sin estrategia, 200 seguidores, sin ventas..." />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Obstáculo Interno</label>
          <textarea value={formData.internal_obstacle || ''} onChange={e => setFormData(prev => ({...prev, internal_obstacle: e.target.value}))} className="textarea-avatar h-16" placeholder="Ej: Cree que no es lo suficientemente bueno..." />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Obstáculo Externo</label>
          <textarea value={formData.external_obstacle || ''} onChange={e => setFormData(prev => ({...prev, external_obstacle: e.target.value}))} className="textarea-avatar h-16" placeholder="Ej: No tiene presupuesto para ads, falta tiempo..." />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Fricción Emocional</label>
          <textarea value={formData.emotional_friction || ''} onChange={e => setFormData(prev => ({...prev, emotional_friction: e.target.value}))} className="textarea-avatar h-16" placeholder="Ej: Miedo al rechazo al publicar, parálisis por análisis..." />
        </div>
      </div>
    </div>

  </div>
</div>

                {/* CAPA 3 — DOLOR CENTRAL */}
                <div className="border-t border-gray-800 pt-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-black">3</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Dolor Central</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Qué le duele hoy</span>
                    {layerComplete(3) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-red-900/40">
                    <div>
                      <label className="text-[10px] font-black text-red-400 uppercase mb-2 block"><Zap size={11} className="inline mr-1" />Dolor Principal (en sus palabras)</label>
                      <textarea value={formData.central_pain} onChange={e => setFormData(prev => ({...prev, central_pain: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Publico todos los días pero nadie me presta atención..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-orange-400 uppercase mb-2 block">Frustraciones Actuales</label>
                        <textarea value={formData.frustrations} onChange={e => setFormData(prev => ({...prev, frustrations: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Invierto tiempo sin ver resultados..." />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-orange-400 uppercase mb-2 block">Obstáculos Recurrentes</label>
                        <textarea value={formData.recurring_obstacles} onChange={e => setFormData(prev => ({...prev, recurring_obstacles: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: No sé qué publicar, falta consistencia..." />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-red-300 uppercase mb-2 block">Miedos No Expresados</label>
                        <textarea value={formData.hidden_fears} onChange={e => setFormData(prev => ({...prev, hidden_fears: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Miedo a ser ignorado, al rechazo..." />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-red-300 uppercase mb-2 block">Sensación de Estancamiento</label>
                        <textarea value={formData.stagnation_feeling} onChange={e => setFormData(prev => ({...prev, stagnation_feeling: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Hago lo mismo siempre y no avanzo..." />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CAPA 4 — DESEO OCULTO */}
                <div className="border-t border-gray-800 pt-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-black">4</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Deseo Oculto</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Motor emocional del contenido</span>
                    {layerComplete(4) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-cyan-900/40">
                    <div>
                      <label className="text-[10px] font-black text-cyan-400 uppercase mb-2 block"><Heart size={11} className="inline mr-1" />Deseo Que No Dice en Voz Alta</label>
                      <textarea value={formData.hidden_desire} onChange={e => setFormData(prev => ({...prev, hidden_desire: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Quiere reconocimiento y ser la referencia #1..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20">
                        <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block"><Flame size={11} className="inline mr-1" />Emoción Dominante</label>
                        <select value={formData.dominant_emotion} onChange={e => setFormData(prev => ({...prev, dominant_emotion: e.target.value as any}))} className="input-avatar">
                          <option value="curiosidad">Curiosidad</option>
                          <option value="deseo">Deseo</option>
                          <option value="miedo">Miedo</option>
                          <option value="aspiracion">Aspiración</option>
                          <option value="autoridad">Autoridad</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Aspiración de Estatus</label>
                        <textarea value={formData.status_aspiration} onChange={e => setFormData(prev => ({...prev, status_aspiration: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Ser invitado a podcasts, hablar en eventos..." />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-cyan-300 uppercase mb-2 block">Resultado Soñado Específico</label>
                      <textarea value={formData.dream_outcome} onChange={e => setFormData(prev => ({...prev, dream_outcome: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: 100k seguidores y 5 clientes premium al mes..." />
                    </div>
                  </div>
                </div>

              </div>
            )}
            {/* FIN TAB CORE */}

            {/* ---- TAB AVANZADO: CAPAS 5,6,7 + PROHIBICIONES ---- */}
            {activeTab === 'advanced' && (
              <div className="space-y-8 animate-in fade-in">

                {/* CAPA 5 — LENGUAJE NATURAL */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-black">5</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Lenguaje Natural</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Cómo habla y piensa el avatar</span>
                    {layerComplete(5) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-green-900/40">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Estilo Comunicativo</label>
                        <select value={formData.communication_style} onChange={e => setFormData(prev => ({...prev, communication_style: e.target.value as any}))} className="input-avatar">
                          <option value="directo">Directo</option>
                          <option value="analitico">Analítico</option>
                          <option value="inspirador">Inspirador</option>
                          <option value="provocador">Provocador</option>
                          <option value="didactico">Didáctico</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nivel de Formalidad</label>
                        <select value={formData.formality_level} onChange={e => setFormData(prev => ({...prev, formality_level: e.target.value as any}))} className="input-avatar">
                          <option value="coloquial">Coloquial</option>
                          <option value="semiformial">Semiformal</option>
                          <option value="formal">Formal</option>
                          <option value="academico">Académico</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Ritmo Mental</label>
                        <select value={formData.mental_rhythm} onChange={e => setFormData(prev => ({...prev, mental_rhythm: e.target.value as any}))} className="input-avatar">
                          <option value="rapido">Rápido / Frenético</option>
                          <option value="moderado">Moderado</option>
                          <option value="reflexivo">Reflexivo</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Jerga / Expresiones del Nicho</label>
                      <textarea value={formData.slang_or_expressions} onChange={e => setFormData(prev => ({...prev, slang_or_expressions: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: funnel, engagement, postear, escalar, ROI..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-green-400 uppercase mb-2 block">Vocabulario Característico (Sí usa)</label>
                        <textarea value={formData.signature_vocabulary.join(', ')} onChange={e => setFormData(prev => ({...prev, signature_vocabulary: e.target.value.split(',').map((w:string)=>w.trim()).filter(Boolean)}))} className="textarea-avatar h-20" placeholder="Ej: momentum, leverage, ecosistema..." />
                        <p className="text-xs text-gray-500 mt-1">Separa por comas</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-red-400 uppercase mb-2 block">Vocabulario Prohibido (NUNCA usa)</label>
                        <textarea value={formData.banned_vocabulary.join(', ')} onChange={e => setFormData(prev => ({...prev, banned_vocabulary: e.target.value.split(',').map((w:string)=>w.trim()).filter(Boolean)}))} className="textarea-avatar h-20" placeholder="Ej: gratis, secreto, hack, explosivo..." />
                        <p className="text-xs text-gray-500 mt-1">Separa por comas</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Estructura Narrativa</label>
                        <select value={formData.narrative_structure} onChange={e => setFormData(prev => ({...prev, narrative_structure: e.target.value}))} className="input-avatar">
                          <option value="problema_solucion">Problema → Solución</option>
                          <option value="hero_journey">Hero's Journey</option>
                          <option value="antes_despues">Antes → Después</option>
                          <option value="enemigo_comun">Enemigo Común</option>
                          <option value="revelacion_secreta">Revelación Secreta</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Longitud Preferida</label>
                        <select value={formData.preferred_length} onChange={e => setFormData(prev => ({...prev, preferred_length: e.target.value as any}))} className="input-avatar">
                          <option value="micro">Micro (&lt;30s)</option>
                          <option value="corto">Corto (30-60s)</option>
                          <option value="medio">Medio (1-3 min)</option>
                          <option value="largo">Largo (3+ min)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Estilo de CTA</label>
                        <select value={formData.preferred_cta_style} onChange={e => setFormData(prev => ({...prev, preferred_cta_style: e.target.value as any}))} className="input-avatar">
                          <option value="directo">Directo</option>
                          <option value="suave">Suave</option>
                          <option value="urgencia">Urgencia</option>
                          <option value="curiosidad">Curiosidad</option>
                          <option value="exclusividad">Exclusividad</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20">
                      <label className="text-[10px] font-black text-green-400 uppercase mb-2 block"><Zap size={11} className="inline mr-1" />Tipo de Contenido Prioritario</label>
                      <select value={formData.content_priority} onChange={e => setFormData(prev => ({...prev, content_priority: e.target.value as any}))} className="input-avatar">
                        <option value="educativo">Educativo</option>
                        <option value="opinion">Opinión</option>
                        <option value="storytelling">Storytelling</option>
                        <option value="venta_encubierta">Venta Encubierta</option>
                        <option value="viral_corto">Viral Corto</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* CAPA 6 — OBJECIONES Y BLOQUEOS */}
                <div className="border-t border-gray-800 pt-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-black">6</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Objeciones y Bloqueos</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Por qué no actúa</span>
                    {layerComplete(6) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-orange-900/40">
                    <div>
                      <label className="text-[10px] font-black text-orange-400 uppercase mb-2 block"><AlertTriangle size={11} className="inline mr-1" />Objeción Principal</label>
                      <textarea value={formData.common_objections} onChange={e => setFormData(prev => ({...prev, common_objections: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Ya lo intenté antes y no funcionó..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'time_objection', label: 'Objeción de Tiempo', placeholder: 'No tengo tiempo para crear contenido' },
                        { key: 'credibility_objection', label: 'Objeción de Credibilidad', placeholder: 'No tengo suficiente autoridad' },
                        { key: 'competition_objection', label: 'Objeción de Competencia', placeholder: 'Ya hay muchos haciendo lo mismo' },
                        { key: 'self_doubt', label: 'Duda Personal', placeholder: 'No soy bueno frente a cámara' }
                      ].map(obj => (
                        <div key={obj.key}>
                          <label className="text-[10px] font-black text-orange-300 uppercase mb-2 block">{obj.label}</label>
                          <input type="text" value={(formData as any)[obj.key]} onChange={e => setFormData(prev => ({...prev, [obj.key]: e.target.value}))} className="input-avatar" placeholder={`Ej: ${obj.placeholder}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CAPA 7 — TRIGGERS EMOCIONALES */}
                <div className="border-t border-gray-800 pt-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-black">7</div>
                    <h3 className="text-white font-black text-sm uppercase tracking-wider">Triggers Emocionales</h3>
                    <span className="text-[10px] text-gray-600 ml-1">Qué lo hace reaccionar</span>
                    {layerComplete(7) && <span className="ml-auto text-[10px] text-green-400 font-black">✓ ACTIVA</span>}
                  </div>
                  <div className="space-y-4 pl-3 border-l border-yellow-900/40">
                    <div>
                      <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block"><Flame size={11} className="inline mr-1" />Trigger Principal</label>
                      <textarea value={formData.emotional_triggers} onChange={e => setFormData(prev => ({...prev, emotional_triggers: e.target.value}))} className="textarea-avatar h-20" placeholder="Ej: Ver a alguien con menos experiencia ganar más que él..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'urgency_trigger', label: 'Gatillo de Urgencia', color: 'red', placeholder: 'El mercado cambia rápido, quien no actúa pierde' },
                        { key: 'status_trigger', label: 'Gatillo de Estatus', color: 'purple', placeholder: 'Ser reconocido por sus colegas como referente' },
                        { key: 'belonging_trigger', label: 'Gatillo de Pertenencia', color: 'cyan', placeholder: 'Pertenecer a la comunidad top 1%' },
                        { key: 'loss_fear_trigger', label: 'Gatillo de FOMO / Pérdida', color: 'orange', placeholder: 'Miedo a que la competencia llegue primero' }
                      ].map(trig => {
                        const bgMap: any = { red: 'bg-red-900/10 border-red-500/20', purple: 'bg-purple-900/10 border-purple-500/20', cyan: 'bg-cyan-900/10 border-cyan-500/20', orange: 'bg-orange-900/10 border-orange-500/20' };
                        const labelMap: any = { red: 'text-red-400', purple: 'text-purple-400', cyan: 'text-cyan-400', orange: 'text-orange-400' };
                        return (
                          <div key={trig.key} className={`p-4 rounded-xl border ${bgMap[trig.color]}`}>
                            <label className={`text-[10px] font-black ${labelMap[trig.color]} uppercase mb-2 block`}>{trig.label}</label>
                            <input type="text" value={(formData as any)[trig.key]} onChange={e => setFormData(prev => ({...prev, [trig.key]: e.target.value}))} className="input-avatar" placeholder={`Ej: ${trig.placeholder}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PROHIBICIONES */}
                <div className="border-t border-gray-800 pt-8">
                  <div className="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
                    <label className="text-[10px] font-black text-red-400 uppercase mb-3 block"><AlertTriangle size={11} className="inline mr-1" />Prohibiciones del Avatar (Filtro Hard)</label>
                    <p className="text-xs text-gray-400 mb-4">Lo que este avatar JAMÁS haría. El Engine bloquea contenido que las viole.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: 'lenguaje_vulgar', label: 'Lenguaje vulgar o groserías' },
                        { key: 'promesas_exageradas', label: 'Promesas exageradas o irreales' },
                        { key: 'polemica_barata', label: 'Polémica barata sin fundamento' },
                        { key: 'clickbait_engañoso', label: 'Clickbait engañoso' },
                        { key: 'venta_agresiva', label: 'Venta agresiva sin valor previo' },
                        { key: 'comparaciones_directas', label: 'Comparaciones con competencia' },
                        { key: 'contenido_negativo', label: 'Contenido excesivamente negativo' }
                      ].map(p => (
                        <label key={p.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-red-900/10">
                          <input type="checkbox" checked={formData.prohibitions[p.key as keyof typeof formData.prohibitions]} onChange={e => setFormData(prev => ({...prev, prohibitions: {...prev.prohibitions, [p.key]: e.target.checked}}))} className="w-4 h-4" />
                          <span className="text-sm text-gray-300">{p.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
            {/* FIN TAB AVANZADO */}

            {/* ---- TAB EVOLUCIÓN ---- */}
            {activeTab === 'evolution' && (
              <div className="space-y-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-6">
                  <TrendingUp size={20} className="text-cyan-400" /> Estado de las 7 Capas
                </h3>
                <p className="text-gray-400 text-sm">A más capas completas, más poderoso es el filtro cognitivo del Avatar. En modo Olimpo (7/7), el Engine trabaja con máxima precisión.</p>
                <div className="space-y-3">
                  {[
                    { num: 1, label: 'Identidad Base', desc: 'Marco mental del avatar' },
                    { num: 2, label: 'Objetivo Principal', desc: 'Un solo objetivo por ejecución' },
                    { num: 3, label: 'Dolor Central', desc: 'Qué le duele hoy' },
                    { num: 4, label: 'Deseo Oculto', desc: 'Motor emocional' },
                    { num: 5, label: 'Lenguaje Natural', desc: 'Cómo habla y piensa' },
                    { num: 6, label: 'Objeciones y Bloqueos', desc: 'Por qué no actúa' },
                    { num: 7, label: 'Triggers Emocionales', desc: 'Qué lo hace reaccionar' }
                  ].map(layer => {
                    const complete = layerComplete(layer.num);
                    return (
                      <div key={layer.num} className={`flex items-center gap-3 p-4 rounded-xl border ${complete ? 'bg-green-900/10 border-green-500/20' : 'bg-gray-900/50 border-gray-800'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${complete ? 'bg-green-600' : 'bg-gray-700'}`}>
                          {complete ? '✓' : layer.num}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${complete ? 'text-white' : 'text-gray-500'}`}>Capa {layer.num} — {layer.label}</p>
                          <p className="text-[10px] text-gray-600">{layer.desc}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase ${complete ? 'text-green-400' : 'text-gray-700'}`}>{complete ? 'Activa' : 'Incompleta'}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-cyan-400 font-bold text-sm mb-2">🎯 Niveles de Poder</p>
                  <ul className="space-y-2">
                    <li className="text-xs text-gray-300">• 1–3 capas: Filtro básico activo</li>
                    <li className="text-xs text-gray-300">• 4–5 capas: Guiones y copy personalizados</li>
                    <li className="text-xs text-gray-300">• 6–7 capas: <span className="text-cyan-400 font-bold">MODO OLIMPO — Máximo poder</span></li>
                  </ul>
                </div>
              </div>
            )}
            {/* FIN TAB EVOLUCIÓN */}

          </div>
          {/* FIN CONTENIDO TABS */}

          {/* BOTONES DE ACCIÓN */}
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-800">
            <div>
              {selectedAvatarId && (
                <button onClick={handleDelete} className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2">
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleAudit} disabled={loading} className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 font-bold rounded-xl hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2">
                {loading ? <TrendingUp size={18} className="animate-spin" /> : <Shield size={18} />} AUDITAR CON IA
              </button>
              <button onClick={handleSave} disabled={loading} className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg">
                {loading ? <TrendingUp size={18} className="animate-spin" /> : <Save size={18} />} GUARDAR AVATAR
              </button>
            </div>
          </div>

        </div>
        {/* FIN FORMULARIO */}

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <AvatarWidget />
          <MentorStrategic
          alerts={[
          ...(formData.central_pain ? [] : [{ type: 'error', message: 'Dolor Principal vacío', suggestion: 'Sin dolor definido el hook no puede personalizar' }]),
          ...(formData.hidden_desire ? [] : [{ type: 'warning', message: 'Deseo Oculto no definido', suggestion: 'El motor no puede pintar la transformación sin este campo' }]),
          ...(formData.awareness_level ? [] : [{ type: 'warning', message: 'Nivel de Conciencia no definido', suggestion: 'Define el nivel para calibrar hooks y promesas' }]),
          ...(formData.urgency_trigger ? [] : [{ type: 'info', message: 'Trigger de Urgencia vacío', suggestion: 'El CTA pierde fuerza sin un disparador de urgencia' }]),
          ...((formData.central_pain && formData.hidden_desire && formData.urgency_trigger) ? [{ type: 'success', message: '✓ Núcleo Emocional Activo', suggestion: 'Hook, resolución y CTA tienen combustible real' }] : [])
          ].filter(Boolean)}
          />
          <ContextualSuggestions
            avatar={selectedAvatarId ? avatarsList.find((a: any) => a.id === selectedAvatarId) : null}
            currentMode="avatar_config"
          />
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-white font-bold text-sm mb-3">🧠 Las 7 Capas = Poder Total</p>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Cada capa que completes potencia el filtro cognitivo. Guiones, copy, análisis y mentoría leen las 7 capas antes de generar cualquier output.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sin Avatar → modo genérico. Con Avatar 7/7 → modo Olimpo.
            </p>
          </div>
        </div>
        {/* FIN SIDEBAR */}

      </div>

      <style>{`
        .input-avatar, .textarea-avatar {
          width: 100%;
          background-color: rgba(10, 10, 12, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s ease-in-out;
        }
        .input-avatar:hover, .textarea-avatar:hover {
          background-color: rgba(20, 20, 25, 0.8);
          border-color: rgba(99, 102, 241, 0.4);
        }
        .input-avatar:focus, .textarea-avatar:focus {
          border-color: #6366f1;
          background-color: rgba(5, 5, 10, 1);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25), 0 0 15px rgba(99, 102, 241, 0.1);
        }
        .textarea-avatar { resize: none; line-height: 1.6; }
        ::placeholder { color: rgba(156, 163, 175, 0.5); }
      `}</style>

    </div>
  );
};

