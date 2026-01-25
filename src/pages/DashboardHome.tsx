import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// ✅ IMPORTACIONES LIMPIAS (Tus iconos originales)
import { 
    Zap, Rocket, BarChart3, TrendingUp, DollarSign, Users, Target, BookOpen, 
    Calendar, MessageSquare, Briefcase, RefreshCw, ArrowRight, 
    Activity, BrainCircuit, ShieldCheck, History
} from 'lucide-react';

// --- INTERFACES (Tus interfaces originales) ---
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

// --- CONSTANTES (Tu menú original) ---
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
    const [activeBrain, setActiveBrain] = useState({ avatar: 'No definido', expert: 'No definido' });
    const [isLoading, setIsLoading] = useState(true);

    // ✅ LÓGICA BLINDADA: Usamos useCallback para estabilizar la función y evitar bucles
    const fetchRealData = useCallback(async () => {
        if (!user) return;

        try {
            // 🛡️ SECURITY TIMEOUT: Si Supabase tarda más de 5s, cortamos para mostrar la UI (aunque sea con datos parciales)
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000));

            // Tus consultas originales envueltas en la carrera contra el tiempo
            const dataPromise = Promise.all([
                supabase.from('viral_analyses').select('id, title, created_at, score').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
                supabase.from('mentor_chats').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('viral_analyses').select('score').eq('user_id', user.id)
            ]);

            // @ts-ignore - Ignoramos error de tipo estricto en Promise.race para simplificar
            const [analysesRes, chatsCountRes, viralStatsRes] = await Promise.race([dataPromise, timeoutPromise]);

            const scores = viralStatsRes.data?.map((v: any) => v.score).filter((s: any) => s !== null) || [];
            const avgScore = scores.length > 0 ? (scores.reduce((a: any, b: any) => a + b, 0) / scores.length).toFixed(1) : "0";

            // Lógica de nombres de Avatar/Experto
            let avatarName = "Genérico";
            let expertName = "Genérico";
            
            // Usamos verificaciones seguras para userProfile
            if (userProfile?.active_avatar_id) {
                const { data: av } = await supabase.from('avatars').select('name').eq('id', userProfile.active_avatar_id).maybeSingle();
                if (av) avatarName = av.name;
            }
            if (userProfile?.active_expert_id) {
                const { data: ex } = await supabase.from('expert_profiles').select('name').eq('id', userProfile.active_expert_id).maybeSingle();
                if (ex) expertName = ex.name;
            }
            setActiveBrain({ avatar: avatarName, expert: expertName });

            setStats([
                {
                    icon: <Zap className="w-6 h-6 text-yellow-400" />,
                    title: "Score Viral Promedio",
                    value: avgScore,
                    description: "Nivel de impacto detectado.",
                    color: "from-yellow-600 to-orange-600",
                    trend: scores.length > 0 ? `${scores.length} análisis` : "Sin datos"
                },
                {
                    icon: <DollarSign className="w-6 h-6 text-green-400" />,
                    title: "Créditos Disponibles",
                    value: userProfile?.credits?.toString() || "0",
                    description: `Suscripción: ${userProfile?.tier?.toUpperCase() || 'FREE'}`,
                    color: "from-green-600 to-emerald-600"
                },
                {
                    icon: <Activity className="w-6 h-6 text-blue-400" />,
                    title: "Análisis Realizados",
                    value: scores.length.toString(),
                    description: "Videos diseccionados.",
                    color: "from-blue-600 to-indigo-600"
                },
                {
                    icon: <MessageSquare className="w-6 h-6 text-purple-400" />,
                    title: "Sesiones Mentoría",
                    value: chatsCountRes.count?.toString() || "0",
                    description: "Consultas al Mentor.",
                    color: "from-purple-600 to-violet-600"
                }
            ]);

            const activity = analysesRes.data?.map((a: any) => ({
                id: a.id,
                type: 'análisis',
                title: a.title || "Análisis sin título",
                date: new Date(a.created_at).toLocaleDateString(),
                score: a.score
            })) || [];
            setRecentActivity(activity);

        } catch (error) {
            console.error("Error Dashboard:", error);
        } finally {
            // ✅ ESTO ES LO IMPORTANTE: Se ejecuta siempre, haya error o éxito.
            setIsLoading(false);
        }
    }, [user, userProfile]); // Dependencias controladas

    useEffect(() => {
        let isMounted = true;
        
        // Solo intentamos cargar si el Auth ya terminó de verificar
        if (!isAuthLoading) {
            if (user) {
                fetchRealData();
            } else {
                setIsLoading(false);
            }
        }
        
        return () => { isMounted = false; };
    }, [user, isAuthLoading, fetchRealData]); 

    // Renderizado de carga con estilo Titan
    if (isLoading || isAuthLoading) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-white">
                <RefreshCw className="animate-spin mb-4 text-indigo-500" size={40}/> 
                <span className="font-bold tracking-widest uppercase text-xs text-indigo-400 animate-pulse">
                    Sincronizando Torre de Control...
                </span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                        <BarChart3 className="text-indigo-500 hidden md:block" size={36} />
                        Torre de Control
                    </h1>
                    <p className="text-gray-400 mt-1">Visión general de tu imperio de contenidos.</p>
                </div>
                
                <div className="bg-[#0B0E14] border border-gray-800 rounded-xl p-3 flex items-center gap-4 text-xs md:text-sm shadow-xl">
                    <div className="flex items-center gap-2 text-gray-400">
                        <BrainCircuit size={16} className="text-purple-500"/>
                        <span className="font-bold text-gray-300">Cerebro Activo:</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1 text-pink-400 bg-pink-900/20 px-2 py-0.5 rounded border border-pink-500/30">
                            <Users size={12}/> {activeBrain.avatar}
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-500/30">
                            <ShieldCheck size={12}/> {activeBrain.expert}
                        </span>
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
                                <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">{stat.icon}</div>
                                {stat.trend && <span className="text-[10px] font-mono bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 border border-gray-700">{stat.trend}</span>}
                            </div>
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-sm font-bold text-gray-300">{stat.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{stat.description}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* ACCIONES RÁPIDAS */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Zap size={20} className="text-yellow-500"/> Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TOOLS.map((tool, i) => (
                            <div 
                                key={i} 
                                onClick={() => navigate(tool.link)}
                                className={`flex items-start gap-4 p-5 rounded-2xl border bg-[#0B0E14] border-gray-800 cursor-pointer transition-all hover:scale-[1.01] hover:border-gray-600 shadow-md`}
                            >
                                <div className={`p-3 rounded-xl bg-gray-900 border border-gray-800 ${tool.color.split(' ')[0]}`}>
                                    {tool.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-200 text-lg">{tool.title}</h3>
                                    <p className="text-sm text-gray-500 leading-snug">{tool.desc}</p>
                                </div>
                                <ArrowRight className="ml-auto text-gray-700 self-center" size={18}/>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTIVIDAD RECIENTE */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2"><History size={20} className="text-gray-400"/> Reciente</h2>
                        <button onClick={() => navigate('/dashboard/history')} className="text-xs text-indigo-400 hover:underline">Ver todo</button>
                    </div>
                    
                    <div className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-4 space-y-4 min-h-[300px] shadow-xl">
                        {recentActivity.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center py-10">
                                <Activity size={32} className="mb-2 opacity-20"/>
                                <p className="text-sm italic">Sin actividad registrada aún.</p>
                            </div>
                        ) : (
                            recentActivity.map((act) => (
                                <div key={act.id} className="flex items-center gap-3 p-3 hover:bg-gray-900 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-800">
                                    <div className={`w-1 h-8 rounded-full ${act.score && act.score > 80 ? 'bg-green-500' : 'bg-indigo-500'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-300 truncate">{act.title}</h4>
                                        <p className="text-xs text-gray-500">{act.date} • {act.type}</p>
                                    </div>
                                    {act.score && (
                                        <div className={`text-xs font-bold px-2 py-1 rounded border ${act.score > 80 ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-indigo-900/20 text-indigo-400 border-indigo-500/30'}`}>
                                            {act.score}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* SECCIÓN UPSELL - MANTENIDA */}
                    {userProfile?.tier !== 'pro' && userProfile?.tier !== 'admin' && (
                        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-5 text-center shadow-lg">
                            <h3 className="font-bold text-white mb-1 flex items-center justify-center gap-2">
                                <Rocket size={16} className="text-yellow-400 animate-pulse"/> Escala tu Impacto
                            </h3>
                            <p className="text-[11px] text-gray-300 mb-4 leading-relaxed">Accede a auditorías ilimitadas y mayor profundidad de análisis con IA de última generación.</p>
                            <button onClick={() => navigate('/settings')} className="w-full py-2 bg-white text-indigo-900 rounded-xl text-xs font-black hover:bg-gray-200 transition-all uppercase tracking-wider">
                                Mejorar Plan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};