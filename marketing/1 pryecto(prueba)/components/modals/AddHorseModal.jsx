import { useState } from 'react';
import { useStore } from '../../data/store';

const TILES = { mare: 'mare', stallion: 'stallion', foal: 'foal', gelding: 'stallion' };
const STATUS_BY_SEX = {
  mare:    ['vacía', 'preñada', 'celo', 'inseminada', 'lactando'],
  stallion:['reproductor'],
  foal:    ['cría'],
  gelding: ['trabajo'],
};

export default function AddHorseModal({ onClose, initialData }) {
  const { dispatch, state } = useStore();
  const editing = !!initialData;

  const [form, setForm] = useState(initialData || {
    name: '', sex: 'mare', birthDate: '', breed: '', color: '',
    status: 'vacía', notes: '',
    gestMonth: '', expectedFoaling: '', lastService: '', sire: '',
    nextHeat: '', confirmDate: '', foalingDate: '',
    heatDayOfCycle: '', motherId: '', covers: '',
  });

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function save() {
    if (!form.name.trim()) return;
    const tile = TILES[form.sex] || 'mare';
    const statusMap = { 'preñada': 'mare-preg', 'celo': 'mare-heat' };
    const finalTile = statusMap[form.status] || tile;

    const horse = {
      ...form,
      tile: finalTile,
      birthDate: form.birthDate || '',
      gestMonth: form.gestMonth ? Number(form.gestMonth) : undefined,
      covers: form.covers ? Number(form.covers) : undefined,
      heatDayOfCycle: form.heatDayOfCycle ? Number(form.heatDayOfCycle) : undefined,
    };

    if (editing) {
      dispatch({ type: 'UPDATE_HORSE', horse: { ...horse, id: initialData.id } });
    } else {
      dispatch({ type: 'ADD_HORSE', horse });
    }
    onClose();
  }

  const statusOptions = STATUS_BY_SEX[form.sex] || ['vacía'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>
        <p className="modal-title">{editing ? 'Editar caballo' : 'Nuevo caballo'}</p>

        <div className="field">
          <label>Nombre</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre del animal"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Sexo</label>
            <select value={form.sex} onChange={e => { set('sex', e.target.value); set('status', STATUS_BY_SEX[e.target.value]?.[0] || 'vacía'); }}>
              <option value="mare">Yegua</option>
              <option value="stallion">Padrillo</option>
              <option value="gelding">Castrado</option>
              <option value="foal">Cría</option>
            </select>
          </div>
          <div className="field">
            <label>Fecha de nacimiento</label>
            <input type="date" value={form.birthDate} onChange={e => set('birthDate', e.target.value)}/>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Raza</label>
            <input value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="Pura Sangre"/>
          </div>
          <div className="field">
            <label>Color</label>
            <input value={form.color} onChange={e => set('color', e.target.value)} placeholder="Alazana"/>
          </div>
        </div>

        <div className="field">
          <label>Estado</label>
          <select value={form.status} onChange={e => set('status', e.target.value)}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {form.status === 'preñada' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Mes gestación (1-11)</label>
              <input type="number" min="1" max="11" value={form.gestMonth} onChange={e => set('gestMonth', e.target.value)}/>
            </div>
            <div className="field">
              <label>Parto esperado</label>
              <input type="date" value={form.expectedFoaling} onChange={e => set('expectedFoaling', e.target.value)}/>
            </div>
            <div className="field">
              <label>Última monta</label>
              <input type="date" value={form.lastService} onChange={e => set('lastService', e.target.value)}/>
            </div>
            <div className="field">
              <label>Padrillo</label>
              <select value={form.sire} onChange={e => set('sire', e.target.value)}>
                <option value="">— seleccionar —</option>
                {state.horses.filter(h => h.sex === 'stallion').map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {form.status === 'celo' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Día del ciclo</label>
              <input type="number" min="1" max="21" value={form.heatDayOfCycle} onChange={e => set('heatDayOfCycle', e.target.value)}/>
            </div>
            <div className="field">
              <label>Próximo celo</label>
              <input type="date" value={form.nextHeat} onChange={e => set('nextHeat', e.target.value)}/>
            </div>
          </div>
        )}

        {form.status === 'inseminada' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label>Fecha servicio</label>
              <input type="date" value={form.lastService} onChange={e => set('lastService', e.target.value)}/>
            </div>
            <div className="field">
              <label>Fecha confirmar</label>
              <input type="date" value={form.confirmDate} onChange={e => set('confirmDate', e.target.value)}/>
            </div>
          </div>
        )}

        {form.status === 'lactando' && (
          <div className="field">
            <label>Fecha de parto</label>
            <input type="date" value={form.foalingDate} onChange={e => set('foalingDate', e.target.value)}/>
          </div>
        )}

        {form.status === 'vacía' && (
          <div className="field">
            <label>Próximo celo estimado</label>
            <input type="date" value={form.nextHeat} onChange={e => set('nextHeat', e.target.value)}/>
          </div>
        )}

        {form.sex === 'stallion' && (
          <div className="field">
            <label>Montas esta temporada</label>
            <input type="number" value={form.covers} onChange={e => set('covers', e.target.value)} placeholder="0"/>
          </div>
        )}

        {form.sex === 'foal' && (
          <div className="field">
            <label>Madre</label>
            <select value={form.motherId} onChange={e => set('motherId', e.target.value)}>
              <option value="">— seleccionar —</option>
              {state.horses.filter(h => h.sex === 'mare').map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
        )}

        <div className="field">
          <label>Notas</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observaciones..."/>
        </div>

        <button className="btn-primary" onClick={save}>{editing ? 'Guardar cambios' : 'Agregar caballo'}</button>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
