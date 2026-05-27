import { IconHome, IconBarn, IconHorse, IconCalendar } from './Icons';

export default function TabBar({ tab, setTab }) {
  const tabs = [
    { id: 'home',     label: 'Inicio',     Icon: IconHome },
    { id: 'bodega',   label: 'Bodega',     Icon: IconBarn },
    { id: 'caballos', label: 'Caballos',   Icon: IconHorse },
    { id: 'calendar', label: 'Calendario', Icon: IconCalendar },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => {
        const active = t.id === tab;
        const I = t.Icon;
        return (
          <div key={t.id} className={`tab ${active ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <div className="ico"><I size={26} sw={active ? 1.9 : 1.6}/></div>
            <span>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
