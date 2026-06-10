import { useState } from 'react';
import { useStore } from '../data/store';

const SEX_LABEL = { mare: 'Yegua', stallion: 'Padrillo', gelding: 'Castrado', foal: 'Cría / Potranca' };
const SEX_COLOR = { mare: '#c8b89a', stallion: '#4a3728', gelding: '#8a8070', foal: '#f5f0e8' };

export default function Onboarding() {
  const { dispatch } = useStore();
  const [step, setStep] = useState(0);

  // step 1
  const [name, setName] = useState('');

  // step 2
  const [horses, setHorses] = useState([]);
  const [hName, setHName] = useState('');
  const [hSex, setHSex] = useState('mare');

  // step 3
  const [caps, setCaps] = useState({ heno: '100', alfalfa: '1000', concentrado: '500' });

  function addHorse() {
    if (!hName.trim()) return;
    setHorses(h => [...h, { id: 'hob' + Date.now(), name: hName.trim(), sex: hSex }]);
    setHName('');
    setHSex('mare');
  }

  function removeHorse(id) { setHorses(h => h.filter(x => x.id !== id)); }

  function finish() {
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      name: name.trim() || 'Propietario',
      horses,
      capacities: {
        heno:        Math.max(1, Number(caps.heno)        || 100),
        alfalfa:     Math.max(1, Number(caps.alfalfa)     || 1000),
        concentrado: Math.max(1, Number(caps.concentrado) || 500),
      },
    });
  }

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Progress dots — only on steps 1-3 */}
      {step > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, paddingTop: 60 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              height: 6, borderRadius: 999, transition: 'all 0.25s',
              width: s === step ? 22 : 6,
              background: s === step ? 'var(--ink)' : s < step ? 'var(--ink-2)' : 'var(--hair-strong)',
            }}/>
          ))}
        </div>
      )}

      {/* ── Step 0: Welcome ──────────────────────────────────── */}
      {step === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px 60px' }}>
          <div style={{ width: 80, height: 80, borderRadius: 22, background: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <span className="serif" style={{ fontSize: 44, color: 'var(--bg)', lineHeight: 1 }}>E</span>
          </div>
          <h1 className="serif" style={{ fontSize: 48, margin: '0 0 10px', letterSpacing: '-0.02em' }}>Equino</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.65, margin: '0 0 48px', maxWidth: 280 }}>
            Tu asistente para gestionar caballos, bodega y ciclos reproductivos en un solo lugar.
          </p>
          <button className="btn-primary tap" onClick={() => setStep(1)} style={{ fontSize: 16, padding: '16px' }}>
            Comenzar →
          </button>
        </div>
      )}

      {/* ── Step 1: Name ─────────────────────────────────────── */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px 40px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Paso 1</p>
            <h2 className="serif" style={{ fontSize: 34, margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>¿Cómo te llamas?</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 32px', lineHeight: 1.5 }}>
              Así te saludaremos cada mañana en el inicio.
            </p>
            <div className="field">
              <label>Tu nombre</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Juan, María..."
                onKeyDown={e => e.key === 'Enter' && name.trim() && setStep(2)}
                autoFocus
              />
            </div>
          </div>
          <button
            className="btn-primary tap"
            onClick={() => setStep(2)}
            disabled={!name.trim()}
            style={{ fontSize: 15, padding: '15px', opacity: name.trim() ? 1 : 0.4 }}
          >
            Continuar →
          </button>
        </div>
      )}

      {/* ── Step 2: Horses ───────────────────────────────────── */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px 40px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Paso 2</p>
            <h2 className="serif" style={{ fontSize: 34, margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Tus caballos</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 24px', lineHeight: 1.5 }}>
              Agrega los caballos de tu criadero. Puedes añadir o editar más después.
            </p>

            {/* Add horse inline form */}
            <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px', marginBottom: 16, border: '0.5px solid var(--hair-strong)' }}>
              <div className="field" style={{ marginBottom: 10 }}>
                <label>Nombre del caballo</label>
                <input
                  value={hName}
                  onChange={e => setHName(e.target.value)}
                  placeholder="Ej: Perla, Relámpago..."
                  onKeyDown={e => e.key === 'Enter' && addHorse()}
                />
              </div>
              <div className="field" style={{ marginBottom: 12 }}>
                <label>Tipo</label>
                <select value={hSex} onChange={e => setHSex(e.target.value)}>
                  <option value="mare">Yegua</option>
                  <option value="stallion">Padrillo</option>
                  <option value="gelding">Castrado</option>
                  <option value="foal">Cría / Potranca</option>
                </select>
              </div>
              <button
                className="tap"
                onClick={addHorse}
                disabled={!hName.trim()}
                style={{
                  all: 'unset', width: '100%', boxSizing: 'border-box',
                  padding: '11px', borderRadius: 10, textAlign: 'center',
                  fontSize: 14, fontWeight: 500,
                  background: hName.trim() ? 'var(--ink)' : 'var(--bg-2)',
                  color: hName.trim() ? 'var(--bg)' : 'var(--muted)',
                }}
              >
                + Agregar caballo
              </button>
            </div>

            {/* Horse list */}
            {horses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                {horses.map(h => (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', borderRadius: 12, padding: '12px 14px', border: '0.5px solid var(--hair)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: SEX_COLOR[h.sex], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: h.sex === 'stallion' ? '#f5f0e8' : '#4a3728', flexShrink: 0 }}>
                      {h.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{h.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{SEX_LABEL[h.sex]}</div>
                    </div>
                    <button className="tap" onClick={() => removeHorse(h.id)} style={{ all: 'unset', fontSize: 20, color: 'var(--muted)', lineHeight: 1, padding: '4px 8px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {horses.length === 0 && (
              <div style={{ padding: '20px 0 4px', textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
                Aún no has agregado caballos
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {horses.length === 0 && (
              <button className="btn-secondary tap" onClick={() => setStep(3)} style={{ flex: 1, fontSize: 14 }}>
                Omitir
              </button>
            )}
            <button
              className="btn-primary tap"
              onClick={() => setStep(3)}
              style={{ flex: 2, fontSize: 15, padding: '15px', opacity: horses.length > 0 ? 1 : 0.5 }}
            >
              Continuar ({horses.length}) →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Bodega capacity ───────────────────────────── */}
      {step === 3 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px 40px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Paso 3</p>
            <h2 className="serif" style={{ fontSize: 34, margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.1 }}>Tu bodega</h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 28px', lineHeight: 1.5 }}>
              ¿Cuánto cabe en tu bodega? Esto define las barras de nivel de inventario.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 18px', border: '0.5px solid var(--hair-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>Heno</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Capacidad máxima</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      value={caps.heno}
                      onChange={e => setCaps(c => ({ ...c, heno: e.target.value }))}
                      style={{ width: 80, textAlign: 'right', fontFamily: 'inherit', fontSize: 18, fontWeight: 600, border: 'none', background: 'transparent', color: 'var(--ink)', outline: 'none' }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>pacas</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 18px', border: '0.5px solid var(--hair-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>Alfalfa</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Capacidad máxima</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      value={caps.alfalfa}
                      onChange={e => setCaps(c => ({ ...c, alfalfa: e.target.value }))}
                      style={{ width: 80, textAlign: 'right', fontFamily: 'inherit', fontSize: 18, fontWeight: 600, border: 'none', background: 'transparent', color: 'var(--ink)', outline: 'none' }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>kg</span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--card)', borderRadius: 16, padding: '16px 18px', border: '0.5px solid var(--hair-strong)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>Concentrado</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Capacidad máxima</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="number"
                      value={caps.concentrado}
                      onChange={e => setCaps(c => ({ ...c, concentrado: e.target.value }))}
                      style={{ width: 80, textAlign: 'right', fontFamily: 'inherit', fontSize: 18, fontWeight: 600, border: 'none', background: 'transparent', color: 'var(--ink)', outline: 'none' }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary tap" onClick={finish} style={{ marginTop: 32, fontSize: 16, padding: '16px' }}>
            Empezar →
          </button>
        </div>
      )}

    </div>
  );
}
