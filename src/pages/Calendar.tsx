import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; 
import { 
    Plus, X, Rocket, RefreshCw, Zap, Calendar as CalendarIcon,
    Trash2, ChevronLeft, ChevronRight, Video, Instagram, Youtube, Linkedin, LayoutGrid,
    Eye, EyeOff, Lock, Sparkles, CheckCircle2, User, Users, Database, Facebook,
    PenLine, Target
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURACIÓN (FORMATOS ACTUALIZADOS)
// ==================================================================================

interface CalendarEvent {
    id?: string;
    title: string;
    platform: string;
    type: string;
    format?: string;
    notes?: string;
    script?: string; 
    status: string;
    scheduled_date: string;
}

const FOCUS_OPTIONS = ["Viralidad Explosiva", "Ventas Directas", "Autoridad de Nicho", "Comunidad Leal"];

// ✅ FORMATOS DE CONTENIDO REALES (NO TÉCNICOS)
const PLATFORMS_CONFIG: any = {
    'TikTok': { 
        icon: Video, 
        color: 'text-pink-500', 
        formats: ["Video Educativo", "Historia/Storytime", "Video Polémico", "Tendencia/Trend", "Venta Directa"] 
    },
    'Instagram': { 
        icon: Instagram, 
        color: 'text-purple-500', 
        formats: ["Reel Educativo", "Reel de Humor", "Carrusel de Valor", "Historia de Venta", "Meme del Nicho"] 
    },
    'YouTube': { 
        icon: Youtube, 
        color: 'text-red-500', 
        formats: ["Tutorial (How-To)", "Análisis Profundo", "Vlog Diario", "Short Viral", "Entrevista"] 
    },
    'LinkedIn': { 
        icon: Linkedin, 
        color: 'text-blue-500', 
        formats: ["Reflexión Personal", "Caso de Éxito", "Carrusel PDF", "Noticia del Sector"] 
    },
    'Facebook': { 
        icon: Facebook, 
        color: 'text-blue-600', 
        formats: ["Video Meme", "Imagen Inspiracional", "Anuncio de Oferta", "Live"] 
    }
};

// ==================================================================================
// 2. COMPONENTE PRINCIPAL
// ==================================================================================

export const Calendar = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // DATA STATES
    const [avatars, setAvatars] = useState<any[]>([]);
    const [experts, setExperts] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);

    // CALENDAR STATES
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [stats, setStats] = useState({ viral: 0, authority: 0, sales: 0 });
    
    // UI STATES
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [viewScriptMode, setViewScriptMode] = useState(false);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    // PLANNER STATES
    const [planTopic, setPlanTopic] = useState(''); 
    const [planDuration, setPlanDuration] = useState<3 | 7 | 15>(7);
    const [planFocus, setPlanFocus] = useState(FOCUS_OPTIONS[0]);
    const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
    const [selectedFormat, setSelectedFormat] = useState(PLATFORMS_CONFIG['Instagram'].formats[0]);
    const [selectedAvatarId, setSelectedAvatarId] = useState('');
    const [selectedExpertId, setSelectedExpertId] = useState('');
    const [selectedKbId, setSelectedKbId] = useState('');

    // CURRENT EVENT
    const [selectedDateStr, setSelectedDateStr] = useState('');
    const [currentEvent, setCurrentEvent] = useState<CalendarEvent>({ 
        title: '', platform: 'Instagram', type: 'Viralidad', format: 'Reel Educativo', notes: '', status: 'planned', scheduled_date: '', script: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // ==================================================================================
    // 3. LOGIC
    // ==================================================================================

    useEffect(() => {
        if(user) { fetchEvents(); fetchResources(); }
    }, [user, currentDate]);

    const fetchResources = async () => {
        const { data: avt } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id); if(avt) setAvatars(avt);
        const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id); if(exp) setExperts(exp);
        const { data: kb } = await supabase.from('knowledge_bases').select('id, name').eq('user_id', user?.id).limit(5); if(kb) setKnowledgeBases(kb);
    };

    const fetchEvents = async () => {
        try {
            // Calculamos primer y último día del mes en formato UTC para que Supabase entienda
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0); // Último día del mes

            // Convertimos a string YYYY-MM-DD para comparar texto simple (más seguro)
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('content_items')
                .select('*')
                .eq('user_id', user?.id)
                .gte('scheduled_date', startStr)
                .lte('scheduled_date', endStr);

            if (error) throw error;

            if (data) {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    title: item.title || "Sin Título",
                    platform: item.platform || 'Instagram',
                    type: item.content?.objetivo || 'Viral',
                    format: item.content?.formato || 'Video',
                    notes: item.content?.description || '',
                    script: item.content?.guion_completo || '', 
                    status: item.status,
                    scheduled_date: item.scheduled_date // Debe ser YYYY-MM-DD
                }));
                setEvents(mapped);
            }
        } catch (e) { console.error("Error fetching events:", e); }
    };

    useEffect(() => {
        if (PLATFORMS_CONFIG[selectedPlatform]) setSelectedFormat(PLATFORMS_CONFIG[selectedPlatform].formats[0]);
    }, [selectedPlatform]);

    // ==================================================================================
    // 4. GENERACIÓN IA (CON COBRO REAL)
    // ==================================================================================

    const handleGeneratePlan = async () => {
        if (!planTopic.trim()) return alert("Define un tema.");
        
        let cost = planDuration === 3 ? 2 : planDuration === 7 ? 5 : 10;
        
        // 1. Verificar saldo
        if ((userProfile?.credits || 0) < cost) return alert("Saldo insuficiente");

        const avatarName = avatars.find(a => a.id === selectedAvatarId)?.name || "General";
        const expertName = experts.find(e => e.id === selectedExpertId)?.name || "Experto";
        const kbName = knowledgeBases.find(k => k.id === selectedKbId)?.name || "General";

        setIsGeneratingPlan(true);
        try {
            // 2. Llamada IA
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'calendar_generator',
                    userInput: planTopic,
                    settings: { 
                        duration: planDuration, focus: planFocus, format: selectedFormat, platform: selectedPlatform,
                        avatar: avatarName, expert: expertName, knowledge: kbName
                    },
                    estimatedCost: cost
                }
            });

            if (error) throw error;
            if (!data.generatedData || !data.generatedData.calendar) throw new Error("Respuesta IA vacía");
            
            // 3. ✅ COBRO DE CRÉDITOS (AQUÍ ESTÁ LA MAGIA)
            const newCredits = (userProfile?.credits || 0) - cost;
            const { error: creditError } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', user?.id);
            if (creditError) console.error("Error al cobrar", creditError);

            // 4. Guardar Eventos
            const baseDate = new Date(); 
            const newEvents = data.generatedData.calendar.map((item: any, idx: number) => {
                const eventDate = new Date(baseDate); eventDate.setDate(baseDate.getDate() + idx);
                return {
                    user_id: user?.id, type: 'calendar_event', title: item.tema, platform: selectedPlatform,
                    content: {
                        objetivo: item.objetivo, formato: item.formato,
                        description: item.gancho_sugerido, // Gancho
                        concepto: item.idea_contenido,
                        contexto_ia: { avatar: avatarName, expert: expertName }
                    },
                    scheduled_date: formatDateISO(eventDate), status: 'planned'
                };
            });

            await supabase.from('content_items').insert(newEvents);
            await fetchEvents();
            if(refreshProfile) refreshProfile();
            setIsPlanModalOpen(false);
            alert(`✅ Plan Generado. Se descontaron ${cost} créditos.`);

        } catch (e: any) { 
            console.error(e);
            alert("Error IA: " + (e.message || "Intenta de nuevo")); 
        } 
        finally { setIsGeneratingPlan(false); }
    };

    // ==================================================================================
    // 5. HELPERS
    // ==================================================================================
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear(); const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const days = []; for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };
    const formatDateISO = (date: Date) => { const offset = date.getTimezoneOffset(); const localDate = new Date(date.getTime() - (offset*60*1000)); return localDate.toISOString().split('T')[0]; };
    const changeMonth = (offset: number) => { const newDate = new Date(currentDate); newDate.setMonth(newDate.getMonth() + offset); setCurrentDate(newDate); };

    const openDate = (date: Date) => {
        const dateStr = formatDateISO(date); setSelectedDateStr(dateStr);
        setCurrentEvent({ title: '', platform: 'Instagram', type: 'Viralidad', format: 'Reel Educativo', notes: '', status: 'planned', scheduled_date: dateStr, script: '' });
        setIsEditing(false); setIsSidePanelOpen(true); setViewScriptMode(false);
    };
    const openEvent = (e: React.MouseEvent, ev: CalendarEvent) => {
        e.stopPropagation(); setSelectedDateStr(ev.scheduled_date);
        setCurrentEvent({ ...ev, title: ev.title || '', notes: ev.notes || '', script: ev.script || '' });
        setIsEditing(true); setIsSidePanelOpen(true); setViewScriptMode(!!ev.script);
    };
    const saveEvent = async () => {
        if (!currentEvent.title) return alert("Falta título");
        const payload = {
            user_id: user?.id, type: 'calendar_event', title: currentEvent.title, scheduled_date: currentEvent.scheduled_date, platform: currentEvent.platform,
            content: { objetivo: currentEvent.type, formato: currentEvent.format, description: currentEvent.notes, guion_completo: currentEvent.script }
        };
        if (isEditing && currentEvent.id) await supabase.from('content_items').update(payload).eq('id', currentEvent.id);
        else await supabase.from('content_items').insert(payload);
        await fetchEvents(); setIsSidePanelOpen(false);
    };
    const deleteEvent = async () => {
        if(!confirm("¿Borrar?")) return;
        if(currentEvent.id) await supabase.from('content_items').delete().eq('id', currentEvent.id);
        await fetchEvents(); setIsSidePanelOpen(false);
    };
    const generateScript = () => { navigate('/dashboard/script-generator', { state: { topic: currentEvent.title, hook: currentEvent.notes, fromIdeas: true } }); };
    const getTypeColor = (type: string) => {
        const t = (type || '').toLowerCase();
        if (t.includes('viral')) return 'from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30';
        if (t.includes('venta')) return 'from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30';
        return 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30';
    };

    // ==================================================================================
    // 6. RENDER
    // ==================================================================================

    return (
        <div className="max-w-[1800px] mx-auto p-4 md:p-8 space-y-6 font-sans text-white h-[calc(100vh-80px)] flex flex-col animate-in fade-in duration-500">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B0E14]/80 backdrop-blur-md border border-gray-800 p-5 rounded-3xl shadow-2xl z-10">
                <div className="flex items-center gap-6">
                    <CalendarIcon className="text-indigo-500" size={24}/>
                    <h1 className="text-2xl font-black text-white">STRATEGY HUB</h1>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 bg-gray-800 rounded-lg"><ChevronLeft size={16}/></button>
                        <span className="text-sm font-bold w-32 text-center uppercase">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                        <button onClick={() => changeMonth(1)} className="p-2 bg-gray-800 rounded-lg"><ChevronRight size={16}/></button>
                    </div>
                </div>
                <button onClick={() => setIsPlanModalOpen(true)} className="px-6 py-3 bg-white text-black font-black rounded-xl text-xs flex items-center gap-2 hover:bg-gray-200 transition-all shadow-lg hover:scale-105">
                    <Rocket size={16}/> Auto-Plan IA
                </button>
            </div>

            {/* CALENDARIO */}
            <div className="flex-1 bg-[#0F1116] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                <div className="grid grid-cols-7 border-b border-gray-800 bg-[#151820]">
                    {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(d => (<div key={d} className="py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">{d}</div>))}
                </div>
                <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto">
                    {getDaysInMonth(currentDate).map((date, i) => {
                        if (!date) return <div key={i} className="bg-[#0B0E14]/50 border-r border-b border-gray-800/50"></div>;
                        const dateStr = formatDateISO(date);
                        const dayEvents = events.filter(e => e.scheduled_date === dateStr);
                        const isToday = dateStr === formatDateISO(new Date());

                        return (
                            <div key={dateStr} onClick={() => openDate(date)} className={`border-r border-b border-gray-800/50 p-2 min-h-[120px] cursor-pointer hover:bg-[#1A1D24] transition-colors ${isToday ? 'bg-indigo-900/10' : ''}`}>
                                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded ${isToday ? 'bg-indigo-600' : 'text-gray-500'}`}>{date.getDate()}</span>
                                <div className="mt-2 space-y-1">
                                    {dayEvents.map((ev, idx) => {
                                        const Icon = PLATFORMS_CONFIG[ev.platform]?.icon || LayoutGrid;
                                        return (
                                            <div key={idx} onClick={(e) => openEvent(e, ev)} className={`p-1.5 rounded border text-[10px] truncate flex items-center gap-1 ${getTypeColor(ev.type)}`}>
                                                <Icon size={10}/> {ev.title}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ✅ SIDE PANEL - DISEÑO MEJORADO & VISUAL EXPERTA */}
            {isSidePanelOpen && currentEvent && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidePanelOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#0F1115] border-l border-gray-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                        {/* HEADER DEL PANEL */}
                        <div className="p-6 border-b border-gray-800 bg-[#151820] flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedDateStr}</span>
                            </div>
                            <button onClick={() => setIsSidePanelOpen(false)}><X className="text-gray-500 hover:text-white"/></button>
                        </div>

                        {/* BODY */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            
                            {/* 1. TÍTULO EXPERTO (INPUT TRANSPARENTE GRANDE) */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-1 opacity-50">
                                    <PenLine size={12} className="text-indigo-400"/>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Misión / Título</label>
                                </div>
                                <textarea 
                                    className="w-full bg-transparent border-b-2 border-gray-800 text-2xl font-black text-white focus:border-indigo-500 outline-none resize-none overflow-hidden placeholder:text-gray-700 transition-colors py-2 leading-tight" 
                                    rows={2}
                                    placeholder="Escribe el título viral aquí..."
                                    value={currentEvent?.title || ''} 
                                    onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                                />
                            </div>

                            {/* 2. SELECTORES DE FORMATO (NUEVOS) */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plataforma</label>
                                    <div className="relative">
                                        <select value={currentEvent.platform} onChange={(e) => setCurrentEvent({...currentEvent, platform: e.target.value})} className="w-full bg-[#0B0E14] border border-gray-800 text-white text-xs rounded-xl p-4 outline-none appearance-none font-bold hover:border-gray-600 transition-colors cursor-pointer">
                                            {Object.keys(PLATFORMS_CONFIG).map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-4 pointer-events-none text-gray-500"><Target size={14}/></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Formato</label>
                                    <div className="relative">
                                        <select value={currentEvent.format} onChange={(e) => setCurrentEvent({...currentEvent, format: e.target.value})} className="w-full bg-[#0B0E14] border border-gray-800 text-white text-xs rounded-xl p-4 outline-none appearance-none font-bold hover:border-gray-600 transition-colors cursor-pointer">
                                            {PLATFORMS_CONFIG[currentEvent.platform]?.formats.map((f:string) => <option key={f} value={f}>{f}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-4 pointer-events-none text-gray-500"><Video size={14}/></div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. TOGGLE PRO */}
                            <div className="bg-[#0B0E14] p-1.5 rounded-xl flex border border-gray-800">
                                <button onClick={() => setViewScriptMode(false)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-2 ${!viewScriptMode ? 'bg-[#1F2937] text-white shadow-md' : 'text-gray-600 hover:text-white'}`}>
                                    <Sparkles size={12}/> Estrategia
                                </button>
                                <button onClick={() => setViewScriptMode(true)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-2 ${viewScriptMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-gray-600 hover:text-white'}`}>
                                    {currentEvent.script ? <Lock size={12}/> : <EyeOff size={12}/>} {currentEvent.script ? 'Guion Secreto' : 'Sin Guion'}
                                </button>
                            </div>

                            {/* 4. CONTENIDO (LIMPIO Y ESPACIOSO) */}
                            {!viewScriptMode ? (
                                <div className="space-y-3 animate-in fade-in">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Notas de Combate / Gancho</label>
                                    <textarea 
                                        className="w-full bg-[#0B0E14] border border-gray-800 rounded-xl p-5 text-gray-300 text-sm leading-relaxed min-h-[250px] outline-none focus:border-indigo-500/50 transition-colors placeholder:text-gray-700" 
                                        value={currentEvent?.notes || ''} 
                                        onChange={(e) => setCurrentEvent({...currentEvent, notes: e.target.value})} 
                                        // ✅ ESPACIO EN BLANCO Y PLACEHOLDER LIMPIO
                                        placeholder="Escribe aquí tu ángulo, gancho o ideas clave..."
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in">
                                    {currentEvent?.script ? (
                                        <div className="relative group">
                                            <textarea className="w-full bg-[#050505] border border-gray-800 rounded-xl p-6 text-green-400/80 text-xs font-mono min-h-[400px] outline-none custom-scrollbar leading-relaxed selection:bg-green-900/30" value={currentEvent.script} readOnly/>
                                            <div className="absolute top-4 right-4 text-[10px] text-green-600 font-black uppercase tracking-widest border border-green-900/30 px-2 py-1 rounded bg-green-900/10">Encriptado</div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 border-2 border-dashed border-gray-800 rounded-xl bg-[#0B0E14]/30">
                                            <div className="p-4 bg-gray-900/50 rounded-full"><Zap size={24} className="text-gray-600"/></div>
                                            <div>
                                                <p className="text-gray-400 text-sm font-bold">Sin Guion Generado</p>
                                                <p className="text-gray-600 text-xs mt-1">Usa la IA para transformar tu idea en guion.</p>
                                            </div>
                                            <button onClick={generateScript} className="px-6 py-2 bg-white text-black font-black text-xs rounded-lg hover:bg-gray-200 transition shadow-lg shadow-white/10">CREAR AHORA</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="p-6 border-t border-gray-800 bg-[#151820] flex justify-between items-center z-10">
                            {isEditing ? <button onClick={deleteEvent} className="p-3 bg-red-900/10 text-red-500 rounded-xl hover:bg-red-900/20 transition hover:scale-105"><Trash2 size={18}/></button> : <div></div>}
                            <div className="flex gap-3">
                                <button onClick={generateScript} className="px-5 py-3 bg-[#1F2937] text-white font-bold rounded-xl text-xs hover:bg-gray-700 transition flex items-center gap-2 border border-gray-700 shadow-lg">
                                    <Zap size={14} className="text-yellow-400"/> IA
                                </button>
                                <button onClick={saveEvent} className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl text-xs hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 hover:scale-105">
                                    GUARDAR
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL PLANNER (Mismo de antes, solo asegúrate de que use las variables de PLATFORMS_CONFIG) */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#0F1115] border border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="p-8 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black text-white flex items-center gap-2"><Rocket className="text-purple-500"/> ESTRATEGIA MILITAR</h2>
                                <button onClick={() => setIsPlanModalOpen(false)}><X className="text-gray-500 hover:text-white"/></button>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Objetivo de la Misión</label>
                                <input autoFocus type="text" value={planTopic} onChange={(e) => setPlanTopic(e.target.value)} placeholder="Ej: Lanzamiento de producto..." className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-purple-500 transition-colors"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Campo de Batalla</label><select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer">{Object.keys(PLATFORMS_CONFIG).map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                                <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Arma (Formato)</label><select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer">{PLATFORMS_CONFIG[selectedPlatform].formats.map((f:any) => <option key={f} value={f}>{f}</option>)}</select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest flex items-center gap-1"><User size={10}/> Avatar</label><select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer"><option value="">-- General --</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
                                <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest flex items-center gap-1"><Users size={10}/> Experto</label><select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer"><option value="">-- Por defecto --</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
                            </div>
                            <div><label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest flex items-center gap-1"><Database size={10}/> Conocimiento</label><select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer"><option value="">-- IA General --</option>{knowledgeBases.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}</select></div>
                            <div className="pt-2 border-t border-gray-800 mt-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Duración</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[3, 7, 15].map(d => (<button key={d} onClick={() => setPlanDuration(d as any)} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${planDuration === d ? 'bg-purple-600 text-white border-purple-500' : 'bg-[#1A1D24] border-gray-800 text-gray-500'}`}><span className="font-black text-lg">{d}</span><span className="text-[8px] uppercase">Días</span></button>))}
                                </div>
                            </div>
                            <button onClick={handleGeneratePlan} disabled={isGeneratingPlan || !planTopic} className="w-full py-4 bg-white text-black font-black rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-all shadow-xl shadow-white/10 mt-2 disabled:opacity-50">
                                {isGeneratingPlan ? <RefreshCw className="animate-spin" size={20}/> : <Sparkles size={20} className="fill-black"/>}
                                {isGeneratingPlan ? 'DISEÑANDO...' : 'GENERAR ESTRATEGIA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }`}</style>
        </div>
    );
};