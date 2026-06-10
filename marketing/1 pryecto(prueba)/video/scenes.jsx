// Equino video — scenes
// 30s vertical 9:16 (1080x1920)
//
// Timeline:
//   0.0 → 7.5  Paper scene (handwriting builds up + chaos)
//   7.0 → 9.0  Angry scribble out
//   9.0 → 12.0 Logo reveal
//  11.5 → 26.0 Onboarding phone montage (4 steps)
//  25.5 → 30.0 Outro tagline + "Próximamente"

// ── Helpers ─────────────────────────────────────────────────────────────────

const HAND = "'Caveat', 'Kalam', cursive";
const HAND_PEN = "'Kalam', 'Caveat', cursive";
const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'Geist', system-ui, sans-serif";

// Re-usable: a single line of handwritten text that "writes itself" over time
function HandLine({
  text, delay = 0, x = 0, y = 0,
  size = 50, weight = 500, color = '#1a1612',
  rotation = 0, writeDur = 0.55, font = HAND,
  letterSpacing = '0.5px',
}) {
  const time = useTime();
  const t = Math.max(0, time - delay);
  const p = clamp(t / writeDur, 0, 1);
  // Two-stage reveal: clip-path width grows, plus opacity
  const clip = (1 - p) * 100;
  if (time < delay - 0.05) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'left center',
      fontFamily: font, fontSize: size, fontWeight: weight,
      color, lineHeight: 0.95, letterSpacing,
      whiteSpace: 'pre',
      clipPath: `inset(-20px ${clip}% -20px -10px)`,
      willChange: 'clip-path',
    }}>
      {text}
    </div>
  );
}

// A pen-stroke overlay that strikes through some text or scribbles
function StrikeLine({
  delay = 0, x, y, length = 120, angle = 0,
  thickness = 3, color = '#1a1612', drawDur = 0.25,
  jitter = 0,
}) {
  const time = useTime();
  const t = Math.max(0, time - delay);
  const p = clamp(t / drawDur, 0, 1);
  if (time < delay) return null;
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: length * p,
      height: thickness,
      background: color,
      transformOrigin: 'left center',
      transform: `rotate(${angle}deg) translateY(${jitter * Math.sin(p * 6) }px)`,
      borderRadius: thickness / 2,
    }}/>
  );
}

// Multi-stroke angry scribble — a series of zig-zag lines drawn fast
function AngryScribble({ delay = 0 }) {
  const time = useTime();
  const t = Math.max(0, time - delay);
  if (t < 0) return null;
  // 6 zigzag strokes, staggered ~0.15s apart, each drawing in 0.45s
  const strokes = [
    { y: 280,  angle: -8,  len: 880, thick: 12 },
    { y: 540,  angle:  6,  len: 920, thick: 14 },
    { y: 760,  angle: -4,  len: 900, thick: 11 },
    { y: 1020, angle:  9,  len: 880, thick: 13 },
    { y: 1280, angle: -7,  len: 920, thick: 12 },
    { y: 1500, angle:  4,  len: 860, thick: 14 },
  ];
  return (
    <>
      {strokes.map((s, i) => (
        <StrikeLine
          key={i}
          delay={delay + i * 0.12}
          x={50 + (i % 2 === 0 ? 0 : -20)}
          y={s.y}
          length={s.len}
          angle={s.angle}
          thickness={s.thick}
          color="#231a14"
          drawDur={0.45}
        />
      ))}
      {/* big diagonal X stroke */}
      <StrikeLine delay={delay + 0.9} x={120} y={250}  length={1180} angle={48} thickness={18} color="#231a14" drawDur={0.55} />
      <StrikeLine delay={delay + 1.15} x={120} y={1600} length={1180} angle={-50} thickness={18} color="#231a14" drawDur={0.55} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 1 — Paper with handwritten accounting chaos
// ─────────────────────────────────────────────────────────────────────────────
function PaperScene() {
  const { localTime, progress } = useSprite();

  // Paper rotation: starts a touch off, settles to 0, slight shake near end
  const rot = (() => {
    if (localTime < 0.5) return -0.8 + localTime * 1.6;
    if (localTime > 7.0) return Math.sin((localTime - 7.0) * 18) * 1.4;
    return 0;
  })();
  // Exit: paper flips and fades after scene ends (after ~9s)
  const exitT = Math.max(0, localTime - 8.6);
  const exitP = clamp(exitT / 0.8, 0, 1);
  const exitRot = Easing.easeInCubic(exitP) * -28;
  const exitY = Easing.easeInCubic(exitP) * 600;
  const exitOpacity = 1 - exitP;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(120% 80% at 50% 50%, #2a2420 0%, #15110d 100%)',
      overflow: 'hidden',
    }}>
      {/* Paper sheet */}
      <div style={{
        position: 'absolute',
        left: 50, top: 90,
        width: 980, height: 1740,
        background: '#f6efde',
        backgroundImage: `
          repeating-linear-gradient(to bottom,
            transparent 0px, transparent 87px,
            rgba(100,140,170,0.32) 87px, rgba(100,140,170,0.32) 88px),
          radial-gradient(160% 60% at 30% 0%, rgba(255,255,255,0.5), transparent 60%),
          radial-gradient(160% 60% at 70% 100%, rgba(180,140,80,0.08), transparent 60%)
        `,
        boxShadow: `
          0 60px 120px rgba(0,0,0,0.55),
          0 20px 40px rgba(0,0,0,0.35),
          inset 0 0 0 1px rgba(0,0,0,0.04)
        `,
        transform: `rotate(${rot + exitRot}deg) translateY(${exitY}px)`,
        transformOrigin: '50% 60%',
        opacity: exitOpacity,
        willChange: 'transform, opacity',
      }}>
        {/* Left red margin line */}
        <div style={{
          position: 'absolute', left: 145, top: 0, bottom: 0,
          width: 2.5, background: 'rgba(195,90,80,0.55)',
        }}/>
        {/* Tiny paper grain via repeating subtle dots */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(rgba(120,90,60,0.05) 1px, transparent 1.2px)`,
          backgroundSize: '5px 5px',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}/>

        {/* ─── Header ───────────────────────────────────── */}
        <HandLine text="Mayo 2026" delay={0.3} x={195} y={120} size={96} weight={700} writeDur={0.7} rotation={-1.5}/>
        <HandLine text="— La Caballeriza" delay={0.95} x={195} y={220} size={56} weight={400} writeDur={0.6} color="#5a4030" rotation={-1.2}/>

        {/* Decorative underline */}
        <StrikeLine delay={1.5} x={195} y={275} length={560} angle={-0.5} thickness={4} color="#231a14" drawDur={0.4}/>

        {/* ─── Bodega ───────────────────────────────────── */}
        <HandLine text="BODEGA" delay={1.7} x={195} y={335} size={42} weight={600} color="#7a5a3c" letterSpacing="3px" writeDur={0.4}/>

        <HandLine text="Heno   ·  80 pacas" delay={2.1} x={210} y={405} size={54} writeDur={0.7}/>
        {/* cross out "80" and write "62" above */}
        <StrikeLine delay={2.85} x={420} y={428} length={75} angle={-4} thickness={5} color="#231a14" drawDur={0.18}/>
        <HandLine text="62 ?" delay={3.05} x={418} y={360} size={42} color="#b54a36" rotation={-4} writeDur={0.5}/>

        <HandLine text="Alfalfa   380 kg" delay={3.5} x={210} y={500} size={54} writeDur={0.65}/>
        <HandLine text="(pedir 500?)" delay={4.0} x={680} y={480} size={36} color="#b54a36" rotation={-3} writeDur={0.55}/>

        <HandLine text="Concent. ~ 92 kg" delay={4.35} x={210} y={595} size={54} writeDur={0.65}/>
        <HandLine text="¡COMPRAR YA!" delay={4.9} x={690} y={570} size={42} color="#b54a36" weight={700} rotation={-5} writeDur={0.6}/>
        <StrikeLine delay={5.45} x={690} y={620} length={300} angle={-3} thickness={4} color="#b54a36" drawDur={0.3}/>

        {/* ─── Caballos ─────────────────────────────────── */}
        <HandLine text="CABALLOS" delay={5.05} x={195} y={730} size={42} weight={600} color="#7a5a3c" letterSpacing="3px" writeDur={0.45}/>

        <HandLine text="Aurora — mes 9 ✓" delay={5.5} x={210} y={798} size={50} writeDur={0.7}/>
        <HandLine text="Pampa parto !! 2/6" delay={5.95} x={210} y={888} size={50} color="#b54a36" writeDur={0.7}/>
        <HandLine text="Mística celo día 3" delay={6.35} x={210} y={978} size={50} writeDur={0.65}/>
        <HandLine text="Sombra eco — 7/6" delay={6.7} x={210} y={1068} size={50} writeDur={0.6}/>

        {/* arrows / chaos creeping in */}
        <HandLine text="↑" delay={5.8} x={520} y={795} size={56} color="#b54a36" writeDur={0.2}/>
        <HandLine text="Brisa? 15/6 ECO" delay={6.55} x={680} y={1060} size={36} color="#5a4030" rotation={-4} writeDur={0.5}/>

        {/* ─── Compras ─────────────────────────────────── */}
        <HandLine text="COMPRAS MES" delay={6.4} x={195} y={1190} size={42} weight={600} color="#7a5a3c" letterSpacing="3px" writeDur={0.45}/>

        <HandLine text="12/5  Heno     $1.920.000" delay={6.7} x={210} y={1260} size={44} writeDur={0.7}/>
        <HandLine text="8/5   Alfalfa  $1.840.000" delay={6.95} x={210} y={1340} size={44} writeDur={0.7}/>
        <HandLine text="18/5  Conc.    $1.325.000" delay={7.2} x={210} y={1420} size={44} writeDur={0.7}/>

        {/* The frustrated equals + question mark at the very bottom */}
        <HandLine text="TOTAL  =   ¿$5M?" delay={7.5} x={210} y={1550} size={52} weight={600} color="#b54a36" rotation={-1} writeDur={0.7}/>
        <HandLine text="...y mañana?" delay={7.95} x={500} y={1640} size={48} color="#5a4030" rotation={3} writeDur={0.5}/>

        {/* The angry scribble — happens around 8.3s onward */}
        <AngryScribble delay={8.3}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 2 — Logo reveal
// ─────────────────────────────────────────────────────────────────────────────
function LogoReveal() {
  const { localTime, progress } = useSprite();

  // E logo box: scale + opacity
  const logoEnter = clamp(localTime / 0.8, 0, 1);
  const logoScale = 0.6 + 0.4 * Easing.easeOutBack(logoEnter);
  const logoOpacity = Easing.easeOutCubic(logoEnter);

  // Equino word: reveal letter-by-letter via clip-path
  const wordStart = 0.5;
  const wordDur = 1.1;
  const wordP = clamp((localTime - wordStart) / wordDur, 0, 1);
  const wordClip = (1 - Easing.easeOutCubic(wordP)) * 100;

  // Subtitle fade
  const subStart = 1.4;
  const subP = clamp((localTime - subStart) / 0.6, 0, 1);

  // Exit: slide up + fade after 2.6s
  const exitStart = 2.6;
  const exitP = clamp((localTime - exitStart) / 0.4, 0, 1);
  const exitY = -Easing.easeInCubic(exitP) * 120;
  const exitOpacity = 1 - exitP;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(120% 80% at 50% 40%, #faf7f1 0%, #efe7d4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 0,
      opacity: exitOpacity,
      transform: `translateY(${exitY}px)`,
    }}>
      {/* E logo */}
      <div style={{
        width: 220, height: 220, borderRadius: 56,
        background: '#181513',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 60,
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
        boxShadow: '0 30px 70px rgba(0,0,0,0.25)',
      }}>
        <span style={{
          fontFamily: SERIF, fontSize: 168, color: '#faf7f1',
          lineHeight: 1, paddingBottom: 14,
        }}>E</span>
      </div>

      {/* Equino word */}
      <div style={{
        fontFamily: SERIF, fontSize: 200, color: '#181513',
        letterSpacing: '-0.03em', lineHeight: 1,
        clipPath: `inset(-30px ${wordClip}% -30px -10px)`,
      }}>
        Equino
      </div>

      {/* Subtitle */}
      <div style={{
        marginTop: 32,
        fontFamily: SANS, fontSize: 42, color: '#7a6a5a',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontWeight: 400,
        opacity: subP,
        transform: `translateY(${(1 - subP) * 14}px)`,
      }}>
        Gestión de criadero
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 3 — Onboarding phone montage (4 steps)
// ─────────────────────────────────────────────────────────────────────────────

// Step 0 — Welcome
function OnbStep0() {
  return (
    <div style={{ padding: '120px 56px 60px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ width: 130, height: 130, borderRadius: 32, background: '#181513', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 44 }}>
        <span style={{ fontFamily: SERIF, fontSize: 90, color: '#faf7f1', lineHeight: 1, paddingBottom: 8 }}>E</span>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 96, color: '#181513', letterSpacing: '-0.02em', margin: '0 0 20px', lineHeight: 1 }}>Equino</div>
      <div style={{ fontFamily: SANS, fontSize: 30, color: '#8c827a', lineHeight: 1.5, margin: '0 0 70px', maxWidth: 540 }}>
        Tu asistente para gestionar caballos, bodega y ciclos reproductivos en un solo lugar.
      </div>
      <button style={{
        width: '100%', padding: '30px 0', borderRadius: 24,
        background: '#181513', color: '#faf7f1', border: 'none',
        fontFamily: SANS, fontSize: 30, fontWeight: 500,
      }}>Comenzar →</button>
    </div>
  );
}

// Step dots
function Dots({ active }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, paddingTop: 110 }}>
      {[1, 2, 3].map(s => (
        <div key={s} style={{
          height: 12, borderRadius: 999,
          width: s === active ? 44 : 12,
          background: s === active ? '#181513' : s < active ? '#3a342f' : 'rgba(24,21,19,0.18)',
          transition: 'all .25s',
        }}/>
      ))}
    </div>
  );
}

// Step 1 — Name (typing animation)
function OnbStep1({ t }) {
  // typing: at t=0, empty. At t=1.5s, full "Juan"
  const full = 'Juan';
  const chars = clamp(Math.floor(t / 0.18), 0, full.length);
  const typed = full.slice(0, chars);
  const showCaret = Math.floor(t * 2) % 2 === 0;

  return (
    <div>
      <Dots active={1}/>
      <div style={{ padding: '60px 56px 60px' }}>
        <div style={{ fontFamily: SANS, fontSize: 26, color: '#8c827a', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 18px' }}>Paso 1</div>
        <div style={{ fontFamily: SERIF, fontSize: 68, color: '#181513', letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 18px' }}>¿Cómo te llamas?</div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: '#8c827a', margin: '0 0 60px', lineHeight: 1.5 }}>
          Así te saludaremos cada mañana.
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: SANS, fontSize: 24, fontWeight: 500, color: '#8c827a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 14 }}>Tu nombre</div>
          <div style={{
            width: '100%', padding: '26px 28px', borderRadius: 22,
            border: '3px solid #b54a36', background: '#faf7f1',
            fontFamily: SANS, fontSize: 32, color: '#181513',
            display: 'flex', alignItems: 'center', minHeight: 88, boxSizing: 'border-box',
          }}>
            {typed || <span style={{ color: '#b3aaa1' }}>Ej: Juan, María…</span>}
            <span style={{
              display: 'inline-block', width: 3, height: 38, background: '#181513',
              marginLeft: 4, opacity: typed && showCaret ? 1 : 0,
            }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2 — Caballos (cards added one by one)
function OnbStep2({ t }) {
  const horses = [
    { name: 'Aurora',   sex: 'mare',     label: 'Yegua',    color: '#c8b89a', initial: 'A' },
    { name: 'Tornado',  sex: 'stallion', label: 'Padrillo', color: '#4a3728', initial: 'T' },
    { name: 'Mística',  sex: 'mare',     label: 'Yegua',    color: '#c8b89a', initial: 'M' },
    { name: 'Pampa',    sex: 'mare',     label: 'Yegua',    color: '#c8b89a', initial: 'P' },
  ];
  // each appears at t=0.4, 0.9, 1.4, 1.9
  const showCount = clamp(Math.floor((t - 0.2) / 0.5) + 1, 0, horses.length);

  return (
    <div>
      <Dots active={2}/>
      <div style={{ padding: '40px 56px 40px' }}>
        <div style={{ fontFamily: SANS, fontSize: 26, color: '#8c827a', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 14px' }}>Paso 2</div>
        <div style={{ fontFamily: SERIF, fontSize: 68, color: '#181513', letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 14px' }}>Tus caballos</div>
        <div style={{ fontFamily: SANS, fontSize: 26, color: '#8c827a', margin: '0 0 30px', lineHeight: 1.5 }}>
          Agrega los caballos de tu criadero.
        </div>

        {/* Inline add form */}
        <div style={{ background: '#fff', borderRadius: 28, padding: 28, border: '1px solid rgba(24,21,19,0.14)', marginBottom: 22 }}>
          <div style={{ fontFamily: SANS, fontSize: 22, color: '#8c827a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Nombre del caballo</div>
          <div style={{ padding: '20px 22px', borderRadius: 18, border: '2px solid rgba(24,21,19,0.14)', background: '#faf7f1', fontFamily: SANS, fontSize: 28, color: '#b3aaa1', marginBottom: 18 }}>
            Ej: Perla, Relámpago…
          </div>
          <button style={{
            width: '100%', padding: '20px', borderRadius: 18,
            background: '#181513', color: '#faf7f1', border: 'none',
            fontFamily: SANS, fontSize: 26, fontWeight: 500,
          }}>+ Agregar caballo</button>
        </div>

        {/* Horse list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {horses.slice(0, showCount).map((h, i) => {
            const appearT = clamp((t - (0.2 + i * 0.5)) / 0.35, 0, 1);
            const e = Easing.easeOutBack(appearT);
            return (
              <div key={h.name} style={{
                display: 'flex', alignItems: 'center', gap: 20,
                background: '#fff', borderRadius: 22, padding: '20px 24px',
                border: '1px solid rgba(24,21,19,0.07)',
                opacity: appearT,
                transform: `translateX(${(1 - e) * 30}px)`,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: h.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: SERIF, fontSize: 36, color: h.sex === 'stallion' ? '#f5f0e8' : '#4a3728',
                  flexShrink: 0,
                }}>{h.initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 500, color: '#181513' }}>{h.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 22, color: '#8c827a', marginTop: 2 }}>{h.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Step 3 — Bodega capacities
function OnbStep3({ t }) {
  const items = [
    { name: 'Heno',        unit: 'pacas', value: 100 },
    { name: 'Alfalfa',     unit: 'kg',    value: 1000 },
    { name: 'Concentrado', unit: 'kg',    value: 500 },
  ];
  return (
    <div>
      <Dots active={3}/>
      <div style={{ padding: '50px 56px 40px' }}>
        <div style={{ fontFamily: SANS, fontSize: 26, color: '#8c827a', textTransform: 'uppercase', letterSpacing: '0.16em', margin: '0 0 14px' }}>Paso 3</div>
        <div style={{ fontFamily: SERIF, fontSize: 68, color: '#181513', letterSpacing: '-0.01em', lineHeight: 1.1, margin: '0 0 14px' }}>Tu bodega</div>
        <div style={{ fontFamily: SANS, fontSize: 26, color: '#8c827a', margin: '0 0 36px', lineHeight: 1.5 }}>
          ¿Cuánto cabe en tu bodega?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {items.map((it, i) => {
            const appearT = clamp((t - i * 0.25) / 0.4, 0, 1);
            const e = Easing.easeOutCubic(appearT);
            // animate the value from 0 to it.value
            const valAt = Math.round(it.value * clamp((t - 0.5 - i * 0.25) / 0.8, 0, 1));
            return (
              <div key={it.name} style={{
                background: '#fff', borderRadius: 28, padding: '28px 32px',
                border: '1px solid rgba(24,21,19,0.14)',
                opacity: appearT,
                transform: `translateY(${(1 - e) * 24}px)`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 500, color: '#181513' }}>{it.name}</div>
                  <div style={{ fontFamily: SANS, fontSize: 22, color: '#8c827a', marginTop: 4 }}>Capacidad máxima</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <div style={{
                    fontFamily: SANS, fontSize: 44, fontWeight: 600, color: '#181513',
                    fontVariantNumeric: 'tabular-nums',
                    minWidth: 120, textAlign: 'right',
                  }}>{valAt}</div>
                  <div style={{ fontFamily: SANS, fontSize: 22, color: '#8c827a' }}>{it.unit}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Phone shell — recreates the .phone-wrap from the app
function PhoneShell({ children, t, step }) {
  return (
    <div style={{
      width: 800, height: 1640, // scaled-up phone
      borderRadius: 90, overflow: 'hidden',
      position: 'relative',
      background: '#faf7f1',
      boxShadow: `
        0 0 0 8px #1d1814,
        0 0 0 11px #3a3128,
        0 80px 160px rgba(0,0,0,0.5),
        0 30px 60px rgba(0,0,0,0.35)
      `,
    }}>
      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
        width: 240, height: 70, borderRadius: 50, background: '#000', zIndex: 30,
      }}/>
      {/* Content */}
      <div style={{ height: '100%', overflow: 'hidden', background: '#faf7f1', position: 'relative' }}>
        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 100,
          padding: '36px 56px 0', boxSizing: 'border-box', zIndex: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 32, fontWeight: 600, color: '#181513' }}>9:41</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[6,10,14,18].map(h => <div key={h} style={{ width: 6, height: h, background: '#181513', borderRadius: 1 }}/>)}
            </div>
            <div style={{ width: 50, height: 24, border: '2px solid rgba(24,21,19,0.4)', borderRadius: 6, padding: 2 }}>
              <div style={{ width: '78%', height: '100%', background: '#181513', borderRadius: 2 }}/>
            </div>
          </div>
        </div>
        {/* Screen content */}
        {children}
      </div>
    </div>
  );
}

function PhoneScene() {
  const { localTime } = useSprite();

  // Step timing within the phone scene:
  //   0 → 3   step 0 (welcome)
  //   3 → 6.5 step 1 (name)
  //   6.5→ 10 step 2 (caballos)
  //  10 → 13.5 step 3 (bodega)
  let step = 0, tIn = localTime;
  if (localTime < 3)      { step = 0; tIn = localTime; }
  else if (localTime < 6.5)  { step = 1; tIn = localTime - 3; }
  else if (localTime < 10)   { step = 2; tIn = localTime - 6.5; }
  else                       { step = 3; tIn = localTime - 10; }

  // Entry: phone slides up + scales up
  const enterP = clamp(localTime / 0.7, 0, 1);
  const enterE = Easing.easeOutCubic(enterP);
  const enterY = (1 - enterE) * 140;
  const enterScale = 0.92 + 0.08 * enterE;

  // Exit: phone fades out after ~13.5s
  const exitT = Math.max(0, localTime - 13.5);
  const exitP = clamp(exitT / 0.8, 0, 1);
  const exitOpacity = 1 - exitP;
  const exitScale = 1 + Easing.easeInCubic(exitP) * 0.05;

  // Screen transition: cross-slide between steps
  const screenComp =
    step === 0 ? <OnbStep0 /> :
    step === 1 ? <OnbStep1 t={tIn}/> :
    step === 2 ? <OnbStep2 t={tIn}/> :
                 <OnbStep3 t={tIn}/>;

  // Step-in animation: slide from right
  const stepInP = clamp(tIn / 0.45, 0, 1);
  const stepInE = Easing.easeOutCubic(stepInP);
  const stepInX = (1 - stepInE) * 80;
  const stepInOpacity = stepInE;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(120% 90% at 50% 30%, #f4ecdb 0%, #d9c8a8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
      opacity: exitOpacity,
    }}>
      {/* Top caption */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0,
        textAlign: 'center',
        fontFamily: SANS, fontSize: 32, color: '#5a4a3a',
        fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase',
        opacity: clamp((localTime - 0.5) / 0.4, 0, 1),
      }}>
        Empezá en menos de un minuto
      </div>

      {/* Phone */}
      <div style={{
        transform: `translateY(${enterY}px) scale(${enterScale * exitScale})`,
        marginTop: 60,
      }}>
        <PhoneShell>
          <div style={{
            position: 'absolute', inset: 0,
            transform: `translateX(${stepInX}px)`,
            opacity: stepInOpacity,
          }}>
            {screenComp}
          </div>
        </PhoneShell>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 4 — Outro tagline + Próximamente
// ─────────────────────────────────────────────────────────────────────────────
function OutroScene() {
  const { localTime } = useSprite();

  // Logo at top
  const logoP = clamp(localTime / 0.5, 0, 1);

  // Big serif tagline — "Una nueva forma de gestionar tu criadero"
  // line by line reveal
  const line1P = clamp((localTime - 0.4) / 0.6, 0, 1);
  const line2P = clamp((localTime - 0.9) / 0.6, 0, 1);
  const line3P = clamp((localTime - 1.4) / 0.6, 0, 1);

  // CTA "Próximamente"
  const ctaP = clamp((localTime - 2.4) / 0.6, 0, 1);
  // pulsing dot beside it
  const dotPulse = 0.5 + 0.5 * Math.sin(localTime * 4);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(120% 90% at 50% 30%, #1f1a16 0%, #0a0806 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column',
      padding: '0 100px',
    }}>
      {/* Logo + name */}
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28,
        opacity: logoP,
        transform: `translateY(${(1 - logoP) * 20}px)`,
      }}>
        <div style={{
          width: 130, height: 130, borderRadius: 32, background: '#faf7f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: SERIF, fontSize: 96, color: '#181513', lineHeight: 1, paddingBottom: 10 }}>E</span>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 72, color: '#faf7f1', letterSpacing: '-0.01em' }}>
          Equino
        </div>
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: SERIF, fontSize: 110, color: '#faf7f1',
        lineHeight: 1.05, letterSpacing: '-0.02em',
        textAlign: 'center', marginBottom: 80,
      }}>
        <div style={{ opacity: line1P, transform: `translateY(${(1 - line1P) * 18}px)` }}>
          Una nueva forma
        </div>
        <div style={{ opacity: line2P, transform: `translateY(${(1 - line2P) * 18}px)`, fontStyle: 'italic', color: '#e9d6b8' }}>
          de gestionar
        </div>
        <div style={{ opacity: line3P, transform: `translateY(${(1 - line3P) * 18}px)` }}>
          tu criadero.
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position: 'absolute', bottom: 240, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18,
        opacity: ctaP,
        transform: `translateY(${(1 - ctaP) * 14}px)`,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 999,
          background: '#b54a36', opacity: dotPulse,
          boxShadow: '0 0 30px rgba(181,74,54,0.6)',
        }}/>
        <div style={{
          fontFamily: SANS, fontSize: 38, color: '#faf7f1',
          letterSpacing: '0.32em', textTransform: 'uppercase', fontWeight: 500,
        }}>
          Próximamente
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PaperScene, LogoReveal, PhoneScene, OutroScene,
  HandLine, StrikeLine, AngryScribble,
  PhoneShell, OnbStep0, OnbStep1, OnbStep2, OnbStep3,
});
