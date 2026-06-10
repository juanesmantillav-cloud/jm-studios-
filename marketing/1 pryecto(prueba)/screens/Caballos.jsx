import { useState } from 'react';
import { useStore, daysBetween, fmtDate, ageInMonths, TODAY } from '../data/store';
import { Card, StatusChip, HorseAvatar, Search } from '../components/Shared';
import { GestRing } from './Home';
import { IconPlus, IconHeart } from '../components/Icons';

export default function ScreenCaballos({ go }) {
  const { state } = useStore();
  const { horses } = state;
  const [filter, setFilter] = useState('todos');
  const [query, setQuery] = useState('');

  const filters = [
    { id: 'todos',      label: 'Todos',    count: horses.length },
    { id: 'preñadas',   label: 'Preñadas', count: horses.filter(h => h.status === 'preñada').length },
    { id: 'celo',       label: 'En celo',  count: horses.filter(h => h.status === 'celo' || h.status === 'inseminada').length },
    { id: 'lactando',   label: 'Lactando', count: horses.filter(h => h.status === 'lactando').length },
    { id: 'padrillos',  label: 'Padrillos',count: horses.filter(h => h.sex === 'stallion').length },
    { id: 'crías',      label: 'Crías',    count: horses.filter(h => h.sex === 'foal').length },
    { id: 'trabajo',    label: 'Trabajo',  count: horses.filter(h => h.status === 'trabajo').length },
  ];

  const visible = horses.filter(h => {
    const matchFilter =
      filter === 'todos'     ? true :
      filter === 'preñadas'  ? h.status === 'preñada' :
      filter === 'celo'      ? (h.status === 'celo' || h.status === 'inseminada') :
      filter === 'lactando'  ? h.status === 'lactando' :
      filter === 'padrillos' ? h.sex === 'stallion' :
      filter === 'crías'     ? h.sex === 'foal' :
      filter === 'trabajo'   ? h.status === 'trabajo' : true;

    const matchQuery = !query || h.name.toLowerCase().includes(query.toLowerCase()) || (h.breed && h.breed.toLowerCase().includes(query.toLowerCase()));
    return matchFilter && matchQuery;
  });

  return (
    <div style={{ paddingBottom: 112 }}>
      <div style={{ padding: '64px 20px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Caballeriza</div>
            <h1 className="serif" style={{ margin: '4px 0 0', fontSize: 38, letterSpacing: '-0.01em' }}>{horses.length} caballos</h1>
          </div>
          <div className="tap" onClick={() => go({ modal: 'addHorse' })} style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPlus size={20} sw={2}/>
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 0 14px' }}>
        <Search value={query} onChange={setQuery} placeholder="Buscar por nombre, raza..."/>
      </div>

      <div style={{ overflow: 'auto', padding: '0 20px 16px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 6, paddingRight: 20 }}>
          {filters.map(f => {
            const active = filter === f.id;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)} className="tap" style={{
                all: 'unset', whiteSpace: 'nowrap', padding: '8px 12px', borderRadius: 999,
                fontSize: 13, fontWeight: 500,
                background: active ? 'var(--ink)' : 'transparent',
                color: active ? 'var(--bg)' : 'var(--ink-2)',
                border: active ? 'none' : '0.5px solid var(--hair-strong)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {f.label}
                <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.18)' : 'rgba(24,21,19,0.06)' }}>{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visible.map(h => <HorseRow key={h.id} horse={h} horses={horses} onClick={() => go({ horseId: h.id })}/>)}
        {visible.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>Sin resultados</div>
        )}
      </div>
    </div>
  );
}

export function HorseRow({ horse, horses, onClick }) {
  let sub;
  if (horse.status === 'preñada')       sub = `Mes ${horse.gestMonth} · parto ${fmtDate(horse.expectedFoaling)}`;
  else if (horse.status === 'lactando') sub = `Lactando · cría ${daysBetween(horse.foalingDate, TODAY)}d`;
  else if (horse.status === 'celo')     sub = `Día ${horse.heatDayOfCycle} del ciclo`;
  else if (horse.status === 'inseminada') sub = `Confirmar ${fmtDate(horse.confirmDate)}`;
  else if (horse.status === 'vacía' && horse.nextHeat) sub = `Próximo celo ${fmtDate(horse.nextHeat)}`;
  else if (horse.status === 'reproductor') sub = `Padrillo · ${horse.covers || 0} montas`;
  else if (horse.status === 'cría') {
    const m = horses ? horses.find(x => x.id === horse.motherId) : null;
    sub = `Cría de ${m ? m.name : '—'}`;
  }
  else sub = `${horse.breed} · ${ageInMonths(horse.birthDate)} meses`;

  return (
    <Card padding={14} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <HorseAvatar horse={horse} size={52} radius={14}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{horse.name}</span>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>· {ageInMonths(horse.birthDate)}m</span>
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
          <div style={{ marginTop: 8 }}><StatusChip status={horse.status}/></div>
        </div>
        {horse.status === 'preñada' && <GestRing month={horse.gestMonth} size={42}/>}
        {horse.status === 'celo' && (
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--amber-soft)', color: '#6e4d12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconHeart size={20}/>
          </div>
        )}
      </div>
    </Card>
  );
}
