import { useState } from 'react';
import { useStore } from '../../data/store';

export default function EditStockModal({ stockId, onClose }) {
  const { state, dispatch } = useStore();
  const item = state.stock.find(s => s.id === stockId);
  const [qty, setQty] = useState(item ? String(item.stock) : '');
  const [dailyUse, setDailyUse] = useState(item ? String(item.dailyUse) : '');
  const [bultos, setBultos] = useState('');
  const [kgPorBulto, setKgPorBulto] = useState('');

  if (!item) return null;

  const isBultosMode = item.unit === 'kg';
  const totalKg = isBultosMode && bultos && kgPorBulto ? Number(bultos) * Number(kgPorBulto) : 0;
  const finalQty = isBultosMode ? totalKg : Number(qty);
  const daysPreview = dailyUse && Number(dailyUse) > 0 && finalQty > 0
    ? Math.floor(finalQty / Number(dailyUse))
    : null;

  function save() {
    dispatch({
      type: 'UPDATE_STOCK',
      id: stockId,
      updates: { stock: finalQty, dailyUse: Number(dailyUse) },
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">{item.name}</p>

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
          <div className="field">
            <label>Cantidad actual ({item.unit})</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="0"/>
          </div>
        )}

        <div className="field">
          <label>Consumo diario ({item.unit}/día)</label>
          <input type="number" step="0.1" value={dailyUse} onChange={e => setDailyUse(e.target.value)} placeholder="0"/>
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--bg-2)', marginBottom: 16, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Capacidad máxima: <strong>{item.capacity} {item.unit}</strong>
          <br/>Días restantes con esta cantidad: <strong>{daysPreview ?? '—'}</strong>
        </div>

        <button className="btn-primary" onClick={save}>Actualizar</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
