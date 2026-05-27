import { useState } from 'react';
import { useStore, fmtDate, fmtMoney, TODAY } from '../data/store';
import { Card, SectionHead, FeedIcon } from '../components/Shared';
import { IconPlus, IconArrowDown } from '../components/Icons';

export default function ScreenBodega({ go }) {
  const { state } = useStore();
  const { stock, vitamins, purchases } = state;
  const [tab, setTab] = useState('stock');

  const lowItems = stock.filter(s => s.stock > 0 && s.stock / s.capacity < 0.3).length;
  const stockWithUse = stock.filter(s => s.dailyUse > 0);
  const minDays = stockWithUse.length > 0
    ? Math.min(...stockWithUse.map(s => Math.floor(s.stock / s.dailyUse)))
    : null;

  return (
    <div style={{ paddingBottom: 112 }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Inventario</div>
            <h1 className="serif" style={{ margin: '4px 0 0', fontSize: 38, letterSpacing: '-0.01em' }}>Bodega</h1>
          </div>
          <div className="tap" onClick={() => go({ modal: 'addPurchase' })} style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--ink)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconPlus size={20} sw={2}/>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '4px 20px 16px' }}>
        <Card padding={20} style={{ background: 'var(--ink)', color: 'var(--bg)' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Estado del criadero</div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 6 }}>
            <span className="serif tnum" style={{ fontSize: 56, lineHeight: 1, letterSpacing: '-0.02em', color: minDays !== null && minDays < 10 ? '#e8a394' : 'var(--bg)' }}>{minDays ?? '—'}</span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginLeft: 8 }}>{minDays !== null ? 'días al alimento más bajo' : 'registra consumo diario'}</span>
          </div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Stat label="Alimentos" value={`${stock.length} tipos`}/>
            <Stat label="Bajos" value={lowItems} color={lowItems ? '#e8a394' : undefined}/>
            <Stat label="Vitaminas" value={`${vitamins.length} productos`}/>
          </div>
        </Card>
      </div>

      {/* Tab pills */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[{ id: 'stock', label: 'Alimento' }, { id: 'vitaminas', label: 'Vitaminas' }, { id: 'compras', label: 'Compras' }, { id: 'consumo', label: 'Consumo' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className="tap" style={{
            all: 'unset', whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: 999,
            fontSize: 13, fontWeight: 500,
            background: tab === t.id ? 'var(--ink)' : 'transparent',
            color: tab === t.id ? 'var(--bg)' : 'var(--ink-2)',
            border: tab === t.id ? 'none' : '0.5px solid var(--hair-strong)',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'stock'     && <BodegaStock go={go}/>}
      {tab === 'vitaminas' && <BodegaVitamins go={go}/>}
      {tab === 'compras'   && <BodegaCompras/>}
      {tab === 'consumo'   && <BodegaConsumo/>}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div className="tnum" style={{ fontSize: 17, marginTop: 3, color: color || 'var(--bg)' }}>{value}</div>
    </div>
  );
}

function BodegaStock({ go }) {
  const { state } = useStore();
  return (
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {state.stock.map(s => {
        const pct = s.capacity > 0 ? s.stock / s.capacity : 0;
        const daysLeft = s.dailyUse > 0 ? Math.floor(s.stock / s.dailyUse) : null;
        const endDate = daysLeft !== null ? new Date(TODAY.getTime() + daysLeft * 86400000) : null;
        const low = s.stock > 0 && pct < 0.3;
        const stockFmt = Number.isInteger(s.stock) ? s.stock.toLocaleString('es-CO') : s.stock.toLocaleString('es-CO', { maximumFractionDigits: 1 });
        const useFmt = Number.isInteger(s.dailyUse) ? s.dailyUse : s.dailyUse.toFixed(1);
        return (
          <Card key={s.id} padding={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FeedIcon kind={s.kind} size={22}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {s.lastEntry ? `Última entrada · ${fmtDate(s.lastEntry.date, { day: 'numeric', month: 'short' })} · ${s.lastEntry.qty} ${s.unit}` : 'Sin entradas aún'}
                </div>
              </div>
              {low && <span className="chip chip-terra"><span className="dot"/>Bajo</span>}
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <span className="serif tnum" style={{ fontSize: 32, letterSpacing: '-0.01em' }}>{stockFmt}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>/ {s.capacity.toLocaleString('es-CO')} {s.unit}</div>
              </div>
              <div className="bar" style={{ marginTop: 10 }}>
                <i style={{ width: `${pct * 100}%`, background: low ? 'var(--terra)' : 'var(--ink)' }}/>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '0.5px solid var(--hair)' }}>
              <InfoCell label="Consumo" value={`${useFmt} ${s.unit}/día`}/>
              <InfoCell label="Restan" value={daysLeft !== null ? `${daysLeft} días` : '—'} color={daysLeft !== null && low ? 'var(--terra)' : undefined}/>
              <InfoCell label="Se acaba" value={endDate ? fmtDate(endDate, { day: 'numeric', month: 'short' }) : '—'}/>
            </div>

            <button className="tap" onClick={() => go({ modal: 'editStock', stockId: s.id })} style={{
              all: 'unset', marginTop: 14, padding: '10px', borderRadius: 10,
              border: '0.5px solid var(--hair-strong)', textAlign: 'center',
              width: '100%', boxSizing: 'border-box', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)',
              display: 'block',
            }}>
              Actualizar cantidad
            </button>
          </Card>
        );
      })}
    </div>
  );
}

function InfoCell({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div className="tnum" style={{ fontSize: 15, fontWeight: 500, marginTop: 3, color: color || 'var(--ink)' }}>{value}</div>
    </div>
  );
}

function BodegaVitamins({ go }) {
  const { state } = useStore();
  return (
    <div style={{ padding: '0 20px' }}>
      <Card padding={0}>
        {state.vitamins.map((v, i) => {
          const low = v.qty <= v.low;
          return (
            <div key={v.id} className="tap" onClick={() => go({ modal: 'editVitamin', vitaminId: v.id })}
                 style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: i ? '0.5px solid var(--hair)' : 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: low ? 'var(--terra-soft)' : 'var(--bg-2)', color: low ? '#7a2c1d' : 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif, Georgia, serif', fontSize: 18 }}>
                {v.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{v.name}</span>
                  {low && <span className="chip chip-terra" style={{ fontSize: 10, padding: '2px 7px' }}><span className="dot"/>Bajo</span>}
                </div>
                {v.note && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.note}</div>}
              </div>
              <div style={{ textAlign: 'right', minWidth: 70 }}>
                <div className="tnum" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1, color: low ? 'var(--terra)' : 'var(--ink)' }}>{v.qty}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{v.unit}</div>
              </div>
            </div>
          );
        })}
      </Card>
      <button className="tap" onClick={() => go({ modal: 'addVitamin' })} style={{
        all: 'unset', marginTop: 14, padding: '14px', width: '100%', boxSizing: 'border-box',
        borderRadius: 14, background: 'var(--card)', color: 'var(--ink)',
        textAlign: 'center', fontWeight: 500, fontSize: 14,
        border: '0.5px dashed var(--hair-strong)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <IconPlus size={16} sw={2}/> Añadir producto veterinario
      </button>
      <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 12, background: 'rgba(24,21,19,0.03)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>
        Toca un producto para actualizar su cantidad disponible.
      </div>
    </div>
  );
}

function BodegaCompras() {
  const { state } = useStore();
  const grouped = {};
  state.purchases.forEach(p => {
    const month = fmtDate(p.date, { month: 'long', year: 'numeric' });
    grouped[month] = grouped[month] || [];
    grouped[month].push(p);
  });

  return (
    <div style={{ padding: '0 20px' }}>
      {Object.entries(grouped).map(([month, items]) => {
        const total = items.reduce((s, x) => s + Number(x.price), 0);
        return (
          <div key={month} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 8px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{month}</div>
              <div className="tnum" style={{ fontSize: 13, color: 'var(--muted)' }}>{fmtMoney(total)}</div>
            </div>
            <Card padding={0}>
              {items.map((p, i) => (
                <div key={p.id} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: i ? '0.5px solid var(--hair)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconArrowDown size={18}/>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{p.item}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{p.supplier} · {fmtDate(p.date)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="tnum" style={{ fontSize: 15, fontWeight: 500 }}>{fmtMoney(p.price)}</div>
                    <div className="tnum" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{Number(p.qty).toLocaleString('es-CO')} {p.unit}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        );
      })}
      {state.purchases.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>Sin compras registradas</div>
      )}
    </div>
  );
}

const FEED_COLORS = { heno: 'var(--amber)', alfalfa: 'var(--sage)', pellet: 'var(--terra)' };

function weekOfMonth(dayNum) {
  if (dayNum <= 7)  return 0;
  if (dayNum <= 14) return 1;
  if (dayNum <= 21) return 2;
  return 3;
}

function BodegaConsumo() {
  const { state } = useStore();

  function localDateStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function timeFmt(iso) {
    return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  const log = [...(state.consumptionLog || [])].sort((a, b) => b.datetime.localeCompare(a.datetime));
  const todayStr = localDateStr(TODAY);
  const yest = new Date(TODAY); yest.setDate(yest.getDate() - 1);
  const yestStr = localDateStr(yest);
  const currentMonth = todayStr.slice(0, 7);
  const monthName = TODAY.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();

  // Week day ranges (arrays of day numbers)
  const weekDayNums = [
    [1,2,3,4,5,6,7],
    [8,9,10,11,12,13,14],
    [15,16,17,18,19,20,21],
    Array.from({ length: daysInMonth - 21 }, (_, i) => i + 22),
  ];
  const weekRangeLabels = ['1–7', '8–14', '15–21', `22–${daysInMonth}`];

  // Default to current week
  const [selectedWeek, setSelectedWeek] = useState(weekOfMonth(TODAY.getDate()));

  // Group entries by local date
  const byDay = {};
  log.forEach(e => {
    const day = localDateStr(new Date(e.datetime));
    if (!byDay[day]) byDay[day] = { total: 0, entries: [] };
    byDay[day].total += e.kg;
    byDay[day].entries.push(e);
  });

  // Weekly totals for strip
  const weeklyTotal = weekDayNums.map(days =>
    days.reduce((sum, d) => sum + (byDay[`${currentMonth}-${String(d).padStart(2,'0')}`]?.total || 0), 0)
  );
  const weekHasData = weeklyTotal.map(t => t > 0);

  // Days of selected week as date strings
  const selectedDayStrs = weekDayNums[selectedWeek].map(d =>
    `${currentMonth}-${String(d).padStart(2,'0')}`
  );
  // Day-number labels for chart x-axis
  const chartDayLabels = weekDayNums[selectedWeek].map(String);

  // Per stock item, daily consumption for selected week (one value per day)
  const dailyByItem = {};
  state.stock.forEach(s => {
    dailyByItem[s.id] = selectedDayStrs.map(dateStr =>
      (byDay[dateStr]?.entries || [])
        .filter(e => e.stockId === s.id)
        .reduce((sum, e) => sum + e.kg, 0)
    );
  });

  // Log entries: days of selected week that have data, most recent first
  const displayDays = selectedDayStrs.filter(d => byDay[d]).sort((a, b) => b.localeCompare(a));

  function dayLabel(d) {
    if (d === todayStr) return 'Hoy';
    if (d === yestStr) return 'Ayer';
    return fmtDate(d, { weekday: 'long', day: 'numeric', month: 'short' });
  }

  return (
    <div style={{ padding: '0 20px' }}>

      {/* Month label */}
      <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize', marginBottom: 12, paddingLeft: 2 }}>
        {monthName}
      </div>

      {/* 4-week strip */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[0,1,2,3].map(wi => {
          const active = selectedWeek === wi;
          const hasFed = weekHasData[wi];
          return (
            <div key={wi} className="tap" onClick={() => setSelectedWeek(wi)}
              style={{
                flex: 1, borderRadius: 14, padding: '10px 4px', textAlign: 'center',
                background: active ? 'var(--ink)' : hasFed ? 'var(--card)' : 'var(--bg-2)',
                border: active ? 'none' : `0.5px solid ${hasFed ? 'var(--hair-strong)' : 'transparent'}`,
              }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3,
                color: active ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>Sem</div>
              <div className="tnum" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1,
                color: active ? 'var(--bg)' : 'var(--ink)' }}>{wi + 1}</div>
              <div style={{ fontSize: 9, marginTop: 2,
                color: active ? 'rgba(255,255,255,0.35)' : 'var(--muted)' }}>{weekRangeLabels[wi]}</div>
              <div style={{ marginTop: 6, minHeight: 14 }}>
                {hasFed ? (
                  <div style={{ fontSize: 10, fontWeight: 500,
                    color: active ? 'rgba(255,255,255,0.65)' : 'var(--sage)' }}>
                    {weeklyTotal[wi] >= 1000 ? `${(weeklyTotal[wi]/1000).toFixed(1)}t` : `${Math.round(weeklyTotal[wi])}kg`}
                  </div>
                ) : (
                  <div style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--terra)', margin: '4px auto', opacity: 0.5 }}/>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 charts — daily breakdown of selected week */}
      {state.stock.map(s => {
        const data = dailyByItem[s.id] || [];
        const max = Math.max(...data, 1);
        const color = FEED_COLORS[s.kind] || 'var(--ink)';
        const total = data.reduce((a, b) => a + b, 0);
        return (
          <Card key={s.id} padding={16} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
              </div>
              <span className="tnum" style={{ fontSize: 11, color: 'var(--muted)' }}>
                {total > 0 ? `${total.toLocaleString('es-CO')} ${s.unit} esta sem.` : 'sin datos'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
              {data.map((v, i) => {
                const isToday = selectedDayStrs[i] === todayStr;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: '100%',
                      height: Math.max(3, (v / max) * 42),
                      borderRadius: 4,
                      background: color,
                      opacity: v > 0 ? (isToday ? 1 : 0.7) : 0.12,
                    }}/>
                    <span style={{ fontSize: 9, fontWeight: isToday ? 700 : 400,
                      color: isToday ? 'var(--ink)' : 'var(--muted)' }}>
                      {chartDayLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      {/* Registro de comidas */}
      <div style={{ padding: '12px 4px 10px' }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>
          Registro de comidas · Semana {selectedWeek + 1}
        </span>
      </div>
      {displayDays.length === 0 ? (
        <Card padding={20} style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Sin registros en esta semana
          </div>
        </Card>
      ) : (
        displayDays.map(day => (
          <div key={day} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 6px' }}>
              <div style={{ fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{dayLabel(day)}</div>
              <div className="tnum" style={{ fontSize: 12, color: 'var(--muted)' }}>{byDay[day].total.toLocaleString('es-CO')} kg</div>
            </div>
            <Card padding={0}>
              {byDay[day].entries.map((e, i) => (
                <div key={e.id} style={{ padding: '12px 16px', borderTop: i ? '0.5px solid var(--hair)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="tnum" style={{ fontSize: 13, color: 'var(--muted)', minWidth: 42 }}>{timeFmt(e.datetime)}</div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{e.itemName}</div>
                  <div className="tnum" style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                    {Number(e.kg).toLocaleString('es-CO')} {state.stock.find(s => s.id === e.stockId)?.unit || 'kg'}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
