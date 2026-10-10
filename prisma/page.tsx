 "use client";
import { useMemo, useState } from "react";

const symbols = ["🍒","💎","⭐","🔔","🍀","7️⃣","🪙"];
type Tx = {id:number; type:string; amount:number; note:string; time:string; balance:number};
export default function Home() {
  const [tab,setTab] = useState<"game"|"admin"|"history">("game");
  const [balance,setBalance] = useState(1000);
  const [bet,setBet] = useState(20);
  const [reels,setReels] = useState(["🍒","💎","⭐"]);
  const [spinning,setSpinning] = useState(false);
  const [message,setMessage] = useState("Selamat datang! Kamu mendapat 1.000 koin demo.");
  const [amount,setAmount] = useState("100");
  const [username,setUsername] = useState("PemainDemo");
  const [tx,setTx] = useState<Tx[]>([{id:1,type:"BONUS",amount:1000,note:"Bonus awal demo",time:new Date().toLocaleString("id-ID"),balance:1000}]);
  const [adminUnlocked,setAdminUnlocked] = useState(false);
  const [adminCode,setAdminCode] = useState("");
  const stats = useMemo(()=>({plays:tx.filter(t=>t.type==="SPIN").length,rewards:tx.filter(t=>t.type==="HADIAH").reduce((s,t)=>s+t.amount,0)}),[tx]);
  function record(type:string,amt:number,note:string,newBalance:number) {
    setTx(old=>[{id:Date.now()+Math.random(),type,amount:amt,note,time:new Date().toLocaleString("id-ID"),balance:newBalance},...old].slice(0,100));
  }
  function spin() {
    if(spinning) return;
    if(balance<bet) {setMessage("Koin demo tidak cukup. Minta bonus demo dari panel admin.");return;}
    setSpinning(true); setMessage("Memutar reel…");
    const next = Array.from({length:3},()=>symbols[Math.floor(Math.random()*symbols.length)]);
    const afterCost = balance-bet; setBalance(afterCost);
    record("SPIN",-bet,"Biaya bermain arcade",afterCost);
    window.setTimeout(()=>{
      let reward = 0;
      if(next.every(s=>s===next[0])) reward = bet*10;
      else if(next.filter(s=>s==="⭐").length>=2) reward = bet*4;
      else if(next.filter(s=>s==="7️⃣").length>=2) reward = bet*3;
      const finalBalance=afterCost+reward;
      setReels(next); setBalance(finalBalance);
      if(reward) record("HADIAH",reward,"Hadiah game berdasarkan hasil reel",finalBalance);
      setMessage(reward?`✨ Kamu mendapat ${reward.toLocaleString("id-ID")} koin demo!`:"Belum dapat hadiah kali ini. Coba lagi kalau mau.");
      setSpinning(false);
    },650);
  }
  function adjust(delta:number) {
    const n=Math.floor(Number(amount));
    if(!Number.isFinite(n)||n<1||n>100000) {setMessage("Masukkan jumlah 1–100.000 koin.");return;}
    if(delta<0 && n>balance) {setMessage("Saldo demo tidak cukup.");return;}
    const b=balance+delta*n;setBalance(b);
    record(delta>0?"ADMIN +":"ADMIN −",delta*n,delta>0?"Tambah koin demo":"Kurangi koin demo",b);
    setMessage(`${delta>0?"Ditambahkan":"Dikurangi"} ${n} koin demo.`);
  }
  return <main className="shell">
    <header className="topbar"><a className="brand" href="#"><span className="brandIcon">✦</span> PURPLE<span>ARCADE</span></a><div className="profile"><div className="avatar">P</div><div><b>{username}</b><small>AKUN DEMO</small></div></div></header>
    <section className="hero"><div className="heroText"><div className="eyebrow"><span className="dot"/> ARCADE VIRTUAL • NO REAL MONEY</div><h1>Putar. Main.<br/><span>Raih Kejutan.</span></h1><p>Game arcade dengan koin virtual untuk bersenang-senang. Tidak ada deposit uang asli atau penarikan uang.</p><div className="heroActions"><button className="primary" onClick={()=>setTab("game")}>▶ Main sekarang</button><div className="balanceBox"><small>SALDO KOIN</small><b>🪙 {balance.toLocaleString("id-ID")}</b></div></div></div><div className="orb"><div className="orbInner"><span>💎</span><span>⭐</span><span>7️⃣</span></div><div className="orbit orbit1"/><div className="orbit orbit2"/></div></section>
    <nav className="tabs">{(["game","admin","history"] as const).map(t=><button key={t} className={tab===t?"tab active":"tab"} onClick={()=>setTab(t)}>{t==="game"?"🎰 Game arcade":t==="admin"?"🛡️ Panel demo":"📜 Riwayat"}</button>)}</nav>
    {tab==="game"&&<section className="gameGrid"><div className="panel machine"><div className="panelTitle"><div><small>GAME UNGGULAN</small><h2>Cosmic Reels</h2></div><span className="pill">DEMO</span></div><div className="reels">{reels.map((s,i)=><div className={"reel "+(spinning?"shake":"")} key={i}>{s}</div>)}</div><div className="rules">3 simbol sama = 10× taruhan &nbsp; • &nbsp; 2 ⭐ = 4× &nbsp; • &nbsp; 2 × 7️⃣ = 3×</div><div className="betRow"><span>Taruhan koin</span><div className="betControl"><button onClick={()=>setBet(v=>Math.max(10,v-10))}>−</button><b>{bet}</b><button onClick={()=>setBet(v=>Math.min(200,v+10))}>+</button></div></div><button className="spin" onClick={spin} disabled={spinning}>{spinning?"MEMUTAR…":"✦ PUTAR REEL ✦"}</button><p className="notice">{message}</p></div><div className="sideStack"><div className="panel mini"><small>DOMPET VIRTUAL</small><div className="bigBalance">🪙 {balance.toLocaleString("id-ID")}</div><p>Koin demo tidak memiliki nilai uang.</p></div><div className="panel mini"><small>AKTIVITAS DEMO</small><div className="metric"><span>Total putaran</span><b>{stats.plays}</b></div><div className="metric"><span>Total hadiah</span><b>{stats.rewards.toLocaleString("id-ID")}</b></div><button className="secondary full" onClick={()=>setTab("history")}>Lihat riwayat →</button></div><div className="tip">💡 <b>Info</b><br/>Hasil setiap putaran ditentukan secara acak di game demo ini.</div></div></section>}
    {tab==="admin"&&<section className="adminGrid"><div className="panel"><div className="panelTitle"><div><small>ADMINISTRASI</small><h2>Panel Admin Demo</h2></div><span className="pill">SIMULASI</span></div><p className="muted">Panel ini hanya mengubah saldo demo di perangkat ini. Belum terhubung ke akun atau database online.</p>{!adminUnlocked?<div className="form"><label>PIN demo (gunakan: 2468)</label><input value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="Masukkan PIN demo" type="password"/><button className="primary full" onClick={()=>{if(adminCode==="2468"){setAdminUnlocked(true);setMessage("Panel demo dibuka.");}else setMessage("PIN demo salah.");}}>Buka panel</button><small>PIN ini hanya untuk pratinjau lokal, jangan digunakan untuk produksi.</small></div>:<><div className="form"><label>Nama pemain demo</label><input value={username} onChange={e=>setUsername(e.target.value)} maxLength={24}/><label>Jumlah koin</label><input type="number" min="1" max="100000" value={amount} onChange={e=>setAmount(e.target.value)}/><div className="buttonRow"><button className="primary" onClick={()=>adjust(1)}>＋ Tambah koin</button><button className="danger" onClick={()=>adjust(-1)}>− Kurangi koin</button></div><button className="secondary full" onClick={()=>{setAdminUnlocked(false);setAdminCode("");}}>Kunci panel demo</button></div></>}</div><div className="panel"><small>RINGKASAN DASHBOARD</small><div className="statCards"><div><small>Saldo saat ini</small><b>{balance.toLocaleString("id-ID")}</b></div><div><small>Jumlah catatan</small><b>{tx.length}</b></div><div><small>Putaran dimainkan</small><b>{stats.plays}</b></div></div><h3>Keamanan versi online</h3><ul className="security"><li>Login admin server-side dan role admin di database.</li><li>Perubahan saldo melalui API yang memvalidasi hak akses.</li><li>Riwayat transaksi dicatat bersama saldo setelah perubahan.</li><li>Jangan menyimpan PIN atau kata sandi di kode frontend.</li></ul></div></section>}
    {tab==="history"&&<section className="panel historyPanel"><div className="panelTitle"><div><small>CATATAN AKUN</small><h2>Riwayat aktivitas</h2></div><span className="pill">{tx.length} CATATAN</span></div><div className="tableWrap"><table><thead><tr><th>Aktivitas</th><th>Jumlah koin</th><th>Saldo akhir</th><th>Waktu</th></tr></thead><tbody>{tx.map(t=><tr key={t.id}><td><b>{t.type}</b><small>{t.note}</small></td><td className={t.amount>0?"positive":t.amount<0?"negative":""}>{t.amount>0?"+":""}{t.amount.toLocaleString("id-ID")}</td><td>{t.balance.toLocaleString("id-ID")}</td><td>{t.time}</td></tr>)}</tbody></table></div><p className="muted">Riwayat ini tersimpan sementara di memori halaman dan akan reset saat halaman dimuat ulang.</p></section>}
    <footer><div className="brand">✦ PURPLE<span>ARCADE</span></div><p>Game hiburan dengan koin virtual • Bukan perjudian • Tidak menggunakan uang asli</p></footer>
  </main>;
}