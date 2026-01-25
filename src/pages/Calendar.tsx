import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext'; 
import { 
    ChevronLeft, ChevronRight, Plus, X, BarChart3, 
    Save, FileText, Rocket, RefreshCw, Zap, Calendar as CalendarIcon,
    User, Users, BookOpen
} from 'lucide-react';

// Interfaces
interface CalendarEvent {
    id?: string;
    day: number;
    title: string;
    platform: string;
    type: string;
    format?: string;
    notes?: string;
    status: string;
}

// --- CONFIGURACIÓN DE PRECIOS AJUSTADA ---
const COST_PLANNING_3 = 2;   // Antes 5
const COST_PLANNING_7 = 5;   // Antes 10
const COST_PLANNING_15 = 10; // Antes 15

export const Calendar = () => {
    const navigate = useNavigate();
    const { user, userProfile, refreshProfile } = useAuth();
    
    // --- ESTADOS DE CALENDARIO ---
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [stats, setStats] = useState({ viral: 0, authority: 0, sales: 0 });
    
    // --- ESTADOS DE PLANIFICACIÓN IA (V30) ---
    const [planDuration, setPlanDuration] = useState<3 | 7 | 15>(7);
    const [planFocus, setPlanFocus] = useState('Mixto');
    const [planFormat, setPlanFormat] = useState('Reels/TikTok');
    const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

    // --- CONTEXTO V30 ---
    const [experts, setExperts] = useState<any[]>([]);
    const [avatars, setAvatars] = useState<any[]>([]);
    const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
    
    const [selectedExpertId, setSelectedExpertId] = useState<string>('');
    const [selectedAvatarId, setSelectedAvatarId] = useState<string>('');
    const [selectedKbId, setSelectedKbId] = useState<string>('');

    // --- ESTADO NUEVO EVENTO MANUAL ---
    const [newEvent, setNewEvent] = useState({ 
        title: '', 
        platform: 'TikTok', 
        type: 'Viralidad', 
        format: 'Video Corto',
        notes: '' 
    });

    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    // --- CARGA INICIAL ---
    useEffect(() => {
        if(user) {
            fetchEvents();
            fetchContextData();
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            const { data } = await supabase.from('calendar_events').select('*').eq('user_id', user?.id);
            if (data) setEvents(data);
        } catch (error) { console.error("Error loading events:", error); }
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

    // --- ESTADÍSTICAS ---
    useEffect(() => {
        const total = events.length;
        if (total === 0) { setStats({ viral: 0, authority: 0, sales: 0 }); return; }
        setStats({
            viral: Math.round((events.filter(e => e.type === 'Viralidad').length / total) * 100),
            authority: Math.round((events.filter(e => e.type === 'Autoridad').length / total) * 100),
            sales: Math.round((events.filter(e => e.type === 'Venta').length / total) * 100)
        });
    }, [events]);

    // --- GENERACIÓN DE PLAN IA (V30) ---
    const handleGeneratePlan = async () => {
        if (!user || !userProfile) return;
        
        // 1. CALCULAR COSTO
        let cost = COST_PLANNING_7;
        if (planDuration === 3) cost = COST_PLANNING_3;
        if (planDuration === 15) cost = COST_PLANNING_15;

        // 2. VALIDAR SALDO
        if (userProfile.credits < cost) {
            if(confirm(`⚠️ Saldo insuficiente. El plan de ${planDuration} días cuesta ${cost} créditos. ¿Recargar?`)) navigate('/settings');
            return;
        }

        setIsGeneratingPlan(true);
        try {
            // 3. LLAMADA AL BACKEND V30
            const { data, error } = await supabase.functions.invoke('process-url', {
                body: {
                    url: 'calendar-generator', 
                    transcript: `Genera un plan de contenidos de ${planDuration} días. Enfoque: ${planFocus}. Formato principal: ${planFormat}.`, 
                    selectedMode: 'calendar_generator', 
                    platform: 'Calendar',
                    expertId: selectedExpertId,
                    avatarId: selectedAvatarId,
                    knowledgeBaseId: selectedKbId,
                    estimatedCost: cost // <--- ¡IMPORTANTE! Enviamos el costo correcto
                },
            });

            if (error) throw error;

            const generatedCalendar = data.generatedData.calendar;
            
            if (!generatedCalendar || !Array.isArray(generatedCalendar)) {
                throw new Error("Formato de calendario inválido recibido de la IA.");
            }

            // Guardar eventos
            const newEvents = generatedCalendar.map((item: any, index: number) => ({
                user_id: user.id,
                day: index + 1, 
                title: item.idea || item.title,
                platform: planFormat.includes('TikTok') ? 'TikTok' : 'Instagram',
                type: item.objective || item.type || 'Viralidad',
                format: item.format || planFormat,
                notes: item.description || `Generado por IA. Enfoque: ${item.angle || 'General'}`,
                status: 'pending'
            }));

            const { error: insertError } = await supabase.from('calendar_events').insert(newEvents);
            if (insertError) throw insertError;

            await fetchEvents(); 
            setIsPlanModalOpen(false);
            alert(`✅ Plan de ${planDuration} días generado (${cost} créditos descontados).`);
            if(refreshProfile) refreshProfile();

        } catch (e: any) { 
            console.error("Error Plan:", e);
            alert(`Error: ${e.message}`); 
        } finally { 
            setIsGeneratingPlan(false); 
        }
    };

    // --- EVENTOS MANUALES ---
    const handleDayClick = (day: number) => {
        setSelectedDay(day);
        setNewEvent({ title: '', platform: 'TikTok', type: 'Viralidad', format: 'Video Corto', notes: '' });
        setIsModalOpen(true);
    };

    const handleSaveEvent = async () => {
        if (!selectedDay || !newEvent.title || !user) return;
        
        const eventoAGuardar = {
            user_id: user.id,
            day: selectedDay, 
            ...newEvent, 
            status: 'pending'
        };

        const { data, error } = await supabase.from('calendar_events').insert(eventoAGuardar).select().single();
        if (error) { alert("Error al guardar"); return; }

        if (data) setEvents([...events, data]);
        setIsModalOpen(false);
    };

    const handleGoToScript = (eventTitle: string) => {
        navigate('/dashboard/script-generator', { state: { topic: eventTitle } });
    };

    const getTypeColor = (type: string) => {
        if (type === 'Viralidad' || type === 'Viral') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        if (type === 'Venta' || type === 'Sales' || type === 'Venta Directa') return 'bg-green-500/20 text-green-400 border-green-500/30';
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 relative font-sans">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Calendario Estratégico</h1>
                    <p className="text-gray-400">Planifica, organiza y ejecuta tu estrategia de contenidos.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsPlanModalOpen(true)} 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-2"
                    >
                        <Rocket size={18}/> Generar Plan IA
                    </button>
                    <div className="flex items-center gap-4 bg-[#0B0E14] border border-gray-800 p-2 rounded-xl">
                        <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"><ChevronLeft size={20} /></button>
                        <span className="font-bold text-white px-2">Mes Actual</span>
                        <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"><ChevronRight size={20} /></button>
                    </div>
                </div>
            </div>

            {/* BALANCE */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-xl p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-400"><BarChart3 size={16} className="text-indigo-500"/> Balance:</div>
                <div className="flex gap-4 font-mono">
                    <span className="text-purple-400">Viral: {stats.viral}%</span>
                    <span className="text-blue-400">Autoridad: {stats.authority}%</span>
                    <span className="text-green-400">Venta: {stats.sales}%</span>
                </div>
            </div>

            {/* GRILLA */}
            <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-900/50">
                    {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map(d => (
                        <div key={d} className="p-3 text-center text-xs font-bold text-gray-500 tracking-widest">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-[140px]">
                    {days.map(day => {
                        const dayEvents = events.filter(e => e.day === day);
                        return (
                            <div key={day} onClick={() => handleDayClick(day)} className="border-r border-b border-gray-800 p-2 hover:bg-white/5 transition-colors relative group cursor-pointer">
                                <span className={`text-sm font-bold ml-1 ${dayEvents.length > 0 ? 'text-white' : 'text-gray-600'}`}>{day}</span>
                                <div className="mt-2 space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar">
                                    {dayEvents.map((ev, i) => (
                                        <div key={i} className={`p-2 rounded border text-[10px] group/item hover:scale-[1.02] transition-transform ${getTypeColor(ev.type)}`}>
                                            <div className="font-bold truncate mb-1">{ev.title}</div>
                                            <div className="flex justify-between items-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                <span className="text-[8px] opacity-70">{ev.format || 'Video'}</span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleGoToScript(ev.title); }}
                                                    className="bg-white/20 hover:bg-white/40 p-1 rounded"
                                                    title="Crear Guion"
                                                >
                                                    <Zap size={10} className="text-white"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white border border-gray-600"><Plus size={12} /></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL PLAN IA */}
            {isPlanModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in zoom-in duration-200 p-4">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Rocket className="text-purple-500"/> Generador de Plan V30</h2>
                                <p className="text-xs text-gray-400">Crea una estrategia completa en segundos.</p>
                            </div>
                            <button onClick={() => setIsPlanModalOpen(false)}><X size={24} className="text-gray-500 hover:text-white"/></button>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {/* DURACIÓN */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">1. Duración del Plan</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { d: 3, label: '3 Días', cost: COST_PLANNING_3 },
                                        { d: 7, label: '7 Días', cost: COST_PLANNING_7 },
                                        { d: 15, label: '15 Días', cost: COST_PLANNING_15 }
                                    ].map(opt => (
                                        <button 
                                            key={opt.d} 
                                            onClick={() => setPlanDuration(opt.d as any)}
                                            className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${planDuration === opt.d ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500'}`}
                                        >
                                            <span className="font-bold text-sm">{opt.label}</span>
                                            <span className="text-[10px] opacity-70">{opt.cost} Créditos</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CONTEXTO V30 */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">2. Contexto (Niche Guard)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <select value={selectedExpertId} onChange={(e) => setSelectedExpertId(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-3 outline-none">
                                        <option value="">Experto</option>{experts.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </select>
                                    <select value={selectedAvatarId} onChange={(e) => setSelectedAvatarId(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-3 outline-none">
                                        <option value="">Avatar</option>{avatars.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <select value={selectedKbId} onChange={(e) => setSelectedKbId(e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-3 outline-none">
                                        <option value="">Conocimiento</option>{knowledgeBases.map(kb => <option key={kb.id} value={kb.id}>{kb.title}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">3. Objetivo Principal</label>
                                    <select value={planFocus} onChange={(e) => setPlanFocus(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm">
                                        <option>Viralidad Masiva</option>
                                        <option>Autoridad / Confianza</option>
                                        <option>Venta Directa</option>
                                        <option>Mixto (Balanceado)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">4. Formato</label>
                                    <select value={planFormat} onChange={(e) => setPlanFormat(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white text-sm">
                                        <option>Reels/TikTok (Video Corto)</option>
                                        <option>Carruseles (Educativo)</option>
                                        <option>Posts Estáticos (Frases)</option>
                                        <option>Variado</option>
                                    </select>
                                </div>
                            </div>

                            <button 
                                onClick={handleGeneratePlan} 
                                disabled={isGeneratingPlan}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl shadow-lg flex justify-center items-center gap-2 hover:shadow-purple-500/20 transition-all"
                            >
                                {isGeneratingPlan ? <><RefreshCw className="animate-spin"/> Diseñando Estrategia...</> : <><CalendarIcon/> GENERAR PLAN AHORA</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MANUAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col">
                        <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                            <h2 className="font-bold text-white">Día {selectedDay}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-500 hover:text-white" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Idea / Título</label>
                                <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="Ej: 3 Tips para..." />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Objetivo</label>
                                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none" value={newEvent.type} onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}>
                                        <option value="Viralidad">Viralidad</option><option value="Autoridad">Autoridad</option><option value="Venta">Venta</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Formato</label>
                                    <select className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none" value={newEvent.format} onChange={(e) => setNewEvent({...newEvent, format: e.target.value})}>
                                        <option>Video Corto</option><option>Carrusel</option><option>Post</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Notas</label>
                                <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white outline-none resize-none h-24" value={newEvent.notes} onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})} placeholder="Detalles de la idea..."></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => { if(newEvent.title) handleGoToScript(newEvent.title); }} className="bg-purple-900/30 text-purple-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-900/50 flex items-center gap-2"><Zap size={14}/> Ir a Guion</button>
                                <button onClick={handleSaveEvent} className="bg-indigo-600 px-6 py-2 rounded-lg text-white font-bold hover:bg-indigo-500 flex items-center gap-2"><Save size={16}/> Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }`}</style>
        </div>
    );
};