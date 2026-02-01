import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; 
import { 
    Plus, X, Rocket, RefreshCw, Zap, Calendar as CalendarIcon,
    Trash2, ChevronLeft, ChevronRight, Video, Instagram, Youtube, Linkedin, LayoutGrid,
    Eye, EyeOff, Lock, Sparkles, BarChart3, MoreHorizontal, CheckCircle2
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURACIÓN & TIPOS
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
const FORMAT_OPTIONS = ["Reels/TikTok (Vertical)", "Carruseles", "YouTube Shorts", "LinkedIn Text"];

const PLATFORM_ICONS: any = {
    'TikTok': Video,
    'Reels': Instagram,
    'YouTube': Youtube,
    'LinkedIn': Linkedin,
    'General': LayoutGrid
};

// ==================================================================================
// 2. COMPONENTE PRINCIPAL
// ==================================================================================

export const Calendar = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS ---
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [stats, setStats] = useState({ viral: 0, authority: 0, sales: 0 });
    
    // UI States
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [viewScriptMode, setViewScriptMode] = useState(false);
    
    // IA States
    const [planTopic, setPlanTopic] = useState(''); 
    const [planDuration, setPlanDuration] = useState<3 | 7 | 15>(7);
    const [planFocus, setPlanFocus] = useState(FOCUS_OPTIONS[0]);
    const [planFormat, setPlanFormat] = useState(FORMAT_OPTIONS[0]);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    // Evento Actual
    const [selectedDateStr, setSelectedDateStr] = useState('');
    const [currentEvent, setCurrentEvent] = useState<CalendarEvent>({ 
        title: '', platform: 'TikTok', type: 'Viralidad', format: 'Video Corto', notes: '', status: 'planned', scheduled_date: '', script: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // ==================================================================================
    // 3. LÓGICA DE CALENDARIO
    // ==================================================================================

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const formatDateISO = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset*60*1000));
        return localDate.toISOString().split('T')[0];
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // ==================================================================================
    // 4. DATA FETCHING
    // ==================================================================================
    
    useEffect(() => {
        if(user) fetchEvents();
    }, [user, currentDate]);

    const fetchEvents = async () => {
        try {
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

            const { data } = await supabase
                .from('content_items')
                .select('*')
                .eq('user_id', user?.id)
                .gte('scheduled_date', startOfMonth)
                .lte('scheduled_date', endOfMonth);

            if (data) {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    title: item.title || "Sin Título",
                    platform: item.platform || 'TikTok',
                    type: item.content?.objetivo || 'Viral',
                    format: item.content?.formato || 'Video',
                    notes: item.content?.description || item.content?.concepto || '',
                    script: item.content?.guion_completo || '', 
                    status: item.status,
                    scheduled_date: item.scheduled_date
                }));
                setEvents(mapped);
            }
        } catch (e) { console.error(e); }
    };

    // Stats
    useEffect(() => {
        if (events.length === 0) { setStats({ viral: 0, authority: 0, sales: 0 }); return; }
        const total = events.length;
        const count = (str: string) => events.filter(e => e.type?.toLowerCase().includes(str)).length;
        setStats({
            viral: Math.round((count('viral') / total) * 100),
            authority: Math.round(((count('autoridad') + count('educar')) / total) * 100),
            sales: Math.round(((count('venta') + count('persuadir')) / total) * 100)
        });
    }, [events]);

    // ==================================================================================
    // 5. ACCIONES (IA & CRUD)
    // ==================================================================================

    const handleGeneratePlan = async () => {
        if (!planTopic.trim()) return alert("Define un tema.");
        let cost = planDuration === 3 ? 2 : planDuration === 7 ? 5 : 10;
        if ((userProfile?.credits || 0) < cost) return alert("Saldo insuficiente");

        setIsGeneratingPlan(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'calendar_generator',
                    userInput: planTopic,
                    settings: { duration: planDuration, focus: planFocus, format: planFormat },
                    estimatedCost: cost
                }
            });
            if (error) throw error;
            
            const baseDate = new Date(); // Empieza hoy o desde la fecha seleccionada en un input (opcional)
            const newEvents = data.generatedData.calendar.map((item: any, idx: number) => {
                const eventDate = new Date(baseDate);
                eventDate.setDate(baseDate.getDate() + idx);
                return {
                    user_id: user?.id,
                    type: 'calendar_event',
                    title: item.idea_contenido || item.tema,
                    content: {
                        objetivo: item.objetivo,
                        formato: item.formato,
                        description: item.gancho_sugerido,
                        concepto: item.idea_contenido
                    },
                    scheduled_date: formatDateISO(eventDate),
                    platform: planFormat.includes('TikTok') ? 'TikTok' : 'Reels',
                    status: 'planned'
                };
            });

            await supabase.from('content_items').insert(newEvents);
            await fetchEvents();
            if(refreshProfile) refreshProfile();
            setIsPlanModalOpen(false);
        } catch (e) { alert("Error IA"); } 
        finally { setIsGeneratingPlan(false); }
    };

    const openDate = (date: Date) => {
        const dateStr = formatDateISO(date);
        setSelectedDateStr(dateStr);
        setCurrentEvent({ title: '', platform: 'TikTok', type: 'Viral', format: 'Video', notes: '', status: 'planned', scheduled_date: dateStr, script: '' });
        setIsEditing(false);
        setIsSidePanelOpen(true);
        setViewScriptMode(false);
    };

    const openEvent = (e: React.MouseEvent, ev: CalendarEvent) => {
        e.stopPropagation();
        setSelectedDateStr(ev.scheduled_date);
        setCurrentEvent(ev);
        setIsEditing(true);
        setIsSidePanelOpen(true);
        setViewScriptMode(!!ev.script);
    };

    const saveEvent = async () => {
        if (!currentEvent.title) return alert("Falta título");
        const payload = {
            user_id: user?.id, type: 'calendar_event', title: currentEvent.title, scheduled_date: currentEvent.scheduled_date, platform: currentEvent.platform,
            content: { objetivo: currentEvent.type, formato: currentEvent.format, description: currentEvent.notes, guion_completo: currentEvent.script }
        };

        if (isEditing && currentEvent.id) await supabase.from('content_items').update(payload).eq('id', currentEvent.id);
        else await supabase.from('content_items').insert(payload);
        
        await fetchEvents();
        setIsSidePanelOpen(false);
    };

    const deleteEvent = async () => {
        if(!confirm("¿Borrar?")) return;
        if(currentEvent.id) await supabase.from('content_items').delete().eq('id', currentEvent.id);
        await fetchEvents();
        setIsSidePanelOpen(false);
    };

    const generateScript = () => {
        navigate('/dashboard/script-generator', { state: { topic: currentEvent.title, hook: currentEvent.notes, fromIdeas: true } });
    };

    // Helper Styles
    const getTypeColor = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('viral')) return 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30';
        if (t.includes('venta')) return 'from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30';
        return 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30';
    };

    // ==================================================================================
    // 6. RENDERIZADO VISUAL PRO
    // ==================================================================================

    return (
        <div className="max-w-[1800px] mx-auto p-4 md:p-8 space-y-6 font-sans text-white h-[calc(100vh-80px)] flex flex-col animate-in fade-in duration-500">
            
            {/* --- HEADER DE COMANDO --- */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B0E14]/80 backdrop-blur-md border border-gray-800 p-5 rounded-3xl shadow-2xl z-10">
                <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-lg shadow-indigo-500/20">
                        <CalendarIcon className="text-white" size={24}/>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white">STRATEGY HUB</h1>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Titan V300 • War Room</p>
                    </div>
                    
                    <div className="hidden md:flex items-center bg-[#151820] p-1 rounded-xl border border-gray-800 ml-6">
                        <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"><ChevronLeft size={18}/></button>
                        <span className="w-40 text-center font-bold text-sm text-gray-200 uppercase tracking-wider">
                            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all"><ChevronRight size={18}/></button>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto justify-end">
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 border-r border-gray-800 pr-4">
                        <div className="flex flex-col items-center"><span className="text-purple-400">{stats.viral}%</span><span>Viral</span></div>
                        <div className="flex flex-col items-center"><span className="text-green-400">{stats.sales}%</span><span>Venta</span></div>
                        <div className="flex flex-col items-center"><span className="text-blue-400">{stats.authority}%</span><span>Auto</span></div>
                    </div>
                    <button onClick={() => setIsPlanModalOpen(true)} className="px-6 py-3 bg-white text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-gray-200 transition-all shadow-lg hover:scale-105 active:scale-95">
                        <Rocket size={16}/> Auto-Plan IA
                    </button>
                </div>
            </div>

            {/* --- CALENDARIO GRID PREMIUM --- */}
            <div className="flex-1 bg-[#0F1116] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                
                {/* Días de la semana */}
                <div className="grid grid-cols-7 border-b border-gray-800 bg-[#151820]">
                    {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(d => (
                        <div key={d} className="py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.25em]">{d}</div>
                    ))}
                </div>
                
                {/* Celdas */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                    {getDaysInMonth(currentDate).map((date, i) => {
                        if (!date) return <div key={i} className="bg-[#0B0E14]/50 border-r border-b border-gray-800/50"></div>;

                        const dateStr = formatDateISO(date);
                        const dayEvents = events.filter(e => e.scheduled_date === dateStr);
                        const isToday = dateStr === formatDateISO(new Date());

                        return (
                            <div 
                                key={dateStr} 
                                onClick={() => openDate(date)}
                                className={`
                                    border-r border-b border-gray-800/50 p-3 min-h-[140px] relative group transition-all duration-200 cursor-pointer flex flex-col gap-2
                                    hover:bg-[#1A1D24] ${isToday ? 'bg-indigo-900/10' : 'bg-[#0B0E14]'}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-500 group-hover:text-white bg-gray-900'}`}>
                                        {date.getDate()}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 rounded-md bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"><Plus size={12}/></div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
                                    {dayEvents.map((ev, idx) => {
                                        const colorClasses = getTypeColor(ev.type);
                                        const Icon = PLATFORM_ICONS[ev.platform] || LayoutGrid;
                                        
                                        return (
                                            <div key={idx} onClick={(e) => openEvent(e, ev)} className={`
                                                relative px-2.5 py-2 rounded-lg border bg-gradient-to-r ${colorClasses}
                                                hover:brightness-125 transition-all group/card shadow-sm
                                            `}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold text-white truncate pr-2 w-full">{ev.title}</span>
                                                    <Icon size={10} className="opacity-70 shrink-0"/>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-70">{ev.platform}</span>
                                                    {ev.script && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)] animate-pulse" title="Script Ready"></div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- SIDE PANEL (INSPECTOR) --- */}
            {isSidePanelOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsSidePanelOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-[#0F1115] border-l border-gray-800 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                        
                        {/* Panel Header */}
                        <div className="p-6 border-b border-gray-800 bg-[#151820] flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <CalendarIcon size={14} className="text-gray-500"/>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedDateStr}</span>
                                </div>
                                <h2 className="text-xl font-black text-white">INSPECTOR DE CONTENIDO</h2>
                            </div>
                            <button onClick={() => setIsSidePanelOpen(false)} className="p-2 hover:bg-gray-800 rounded-full text-gray-500 hover:text-white transition"><X/></button>
                        </div>

                        {/* Panel Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            
                            {/* Input Título */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Idea / Gancho</label>
                                <textarea 
                                    className="w-full bg-[#0B0E14] border border-gray-800 rounded-xl p-4 text-white text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-24 placeholder:text-gray-700 transition-all"
                                    value={currentEvent.title}
                                    placeholder="Escribe el título viral aquí..."
                                    onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                                />
                            </div>

                            {/* Selectors */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plataforma</label>
                                    <div className="relative">
                                        <select value={currentEvent.platform} onChange={(e) => setCurrentEvent({...currentEvent, platform: e.target.value})} className="w-full bg-[#0B0E14] border border-gray-800 text-white text-xs rounded-xl p-3 pl-9 outline-none appearance-none font-bold hover:border-gray-700 transition-colors">
                                            {Object.keys(PLATFORM_ICONS).map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <div className="absolute left-3 top-3 text-gray-500 pointer-events-none"><Video size={14}/></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Objetivo</label>
                                    <div className="relative">
                                        <select value={currentEvent.type} onChange={(e) => setCurrentEvent({...currentEvent, type: e.target.value})} className="w-full bg-[#0B0E14] border border-gray-800 text-white text-xs rounded-xl p-3 pl-9 outline-none appearance-none font-bold hover:border-gray-700 transition-colors">
                                            <option>Viralidad</option><option>Venta</option><option>Autoridad</option>
                                        </select>
                                        <div className="absolute left-3 top-3 text-gray-500 pointer-events-none"><Target size={14}/></div>
                                    </div>
                                </div>
                            </div>

                            {/* --- TAB SWITCHER PRO --- */}
                            <div className="bg-[#0B0E14] p-1.5 rounded-xl flex border border-gray-800 relative">
                                <button 
                                    onClick={() => setViewScriptMode(false)} 
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${!viewScriptMode ? 'bg-[#1F2937] text-white shadow-md border border-gray-700' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Sparkles size={14} className={!viewScriptMode ? "text-yellow-400" : ""}/> Estrategia
                                </button>
                                <button 
                                    onClick={() => setViewScriptMode(true)} 
                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${viewScriptMode ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {currentEvent.script ? <Eye size={14}/> : <EyeOff size={14}/>} {currentEvent.script ? 'Ver Guion' : 'Sin Guion'}
                                </button>
                            </div>

                            {/* --- DYNAMIC CONTENT AREA --- */}
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {!viewScriptMode ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contexto / Gancho</label>
                                        <textarea 
                                            className="w-full bg-[#0B0E14] border border-gray-800 rounded-xl p-4 text-gray-300 text-xs leading-relaxed focus:border-indigo-500 outline-none resize-none h-48 placeholder:text-gray-700"
                                            placeholder="Detalles estratégicos..."
                                            value={currentEvent.notes}
                                            onChange={(e) => setCurrentEvent({...currentEvent, notes: e.target.value})}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {currentEvent.script ? (
                                            <div className="relative group">
                                                <div className="absolute -top-3 left-4 bg-[#0F1115] px-2 text-[10px] font-bold text-green-500 flex items-center gap-1 border border-green-900/30 rounded shadow-sm">
                                                    <Lock size={10}/> GUION ENCRIPTADO
                                                </div>
                                                <textarea 
                                                    className="w-full bg-[#050505] border border-gray-800 rounded-xl p-6 text-gray-300 text-xs font-mono leading-relaxed outline-none resize-none h-[400px] custom-scrollbar focus:border-green-500/50 transition-colors selection:bg-green-500/30"
                                                    value={currentEvent.script}
                                                    readOnly
                                                />
                                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => {navigator.clipboard.writeText(currentEvent.script || ''); alert('Copiado!')}} className="p-2 bg-gray-800 hover:bg-white hover:text-black rounded-lg text-white shadow-lg transition-all"><CheckCircle2 size={16}/></button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-48 text-center space-y-4 border-2 border-dashed border-gray-800 rounded-xl p-6 bg-[#0B0E14]/50">
                                                <div className="p-4 bg-gray-900 rounded-full"><Zap size={24} className="text-gray-600"/></div>
                                                <div>
                                                    <p className="text-gray-400 text-sm font-bold">Sin Guion Generado</p>
                                                    <p className="text-gray-600 text-xs mt-1">Usa la IA para escribirlo automáticamente.</p>
                                                </div>
                                                <button onClick={generateScript} className="px-6 py-2 bg-white text-black font-black text-xs rounded-lg hover:bg-gray-200 transition">CREAR AHORA</button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel Footer */}
                        <div className="p-6 border-t border-gray-800 bg-[#151820] flex justify-between items-center z-10">
                            {isEditing ? (
                                <button onClick={deleteEvent} className="p-3 bg-red-900/10 text-red-500 rounded-xl hover:bg-red-900/20 transition hover:scale-105"><Trash2 size={18}/></button>
                            ) : <div></div>}
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

            {/* --- MODAL PLANNER IA (PREMIUM LOOK) --- */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-[#0F1115] border border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black text-white flex items-center gap-2"><Rocket className="text-purple-500"/> ESTRATEGA IA</h2>
                                <button onClick={() => setIsPlanModalOpen(false)} className="text-gray-500 hover:text-white transition"><X/></button>
                            </div>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Tema Principal</label>
                                    <input autoFocus type="text" value={planTopic} onChange={(e) => setPlanTopic(e.target.value)} placeholder="Ej: Marketing para dentistas..." className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white text-sm outline-none focus:border-purple-500 transition-colors placeholder:text-gray-700"/>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Enfoque</label>
                                        <select value={planFocus} onChange={(e) => setPlanFocus(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer hover:border-gray-700">
                                            {FOCUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Formato</label>
                                        <select value={planFormat} onChange={(e) => setPlanFormat(e.target.value)} className="w-full bg-[#1A1D24] border border-gray-800 text-white text-xs rounded-xl p-3 outline-none cursor-pointer hover:border-gray-700">
                                            {FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Duración</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[3, 7, 15].map(d => (
                                            <button key={d} onClick={() => setPlanDuration(d as any)} className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${planDuration === d ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/30' : 'bg-[#1A1D24] border-gray-800 text-gray-500 hover:bg-gray-800'}`}>
                                                <span className="font-black text-lg leading-none">{d}</span>
                                                <span className="text-[9px] uppercase font-bold opacity-70">Días</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handleGeneratePlan} disabled={isGeneratingPlan || !planTopic} className="w-full py-4 bg-white text-black font-black rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-all shadow-xl shadow-white/10 mt-2 disabled:opacity-50">
                                    {isGeneratingPlan ? <RefreshCw className="animate-spin" size={20}/> : <Sparkles size={20} className="fill-black"/>}
                                    {isGeneratingPlan ? 'DISEÑANDO...' : 'GENERAR ESTRATEGIA'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 20px; }`}</style>
        </div>
    );
};