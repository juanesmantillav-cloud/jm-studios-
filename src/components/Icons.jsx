const Icon = ({ d, size = 22, fill = 'none', stroke = 'currentColor', sw = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === 'string' ? <path d={d}/> : d}
  </svg>
);

export const IconHome = (p) => <Icon {...p} d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />;
export const IconBarn = (p) => <Icon {...p} d={<><path d="M3 21V10l9-6 9 6v11"/><path d="M7 21v-7h10v7"/><path d="M7 17h10"/></>} />;
export const IconHorse = (p) => <Icon {...p} d={<><path d="M4 20c0-3 1.2-5.5 3.2-7.4L5 10l2-2 3 2c1-.5 2-.7 3-.7 3.3 0 6 2.2 6 6V20"/><path d="M14 8l2-3 2 1-1 3"/><circle cx="16.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/></>} />;
export const IconCalendar = (p) => <Icon {...p} d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>} />;
export const IconBell = (p) => <Icon {...p} d={<><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></>} />;
export const IconPlus = (p) => <Icon {...p} d="M12 5v14M5 12h14" sw={1.8} />;
export const IconSearch = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>} />;
export const IconChev = (p) => <Icon {...p} d="M9 6l6 6-6 6" sw={1.8} />;
export const IconBack = (p) => <Icon {...p} d="M15 6l-6 6 6 6" sw={1.8} />;
export const IconHay = (p) => <Icon {...p} d={<><path d="M4 20l4-12 4 12M8 8l8 12M12 20l4-12 4 12"/><path d="M3 20h18"/></>} />;
export const IconLeaf = (p) => <Icon {...p} d={<><path d="M20 4c-9 0-14 5-14 11 0 3 2 5 5 5 6 0 11-5 11-14a4 4 0 0 0-2-2z"/><path d="M6 20c2-6 5-10 12-12"/></>} />;
export const IconPellet = (p) => <Icon {...p} d={<><circle cx="7" cy="9" r="2.5"/><circle cx="14" cy="7" r="2"/><circle cx="17" cy="14" r="2.5"/><circle cx="9" cy="16" r="2"/></>} />;
export const IconHeart = (p) => <Icon {...p} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />;
export const IconEdit = (p) => <Icon {...p} d={<><path d="M4 20h4l10-10-4-4L4 16z"/><path d="M14 6l4 4"/></>} />;
export const IconAlert = (p) => <Icon {...p} d={<><path d="M12 4l10 17H2z"/><path d="M12 10v5M12 18v.5"/></>} />;
export const IconCheck = (p) => <Icon {...p} d="M5 12l5 5 9-11" sw={1.8} />;
export const IconDots = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/></>} sw={2} />;
export const IconArrowUp = (p) => <Icon {...p} d="M12 19V5M6 11l6-6 6 6" />;
export const IconArrowDown = (p) => <Icon {...p} d="M12 5v14M6 13l6 6 6-6" />;
export const IconX = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" sw={1.8} />;
export const IconSave = (p) => <Icon {...p} d={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />;
export const IconTrash = (p) => <Icon {...p} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>} />;
