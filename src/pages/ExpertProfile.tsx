import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Save, Plus, Trash2, Target, MessageSquare, 
    Zap, Search, RefreshCw, Send, User, Users, BookOpen, 
    Fingerprint, Mic
} from 'lucide-react';

export const ExpertProfile = () => {
    const { user, userProfile, refreshProfile } = useAuth();
    
    // Listas
    const [expertsList, setExpertsList] = useState<any[]>([]);
    const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Contexto para el Chat de Prueba (V30)
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    const [selectedTestAvatarId, setSelectedTestAvatarId] = useState<string>('');
    const [selectedTestKbId, setSelectedTestKbId] = useState<string>('');

    // Estados del Chat
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditCost, setAuditCost] = useState(0);

    // Precios
    const COSTO_AUDITORIA = 2;
    const COSTO_CHAT = 2;

    // Formulario
    const [formData, setFormData] = useState({
        name: '',
        niche: '',
        mission: '',
        tone: '',
        key_vocabulary: '',
        framework: ''
    });

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

    // --- CORRECCIÓN DE CARGA (PDFs) ---
    // ✅ AQUÍ ESTABA EL ERROR: Se agregó 'async' antes de ()
    const fetchContextData = async () => {
        try {
            // 1. Cargar Avatares
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            // 2. Cargar Conocimientos (Busca nombre o titulo)
            const { data: kb, error } = await supabase.from('knowledge_bases').select('*').eq('user_id', user?.id);
            
            if (kb && kb.length > 0) {
                setKnowledgeBases(kb.map((k: any) => ({ 
                    id: k.id, 
                    title: k.title || k.name || k.filename || "Documento sin nombre" 
                })));
            } else {
                // Fallback: Buscar en 'documents'
                const { data: docs } = await supabase.from('documents').select('*').eq('user_id', user?.id);
                if (docs) {
                    setKnowledgeBases(docs.map((d: any) => ({ 
                        id: d.id, 
                        title: d.title || d.name || d.filename || "Documento" 
                    })));
                }
            }

            if (userProfile?.active_avatar_id) setSelectedTestAvatarId(userProfile.active_avatar_id);
        } catch (e) { console.error(e); }
    };

    const selectExpert = (expert: any) => {
        setSelectedExpertId(expert.id);
        setChatResponse('');
        setAuditCost(0);
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
        setSelectedExpertId(null);
        setChatResponse('');
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
            
            // Activar este experto en el perfil
            await supabase.from('profiles').update({ active_expert_id: result.data.id }).eq('id', user?.id);
            
            if(refreshProfile) refreshProfile();
            await fetchExperts();
            selectExpert(result.data);
            alert("✅ Experto Guardado y Activado");
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

    // --- IA: AUDITORÍA DE IDENTIDAD ---
    const handleAudit = async () => {
        if (!formData.mission) return alert("Define una misión para auditar.");
        if ((userProfile?.credits || 0) < COSTO_AUDITORIA) return alert("Saldo insuficiente.");

        setIsAuditing(true);
        setChatResponse('');
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'audit-expert', 
                    transcript: `Analiza este perfil de experto: ${JSON.stringify(formData)}`, 
                    selectedMode: 'audit', 
                    platform: 'Expert Auditor',
                    expertId: selectedExpertId, 
                    knowledgeBaseId: selectedTestKbId, 
                    estimatedCost: COSTO_AUDITORIA
                },
            });
            if (error) throw error;
            setChatResponse(data.generatedData.critique || "Análisis completado.");
            setAuditCost(data.finalCost);
            if(refreshProfile) refreshProfile();
        } catch (e: any) { setChatResponse(`Error: ${e.message}`); }
        finally { setIsAuditing(false); }
    };

    // --- IA: CHAT DE PRUEBA (SIMULADOR) ---
    const handleChat = async () => {
        if (!chatInput) return;
        if ((userProfile?.credits || 0) < COSTO_CHAT) return alert("Saldo insuficiente.");
        
        setIsChatting(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'chat-expert', 
                    transcript: `Actúa como este Experto: ${formData.name}. Responde a: "${chatInput}".`, 
                    selectedMode: 'mentor_ia', 
                    platform: 'Expert Chat',
                    expertId: selectedExpertId,     
                    avatarId: selectedTestAvatarId,
                    knowledgeBaseId: selectedTestKbId, 
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
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <Fingerprint className="text-indigo-500"/> Identidad del Experto
                    </h1>
                    <p className="text-gray-400">Define quién eres, cómo hablas y cuál es tu misión.</p>
                </div>
                <div className="flex gap-2">
                    <select 
                        onChange={(e) => {
                            const selected = expertsList.find(ex => ex.id === e.target.value);
                            if(selected) selectExpert(selected);
                        }}
                        value={selectedExpertId || ""}
                        className="bg-[#0B0E14] border border-gray-700 text-white text-sm rounded-lg p-2 outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                        <option value="" disabled>Cargar Experto...</option>
                        {expertsList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                    <button onClick={handleNewExpert} className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-900/20"><Plus size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- FORMULARIO IZQUIERDA --- */}
                <div className="lg:col-span-8 space-y-6">
                    {/* SECCIÓN 1: IDENTIDAD */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-all">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><User size={18} className="text-indigo-400"/> 1. Datos Esenciales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nombre del Experto</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input-viral" placeholder="Ej: Dr. Finanzas"/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nicho de Mercado</label><input type="text" value={formData.niche} onChange={(e) => setFormData({...formData, niche: e.target.value})} className="input-viral" placeholder="Ej: Inversiones para principiantes"/></div>
                        </div>
                        <div><label className="text-xs font-bold text-indigo-400 uppercase mb-1 block">Misión Principal</label><textarea value={formData.mission} onChange={(e) => setFormData({...formData, mission: e.target.value})} className="textarea-viral h-20 border-indigo-500/30 focus:border-indigo-500" placeholder="Ayudo a X a lograr Y mediante Z..."/></div>
                    </div>

                    {/* SECCIÓN 2: VOZ Y ESTILO */}
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-all">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Mic size={18} className="text-pink-500"/> 2. Tono y Comunicación</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tono de Voz</label><input type="text" value={formData.tone} onChange={(e) => setFormData({...formData, tone: e.target.value})} className="input-viral" placeholder="Ej: Autoritario, Empático, Sarcástico..."/></div>
                            <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Vocabulario Clave</label><input type="text" value={formData.key_vocabulary} onChange={(e) => setFormData({...formData, key_vocabulary: e.target.value})} className="input-viral" placeholder="Ej: Libertad, Cashflow, Matrix..."/></div>
                        </div>
                        <div><label className="text-xs font-bold text-yellow-500 uppercase mb-1 block">Framework / Metodología</label><textarea value={formData.framework} onChange={(e) => setFormData({...formData, framework: e.target.value})} className="textarea-viral h-20" placeholder="¿Cuál es tu método único? (Ej: El Método 3C)"/></div>
                    </div>

                    <div className="flex justify-between pt-6 border-t border-gray-800">
                        <button onClick={handleSave} disabled={loading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50">
                            {loading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18}/>} Guardar Experto
                        </button>
                        {selectedExpertId && (
                            <button onClick={handleDelete} className="text-red-500 hover:text-white flex items-center gap-2 px-4 py-2 hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-500/50">
                                <Trash2 size={18}/> Eliminar
                            </button>
                        )}
                    </div>
                </div>

                {/* --- SIDEBAR IA (SIMULADOR DE EXPERTO V31) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6 sticky top-6 shadow-xl flex flex-col h-[600px]">
                        <div className="border-b border-gray-800 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare size={18} className="text-green-400"/> Simulador de Voz</h3>
                            <p className="text-xs text-gray-500 mt-1">Prueba cómo responde tu experto.</p>
                        </div>

                        {/* SELECTORES CONTEXTO PARA PRUEBAS */}
                        <div className="mb-4 space-y-2 bg-gray-900/50 p-3 rounded-xl border border-white/5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Configuración de Prueba</label>
                            
                            {/* Avatar Selector */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"><Users size={12}/></div>
                                <select value={selectedTestAvatarId} onChange={(e) => setSelectedTestAvatarId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-[10px] rounded-lg p-2 pl-8 focus:border-pink-500 outline-none">
                                    <option value="">-- Hablarle a Avatar --</option>
                                    {avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>

                            {/* Knowledge Base Selector (CORREGIDO) */}
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400"><BookOpen size={12}/></div>
                                <select value={selectedTestKbId} onChange={(e) => setSelectedTestKbId(e.target.value)} className="w-full bg-[#0B0E14] border border-gray-700 text-white text-[10px] rounded-lg p-2 pl-8 focus:border-yellow-500 outline-none">
                                    <option value="">-- Usar Conocimiento --</option>
                                    {knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0B0E14] rounded-xl p-4 border border-gray-800 mb-4 shadow-inner">
                            {chatResponse ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2 items-center mb-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">EX</div>
                                        <span className="text-xs font-bold text-indigo-300">{formData.name || 'Experto'}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed animate-in fade-in font-medium pl-8 border-l-2 border-indigo-500/20">{chatResponse}</p>
                                    {auditCost > 0 && <span className="text-[10px] text-yellow-500 bg-yellow-900/10 px-2 py-1 rounded inline-block mt-2 ml-8 border border-yellow-500/20">Costo: {auditCost} créditos</span>}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50"><Target size={32} className="mb-2"/><p className="text-xs text-center">Inicia una auditoría<br/>o chatea con tu experto.</p></div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button onClick={handleAudit} disabled={isAuditing || !formData.mission} className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all border border-gray-700 hover:border-gray-500 shadow-sm">
                                {isAuditing ? <RefreshCw size={14} className="animate-spin"/> : <Search size={14}/>} Auditar Perfil (2 Cr)
                            </button>
                            <div className="relative">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleChat()} placeholder="Hazle una pregunta..." className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-green-500 outline-none transition-all shadow-inner"/>
                                <button onClick={handleChat} disabled={isChatting || !chatInput} className="absolute right-2 top-2 p-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg disabled:opacity-50 transition-all shadow-md">
                                    {isChatting ? <RefreshCw size={14} className="animate-spin"/> : <Send size={14}/>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.input-viral { width: 100%; background-color: #0B0E14; border: 1px solid #1f2937; border-radius: 0.5rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; transition: all 0.2s; } .input-viral:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); } .textarea-viral { width: 100%; background-color: #0B0E14; border: 1px solid #1f2937; border-radius: 0.5rem; padding: 0.75rem; color: white; font-size: 0.875rem; outline: none; resize: none; transition: all 0.2s; } .textarea-viral:focus { border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1); } .custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};