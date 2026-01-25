import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Save, Plus, Trash2, Target, Heart, 
    Flame, Zap, MessageSquare, Send, Search, Users, RefreshCw, Copy,
    User, BookOpen // <--- Iconos V30
} from 'lucide-react';

export const AvatarProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    const [avatarsList, setAvatarsList] = useState<any[]>([]);
    const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // --- ESTADOS DEL CHAT Y AUDITORÍA ---
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditCost, setAuditCost] = useState(0);

    // --- CONTEXTO V30 (CEREBRO) ---
    const [experts, setExperts] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    const COSTO_AUDITORIA = 2;
    const COSTO_CHAT = 2;

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

    // --- CARGAR DATOS ---
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
            // 1. Cargar Expertos
            const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id);
            if(exp) setExperts(exp);
            
            // 2. Cargar Avatares
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            // 3. CARGAR CONOCIMIENTOS (AQUÍ ESTÁ LA CORRECCIÓN)
            // Intentamos seleccionar todo (*) para ver qué columnas tienes realmente
            const { data: kb, error } = await supabase
                .from('knowledge_bases') // <--- ASEGÚRATE QUE TU TABLA SE LLAME ASÍ
                .select('*') 
                .eq('user_id', user?.id);
            
            if (error) {
                console.error("Error buscando conocimientos:", error);
                // Si falla, intenta buscar en la tabla 'documents' por si acaso
                const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user?.id);
                if (docs) setKnowledgeBases(docs.map((d: any) => ({ id: d.id, title: d.name || d.title || d.filename })));
            } else if (kb) {
                // Mapeamos para asegurar que siempre haya un 'title' aunque la columna se llame 'name'
                setKnowledgeBases(kb.map((k: any) => ({ 
                    id: k.id, 
                    title: k.title || k.name || k.filename || "Sin Título" 
                })));
            }

            // Seleccionar defaults del perfil
            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
            if (userProfile?.active_avatar_id) setSelectedAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };
    const selectAvatar = (avatar: any) => {
        setSelectedAvatarId(avatar.id);
        setChatResponse(''); 
        setAuditCost(0);
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
            alert("✅ Avatar Guardado y Activado");
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

    // --- IA: AUDITORÍA (PODER V30) ---
    const handleAudit = async () => {
        if (!formData.hell_situation) return alert("Define al menos el 'Infierno' para auditar.");
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_AUDITORIA) {
            return alert(`⚠️ Saldo insuficiente.`);
        }
        setIsAuditing(true);
        setChatResponse('');
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'audit-avatar', 
                    // Enviamos el contexto completo al prompt
                    transcript: `Analiza este avatar con visión de rayos X: ${JSON.stringify(formData)}`, 
                    selectedMode: 'audit', // Usamos el modo de auditoría específico
                    platform: 'Avatar Auditor',
                    expertId: selectedExpertId,     // <--- V30
                    knowledgeBaseId: selectedKbId   // <--- V30
                },
            });
            if (error) throw error;
            setChatResponse(data.generatedData.critique || data.generatedData.answer || "Sin respuesta.");
            setAuditCost(data.finalCost);
            if(refreshProfile) refreshProfile();
        } catch (e: any) { setChatResponse(`⚠️ Error: ${e.message}`); }
        finally { setIsAuditing(false); }
    };

    // --- IA: SIMULADOR (PODER V30) ---
    const handleChat = async () => {
        if (!chatInput) return;
        if (userProfile?.tier !== 'admin' && (userProfile?.credits || 0) < COSTO_CHAT) return alert(`⚠️ Saldo insuficiente.`);
        setIsChatting(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'chat-avatar', 
                    // Simulamos que el Avatar habla, pero usando el conocimiento base para filtrar
                    transcript: `Actúa como este avatar: ${formData.name}. Responde a: "${chatInput}". (Usa la Base de Conocimiento para validar si la respuesta es coherente con la realidad del mercado).`, 
                    selectedMode: 'mentor_ia', 
                    platform: 'Avatar Chat',
                    expertId: selectedExpertId,     // <--- V30
                    knowledgeBaseId: selectedKbId   // <--- V30
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
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Heart className="text-pink-500"/> Laboratorio de Empatía
                    </h1>
                    <p className="text-gray-400">Define los 10 puntos clave de tu cliente ideal.</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        onChange={(e) => {
                            const selected = avatarsList.find(a => a.id === e.target.value);
                            if(selected) selectAvatar(selected);
                        }}
                        value={selectedAvatarId || ""}
                        className="bg-[#0B0E14] border border-gray-700 text-white text-sm rounded-lg p-2 outline-none cursor-pointer hover:border-pink-500 transition-colors"
                    >
                        <option value="" disabled>Cargar Avatar...</option>
                        {avatarsList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <button onClick={handleNewAvatar} className="p-2 bg-pink-600 rounded-lg hover:bg-pink-500 text-white transition-all shadow-lg shadow-pink-900/20"><Plus size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* SECCIÓN 1 */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-all">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Users size={18} className="text-blue-400"/> 1. Identidad Psicológica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nombre Clave</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-viral" placeholder="Ej: Emprendedor Estancado"/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Edad / Generación</label><input type="text" value={formData.age_range} onChange={(e) => setFormData({...formData, age_range: e.target.value})} className="input-viral" placeholder="Ej: 25-40 años"/></div>
                        </div>
                        <div><label className="text-xs font-bold text-red-400 uppercase mb-1 block">Dolor Primario</label><textarea value={formData.primary_pain} onChange={(e) => setFormData({...formData, primary_pain: e.target.value})} className="textarea-viral h-20 border-red-500/30 focus:border-red-500" placeholder="¿Qué le quita el sueño hoy?"/></div>
                    </div>

                    {/* SECCIÓN 2 */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-all">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Flame size={18} className="text-orange-500"/> 2. Infierno, Cielo y Bloqueos</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs font-bold text-orange-400 uppercase mb-1 block">Infierno (Situación Actual)</label><textarea value={formData.hell_situation} onChange={(e) => setFormData({...formData, hell_situation: e.target.value})} className="textarea-viral h-20" placeholder="Describe su realidad negativa..."/></div>
                            <div><label className="text-xs font-bold text-green-400 uppercase mb-1 block">Cielo (Resultado Deseado)</label><textarea value={formData.heaven_situation} onChange={(e) => setFormData({...formData, heaven_situation: e.target.value})} className="textarea-viral h-20" placeholder="¿Cómo sería su vida ideal?"/></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Miedo Oculto</label><input type="text" value={formData.hidden_fear} onChange={(e) => setFormData({...formData, hidden_fear: e.target.value})} className="input-viral" placeholder="Lo que no le cuenta a nadie"/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Objeción Central</label><input type="text" value={formData.central_objection} onChange={(e) => setFormData({...formData, central_objection: e.target.value})} className="input-viral" placeholder="¿Por qué no compraría?"/></div>
                        </div>
                        <div className="mt-4"><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Creencia Limitante</label><input type="text" value={formData.limiting_belief} onChange={(e) => setFormData({...formData, limiting_belief: e.target.value})} className="input-viral" placeholder="La mentira que se dice a sí mismo"/></div>
                    </div>

                    {/* SECCIÓN 3 */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-all">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Zap size={18} className="text-yellow-500"/> 3. Vehículo y Conciencia</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Vehículo Pasado</label><input type="text" value={formData.past_vehicle} onChange={(e) => setFormData({...formData, past_vehicle: e.target.value})} className="input-viral" placeholder="Lo que ya intentó y falló"/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Gatillo (Trigger)</label><input type="text" value={formData.trigger_event} onChange={(e) => setFormData({...formData, trigger_event: e.target.value})} className="input-viral" placeholder="El evento que lo hace buscar ayuda"/></div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nivel de Conciencia</label>
                            <select value={formData.awareness_level} onChange={(e) => setFormData({...formData, awareness_level: e.target.value})} className="input-viral cursor-pointer">
                                <option>Inconsciente del Problema</option>
                                <option>Consciente del Problema</option>
                                <option>Consciente de la Solución</option>
                                <option>Consciente del Producto</option>
                                <option>Totalmente Consciente</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-800">
                        <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50">
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>} Guardar Avatar
                        </button>
                        {selectedAvatarId && (
                            <button onClick={handleDelete} className="text-red-500 hover:text-white flex items-center gap-2 px-4 py-2 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-500/50">
                                <Trash2 size={18}/> Eliminar
                            </button>
                        )}
                    </div>
                </div>

                {/* --- SIDEBAR IA (SIMULADOR V30) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6 sticky top-6 shadow-xl flex flex-col h-[620px]">
                        <div className="border-b border-gray-800 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare size={18} className="text-purple-400"/> Simulador / Auditor</h3>
                        </div>

                        {/* SELECTORES CONTEXTO (NUEVO V30) */}
                        <div className="mb-4 space-y-2">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"><User size={14}/></div>
                                <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-xs rounded-lg p-2 pl-8 focus:border-purple-500 outline-none">
                                    <option value="">-- Experto Auditor --</option>
                                    {experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={14}/></div>
                                <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-xs rounded-lg p-2 pl-8 focus:border-purple-500 outline-none">
                                    <option value="">-- Criterio Base --</option>
                                    {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0B0E14] rounded-xl p-4 border border-gray-800 mb-4 shadow-inner">
                            {chatResponse ? (
                                <div className="space-y-2">
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in font-medium">{chatResponse}</p>
                                    {auditCost > 0 && <span className="text-[10px] text-yellow-500 bg-yellow-900/10 px-2 py-1 rounded inline-block mt-2 border border-yellow-500/20">Costo: {auditCost} créditos</span>}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50"><Target size={32} className="mb-2"/><p className="text-xs text-center">Inicia una auditoría estratégica<br/>o habla con tu avatar.</p></div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <button onClick={handleAudit} disabled={isAuditing || !formData.name} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all border border-gray-700 hover:border-gray-500 shadow-sm">
                                {isAuditing ? <RefreshCw size={14} className="animate-spin"/> : <Search size={14}/>} Auditar con IA (2 Cr)
                            </button>
                            <div className="relative">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Pregúntale algo..." className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-purple-500 outline-none transition-all shadow-inner"/>
                                <button onClick={handleChat} disabled={isChatting || !chatInput} className="absolute right-2 top-2 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50 transition-all shadow-md">
                                    {isChatting ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.input-viral { width: 100%; background-color: #0B0E14; border: 1px solid #1f2937; border-radius: 0.5rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; transition: all 0.2s; } .input-viral:focus { border-color: #db2777; box-shadow: 0 0 0 2px rgba(219, 39, 119, 0.1); } .textarea-viral { width: 100%; background-color: #0B0E14; border: 1px solid #1f2937; border-radius: 0.5rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; resize: none; transition: all 0.2s; } .textarea-viral:focus { border-color: #db2777; box-shadow: 0 0 0 2px rgba(219, 39, 119, 0.1); } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};