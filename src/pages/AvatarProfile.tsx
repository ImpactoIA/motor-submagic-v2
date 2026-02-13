import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
  Save, Plus, Trash2, Shield, Target, Brain, Zap, 
  AlertTriangle, TrendingUp, Crown, MessageSquare,
  Award, Flame, Heart, Lock, Unlock
} from 'lucide-react';

import { AvatarWidget } from '../components/AvatarWidget';
import { MentorStrategic, ContextualSuggestions } from '../components/AvatarComponents';

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
    name: '',
    is_active: true,
    experience_level: 'intermedio' as 'principiante' | 'intermedio' | 'avanzado' | 'experto',
    primary_goal: 'autoridad' as 'viralidad' | 'autoridad' | 'venta' | 'comunidad' | 'posicionamiento',
    communication_style: 'didactico' as 'directo' | 'analitico' | 'inspirador' | 'provocador' | 'didactico',
    risk_level: 'balanceado' as 'conservador' | 'balanceado' | 'agresivo',
    content_priority: 'educativo' as 'educativo' | 'opinion' | 'storytelling' | 'venta_encubierta' | 'viral_corto',
    dominant_emotion: 'curiosidad' as 'curiosidad' | 'deseo' | 'miedo' | 'aspiracion' | 'autoridad',
    
    // ✅ CAPAS OLIMPO (Asegúrate de que estén estas 4 líneas)
    central_pain: '',       // Capa 3
    hidden_desire: '',      // Capa 4
    common_objections: '',  // Capa 6
    emotional_triggers: '', // Capa 7

    success_model: 'educador_serio' as 'educador_serio' | 'empresario_premium' | 'influencer_agresivo' | 'mentor_disruptivo' | 'experto_tecnico' | 'creativo_viral',
    prohibitions: {
      lenguaje_vulgar: false,
      promesas_exageradas: false,
      polemica_barata: false,
      clickbait_engañoso: false,
      venta_agresiva: false,
      comparaciones_directas: false,
      contenido_negativo: false
    },
    signature_vocabulary: [] as string[],
    banned_vocabulary: [] as string[],
    narrative_structure: 'problema_solucion' as string,
    preferred_length: 'medio' as string,
    preferred_cta_style: 'directo' as string,
    secondary_goals: [] as string[]
  });

  useEffect(() => {
    if (user) {
      fetchAvatars();
    }
  }, [user]);

  const fetchAvatars = async () => {
    try {
      const { data } = await supabase
        .from('avatars')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (data) {
        setAvatarsList(data);
        const active = data.find((a: any) => a.is_active);
        if (active) {
          selectAvatar(active);
        } else if (data.length > 0) {
          selectAvatar(data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching avatars:', e);
    }
  };

  const selectAvatar = (avatar: any) => {
    setSelectedAvatarId(avatar.id);
    setFormData({
      name: avatar.name || '',
      is_active: avatar.is_active ?? true,
      experience_level: avatar.experience_level || 'intermedio',
      primary_goal: avatar.primary_goal || 'autoridad',
      communication_style: avatar.communication_style || 'didactico',
      risk_level: avatar.risk_level || 'balanceado',
      content_priority: avatar.content_priority || 'educativo',
      dominant_emotion: avatar.dominant_emotion || 'curiosidad',
      success_model: avatar.success_model || 'educador_serio',
      prohibitions: avatar.prohibitions || {
        lenguaje_vulgar: false,
        promesas_exageradas: false,
        polemica_barata: false,
        clickbait_engañoso: false,
        venta_agresiva: false,
        comparaciones_directas: false,
        contenido_negativo: false
      },
      signature_vocabulary: avatar.signature_vocabulary || [],
      banned_vocabulary: avatar.banned_vocabulary || [],
      narrative_structure: avatar.narrative_structure || 'problema_solucion',
      preferred_length: avatar.preferred_length || 'medio',
      preferred_cta_style: avatar.preferred_cta_style || 'directo',
      secondary_goals: avatar.secondary_goals || [],
      // ✅ PSICOLOGÍA COMPLETA (4 CAMPOS):
      central_pain: avatar.central_pain || '',
      hidden_desire: avatar.hidden_desire || '',
      common_objections: avatar.common_objections || '',
      emotional_triggers: avatar.emotional_triggers || '' // <-- ESTE FALTABA
    });
  };

  const handleNewAvatar = () => {
    setSelectedAvatarId(null);
    setFormData({
      name: '',
      is_active: true,
      experience_level: 'intermedio',
      primary_goal: 'autoridad',
      communication_style: 'didactico',
      risk_level: 'balanceado',
      content_priority: 'educativo',
      dominant_emotion: 'curiosidad',
      success_model: 'educador_serio',
      prohibitions: {
        lenguaje_vulgar: false,
        promesas_exageradas: false,
        polemica_barata: false,
        clickbait_engañoso: false,
        venta_agresiva: false,
        comparaciones_directas: false,
        contenido_negativo: false
      },
      signature_vocabulary: [],
      banned_vocabulary: [],
      narrative_structure: 'problema_solucion',
      preferred_length: 'medio',
      preferred_cta_style: 'directo',
      secondary_goals: [],
      // ✅ PSICOLOGÍA COMPLETA (4 CAMPOS):
      central_pain: '',
      hidden_desire: '',
      common_objections: '',
      emotional_triggers: '' // <-- ESTE FALTABA
    });
  };

  const handleSave = async () => {
    if (!formData.name) {
      return alert('⚠️ El nombre del avatar es obligatorio');
    }

    setLoading(true);
    try {
      if (formData.is_active) {
        await supabase
          .from('avatars')
          .update({ is_active: false })
          .eq('user_id', user?.id);
      }

      const dataToSave = {
        ...formData,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      };

      let result;
      if (selectedAvatarId) {
        result = await supabase
          .from('avatars')
          .update(dataToSave)
          .eq('id', selectedAvatarId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('avatars')
          .insert(dataToSave)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (formData.is_active && result.data) {
     await supabase
    .from('profiles')
    .update({ active_avatar_id: result.data.id })
    .eq('id', user?.id);
  }

      if (refreshProfile) refreshProfile();
      await fetchAvatars();
      alert('✅ Avatar guardado exitosamente');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

    // --- 1. FUNCIÓN DE AUDITORÍA (MANTENER ESTA VERSIÓN) ---
  const handleAudit = async () => {
    if (!formData.name) return alert('⚠️ Ponle nombre antes de auditar.');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-url', {
        body: {
          selectedMode: 'audit_avatar', 
          transcript: JSON.stringify(formData),
          estimatedCost: 1
        }
      });

      if (error) throw error;
      
      const res = data.generatedData || data.result || "Análisis completado.";
      alert(`🛡️ VEREDICTO TITAN:\n\n${typeof res === 'string' ? res : JSON.stringify(res, null, 2)}`);

    } catch (e: any) {
      console.error(e);
      alert("Error de conexión. Revisa que tu Edge Function esté activa.");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FUNCIÓN DE ELIMINACIÓN ---
  const handleDelete = async () => {
    if (!selectedAvatarId || !confirm('¿Eliminar este avatar?')) return;

    try {
      await supabase.from('avatars').delete().eq('id', selectedAvatarId);
      handleNewAvatar();
      await fetchAvatars();
      if (refreshProfile) refreshProfile();
    } catch (e) {
      console.error('Error deleting avatar:', e);
    }
  };

  // --- 3. FUNCIÓN GENERADOR IA ---
  const handleGenerateWithAI = async () => {
    if (!nicheInput.trim()) return alert("Escribe tu nicho.");
    setGenerating(true);
    try {
      const nicheLower = nicheInput.toLowerCase();
      let style: any = 'didactico';
      let goal: any = 'autoridad';
      
      if(nicheLower.includes('fitness')) { style = 'inspirador'; goal = 'comunidad'; }
      else if(nicheLower.includes('marketing')) { style = 'directo'; goal = 'venta'; }

      setFormData(prev => ({
        ...prev,
        name: `Experto en ${nicheInput}`,
        communication_style: style,
        primary_goal: goal,
        signature_vocabulary: ['estrategia', nicheInput],
        experience_level: 'avanzado'
      }));
      setShowGenerator(false);
      alert("✅ Perfil base generado.");
    } catch (e) { 
      console.error(e); 
    } finally { 
      setGenerating(false); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-end gap-4 pt-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <Shield size={12} /> Avatar Core
          </div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 tracking-tighter">
            ADN COGNITIVO
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Define cómo piensa, habla y actúa tu marca en TODAS las funciones de Titan
          </p>
        </div>

        <div className="flex gap-2">
          <select
            onChange={(e) => {
              const selected = avatarsList.find((a: any) => a.id === e.target.value);
              if (selected) selectAvatar(selected);
            }}
            value={selectedAvatarId || ''}
            className="bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none"
          >
            <option value="" disabled>Seleccionar Avatar...</option>
            {avatarsList.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.name} {a.is_active ? '(Activo)' : ''}
              </option>
            ))}
          </select>

          <button
            onClick={handleNewAvatar}
            className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

       {/* BOTÓN ASISTENTE IA */}
{!selectedAvatarId && !showGenerator && (
  <button onClick={() => setShowGenerator(true)} className="w-full py-4 mb-6 border border-dashed border-gray-700 rounded-2xl text-gray-400 hover:border-indigo-500 hover:text-white transition-all flex justify-center items-center gap-2">
    <Zap size={16} className="text-yellow-500"/> Asistente de Creación con IA
  </button>
)}

{/* INPUT DEL GENERADOR */}
{showGenerator && (
  <div className="bg-indigo-900/10 border border-indigo-500/30 p-6 rounded-2xl flex gap-3 mb-6 animate-in slide-in-from-top-2">
    <input 
      type="text" 
      value={nicheInput} 
      onChange={e => setNicheInput(e.target.value)} 
      placeholder="Ej: Coach de Marketing para emprendedores..." 
      className="flex-1 bg-black/50 border border-gray-700 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500"
    />
    <button onClick={handleGenerateWithAI} disabled={generating} className="bg-white text-black font-bold px-6 rounded-xl hover:bg-gray-200">
      {generating ? 'Generando...' : 'Generar'}
    </button>
    <button onClick={() => setShowGenerator(false)} className="text-gray-500 hover:text-white">Cancelar</button>
  </div>
)}

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* FORMULARIO (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
            <button
              onClick={() => setActiveTab('core')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'core' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Shield size={14} className="inline mr-1" /> Core (Obligatorio)
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'advanced' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Brain size={14} className="inline mr-1" /> Avanzado
            </button>
            <button
              onClick={() => setActiveTab('evolution')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'evolution' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
              }`}
            >
              <TrendingUp size={14} className="inline mr-1" /> Evolución
            </button>
          </div>

          {/* CONTENIDO TABS */}
          <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[600px]">

           {/* TAB: CORE — EL OLIMPO ABSOLUTO */}
{activeTab === 'core' && (
  <div className="space-y-6 animate-in fade-in">
    
    {/* CAPA 1: IDENTIDAD BASE */}
    <div>
      <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
        Nombre del Avatar *
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input-avatar"
        placeholder="Ej: El Mentor Digital, Coach Premium..."
      />
    </div>

    {/* CAPA 3 Y 4: PSICOLOGÍA PROFUNDA (DOLOR Y DESEO) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t border-gray-800 pt-8">
      <div>
        <label className="text-[10px] font-black text-red-400 uppercase mb-2 block flex items-center gap-2">
          <Zap size={12} /> Capa 3: Dolor Central (¿Qué le duele hoy?)
        </label>
        <textarea
          value={formData.central_pain}
          onChange={(e) => setFormData({ ...formData, central_pain: e.target.value })}
          className="textarea-avatar h-28"
          placeholder="Ej: Siento que publico y nadie me hace caso..."
        />
      </div>

      <div>
        <label className="text-[10px] font-black text-cyan-400 uppercase mb-2 block flex items-center gap-2">
          <Heart size={12} /> Capa 4: Deseo Oculto (Motor emocional)
        </label>
        <textarea
          value={formData.hidden_desire}
          onChange={(e) => setFormData({ ...formData, hidden_desire: e.target.value })}
          className="textarea-avatar h-28"
          placeholder="Ej: Autoridad absoluta y libertad financiera..."
        />
      </div>
    </div>

    {/* CAPA 6 Y 7: BLOQUEOS Y DISPARADORES */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-[10px] font-black text-orange-400 uppercase mb-2 block flex items-center gap-2">
          <AlertTriangle size={12} /> Capa 6: Objeciones (¿Por qué no actúa?)
        </label>
        <textarea
          value={formData.common_objections}
          onChange={(e) => setFormData({ ...formData, common_objections: e.target.value })}
          className="textarea-avatar h-24"
          placeholder="Ej: 'No tengo tiempo', 'Ya lo intenté antes'..."
        />
      </div>
      <div>
        <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block flex items-center gap-2">
          <Flame size={12} /> Capa 7: Triggers (Gatillos de Reacción)
        </label>
        <textarea
          value={formData.emotional_triggers}
          onChange={(e) => setFormData({ ...formData, emotional_triggers: e.target.value })}
          className="textarea-avatar h-24"
          placeholder="Ej: Miedo a perderse la oportunidad (FOMO), estatus social..."
        />
      </div>
    </div>

    {/* ESTADO ACTIVO (Solo 1 bloque) */}
    <div className={`p-4 rounded-xl border transition-colors mt-6 ${formData.is_active ? 'bg-green-900/10 border-green-500/30' : 'bg-gray-900 border-gray-800'}`}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-5 h-5 accent-green-500"
        />
        <div className="flex-1">
          <span className="text-white font-bold text-sm block">Marcar como Avatar Activo</span>
          <span className="text-gray-400 text-xs">Este avatar controlará TODAS las funciones de Titan.</span>
        </div>
        {formData.is_active ? <Unlock className="text-green-400" size={20} /> : <Lock className="text-gray-500" size={20} />}
      </label>
    </div>

    {/* CONFIGURACIÓN TÉCNICA (Nivel y Objetivo) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-800 pt-6">
      <div className="bg-blue-900/10 p-4 rounded-xl">
        <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block">Nivel de Experiencia</label>
        <select
          value={formData.experience_level}
          onChange={(e) => setFormData({ ...formData, experience_level: e.target.value as any })}
          className="input-avatar"
        >
          <option value="principiante">Principiante</option>
          <option value="intermedio">Intermedio</option>
          <option value="avanzado">Avanzado</option>
          <option value="experto">Experto</option>
        </select>
      </div>

      <div className="bg-purple-900/10 p-4 rounded-xl">
        <label className="text-[10px] font-black text-purple-400 uppercase mb-2 block">Objetivo Principal</label>
        <select
          value={formData.primary_goal}
          onChange={(e) => setFormData({ ...formData, primary_goal: e.target.value as any })}
          className="input-avatar"
        >
          <option value="autoridad">Autoridad</option>
          <option value="viralidad">Viralidad</option>
          <option value="venta">Venta</option>
          <option value="comunidad">Comunidad</option>
        </select>
      </div>
    </div>

    {/* RESTO DE SELECTS (Comunicación, Riesgo, etc.) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Personalidad Comunicativa</label>
        <select
          value={formData.communication_style}
          onChange={(e) => setFormData({ ...formData, communication_style: e.target.value as any })}
          className="input-avatar"
        >
          <option value="directo">Directo</option>
          <option value="analitico">Analítico</option>
          <option value="inspirador">Inspirador</option>
          <option value="didactico">Didáctico</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Nivel de Riesgo</label>
        <select
          value={formData.risk_level}
          onChange={(e) => setFormData({ ...formData, risk_level: e.target.value as any })}
          className="input-avatar"
        >
          <option value="conservador">Conservador</option>
          <option value="balanceado">Balanceado</option>
          <option value="agresivo">Agresivo</option>
        </select>
      </div>
    </div>
  </div>
)}

                {/* Grid de campos obligatorios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                    <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block flex items-center gap-2">
                      <Award size={12} /> Nivel de Experiencia *
                    </label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value as any })}
                      className="input-avatar"
                    >
                      <option value="principiante">Principiante (Lenguaje simple)</option>
                      <option value="intermedio">Intermedio (Balance)</option>
                      <option value="avanzado">Avanzado (Sofisticado)</option>
                      <option value="experto">Experto (Altamente técnico)</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      Afecta la complejidad del lenguaje en TODO el contenido
                    </p>
                  </div>

                  <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20">
                    <label className="text-[10px] font-black text-purple-400 uppercase mb-2 block flex items-center gap-2">
                      <Target size={12} /> Objetivo Principal * (Solo 1)
                    </label>
                    <select
                      value={formData.primary_goal}
                      onChange={(e) => setFormData({ ...formData, primary_goal: e.target.value as any })}
                      className="input-avatar"
                    >
                      <option value="viralidad">Viralidad (Maximizar alcance)</option>
                      <option value="autoridad">Autoridad (Posicionarme como experto)</option>
                      <option value="venta">Venta (Convertir a clientes)</option>
                      <option value="comunidad">Comunidad (Audiencia leal)</option>
                      <option value="posicionamiento">Posicionamiento (Dominar nicho)</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      TODO el contenido se optimizará para este objetivo
                    </p>
                  </div>

                  <div className="bg-pink-900/10 p-4 rounded-xl border border-pink-500/20">
                    <label className="text-[10px] font-black text-pink-400 uppercase mb-2 block flex items-center gap-2">
                      <MessageSquare size={12} /> Personalidad Comunicativa *
                    </label>
                    <select
                      value={formData.communication_style}
                      onChange={(e) => setFormData({ ...formData, communication_style: e.target.value as any })}
                      className="input-avatar"
                    >
                      <option value="directo">Directo (Al grano, sin rodeos)</option>
                      <option value="analitico">Analítico (Datos y lógica)</option>
                      <option value="inspirador">Inspirador (Motivacional)</option>
                      <option value="provocador">Provocador (Controversial)</option>
                      <option value="didactico">Didáctico (Educativo)</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      Define el TONO de toda tu comunicación
                    </p>
                  </div>

                  <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                    <label className="text-[10px] font-black text-red-400 uppercase mb-2 block flex items-center gap-2">
                      <Flame size={12} /> Nivel de Riesgo *
                    </label>
                    <select
                      value={formData.risk_level}
                      onChange={(e) => setFormData({ ...formData, risk_level: e.target.value as any })}
                      className="input-avatar"
                    >
                      <option value="conservador">Conservador (Seguro, sin polémica)</option>
                      <option value="balanceado">Balanceado (Mix de seguridad e innovación)</option>
                      <option value="agresivo">Agresivo (Disruptivo, polémico)</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      Afecta agresividad de hooks y CTAs
                    </p>
                  </div>

                  <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20">
                    <label className="text-[10px] font-black text-green-400 uppercase mb-2 block flex items-center gap-2">
                      <Zap size={12} /> Tipo de Contenido Prioritario *
                    </label>
                    <select
                      value={formData.content_priority}
                      onChange={(e) => setFormData({ ...formData, content_priority: e.target.value as any })}
                      className="input-avatar"
                    >
                      <option value="educativo">Educativo (Enseñar conceptos)</option>
                      <option value="opinion">Opinión (Hot takes)</option>
                      <option value="storytelling">Storytelling (Narrativas)</option>
                      <option value="venta_encubierta">Venta Encubierta (Educar + vender)</option>
                      <option value="viral_corto">Viral Corto (Impacto rápido)</option>
                    </select>
                  </div>

                  <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20">
                    <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block flex items-center gap-2">
                      <Heart size={12} /> Emoción Dominante *
                    </label>
                    <select
                      value={formData.dominant_emotion}
                      onChange={(e) => setFormData({ ...formData, dominant_emotion: e.target.value as any })}
                      className="input-avatar"
                    >
                      <option value="curiosidad">Curiosidad (¿Cómo funciona?)</option>
                      <option value="deseo">Deseo (Quiero esto YA)</option>
                      <option value="miedo">Miedo (No quiero perderlo)</option>
                      <option value="aspiracion">Aspiración (Quiero ser así)</option>
                      <option value="autoridad">Autoridad (Confío en el experto)</option>
                    </select>
                  </div>

                </div>

                {/* Modelo de Éxito */}
                <div className="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
                  <label className="text-[10px] font-black text-indigo-400 uppercase mb-3 block flex items-center gap-2">
                    <Crown size={12} /> Modelo de Éxito (Referencia Cognitiva) *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: 'educador_serio', label: 'Educador Serio', example: 'Gary Vee, Neil Patel' },
                      { value: 'empresario_premium', label: 'Empresario Premium', example: 'Alex Hormozi, Grant Cardone' },
                      { value: 'influencer_agresivo', label: 'Influencer Agresivo', example: 'Dan Lok, Tai Lopez' },
                      { value: 'mentor_disruptivo', label: 'Mentor Disruptivo', example: 'Russell Brunson, Tony Robbins' },
                      { value: 'experto_tecnico', label: 'Experto Técnico', example: 'Tim Ferriss, Naval' },
                      { value: 'creativo_viral', label: 'Creativo Viral', example: 'MrBeast, Casey Neistat' }
                    ].map(model => (
                      <button
                        key={model.value}
                        onClick={() => setFormData({ ...formData, success_model: model.value as any })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.success_model === model.value
                            ? 'border-indigo-500 bg-indigo-500/20'
                            : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                        }`}
                      >
                        <p className="text-white font-bold text-xs mb-1">{model.label}</p>
                        <p className="text-gray-400 text-[10px]">{model.example}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Esto es una referencia cognitiva, NO copia. Define el arquetipo que guía tu comunicación.
                  </p>
                </div>

                {/* Prohibiciones */}
                <div className="bg-red-900/10 p-5 rounded-xl border border-red-500/20">
                  <label className="text-[10px] font-black text-red-400 uppercase mb-3 block flex items-center gap-2">
                    <AlertTriangle size={12} /> Prohibiciones del Avatar (Filtro Hard)
                  </label>
                  <p className="text-xs text-gray-400 mb-4">
                    Marca las cosas que tu avatar JAMÁS haría. Esto bloqueará contenido que las viole.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'lenguaje_vulgar', label: 'Lenguaje vulgar o groserías' },
                      { key: 'promesas_exageradas', label: 'Promesas exageradas o irreales' },
                      { key: 'polemica_barata', label: 'Polémica barata sin fundamento' },
                      { key: 'clickbait_engañoso', label: 'Clickbait engañoso' },
                      { key: 'venta_agresiva', label: 'Venta agresiva sin valor previo' },
                      { key: 'comparaciones_directas', label: 'Comparaciones con competencia' },
                      { key: 'contenido_negativo', label: 'Contenido excesivamente negativo' }
                    ].map(prohibition => (
                      <label key={prohibition.key} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-red-900/10">
                        <input
                          type="checkbox"
                          checked={formData.prohibitions[prohibition.key as keyof typeof formData.prohibitions]}
                          onChange={(e) => setFormData({
                            ...formData,
                            prohibitions: {
                              ...formData.prohibitions,
                              [prohibition.key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">{prohibition.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: AVANZADO */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-6">
                  <Brain size={20} className="text-purple-400" /> Personalización Avanzada (Opcional)
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  Estos campos son opcionales pero permiten mayor control sobre tu avatar.
                </p>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                    Estructura Narrativa Preferida
                  </label>
                  <select
                    value={formData.narrative_structure}
                    onChange={(e) => setFormData({ ...formData, narrative_structure: e.target.value })}
                    className="input-avatar"
                  >
                    <option value="problema_solucion">Problema → Solución</option>
                    <option value="hero_journey">Hero's Journey</option>
                    <option value="antes_despues">Antes → Después</option>
                    <option value="enemigo_comun">Enemigo Común</option>
                    <option value="revelacion_secreta">Revelación de Secreto</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                    Longitud de Contenido Preferida
                  </label>
                  <select
                    value={formData.preferred_length}
                    onChange={(e) => setFormData({ ...formData, preferred_length: e.target.value })}
                    className="input-avatar"
                  >
                    <option value="micro">Micro (&lt;30 seg)</option>
                    <option value="corto">Corto (30-60 seg)</option>
                    <option value="medio">Medio (1-3 min)</option>
                    <option value="largo">Largo (3+ min)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                    Estilo de CTA Preferido
                  </label>
                  <select
                    value={formData.preferred_cta_style}
                    onChange={(e) => setFormData({ ...formData, preferred_cta_style: e.target.value })}
                    className="input-avatar"
                  >
                    <option value="directo">Directo ("Compra ahora")</option>
                    <option value="suave">Suave ("Descubre más")</option>
                    <option value="urgencia">Urgencia ("Últimas 24h")</option>
                    <option value="curiosidad">Curiosidad ("¿Quieres saber cómo?")</option>
                    <option value="exclusividad">Exclusividad ("Solo para miembros")</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-green-400 uppercase mb-2 block">
                    Vocabulario Característico (Palabras que SÍ usas)
                  </label>
                  <textarea
                    value={formData.signature_vocabulary.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      signature_vocabulary: e.target.value.split(',').map((w: string) => w.trim()).filter(Boolean)
                    })}
                    className="textarea-avatar h-20"
                    placeholder="Ej: momentum, leverage, ecosistema, framework, estrategia..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Separa por comas</p>
                </div>

                <div>
                  <label className="text-[10px] font-black text-red-400 uppercase mb-2 block">
                    Vocabulario Prohibido (Palabras que NUNCA usas)
                  </label>
                  <textarea
                    value={formData.banned_vocabulary.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      banned_vocabulary: e.target.value.split(',').map((w: string) => w.trim()).filter(Boolean)
                    })}
                    className="textarea-avatar h-20"
                    placeholder="Ej: gratis, secreto, explosivo..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Separa por comas</p>
                </div>

              </div>
            )}

            {/* TAB: EVOLUCIÓN */}
            {activeTab === 'evolution' && (
              <div className="space-y-6">
                <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-6">
                  <TrendingUp size={20} className="text-cyan-400" /> Evolución del Avatar
                </h3>

                <p className="text-gray-400 text-sm">
                  El avatar evolucionará automáticamente según tu uso del sistema.
                  Genera más contenido para desbloquear nuevas capacidades.
                </p>

                <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-cyan-400 font-bold text-sm mb-2">🎯 Próximos Hitos</p>
                  <ul className="space-y-2">
                    <li className="text-xs text-gray-300">• Nivel 10: Desbloquea análisis de competencia automático</li>
                    <li className="text-xs text-gray-300">• Nivel 25: Ajuste fino de personalidad según engagement</li>
                    <li className="text-xs text-gray-300">• Nivel 50: Sistema experto de A/B testing</li>
                    <li className="text-xs text-gray-300">• Nivel 100: Avatar completamente autónomo</li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Botones de Acción */}
          <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-800">
            <div>
              {selectedAvatarId && (
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAudit}
                disabled={loading}
                className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 font-bold rounded-xl hover:bg-indigo-500 hover:text-white transition-all flex items-center gap-2"
              >
                {loading ? <TrendingUp size={18} className="animate-spin" /> : <Shield size={18} />}
                AUDITAR CON IA
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg"
              >
                {loading ? <TrendingUp size={18} className="animate-spin" /> : <Save size={18} />}
                GUARDAR AVATAR
              </button>
            </div>
          </div>

        </div>
        {/* FIN FORMULARIO (8 cols) */}

        {/* SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <AvatarWidget />

          <ContextualSuggestions
            avatar={selectedAvatarId ? avatarsList.find((a: any) => a.id === selectedAvatarId) : null}
            currentMode="avatar_config"
          />

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-white font-bold text-sm mb-3">💡 ¿Por qué es obligatorio?</p>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              El Avatar NO es decorativo. Es el cerebro que filtra y condiciona
              TODAS las respuestas de Titan.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sin avatar activo, el sistema se bloquea. Esto garantiza coherencia
              total en tu marca.
            </p>
          </div>
        </div>
        {/* FIN SIDEBAR (4 cols) */}

      </div>
      {/* FIN GRID PRINCIPAL */}

      <style>{`
        .input-avatar {
          width: 100%;
          background-color: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-avatar:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
        .textarea-avatar {
          width: 100%;
          background-color: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          padding: 0.75rem;
          color: white;
          font-size: 0.875rem;
          outline: none;
          resize: none;
          transition: all 0.2s;
        }
        .textarea-avatar:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }
      `}</style>

    </div>
  );
};

export default AvatarProfile;