import { useState } from 'react';
import { useStore, daysBetween, fmtDate, TODAY } from '../data/store';
import { Card, SectionHead, HorseAvatar } from '../components/Shared';
import { IconBack, IconChev, IconPlus, IconTrash } from '../components/Icons';

export default function ScreenCalendar({ go }) {
  const { state, dispatch } = useStore();
  const [viewDate, setViewDate] = useState({ month: TODAY.getMonth(), year: TODAY.getFullYear() });

  const { month, year } = viewDate;
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = new Date(year, month, 1).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });

  const eventsByDay = {};
  state.events.forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      eventsByDay[day] = eventsByDay[day] || [];
      eventsByDay[day].push(e);
    }
  });

  const upcoming = [...state.events]
    .map(e => ({ ...e, daysLeft: daysBetween(TODAY, e.date) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const todayDate = TODAY.getDate();
  const isCurrentMonth = TODAY.getMonth() === month && TODAY.getFullYear() === year;

  function prevMonth() {
    setViewDate(v => {
      if (v.month === 0) return { month: 11, year: v.year - 1 };
      return { ...v, month: v.month - 1 };
    });
  }
  function nextMonth() {
    setViewDate(v => {
      if (v.month === 11) return { month: 0, year: v.year + 1 };
      return { ...v, month: v.month + 1 };
    });
  }

  return (
    <div style={{ paddingBottom: 112 }}>
      <div style={{ padding: '64px 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Calendario</div>
            <h1 className="serif" style={{ margin: '4px 0 0', fontSize: 38, letterSpacing: '-0.01em', textTransform: 'capitalize' }}>{monthName}</h1>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div className="tap" onClick={prevMonth} style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid var(--hair-strong)' }}>
              <IconBack size={16}/>
            </div>
            <div className="tap" onClick={nextMonth} style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid var(--hair-strong)' }}>
              <IconChev size={16}/>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div style={{ padding: '0 20px' }}>
        <Card padding={14}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
            {['L','M','M','J','V','S','D'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase' }}>{d}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={'e' + i}/>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const evs = eventsByDay[day] || [];
              const isToday = isCurrentMonth && day === todayDate;
              return (
                <div key={day} style={{
                  aspectRatio: '1 / 1.05', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                  paddingTop: 6, borderRadius: 10,
                  background: isToday ? 'var(--ink)' : 'transparent',
                  color: isToday ? 'var(--bg)' : 'var(--ink)',
                  cursor: 'pointer',
                }}>
                  <span className="tnum" style={{ fontSize: 13, fontWeight: isToday ? 600 : 400 }}>{day}</span>
                  <div style={{ display: 'flex', gap: 2, marginTop: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {evs.map(e => (
                      <div key={e.id} style={{ width: 5, height: 5, borderRadius: 999, background: e.kind === 'parto' ? 'var(--sage)' : e.kind === 'celo' ? 'var(--amber)' : 'var(--terra)' }}/>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--hair)', fontSize: 11 }}>
            <LegendDot color="var(--amber)" label="Celo"/>
            <LegendDot color="var(--terra)" label="Confirmar"/>
            <LegendDot color="var(--sage)" label="Parto"/>
          </div>
        </Card>
      </div>

      {/* Add event */}
      <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="tap" onClick={() => go({ modal: 'addEvent' })} style={{
          all: 'unset', padding: '8px 16px', borderRadius: 999,
          background: 'var(--ink)', color: 'var(--bg)',
          fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <IconPlus size={14} sw={2}/> Nuevo evento
        </button>
      </div>

      {/* Upcoming events list */}
      <SectionHead title="Próximos eventos" action={null}/>
      <div style={{ padding: '0 20px' }}>
        {upcoming.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>Sin eventos próximos</div>
        )}
        {upcoming.map((e) => {
          const horse = state.horses.find(h => h.name === e.horse);
          const tone = e.kind === 'parto' ? { bg: 'var(--sage-soft)', fg: '#364028', dot: 'var(--sage)' }
                    : e.kind === 'celo'   ? { bg: 'var(--amber-soft)', fg: '#6e4d12', dot: 'var(--amber)' }
                    : { bg: 'var(--terra-soft)', fg: '#7a2c1d', dot: 'var(--terra)' };
          return (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <Card padding={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'center', width: 48, padding: '4px 0', borderRadius: 10, background: tone.bg, color: tone.fg }}>
                    <div className="tnum" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{new Date(e.date).getDate()}</div>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', marginTop: 2, letterSpacing: '0.08em' }}>
                      {fmtDate(e.date, { month: 'short' }).replace('.', '')}
                    </div>
                  </div>
                  {horse && <HorseAvatar horse={horse} size={40} radius={11}/>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: tone.dot, flexShrink: 0, display: 'inline-block' }}/>
                      <span style={{ fontSize: 14.5, fontWeight: 500 }}>{e.title}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>{e.horse} {e.note && `· ${e.note}`}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {e.daysLeft === 0 ? 'Hoy' : e.daysLeft === 1 ? 'Mañana' : `en ${e.daysLeft}d`}
                    </div>
                    <div className="tap" onClick={() => dispatch({ type: 'DELETE_EVENT', id: e.id })}
                         style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--terra-soft)', color: 'var(--terra)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconTrash size={13}/>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--ink-2)' }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: color, display: 'inline-block' }}/>{label}
    </span>
  );
}
