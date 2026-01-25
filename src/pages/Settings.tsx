import React, { useState, useEffect } from 'react';
import { Check, X, Zap, Key, Wallet, Coins, CreditCard, LogOut, RefreshCw, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { PlanGuard } from '../components/PlanGuard';
import { Auth } from './Auth'; 
import { useNavigate, useLocation } from 'react-router-dom';

// --- 1. CARACTERÍSTICAS POR NIVEL ---
const CORE_FEATURES = [
    { id: 'guiones', name: 'Generador de Guiones Virales', level: 'esencial' },
    { id: 'ideas', name: 'Ideas Ganadoras Ilimitadas', level: 'esencial' },
    { id: 'calc', name: 'Calculadora Viral (Auditoría)', level: 'esencial' },
    { id: 'analizar', name: 'Análisis de Competencia (Scraper)', level: 'esencial' },
    { id: 'knowledge', name: 'Base de Conocimiento (PDF/Web)', level: 'esencial' },
    { id: 'perfiles', name: 'Perfiles de Experto y Avatar', level: 'esencial' },
    { id: 'recrear', name: 'Recrear Viral (Ingeniería Inversa)', level: 'pro' },
    { id: 'asistente', name: 'Mentor IA (Chat Estratégico)', level: 'pro' },
    { id: 'webhooks', name: 'Webhooks (Make/Zapier)', level: 'pro' },
    { id: 'apis', name: 'APIs Externas (Voz/Video)', level: 'agency' },
];

// --- 2. PLANES ESTRATÉGICOS ---
const PLANS = [
    { 
        id: 'esencial', 
        name: 'Creador Esencial', 
        price: '$19', 
        credits: '1,000', 
        desc: 'Para empezar a dominar tu nicho.', 
        color: 'border-gray-700', 
        bg: 'bg-[#0B0E14]', 
        buttonClass: 'bg-white text-black hover:bg-gray-200', 
        isPopular: false 
    },
    { 
        id: 'pro', 
        name: 'Creator Pro', 
        price: '$49', 
        credits: '3,000', 
        desc: 'Para creadores diarios y automatización.', 
        color: 'border-indigo-500', 
        bg: 'bg-gradient-to-b from-indigo-900/20 to-[#0B0E14]', 
        buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-500', 
        isPopular: true 
    },
    { 
        id: 'agency', 
        name: 'Agencia Scale', 
        price: '$99', 
        credits: '8,000', 
        desc: 'Para equipos y múltiples cuentas.', 
        color: 'border-yellow-600', 
        bg: 'bg-[#0B0E14]', 
        buttonClass: 'bg-yellow-600 text-black hover:bg-yellow-500', 
        isPopular: false 
    },
];

const CREDITS_PACKS = [
    { id: 'pack_500', amount: 500, price: 15, label: 'Básico' },
    { id: 'pack_1500', amount: 1500, price: 39, label: 'Estándar' },
    { id: 'pack_5000', amount: 5000, price: 99, label: 'Pro' },
];

const PlanCard = ({ plan, onSelect, currentTier, isProcessing }: any) => {
    const isCurrent = currentTier === plan.id;
    return (
        <div className={`p-8 rounded-[32px] border-2 ${plan.color} ${plan.bg} flex flex-col relative transition-all duration-300 ${plan.isPopular ? 'scale-[1.05] shadow-2xl shadow-indigo-500/20 z-10' : 'hover:border-gray-500 shadow-xl'}`}>
            {plan.isPopular && <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Elección Pro</span>}
            
            <h2 className="text-xl font-black text-white mt-2 uppercase tracking-tighter">{plan.name}</h2>
            <p className="text-4xl font-black text-white mt-3 mb-1">{plan.price} <span className="text-sm font-bold text-gray-500">/mes</span></p>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">{plan.desc}</p>
            
            <div className="flex items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-white/5 mb-8 shadow-inner">
                <Zap size={28} className="text-yellow-400 fill-current" />
                <div>
                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Capacidad Mensual</p>
                    <p className="text-2xl font-black text-white leading-none">{plan.credits} CR</p>
                </div>
            </div>

            <ul className="space-y-4 flex-1 mb-8">
                {CORE_FEATURES.map(feature => {
                    const tierLevel: any = { esencial: 1, pro: 2, agency: 3 };
                    const hasAccess = tierLevel[plan.id] >= tierLevel[feature.level];
                    return (
                        <li key={feature.id} className={`flex items-start gap-3 text-xs font-bold ${hasAccess ? 'text-gray-300' : 'text-gray-700'}`}>
                            <div className="mt-0.5">
                                {hasAccess ? <Check size={14} className="text-indigo-500" /> : <X size={14} className="text-red-900" />}
                            </div>
                            <span className={!hasAccess ? 'line-through decoration-red-900/50' : ''}>{feature.name}</span>
                        </li>
                    );
                })}
            </ul>
            
            <button 
                onClick={() => onSelect(plan.id)} 
                disabled={isCurrent || isProcessing} 
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${isCurrent ? 'bg-indigo-900/20 text-indigo-400 border border-indigo-500/30 cursor-default' : plan.buttonClass} disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl active:scale-95`}
            >
                {isProcessing && !isCurrent ? <RefreshCw size={14} className="animate-spin" /> : null}
                {isCurrent ? 'Plan Actual' : `Activar ${plan.id}`}
            </button>
        </div>
    );
};

export const ApiKeysSection = () => {
    const { user } = useAuth();
    const [keys, setKeys] = useState({ elevenLabs: '', heyGen: '', webhookMake: '' });
    
    useEffect(() => {
        if(!user) return;
        const loadKeys = async () => {
            const { data } = await supabase.from('user_api_keys').select('*').eq('user_id', user.id);
            if(data) {
                const newKeys = { ...keys };
                data.forEach((k: any) => {
                    if(k.service === 'elevenlabs') newKeys.elevenLabs = k.api_key;
                    if(k.service === 'heygen') newKeys.heyGen = k.api_key;
                    if(k.service === 'make') newKeys.webhookMake = k.api_key;
                });
                setKeys(newKeys);
            }
        };
        loadKeys();
    }, [user]);

    const handleSave = async () => {
        if(!user) return;
        const updates = [
            { user_id: user.id, service: 'elevenlabs', api_key: keys.elevenLabs },
            { user_id: user.id, service: 'heygen', api_key: keys.heyGen },
            { user_id: user.id, service: 'make', api_key: keys.webhookMake },
        ];
        
        await supabase.from('user_api_keys').delete().eq('user_id', user.id);
        const { error } = await supabase.from('user_api_keys').insert(updates.filter(k => k.api_key));
        
        if (!error) alert("✅ Conexiones sincronizadas.");
    };

    return (
        <div className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 space-y-8 animate-in slide-in-from-bottom-4 shadow-2xl">
            <div className="border-b border-gray-800 pb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter"><Key size={24} className="text-indigo-500" /> Integraciones Pro</h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">Automatiza tu flujo de trabajo con llaves externas.</p>
            </div>
            
            <div className="space-y-6">
                <div className="bg-gray-900/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                    <label className="text-[10px] font-black text-indigo-400 block mb-3 uppercase tracking-widest">Make / Zapier Webhook</label>
                    <input type="text" value={keys.webhookMake} onChange={(e) => setKeys({...keys, webhookMake: e.target.value})} placeholder="https://hook.make.com/..." className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none font-mono text-xs shadow-lg transition-all" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-900/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                        <label className="text-[10px] font-black text-gray-500 block mb-3 uppercase tracking-widest">ElevenLabs (Voz)</label>
                        <input type="password" value={keys.elevenLabs} onChange={(e) => setKeys({...keys, elevenLabs: e.target.value})} className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none text-xs" />
                    </div>
                    <div className="bg-gray-900/30 p-6 rounded-2xl border border-white/5 shadow-inner">
                        <label className="text-[10px] font-black text-gray-500 block mb-3 uppercase tracking-widest">HeyGen (Avatar Video)</label>
                        <input type="password" value={keys.heyGen} onChange={(e) => setKeys({...keys, heyGen: e.target.value})} className="w-full bg-[#0B0E14] border border-gray-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none text-xs" />
                    </div>
                </div>
            </div>
            <button onClick={handleSave} className="w-full py-4 rounded-2xl font-black bg-indigo-600 text-white uppercase tracking-widest text-xs hover:bg-indigo-500 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                <Save size={18}/> Sincronizar Configuración
            </button>
        </div>
    );
};

export const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile, isLoading } = useAuth(); 
    
    const [activeTab, setActiveTab] = useState('plans');
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    useEffect(() => {
        if (location.state && (location.state as any).tab) {
            setActiveTab((location.state as any).tab);
        }
    }, [location]);

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error(error);
            window.location.href = '/login';
        } finally { setLoadingLogout(false); }
    };

    const handleChangePlan = async (planId: string) => {
        if (!user || isProcessing || userProfile?.tier === planId) return;
        if (!confirm(`¿Confirmar suscripción al plan ${planId.toUpperCase()}?`)) return;

        setIsProcessing(true);
        try {
            const response = await fetch('/api/stripe-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, newTierId: planId }),
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url; 
        } catch (error) {
            alert("Error con Stripe.");
        } finally { setIsProcessing(false); }
    };

    const handleBuyCredits = async (packId: string) => { 
        if (!user || isProcessing) return;
        setIsProcessing(true);
        try {
            const response = await fetch('/api/stripe-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId: packId }),
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
        } catch (error) {
            alert("Error con Stripe.");
        } finally { setIsProcessing(false); }
    };

    if (!user || isLoading) return <Auth />;

    return (
        <div className="space-y-12 animate-in fade-in pb-20 p-4 max-w-7xl mx-auto">
            
            <div className="text-center space-y-3 pt-10">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Centro de Mando</h1>
                <p className="text-gray-500 font-bold tracking-widest text-xs uppercase">Gestión de Potencia y Suscripción</p>
            </div>

            <div className="flex justify-center border-b border-gray-800">
                <div className="flex gap-10 overflow-x-auto pb-1 px-4">
                    {[
                        { id: 'plans', label: 'Planes', icon: CreditCard, color: 'border-indigo-500' },
                        { id: 'credits', label: 'Saldo', icon: Wallet, color: 'border-green-500' },
                        { id: 'api', label: 'Conexiones', icon: Key, color: 'border-indigo-500' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 pb-4 border-b-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? `${tab.color} text-white` : 'border-transparent text-gray-600 hover:text-gray-300'}`}>
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'plans' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 md:px-0">
                        {PLANS.map(plan => (
                            <PlanCard key={plan.id} plan={plan} onSelect={handleChangePlan} currentTier={userProfile?.tier || 'free'} isProcessing={isProcessing} />
                        ))}
                    </div>
                    <div className="bg-gray-900/30 p-4 rounded-2xl border border-white/5 text-center max-w-2xl mx-auto shadow-inner">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                            Suscripción mensual recurrente. Cancela cuando quieras desde el portal de facturación.
                        </p>
                    </div>
                </div>
            )}

            {activeTab === 'credits' && (
                <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right-4">
                    <div className="bg-gradient-to-br from-indigo-950 to-[#0B0E14] border border-white/5 rounded-[40px] p-12 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 rotate-12"><Coins size={280} className="text-indigo-500"/></div>
                        <h3 className="text-gray-500 uppercase text-[10px] font-black tracking-[0.3em] mb-4">Saldo en Cámara</h3>
                        <p className="text-7xl font-black text-white tracking-tighter mb-6">{userProfile?.credits || 0}</p>
                        <div className="inline-flex items-center gap-2 text-green-400 font-black text-[10px] bg-green-950/30 px-6 py-2 rounded-full border border-green-500/20 uppercase tracking-widest">
                            <CheckCircle2 size={14}/> Sincronizado
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {CREDITS_PACKS.map(pack => (
                            <div key={pack.id} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center hover:border-indigo-500/50 transition-all shadow-xl group">
                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 bg-gray-900 px-3 py-1.5 rounded-full border border-white/5">{pack.label}</span>
                                <Coins size={48} className="text-gray-700 group-hover:text-indigo-500 transition-all duration-500 mb-6" />
                                <p className="text-4xl font-black text-white mb-1 tracking-tighter">{pack.amount}</p>
                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-8">Créditos Vitalicios</p>
                                <button onClick={() => handleBuyCredits(pack.id)} disabled={isProcessing} className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] bg-gray-900 text-white group-hover:bg-indigo-600 transition-all shadow-lg active:scale-95 border border-white/5">
                                    {isProcessing ? <RefreshCw size={14} className="animate-spin"/> : `Inyectar $${pack.price}`}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'api' && (
                <div className="max-w-3xl mx-auto">
                    <PlanGuard requiredTier="pro" userTier={userProfile?.tier || 'free'} featureName="Integraciones Avanzadas">
                        <ApiKeysSection />
                    </PlanGuard>
                </div>
            )}

            <div className="pt-20 border-t border-white/5 flex justify-center">
                <button onClick={handleLogout} disabled={loadingLogout} className="text-red-900 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 transition-all opacity-40 hover:opacity-100">
                    {loadingLogout ? <RefreshCw size={14} className="animate-spin"/> : <LogOut size={14}/>} Terminar Sesión
                </button>
            </div>
        </div>
    );
};