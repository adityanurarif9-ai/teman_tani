import { useRef, useState } from 'react';
import { articles, DEFAULT_PLAN, LOCATIONS, VARIETIES } from './data.js';
import { addDays, asset, formatDate, normalizePlan, readStorage, validPlan, writeStorage } from './lib.js';
import { Calendar, GuideCard, Heading, Journey, Select, WeatherSection } from './Components.jsx';

export function Home({ savedPlan }) {
  const [example, setExample] = useState(()=>({...savedPlan||DEFAULT_PLAN}));
  const tools = [
    ['Rencana Tanam','Susun jadwal sesuai lahan, varietas, dan musim tanam.','Mulai rencanakan','rencana','plan.svg'],
    ['Perkiraan Panen','Ketahui perkiraan waktu panen dari awal masa tanam.','Hitung perkiraan','rencana','harvest.svg'],
    ['Cuaca Lahan','Lihat prakiraan cuaca sebelum beraktivitas di sawah.','Cek cuaca','cuaca','weather.svg'],
    ['Panduan Budidaya','Temukan pengetahuan praktis untuk tanaman yang sehat.','Baca panduan','panduan','guide.svg'],
  ];
  return <>
    <section className="hero"><img className="hero-photo" src={asset('terraces.png')} alt="Petani berjalan di sawah terasering yang hijau"/><div className="container"><span className="pill">UNTUK PETANI, DARI HATI</span><h1>Tanam terencana.<br/>Panen lebih<br/>bermakna.</h1><p className="intro">Teman di setiap musim. Rencanakan tanam, pantau<br/>cuaca, dan rawat tanaman dengan langkah yang tepat.</p><div className="row"><a className="btn" href="#rencana">Buat Rencana Tanam <span aria-hidden="true">↗</span></a><a className="btn secondary" href="#panduan">Jelajahi Panduan</a></div><p className="small">Gratis untuk memulai · Mudah digunakan · Bahasa Indonesia</p><div className="field-insight accent"><div><span className="eyebrow">SETIAP MUSIM, PELUANG BARU</span><h3>Langkah kecil hari ini,<br/>hasil lebih baik esok hari.</h3></div><a className="round" href="#panduan" aria-label="Jelajahi panduan">↗</a></div></div></section>
    <section className="tools white"><img className="contours" src={asset('contours.png')} alt=""/><div className="container"><div className="section-heading"><h2>Satu tempat, untuk setiap langkah.</h2><p>Dari persiapan lahan hingga waktu panen.</p></div><div className="tool-grid">{tools.map(([title,description,label,route,icon],i)=><article className={`tool-card card accent ${i===0||i===3?'gold':''}`} key={title}><span className="tool-icon"><img src={asset(icon)} alt=""/></span><h3><a href={`#${route}`}>{title}</a></h3><p>{description}</p><a className="text-link" href={`#${route}`}>{label} ↗</a></article>)}</div></div></section>
    <WeatherSection/>
    <section className="home-plan"><div className="container home-plan-grid"><div className="home-plan-copy"><span className="eyebrow">RENCANA YANG LEBIH TERARAH</span><h2>Musim baru,<br/>rencana baru.</h2><p>Kenali kebutuhan lahan Anda. Susun langkah budidaya dari semai sampai perkiraan panen, dalam satu kalender yang mudah dipahami.</p>{[['Kenali lahan Anda','Pilih lokasi dan komoditas yang ditanam.'],['Tentukan awal tanam','Catat varietas dan tanggal mulai semai.'],['Ikuti alur musimnya','Jadikan kalender panduan aktivitas Anda.']].map(([title,description],i)=><div className="step" key={title}><span className="step-number">0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}<a className="text-link" href="#rencana">Buat rencana saya ↗</a></div><div><Calendar plan={example} onChange={setExample} saved={Boolean(savedPlan)} home/><p className="calendar-note">*Simulasi umur varietas. Waktu panen dapat berubah sesuai kondisi lahan dan cuaca.</p></div></div></section>
    <section className="guides white"><div className="container"><span className="eyebrow">BELAJAR, LALU TUMBUH BERSAMA</span><div className="section-heading row between"><h2>Bekal pengetahuan untuk lahan Anda.</h2><a className="text-link" href="#panduan">Semua panduan ↗</a></div><div className="guide-grid">{articles.map(article=><GuideCard article={article} key={article.id}/>)}</div></div></section>
    <section className="season-cta container"><img className="terrace-accent" src={asset('terrace-accent.png')} alt=""/><div><span className="eyebrow">MUSIM BAIK DIMULAI DARI RENCANA BAIK</span><h2>Siap menyambut musim tanam berikutnya?</h2><p>Mulai susun rencana Anda. Satu langkah hari ini untuk lahan yang lebih terawat.</p></div><div className="cta-actions"><a className="btn" href="#rencana">Buat Rencana Tanam ↗</a><p>Gratis dan mudah untuk memulai</p></div></section>
  </>;
}

export function PlanPage({ savedPlan, editing = false, onSave, notify }) {
  const [draft, setDraft] = useState(()=>({...savedPlan||DEFAULT_PLAN}));
  const [calendarPlan, setCalendarPlan] = useState(()=>({...savedPlan||DEFAULT_PLAN}));
  const [resetKey, setResetKey] = useState(0);
  const form = useRef(null);
  const update = (field, value) => setDraft(current=>({...current,[field]:value}));
  function updateCrop(crop) {
    const variety = Object.keys(VARIETIES[crop])[0];
    setDraft(current=>({...current,crop,variety,days:VARIETIES[crop][variety]}));
  }
  function updateVariety(variety) { setDraft(current=>({...current,variety,days:VARIETIES[current.crop][variety]})); }
  function validate() {
    if (!form.current.reportValidity()) return null;
    const values = Object.fromEntries(new FormData(form.current));
    if (!validPlan(values)) { notify('Periksa kembali nama, tanggal, dan luas lahan.'); return null; }
    return normalizePlan(values);
  }
  function refresh(event) {
    event.preventDefault();
    const normalized = validate();
    if (!normalized) return;
    setCalendarPlan(normalized); setDraft(normalized); setResetKey(value=>value+1);
    notify('Kalender diperbarui. Konfirmasi untuk menyimpan rencana.');
  }
  function save() { const normalized = validate(); if (normalized) onSave(normalized, editing); }
  function calendarChange(next) {
    setCalendarPlan(next);
    setDraft(current=>({...current,location:next.location,crop:next.crop,variety:next.variety,days:next.days,date:next.date}));
  }
  return <>
    <Heading breadcrumb={editing?'Dashboard Lahan / Ubah Rencana':'Beranda / Rencana Tanam'} title={editing?'Sesuaikan rencana, lanjutkan musim Anda.':'Rencana baik untuk musim yang baik.'} description={editing?'Tinjau data yang sudah terisi. Simpan perubahan atau batalkan untuk kembali ke dashboard lahan.':'Susun jadwal budidaya berdasarkan lahan dan varietas Anda, dari semai hingga perkiraan panen.'} pill={editing?null:savedPlan?'RENCANA TERSIMPAN DI BROWSER':'CONTOH RENCANA · MUSIM 2026/27'}/>
    <div className="container plan-layout">
      <form className="plan-form card accent" ref={form} onSubmit={refresh}>
        <h2>Detail rencana tanam</h2><p>Isi data awal sebagai acuan kalender Anda.</p>
        <div className="form-field"><label htmlFor="name">Nama lahan</label><input id="name" name="name" required maxLength={80} value={draft.name} onInput={event=>update('name',event.target.value)}/></div>
        <div className="form-field"><Select label="Lokasi lahan" name="location" value={draft.location} values={LOCATIONS} onChange={location=>update('location',location)}/></div>
        <div className="field-pair form-field"><Select label="Komoditas" name="crop" value={draft.crop} values={Object.keys(VARIETIES)} onChange={updateCrop}/><Select label="Varietas" name="variety" value={draft.variety} values={Object.keys(VARIETIES[draft.crop])} onChange={updateVariety}/></div>
        <div className="field-pair date-area form-field"><label>Mulai semai<input type="date" name="date" min="2000-01-01" max="2100-12-31" required value={draft.date} onInput={event=>update('date',event.target.value)}/></label><label>Luas lahan (ha)<input name="area" type="number" min="0.01" max="100000" step="0.01" required value={draft.area} onInput={event=>update('area',event.target.value)}/></label></div>
        <div className="variety-note">Contoh acuan umur varietas: ±{draft.days} hari dari semai.<br/>Sesuaikan kembali dengan label benih Anda.</div>
        <button className="btn full" type="submit">Perbarui kalender ↗</button><p className="form-note">Simulasi tampilan. Hasil bukan jaminan waktu panen.</p>
      </form>
      <div><Calendar plan={calendarPlan} onChange={calendarChange} saved={Boolean(savedPlan)} resetKey={resetKey}/><div className="field-note"><h3>Catat kondisi nyata di lapangan</h3><p>Umur varietas hanyalah acuan. Air, cuaca, dan kesehatan tanaman dapat menggeser waktu panen.</p></div><div className="plan-actions">{editing && <a className="btn secondary" href="#dashboard" onClick={()=>notify('Perubahan dibatalkan.')}>Batal</a>}<button className="btn full" onClick={save}>{editing?'Simpan Perubahan':'Konfirmasi Rencana & Pantau Lahan →'}</button></div></div>
    </div><Journey plan={calendarPlan}/>
  </>;
}

export function Dashboard({ savedPlan, notify }) {
  const [notes, setNotes] = useState(()=>{ const saved=readStorage('temantani.notes',''); return typeof saved==='string'?saved:''; });
  if (!savedPlan) return <><Heading breadcrumb="Beranda / Dashboard Lahan" title="Mulai perjalanan musim Anda." description="Buat rencana tanam untuk mulai memantau lahan."/><div className="container dashboard"><a className="btn" href="#rencana">Buat Rencana Tanam</a></div></>;
  const rows=[['Lokasi lahan',savedPlan.location],['Komoditas & varietas',`${savedPlan.crop} · ${savedPlan.variety}`],['Luas lahan',`${savedPlan.area} ha`],['Mulai semai',formatDate(savedPlan.date,true)],['Perkiraan panen*',formatDate(addDays(savedPlan.date,savedPlan.days),true)]];
  return <><Heading breadcrumb="Beranda / Dashboard Lahan" title={savedPlan.name} description="Rencana dan catatan lahan Anda tersimpan di browser ini." pill="RENCANA AKTIF"/><div className="container dashboard"><div className="dashboard-grid"><section className="dashboard-card card accent"><div className="row between"><h2>Ringkasan rencana</h2><a className="text-link" href="#ubah-rencana">Ubah rencana ↗</a></div><dl>{rows.map(([title,value])=><div className="detail-row" key={title}><dt>{title}</dt><dd>{value}</dd></div>)}</dl><p className="small">*Simulasi umur varietas. Sesuaikan dengan kondisi lahan dan cuaca.</p></section><section className="dashboard-card card accent gold"><h2>Catatan lapangan</h2><form onSubmit={event=>{event.preventDefault();notify(writeStorage('temantani.notes',notes)?'Catatan lapangan disimpan.':'Penyimpanan browser tidak tersedia. Catatan belum tersimpan.');}}><label htmlFor="notes">Catat kondisi tanaman dan aktivitas lahan</label><textarea id="notes" maxLength={5000} value={notes} onInput={event=>setNotes(event.target.value)} placeholder="Misalnya: kondisi air dan perkembangan bibit..."/><button className="btn" type="submit">Simpan catatan</button></form></section></div></div><Journey plan={savedPlan}/></>;
}

export function GuidesPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const matches=articles.filter(article=>(category==='Semua'||article.category===category)&&`${article.title} ${article.category} ${article.description}`.toLocaleLowerCase('id').includes(query.toLocaleLowerCase('id')));
  return <><Heading breadcrumb="Beranda / Panduan" title="Bekal pengetahuan untuk lahan Anda." description="Temukan pengetahuan praktis untuk tanaman yang sehat."/><section className="container section guides-page"><div className="filter-row"><input type="search" aria-label="Cari panduan" placeholder="Cari panduan..." value={query} onInput={event=>setQuery(event.target.value)}/>{['Semua',...articles.map(a=>a.category)].map(c=><button key={c} onClick={()=>setCategory(c)} className={c===category?'active':''} aria-pressed={c===category}>{c}</button>)}</div><div className="guide-grid" aria-live="polite">{matches.length?matches.map(article=><GuideCard key={article.id} article={article}/>):<p className="empty" role="status">Panduan tidak ditemukan. Coba kata kunci lain atau pilih Semua.</p>}</div><p className="small guide-note">Panduan ringkas. Sesuaikan kegiatan budidaya dengan kondisi lapangan dan arahan penyuluh.</p></section></>;
}

export function ArticlePage({ id }) {
  const article=articles.find(a=>a.id===id);
  if (!article) return <NotFound/>;
  return <><Heading breadcrumb={<><a href="#panduan">Panduan</a> / {article.category}</>} title={article.title} description={`${article.category} · ${article.minutes} menit baca`}/><article className="article container"><img className="guide-image" src={asset(article.image)} alt={article.category}/><p>{article.description}</p>{article.sections.map(([title,description])=><section key={title}><h2>{title}</h2><p>{description}</p></section>)}<p className="callout">Gunakan kalender sebagai acuan awal. Sesuaikan langkah dengan kondisi tanaman, lahan, dan cuaca.</p><div className="row between"><a className="text-link" href="#panduan">Kembali ke panduan</a><a className="btn" href="#rencana">Buat Rencana Tanam</a></div></article></>;
}

export function WeatherPage({ savedPlan }) {
  const [location, setLocation] = useState(savedPlan?.location||LOCATIONS[0]);
  return <><Heading breadcrumb="Beranda / Cuaca" title="Kenali cuacanya. Siapkan langkahnya." description="Lihat contoh prakiraan cuaca sebelum beraktivitas di sawah."/><div className="container weather-page"><div className="weather-select"><Select label="Lokasi lahan" value={location} values={LOCATIONS} onChange={setLocation}/></div><WeatherSection location={location} full/><div className="field-note"><h3>Contoh tampilan cuaca</h3><p>Data ini merupakan contoh tetap dari desain, bukan prakiraan saat ini. Perubahan lokasi hanya mengganti lokasi contoh. Untuk informasi terbaru, kunjungi <a className="text-link" href="https://www.bmkg.go.id/" target="_blank" rel="noopener noreferrer">BMKG</a>.</p></div></div></>;
}

export function AboutPage() {
  return <><Heading breadcrumb="Beranda / Tentang Kami" title="Teman di setiap musim." description="Teman bertumbuh bagi petani Indonesia."/><div className="container about"><h2>Dari rencana di awal musim,<br/>hingga cerita di waktu panen.</h2><p>TemanTani membantu Anda menyusun rencana tanam, melihat contoh cuaca lahan, dan menemukan panduan budidaya dalam Bahasa Indonesia.</p><p>Mulai dari mengenali lahan, mencatat awal semai, hingga mengikuti alur musim melalui kalender tanam.</p><a className="btn" href="#rencana">Mulai Bertani</a></div></>;
}
export function NotFound() {
  return <><Heading breadcrumb="TemanTani" title="Halaman tidak ditemukan." description="Kembali ke Beranda untuk melanjutkan."/><div className="container section"><a className="btn" href="#beranda">Kembali ke Beranda</a></div></>;
}

