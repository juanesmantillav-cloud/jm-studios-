import { useStore, daysBetween, fmtDate, ageInMonths, TODAY } from '../data/store';
import { Card, StatusChip, HorseAvatar, SectionHead } from '../components/Shared';
import { GestRing } from './Home';
import { IconBack, IconEdit, IconDots, IconPlus, IconAlert, IconCheck, IconHeart } from '../components/Icons';

export default function ScreenHorseDetail({ horse, back, go }) {
  if (!horse) return null;
  const { state } = useStore();
  const isMare = horse.sex === 'mare';

  return (
    <div style={{ paddingBottom: 112 }}>
      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '60px 16px 8px' }}>
        <div className="tap" onClick={back} style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid var(--hair-strong)' }}>
          <IconBack size={20}/>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="tap" onClick={() => go({ modal: 'editHorse', horseId: horse.id })} style={{ width: 40, height: 40, borderRadius: 999, background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid var(--hair-strong)' }}>
            <IconEdit size={18}/>
          </div>
        </div>
      </div>

      {/* Photo hero */}
      <div style={{ padding: '8px 20px 0' }}>
        <div className={`htile ${horse.tile}`} style={{ width: '100%', height: 200, borderRadius: 22, position: 'relative', overflow: 'hidden', aspectRatio: 'auto' }}>
          <div className="initial" style={{ fontSize: 110 }}>{horse.initial}</div>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 30% 20%, rgba(255,255,255,0.25), transparent 60%)' }}/>
          <div style={{ position: 'absolute', bottom: 12, right: 14, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#fff', fontSize: 11, padding: '5px 10px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 5 }}>
            <IconPlus size={12} sw={2.2}/> foto
          </div>
        </div>
      </div>

      {/* Name + meta */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <StatusChip status={horse.status}/>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{horse.breed} · {horse.color}</span>
        </div>
        <h1 className="serif" style={{ margin: '8px 0 4px', fontSize: 42, letterSpacing: '-0.01em' }}>{horse.name}</h1>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>
          {horse.sex === 'mare' ? 'Yegua' : horse.sex === 'stallion' ? 'Padrillo' : horse.sex === 'foal' ? 'Cría' : 'Castrado'} · {ageInMonths(horse.birthDate)} meses
        </div>
      </div>

      {isMare && horse.status === 'preñada'    && <MarePregnant horse={horse}/>}
      {isMare && horse.status === 'celo'        && <MareHeat horse={horse} go={go}/>}
      {isMare && horse.status === 'inseminada'  && <MareInseminated horse={horse} go={go}/>}
      {isMare && horse.status === 'lactando'    && <MareLactating horse={horse} horses={state.horses}/>}
      {isMare && horse.status === 'vacía'       && <MareEmpty horse={horse} go={go}/>}
      {horse.sex === 'stallion'                  && <StallionStats horse={horse} horses={state.horses}/>}
      {horse.sex === 'foal'                      && <FoalStats horse={horse} horses={state.horses}/>}

      {horse.notes && (
        <div style={{ padding: '0 20px', marginTop: 16 }}>
          <SectionHead title="Notas"/>
          <Card padding={16}>
            <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5 }}>{horse.notes}</div>
          </Card>
        </div>
      )}

      {/* Quick history */}
      <div style={{ padding: '0 20px', marginTop: 16 }}>
        <SectionHead title="Historial"/>
        <Card padding={0}>
          {[
            { d: '2026-05-20', t: 'Vacuna influenza', sub: 'Dr. Restrepo' },
            { d: '2026-05-14', t: 'Revisión casco', sub: 'Herrero Joaquín' },
            { d: '2026-05-02', t: 'Desparasitación', sub: 'Ivermectina' },
            { d: '2026-04-14', t: 'Ecografía gestación', sub: '8 semanas confirmadas' },
          ].map((e, i) => (
            <div key={i} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: i ? '0.5px solid var(--hair)' : 'none' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', width: 60, lineHeight: 1.2 }}>{fmtDate(e.d, { day: 'numeric', month: 'short' })}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{e.t}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{e.sub}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function MarePregnant({ horse }) {
  const daysLeft = daysBetween(TODAY, horse.expectedFoaling);
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Gestación"/>
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mes</div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
              <span className="serif tnum" style={{ fontSize: 64, lineHeight: 0.9, letterSpacing: '-0.02em' }}>{horse.gestMonth}</span>
              <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 6 }}>/ 11</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Parto en</div>
            <div className="tnum" style={{ fontSize: 24, fontWeight: 500, marginTop: 4, color: daysLeft < 30 ? 'var(--terra)' : 'var(--ink)' }}>{daysLeft} días</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{fmtDate(horse.expectedFoaling, { day: 'numeric', month: 'long' })}</div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 3 }}>
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 8, borderRadius: 3, background: i < horse.gestMonth ? 'var(--sage)' : 'rgba(24,21,19,0.07)' }}/>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>1</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>11</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18, paddingTop: 16, borderTop: '0.5px solid var(--hair)' }}>
          <InfoCell label="Última monta" value={fmtDate(horse.lastService, { day: 'numeric', month: 'short', year: 'numeric' })}/>
          <InfoCell label="Padrillo" value={horse.sire || '—'}/>
        </div>
      </Card>
    </div>
  );
}

function MareHeat({ horse, go }) {
  const cycleDay = horse.heatDayOfCycle || 1;
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Ciclo de celo"/>
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Día del ciclo</div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
              <span className="serif tnum" style={{ fontSize: 64, lineHeight: 0.9, color: 'var(--amber)' }}>{cycleDay}</span>
              <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 6 }}>/ 21</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--amber)', marginTop: 6, fontWeight: 500 }}>Receptiva — ventana óptima</div>
          </div>
          {horse.nextHeat && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Próximo celo</div>
              <div style={{ fontSize: 17, fontWeight: 500, marginTop: 4 }}>{fmtDate(horse.nextHeat)}</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 2 }}>
          {Array.from({ length: 21 }).map((_, i) => {
            const isHeat = i < 7;
            const isToday = i === cycleDay - 1;
            return (
              <div key={i} style={{
                flex: 1, height: isToday ? 14 : 8, borderRadius: 2, alignSelf: 'center',
                background: isToday ? 'var(--amber)' : i < cycleDay ? 'rgba(184,134,56,0.4)' : isHeat ? 'rgba(184,134,56,0.18)' : 'rgba(24,21,19,0.06)',
              }}/>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--amber)' }}>Celo (1–7)</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Diestro (8–21)</span>
        </div>

        <button className="tap" onClick={() => go({ modal: 'registerService', horseId: horse.id })} style={{
          all: 'unset', marginTop: 18, padding: '14px', borderRadius: 14,
          background: 'var(--amber)', color: '#fff', textAlign: 'center',
          display: 'block', width: '100%', boxSizing: 'border-box', fontWeight: 500, fontSize: 14,
        }}>
          Registrar monta o inseminación
        </button>
      </Card>
    </div>
  );
}

function MareInseminated({ horse, go }) {
  const daysToConfirm = daysBetween(TODAY, horse.confirmDate);
  const daysSince = daysBetween(horse.lastService, TODAY);
  const { dispatch } = useStore();

  function confirmPregnancy() {
    dispatch({ type: 'UPDATE_HORSE', horse: { id: horse.id, status: 'preñada', gestMonth: 1, tile: 'mare-preg' } });
  }
  function confirmNot() {
    dispatch({ type: 'UPDATE_HORSE', horse: { id: horse.id, status: 'vacía', lastService: null, confirmDate: null } });
  }

  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Pendiente confirmar"/>
      <Card padding={20} style={{ border: '1px solid var(--amber)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--amber-soft)', color: '#6e4d12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconAlert size={22}/>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Ecografía en {daysToConfirm} días</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{fmtDate(horse.confirmDate, { day: 'numeric', month: 'long' })}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18, paddingTop: 16, borderTop: '0.5px solid var(--hair)' }}>
          <InfoCell label="Servicio" value={fmtDate(horse.lastService, { day: 'numeric', month: 'long' })}/>
          <InfoCell label="Días desde" value={`${daysSince} días`}/>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="tap" onClick={confirmPregnancy} style={{
            all: 'unset', flex: 1, padding: '12px', borderRadius: 12,
            background: 'var(--sage)', color: '#fff', textAlign: 'center',
            fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <IconCheck size={16}/> Confirmar preñez
          </button>
          <button className="tap" onClick={confirmNot} style={{
            all: 'unset', flex: 1, padding: '12px', borderRadius: 12,
            background: 'transparent', color: 'var(--ink)', textAlign: 'center',
            fontWeight: 500, fontSize: 14, border: '0.5px solid var(--hair-strong)',
          }}>
            No quedó
          </button>
        </div>
      </Card>
    </div>
  );
}

function MareLactating({ horse, horses }) {
  const foalDays = daysBetween(horse.foalingDate, TODAY);
  const foal = horses.find(h => h.motherId === horse.id);
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Lactancia"/>
      <Card padding={20}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Parió hace</div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
              <span className="serif tnum" style={{ fontSize: 56, lineHeight: 0.9 }}>{foalDays}</span>
              <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 6 }}>días</span>
            </div>
          </div>
          {foal && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HorseAvatar horse={foal} size={56} radius={14}/>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cría</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{foal.name}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '0.5px solid var(--hair)', fontSize: 13, color: 'var(--ink-2)' }}>
          Próximo celo postparto en {Math.max(0, 7 - foalDays)} días aprox.
        </div>
      </Card>
    </div>
  );
}

function MareEmpty({ horse, go }) {
  const daysToHeat = horse.nextHeat ? daysBetween(TODAY, horse.nextHeat) : null;
  const { dispatch } = useStore();
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Estado reproductivo"/>
      <Card padding={20}>
        {daysToHeat !== null ? (
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Próximo celo</div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 4 }}>
              <span className="serif tnum" style={{ fontSize: 56, lineHeight: 0.9 }}>{daysToHeat}</span>
              <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 6 }}>días · {fmtDate(horse.nextHeat, { day: 'numeric', month: 'long' })}</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-2)' }}>Ciclo de 21 días. Predicción según último celo registrado.</div>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>Sin ciclo registrado.</div>
        )}
        <button className="tap" onClick={() => dispatch({ type: 'UPDATE_HORSE', horse: { id: horse.id, status: 'celo', heatDayOfCycle: 1, tile: 'mare-heat' } })} style={{
          all: 'unset', marginTop: 16, padding: '12px', width: '100%', boxSizing: 'border-box',
          borderRadius: 12, background: 'var(--ink)', color: 'var(--bg)',
          textAlign: 'center', fontWeight: 500, fontSize: 14,
        }}>
          Marcar inicio de celo
        </button>
      </Card>
    </div>
  );
}

function StallionStats({ horse, horses }) {
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Reproducción"/>
      <Card padding={20}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <InfoCell label="Montas 2026" value={horse.covers || 0}/>
          <InfoCell label="Confirmadas" value={horses.filter(h => h.sire === horse.name && h.status === 'preñada').length} color="var(--sage)"/>
          <InfoCell label="Crías vivas" value={horses.filter(h => h.sex === 'foal').length}/>
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '0.5px solid var(--hair)', fontSize: 13 }}>
          <div style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Yeguas activas</div>
          {horses.filter(h => h.sire === horse.name).slice(0, 4).map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
              <HorseAvatar horse={m} size={28} radius={8}/>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
              <span style={{ marginLeft: 'auto' }}><StatusChip status={m.status}/></span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FoalStats({ horse, horses }) {
  const mom = horses.find(h => h.id === horse.motherId);
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <SectionHead title="Información"/>
      <Card padding={18}>
        {mom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HorseAvatar horse={mom} size={44} radius={12}/>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Madre</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{mom.name}</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function InfoCell({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4, color: color || 'var(--ink)' }}>{value}</div>
    </div>
  );
}
