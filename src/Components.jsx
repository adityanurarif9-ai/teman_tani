import { useEffect, useRef, useState } from 'react';
import { LOCATIONS, VARIETIES } from './data.js';
import { addDays, asset, dateKey, formatDate, parseDate } from './lib.js';

export function Header({ route, onInfo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { setMenuOpen(false); }, [route]);
  const home = route === 'beranda';
  return <header className={home?'home-header':''}><div className="container">
    <a className="logo" href="#beranda" aria-label="TemanTani, Beranda">temantani{!home && <span className="logo-dot">•</span>}</a>
    <nav className={`nav ${menuOpen?'open':''}`} id="navigation" aria-label="Navigasi utama">
      {[['beranda','Beranda'],['rencana','Rencana Tanam'],['cuaca','Cuaca'],['panduan','Panduan'],['tentang','Tentang Kami']].map(([id,title]) => {
        const active = route===id || id==='rencana'&&['dashboard','ubah-rencana'].includes(route) || id==='panduan'&&route.startsWith('panduan/');
        return <a href={`#${id}`} key={id} className={active?'active':undefined} aria-current={active?'page':undefined}>{title}{home&&active && <img className="nav-underline" src={asset('line.svg')} alt="" />}</a>;
      })}
    </nav>
    <div className="header-actions">{home && <button className="login" onClick={()=>onInfo('masuk')}>Masuk</button>}<a className="btn" href="#rencana">Mulai Bertani <span aria-hidden="true">↗</span></a></div>
    <button className="menu" aria-label="Buka menu" aria-controls="navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(open=>!open)}>☰</button>
  </div></header>;
}

export function Footer({ onInfo }) {
  return <footer><div className="container"><div className="footer-grid">
    <div className="footer-brand"><a className="logo" href="#beranda">temantani</a><p>Teman bertumbuh bagi petani Indonesia.<br/>Dari rencana di awal musim,<br/>hingga cerita di waktu panen.</p></div>
    <div className="footer-column"><h3>JELAJAHI</h3><a href="#rencana">Rencana Tanam</a><a href="#rencana">Perkiraan Panen</a><a href="#cuaca">Cuaca Lahan</a></div>
    <div className="footer-column"><h3>BELAJAR</h3><a href="#panduan">Panduan Budidaya</a><a href="#tentang">Tentang TemanTani</a><button onClick={()=>onInfo('bantuan')}>Pusat Bantuan</button></div>
    <div className="footer-column"><h3>MARI TERHUBUNG</h3>{['Hubungi Kami','Instagram','WhatsApp'].map(label=><button key={label} onClick={()=>onInfo('kontak')}>{label} ↗</button>)}</div>
  </div><div className="footer-bottom"><span>© 2026 TemanTani. Bertumbuh bersama, dari tanah sendiri.</span><div className="row"><button onClick={()=>onInfo('privasi')}>Kebijakan Privasi</button><button onClick={()=>onInfo('ketentuan')}>Ketentuan</button></div></div></div></footer>;
}

export function Heading({ breadcrumb, title, description, pill }) {
  return <div className="container page-heading"><p className="breadcrumb">{breadcrumb}</p><h1>{title}</h1><p>{description}</p>{pill && <span className="pill">{pill}</span>}</div>;
}

export function Select({ label, value, values, onChange, ...props }) {
  return <label>{label}<select {...props} value={value} onChange={event=>onChange(event.target.value)}>{values.map(item=><option key={item} value={item}>{item}</option>)}</select></label>;
}

export function Calendar({ plan, onChange, saved = false, home = false, resetKey = 0 }) {
  const [month, setMonth] = useState(()=>parseDate(plan.date));
  useEffect(()=>{ setMonth(parseDate(plan.date)); }, [plan.date, resetKey]);
  const first = new Date(month.getFullYear(),month.getMonth(),1,12);
  const offset = (first.getDay()+6)%7;
  const count = new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const start = parseDate(plan.date).getTime();
  const moveMonth = delta => setMonth(current=>new Date(current.getFullYear(),current.getMonth()+delta,1,12));
  return <section className={`calendar card accent ${home?'':'gold'}`} aria-label="Kalender tanam">
    <div className="row between"><h3>Kalender tanam Anda</h3><span className="badge">{saved?'Rencana Anda':'Contoh rencana'}</span></div>
    <div className="calendar-fields">
      <Select label="Lokasi lahan" value={plan.location} values={LOCATIONS} onChange={location=>onChange({...plan,location})}/>
      <Select label="Komoditas & varietas" value={`${plan.crop} · ${plan.variety}`} values={Object.entries(VARIETIES).flatMap(([crop,vs])=>Object.keys(vs).map(v=>`${crop} · ${v}`))} onChange={value=>{ const [crop,variety]=value.split(' · '); onChange({...plan,crop,variety,days:VARIETIES[crop][variety]}); }}/>
    </div>
    <hr className="calendar-rule"/>
    <div className="calendar-month row between"><h4>{month.toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</h4><div className="row"><button type="button" onClick={()=>moveMonth(-1)} aria-label="Bulan sebelumnya">‹</button><button type="button" onClick={()=>moveMonth(1)} aria-label="Bulan berikutnya">›</button></div></div>
    <div className="calendar-grid">
      {['SEN','SEL','RAB','KAM','JUM','SAB','MIN'].map(day=><span className="weekday" key={day}>{day}</span>)}
      {Array.from({length:offset},(_,i)=><span key={`blank-${i}`}/>)}
      {Array.from({length:count},(_,i)=>{
        const date = new Date(first.getFullYear(),first.getMonth(),i+1,12);
        const key = dateKey(date);
        const diff = Math.round((date.getTime()-start)/86400000);
        return <button key={key} type="button" className={`day ${diff>=0&&diff<7?'sowing':''} ${diff===0?'selected':''}`} aria-label={`Pilih ${formatDate(date,true)} sebagai mulai semai`} aria-pressed={diff===0} disabled={key<'2000-01-01'||key>'2100-12-31'} onClick={()=>onChange({...plan,date:key})}>{i+1}</button>;
      })}
    </div>
    <div className="summary"><div><small>Mulai semai</small><strong>{formatDate(plan.date)}</strong></div><div><small>Perkiraan panen*</small><strong>{formatDate(addDays(plan.date,plan.days))}</strong></div><strong>±{plan.days} hari</strong></div>
  </section>;
}

export function Journey({ plan }) {
  const stages = [
    [formatDate(plan.date,true),'Mulai semai','Catat benih yang digunakan dan perkembangan awal persemaian.'],
    [formatDate(addDays(plan.date,21),true),'Tinjau kesiapan pindah tanam','Periksa kesiapan bibit, lahan, dan ketersediaan air.'],
    [`Sekitar ${formatDate(addDays(plan.date,plan.days),true)}`,'Periksa tanda siap panen','Amati kondisi bulir dan malai; konfirmasikan dengan penyuluh.'],
  ];
  return <section className="journey white"><div className="container"><div className="section-heading"><h2>Catatan untuk perjalanan musim Anda</h2><p>Contoh tahapan berdasarkan rencana di atas; bukan jadwal perlakuan yang wajib diikuti.</p></div><div className="journey-grid">{stages.map(([date,title,description],i)=><article className={`journey-card card accent ${i===2?'gold':''}`} key={title}><div className="row"><strong>0{i+1}</strong><span>{date}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>;
}

export function WeatherSection({ location = LOCATIONS[0], full = false }) {
  const forecasts = [['Hari ini','Kamis, 12 Nov',28,'Cerah berawan',20,'sun.svg'],['Besok','Jumat, 13 Nov',26,'Hujan ringan',70,'rain.svg'],['Lusa','Sabtu, 14 Nov',27,'Cerah berawan',30,'sun.svg']];
  return <section className="weather-band"><img src={asset('rice-accent.png')} className="weather-decoration" alt=""/><div className="container"><div className="weather-layout">{!full && <div><span className="eyebrow">SEBELUM TURUN KE SAWAH</span><h2>Kenali cuacanya.<br/>Siapkan langkahnya.</h2><p className="weather-copy">Rencanakan aktivitas lahan dengan<br/>melihat prakiraan cuaca di sekitar Anda.</p><a className="btn lime" href="#cuaca">Lihat Cuaca Lahan <span aria-hidden="true">↗</span></a></div>}<div><div className="weather-location">{location} ⌄</div><p className="weather-disclaimer">Contoh prakiraan · bukan data cuaca langsung · 12–14 November 2026</p><div className="weather-cards">{forecasts.map(([day,date,temp,condition,chance,icon])=><div className="weather-card" key={day}><h3>{day}</h3><p className="date">{date}</p><span className="weather-icon"><img src={asset(icon)} alt=""/></span><div className="temperature">{temp}°</div><div className="condition">{condition}</div><p className="chance">Peluang hujan {chance}%</p></div>)}</div></div></div><p className="weather-foot"><span>CATATAN LAPANGAN</span>Periksa prakiraan terbaru dari kanal resmi sebelum menentukan jadwal penyemprotan atau pemupukan.</p></div></section>;
}

export function GuideCard({ article }) {
  return <article className="guide-card"><a href={`#panduan/${article.id}`} aria-label={`Baca ${article.title}`}><img className="guide-image" src={asset(article.image)} alt={article.category} loading="lazy"/></a><span className="eyebrow">{article.category.toUpperCase()}</span><h3><a href={`#panduan/${article.id}`}>{article.title}</a></h3><p>{article.description}</p><div className="row between"><span className="muted">{article.minutes} menit baca</span><a className="text-link" href={`#panduan/${article.id}`}>Baca ↗</a></div></article>;
}

const MESSAGES = {
  masuk:['Selamat datang di TemanTani','Gunakan TemanTani langsung tanpa akun. Rencana dan catatan disimpan di browser pada perangkat ini.'],
  bantuan:['Pusat Bantuan','Isi Detail rencana tanam, lalu klik Perbarui kalender untuk melihat perkiraan panen. Klik Konfirmasi Rencana untuk menyimpannya. Anda dapat mengubah atau membatalkan perubahan melalui Dashboard Lahan.'],
  kontak:['Mari terhubung','Informasi kontak dan akun media sosial TemanTani belum dikonfigurasi pada versi lokal ini.'],
  privasi:['Kebijakan Privasi','Rencana dan catatan lahan disimpan di penyimpanan browser (localStorage). Data tersebut tidak dikirim ke server. Menghapus data browser akan menghapus rencana dan catatan tersimpan.'],
  ketentuan:['Ketentuan Penggunaan','Kalender merupakan simulasi berdasarkan umur varietas. Hasil bukan jaminan waktu panen. Cuaca yang ditampilkan merupakan contoh dari desain, bukan data cuaca langsung.'],
};
export function InfoDialog({ info, onClose }) {
  const ref = useRef(null);
  useEffect(()=>{ if (info && !ref.current.open) ref.current.showModal(); else if (!info && ref.current.open) ref.current.close(); },[info]);
  const [title,body] = MESSAGES[info] || ['', ''];
  return <dialog ref={ref} onClose={onClose} aria-labelledby="info-title"><button className="dialog-close" aria-label="Tutup" onClick={onClose}>×</button><h2 id="info-title">{title}</h2><p>{body}</p>{info==='masuk' && <a className="btn full" href="#dashboard" onClick={onClose}>Lihat lahan saya</a>}</dialog>;
}
