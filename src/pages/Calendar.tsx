import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; 
import { 
    Plus, X, BarChart3, Save, Rocket, RefreshCw, Zap, Calendar as CalendarIcon,
    Trash2, User, Users, BookOpen, Target, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURACIÓN Y TIPOS
// ==================================================================================

interface CalendarEvent {
    id?: string;
    title: string;
    platform: string;
    type: string; // Viral, Venta, Autoridad
    format?: string;
    notes?: string;
    status: string;
    scheduled_date: string; // Fecha exacta YYYY-MM-DD
}

const COST_PLANNING_3 = 2;   
const COST_PLANNING_7 = 5;   
const COST_PLANNING_15 = 10; 

const FOCUS_OPTIONS = ["Viralidad & Alcance", "Ventas & Conversión", "Autoridad & Confianza", "Comunidad & Engagement"];
const FORMAT_OPTIONS = ["Reels/TikTok (Vertical)", "Carruseles", "Stories", "Mix Estratégico"];

// ==================================================================================
// 2. COMPONENTE PRINCIPAL
// ==================================================================================

export const Calendar = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS DE FECHA Y NAVEGACIÓN ---
    const [currentDate, setCurrentDate] = useState(new Date()); // Fecha base del calendario visual
    const [selectedDateStr, setSelectedDateStr] = useState<string>(''); // Fecha seleccionada para editar

    // --- ESTADOS UI ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [stats, setStats] = useState({ viral: 0, authority: 0, sales: 0 });
    
    // --- ESTADOS GENERADOR IA ---
    const [planTopic, setPlanTopic] = useState(''); 
    const [planDuration, setPlanDuration] = useState<3 | 7 | 15>(7);
    const [planFocus, setPlanFocus] = useState(FOCUS_OPTIONS[0]);
    const [planFormat, setPlanFormat] = useState(FORMAT_OPTIONS[0]);
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // --- CONTEXTO ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- ESTADO EVENTO (EDICIÓN) ---
    const [currentEvent, setCurrentEvent] = useState<CalendarEvent>({ 
        title: '', platform: 'TikTok', type: 'Viralidad', format: 'Video Corto', notes: '', status: 'planned', scheduled_date: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    // ==================================================================================
    // 3. LÓGICA DE CALENDARIO REAL
    // ==================================================================================

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Domingo
        
        // Ajustar para que Lunes sea 0 (opcional, depende de preferencia visual)
        // Aquí usaremos Domingo como inicio estándar del grid visual
        
        const days = [];
        // Rellenar espacios vacíos antes del día 1
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        // Rellenar días del mes
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const formatDateISO = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset*60*1000));
        return localDate.toISOString().split('T')[0];
    };

    const calendarDays = getDaysInMonth(currentDate);

    // ==================================================================================
    // 4. CARGA DE DATOS
    // ==================================================================================
    
    useEffect(() => {
        if(user) {
            fetchEvents();
            fetchContextData();
        }
    }, [user, currentDate]); // Recargar al cambiar de mes

    const fetchEvents = async () => {
        try {
            // Calcular rango del mes actual para filtrar
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

            const { data } = await supabase
                .from('content_items') // O 'viral_generations' si guardas ahí también
                .select('*')
                .eq('user_id', user?.id)
                .in('type', ['calendar_event', 'scheduled_script']) // Traer eventos y guiones agendados
                .gte('scheduled_date', startOfMonth)
                .lte('scheduled_date', endOfMonth);

            if (data) {
                const mappedEvents = data.map((item: any) => ({
                    id: item.id,
                    title: item.title || item.content?.titulo || 'Evento sin título',
                    platform: item.platform || 'General',
                    type: item.content?.objetivo || 'General',
                    format: item.content?.formato,
                    notes: item.content?.gancho_sugerido || item.content?.description,
                    status: item.status,
                    scheduled_date: item.scheduled_date // YYYY-MM-DD directo de DB
                }));
                setEvents(mappedEvents);
            }
        } catch (error) { console.error("Error loading events:", error); }
    };

    const fetchContextData = async () => {
        // ... (Tu lógica original de carga de contexto está bien, la mantengo igual)
        try {
            const { data: exp } = await supabase.from('expert_profiles').select('id, name').eq('user_id', user?.id);
            if(exp) setExperts(exp);
            
            const { data: av } = await supabase.from('avatars').select('id, name').eq('user_id', user?.id);
            if(av) setAvatars(av);
            
            const { data: kb } = await supabase.from('documents').select('id, title').eq('user_id', user?.id);
            if (kb) setKnowledgeBases(kb);

            if (userProfile?.active_expert_id) setSelectedExpertId(userProfile.active_expert_id);
        } catch (e) { console.error(e); }
    };

    // Estadísticas
    useEffect(() => {
        const total = events.length;
        if (total === 0) { setStats({ viral: 0, authority: 0, sales: 0 }); return; }
        const countType = (str: string) => events.filter(e => e.type?.toLowerCase().includes(str)).length;
        setStats({
            viral: Math.round((countType('viral') / total) * 100),
            authority: Math.round(((countType('autoridad') + countType('educar')) / total) * 100),
            sales: Math.round(((countType('venta') + countType('persuadir')) / total) * 100)
        });
    }, [events]);

    // ==================================================================================
    // 5. GENERADOR IA (Agendamiento Inteligente)
    // ==================================================================================
    
    const handleGeneratePlan = async () => {
        if (!user || !userProfile) return;
        if (!planTopic.trim()) return alert("Escribe un tema para la estrategia.");
        
        let cost = planDuration === 3 ? COST_PLANNING_3 : planDuration === 7 ? COST_PLANNING_7 : COST_PLANNING_15;

        if (userProfile.credits < cost && userProfile.tier !== 'admin') {
            if(confirm(`⚠️ Saldo insuficiente (${cost} cr). ¿Recargar?`)) navigate('/dashboard/settings');
            return;
        }

        setIsGeneratingPlan(true);
        try {
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'calendar_generator', 
                    userInput: planTopic,
                    settings: { duration: planDuration, focus: planFocus, format: planFormat },
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: cost
                },
            });

            if (error) throw error;
            const generatedCalendar = data.generatedData.calendar;
            if (!generatedCalendar) throw new Error("Error en IA");

            // ✅ AGENDAMIENTO CORRECTO: Usamos fechas reales
            const baseDate = new Date(startDate);
            const newEvents = generatedCalendar.map((item: any, index: number) => {
                const eventDate = new Date(baseDate);
                eventDate.setDate(baseDate.getDate() + index); // Sumar días correctamente
                
                return {
                    user_id: user.id,
                    type: 'calendar_event',
                    title: item.idea_contenido || item.tema || item.title,
                    content: item, 
                    scheduled_date: formatDateISO(eventDate), // YYYY-MM-DD
                    status: 'planned',
                    platform: planFormat.includes('TikTok') ? 'TikTok' : 'Instagram'
                };
            });

            const { error: insertError } = await supabase.from('content_items').insert(newEvents);
            if (insertError) throw insertError;

            await fetchEvents();
            setIsPlanModalOpen(false);
            if(refreshProfile) refreshProfile();
            alert(`✅ Plan desplegado desde el ${startDate}.`);

        } catch (e: any) { alert(`Error: ${e.message}`); } 
        finally { setIsGeneratingPlan(false); }
    };

    // ==================================================================================
    // 6. GESTIÓN DE EVENTOS (CRUD)
    // ==================================================================================

    const handleDayClick = (date: Date) => {
        const dateStr = formatDateISO(date);
        setIsEditing(false);
        setSelectedDateStr(dateStr);
        setCurrentEvent({ 
            title: '', platform: 'TikTok', type: 'Viralidad', format: 'Video Corto', 
            notes: '', status: 'planned', scheduled_date: dateStr 
        });
        setIsModalOpen(true);
    };

    const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setSelectedDateStr(event.scheduled_date);
        setCurrentEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEvent = async () => {
        if (!currentEvent.title) return alert("Falta título");
        
        const payload = {
            user_id: user?.id,
            type: 'calendar_event',
            title: currentEvent.title,
            scheduled_date: currentEvent.scheduled_date, // Usamos la fecha real seleccionada
            platform: currentEvent.platform,
            content: {
                objetivo: currentEvent.type,
                formato: currentEvent.format,
                description: currentEvent.notes
            },
            status: 'planned'
        };

        if (isEditing && currentEvent.id) {
            await supabase.from('content_items').update(payload).eq('id', currentEvent.id);
        } else {
            await supabase.from('content_items').insert(payload);
        }
        await fetchEvents();
        setIsModalOpen(false);
    };

    const handleDeleteEvent = async () => {
        if (!currentEvent.id || !confirm("¿Borrar evento?")) return;
        await supabase.from('content_items').delete().eq('id', currentEvent.id);
        await fetchEvents();
        setIsModalOpen(false);
    };

    // --- CONEXIÓN CON SCRIPT GENERATOR ---
    const handleGoToScript = (event: CalendarEvent) => {
        navigate('/dashboard/script-generator', { 
            state: { 
                topic: event.title,
                hook: event.notes, 
                fromIdeas: true // Reutilizamos la lógica que ya arreglamos
            } 
        });
    };

    const getTypeColor = (type: string) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('viral') || t.includes('alcance')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        if (t.includes('venta') || t.includes('conversión')) return 'bg-green-500/20 text-green-300 border-green-500/30';
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    };

    // ==================================================================================
    // 7. RENDERIZADO
    // ==================================================================================
    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 relative font-sans animate-in fade-in p-4 text-white">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        <CalendarIcon className="text-indigo-500"/> WAR ROOM
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Estrategia de contenidos V300.</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-900 p-2 rounded-xl border border-gray-800">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-800 rounded-lg"><ChevronLeft size={20}/></button>
                    <span className="font-bold w-32 text-center uppercase tracking-widest text-sm">
                        {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-800 rounded-lg"><ChevronRight size={20}/></button>
                </div>
                <button onClick={() => setIsPlanModalOpen(true)} className="bg-white text-black px-6 py-3 rounded-xl font-black hover:bg-gray-200 transition-all flex items-center gap-2 text-sm uppercase tracking-wider shadow-lg group">
                    <Rocket size={18} className="group-hover:-translate-y-1 transition-transform"/> Generar Plan IA
                </button>
            </div>

            {/* METRICS */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs overflow-x-auto shadow-md">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest"><BarChart3 size={14} className="text-indigo-500"/> Balance Mensual:</div>
                <div className="flex gap-6 font-mono font-bold">
                    <span className="text-purple-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Viral: {stats.viral}%</span>
                    <span className="text-blue-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Autoridad: {stats.authority}%</span>
                    <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Venta: {stats.sales}%</span>
                </div>
            </div>

            {/* CALENDAR GRID REAL */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-900/50">
                    {['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map(d => (
                        <div key={d} className="p-3 text-center text-[10px] font-black text-gray-500 tracking-widest">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-[140px] md:auto-rows-[160px]">
                    {calendarDays.map((date, index) => {
                        if (!date) return <div key={index} className="bg-gray-900/20 border-r border-b border-gray-800/50"></div>; // Días vacíos

                        const dateStr = formatDateISO(date);
                        const dayEvents = events.filter(e => e.scheduled_date === dateStr);
                        const isToday = dateStr === formatDateISO(new Date());

                        return (
                            <div key={dateStr} onClick={() => handleDayClick(date)} className={`border-r border-b border-gray-800 p-2 hover:bg-gray-900/30 transition-colors relative group cursor-pointer ${isToday ? 'bg-indigo-900/10' : ''}`}>
                                <span className={`text-xs font-bold absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-500 text-white' : 'text-gray-500'}`}>
                                    {date.getDate()}
                                </span>
                                
                                <div className="mt-8 space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                                    {dayEvents.map((ev, i) => (
                                        <div key={i} onClick={(e) => handleEventClick(e, ev)} className={`p-2 rounded-lg border text-[10px] group/item hover:scale-[1.02] transition-transform cursor-pointer relative shadow-sm ${getTypeColor(ev.type)}`}>
                                            <div className="font-bold truncate leading-tight mb-1 pr-5">{ev.title}</div>
                                            <div className="flex justify-between items-center opacity-70 group-hover/item:opacity-100">
                                                <span className="text-[8px] font-mono uppercase tracking-tighter">{ev.platform}</span>
                                                <button onClick={(e) => { e.stopPropagation(); handleGoToScript(ev); }} className="absolute top-1 right-1 p-1 hover:bg-white/20 rounded transition-colors" title="Generar Guion"><Zap size={10}/></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center text-gray-400 hover:text-white border border-gray-700"><Plus size={12}/></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL PLANIFICADOR IA */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-gray-800 bg-gray-900/30 flex justify-between items-center">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Target size={14} className="text-purple-500"/> Estratega IA</h2>
                            <button onClick={() => setIsPlanModalOpen(false)}><X size={18} className="text-gray-500 hover:text-white"/></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Tema de la Estrategia (Obligatorio)</label>
                                <input type="text" value={planTopic} onChange={(e) => setPlanTopic(e.target.value)} placeholder="Ej: Lanzamiento de Curso de Inglés..." className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-purple-500"/>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Enfoque</label>
                                    <select value={planFocus} onChange={(e) => setPlanFocus(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white text-xs rounded-lg p-2.5 outline-none">
                                        {FOCUS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Formato</label>
                                    <select value={planFormat} onChange={(e) => setPlanFormat(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white text-xs rounded-lg p-2.5 outline-none">
                                        {FORMAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Duración</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[3, 7, 15].map(d => (
                                        <button key={d} onClick={() => setPlanDuration(d as any)} className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${planDuration === d ? 'bg-purple-900/20 border-purple-500 text-white' : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-600'}`}>
                                            <span className="font-black text-sm">{d} Días</span>
                                            <span className="text-[9px] opacity-60 font-mono mt-1">{d === 3 ? COST_PLANNING_3 : d === 7 ? COST_PLANNING_7 : COST_PLANNING_15} CR</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-800">
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Fecha Inicio</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-gray-900 border border-gray-800 text-white text-xs rounded-lg p-2 w-full outline-none"/>
                            </div>

                            <button onClick={handleGeneratePlan} disabled={isGeneratingPlan || !planTopic} className="w-full py-4 bg-white text-black font-black rounded-xl flex justify-center items-center gap-2 hover:bg-gray-200 transition-all shadow-lg mt-2 disabled:opacity-50">
                                {isGeneratingPlan ? <RefreshCw className="animate-spin" size={18}/> : <Rocket size={18}/>}
                                {isGeneratingPlan ? 'DISEÑANDO...' : 'GENERAR ESTRATEGIA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITOR MANUAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                {selectedDateStr}
                            </span>
                            <button onClick={() => setIsModalOpen(false)}><X size={18} className="text-gray-500 hover:text-white"/></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input type="text" className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white text-sm outline-none focus:border-indigo-500" value={currentEvent.title} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} placeholder="Título de la idea..." autoFocus />
                            
                            <div className="grid grid-cols-2 gap-3">
                                <select className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-white text-xs outline-none" value={currentEvent.type} onChange={(e) => setCurrentEvent({...currentEvent, type: e.target.value})}><option>Viralidad</option><option>Autoridad</option><option>Venta</option></select>
                                <select className="bg-gray-900 border border-gray-800 rounded-lg p-2 text-white text-xs outline-none" value={currentEvent.format} onChange={(e) => setCurrentEvent({...currentEvent, format: e.target.value})}><option>Video Corto</option><option>Carrusel</option><option>Story</option></select>
                            </div>
                            
                            <textarea className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 text-white text-xs outline-none resize-none h-20" value={currentEvent.notes} onChange={(e) => setCurrentEvent({...currentEvent, notes: e.target.value})} placeholder="Notas, ángulo, gancho..."></textarea>
                            
                            <div className="flex justify-between pt-2">
                                {isEditing ? <button onClick={handleDeleteEvent} className="text-red-500 p-2 hover:bg-red-900/20 rounded-lg"><Trash2 size={18}/></button> : <div></div>}
                                <div className="flex gap-2">
                                    <button onClick={() => { if(currentEvent.title) handleGoToScript(currentEvent); }} className="px-4 py-2 bg-purple-900/20 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-bold hover:bg-purple-900/40 flex items-center gap-2"><Zap size={14}/> GUION</button>
                                    <button onClick={handleSaveEvent} className="px-6 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-200 flex items-center gap-2"><Save size={14}/> OK</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};