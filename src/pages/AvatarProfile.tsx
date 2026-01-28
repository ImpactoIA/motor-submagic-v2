import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Save, Plus, Trash2, Target, Heart, 
    Flame, Zap, MessageSquare, Send, Search, Users, RefreshCw, 
    User, BookOpen, Brain, Activity, AlertTriangle, CheckCircle2
} from 'lucide-react';

export const AvatarProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    const [avatarsList, setAvatarsList] = useState<any[]>([]);
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // --- ESTADOS IA ---
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState(''); // Ahora puede ser HTML/Markdown
    const [auditResult, setAuditResult] = useState<any>(null); // NUEVO: Resultado estructurado
    const [isChatting, setIsChatting] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);

    // --- CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    const COSTO_AUDITORIA = 2;
    const COSTO_CHAT = 1;

    // --- FORMULARIO ---
    const [formData, setFormData] = useState({
        name: '', age_range: '', primary_pain: '', hell_situation: '', heaven_situation: '',
        hidden_fear: '', central_objection: '', limiting_belief: '', past_vehicle: '',
        trigger_event: '', awareness_level: 'Inconsciente del Problema'
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
        setChatResponse(''); 
        setAuditResult(null);
        setFormData({
            name: avatar.name || '',
            age_range: avatar.edad || '', 
            primary_pain: avatar.dolor || '',
            hell_situation: avatar.infierno || '',
            heaven_situation: avatar.cielo || '',
            hidden_fear: avatar.miedo_oculto || '',
            central_objection: avatar.objecion || '',
            limiting_belief: avatar.creencia_limitante || '',
            past_vehicle: avatar.vehiculo_pasado || '',
            trigger_event: avatar.gatillo || '',
            awareness_level: avatar.conciencia || 'Inconsciente del Problema'
        });
    };

    const handleNewAvatar = () => {
        const limit = getPlanLimit();
        if (avatarsList.length >= limit) return alert(`⚠️ Límite de ${limit} avatares alcanzado.`);
        setSelectedAvatarId(null);
        setChatResponse('');
        setAuditResult(null);
        setFormData({ 
            name: '', age_range: '', primary_pain: '', hell_situation: '', heaven_situation: '', 
            hidden_fear: '', central_objection: '', limiting_belief: '', past_vehicle: '', 
            trigger_event: '', awareness_level: 'Inconsciente del Problema' 
        });
    };

    const handleSave = async () => {
        if (!formData.name) return alert("Ponle un Nombre Clave a este avatar");
        if (!user?.id) return; 
        
        setLoading(true);
        try {
            const dataToSave: any = {
                user_id: user.id,
                name: formData.name,
                edad: formData.age_range,
                dolor: formData.primary_pain,
                infierno: formData.hell_situation,
                cielo: formData.heaven_situation,
                miedo_oculto: formData.hidden_fear,
                objecion: formData.central_objection,
                creencia_limitante: formData.limiting_belief,
                vehiculo_pasado: formData.past_vehicle,
                gatillo: formData.trigger_event,
                conciencia: formData.awareness_level
            };

            if (selectedAvatarId) dataToSave.id = selectedAvatarId;

            const { data, error } = await supabase.from('avatars').upsert(dataToSave).select('id').single();
            if (error) throw error;
            
            const newId = data.id;
            await supabase.from('profiles').update({ active_avatar_id: newId }).eq('id', user.id);
            
            if(refreshProfile) refreshProfile();
            setSelectedAvatarId(newId);
            await fetchAvatars(); 
            // Feedback sutil en lugar de alert
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

    // --- IA: AUDITORÍA PSICOLÓGICA (V300) ---
    const handleAudit = async () => {
        if (!formData.name || !formData.primary_pain) return alert("Completa al menos el Nombre y el Dolor.");
        
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_AUDITORIA) {
            return alert(`⚠️ Saldo insuficiente.`);
        }

        setIsAuditing(true);
        setAuditResult(null);
        
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    // Modo específico para auditoría
                    selectedMode: 'audit_avatar', 
                    transcript: JSON.stringify(formData), // Enviamos el JSON del formulario
                    expertId: selectedExpertId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: COSTO_AUDITORIA
                },
            });

            if (error) throw error;
            
            // Esperamos un JSON estructurado del backend
            const result = data.generatedData.audit_result || {
                score: 50,
                feedback: "Falta información para un análisis profundo.",
                blind_spots: ["No has definido el miedo oculto"],
                suggestions: ["Define qué le quita el sueño"]
            };
            
            setAuditResult(result);
            if(refreshProfile) refreshProfile();

        } catch (e: any) { 
            console.error(e);
            alert(`Error: ${e.message}`); 
        } finally { setIsAuditing(false); }
    };

    // --- IA: SIMULADOR DE CHAT (V300) ---
    const handleChat = async () => {
        if (!chatInput) return;
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_CHAT) return alert(`⚠️ Saldo insuficiente.`);
        
        setIsChatting(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'chat_avatar', // Modo Chat
                    transcript: `Usuario pregunta: "${chatInput}". \nContexto del Avatar: ${JSON.stringify(formData)}`,
                    expertId: selectedExpertId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: COSTO_CHAT
                },
            });
            
            if (error) throw error;
            setChatResponse(data.generatedData.answer || "No tengo respuesta.");
            if (refreshProfile) refreshProfile();
            
        } catch (e) { setChatResponse("Error de conexión con el Avatar."); }
        finally { setIsChatting(false); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2 tracking-tighter">
                        <Heart className="text-pink-500" fill="currentColor"/> THE EMPATHY ENGINE
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">Define la psicología profunda de tu cliente ideal para predecir sus decisiones.</p>
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
                    <button onClick={handleNewAvatar} className="p-3 bg-pink-600 rounded-xl hover:bg-pink-500 text-white transition-all shadow-lg shadow-pink-900/20"><Plus size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- IZQUIERDA: FORMULARIO PSICOLÓGICO (8 Cols) --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. IDENTIDAD */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-3xl group-hover:w-2 transition-all"></div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                            <Users size={20} className="text-blue-400"/> 1. Identidad & Dolor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Nombre Clave</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-viral" placeholder="Ej: El Emprendedor Atrapado"/>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Rango de Edad</label>
                                <input type="text" value={formData.age_range} onChange={(e) => setFormData({...formData, age_range: e.target.value})} className="input-viral" placeholder="Ej: 30-45 años"/>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-red-400 uppercase mb-2 block tracking-widest flex items-center gap-2"><AlertTriangle size={12}/> Dolor Primario (The Bleeding Neck)</label>
                            <textarea value={formData.primary_pain} onChange={(e) => setFormData({...formData, primary_pain: e.target.value})} className="textarea-viral h-24 border-red-500/20 focus:border-red-500" placeholder="¿Cuál es el problema urgente que le quita el sueño y pagaría por resolver YA?"/>
                        </div>
                    </div>

                    {/* 2. INFIERNO vs CIELO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 rounded-l-3xl group-hover:w-2 transition-all"></div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                            <Flame size={20} className="text-orange-500"/> 2. Transformación Deseada
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-red-900/5 p-4 rounded-2xl border border-red-500/10">
                                <label className="text-[10px] font-black text-red-400 uppercase mb-2 block tracking-widest">Infierno (Situación Actual)</label>
                                <textarea value={formData.hell_situation} onChange={(e) => setFormData({...formData, hell_situation: e.target.value})} className="textarea-viral h-32 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-red-900/30 text-gray-300" placeholder="Describe su día a día negativo..."/>
                            </div>
                            <div className="bg-green-900/5 p-4 rounded-2xl border border-green-500/10">
                                <label className="text-[10px] font-black text-green-400 uppercase mb-2 block tracking-widest">Cielo (Situación Deseada)</label>
                                <textarea value={formData.heaven_situation} onChange={(e) => setFormData({...formData, heaven_situation: e.target.value})} className="textarea-viral h-32 bg-transparent border-none p-0 focus:ring-0 resize-none placeholder:text-green-900/30 text-gray-300" placeholder="¿Cómo se ve su vida una vez resuelto el problema?"/>
                            </div>
                        </div>
                    </div>

                    {/* 3. PSICOLOGÍA PROFUNDA */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-6 shadow-xl relative group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-3xl group-hover:w-2 transition-all"></div>
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-lg">
                            <Brain size={20} className="text-purple-500"/> 3. Psicología Profunda
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Miedo Oculto (Inconfesable)</label><input type="text" value={formData.hidden_fear} onChange={(e) => setFormData({...formData, hidden_fear: e.target.value})} className="input-viral" placeholder="Ej: Ser visto como un fraude"/></div>
                            <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Objeción Central</label><input type="text" value={formData.central_objection} onChange={(e) => setFormData({...formData, central_objection: e.target.value})} className="input-viral" placeholder="Ej: 'No tengo tiempo'"/></div>
                        </div>
                        <div className="mb-4"><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Creencia Limitante</label><input type="text" value={formData.limiting_belief} onChange={(e) => setFormData({...formData, limiting_belief: e.target.value})} className="input-viral" placeholder="Ej: 'Necesito ser experto técnico para vender'"/></div>
                        
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                            <label className="text-[10px] font-black text-blue-400 uppercase mb-2 block">Nivel de Conciencia (Market Sophistication)</label>
                            <select value={formData.awareness_level} onChange={(e) => setFormData({...formData, awareness_level: e.target.value})} className="w-full bg-transparent text-white text-sm outline-none cursor-pointer font-bold">
                                <option>Inconsciente del Problema</option>
                                <option>Consciente del Problema</option>
                                <option>Consciente de la Solución</option>
                                <option>Consciente del Producto</option>
                                <option>Totalmente Consciente</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                        {selectedAvatarId && (
                            <button onClick={handleDelete} className="text-red-500 hover:text-white px-4 py-3 rounded-xl hover:bg-red-900/20 transition-all text-sm font-bold flex items-center gap-2">
                                <Trash2 size={16}/> Eliminar
                            </button>
                        )}
                        <button onClick={handleSave} disabled={loading} className="px-8 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/5">
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>} GUARDAR AVATAR
                        </button>
                    </div>
                </div>

                {/* --- DERECHA: SIMULADOR IA (4 Cols) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 sticky top-6 shadow-2xl flex flex-col h-[700px]">
                        
                        {/* Header IA */}
                        <div className="border-b border-gray-800 pb-4 mb-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare size={18} className="text-purple-400"/> IA Simulator</h3>
                            <div className="bg-purple-900/20 px-2 py-1 rounded text-[10px] text-purple-400 font-bold border border-purple-500/30">V300</div>
                        </div>

                        {/* Selectores Contexto IA */}
                        <div className="mb-4 space-y-2">
                            <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-purple-500">
                                <option value="">🧠 Experto Auditor</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                            </select>
                            <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-xs text-gray-300 outline-none focus:border-yellow-500">
                                <option value="">📚 Criterio Base (KB)</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                            </select>
                        </div>

                        {/* Pantalla de Resultados (Chat o Auditoría) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] rounded-2xl p-4 border border-gray-800 mb-4 shadow-inner relative">
                            
                            {/* Si hay resultado de Auditoría */}
                            {auditResult ? (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 uppercase font-bold">Claridad del Avatar</span>
                                        <span className={`text-xl font-black ${auditResult.score >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>{auditResult.score}/100</span>
                                    </div>
                                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${auditResult.score >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${auditResult.score}%`}}></div>
                                    </div>
                                    
                                    <div className="bg-red-900/10 p-3 rounded-xl border border-red-500/20">
                                        <h4 className="text-[10px] font-black text-red-400 uppercase mb-2 flex items-center gap-1"><AlertTriangle size={10}/> Puntos Ciegos</h4>
                                        <ul className="space-y-1">
                                            {auditResult.blind_spots?.map((bs: string, i: number) => (
                                                <li key={i} className="text-xs text-gray-300">• {bs}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-green-900/10 p-3 rounded-xl border border-green-500/20">
                                        <h4 className="text-[10px] font-black text-green-400 uppercase mb-2 flex items-center gap-1"><CheckCircle2 size={10}/> Sugerencias</h4>
                                        <p className="text-xs text-gray-300 leading-relaxed">{auditResult.feedback}</p>
                                    </div>
                                </div>
                            ) : chatResponse ? (
                                // Si hay respuesta de Chat
                                <div className="bg-purple-900/10 p-4 rounded-xl border border-purple-500/20 animate-in zoom-in-95">
                                    <span className="text-[10px] text-purple-400 font-bold uppercase mb-2 block">{formData.name || "Avatar"} dice:</span>
                                    <p className="text-sm text-white leading-relaxed font-medium">{chatResponse}</p>
                                </div>
                            ) : (
                                // Estado Vacío
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40">
                                    <Target size={40} className="mb-3"/>
                                    <p className="text-xs text-center font-medium max-w-[150px]">Audita tu perfil o chatea con tu cliente ideal.</p>
                                </div>
                            )}
                        </div>

                        {/* Botones de Acción */}
                        <div className="space-y-3">
                            <button onClick={handleAudit} disabled={isAuditing || !formData.name} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all border border-gray-700">
                                {isAuditing ? <RefreshCw size={14} className="animate-spin"/> : <Activity size={14}/>} Auditar Perfil (2 Cr)
                            </button>
                            <div className="relative">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Hazle una pregunta a tu avatar..." className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner"/>
                                <button onClick={handleChat} disabled={isChatting || !chatInput} className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 transition-all shadow-lg shadow-purple-900/20">
                                    {isChatting ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.input-viral { width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; transition: all 0.2s; } .input-viral:focus { border-color: #db2777; box-shadow: 0 0 0 2px rgba(219, 39, 119, 0.1); } .textarea-viral { width: 100%; background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; resize: none; transition: all 0.2s; } .textarea-viral:focus { border-color: #db2777; box-shadow: 0 0 0 2px rgba(219, 39, 119, 0.1); } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};