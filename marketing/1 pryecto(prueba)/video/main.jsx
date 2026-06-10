// Equino video — main composition

function EquinoVideo() {
  return (
    <Stage width={1080} height={1920} duration={30} background="#0a0806" persistKey="equino-vid">
      {/* SCENE 1: Paper handwriting chaos (0 → 9.4s) — exits with crumple+fall */}
      <Sprite start={0} end={9.4}>
        <PaperScene />
      </Sprite>

      {/* SCENE 2: Logo reveal (9.0 → 12.4s) */}
      <Sprite start={9.0} end={12.4}>
        <LogoReveal />
      </Sprite>

      {/* SCENE 3: Phone onboarding montage (12.0 → 26.0s) */}
      <Sprite start={12.0} end={26.0}>
        <PhoneScene />
      </Sprite>

      {/* SCENE 4: Outro (25.5 → 30s) */}
      <Sprite start={25.5} end={30.0}>
        <OutroScene />
      </Sprite>
    </Stage>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<EquinoVideo/>);
