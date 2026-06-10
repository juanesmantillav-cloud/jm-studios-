import { useState } from 'react';
import { useStore } from '../../data/store';

// ─── Edit Vitamin ──────────────────────────────────────────────
export function EditVitaminModal({ vitaminId, onClose }) {
  const { state, dispatch } = useStore();
  const item = state.vitamins.find(v => v.id === vitaminId);
  const [form, setForm] = useState(item ? { ...item } : null);
  if (!item) return null;

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function save() {
    dispatch({ type: 'UPDATE_VITAMIN', vitamin: { ...form, qty: Number(form.qty), low: Number(form.low) } });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">{item.name}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Cantidad ({item.unit})</label>
            <input type="number" value={form.qty} onChange={e => set('qty', e.target.value)}/>
          </div>
          <div className="field">
            <label>Alerta si menos de</label>
            <input type="number" value={form.low} onChange={e => set('low', e.target.value)}/>
          </div>
        </div>

        <div className="field">
          <label>Nota</label>
          <input value={form.note} onChange={e => set('note', e.target.value)}/>
        </div>

        <button className="btn-primary" onClick={save}>Guardar</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── Add Vitamin ───────────────────────────────────────────────
export function AddVitaminModal({ onClose }) {
  const { dispatch } = useStore();
  const [form, setForm] = useState({ name: '', qty: '', unit: 'frascos', note: '', low: '4' });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function save() {
    if (!form.name.trim()) return;
    dispatch({ type: 'ADD_VITAMIN', vitamin: { name: form.name, qty: Number(form.qty), unit: form.unit, note: form.note, low: Number(form.low) } });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">Nuevo producto</p>

        <div className="field">
          <label>Nombre</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre del producto"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Cantidad</label>
            <input type="number" value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="0"/>
          </div>
          <div className="field">
            <label>Unidad</label>
            <select value={form.unit} onChange={e => set('unit', e.target.value)}>
              <option value="frascos">frascos</option>
              <option value="ampollas">ampollas</option>
              <option value="sobres">sobres</option>
              <option value="dosis">dosis</option>
              <option value="litros">litros</option>
              <option value="tubos">tubos</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Descripción</label>
            <input value={form.note} onChange={e => set('note', e.target.value)} placeholder="Uso / presentación"/>
          </div>
          <div className="field">
            <label>Alerta ≤</label>
            <input type="number" value={form.low} onChange={e => set('low', e.target.value)}/>
          </div>
        </div>

        <button className="btn-primary" onClick={save}>Agregar</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── Log Consumption ───────────────────────────────────────────
export function LogConsumptionModal({ onClose }) {
  const { state, dispatch } = useStore();
  const [stockId, setStockId] = useState('');
  const [kg, setKg] = useState('');

  const selectedItem = state.stock.find(s => s.id === stockId);
  const timeStr = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

  function save() {
    if (!stockId || !kg) return;
    dispatch({
      type: 'LOG_CONSUMPTION',
      entry: {
        stockId,
        itemName: selectedItem?.name || '',
        kg: Number(kg),
        datetime: (() => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}T${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:00`; })(),
      },
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">Registrar consumo</p>

        <div style={{ padding: '10px 16px', borderRadius: 12, background: 'var(--bg-2)', marginBottom: 16, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Hora registrada</span>
          <strong style={{ color: 'var(--ink)', fontSize: 16 }}>{timeStr}</strong>
        </div>

        <div className="field">
          <label>Alimento</label>
          <select value={stockId} onChange={e => { setStockId(e.target.value); setKg(''); }}>
            <option value="">— seleccionar —</option>
            {state.stock.map(s => (
              <option key={s.id} value={s.id}>{s.name} · {s.stock} {s.unit} disponibles</option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <div className="field">
            <label>Cantidad gastada ({selectedItem.unit})</label>
            <input type="number" step="0.1" value={kg} onChange={e => setKg(e.target.value)} placeholder="0" autoFocus/>
          </div>
        )}

        {selectedItem && kg && Number(kg) > 0 && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', marginBottom: 4, fontSize: 13, color: 'var(--ink-2)' }}>
            Quedará: <strong>{Math.max(0, selectedItem.stock - Number(kg)).toLocaleString('es-CO')} {selectedItem.unit}</strong>
          </div>
        )}

        <button className="btn-primary" onClick={save}>Registrar</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── Add Event ─────────────────────────────────────────────────
export function AddEventModal({ onClose }) {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({
    date: '', kind: 'celo', horse: '', title: '', note: '',
  });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function save() {
    if (!form.date || !form.title.trim()) return;
    dispatch({ type: 'ADD_EVENT', event: form });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">Nuevo evento</p>

        <div className="field">
          <label>Fecha</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
        </div>

        <div className="field">
          <label>Tipo</label>
          <select value={form.kind} onChange={e => set('kind', e.target.value)}>
            <option value="celo">Celo</option>
            <option value="parto">Parto</option>
            <option value="confirm">Confirmar gestación</option>
          </select>
        </div>

        <div className="field">
          <label>Caballo</label>
          <select value={form.horse} onChange={e => set('horse', e.target.value)}>
            <option value="">— seleccionar —</option>
            {state.horses.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Título del evento</label>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Inicio de celo"/>
        </div>

        <div className="field">
          <label>Nota (opcional)</label>
          <input value={form.note} onChange={e => set('note', e.target.value)} placeholder="Observaciones..."/>
        </div>

        <button className="btn-primary" onClick={save}>Guardar evento</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

// ─── Register Service (monta / inseminación) ───────────────────
export function RegisterServiceModal({ horseId, onClose }) {
  const { state, dispatch } = useStore();
  const horse = state.horses.find(h => h.id === horseId);
  const [form, setForm] = useState({
    type: 'natural',
    date: new Date().toISOString().split('T')[0],
    sire: '',
    confirmDate: '',
  });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function save() {
    if (!form.date || !form.confirmDate) return;
    dispatch({
      type: 'UPDATE_HORSE',
      horse: {
        id: horseId,
        status: 'inseminada',
        lastService: form.date,
        confirmDate: form.confirmDate,
        sire: form.sire,
        tile: 'mare',
      },
    });
    // update stallion covers
    if (form.sire) {
      const stallion = state.horses.find(h => h.name === form.sire && h.sex === 'stallion');
      if (stallion) {
        dispatch({ type: 'UPDATE_HORSE', horse: { id: stallion.id, covers: (stallion.covers || 0) + 1 } });
      }
    }
    onClose();
  }

  if (!horse) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">Registrar servicio — {horse.name}</p>

        <div className="field">
          <label>Tipo</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="natural">Monta natural</option>
            <option value="ia">Inseminación artificial</option>
          </select>
        </div>

        <div className="field">
          <label>Fecha del servicio</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
        </div>

        <div className="field">
          <label>Padrillo</label>
          <select value={form.sire} onChange={e => set('sire', e.target.value)}>
            <option value="">— seleccionar —</option>
            {state.horses.filter(h => h.sex === 'stallion').map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Fecha confirmar gestación</label>
          <input type="date" value={form.confirmDate} onChange={e => set('confirmDate', e.target.value)}/>
        </div>

        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--amber-soft)', marginBottom: 16, fontSize: 13, color: '#6e4d12', lineHeight: 1.5 }}>
          La ecografía suele realizarse 25–30 días después del servicio para confirmar gestación.
        </div>

        <button className="btn-primary" onClick={save}>Registrar servicio</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
