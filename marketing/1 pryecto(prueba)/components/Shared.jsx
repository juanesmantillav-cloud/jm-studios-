import { IconSearch, IconHay, IconLeaf, IconPellet } from './Icons';

export function HorseAvatar({ horse, size = 56, radius = 14 }) {
  return (
    <div className={`htile ${horse.tile || 'mare'}`} style={{ width: size, height: size, borderRadius: radius, aspectRatio: 'auto', flexShrink: 0 }}>
      <div className="initial" style={{ fontSize: size * 0.55 }}>{horse.initial}</div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: radius, background: 'radial-gradient(110% 80% at 30% 20%, rgba(255,255,255,0.22), transparent 60%)', pointerEvents: 'none' }}/>
    </div>
  );
}

export function StatusChip({ status }) {
  const map = {
    'preñada':     { cls: 'chip-sage',  label: 'Preñada' },
    'lactando':    { cls: 'chip-sage',  label: 'Lactando' },
    'celo':        { cls: 'chip-amber', label: 'En celo' },
    'inseminada':  { cls: 'chip-amber', label: 'Por confirmar' },
    'vacía':       { cls: 'chip-ghost', label: 'Vacía' },
    'reproductor': { cls: 'chip-terra', label: 'Reproductor' },
    'trabajo':     { cls: 'chip-ghost', label: 'Trabajo' },
    'cría':        { cls: 'chip-ghost', label: 'Cría' },
  };
  const m = map[status] || { cls: 'chip-ghost', label: status };
  return <span className={`chip ${m.cls}`}><span className="dot"/>{m.label}</span>;
}

export function KPI({ value, unit, label, sub, color }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span className="kpi-num tnum" style={{ color: color || 'var(--ink)' }}>{value}</span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

export function Sparkline({ data, color = 'var(--ink)', fill = 'rgba(24,21,19,0.06)', width = 220, height = 36 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  return (
    <svg className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={areaPath} fill={fill}/>
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

export function BarChart({ data, labels, height = 130, color = 'var(--ink)', highlight }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '6px 0' }}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 22);
        const isHi = highlight === i;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ width: '100%', height: h, borderRadius: 4, background: isHi ? 'var(--terra)' : color, opacity: isHi ? 1 : 0.85 }}/>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function SectionHead({ title, action, onAction }) {
  return (
    <div className="section-head" style={{ padding: '0 20px', marginTop: 28, marginBottom: 12 }}>
      <h3>{title}</h3>
      {action && <a className="tap" onClick={onAction}>{action}</a>}
    </div>
  );
}

export function Search({ value, onChange, placeholder = 'Buscar' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(24,21,19,0.05)', borderRadius: 12, padding: '9px 12px', margin: '0 20px', color: 'var(--muted)' }}>
      <IconSearch size={18}/>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: 'var(--ink)', width: '100%', fontFamily: 'inherit' }}
      />
    </div>
  );
}

export function Card({ children, style, onClick, padding = 16 }) {
  return (
    <div className={onClick ? 'card tap' : 'card'} onClick={onClick} style={{ padding, ...style }}>
      {children}
    </div>
  );
}

export function FeedIcon({ kind, size = 20 }) {
  if (kind === 'heno') return <IconHay size={size}/>;
  if (kind === 'alfalfa') return <IconLeaf size={size}/>;
  return <IconPellet size={size}/>;
}
