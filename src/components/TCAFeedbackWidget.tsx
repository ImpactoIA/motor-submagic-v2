import React, { useState } from 'react';

interface Props {
  guionData: any;
  onClose: () => void;
}

export const TCAFeedbackWidget = ({ guionData, onClose }: Props) => {
  const [resultado, setResultado] = useState('');
  const [vistas, setVistas]       = useState('');
  const [notas, setNotas]         = useState('');
  const [enviando, setEnviando]   = useState(false);
  const [enviado, setEnviado]     = useState(false);

  const categorias = [
    { id: 'flop',   emoji: '😔', label: 'Menos de lo esperado', color: '#e74c3c' },
    { id: 'normal', emoji: '😐', label: 'Resultado normal',      color: '#f39c12' },
    { id: 'bueno',  emoji: '😊', label: 'Mejor de lo esperado',  color: '#27ae60' },
    { id: 'viral',  emoji: '🚀', label: 'Viral / Explotó',       color: '#8e44ad' }
  ];

  const enviar = async () => {
    if (!resultado || enviando) return;
    setEnviando(true);
    try {
      await fetch('/api/titan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode:                'tca_feedback',
          resultado_categoria: resultado,
          vistas_48h:          vistas ? parseInt(vistas) : null,
          notas:               notas  || null,
          guion_data:          guionData
        })
      });
      setEnviado(true);
      setTimeout(onClose, 2500);
    } catch {
      onClose();
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div style={s.overlay}>
        <div style={s.container}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <span style={{ fontSize: 40 }}>✅</span>
            <p style={{ marginTop: 12, fontSize: 16, color: '#27ae60', fontWeight: 600 }}>
              Gracias. El sistema aprendió de tu resultado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.overlay}>
      <div style={s.container}>

        <div style={s.header}>
          <span style={{ fontSize: 28 }}>📊</span>
          <div style={{ flex: 1 }}>
            <h4 style={s.title}>¿Cómo fue el resultado?</h4>
            <p style={s.subtitle}>
              Tu reporte hace el sistema más preciso para todos
            </p>
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <div style={s.grid}>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setResultado(cat.id)}
              style={{
                ...s.catBtn,
                borderColor:     resultado === cat.id ? cat.color : '#2a2a2a',
                backgroundColor: resultado === cat.id ? cat.color + '22' : 'transparent',
                color:           resultado === cat.id ? cat.color : '#888'
              }}
            >
              <span style={{ fontSize: 22 }}>{cat.emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center' }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Vistas en 48 horas (opcional)"
          value={vistas}
          onChange={e => setVistas(e.target.value)}
          style={s.input}
        />

        <textarea
          placeholder="¿Algo que notes sobre el resultado? (opcional)"
          value={notas}
          onChange={e => setNotas(e.target.value)}
          rows={2}
          style={{ ...s.input, resize: 'none' }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={enviar}
            disabled={!resultado || enviando}
            style={{
              ...s.btnEnviar,
              opacity: !resultado || enviando ? 0.5 : 1,
              cursor:  !resultado || enviando ? 'not-allowed' : 'pointer'
            }}
          >
            {enviando ? 'Guardando...' : 'Enviar resultado'}
          </button>
          <button onClick={onClose} style={s.btnOmitir}>
            Omitir
          </button>
        </div>

        <p style={{ margin: 0, fontSize: 11, color: '#555', textAlign: 'center' }}>
          🔒 Solo tú y el sistema ven este dato. Nunca es público.
        </p>

      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay: {
    position:        'fixed',
    inset:           0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          1000
  },
  container: {
    backgroundColor: '#1a1a1a',
    border:          '1px solid #2a2a2a',
    borderRadius:    12,
    padding:         24,
    width:           '100%',
    maxWidth:        420,
    display:         'flex',
    flexDirection:   'column',
    gap:             14
  },
  header: {
    display:     'flex',
    alignItems:  'flex-start',
    gap:         12
  },
  title: {
    margin:     0,
    fontSize:   17,
    fontWeight: 700,
    color:      '#ffffff'
  },
  subtitle: {
    margin:   '4px 0 0',
    fontSize: 13,
    color:    '#888'
  },
  closeBtn: {
    background: 'none',
    border:     'none',
    color:      '#888',
    fontSize:   18,
    cursor:     'pointer',
    padding:    0
  },
  grid: {
    display:             'grid',
    gridTemplateColumns: '1fr 1fr',
    gap:                 8
  },
  catBtn: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           6,
    padding:       '12px 8px',
    borderRadius:  8,
    border:        '1px solid',
    cursor:        'pointer',
    transition:    'all 0.15s ease',
    background:    'transparent'
  },
  input: {
    width:           '100%',
    backgroundColor: '#111',
    border:          '1px solid #2a2a2a',
    borderRadius:    8,
    padding:         '10px 12px',
    color:           '#fff',
    fontSize:        14,
    boxSizing:       'border-box',
    outline:         'none'
  },
  btnEnviar: {
    flex:            1,
    backgroundColor: '#D4A017',
    color:           '#000',
    border:          'none',
    borderRadius:    8,
    padding:         '11px 0',
    fontWeight:      700,
    fontSize:        14
  },
  btnOmitir: {
    backgroundColor: 'transparent',
    color:           '#666',
    border:          '1px solid #2a2a2a',
    borderRadius:    8,
    padding:         '11px 18px',
    cursor:          'pointer',
    fontSize:        14
  }
};
