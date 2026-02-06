import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Save, Plus, Trash2, Target, Heart, Flame, Zap, MessageSquare, 
    Send, Search, Users, RefreshCw, User, BookOpen, Brain, Activity, 
    AlertTriangle, CheckCircle2, XCircle, ArrowRight, ShieldAlert,
    TrendingUp, Eye, Lightbulb, FileText, Copy, Download, Sparkles,
    Clock, DollarSign, Crosshair, Compass, Radio
} from 'lucide-react';

// ==================================================================================
// 🎨 SUB-COMPONENTE: REPORTE DE AUDITORÍA MEJORADO
// ==================================================================================
const AuditReport = ({ data }: { data: any }) => {
  if (!data || !data.auditoria_calidad) {
    return (
        <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20 text-yellow-200 text-xs">
            <p className="font-bold mb-1">Resultado recibido</p>
            <pre className="text-[10px] opacity-70 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
  }

  const { auditoria_calidad, analisis_campo_por_campo, perfil_final_optimizado } = data;
  
  const getStatusColor = (status: string) => {
    if (status?.includes('Excelente') || status?.includes('🟢')) return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (status?.includes('Mejorable') || status?.includes('🟡')) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Scoreboard */}
      <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">CALIDAD DEL AVATAR</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${auditoria_calidad.score_global > 80 ? 'text-green-400' : auditoria_calidad.score_global > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                {auditoria_calidad.score_global}
              </span>
              <span className="text-gray-600 text-xs font-bold">/ 100</span>
            </div>
            <p className="text-white font-bold text-sm mt-1">{auditoria_calidad.nivel_actual}</p>
          </div>
          
          <div className="bg-white/5 p-3 rounded-lg max-w-[140px] backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-1 mb-1 text-fuchsia-400">
              <ShieldAlert size={12} />
              <span className="text-[9px] font-bold uppercase">Veredicto Titan</span>
            </div>
            <p className="text-[10px] text-gray-300 italic leading-tight">"{auditoria_calidad.veredicto_brutal}"</p>
          </div>
        </div>
      </div>

      {/* Análisis Campo por Campo */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest pl-1">
          <Activity size={12}/> Análisis Forense
        </h4>
        
        {analisis_campo_por_campo?.map((item: any, idx: number) => (
          <div key={idx} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-bold text-white text-xs">{item.campo}</h5>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${getStatusColor(item.calificacion)}`}>
                {item.calificacion?.split(' ')[1] || item.calificacion}
              </span>
            </div>

            <div className="space-y-3">
              <div className="relative pl-3 border-l-2 border-red-500/20">
                <span className="text-[9px] text-red-400 font-bold block mb-0.5 uppercase">Tu Input</span>
                <p className="text-gray-400 text-[10px] line-clamp-2 italic">"{item.lo_que_escribio_usuario}"</p>
                <p className="text-[9px] text-red-300 mt-1 flex items-start gap-1">
                    <XCircle size={10} className="shrink-0 mt-0.5"/> {item.critica}
                </p>
              </div>

              <div className="relative pl-3 border-l-2 border-green-500/40 bg-green-500/5 py-1 rounded-r-lg">
                <span className="text-[9px] text-green-400 font-bold block mb-0.5 uppercase">Corrección Titan</span>
                <p className="text-gray-200 text-[10px] font-medium leading-relaxed">"{item.correccion_maestra}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Perfil Optimizado */}
      <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-4">
        <h4 className="text-center text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">💎 PERFIL PULIDO</h4>
        
        <div className="space-y-2">
          <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
            <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Identidad</span>
            <p className="text-white text-xs font-bold">{perfil_final_optimizado?.identidad}</p>
          </div>
          <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
             <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Insight Secreto</span>
             <p className="text-indigo-200 text-xs italic">"{perfil_final_optimizado?.insight_psicologico}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 💬 SUB-COMPONENTE: HISTORIAL DE CHAT
// ==================================================================================
const ChatHistory = ({ messages }: { messages: any[] }) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40">
        <MessageSquare size={40} className="mb-3"/>
        <p className="text-xs text-center font-medium max-w-[200px]">
          Investiga a tu cliente ideal. Haz cualquier pregunta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div key={idx} className="space-y-2">
          {/* Pregunta del usuario */}
          <div className="flex justify-end">
            <div className="bg-purple-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%]">
              <p className="text-xs font-medium">{msg.question}</p>
            </div>
          </div>
          
          {/* Respuesta de la IA */}
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] border border-gray-700">
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================================================================================
// 🧩 COMPONENTE PRINCIPAL: AVATAR PROFILE ULTRA
// ==================================================================================
export const AvatarProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    const [avatarsList, setAvatarsList] = useState<any[]>([]);
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // --- ESTADOS IA ---
    const [aiMode, setAiMode] = useState<'audit' | 'chat' | 'insights'>('chat');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [auditResult, setAuditResult] = useState<any>(null);
    const [insightsResult, setInsightsResult] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- TABS FORMULARIO ---
    const [activeTab, setActiveTab] = useState<'identity' | 'psychology' | 'behavior' | 'objections'>('identity');

    const COSTO_AUDITORIA = 2;
    const COSTO_CHAT = 1;
    const COSTO_INSIGHTS = 3;

    // --- FORMULARIO EXPANDIDO (25 CAMPOS) ---
    const [formData, setFormData] = useState({
        // Identidad Básica
        name: '',
        age_range: '',
        gender: '',
        location: '',
        occupation: '',
        income_level: '',
        
        // Dolores y Deseos
        primary_pain: '',
        hell_situation: '',
        heaven_situation: '',
        
        // Psicología Profunda
        hidden_fear: '',
        central_objection: '',
        secondary_objections: '',
        limiting_belief: '',
        past_vehicle: '',
        trigger_event: '',
        awareness_level: 'Inconsciente del Problema',
        
        // Comportamiento y Lenguaje
        language_patterns: '',
        trusted_influencers: '',
        content_consumption: '',
        vulnerability_moments: '',
        decision_drivers: '',
        
        // Objeciones Específicas
        time_objection: '',
        money_objection: '',
        skepticism_level: '',
        past_failures: ''
    });

    const getPlanLimit = () => {
        const tier = userProfile?.tier || 'free';
        if (tier === 'esencial') return 3;
        if (tier === 'pro') return 12;
        if (tier === 'agency') return 50;
        return 1;
    };

    // --- CARGA DE DATOS ---
    useEffect(() => { 
        if (user) {
            fetchAvatars();
            fetchContextData();
        }
    }, [user]);

    const fetchAvatars = async () => {
        try {
            const { data } = await supabase.from('avatars').select('*').eq('user_id', user?.id);
            if (data) {
                setAvatarsList(data);
                if (userProfile?.active_avatar_id) {
                    const active = data.find(p => p.id === userProfile.active_avatar_id);
                    if (active) selectAvatar(active);
                } else if (data.length > 0) selectAvatar(data[0]);
            }
        } catch (e) { console.error(e); }
    };

    const fetchContextData = async () => {
        try {
            const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id);
            if(exp) setExperts(exp);
            
            const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
            if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename })));

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
        } catch (e) { console.error(e); }
    };

    const selectAvatar = (avatar: any) => {
        setSelectedAvatarId(avatar.id);
        setChatHistory([]);
        setAuditResult(null);
        setInsightsResult(null);
        
        // ✅ MAPEO CORRECTO DE CAMPOS DE BASE DE DATOS
        setFormData({
            // Campos básicos existentes
            name: avatar.name || '',
            age_range: avatar.edad || '',  // ✅ CONEXIÓN: edad → age_range
            
            // Campos nuevos
            gender: avatar.gender || '',
            location: avatar.location || '',
            occupation: avatar.occupation || '',
            income_level: avatar.income_level || '',
            
            // Dolor y transformación
            primary_pain: avatar.dolor || '',  // ✅ CONEXIÓN: dolor → primary_pain
            hell_situation: avatar.infierno || '',  // ✅ CONEXIÓN: infierno → hell_situation
            heaven_situation: avatar.cielo || '',  // ✅ CONEXIÓN: cielo → heaven_situation
            
            // Psicología
            hidden_fear: avatar.miedo_oculto || '',  // ✅ CONEXIÓN: miedo_oculto → hidden_fear
            central_objection: avatar.objecion || '',  // ✅ CONEXIÓN: objecion → central_objection
            secondary_objections: avatar.secondary_objections || '',
            limiting_belief: avatar.creencia_limitante || '',  // ✅ CONEXIÓN: creencia_limitante → limiting_belief
            past_vehicle: avatar.vehiculo_pasado || '',  // ✅ CONEXIÓN: vehiculo_pasado → past_vehicle
            trigger_event: avatar.gatillo || '',  // ✅ CONEXIÓN: gatillo → trigger_event
            awareness_level: avatar.conciencia || 'Inconsciente del Problema',  // ✅ CONEXIÓN: conciencia → awareness_level
            
            // Comportamiento
            language_patterns: avatar.language_patterns || '',
            trusted_influencers: avatar.trusted_influencers || '',
            content_consumption: avatar.content_consumption || '',
            vulnerability_moments: avatar.vulnerability_moments || '',
            decision_drivers: avatar.decision_drivers || '',
            
            // Objeciones
            time_objection: avatar.time_objection || '',
            money_objection: avatar.money_objection || '',
            skepticism_level: avatar.skepticism_level || '',
            past_failures: avatar.past_failures || ''
        });
    };

    const handleNewAvatar = () => {
        const limit = getPlanLimit();
        if (avatarsList.length >= limit) return alert(`⚠️ Límite de ${limit} avatares alcanzado.`);
        
        setSelectedAvatarId(null);
        setChatHistory([]);
        setAuditResult(null);
        setInsightsResult(null);
        
        setFormData({ 
            name: '', age_range: '', gender: '', location: '', occupation: '', income_level: '',
            primary_pain: '', hell_situation: '', heaven_situation: '',
            hidden_fear: '', central_objection: '', secondary_objections: '', limiting_belief: '',
            past_vehicle: '', trigger_event: '', awareness_level: 'Inconsciente del Problema',
            language_patterns: '', trusted_influencers: '', content_consumption: '',
            vulnerability_moments: '', decision_drivers: '', time_objection: '',
            money_objection: '', skepticism_level: '', past_failures: ''
        });
    };

    const handleSave = async () => {
        if (!formData.name) return alert("Ponle un Nombre Clave a este avatar");
        if (!user?.id) return; 
        
        setLoading(true);
        try {
            // ✅ MAPEO CORRECTO DE CAMPOS FRONTEND → DATABASE
            const dataToSave: any = {
                user_id: user.id,
                // Campos existentes con mapeo correcto
                name: formData.name,
                edad: formData.age_range,  // ✅ age_range → edad
                dolor: formData.primary_pain,  // ✅ primary_pain → dolor
                infierno: formData.hell_situation,  // ✅ hell_situation → infierno
                cielo: formData.heaven_situation,  // ✅ heaven_situation → cielo
                miedo_oculto: formData.hidden_fear,  // ✅ hidden_fear → miedo_oculto
                objecion: formData.central_objection,  // ✅ central_objection → objecion
                creencia_limitante: formData.limiting_belief,  // ✅ limiting_belief → creencia_limitante
                vehiculo_pasado: formData.past_vehicle,  // ✅ past_vehicle → vehiculo_pasado
                gatillo: formData.trigger_event,  // ✅ trigger_event → gatillo
                conciencia: formData.awareness_level,  // ✅ awareness_level → conciencia
                
                // Campos nuevos (mismo nombre)
                gender: formData.gender,
                location: formData.location,
                occupation: formData.occupation,
                income_level: formData.income_level,
                secondary_objections: formData.secondary_objections,
                language_patterns: formData.language_patterns,
                trusted_influencers: formData.trusted_influencers,
                content_consumption: formData.content_consumption,
                vulnerability_moments: formData.vulnerability_moments,
                decision_drivers: formData.decision_drivers,
                time_objection: formData.time_objection,
                money_objection: formData.money_objection,
                skepticism_level: formData.skepticism_level,
                past_failures: formData.past_failures
            };

            if (selectedAvatarId) dataToSave.id = selectedAvatarId;

            const { data, error } = await supabase.from('avatars').upsert(dataToSave).select('id').single();
            if (error) throw error;
            
            const newId = data.id;
            await supabase.from('profiles').update({ active_avatar_id: newId }).eq('id', user.id);
            
            if(refreshProfile) refreshProfile();
            setSelectedAvatarId(newId);
            await fetchAvatars(); 
        } catch (e: any) { alert(`Error: ${e.message}`); } 
        finally { setLoading(false); }
    };
    
    const handleDelete = async () => {
        if(!selectedAvatarId || !confirm("¿Eliminar este Avatar?")) return;
        try {
            if (userProfile?.active_avatar_id === selectedAvatarId) {
                await supabase.from('profiles').update({ active_avatar_id: null }).eq('id', user?.id);
            }
            await supabase.from('avatars').delete().eq('id', selectedAvatarId);
            handleNewAvatar();
            await fetchAvatars();
            if(refreshProfile) refreshProfile();
        } catch (e) { console.error(e); }
    };

    // --- IA: AUDITORÍA COMPLETA ---
    const handleAudit = async () => {
        if (!formData.name || !formData.primary_pain) {
            return alert("Completa al menos el Nombre y el Dolor Principal.");
        }
        
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_AUDITORIA) {
            return alert(`⚠️ Saldo insuficiente. Necesitas ${COSTO_AUDITORIA} créditos.`);
        }

        setIsProcessing(true);
        setAuditResult(null);
        
        try {
            // ✅ CONEXIÓN VERIFICADA CON BACKEND
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'audit_avatar',  // ✅ Modo correcto
                    transcript: JSON.stringify(formData),  // ✅ Envía todo el perfil
                    expertId: selectedExpertId,  // ✅ Contexto de experto
                    knowledgeBaseId: selectedKbId,  // ✅ Contexto de KB
                    estimatedCost: COSTO_AUDITORIA  // ✅ Costo correcto
                },
            });

            if (error) throw error;
            
            const resultData = data.generatedData || data;
            setAuditResult(resultData);
            
            if(refreshProfile) refreshProfile();

        } catch (e: any) { 
            console.error(e);
            alert(`Error: ${e.message}`); 
        } finally { 
            setIsProcessing(false); 
        }
    };

    // --- IA: CHAT INVESTIGATIVO ---
    const handleChat = async () => {
        if (!chatInput.trim()) return;
        
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_CHAT) {
            return alert(`⚠️ Saldo insuficiente. Necesitas ${COSTO_CHAT} crédito.`);
        }
        
        setIsProcessing(true);
        
        try {
            const contextPrompt = `CONTEXTO DEL AVATAR:
${JSON.stringify(formData, null, 2)}

PREGUNTA DEL USUARIO:
"${chatInput}"

INSTRUCCIONES:
Eres un psicólogo experto en análisis de audiencias. Responde la pregunta del usuario con insights profundos basados en el perfil del avatar. Sé específico, práctico y accionable.`;

            // ✅ CONEXIÓN VERIFICADA CON BACKEND
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_avatar',  // ✅ Modo correcto
                    transcript: contextPrompt,  // ✅ Contexto + pregunta
                    expertId: selectedExpertId,  // ✅ Contexto de experto
                    knowledgeBaseId: selectedKbId,  // ✅ Contexto de KB
                    estimatedCost: COSTO_CHAT  // ✅ Costo correcto
                },
            });
            
            if (error) throw error;
            
            // ✅ MANEJO FLEXIBLE DE RESPUESTA
            const answer = data.generatedData?.answer || 
                          data.generatedData?.text_output || 
                          data.generatedData?.respuesta ||
                          (typeof data.generatedData === 'string' ? data.generatedData : "Sin respuesta");
            
            setChatHistory(prev => [...prev, {
                question: chatInput,
                answer: answer
            }]);
            
            setChatInput('');
            
            if (refreshProfile) refreshProfile();
            
        } catch (e: any) { 
            console.error(e);
            setChatHistory(prev => [...prev, {
                question: chatInput,
                answer: `Error: ${e.message}`
            }]);
        } finally { 
            setIsProcessing(false); 
        }
    };

    // --- IA: GENERADOR DE INSIGHTS ---
    const handleGenerateInsights = async () => {
        if (!formData.name || !formData.primary_pain) {
            return alert("Completa al menos el Nombre y el Dolor Principal.");
        }
        
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_INSIGHTS) {
            return alert(`⚠️ Saldo insuficiente. Necesitas ${COSTO_INSIGHTS} créditos.`);
        }

        setIsProcessing(true);
        setInsightsResult(null);
        
        try {
            const insightsPrompt = `ANALIZA ESTE PERFIL DE AVATAR Y GENERA INSIGHTS PROFUNDOS:

${JSON.stringify(formData, null, 2)}

GENERA:
1. 5 insights psicológicos ocultos que no son obvios
2. 3 ángulos de contenido únicos para conectar con este avatar
3. 2 objeciones que NO ha mencionado pero que probablemente tiene
4. 1 "momento de oro" - cuándo es más receptivo a comprar

Devuelve en formato JSON:
{
  "insights_ocultos": ["insight1", "insight2", ...],
  "angulos_contenido": ["angulo1", "angulo2", "angulo3"],
  "objeciones_ocultas": ["objecion1", "objecion2"],
  "momento_oro": "descripción del momento ideal"
}`;

            // ✅ CONEXIÓN VERIFICADA CON BACKEND
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_avatar',  // ✅ Usa chat_avatar para insights
                    transcript: insightsPrompt,  // ✅ Prompt estructurado
                    expertId: selectedExpertId,  // ✅ Contexto de experto
                    knowledgeBaseId: selectedKbId,  // ✅ Contexto de KB
                    estimatedCost: COSTO_INSIGHTS  // ✅ Costo correcto
                },
            });
            
            if (error) throw error;
            
            let insights;
            try {
                const rawAnswer = data.generatedData?.answer || 
                                 data.generatedData?.text_output || 
                                 JSON.stringify(data.generatedData);
                
                // Intentar parsear JSON
                insights = JSON.parse(rawAnswer);
            } catch {
                // Si no es JSON válido, usar la respuesta cruda
                insights = { 
                    raw: data.generatedData?.answer || 
                         data.generatedData?.text_output || 
                         "No se generaron insights" 
                };
            }
            
            setInsightsResult(insights);
            
            if (refreshProfile) refreshProfile();

        } catch (e: any) { 
            console.error(e);
            alert(`Error: ${e.message}`); 
        } finally { 
            setIsProcessing(false); 
        }
    };

    // --- COPIAR PERFIL ---
    const handleCopyProfile = () => {
        const profileText = `PERFIL DE AVATAR: ${formData.name}

IDENTIDAD:
- Edad: ${formData.age_range}
- Género: ${formData.gender}
- Ubicación: ${formData.location}
- Ocupación: ${formData.occupation}
- Nivel de Ingresos: ${formData.income_level}

DOLOR PRINCIPAL:
${formData.primary_pain}

INFIERNO (Situación Actual):
${formData.hell_situation}

CIELO (Situación Deseada):
${formData.heaven_situation}

PSICOLOGÍA:
- Miedo Oculto: ${formData.hidden_fear}
- Objeción Central: ${formData.central_objection}
- Objeciones Secundarias: ${formData.secondary_objections}
- Creencia Limitante: ${formData.limiting_belief}
- Nivel de Conciencia: ${formData.awareness_level}

COMPORTAMIENTO:
- Patrones de Lenguaje: ${formData.language_patterns}
- Influencers de Confianza: ${formData.trusted_influencers}
- Consumo de Contenido: ${formData.content_consumption}
- Momentos de Vulnerabilidad: ${formData.vulnerability_moments}
- Drivers de Decisión: ${formData.decision_drivers}

OBJECIONES:
- Tiempo: ${formData.time_objection}
- Dinero: ${formData.money_objection}
- Nivel de Escepticismo: ${formData.skepticism_level}
- Fracasos Pasados: ${formData.past_failures}`;

        navigator.clipboard.writeText(profileText);
        alert('✅ Perfil copiado al portapapeles');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                        <Heart className="text-pink-500" fill="currentColor"/> AVATAR ENGINE
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        Motor de investigación psicológica profunda de tu cliente ideal
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        onChange={(e) => {
                            const selected = avatarsList.find(a => a.id === e.target.value);
                            if(selected) selectAvatar(selected);
                        }}
                        value={selectedAvatarId || ""}
                        className="flex-1 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none cursor-pointer hover:border-pink-500 transition-colors"
                    >
                        <option value="" disabled>Seleccionar Avatar...</option>
                        {avatarsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <button 
                        onClick={handleNewAvatar} 
                        className="p-3 bg-pink-600 rounded-xl hover:bg-pink-500 text-white transition-all shadow-lg shadow-pink-900/20"
                    >
                        <Plus size={20}/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- IZQUIERDA: FORMULARIO (8 Cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Tabs de Navegación */}
                    <div className="flex gap-2 bg-gray-900/50 p-2 rounded-2xl border border-gray-800">
                        <button
                            onClick={() => setActiveTab('identity')}
                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                activeTab === 'identity'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Users size={14} className="inline mr-1"/> Identidad
                        </button>
                        <button
                            onClick={() => setActiveTab('psychology')}
                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                activeTab === 'psychology'
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Brain size={14} className="inline mr-1"/> Psicología
                        </button>
                        <button
                            onClick={() => setActiveTab('behavior')}
                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                activeTab === 'behavior'
                                    ? 'bg-orange-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <Activity size={14} className="inline mr-1"/> Comportamiento
                        </button>
                        <button
                            onClick={() => setActiveTab('objections')}
                            className={`flex-1 py-2 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                activeTab === 'objections'
                                    ? 'bg-red-600 text-white shadow-lg'
                                    : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            <AlertTriangle size={14} className="inline mr-1"/> Objeciones
                        </button>
                    </div>

                    {/* CONTENIDO DE TABS */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl min-h-[500px]">
                        {/* TAB: IDENTIDAD */}
                        {activeTab === 'identity' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Users size={20} className="text-blue-400"/> Identidad & Demographics
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Nombre Clave *</label>
                                        <input 
                                            type="text" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: El Emprendedor Frustrado"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Rango de Edad</label>
                                        <input 
                                            type="text" 
                                            value={formData.age_range} 
                                            onChange={(e) => setFormData({...formData, age_range: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: 30-45 años"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Género</label>
                                        <select 
                                            value={formData.gender} 
                                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                            className="input-viral"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option>Masculino</option>
                                            <option>Femenino</option>
                                            <option>No Binario</option>
                                            <option>Todos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Ubicación</label>
                                        <input 
                                            type="text" 
                                            value={formData.location} 
                                            onChange={(e) => setFormData({...formData, location: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Ciudad de México, Online"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Ocupación</label>
                                        <input 
                                            type="text" 
                                            value={formData.occupation} 
                                            onChange={(e) => setFormData({...formData, occupation: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Freelancer, Empleado, Empresario"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Nivel de Ingresos</label>
                                        <select 
                                            value={formData.income_level} 
                                            onChange={(e) => setFormData({...formData, income_level: e.target.value})}
                                            className="input-viral"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option>Bajo ($0-$1k/mes)</option>
                                            <option>Medio ($1k-$5k/mes)</option>
                                            <option>Alto ($5k-$15k/mes)</option>
                                            <option>Premium ($15k+/mes)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-red-400 uppercase mb-2 block tracking-widest flex items-center gap-2">
                                        <AlertTriangle size={12}/> Dolor Primario (The Bleeding Neck) *
                                    </label>
                                    <textarea 
                                        value={formData.primary_pain} 
                                        onChange={(e) => setFormData({...formData, primary_pain: e.target.value})} 
                                        className="textarea-viral h-24 border-red-500/20 focus:border-red-500" 
                                        placeholder="¿Qué problema urgente le quita el sueño y pagaría por resolver YA?"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-900/5 p-4 rounded-2xl border border-red-500/10">
                                        <label className="text-[10px] font-black text-red-400 uppercase mb-2 block tracking-widest">
                                            Infierno (Situación Actual)
                                        </label>
                                        <textarea 
                                            value={formData.hell_situation} 
                                            onChange={(e) => setFormData({...formData, hell_situation: e.target.value})} 
                                            className="textarea-viral h-32 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-red-900/30 text-gray-300" 
                                            placeholder="Describe su día a día negativo..."
                                        />
                                    </div>
                                    <div className="bg-green-900/5 p-4 rounded-2xl border border-green-500/10">
                                        <label className="text-[10px] font-black text-green-400 uppercase mb-2 block tracking-widest">
                                            Cielo (Situación Deseada)
                                        </label>
                                        <textarea 
                                            value={formData.heaven_situation} 
                                            onChange={(e) => setFormData({...formData, heaven_situation: e.target.value})} 
                                            className="textarea-viral h-32 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-green-900/30 text-gray-300" 
                                            placeholder="¿Cómo se ve su vida una vez resuelto el problema?"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PSICOLOGÍA */}
                        {activeTab === 'psychology' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Brain size={20} className="text-purple-500"/> Psicología Profunda
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                            Miedo Oculto (Inconfesable)
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formData.hidden_fear} 
                                            onChange={(e) => setFormData({...formData, hidden_fear: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Ser visto como un fraude"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                            Objeción Central
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formData.central_objection} 
                                            onChange={(e) => setFormData({...formData, central_objection: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: 'No tengo tiempo'"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Objeciones Secundarias (2-3 adicionales)
                                    </label>
                                    <textarea 
                                        value={formData.secondary_objections} 
                                        onChange={(e) => setFormData({...formData, secondary_objections: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: 'Ya lo intenté antes y no funcionó', 'Es muy caro', 'No sé si es para mí'..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Creencia Limitante
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.limiting_belief} 
                                        onChange={(e) => setFormData({...formData, limiting_belief: e.target.value})} 
                                        className="input-viral" 
                                        placeholder="Ej: 'Necesito ser experto técnico para vender'"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                            Vehículo del Pasado (¿Qué intentó antes?)
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formData.past_vehicle} 
                                            onChange={(e) => setFormData({...formData, past_vehicle: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Cursos genéricos, Coaching tradicional"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                            Gatillo / Trigger Event
                                        </label>
                                        <input 
                                            type="text" 
                                            value={formData.trigger_event} 
                                            onChange={(e) => setFormData({...formData, trigger_event: e.target.value})} 
                                            className="input-viral" 
                                            placeholder="Ej: Despido, Crisis financiera, Cumpleaños 40"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                    <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block">
                                        Nivel de Conciencia (Market Sophistication)
                                    </label>
                                    <select 
                                        value={formData.awareness_level} 
                                        onChange={(e) => setFormData({...formData, awareness_level: e.target.value})} 
                                        className="w-full bg-transparent text-white text-sm outline-none cursor-pointer font-bold"
                                    >
                                        <option>Inconsciente del Problema</option>
                                        <option>Consciente del Problema</option>
                                        <option>Consciente de la Solución</option>
                                        <option>Consciente del Producto</option>
                                        <option>Totalmente Consciente</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* TAB: COMPORTAMIENTO */}
                        {activeTab === 'behavior' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <Activity size={20} className="text-orange-500"/> Comportamiento & Lenguaje
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Patrones de Lenguaje (Palabras exactas que usa)
                                    </label>
                                    <textarea 
                                        value={formData.language_patterns} 
                                        onChange={(e) => setFormData({...formData, language_patterns: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: 'Estoy estancado', 'No sé cómo empezar', 'Necesito más clientes'..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Influencers de Confianza (¿A quién escucha?)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.trusted_influencers} 
                                        onChange={(e) => setFormData({...formData, trusted_influencers: e.target.value})} 
                                        className="input-viral" 
                                        placeholder="Ej: Gary Vee, Alex Hormozi, Tim Ferriss..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Consumo de Contenido (Dónde pasa el tiempo)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.content_consumption} 
                                        onChange={(e) => setFormData({...formData, content_consumption: e.target.value})} 
                                        className="input-viral" 
                                        placeholder="Ej: YouTube a las 7pm, Instagram en el almuerzo, Podcasts en el auto..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Momentos de Vulnerabilidad (Cuándo está más receptivo)
                                    </label>
                                    <textarea 
                                        value={formData.vulnerability_moments} 
                                        onChange={(e) => setFormData({...formData, vulnerability_moments: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: Domingos por la noche (ansiedad laboral), Después de reuniones frustrantes..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Drivers de Decisión (Qué lo hace comprar)
                                    </label>
                                    <textarea 
                                        value={formData.decision_drivers} 
                                        onChange={(e) => setFormData({...formData, decision_drivers: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: Resultados rápidos, Autoridad del experto, Casos de éxito similares, Garantía..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* TAB: OBJECIONES */}
                        {activeTab === 'objections' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-red-500"/> Objeciones Específicas
                                </h3>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Objeción de Tiempo
                                    </label>
                                    <textarea 
                                        value={formData.time_objection} 
                                        onChange={(e) => setFormData({...formData, time_objection: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: 'No tengo tiempo para implementarlo', 'Mi agenda está llena'..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Objeción de Dinero
                                    </label>
                                    <textarea 
                                        value={formData.money_objection} 
                                        onChange={(e) => setFormData({...formData, money_objection: e.target.value})} 
                                        className="textarea-viral h-20" 
                                        placeholder="Ej: 'No puedo permitírmelo ahora', 'Es muy caro', 'Necesito pensarlo'..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Nivel de Escepticismo
                                    </label>
                                    <select 
                                        value={formData.skepticism_level} 
                                        onChange={(e) => setFormData({...formData, skepticism_level: e.target.value})}
                                        className="input-viral"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option>Bajo - Confía fácilmente</option>
                                        <option>Medio - Necesita pruebas</option>
                                        <option>Alto - Muy escéptico</option>
                                        <option>Extremo - Casi imposible de convencer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">
                                        Fracasos del Pasado (¿Qué intentó y no funcionó?)
                                    </label>
                                    <textarea 
                                        value={formData.past_failures} 
                                        onChange={(e) => setFormData({...formData, past_failures: e.target.value})} 
                                        className="textarea-viral h-24" 
                                        placeholder="Ej: Compró 3 cursos y no terminó ninguno, Contrató un coach caro y no vio resultados..."
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-between items-center gap-4 pt-4 border-t border-gray-800">
                        <div className="flex gap-2">
                            {selectedAvatarId && (
                                <button 
                                    onClick={handleDelete} 
                                    className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2"
                                >
                                    <Trash2 size={16}/> Eliminar
                                </button>
                            )}
                            <button 
                                onClick={handleCopyProfile}
                                className="text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-all text-sm font-bold flex items-center gap-2"
                            >
                                <Copy size={16}/> Copiar Perfil
                            </button>
                        </div>
                        
                        <button 
                            onClick={handleSave} 
                            disabled={loading} 
                            className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/5"
                        >
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>} 
                            GUARDAR AVATAR
                        </button>
                    </div>
                </div>

                {/* --- DERECHA: PANEL IA (4 Cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 sticky top-6 shadow-2xl flex flex-col h-[700px]">
                        
                        {/* Header IA */}
                        <div className="border-b border-gray-800 pb-4 mb-4">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Brain size={18} className="text-purple-400"/> AI Research Lab
                                </h3>
                                <div className="bg-purple-900/20 px-2 py-1 rounded text-[10px] text-purple-400 font-bold border border-purple-500/30">
                                    ULTRA
                                </div>
                            </div>

                            {/* Modos de IA */}
                            <div className="flex gap-2 bg-gray-900/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setAiMode('chat')}
                                    className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${
                                        aiMode === 'chat'
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    <MessageSquare size={12} className="inline mr-1"/> Chat
                                </button>
                                <button
                                    onClick={() => setAiMode('audit')}
                                    className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${
                                        aiMode === 'audit'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    <Activity size={12} className="inline mr-1"/> Audit
                                </button>
                                <button
                                    onClick={() => setAiMode('insights')}
                                    className={`flex-1 py-2 px-3 rounded text-[10px] font-black uppercase transition-all ${
                                        aiMode === 'insights'
                                            ? 'bg-yellow-600 text-white'
                                            : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    <Lightbulb size={12} className="inline mr-1"/> Insights
                                </button>
                            </div>
                        </div>

                        {/* Selectores de Contexto */}
                        <div className="mb-4 space-y-2">
                            <select 
                                value={selectedExpertId} 
                                onChange={(e) => setSelectedExpertId(e.target.value)} 
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-purple-500"
                            >
                                <option value="">🧠 Experto Auditor</option>
                                {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                            <select 
                                value={selectedKbId} 
                                onChange={(e) => setSelectedKbId(e.target.value)} 
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-yellow-500"
                            >
                                <option value="">📚 Base de Conocimientos</option>
                                {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>

                        {/* Pantalla de Resultados */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-2xl p-4 border border-gray-800 mb-4 shadow-inner">
                            {/* MODO AUDIT */}
                            {aiMode === 'audit' && auditResult && (
                                <AuditReport data={auditResult} />
                            )}

                            {/* MODO CHAT */}
                            {aiMode === 'chat' && (
                                <ChatHistory messages={chatHistory} />
                            )}

                            {/* MODO INSIGHTS */}
                            {aiMode === 'insights' && insightsResult && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {insightsResult.insights_ocultos && (
                                        <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4">
                                            <h4 className="text-yellow-400 text-xs font-black uppercase mb-2">
                                                💡 Insights Ocultos
                                            </h4>
                                            <ul className="space-y-2">
                                                {insightsResult.insights_ocultos.map((insight: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-yellow-500 shrink-0">•</span>
                                                        <span>{insight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {insightsResult.angulos_contenido && (
                                        <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
                                            <h4 className="text-blue-400 text-xs font-black uppercase mb-2">
                                                🎯 Ángulos de Contenido
                                            </h4>
                                            <ul className="space-y-2">
                                                {insightsResult.angulos_contenido.map((angulo: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-blue-500 shrink-0">{i + 1}.</span>
                                                        <span>{angulo}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {insightsResult.objeciones_ocultas && (
                                        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4">
                                            <h4 className="text-red-400 text-xs font-black uppercase mb-2">
                                                ⚠️ Objeciones Ocultas
                                            </h4>
                                            <ul className="space-y-2">
                                                {insightsResult.objeciones_ocultas.map((obj: string, i: number) => (
                                                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                                                        <span className="text-red-500 shrink-0">•</span>
                                                        <span>{obj}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {insightsResult.momento_oro && (
                                        <div className="bg-green-900/10 border border-green-500/20 rounded-xl p-4">
                                            <h4 className="text-green-400 text-xs font-black uppercase mb-2">
                                                ⏰ Momento de Oro
                                            </h4>
                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                {insightsResult.momento_oro}
                                            </p>
                                        </div>
                                    )}

                                    {insightsResult.raw && (
                                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                                            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                {insightsResult.raw}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Estado Vacío */}
                            {aiMode === 'audit' && !auditResult && !isProcessing && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40">
                                    <Activity size={40} className="mb-3"/>
                                    <p className="text-xs text-center font-medium max-w-[180px]">
                                        Audita tu perfil para encontrar puntos ciegos
                                    </p>
                                </div>
                            )}

                            {aiMode === 'insights' && !insightsResult && !isProcessing && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40">
                                    <Lightbulb size={40} className="mb-3"/>
                                    <p className="text-xs text-center font-medium max-w-[180px]">
                                        Genera insights ocultos sobre tu avatar
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-3">
                            {aiMode === 'audit' && (
                                <button 
                                    onClick={handleAudit} 
                                    disabled={isProcessing || !formData.name || !formData.primary_pain} 
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                                >
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Activity size={14}/>} 
                                    Auditar Perfil ({COSTO_AUDITORIA} CR)
                                </button>
                            )}

                            {aiMode === 'insights' && (
                                <button 
                                    onClick={handleGenerateInsights} 
                                    disabled={isProcessing || !formData.name || !formData.primary_pain} 
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/20"
                                >
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Lightbulb size={14}/>} 
                                    Generar Insights ({COSTO_INSIGHTS} CR)
                                </button>
                            )}

                            {aiMode === 'chat' && (
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={chatInput} 
                                        onChange={(e) => setChatInput(e.target.value)} 
                                        onKeyPress={(e) => e.key === 'Enter' && handleChat()} 
                                        placeholder="Investiga a tu avatar..." 
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner"
                                    />
                                    <button 
                                        onClick={handleChat} 
                                        disabled={isProcessing || !chatInput.trim()} 
                                        className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-purple-900/20"
                                    >
                                        {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .input-viral { 
                    width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; 
                    outline: none; transition: all 0.2s; 
                } 
                .input-viral:focus { 
                    border-color: #db2777; box-shadow: 0 0 0 2px rgba(219, 39, 119, 0.1); 
                } 
                .textarea-viral { 
                    width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); 
                    border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; 
                    outline: none; resize: none; transition: all 0.2s; 
                } 
                .textarea-viral:focus { 
                    border-color: #db2777; box-shadow: 0 0 0 2px rgba(219, 39, 119, 0.1); 
                } 
                .custom-scrollbar::-webkit-scrollbar { width: 4px; } 
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } 
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
            `}</style>
        </div>
    );
};