
import React from 'react'

function Hero({title, desc}){
  return <section className="section" style={{background:'linear-gradient(135deg, var(--brand) 0%, #60a5fa 100%)', color:'#fff'}}>
    <h1 style={{margin:'0 0 6px 0'}}>{title||'Twoja firma'}</h1>
    <div className="small" style={{color:'#eef2ff'}}>{desc||'Krótki opis oferty'}</div>
  </section>
}

function USP({items=[]}){ return <section className="section"><h3>Dlaczego my</h3><div className="row">{items.map((u,i)=><div key={i} className="section" style={{margin:0}}>{u.icon||'✓'} {u.text}</div>)}</div></section> }
function WhyUs(){ return null }
function Offer({items=[]}){ return <section className="section"><h3>Oferta</h3><div className="grid2">{items.map((o,i)=><div key={i} className="section" style={{margin:0}}><b>{o.title}</b><div className="small">{o.desc}</div><div className="price">{o.price}</div></div>)}</div></section> }
function Gallery({images=[]}){ if(!images.length) return null; return <section className="section"><h3>Galeria</h3><div className="gallery">{images.map((src,i)=><div key={i} className="thumb"><img src={src}/></div>)}</div></section> }

function PricingTable({rows=[]}){
  if(!(rows||[]).length) return null
  return <section className="section"><h3>Cennik</h3>
    <ul className="list">{rows.map((r,i)=><li key={i}><span>{r.label}</span><b style={{marginLeft:'auto'}}>{r.price}</b></li>)}</ul>
  </section>
}

function FAQ({items=[]}){ if(!items.length) return null; return <section className="section"><h3>FAQ</h3><ul className="list">{items.map((i,ix)=><li key={ix}><b>{i.q}</b><div className="small">{i.a}</div></li>)}</ul></section> }

function Testimonials({items=[], googleLink}){
  if(!(items||[]).length && !googleLink) return null
  return <section className="section"><h3>Opinie</h3>
    {(items||[]).map((t,i)=><blockquote key={i} className="section" style={{margin:0}}><div>„{t.text}”</div><div className="small">— {t.author||'Klient'}</div></blockquote>)}
    {googleLink ? <a className="btn btn-primary" style={{marginTop:8}} href={googleLink} target="_blank" rel="noreferrer">Zobacz opinie w Google</a> : null}
  </section>
}

function Booking({url, embed}){
  if(embed) return <section className="section"><h3>Rezerwacja</h3><div style={{position:'relative',paddingTop:'56.25%'}}><iframe title="Booking" src={embed} style={{position:'absolute',inset:0,width:'100%',height:'100%',border:'1px solid var(--line)',borderRadius:'12px'}}/></div></section>
  if(url) return <section className="section"><h3>Rezerwacja</h3><a className="btn btn-primary" href={url} target="_blank" rel="noreferrer">Rezerwuj</a></section>
  return null
}

function Contact({brand}){ if(!brand?.phone && !brand?.email) return null; return <section className="section"><h3>Kontakt</h3><ul className="list"><li>📞 {brand.phone}</li><li>✉️ {brand.email}</li></ul></section> }

function MapBox({ cfg }) {
  const addr = [cfg.brand?.address, cfg.brand?.city].filter(Boolean).join(', ');
  if (!addr) return null;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`;
  return (
    <section className="section">
      <h3>Mapa</h3>
      <div style={{ position:'relative', paddingTop:'56.25%' }}>
        <iframe title="Mapa" src={src} style={{ position:'absolute', inset:0, width:'100%', height:'100%', border:'1px solid var(--line)', borderRadius:'12px' }} loading="lazy" allowFullScreen />
      </div>
    </section>
  );
}

function Vouchers(){ return null }

export default function CenterPreview({ cfg }){
  const S = {
    hero: <Hero title={cfg.brand?.title} desc={cfg.brand?.desc} />,
    usp: <USP items={cfg.usp?.items||[]} />,
    whyus: <WhyUs/>,
    offer: <Offer items={cfg.offer?.items||[]} />,
    gallery: <Gallery images={cfg.gallery?.images||[]} />,
    pricing: <PricingTable rows={cfg.pricing?.rows||[]} />,
    faq: <FAQ items={cfg.faq?.items || []} />,
    testimonials: <Testimonials items={cfg.testimonials?.items || []} googleLink={cfg.reviews?.link} />,
    booking: <Booking url={cfg.booking?.url} embed={cfg.booking?.embed} />,
    contact: <Contact brand={cfg.brand} />,
    map: <MapBox cfg={cfg} />,
    vouchers: <Vouchers />,
    social: null,
    newsletter: null,
    footer: <section className="section"><div className="small">© {new Date().getFullYear()} {cfg.brand?.title||'Twoja firma'}</div></section>
  }
  return <div>
    {(() => {
      const list = (cfg.sections||[])
      const mid = list.filter(s=>s!=='hero' && s!=='footer')
      const orderedSections = ['hero', ...mid, 'footer'].filter(k=>S[k])
      return orderedSections.map(key => <React.Fragment key={key}>{S[key]}</React.Fragment>)
    })()}
  </div>
}
