import { useState } from 'react';
import { useStore } from '../../data/store';

export default function AddPurchaseModal({ onClose }) {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    item: '', qty: '', unit: 'kg', price: '', supplier: '',
    stockId: '',
  });
  const [bultos, setBultos] = useState('');
  const [kgPorBulto, setKgPorBulto] = useState('');

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  const isBultosMode = form.unit === 'kg';
  const totalKg = isBultosMode && bultos && kgPorBulto ? Number(bultos) * Number(kgPorBulto) : 0;

  function save() {
    if (!form.item.trim() || !form.price) return;
    if (isBultosMode && (!bultos || !kgPorBulto)) return;
    if (!isBultosMode && !form.qty) return;
    dispatch({
      type: 'ADD_PURCHASE',
      purchase: {
        date: form.date,
        item: form.item,
        qty: isBultosMode ? totalKg : Number(form.qty),
        unit: form.unit,
        price: Number(form.price),
        supplier: form.supplier,
      },
      stockId: form.stockId,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">Nueva compra</p>

        <div className="field">
          <label>Fecha</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
        </div>

        <div className="field">
          <label>Artículo</label>
          <input value={form.item} onChange={e => set('item', e.target.value)} placeholder="Heno, Alfalfa, Fortemiles..."/>
        </div>

        <div className="field">
          <label>Actualizar inventario (opcional)</label>
          <select value={form.stockId} onChange={e => {
            const s = state.stock.find(x => x.id === e.target.value);
            set('stockId', e.target.value);
            if (s) { set('item', s.name); set('unit', s.unit); }
            setBultos(''); setKgPorBulto('');
          }}>
            <option value="">— no actualizar bodega —</option>
            {state.stock.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {isBultosMode ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Número de bultos</label>
                <input type="number" value={bultos} onChange={e => setBultos(e.target.value)} placeholder="0"/>
              </div>
              <div className="field">
                <label>Kg por bulto</label>
                <input type="number" step="0.1" value={kgPorBulto} onChange={e => setKgPorBulto(e.target.value)} placeholder="0"/>
              </div>
            </div>
            {bultos && kgPorBulto && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--bg-2)', marginBottom: 4, fontSize: 13, color: 'var(--ink-2)' }}>
                Total: <strong>{totalKg.toLocaleString('es-CO')} kg</strong>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Cantidad</label>
              <input type="number" value={form.qty} onChange={e => set('qty', e.target.value)} placeholder="0"/>
            </div>
            <div className="field">
              <label>Unidad</label>
              <select value={form.unit} onChange={e => { set('unit', e.target.value); setBultos(''); setKgPorBulto(''); }}>
                <option value="pacas">pacas</option>
                <option value="kg">kg (bultos)</option>
                <option value="frascos">frascos</option>
                <option value="ampollas">ampollas</option>
                <option value="sobres">sobres</option>
                <option value="dosis">dosis</option>
                <option value="litros">litros</option>
              </select>
            </div>
          </div>
        )}

        <div className="field">
          <label>Precio total ($)</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0"/>
        </div>

        <div className="field">
          <label>Proveedor</label>
          <input value={form.supplier} onChange={e => set('supplier', e.target.value)} placeholder="Nombre del proveedor"/>
        </div>

        <button className="btn-primary" onClick={save}>Registrar compra</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
