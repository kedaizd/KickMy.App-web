
import React from 'react'
import { PRESETS } from '../presets'

export default function LeftPanel({ cfg, update }){

  const removeImage = (i)=>{
    const imgs = [...(cfg.gallery?.images||[])]
    imgs.splice(i,1)
    update('gallery.images', imgs)
  }

  return <>
    <label>Branża / preset</label>
    <div className="row">
      {Object.keys(PRESETS).map(key => (
        <button key={key} className="btn" onClick={()=> update('', structuredClone(PRESETS[key]))}>{key}</button>
      ))}
    </div>

    <label>Nazwa</label>
    <input type="text" value={cfg.brand?.title||''} onChange={e=>update('brand.title', e.target.value)} />
    <label>Opis</label>
    <textarea value={cfg.brand?.desc||''} onChange={e=>update('brand.desc', e.target.value)} />
    <label>Adres</label>
    <input type="text" value={cfg.brand?.address||''} onChange={e=>update('brand.address', e.target.value)} />
    <label>Miasto</label>
    <input type="text" value={cfg.brand?.city||''} onChange={e=>update('brand.city', e.target.value)} />
    <label>Telefon</label>
    <input type="text" value={cfg.brand?.phone||''} onChange={e=>update('brand.phone', e.target.value)} />
    <label>Email</label>
    <input type="email" value={cfg.brand?.email||''} onChange={e=>update('brand.email', e.target.value)} />

    <div className="color-card">
      <div className="color-title">KOLOR</div>
      <div className="color-grid"><div className="color-label">Główny</div><div className="color-label">Akcent</div></div>
      <div className="swatches">
        <div className="swatch" title={cfg.brand?.colors?.brand||'#0ea5e9'} style={{background: cfg.brand?.colors?.brand||'#0ea5e9'}}
          onClick={()=>document.getElementById('color-brand').click()}>
          <span className="tag">{cfg.brand?.colors?.brand||'#0ea5e9'}</span>
          <input id="color-brand" className="color-hidden" type="color" value={cfg.brand?.colors?.brand || '#0ea5e9'} onChange={e=>update('brand.colors.brand', e.target.value)} />
        </div>
        <div className="swatch" title={cfg.brand?.colors?.accent||'#f59e0b'} style={{background: cfg.brand?.colors?.accent||'#f59e0b'}}
          onClick={()=>document.getElementById('color-accent').click()}>
          <span className="tag">{cfg.brand?.colors?.accent||'#f59e0b'}</span>
          <input id="color-accent" className="color-hidden" type="color" value={cfg.brand?.colors?.accent || '#f59e0b'} onChange={e=>update('brand.colors.accent', e.target.value)} />
        </div>
      </div>
    </div>

    {/* Sekcje + DnD */}
    <label>Sekcje</label>
    <div className="draglist">
      {(cfg.sections||[]).map((s, idx) => {
        const isFirst = s==='hero'; const isLast = s==='footer'; const isCore = isFirst||isLast;
        return (
          <div key={s} className="dragitem" draggable={!isCore}
            onDragStart={(e)=>{ e.dataTransfer.setData('sect', s); e.currentTarget.classList.add('dragging') }}
            onDragEnd={(e)=> e.currentTarget.classList.remove('dragging')}
            onDragOver={(e)=>{ e.preventDefault(); if(!isCore) e.currentTarget.classList.add('dropzone') }}
            onDragLeave={(e)=> e.currentTarget.classList.remove('dropzone')}
            onDrop={(e)=>{
              e.preventDefault();
              const id = e.dataTransfer.getData('sect'); if(!id || isCore) return;
              const list = [...(cfg.sections||[])]; const from = list.indexOf(id); const to = idx;
              if(from<0 || from===to) return; const it = list.splice(from,1)[0]; list.splice(to,0,it);
              update('sections', list);
              e.currentTarget.classList.remove('dropzone');
            }}
          >
            <span className="draghandle">{isCore ? '•' : '≡'}</span>
            <b style={{minWidth:120}}>{s}</b>
            <span className="small">{['hero','whyus','contact','footer'].includes(s)?'Pakiet podstawowy':'Dodatek'}</span>
            {!isCore && !['hero','whyus','contact','footer'].includes(s) && (
              <button className="btn" style={{marginLeft:'auto'}} onClick={()=> update('sections', (cfg.sections||[]).filter(x=>x!==s))}>Usuń</button>
            )}
          </div>
        )
      })}
    </div>
    <div className="row" style={{marginTop:6}}>
      {[
        'hero','usp','whyus','offer','gallery','testimonials','pricing','faq','contact','map','video','vouchers','promo','booking','social','newsletter','footer'
      ].filter(s=>!(cfg.sections||[]).includes(s)).map(s=>(
        <button key={s} className="btn" onClick={()=>update('sections',[...(cfg.sections||[]), s])}>＋ {s}</button>
      ))}
    </div>

    {/* Cennik: Tabela edytowalna */}
    <hr/>
    <label>Cennik (tabela)</label>
    <p className="small">Edytuj wiersze. Przeciągaj ≡ by zmienić kolejność. Dodaj/usuń pozycje.</p>
    <div className="table-rows">
      {(cfg.pricing?.rows||[]).map((r,i)=>(
        <div key={i} className="row-item" draggable
          onDragStart={(e)=>{ e.dataTransfer.setData('row', String(i)); e.currentTarget.classList.add('dragging') }}
          onDragEnd={(e)=> e.currentTarget.classList.remove('dragging')}
          onDragOver={(e)=> e.preventDefault()}
          onDrop={(e)=>{
            const from = parseInt(e.dataTransfer.getData('row'),10); const to = i; if(from===to) return;
            const rows = [...(cfg.pricing?.rows||[])]; const it = rows.splice(from,1)[0]; rows.splice(to,0,it);
            update('pricing.rows', rows);
          }}
        >
          <span className="row-handle">≡</span>
          <input type="text" placeholder="Nazwa" value={r.label||''} onChange={e=>{ const rows=[...(cfg.pricing?.rows||[])]; rows[i]={...rows[i], label:e.target.value}; update('pricing.rows', rows) }} />
          <input type="text" placeholder="Cena" value={r.price||''} onChange={e=>{ const rows=[...(cfg.pricing?.rows||[])]; rows[i]={...rows[i], price:e.target.value}; update('pricing.rows', rows) }} />
          <button className="btn" onClick={()=> update('pricing.rows', (cfg.pricing?.rows||[]).filter((_,ix)=>ix!==i))}>Usuń</button>
        </div>
      ))}
    </div>
    <div className="row" style={{marginTop:8}}>
      <button className="btn" onClick={()=> update('pricing.rows', [...(cfg.pricing?.rows||[]), {label:'', price:''}])}>Dodaj wiersz</button>
    </div>

    {/* Opinie (manualne) */}
    <hr/>
    <label>Opinie</label>
    <p className="small">Wpisz własne opinie klientów. Opcjonalnie dodaj link do strony z opiniami Google.</p>
    {(cfg.testimonials?.items||[]).map((it,i)=>(
      <div key={i} className="section" style={{margin:0}}>
        <input type="text" placeholder={`Autor #${i+1}`} value={it.author||''} onChange={e=>{ const arr=[...(cfg.testimonials?.items||[])]; arr[i]={...(arr[i]||{}), author:e.target.value}; update('testimonials.items', arr) }} />
        <textarea placeholder={`Treść opinii #${i+1}`} value={it.text||''} onChange={e=>{ const arr=[...(cfg.testimonials?.items||[])]; arr[i]={...(arr[i]||{}), text:e.target.value}; update('testimonials.items', arr) }} />
        <div className="row"><button className="btn" onClick={()=> update('testimonials.items', (cfg.testimonials?.items||[]).filter((_,ix)=>ix!==i))}>Usuń</button></div>
      </div>
    ))}
    <div className="row"><button className="btn" onClick={()=> update('testimonials.items', [...(cfg.testimonials?.items||[]), {author:'', text:''}])}>Dodaj opinię</button></div>
    <label>Link do opinii Google (opcjonalnie)</label>
    <input type="url" placeholder="https://g.page/r/..." value={cfg.reviews?.link||''} onChange={e=>update('reviews.link', e.target.value)} />

    {/* Galeria */}
    <hr/>
    <label>Galeria — dodaj URL</label>
    <div className="row">
      <input type="url" placeholder="https://..." onKeyDown={e=>{
        if(e.key!=='Enter') return; const v=e.currentTarget.value.trim(); if(!v) return;
        update('gallery.images', [...(cfg.gallery?.images||[]), v]); e.currentTarget.value='';
      }} />
    </div>
    <div className="gallery" style={{marginTop:8}}>
      {(cfg.gallery?.images||[]).map((src,i)=>(
        <div className="thumb" key={i} title={src} draggable
          onDragStart={(e)=>{ e.dataTransfer.setData('g', String(i)); e.currentTarget.classList.add('dragging') }}
          onDragEnd={(e)=> e.currentTarget.classList.remove('dragging')}
          onDragOver={(e)=> e.preventDefault()}
          onDrop={(e)=>{ const from=parseInt(e.dataTransfer.getData('g'),10); const to=i; const imgs=[...(cfg.gallery?.images||[])]; const it=imgs.splice(from,1)[0]; imgs.splice(to,0,it); update('gallery.images', imgs) }}
        >
          <img src={src} alt="img"/><button className="btn" style={{position:'absolute',right:6,top:6}} onClick={()=>removeImage(i)}>✕</button>
        </div>
      ))}
    </div>

    {/* Rezerwacja */}
    <hr/>
    <label>Rezerwacja</label>
    <div className="grid2">
      <input type="url" placeholder="Link do rezerwacji (Booksy/Calendly)" value={cfg.booking?.url||''} onChange={e=>update('booking.url', e.target.value)} />
      <input type="text" placeholder="(opc.) iframe src" value={cfg.booking?.embed||''} onChange={e=>update('booking.embed', e.target.value)} />
    </div>
    <p className="small" style={{marginTop:6}}>
      Podaj <b>link</b> do Booksy/Calendly – przycisk „Rezerwuj” otworzy nową kartę.
      Jeśli dostawca daje „Osadź”, wklej <b>sam adres src</b> obok – kalendarz pokaże się w podglądzie.
    </p>

    {/* Mapa */}
    <hr/>
    <label>Mapa</label>
    <div className="small">Wpisz <b>Adres</b> i <b>Miasto</b> wyżej — mapa doda się sama.</div>
  </>
}
