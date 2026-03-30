import { handleAutopsiaViral } from './supabase/functions/process-url/handlers/autopsia-viral.ts';

async function testAutopsiaViral() {
  console.log('>>> INICIANDO TEST E2E');
  
  // Mock OpenAI client
  const mockOpenAI = {
    chat: {
      completions: {
        create: async () => ({
          choices: [{
            message: {
              content: JSON.stringify({
                score_viral: { potencial_total: 8.5, factores_exito: ['Factor 1'], nivel_replicabilidad: 'Alta' },
                adn_extraido: { idea_ganadora: 'Idea ganadora', disparador_psicologico: 'Disparador', estructura_exacta: 'Estructura', formula_gancho: 'Formula' },
                desglose_temporal: [{ segundo: '0-3', que_pasa: 'Hook', porque_funciona: 'Funciona', replicar_como: 'Replicar' }],
                patron_replicable: { nombre_patron: 'Patron', formula: 'Formula', aplicacion_generica: 'Aplicacion' },
                produccion_deconstruida: { visuales_clave: ['Visual'], ritmo_cortes: 'Ritmo', movimiento_camara: 'Movimiento', musica_sonido: 'Musica' },
                insights_algoritmicos: { optimizacion_retencion: 'Optimizacion', triggers_engagement: ['Trigger'], seo_keywords: ['Keyword'] }
              })
            }
          }],
          usage: { total_tokens: 100 }
        })
      }
    }
  };

  // Mock body parameters
  const mockBody = {
    url: 'https://www.youtube.com/watch?v=example',
    userId: 'test-user-id'
  };

  const mockSettings = {};
  const mockPlatform = 'YouTube';
  const mockProcessedContext = 'Este es un video de prueba para el test';
  
  // Mock user context
  const mockUserContext = {
    nicho: 'General',
    avatar_ideal: 'Audiencia general',
    dolor_principal: 'N/A',
    deseo_principal: 'N/A',
    competencia_analizada: [],
    hooks_exitosos: [],
    patrones_virales: []
  };

  try {
    const result = await handleAutopsiaViral(mockBody, mockSettings, mockPlatform, mockProcessedContext, mockUserContext, mockOpenAI);
    console.log('>>> RESULTADO DEL TEST:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('>>> ERROR EN TEST:', error);
    throw error;
  }
}

if (import.meta.main) {
  testAutopsiaViral().catch(console.error);
}