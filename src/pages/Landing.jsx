import React from "react";
import { useNavigate } from "react-router-dom";

const font = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';

const styles = {
 wrap: { fontFamily: font, color: '#0f172a' },
 container: { maxWidth: 800, margin: '0 auto', padding: '4px' },
  hero: { display: 'grid', gridTemplateColumns: '4fr 1fr', gap: 4, alignItems: 'center', padding: '48px 0' },
  h1: { fontSize: 40, fontWeight: 800, margin: 0, lineHeight: 1.1 },
  p: { fontSize: 18, color: '#334155' },
 btn: { background: '#2563eb', color: '#fff', padding: '12px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600 },
 ghost: { background: '#0f172a', color:'#fff', padding:'8px 12px', borderRadius: 8, border:'none', cursor:'pointer', fontSize:14, fontWeight:600 },
 card: { background:'#fff', border:'1px solid #e5e7eb', borderRadius:16, padding:16 },
 grid3: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 },
 sectionH: { fontSize: 28, fontWeight: 800, margin: '24px 0 12px' },
 ytWrap: { position:'relative', paddingTop:'56.25%', borderRadius:16, overflow:'hidden', border:'1px solid #e5e7eb' },
 yt: { position:'absolute', top:0, left:0, width:'100%', height:'100%', border:0 },
 footer: { marginTop: 48, padding:'24px 0', color:'#475569', fontSize:14, textAlign:'center' }
};

export default function Landing() {
  const nav = useNavigate();

  return (
    <div style={styles.wrap}>
      <header style={{ borderBottom:'1px solid #e5e7eb' }}>
        <div style={{ ...styles.container, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {/* ZMODYFIKOWANA SEKCJA: dodano logo.svg */}
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <img src="/logo.svg" alt="KickMy.app Logo" width="160" height="160" />
            <strong></strong>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button style={styles.ghost} onClick={() => nav('/app')}>Otwórz konfigurator</button>
          </div>
        </div>
      </header>

      <main style={styles.container}>
        {/* HERO */}
        <section style={styles.hero}>
          <div>
            <h1 style={styles.h1}>Konfigurator prostych stron www dla małych biznesów</h1>
            <p style={styles.p}>
              W kilka minut złożysz stronę z sekcjami: hero, oferta, cennik, opinie, galeria i więcej.
              Gotowy eksport i instrukcja wdrożenia.
            </p>
            <div style={{ display:'flex', gap:12, marginTop:16 }}>
              <button style={styles.btn} onClick={() => nav('/app')}>Uruchom konfigurator</button>
              <a href="#jak-to-dziala" style={{ alignSelf:'center', textDecoration:'none' }}>Zobacz jak to działa ↓</a>
            </div>
          </div>
                  </section>

        {/* JAK TO DZIAŁA */}
        <section id="jak-to-dziala">
          <h2 style={styles.sectionH}>Jak to działa</h2>
          <div style={styles.grid3}>
            <div style={styles.card}>
              <h3>Krok 1 – Wybierz preset</h3>
              <p style={styles.p}>Branża i gotowe sekcje. Wszystko edytowalne.</p>
            </div>
            <div style={styles.card}>
              <h3>Krok 2 – Dostosuj treści</h3>
              <p style={styles.p}>Kolory, nagłówki, oferta, cennik, opinie, galeria…</p>
            </div>
            <div style={styles.card}>
              <h3>Krok 3 – Eksport i wdrożenie</h3>
              <p style={styles.p}>Pobierz paczkę, wgraj na hosting (dołączamy instrukcję).</p>
            </div>
          </div>
        </section>

       {/* WIDEO */}
<section>
  <h2 style={styles.sectionH}>Zobacz wideo</h2>
  <div style={styles.ytWrap}>
    <iframe
      style={styles.yt}
      src="https://www.youtube-nocookie.com/embed/WXV4ym8eCdU?rel=0&modestbranding=1"
      title="KickMy.app – demo"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  </div>
</section>

        {/* KONTAKT – Netlify Forms */}
        <section>
          <h2 style={styles.sectionH}>Kontakt</h2>
          <div style={styles.card}>
            <form 
             name="contact"
             method="POST"
             data-netlify="true"
             data-netlify-honeypot="bot-field"
             action="/thanks.html"
          >
              <input type="hidden" name="form-name" value="contact" />
              <p style={{ display:'none' }}>
                <label>Don’t fill this out: <input name="bot-field" /></label>
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label>Imię i nazwisko</label>
                  <input name="name" required style={{ width:'100%', padding:'10px', border:'1px solid #e5e7eb', borderRadius:8 }} />
                </div>
                <div>
                  <label>E-mail</label>
                  <input type="email" name="email" required style={{ width:'100%', padding:'10px', border:'1px solid #e5e7eb', borderRadius:8 }} />
                </div>
              </div>
              <div style={{ marginTop:12 }}>
                <label>Wiadomość</label>
                <textarea name="message" rows="5" required style={{ width:'100%', padding:'10px', border:'1px solid #e5e7eb', borderRadius:8 }} />
              </div>
              <div style={{ marginTop:12, display:'flex', gap:12 }}>
                <button type="submit" style={styles.btn}>Wyślij</button>
                <button type="button" style={styles.ghost} onClick={() => (window.location.href='/app')}>Przejdź do konfiguratora</button>
              </div>
            </form>
          </div>
        </section>

        <section style={{ marginTop: 24, textAlign:'center' }}>
          <button style={{ ...styles.btn, padding:'14px 22px', fontSize:18 }} onClick={() => nav('/app')}>
            Zbuduj swoją stronę teraz
          </button>
        </section>
      </main>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} KickMy.app — proste strony dla małych biznesów
      </footer>
    </div>
  );
}