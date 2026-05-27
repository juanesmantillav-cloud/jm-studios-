import { useStore, daysBetween, fmtDate, TODAY } from '../data/store';
import { Card, KPI, Sparkline, SectionHead, HorseAvatar } from '../components/Shared';
import { FeedIcon } from '../components/Shared';
import { IconBell, IconChev, IconPlus } from '../components/Icons';

function GestRing({ month, size = 36 }) {
  const r = (size - 4) / 2;
  const C = 2 * Math.PI * r;
  const pct = Math.min(1, month / 11);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(24,21,19,0.08)" strokeWidth="3" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--sage)" strokeWidth="3" fill="none"
                strokeDasharray={`${C * pct} ${C}`} strokeLinecap="round"/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{month}</div>
    </div>
  );
}

export { GestRing };

export default function ScreenHome({ go }) {
  const { state, dispatch } = useStore();
  const { horses, stock, events, consumption14 } = state;

  const upcomingFoaling = horses
    .filter(h => h.status === 'preñada' && h.expectedFoaling)
    .map(h => ({ ...h, daysLeft: daysBetween(TODAY, h.expectedFoaling) }))
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const stockWithUse = stock.filter(s => s.dailyUse > 0);
  const minDays = stockWithUse.length > 0 ? Math.min(...stockWithUse.map(s => Math.floor(s.stock / s.dailyUse))) : null;
  const minDaysItem = minDays !== null ? stock.find(s => s.dailyUse > 0 && Math.floor(s.stock / s.dailyUse) === minDays) : null;
  const upcomingEvents = [...events]
    .map(e => ({ ...e, daysLeft: daysBetween(TODAY, e.date) }))
    .filter(e => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  const mares = horses.filter(h => h.sex === 'mare').length;
  const pregnant = horses.filter(h => h.status === 'preñada').length;
  const lactating = horses.filter(h => h.status === 'lactando').length;

  const todayStr = TODAY.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div style={{ paddingBottom: 112 }}>
      {/* Header */}
      <div style={{ padding: '64px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {todayStr}
          </div>
          <h1 className="serif" style={{ margin: '4px 0 0', fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            Buenos días,<br/><span className="serif-i">{state.userName}</span>
          </h1>
        </div>
        <div style={{ position: 'relative' }}>
          <div className="tap" style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
            <IconBell size={20}/>
          </div>
          {upcomingEvents.length > 0 && (
            <div style={{ position: 'absolute', top: 6, right: 7, width: 9, height: 9, borderRadius: 999, background: 'var(--terra)', border: '1.5px solid var(--bg)' }}/>
          )}
        </div>
      </div>

      {/* Alert: parto próximo */}
      {upcomingFoaling.length > 0 && (
        <div style={{ padding: '12px 20px 0' }}>
          <Card style={{ background: 'var(--ink)', color: 'var(--bg)', padding: 18, display: 'flex', alignItems: 'center', gap: 14, borderRadius: 22, position: 'relative', overflow: 'hidden' }}
                onClick={() => go({ tab: 'caballos', horseId: upcomingFoaling[0].id })}>
            <HorseAvatar horse={upcomingFoaling[0]} size={52} radius={14}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Parto esperado</div>
              <div style={{ fontSize: 17, fontWeight: 500, marginTop: 2 }}>{upcomingFoaling[0].name} · en {upcomingFoaling[0].daysLeft} días</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>
                {fmtDate(upcomingFoaling[0].expectedFoaling, { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <IconChev size={20}/>
          </Card>
        </div>
      )}

      {/* Bodega summary */}
      <SectionHead title="Bodega" action="Ver todo" onAction={() => go({ tab: 'bodega' })}/>
      <div style={{ padding: '0 20px', marginTop: -4 }}>
        {minDays !== null && (
          <Card padding={18} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <KPI value={minDays} unit="días" label="Más bajo"
                   sub={minDaysItem ? `${minDaysItem.name} · queda ${minDays} días` : ''}
                   color={minDays < 10 ? 'var(--terra)' : 'var(--ink)'}/>
              <div style={{ width: 110 }}>
                <Sparkline data={consumption14} width={110} height={36}/>
                <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'right', marginTop: 2 }}>14 días</div>
              </div>
            </div>
          </Card>
        )}

        <Card padding={0}>
          {stock.map((s, i) => {
            const pct = s.capacity > 0 ? s.stock / s.capacity : 0;
            const daysLeft = s.dailyUse > 0 ? Math.floor(s.stock / s.dailyUse) : null;
            const low = pct > 0 && pct < 0.3;
            const stockFmt = Number.isInteger(s.stock) ? s.stock.toLocaleString('es-CO') : s.stock.toLocaleString('es-CO', { maximumFractionDigits: 1 });
            return (
              <div key={s.id} className="tap" onClick={() => go({ tab: 'bodega' })}
                   style={{ padding: '14px 16px', borderTop: i ? '0.5px solid var(--hair)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-2)', color: 'var(--ink-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FeedIcon kind={s.kind} size={20}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>{s.name}</span>
                    <span className="tnum" style={{ fontSize: 14, color: low ? 'var(--terra)' : 'var(--ink-2)' }}>
                      {stockFmt} {s.unit}
                    </span>
                  </div>
                  <div className="bar" style={{ marginTop: 7 }}>
                    <i style={{ width: `${Math.min(100, pct * 100)}%`, background: low ? 'var(--terra)' : 'var(--ink)' }}/>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>
                    {daysLeft !== null
                      ? `${daysLeft} días · se acaba ${fmtDate(new Date(TODAY.getTime() + daysLeft * 86400000))}`
                      : 'Actualiza el consumo diario en Bodega'}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '16px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button className="tap" onClick={() => go({ modal: 'logConsumption' })} style={{
          all: 'unset', textAlign: 'center', padding: '14px', borderRadius: 16,
          background: 'var(--ink)', color: 'var(--bg)', fontWeight: 500, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <IconPlus size={16} sw={2}/> Registrar consumo
        </button>
        <button className="tap" onClick={() => go({ modal: 'addPurchase' })} style={{
          all: 'unset', textAlign: 'center', padding: '14px', borderRadius: 16,
          background: 'var(--card)', color: 'var(--ink)', fontWeight: 500, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          border: '0.5px solid var(--hair-strong)',
        }}>
          <IconPlus size={16} sw={2}/> Nueva compra
        </button>
      </div>

      {/* Yeguas */}
      <SectionHead title="Yeguas activas" action="Ver todas" onAction={() => go({ tab: 'caballos' })}/>
      <div style={{ padding: '0 20px' }}>
        {horses.length === 0 ? (
          <EmptyCard
            emoji="🐴"
            title="Sin caballos aún"
            sub="Ve a Caballos y toca + para agregar el primero"
            action="Ir a Caballos"
            onAction={() => go({ tab: 'caballos' })}
          />
        ) : (
        <Card padding={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
            <KPI value={pregnant} label="Preñadas" color="var(--sage)"/>
            <KPI value={lactating} label="Lactando" color="var(--ink)"/>
            <KPI value={mares - pregnant - lactating} label="Vacías" color="var(--muted-2)"/>
          </div>
          <div style={{ height: 1, background: 'var(--hair)', margin: '6px 0 14px' }}/>
          {upcomingFoaling.slice(0, 3).map(h => (
            <div key={h.id} className="tap" onClick={() => go({ tab: 'caballos', horseId: h.id })}
                 style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
              <HorseAvatar horse={h} size={40} radius={11}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{h.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Mes {h.gestMonth} · {h.daysLeft <= 0 ? 'parto pasado' : `parto en ${h.daysLeft}d`}</div>
              </div>
              <GestRing month={h.gestMonth}/>
            </div>
          ))}
        </Card>
        )}
      </div>

      {/* Próximos eventos */}
      <SectionHead title="Próximos eventos" action="Calendario" onAction={() => go({ tab: 'calendar' })}/>
      <div style={{ padding: '0 20px' }}>
        {upcomingEvents.length === 0 ? (
          <EmptyCard
            emoji="📅"
            title="Sin eventos próximos"
            sub="Agrega celos, partos o confirmaciones en el Calendario"
            action="Ir al Calendario"
            onAction={() => go({ tab: 'calendar' })}
          />
        ) : (
        <Card padding={0}>
          {upcomingEvents.length === 0 && (
            <div style={{ padding: '20px 16px', fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>No hay eventos próximos</div>
          )}
          {upcomingEvents.map((e, i) => {
            const tone = e.kind === 'parto' ? 'chip-sage' : e.kind === 'celo' ? 'chip-amber' : 'chip-terra';
            return (
              <div key={e.id} style={{ padding: '14px 16px', borderTop: i ? '0.5px solid var(--hair)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, textAlign: 'center' }}>
                  <div className="tnum" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1 }}>{new Date(e.date).getDate()}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>
                    {fmtDate(e.date, { month: 'short' }).replace('.', '')}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{e.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{e.horse} {e.note && `· ${e.note}`}</div>
                </div>
                <span className={`chip ${tone}`} style={{ fontSize: 11 }}>
                  {e.daysLeft === 0 ? 'Hoy' : e.daysLeft === 1 ? 'Mañana' : `${e.daysLeft}d`}
                </span>
              </div>
            );
          })}
        </Card>
        )}
      </div>

    </div>
  );
}

function EmptyCard({ emoji, title, sub, action, onAction }) {
  return (
    <Card padding={24} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{emoji}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>{sub}</div>
      {action && (
        <button className="tap" onClick={onAction} style={{
          all: 'unset', padding: '10px 20px', borderRadius: 12,
          background: 'var(--ink)', color: 'var(--bg)',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>{action}</button>
      )}
    </Card>
  );
}
