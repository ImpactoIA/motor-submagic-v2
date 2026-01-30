import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // ✅ Ruta corregida
import { useAuth } from '../context/AuthContext'; 
import { 
    Plus, X, BarChart3, Save, Rocket, RefreshCw, Zap, Calendar as CalendarIcon,
    Trash2, User, Users, BookOpen, Target, CheckCircle2, AlertCircle, Layout
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURACIÓN Y TIPOS
// ==================================================================================

interface CalendarEvent {
    id?: string;
    day_index: number; // Para mostrar en el grid (1-30)
    title: string;
    platform: string;
    type: string; // Viral, Venta, Autoridad
    format?: string;
    notes?: string;
    status: string;
    scheduled_date?: string; // Fecha real DB
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
    
    // --- ESTADOS UI ---
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [stats, setStats] = useState({ viral: 0, authority: 0, sales: 0 });
    
    // --- ESTADOS GENERADOR IA ---
    const [planTopic, setPlanTopic] = useState(''); // ✅ NUEVO: Para dar contexto al Backend
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
        day_index: 1, title: '', platform: 'TikTok', type: 'Viralidad', format: 'Video Corto', notes: '', status: 'pending'
    });
    const [isEditing, setIsEditing] = useState(false);

    // Grid de 30 días visuales
    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    // ==================================================================================
    // 3. CARGA DE DATOS (CONECTADO A 'content_items')
    // ==================================================================================
    useEffect(() => {
        if(user) {
            fetchEvents();
            fetchContextData();
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            // ✅ CORRECCIÓN: Usamos la nueva tabla maestra
            const { data } = await supabase
                .from('content_items')
                .select('*')
                .eq('user_id', user?.id)
                .eq('type', 'calendar_event')
                .gte('scheduled_date', new Date().toISOString().split('T')[0]); // Solo futuros o actuales

            if (data) {
                // Mapeamos content_items a la estructura visual del calendario
                const mappedEvents = data.map((item: any) => {
                    const date = new Date(item.scheduled_date);
                    const today = new Date();
                    // Calculamos el índice del día relativo a hoy (simple visualización)
                    const diffTime = Math.abs(date.getTime() - today.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    
                    return {
                        id: item.id,
                        day_index: diffDays > 30 ? 30 : diffDays, // Visual simple
                        title: item.title,
                        platform: item.platform || 'General',
                        type: item.content?.objetivo || 'General',
                        format: item.content?.formato,
                        notes: item.content?.gancho_sugerido || item.content?.description,
                        status: item.status,
                        scheduled_date: item.scheduled_date
                    };
                });
                setEvents(mappedEvents);
            }
        } catch (error) { console.error("Error loading events:", error); }
    };

    const fetchContextData = async () => {
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

    // --- ESTADÍSTICAS EN TIEMPO REAL ---
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
    // 4. GENERADOR IA (BACKEND V105)
    // ==================================================================================
    const handleGeneratePlan = async () => {
        if (!user || !userProfile) return;
        if (!planTopic.trim()) return alert("Por favor escribe un Tema o Nicho para la estrategia.");
        
        // Calcular Costo
        let cost = COST_PLANNING_7;
        if (planDuration === 3) cost = COST_PLANNING_3;
        if (planDuration === 15) cost = COST_PLANNING_15;

        // Validar Saldo
        if (userProfile.credits < cost && userProfile.tier !== 'admin') {
            if(confirm(`⚠️ Saldo insuficiente (${cost} créditos). ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsGeneratingPlan(true);
        try {
            // ✅ LLAMADA CORRECTA A BACKEND V105
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    selectedMode: 'calendar_generator', 
                    userInput: planTopic, // ✅ Enviamos el tema como userInput
                    settings: {
                        duration: planDuration, 
                        focus: planFocus, 
                        format: planFormat 
                    },
                    // Contexto
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: cost
                },
            });

            if (error) throw error;

            const generatedCalendar = data.generatedData.calendar;
            if (!generatedCalendar || !Array.isArray(generatedCalendar)) throw new Error("La IA no devolvió un calendario válido.");

            // ✅ GUARDADO EN 'content_items' (NUEVA TABLA)
            // Primero borramos eventos planificados viejos para evitar duplicados masivos (opcional)
            // await supabase.from('content_items').delete().eq('user_id', user.id).eq('type', 'calendar_event');

            const newEvents = generatedCalendar.map((item: any, index: number) => {
                const date = new Date(startDate);
                date.setDate(date.getDate() + index); // Fecha real secuencial

                return {
                    user_id: user.id,
                    type: 'calendar_event',
                    title: item.idea_contenido || item.tema || item.title,
                    content: item, // Guardamos todo el objeto JSON del día
                    scheduled_date: date.toISOString().split('T')[0],
                    status: 'planned',
                    platform: planFormat.includes('TikTok') ? 'TikTok' : 'Instagram'
                };
            });

            const { error: insertError } = await supabase.from('content_items').insert(newEvents);
            if (insertError) throw insertError;

            await fetchEvents(); // Recargar vista
            setIsPlanModalOpen(false);
            if(refreshProfile) refreshProfile();
            alert(`✅ Plan Estratégico de ${planDuration} días desplegado.`);

        } catch (e: any) { 
            console.error("Calendar Error:", e);
            alert(`Error: ${e.message}`); 
        } finally { 
            setIsGeneratingPlan(false); 
        }
    };

    // ==================================================================================
    // 5. GESTIÓN DE EVENTOS (CRUD)
    // ==================================================================================
    
    const handleDayClick = (dayIndex: number) => {
        setIsEditing(false);
        setSelectedDay(dayIndex);
        setCurrentEvent({ 
            day_index: dayIndex, 
            title: '', 
            platform: 'TikTok', 
            type: 'Viralidad', 
            format: 'Video Corto', 
            notes: '', 
            status: 'pending' 
        });
        setIsModalOpen(true);
    };

    const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setSelectedDay(event.day_index);
        setCurrentEvent(event);
        setIsModalOpen(true);
    };

    const handleSaveEvent = async () => {
        if (!selectedDay || !currentEvent.title || !user) return alert("Falta título");
        
        // Calculamos la fecha basada en el índice visual (Solo para nuevos eventos manuales)
        const date = new Date();
        date.setDate(date.getDate() + (selectedDay - 1));

        const payload = {
            user_id: user.id,
            type: 'calendar_event',
            title: currentEvent.title,
            scheduled_date: currentEvent.scheduled_date || date.toISOString().split('T')[0],
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

    // --- IR A GENERAR GUION (CONECTADO) ---
    const handleGoToScript = (event: CalendarEvent) => {
        navigate('/tools/script-generator', { 
            state: { 
                topic: event.title, // Pasa el título como tema
                context: event.notes, // Pasa las notas como contexto
                expertId: selectedExpertId,
                avatarId: selectedAvatarId
            } 
        });
    };

    const getTypeColor = (type: string) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('viral') || t.includes('alcance')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
        if (t.includes('venta') || t.includes('conversión')) return 'bg-green-500/20 text-green-300 border-green-500/30';
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'; // Autoridad/Educar
    };

    // ==================================================================================
    // 6. RENDERIZADO
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
                <button onClick={() => setIsPlanModalOpen(true)} className="bg-white text-black px-6 py-3 rounded-xl font-black hover:bg-gray-200 transition-all flex items-center gap-2 text-sm uppercase tracking-wider shadow-lg shadow-white/10 group">
                    <Rocket size={18} className="group-hover:-translate-y-1 transition-transform"/> Generar Plan IA
                </button>
            </div>

            {/* METRICS */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs overflow-x-auto shadow-md">
                <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest"><BarChart3 size={14} className="text-indigo-500"/> Balance de Estrategia:</div>
                <div className="flex gap-6 font-mono font-bold">
                    <span className="text-purple-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div>Viral: {stats.viral}%</span>
                    <span className="text-blue-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div>Autoridad: {stats.authority}%</span>
                    <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Venta: {stats.sales}%</span>
                </div>
            </div>

            {/* CALENDAR GRID */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-900/50">
                    {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map(d => (
                        <div key={d} className="p-3 text-center text-[10px] font-black text-gray-500 tracking-widest">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-[140px] md:auto-rows-[160px]">
                    {days.map(dayIndex => {
                        const dayEvents = events.filter(e => e.day_index === dayIndex); // Filtramos por día visual
                        return (
                            <div key={dayIndex} onClick={() => handleDayClick(dayIndex)} className="border-r border-b border-gray-800 p-2 hover:bg-gray-900/30 transition-colors relative group cursor-pointer">
                                <span className={`text-xs font-bold absolute top-2 left-2 ${dayEvents.length > 0 ? 'text-white' : 'text-gray-700'}`}>{dayIndex}</span>
                                
                                <div className="mt-6 space-y-1.5 overflow-y-auto max-h-[110px] custom-scrollbar pr-1">
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
                            
                            {/* TEMA DE LA ESTRATEGIA (NUEVO) */}
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block tracking-widest">Tema de la Estrategia (Obligatorio)</label>
                                <input 
                                    type="text" 
                                    value={planTopic} 
                                    onChange={(e) => setPlanTopic(e.target.value)} 
                                    placeholder="Ej: Lanzamiento de Curso de Inglés..." 
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-purple-500"
                                />
                            </div>

                            {/* Contexto */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative"><select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-indigo-500 appearance-none"><option value="">Experto</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select><User size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/></div>
                                <div className="relative"><select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-pink-500 appearance-none"><option value="">Avatar</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select><Users size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/></div>
                                <div className="relative"><select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-gray-300 text-xs rounded-lg p-2.5 outline-none focus:border-yellow-500 appearance-none"><option value="">Cerebro</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}</select><BookOpen size={12} className="absolute right-2 top-3 text-gray-600 pointer-events-none"/></div>
                            </div>

                            {/* Configuración Plan */}
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

                            {/* Duración */}
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
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Día {selectedDay}</span>
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