import { useCallback, useEffect, useRef, useState } from 'react';
import { Footer, Header, InfoDialog } from './Components.jsx';
import { AboutPage, ArticlePage, Dashboard, GuidesPage, Home, NotFound, PlanPage, WeatherPage } from './Pages.jsx';
import { loadPlan, writeStorage } from './lib.js';

const getRoute = () => window.location.hash.slice(1) || 'beranda';
const TITLES = { beranda:'Beranda', rencana:'Rencana Tanam', 'ubah-rencana':'Ubah Rencana', dashboard:'Dashboard Lahan', cuaca:'Cuaca', panduan:'Panduan', tentang:'Tentang Kami' };

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [savedPlan, setSavedPlan] = useState(loadPlan);
  const [info, setInfo] = useState(null);
  const [message, setMessage] = useState('');
  const main = useRef(null);
  const toastTimer = useRef(null);
  const notify = useCallback(text => {
    clearTimeout(toastTimer.current);
    setMessage(text);
    toastTimer.current=setTimeout(()=>setMessage(''),4200);
  },[]);

  useEffect(()=>{
    const updateRoute=()=>setRoute(getRoute());
    window.addEventListener('hashchange',updateRoute);
    return ()=>window.removeEventListener('hashchange',updateRoute);
  },[]);
  useEffect(()=>()=>clearTimeout(toastTimer.current),[]);
  useEffect(()=>{
    document.title=`${TITLES[route] || (route.startsWith('panduan/')?'Panduan':'Halaman tidak ditemukan')} — TemanTani`;
    window.scrollTo(0,0);
    main.current?.focus({preventScroll:true});
  },[route]);

  function savePlan(plan, editing) {
    const persisted=writeStorage('temantani.plan',plan);
    setSavedPlan(plan);
    window.location.hash='dashboard';
    notify(persisted?(editing?'Perubahan rencana disimpan.':'Rencana tanam disimpan.'):'Penyimpanan browser tidak tersedia. Rencana hanya tersimpan selama aplikasi terbuka.');
  }
  let page;
  if (route==='beranda') page=<Home savedPlan={savedPlan}/>;
  else if (route==='rencana' || route==='ubah-rencana') page=<PlanPage key={route} savedPlan={savedPlan} editing={route==='ubah-rencana'} onSave={savePlan} notify={notify}/>;
  else if (route==='dashboard') page=<Dashboard savedPlan={savedPlan} notify={notify}/>;
  else if (route==='cuaca') page=<WeatherPage savedPlan={savedPlan}/>;
  else if (route==='panduan') page=<GuidesPage/>;
  else if (route.startsWith('panduan/')) page=<ArticlePage id={route.split('/')[1]}/>;
  else if (route==='tentang') page=<AboutPage/>;
  else page=<NotFound/>;

  return <>
    <a href="#main" className="skip-link" onClick={event=>{event.preventDefault();main.current.focus();main.current.scrollIntoView();}}>Lewati ke konten</a>
    <Header route={route} onInfo={setInfo}/>
    <main id="main" tabIndex={-1} ref={main}>{page}</main>
    <Footer onInfo={setInfo}/>
    <div id="toast" className={message?'show':''} role="status" aria-live="polite">{message}</div>
    <InfoDialog info={info} onClose={()=>setInfo(null)}/>
  </>;
}
