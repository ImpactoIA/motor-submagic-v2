import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Save, Plus, Trash2, MessageSquare, 
    Zap, Search, RefreshCw, Send, User, Users, BookOpen, 
    Fingerprint, Mic, Globe, ShieldCheck, Activity, AlertTriangle, CheckCircle2,
    XCircle, ArrowRight, ShieldAlert, Award, Star
} from 'lucide-react';

// ==================================================================================
// 🎨 SUB-COMPONENTE: REPORTE DE AUDITORÍA EXPERTA (NUEVO)
// ==================================================================================
const ExpertAuditReport = ({ data }: { data: any }) => {
  if (!data || !data.auditoria_calidad) {
    // Fallback simple
    return (
        <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20 text-yellow-200 text-xs">
            <p className="font-bold mb-1">Resultado recibido, formato no estándar.</p>
            <pre className="text-[10px] opacity-70 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
  }

  const { auditoria_calidad, analisis_campo_por_campo, perfil_experto_optimizado } = data;
  
  const getStatusColor = (status: string) => {
    if (status?.includes('Magnética') || status?.includes('Único') || status?.includes('Irresistible') || status?.includes('🟢')) 
        return 'text-green-400 border-green-500/30 bg-green-500/10';
    if (status?.includes('Común') || status?.includes('Confuso') || status?.includes('Débil') || status?.includes('🟡')) 
        return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. VELOCÍMETRO DE AUTORIDAD */}
      <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">NIVEL DE AUTORIDAD</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${auditoria_calidad.score_global > 80 ? 'text-green-400' : auditoria_calidad.score_global > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
                {auditoria_calidad.score_global}
              </span>
              <span className="text-gray-600 text-xs font-bold">/ 100</span>
            </div>
            <p className="text-white font-bold text-sm mt-1 flex items-center gap-1">
                <Award size={14} className="text-indigo-400"/> {auditoria_calidad.nivel_autoridad}
            </p>
          </div>
          
          <div className="bg-white/5 p-3 rounded-lg max-w-[140px] backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-1 mb-1 text-indigo-400">
              <ShieldAlert size={12} />
              <span className="text-[9px] font-bold uppercase">Titan Strategy</span>
            </div>
            <p className="text-[10px] text-gray-300 italic leading-tight">"{auditoria_calidad.veredicto_brutal}"</p>
          </div>
        </div>
      </div>

      {/* 2. ANÁLISIS TÁCTICO (HISTORIA - MÉTODO - OFERTA) */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 tracking-widest pl-1">
          <Activity size={12}/> Auditoría Táctica
        </h4>
        
        {analisis_campo_por_campo?.map((item: any, idx: number) => (
          <div key={idx} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 hover:border-indigo-500/30 transition-colors group">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-bold text-white text-xs">{item.campo}</h5>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${getStatusColor(item.calificacion)}`}>
                {item.calificacion?.split(' ')[1] || item.calificacion}
              </span>
            </div>

            <div className="space-y-3">
              {/* Input Usuario */}
              <div className="relative pl-3 border-l-2 border-red-500/20">
                <span className="text-[9px] text-red-400 font-bold block mb-0.5 uppercase">Debilidad Detectada</span>
                <p className="text-[9px] text-red-300 mt-1 flex items-start gap-1 leading-relaxed">
                    <XCircle size={10} className="shrink-0 mt-0.5"/> {item.critica}
                </p>
              </div>

              {/* Corrección Titan */}
              <div className="relative pl-3 border-l-2 border-green-500/40 bg-green-500/5 py-1 rounded-r-lg">
                <span className="text-[9px] text-green-400 font-bold block mb-0.5 uppercase">Estrategia High-Ticket</span>
                <p className="text-gray-200 text-[10px] font-medium leading-relaxed">"{item.correccion_maestra}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. PERFIL OPTIMIZADO */}
      <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-4">
        <h4 className="text-center text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-3">💎 MARCA PERSONAL PULIDA</h4>
        
        <div className="space-y-2">
          <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
            <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Nueva Bio (Posicionamiento)</span>
            <p className="text-white text-xs font-bold">{perfil_experto_optimizado.posicionamiento_unico}</p>
          </div>
          <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
             <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Tu "Mecanismo Único"</span>
             <p className="text-indigo-200 text-xs italic font-bold">✨ {perfil_experto_optimizado.nombre_metodo_comercial}</p>
          </div>
           <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
             <span className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Factor Diferencial</span>
             <p className="text-gray-300 text-[10px]">{perfil_experto_optimizado.factor_diferencial}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

// ==================================================================================
// 🧩 COMPONENTE PRINCIPAL: EXPERT PROFILE
// ==================================================================================

export const ExpertProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    // Listas
    const [expertsList, setExpertsList] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Contexto para el Chat de Prueba (V300)
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedTestAvatarId, setSelectedTestAvatarId] = useState<string>('');
    const [selectedTestKbId, setSelectedTestKbId] = useState<string>('');

    // Estados IA
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [auditResult, setAuditResult] = useState<any>(null); // NUEVO
    const [isChatting, setIsChatting] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);

    const COSTO_AUDITORIA = 2;
    const COSTO_CHAT = 1;

    // Formulario
    const [formData, setFormData] = useState({
        name: '', niche: '', mission: '', tone: '', key_vocabulary: '', framework: ''
    });

    const getPlanLimit = () => {
        const tier = userProfile?.tier || 'free';
        if (tier === 'esencial') return 1; // Solo 1 experto en plan bajo
        if (tier === 'pro') return 3;
        if (tier === 'agency') return 10;
        return 1;
    };

    // --- CARGA DE DATOS ---
    useEffect(() => { 
        if (user) {
            fetchExperts();
            fetchContextData();
        }
    }, [user]);

    const fetchExperts = async () => {
        try {
            const { data } = await supabase.from('expert_profiles').select('*').eq('user_id', user?.id);
            if (data) {
                setExpertsList(data);
                if (userProfile?.active_expert_id) {
                    const active = data.find(e => e.id === userProfile.active_expert_id);
                    if (active) selectExpert(active);
                } else if (data.length > 0) {
                    selectExpert(data[0]);
                }
            }
        } catch (e) { console.error(e); }
    };

    const fetchContextData = async () => {
        try {
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            const { data: kb } = await supabase.from('documents').select('id, title, filename').eq('user_id', user?.id);
            if (kb) setKnowledgeBases(kb.map((k: any) => ({ id: k.id, title: k.title || k.filename })));

            if (userProfile?.active_avatar_id) setSelectedTestAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };

    const selectExpert = (expert: any) => {
        setSelectedExpertId(expert.id);
        setChatResponse('');
        setAuditResult(null);
        setFormData({
            name: expert.name || '',
            niche: expert.niche || '',
            mission: expert.mission || '',
            tone: expert.tone || '',
            key_vocabulary: expert.key_vocabulary || '',
            framework: expert.framework || ''
        });
    };

    const handleNewExpert = () => {
        const limit = getPlanLimit();
        if (expertsList.length >= limit) return alert(`⚠️ Límite de ${limit} expertos alcanzado.`);
        setSelectedExpertId(null);
        setChatResponse('');
        setAuditResult(null);
        setFormData({ name: '', niche: '', mission: '', tone: '', key_vocabulary: '', framework: '' });
    };

    const handleSave = async () => {
        if (!formData.name) return alert("Ponle un nombre a tu Experto");
        setLoading(true);
        try {
            const dataToSave = { ...formData, user_id: user?.id };
            let result;
            if (selectedExpertId) {
                result = await supabase.from('expert_profiles').update(dataToSave).eq('id', selectedExpertId).select().single();
            } else {
                result = await supabase.from('expert_profiles').insert(dataToSave).select().single();
            }

            if (result.error) throw result.error;
            
            await supabase.from('profiles').update({ active_expert_id: result.data.id }).eq('id', user?.id);
            if(refreshProfile) refreshProfile();
            
            await fetchExperts();
            selectExpert(result.data);
            // Feedback sutil
        } catch (e: any) { alert(`Error: ${e.message}`); } 
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if(!selectedExpertId || !confirm("¿Borrar este perfil?")) return;
        try {
            if (userProfile?.active_expert_id === selectedExpertId) {
                await supabase.from('profiles').update({ active_expert_id: null }).eq('id', user?.id);
            }
            await supabase.from('expert_profiles').delete().eq('id', selectedExpertId);
            handleNewExpert();
            await fetchExperts();
            if(refreshProfile) refreshProfile();
        } catch (e) { console.error(e); }
    };

    // --- IA: AUDITORÍA DE EXPERTO (V300) ---
    const handleAudit = async () => {
        if (!formData.niche || !formData.mission) return alert("Define Nicho y Misión.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_AUDITORIA) return alert("Saldo insuficiente.");

        setIsAuditing(true);
        setAuditResult(null);
        
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'audit_expert', // MODO ESPECÍFICO
                    transcript: JSON.stringify(formData), 
                    avatarId: selectedTestAvatarId, // Para que audite en relación al avatar
                    estimatedCost: COSTO_AUDITORIA
                },
            });

            if (error) throw error;
            
            // CONEXIÓN CON EL NUEVO FORMATO DEL PROMPT "TITAN STRATEGY"
            // Esperamos: { auditoria_calidad: {...}, analisis_campo_por_campo: [...], ... }
            const result = data.generatedData || data;

            setAuditResult(result);
            if(refreshProfile) refreshProfile();

        } catch (e: any) { alert(`Error: ${e.message}`); }
        finally { setIsAuditing(false); }
    };

    // --- IA: CHAT DE PRUEBA (V300) ---
    const handleChat = async () => {
        if (!chatInput) return;
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_CHAT) return alert("Saldo insuficiente.");
        
        setIsChatting(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_expert', 
                    transcript: `Usuario pregunta: "${chatInput}". \nContexto del Experto: ${JSON.stringify(formData)}`,
                    avatarId: selectedTestAvatarId, // A quién le habla
                    knowledgeBaseId: selectedTestKbId, // Qué sabe
                    estimatedCost: COSTO_CHAT
                },
            });
            if (error) throw error;
            setChatResponse(data.generatedData.answer || "...");
            if (refreshProfile) refreshProfile();
        } catch (e) { setChatResponse("Error de conexión."); }
        finally { setIsChatting(false); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                        <Fingerprint className="text-indigo-500" fill="currentColor"/> THE AUTHORITY FORGE
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Diseña una identidad de experto magnética y diferénciate del ruido.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select 
                        onChange={(e) => {
                            const selected = expertsList.find(ex => ex.id === e.target.value);
                            if(selected) selectExpert(selected);
                        }}
                        value={selectedExpertId || ""}
                        className="flex-1 bg-[#0a0a0a] border border-white/10 text-white text-sm rounded-xl p-3 outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                        <option value="" disabled>Cargar Experto...</option>
                        {expertsList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <button onClick={handleNewExpert} className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/20"><Plus size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- FORMULARIO IZQUIERDA (8 Cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. POSICIONAMIENTO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-3xl group-hover:w-2 transition-all"></div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                            <Globe size={20} className="text-indigo-400"/> 1. Posicionamiento de Mercado
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Nombre de Marca / Experto</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-viral" placeholder="Ej: Dr. Finanzas"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Nicho Específico</label>
                                <input type="text" value={formData.niche} onChange={(e) => setFormData({...formData, niche: e.target.value})} className="input-viral" placeholder="Ej: Inversiones inmobiliarias para médicos"/>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-indigo-400 uppercase mb-2 block tracking-widest flex items-center gap-2"><ShieldCheck size={12}/> Misión Única (Unique Value Prop)</label>
                            <textarea value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} className="textarea-viral h-24 border-indigo-500/20 focus:border-indigo-500" placeholder="Ayudo a [AVATAR] a lograr [RESULTADO] sin [OBJECIÓN] mediante [MÉTODO]..."/>
                        </div>
                    </div>

                    {/* 2. VOZ Y AUTORIDAD */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-pink-500 rounded-l-3xl group-hover:w-2 transition-all"></div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                            <Mic size={20} className="text-pink-500"/> 2. Voz y Autoridad
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Tono de Voz</label>
                                <input type="text" value={formData.tone} onChange={(e) => setFormData({...formData, tone: e.target.value})} className="input-viral" placeholder="Ej: Disruptivo, Académico, 'Hermano Mayor'"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Palabras de Poder (Jerga)</label>
                                <input type="text" value={formData.key_vocabulary} onChange={(e) => setFormData({...formData, key_vocabulary: e.target.value})} className="input-viral" placeholder="Ej: Matrix, Cashflow, Libertad, Sistema..."/>
                            </div>
                        </div>
                        <div className="bg-yellow-900/5 p-4 rounded-2xl border border-yellow-500/10">
                            <label className="text-[10px] font-black text-yellow-400 uppercase mb-2 block tracking-widest">Framework / Metodología Propietaria</label>
                            <textarea value={formData.framework} onChange={(e) => setFormData({...formData, framework: e.target.value})} className="textarea-viral h-20 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-yellow-900/30 text-gray-300" placeholder="Describe tu método paso a paso (Ej: El Método 3C: Captar, Convertir, Cerrar)"/>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                        {selectedExpertId && (
                            <button onClick={handleDelete} className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2">
                                <Trash2 size={16}/> Eliminar
                            </button>
                        )}
                        <button onClick={handleSave} disabled={loading} className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/5">
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>} GUARDAR IDENTIDAD
                        </button>
                    </div>
                </div>

                {/* --- DERECHA: SIMULADOR IA (4 Cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 sticky top-6 shadow-2xl flex flex-col h-[700px]">
                        
                        {/* Header IA */}
                        <div className="border-b border-gray-800 pb-4 mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare size={18} className="text-green-400"/> Simulador de Voz</h3>
                            <div className="bg-green-900/20 px-2 py-1 rounded text-[10px] text-green-400 font-bold border border-green-500/30">V300</div>
                        </div>

                        {/* Configuración de Prueba */}
                        <div className="mb-4 space-y-2">
                             <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Users size={12}/></div>
                                <select value={selectedTestAvatarId} onChange={(e) => setSelectedTestAvatarId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 pl-9 text-xs text-gray-300 outline-none focus:border-pink-500">
                                    <option value="">Hablarle a: (Avatar)</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={12}/></div>
                                <select value={selectedTestKbId} onChange={(e) => setSelectedTestKbId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 pl-9 text-xs text-gray-300 outline-none focus:border-yellow-500">
                                    <option value="">Usar Conocimiento: (KB)</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Pantalla Resultados */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-2xl p-4 border border-gray-800 mb-4 shadow-inner relative">
                            
                            {/* LOGICA DE VISUALIZACIÓN */}
                            {auditResult ? (
                                <ExpertAuditReport data={auditResult} />
                            ) : chatResponse ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2 items-center mb-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">EX</div>
                                        <span className="text-xs font-bold text-indigo-300">{formData.name || 'Experto'}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in font-medium pl-8 border-l-2 border-indigo-500/20">{chatResponse}</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40">
                                    <Fingerprint size={40} className="mb-3"/>
                                    <p className="text-xs text-center font-medium max-w-[150px]">Audita tu autoridad o prueba tu voz.</p>
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="space-y-3">
                            <button onClick={handleAudit} disabled={isAuditing || !formData.niche} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all border border-gray-700">
                                {isAuditing ? <RefreshCw size={14} className="animate-spin"/> : <Activity size={14}/>} Auditar Autoridad (2 Cr)
                            </button>
                            <div className="relative">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Hazle una pregunta técnica..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-green-500 outline-none transition-all shadow-inner"/>
                                <button onClick={handleChat} disabled={isChatting || !chatInput} className="absolute right-2 top-2 p-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-green-900/20">
                                    {isChatting ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.input-viral { width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; transition: all 0.2s; } .input-viral:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); } .textarea-viral { width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; resize: none; transition: all 0.2s; } .textarea-viral:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};