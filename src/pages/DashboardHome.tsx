import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Iconos V300
import { 
    Zap, Rocket, BarChart3, TrendingUp, DollarSign, Users, Target, BookOpen, 
    Calendar, MessageSquare, Briefcase, RefreshCw, ArrowRight, 
    Activity, BrainCircuit, ShieldCheck, History, AlertTriangle, CheckCircle2
} from 'lucide-react';

interface StatCardProps {
    icon: React.ReactElement;
    title: string;
    value: string;
    description: string;
    color: string;
    trend?: string;
}

interface RecentActivity {
    id: string;
    type: string;
    title: string;
    date: string;
    score?: number;
}

// Menú de Herramientas
const TOOLS = [
    { icon: <Target className="w-5 h-5"/>, title: "Lab. Avatar", desc: "Define a tu audiencia.", link: "/dashboard/avatar-profile", color: "text-pink-400 border-pink-500/30 hover:bg-pink-500/10" },
    { icon: <TrendingUp className="w-5 h-5"/>, title: "Análisis Viral", desc: "Disecciona videos ganadores.", link: "/dashboard/analyze-viral", color: "text-green-400 border-green-500/30 hover:bg-green-500/10" },
    { icon: <Calendar className="w-5 h-5"/>, title: "Calendario", desc: "Planifica tu semana.", link: "/dashboard/calendar", color: "text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10" },
    { icon: <MessageSquare className="w-5 h-5"/>, title: "Mentor IA", desc: "Consultoría estratégica.", link: "/dashboard/ai-assistant", color: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10" },
    { icon: <BookOpen className="w-5 h-5"/>, title: "Baúl", desc: "Historial de ideas.", link: "/dashboard/history", color: "text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10" },
    { icon: <Briefcase className="w-5 h-5"/>, title: "Experto", desc: "Tu identidad de autoridad.", link: "/dashboard/expert-profile", color: "text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10" },
];

export const DashboardHome = () => {
    const { user, userProfile, isLoading: isAuthLoading } = useAuth();
    const navigate = useNavigate();
    
    const [stats, setStats] = useState<StatCardProps[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [activeBrain, setActiveBrain] = useState({ avatar: 'No definido', expert: 'No definido', kbCount: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [systemHealth, setSystemHealth] = useState(0); // 0-100% configuración

    const fetchRealData = useCallback(async () => {
        if (!user) return;

        try {
            // Promise Race para evitar bloqueos
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));

            const dataPromise = Promise.all([
                supabase.from('viral_analyses').select('id, title, created_at, score').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
                supabase.from('mentor_chats').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('viral_analyses').select('score').eq('user_id', user.id),
                // Chequeo de Salud del Sistema (Configuración)
                supabase.from('expert_profiles').select('id, name').eq('user_id', user.id).maybeSingle(),
                supabase.from('avatars').select('id, name').eq('user_id', user.id).maybeSingle(),
                supabase.from('documents').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
            ]);

            // @ts-ignore
            const [analysesRes, chatsCountRes, viralStatsRes, expertRes, avatarRes, docRes] = await Promise.race([dataPromise, timeoutPromise]);

            // 1. Cálculos de Estadísticas
            const scores = viralStatsRes.data?.map((v: any) => v.score).filter((s: any) => s !== null) || [];
            const avgScore = scores.length > 0 ? (scores.reduce((a: any, b: any) => a + b, 0) / scores.length).toFixed(1) : "0";

            // 2. Estado del Cerebro
            let healthScore = 0;
            if (expertRes.data) healthScore += 35;
            if (avatarRes.data) healthScore += 35;
            if (docRes.count && docRes.count > 0) healthScore += 30;
            setSystemHealth(healthScore);

            setActiveBrain({
                avatar: avatarRes.data?.name || 'Falta Configurar',
                expert: expertRes.data?.name || 'Falta Configurar',
                kbCount: docRes.count || 0
            });

            // 3. Tarjetas KPI
            setStats([
                {
                    icon: <Zap className="w-6 h-6 text-yellow-400" />,
                    title: "Potencia Viral",
                    value: avgScore,
                    description: scores.length > 0 ? "Promedio de impacto." : "Sin análisis previos.",
                    color: "from-yellow-600 to-orange-600",
                    trend: scores.length > 0 ? `${scores.length} videos` : undefined
                },
                {
                    icon: <DollarSign className="w-6 h-6 text-green-400" />,
                    title: "Créditos",
                    value: userProfile?.credits?.toString() || "0",
                    description: `Plan: ${userProfile?.tier?.toUpperCase() || 'FREE'}`,
                    color: "from-green-600 to-emerald-600"
                },
                {
                    icon: <BrainCircuit className="w-6 h-6 text-blue-400" />,
                    title: "Cerebro Digital",
                    value: `${docRes.count || 0}`,
                    description: "Documentos indexados.",
                    color: "from-blue-600 to-indigo-600"
                },
                {
                    icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
                    title: "Mentoría",
                    value: chatsCountRes.count?.toString() || "0",
                    description: "Sesiones estratégicas.",
                    color: "from-purple-600 to-violet-600"
                }
            ]);

            // 4. Actividad Reciente
            const activity = analysesRes.data?.map((a: any) => ({
                id: a.id,
                type: 'Análisis Viral',
                title: a.title || "Análisis sin título",
                date: new Date(a.created_at).toLocaleDateString(),
                score: a.score
            })) || [];
            setRecentActivity(activity);

        } catch (error) {
            console.error("Error Dashboard:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user, userProfile]);

    useEffect(() => {
        let isMounted = true;
        if (!isAuthLoading) {
            if (user) fetchRealData();
            else setIsLoading(false);
        }
        return () => { isMounted = false; };
    }, [user, isAuthLoading, fetchRealData]); 

    if (isLoading || isAuthLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-white">
                <RefreshCw className="animate-spin mb-4 text-indigo-500" size={40}/> 
                <span className="font-bold tracking-widest uppercase text-xs text-indigo-400 animate-pulse">Cargando Torre de Control...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500 p-4">
            
            {/* HEADER + BRAIN STATUS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <BarChart3 className="text-indigo-500 hidden md:block" size={36} />
                        Torre de Control
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm md:text-base">Bienvenido al centro de mando, <span className="text-white font-bold">{user?.email?.split('@')[0]}</span>.</p>
                </div>
                
                {/* TARJETA DE SALUD DEL SISTEMA */}
                <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-4 flex flex-col gap-2 shadow-xl min-w-[280px]">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                        <span className="flex items-center gap-2"><Activity size={14}/> Configuración IA</span>
                        <span className={`${systemHealth === 100 ? 'text-green-400' : 'text-yellow-400'}`}>{systemHealth}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${systemHealth === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${systemHealth}%`}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span className={activeBrain.expert !== 'Falta Configurar' ? 'text-green-500' : ''}>Experto</span>
                        <span className={activeBrain.avatar !== 'Falta Configurar' ? 'text-green-500' : ''}>Avatar</span>
                        <span className={activeBrain.kbCount > 0 ? 'text-green-500' : ''}>Cerebro</span>
                    </div>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                    <div key={i} className="relative overflow-hidden bg-[#0B0E14] border border-gray-800 p-6 rounded-2xl group hover:border-gray-600 transition-all shadow-lg">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl rounded-full -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2.5 bg-gray-900 rounded-xl border border-gray-800 shadow-inner">{stat.icon}</div>
                                {stat.trend && <span className="text-[10px] font-black font-mono bg-gray-900 px-2 py-1 rounded text-gray-400 border border-gray-800">{stat.trend}</span>}
                            </div>
                            <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
                            <div className="text-sm font-bold text-gray-300">{stat.title}</div>
                            <div className="text-[11px] text-gray-500 mt-1 font-medium">{stat.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ALERTAS DE CONFIGURACIÓN (ONBOARDING INTELIGENTE) */}
            {systemHealth < 100 && (
                <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-4 animate-in slide-in-from-top-4">
                    <div className="p-2 bg-yellow-900/20 rounded-full text-yellow-500 shrink-0"><AlertTriangle size={20}/></div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Tu Sistema IA no está al 100%</h3>
                        <p className="text-gray-400 text-xs mt-1 mb-3">Para obtener resultados de élite, completa tu configuración.</p>
                        <div className="flex gap-2">
                            {activeBrain.expert === 'Falta Configurar' && <button onClick={() => navigate('/dashboard/expert-profile')} className="text-[10px] font-bold bg-yellow-600 text-black px-3 py-1.5 rounded-lg hover:bg-yellow-500 transition-colors">Configurar Experto</button>}
                            {activeBrain.avatar === 'Falta Configurar' && <button onClick={() => navigate('/dashboard/avatar-profile')} className="text-[10px] font-bold bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">Crear Avatar</button>}
                            {activeBrain.kbCount === 0 && <button onClick={() => navigate('/dashboard/knowledge-base')} className="text-[10px] font-bold bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700">Subir Conocimiento</button>}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* ACCIONES RÁPIDAS (MENÚ) */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs opacity-70"><Zap size={14}/> Centro de Comando</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TOOLS.map((tool, i) => (
                            <div 
                                key={i} 
                                onClick={() => navigate(tool.link)}
                                className={`flex items-start gap-4 p-5 rounded-2xl border bg-[#0B0E14] border-gray-800 cursor-pointer transition-all hover:scale-[1.01] hover:border-gray-600 shadow-md group`}
                            >
                                <div className={`p-3.5 rounded-xl bg-gray-900 border border-gray-800 ${tool.color.split(' ')[0]} group-hover:scale-110 transition-transform`}>
                                    {tool.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-200 text-base group-hover:text-white transition-colors">{tool.title}</h3>
                                    <p className="text-xs text-gray-500 leading-snug font-medium mt-0.5">{tool.desc}</p>
                                </div>
                                <ArrowRight className="ml-auto text-gray-700 self-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={16}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FEED DE ACTIVIDAD */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest text-xs opacity-70"><History size={14}/> Últimos Movimientos</h2>
                        <button onClick={() => navigate('/dashboard/history')} className="text-[10px] font-bold text-indigo-400 hover:text-white transition-colors uppercase">Ver historial</button>
                    </div>
                    
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-4 space-y-4 min-h-[300px] shadow-xl relative overflow-hidden">
                        {recentActivity.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center py-10 opacity-50">
                                <Activity size={32} className="mb-2"/>
                                <p className="text-xs font-bold">Sin actividad reciente</p>
                            </div>
                        ) : (
                            recentActivity.map((act) => (
                                <div key={act.id} className="flex items-center gap-3 p-3 hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-800 group">
                                    <div className={`w-1 h-8 rounded-full ${act.score && act.score > 80 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-indigo-500'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold text-gray-300 truncate group-hover:text-white transition-colors">{act.title}</h4>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{act.date} • {act.type}</p>
                                    </div>
                                    {act.score && (
                                        <div className={`text-[10px] font-black px-2 py-1 rounded border ${act.score > 80 ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-indigo-900/20 text-indigo-400 border-indigo-500/30'}`}>
                                            {act.score}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                        
                        {/* DEGRADADO INFERIOR */}
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0B0E14] to-transparent pointer-events-none"></div>
                    </div>

                    {/* UPSELL DISCRETO */}
                    {userProfile?.tier !== 'pro' && userProfile?.tier !== 'admin' && (
                        <button onClick={() => navigate('/settings')} className="w-full py-3 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-indigo-200 hover:text-white hover:border-indigo-400 transition-all shadow-lg group">
                            <Rocket size={14} className="text-yellow-400 group-hover:animate-bounce"/> DESBLOQUEAR PODER TOTAL
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};