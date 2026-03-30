import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { 
    Database, Upload, FileText, Link as LinkIcon, X, Trash2, 
    Save, Loader2, CheckCircle2, FileType 
} from 'lucide-react';

// --- MOTOR DE LECTURA PDF ---
import * as pdfjsLib from 'pdfjs-dist';

// Configuración del Worker (CDN estable)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Resource {
    id: string;
    title: string;
    type: 'text' | 'url' | 'file';
    content?: string;
    file_size?: string; 
    created_at: string;
}

// ⚠️ IMPORTANTE: Asegúrate de crear este bucket en Supabase Storage y hacerlo público o con políticas correctas
const BUCKET_NAME = 'knowledge-files'; 

export const KnowledgeBase = () => {
    const { user, isLoading: authLoading } = useAuth(); // Asumiendo que tu AuthContext exporta isLoading
    
    // --- ESTADOS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputModalType, setInputModalType] = useState<'text' | 'url' | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(''); 
    const [resources, setResources] = useState<Resource[]>([]);

    // --- INPUTS ---
    const [titleValue, setTitleValue] = useState('');
    const [textInputValue, setTextInputValue] = useState('');
    const [urlInputValue, setUrlInputValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isMounted = useRef(true);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        isMounted.current = true;
        if (authLoading) return;
        if (!user) { setIsLoading(false); return; }

        const loadData = async () => {
            try {
                // ALINEACIÓN V300: Leemos de la tabla 'documents'
                const { data } = await supabase
                    .from('documents') 
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (isMounted.current) setResources(data || []);
            } catch (error) { 
                console.error("Error cargando conocimientos:", error); 
            } finally {
                if (isMounted.current) setIsLoading(false);
            }
        };

        loadData();
        return () => { isMounted.current = false; };
    }, [user, authLoading]); 

    // --- 🧠 UTILIDAD: EXTRAER TEXTO DE PDF ---
    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        // Leemos máximo 5 páginas para no saturar memoria ni tokens
        const maxPages = Math.min(pdf.numPages, 10); 

        for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += `[Pág ${i}]: ${pageText}\n`;
        }
        return fullText;
    };

    // --- GUARDAR TEXTO O URL ---
    const handleSaveInput = async () => {
        if (!titleValue || !user) return alert("Por favor, ponle un título.");
        const content = inputModalType === 'text' ? textInputValue : urlInputValue;
        if (!content) return alert("El contenido no puede estar vacío.");

        setIsUploading(true);
        try {
            const newResource = {
                user_id: user.id,
                title: titleValue,
                type: inputModalType === 'url' ? 'url' : 'text', // Alineado con SQL
                content: content,
                // Guardamos metadatos extra en filename o similar si tu tabla no tiene file_size
                filename: inputModalType === 'text' ? `Nota (${content.length} chars)` : 'Enlace Web'
            };

            // ALINEACIÓN V300: Insertamos en 'documents'
            const { data, error } = await supabase.from('documents').insert(newResource).select().single();
            if (error) throw error;
            
            setResources([data, ...resources]);
            setIsModalOpen(false);
            resetForm();
            alert("✅ Conocimiento guardado en el Cerebro.");
        } catch (error: any) { 
            alert(`Error: ${error.message}`); 
        } finally {
            setIsUploading(false);
        }
    };

    // --- BORRAR RECURSO ---
    const handleDelete = async (id: string) => {
        if(!confirm("¿Borrar este recurso del cerebro de la IA?")) return;
        try {
            // ALINEACIÓN V300: Borramos de 'documents'
            await supabase.from('documents').delete().eq('id', id);
            setResources(resources.filter(r => r.id !== id));
        } catch (error) { console.error(error); }
    };

    const openModal = (type: 'text' | 'url') => {
        setInputModalType(type);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setTitleValue('');
        setTextInputValue('');
        setUrlInputValue('');
    };

    // --- SUBIDA DE ARCHIVOS ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        
        if (file.size > 10 * 1024 * 1024) return alert("Máximo 10MB.");

        setIsUploading(true);
        setUploadStatus('Procesando archivo...');
        
        try {
            let extractedContent = "";
            let fileTypeForDb = 'file'; // Default

            // A. Extracción de Texto (La parte mágica para la IA)
            if (file.type === 'application/pdf') {
                setUploadStatus('Extrayendo texto para la IA...');
                try {
                    extractedContent = await extractTextFromPDF(file);
                    fileTypeForDb = 'pdf';
                } catch (readError) {
                    console.error(readError);
                    alert("No pudimos leer el texto del PDF. La IA solo sabrá el nombre del archivo.");
                }
            } else if (file.type === 'text/plain') {
                extractedContent = await file.text();
                fileTypeForDb = 'text';
            }

            // B. Subir al Storage (Para que el usuario pueda descargarlo luego)
            setUploadStatus('Subiendo a la nube...');
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `${user.id}/${Date.now()}-${safeName}`;
            
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME) 
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // C. Guardar en Base de Datos (ALINEACIÓN V300)
            const finalContent = extractedContent 
                ? `[CONTENIDO DE ${file.name}]:\n${extractedContent}` 
                : `[ARCHIVO SIN TEXTO LEGIBLE]: ${file.name}`;

            const newResource = {
                user_id: user.id,
                title: file.name,
                type: fileTypeForDb, 
                content: finalContent, // ¡ESTO ES LO QUE LEE LA IA!
                filename: filePath // Guardamos la ruta del archivo aquí
            };

            const { data, error: dbError } = await supabase.from('documents').insert(newResource).select().single();
            if (dbError) throw dbError;

            setResources([data, ...resources]);
            alert("✅ Archivo procesado e indexado.");
            
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadStatus('');
            if (fileInputRef.current) fileInputRef.current.value = ''; 
        }
    };

    // --- RENDERIZADO DE CARGA ---
    if (isLoading && resources.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-white">
                <Loader2 className="animate-spin mb-4 text-indigo-500" size={40}/> 
                <span className="font-bold tracking-widest uppercase text-xs text-indigo-400 animate-pulse">
                    Conectando con el Cerebro...
                </span>
            </div>
        );
    }

    // --- INTERFAZ ---
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 p-4">
            
            {/* HEADER */}
            <div className="text-center space-y-2">
                <div className="inline-flex p-4 bg-indigo-600/10 rounded-2xl mb-2 border border-indigo-500/20">
                    <Database className="text-indigo-500" size={36}/>
                </div>
                <h1 className="text-3xl font-black text-white">Cerebro Digital</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                    Sube tus PDFs y notas. La IA leerá el contenido automáticamente.
                </p>
            </div>

            {/* BOTONES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => openModal('text')} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xl">
                    <div className="p-4 bg-gray-900 rounded-2xl mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all text-gray-400 shadow-inner"><FileText size={28} /></div>
                    <h3 className="font-bold text-white">Nota de Texto</h3>
                </div>
                
                <div onClick={() => fileInputRef.current?.click()} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-green-500/50 transition-all cursor-pointer group shadow-xl">
                    <div className="p-4 bg-gray-900 rounded-2xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-all text-gray-400 shadow-inner">
                        {isUploading ? <Loader2 className="animate-spin" size={28}/> : <Upload size={28}/>}
                    </div>
                    <h3 className="font-bold text-white">{isUploading ? 'Procesando...' : 'Subir PDF'}</h3>
                    <p className="text-[10px] text-green-400 mt-1">{uploadStatus}</p>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.txt" />
                </div>
                
                <div onClick={() => openModal('url')} className="bg-[#0B0E14] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:border-purple-500/50 transition-all cursor-pointer group shadow-xl">
                    <div className="p-4 bg-gray-900 rounded-2xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all text-gray-400 shadow-inner"><LinkIcon size={28}/></div>
                    <h3 className="font-bold text-white">Guardar URL</h3>
                </div>
            </div>

            {/* LISTA */}
            <div className="space-y-4 pt-8 border-t border-gray-800">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Database size={20} className="text-indigo-500"/> Archivos Indexados</h3>
                    <span className="text-[10px] font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">{resources.length} Docs</span>
                </div>
                
                {resources.length === 0 ? (
                    <div className="text-center py-20 bg-[#0B0E14] rounded-3xl border-2 border-dashed border-gray-800 text-gray-500">
                        <p>Tu cerebro está vacío. Sube algo para empezar.</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {resources.map((res) => (
                            <div key={res.id} className="bg-[#0B0E14] border border-gray-800 rounded-2xl p-5 flex justify-between items-center hover:border-gray-600 transition-all">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className={`p-3 rounded-xl shrink-0 ${res.type === 'url' ? 'bg-purple-900/20 text-purple-400' : 'bg-indigo-900/20 text-indigo-400'}`}>
                                        {res.type === 'url' ? <LinkIcon size={20}/> : <FileText size={20}/>}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-bold text-sm truncate">{res.title}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                                            <span>{new Date(res.created_at).toLocaleDateString()}</span>
                                            {res.content && res.content.length > 50 && (
                                                <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={10}/> INDEXADO</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(res.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* MODAL INPUT */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0B0E14] border border-gray-700 rounded-3xl w-full max-w-lg shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white">{inputModalType === 'text' ? 'Nueva Nota' : 'Guardar Enlace'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-500 hover:text-white" size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" value={titleValue} onChange={(e) => setTitleValue(e.target.value)} placeholder="Título..." autoFocus />
                            
                            {inputModalType === 'text' ? (
                                <textarea className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none resize-none" value={textInputValue} onChange={(e) => setTextInputValue(e.target.value)} placeholder="Escribe aquí..." />
                            ) : (
                                <input type="url" className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" value={urlInputValue} onChange={(e) => setUrlInputValue(e.target.value)} placeholder="https://..." />
                            )}
                            
                            <button onClick={handleSaveInput} disabled={isUploading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all">
                                {isUploading ? <Loader2 className="animate-spin mx-auto"/> : 'GUARDAR'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};