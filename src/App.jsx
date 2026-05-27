import { useState } from 'react';
import { StoreProvider, useStore } from './data/store';
import TabBar from './components/TabBar';
import ScreenHome from './screens/Home';
import ScreenBodega from './screens/Bodega';
import ScreenCaballos from './screens/Caballos';
import ScreenCalendar from './screens/Calendar';
import ScreenHorseDetail from './screens/HorseDetail';
import Onboarding from './screens/Onboarding';
import AddHorseModal from './components/modals/AddHorseModal';
import AddPurchaseModal from './components/modals/AddPurchaseModal';
import EditStockModal from './components/modals/EditStockModal';
import {
  EditVitaminModal, AddVitaminModal, LogConsumptionModal,
  AddEventModal, RegisterServiceModal,
} from './components/modals/OtherModals';

function AppInner() {
  const { state } = useStore();
  const [tab, setTab] = useState('home');
  const [horseId, setHorseId] = useState(null);
  const [modal, setModal] = useState(null); // { type, ...params }

  const horse = horseId ? state.horses.find(h => h.id === horseId) : null;

  function go(opts) {
    if (opts.tab)     setTab(opts.tab);
    if (opts.horseId !== undefined) setHorseId(opts.horseId);
    if (opts.modal)   setModal({ type: opts.modal, ...opts });
  }

  function closeModal() { setModal(null); }

  const showDetail = !!horseId;

  if (!state.onboarded) {
    return (
      <div className="phone-wrap">
        <div className="phone-scroll">
          <Onboarding/>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-wrap">
      <div className="phone-scroll">
        {showDetail
          ? <ScreenHorseDetail horse={horse} back={() => setHorseId(null)} go={go}/>
          : tab === 'home'     ? <ScreenHome go={go}/>
          : tab === 'bodega'   ? <ScreenBodega go={go}/>
          : tab === 'caballos' ? <ScreenCaballos go={(o) => { if (o.horseId) setHorseId(o.horseId); else go(o); }}/>
          : tab === 'calendar' ? <ScreenCalendar go={go}/>
          : null}

        {/* Modals */}
        {modal?.type === 'addHorse' && <AddHorseModal onClose={closeModal}/>}
        {modal?.type === 'editHorse' && (
          <AddHorseModal
            initialData={state.horses.find(h => h.id === modal.horseId)}
            onClose={() => { closeModal(); }}
          />
        )}
        {modal?.type === 'addPurchase' && <AddPurchaseModal onClose={closeModal}/>}
        {modal?.type === 'editStock' && <EditStockModal stockId={modal.stockId} onClose={closeModal}/>}
        {modal?.type === 'editVitamin' && <EditVitaminModal vitaminId={modal.vitaminId} onClose={closeModal}/>}
        {modal?.type === 'addVitamin' && <AddVitaminModal onClose={closeModal}/>}
        {modal?.type === 'logConsumption' && <LogConsumptionModal onClose={closeModal}/>}
        {modal?.type === 'addEvent' && <AddEventModal onClose={closeModal}/>}
        {modal?.type === 'registerService' && <RegisterServiceModal horseId={modal.horseId} onClose={closeModal}/>}
      </div>

      {!showDetail && <TabBar tab={tab} setTab={setTab}/>}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppInner/>
    </StoreProvider>
  );
}
