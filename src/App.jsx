
import React, { useMemo, useState, useEffect } from 'react'
import LeftPanel from './components/LeftPanel.jsx'
import CenterPreview from './components/CenterPreview.jsx'
import RightPanel from './components/RightPanel.jsx'
import { PRESETS } from './presets'

const DEFAULT_CFG = PRESETS['firma-remontowa']

export default function App(){
  const LOCAL_KEY = 'kickmy-cfg'
  const enc = (obj)=> btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
  const dec = (s)=> JSON.parse(decodeURIComponent(escape(atob(s))))
  const url = new URL(window.location.href)
  const s = url.searchParams.get('s')
  const [cfg, setCfg] = useState(()=>{
    try{ if(s) return dec(s); const raw = localStorage.getItem(LOCAL_KEY); return raw ? JSON.parse(raw) : DEFAULT_CFG }catch(e){ return DEFAULT_CFG }
  })
  const [snack, setSnack] = useState('')

  // THEME EFFECT
  useEffect(()=>{
    const b = cfg.brand?.colors?.brand || '#0ea5e9'
    const a = cfg.brand?.colors?.accent || '#f59e0b'
    document.documentElement.style.setProperty('--brand', b)
    document.documentElement.style.setProperty('--accent', a)
  }, [cfg.brand?.colors?.brand, cfg.brand?.colors?.accent])

  // sync URL + localStorage + snack
  useEffect(()=>{
    try{
      const q = new URL(window.location.href)
      q.searchParams.set('s', enc(cfg))
      window.history.replaceState({}, '', q.toString())
      localStorage.setItem(LOCAL_KEY, JSON.stringify(cfg))
    }catch{}
    setSnack('Zapisano ✓'); const t=setTimeout(()=>setSnack(''),1200); return ()=>clearTimeout(t)
  }, [cfg])

  function update(path, value){
    if(path===''){ setCfg(value); return }
    setCfg(old => {
      const next = structuredClone(old)
      const segs = path.split('.')
      let t = next
      for(let i=0;i<segs.length-1;i++){ t[segs[i]] = t[segs[i]] || {}; t = t[segs[i]] }
      if(path==='sections'){
        const uniq = Array.from(new Set(value))
        const mid = uniq.filter(s => s!=='hero' && s!=='footer')
        t[segs.at(-1)] = ['hero', ...mid, 'footer']
      } else {
        t[segs.at(-1)] = value
      }
      return next
    })
  }

  const price = useMemo(()=>{
    const base = 999
    const addons = (cfg.sections||[]).filter(s=>!['hero','whyus','contact','footer'].includes(s)).length * 49
    return base + addons
  }, [cfg.sections])

  useEffect(()=>{
    const onKey = (e)=>{
      const mod = (e.ctrlKey || e.metaKey) && e.key.toLowerCase()==='s'
      if(!mod) return
      e.preventDefault()
      const payload = { cfg, price }
      const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'})
      const a = document.createElement('a'); a.download = 'kickmy-order.json'; a.href = URL.createObjectURL(blob); a.click()
      setTimeout(()=>URL.revokeObjectURL(a.href), 3000)
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [cfg, price])

  return (
    <div className="app">
      <div className="top">
        <div className="brand">KickMy</div><span className="badge">MVP</span>
        <button className="btn" onClick={()=>navigator.clipboard.writeText(window.location.href)}>Udostępnij link</button>
        <button className="btn" onClick={()=>{ localStorage.removeItem(LOCAL_KEY); const u=new URL(window.location.href); u.searchParams.delete('s'); window.history.replaceState({}, '', u.toString()); setCfg(structuredClone(DEFAULT_CFG)); }}>Resetuj</button>
      </div>
      <div className="left"><div className="panel">
        <LeftPanel cfg={cfg} update={update} />
      </div></div>
      <div className="center">
        <CenterPreview cfg={cfg} />
      </div>
      <div className="right"><div className="panel">
        <RightPanel cfg={cfg} price={price} update={update} />
      </div></div>
      <div className={"snack "+(snack? "show":"")}>{snack}</div>
    </div>
  )
}
