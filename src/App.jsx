import React, { useMemo, useState, useEffect } from 'react'
import LeftPanel from './components/LeftPanel.jsx'
import CenterPreview from './components/CenterPreview.jsx'
import RightPanel from './components/RightPanel.jsx'
import { PRESETS, SECTION_PRICES } from './presets'

const DEFAULT_KEY = 'kickmy-cfg'
const DEFAULT_CFG = PRESETS['firma-remontowa']

function deepSet(obj, path, value){
  const parts = (path||'').split('.').filter(Boolean)
  if(parts.length===0) return value
  const out = Array.isArray(obj) ? [...obj] : {...obj}
  let cur = out
  parts.forEach((p,idx)=>{
    if(idx===parts.length-1){ cur[p]=value; }
    else{
      const next = cur[p]
      cur[p] = Array.isArray(next) ? [...next] : (typeof next==='object' && next!==null ? {...next} : {})
      cur = cur[p]
    }
  })
  return out
}

export default function App(){
  const [cfg, setCfg] = useState(()=>{
    try{
      const raw = localStorage.getItem(DEFAULT_KEY)
      return raw ? JSON.parse(raw) : DEFAULT_CFG
    }catch(e){ return DEFAULT_CFG }
  })
  const [snack, setSnack] = useState('')
  const [showRight, setShowRight] = useState(true);

  // propagate CSS variables (brand/accent + hero start/end)
  useEffect(()=>{
    const root = document.documentElement
    const accent = cfg?.brand?.colors?.accent || '#f59e0b'
    const heroStart = (cfg?.hero?.colors?.start) || (cfg?.brand?.colors?.brand) || '#0ea5e9'
    const heroEnd   = (cfg?.hero?.colors?.end)   || accent
    // legacy vars for backward compatibility
    root.style.setProperty('--brand', heroStart)
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--hero1', heroStart)
    root.style.setProperty('--hero2', heroEnd)
    localStorage.setItem(DEFAULT_KEY, JSON.stringify(cfg))
  },[cfg])

  const update = (path, value)=>{
    setCfg(prev=> deepSet(prev, path, value))
  }

  // prices
  const priceData = useMemo(()=>{
    const prices = {}
    let total = 199
    ;(cfg.sections||[]).forEach(sec=>{
      const p = SECTION_PRICES[sec] || 0
      if(p>0){ prices[sec]=p; total+=p }
    })
    return { basePrice:199, sections:prices, total }
  },[cfg.sections])

  return (
    <div className={`app ${!showRight ? 'no-right' : ''}`}>
      <div className="top" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
        <span className="brand">Kickmy Configurator</span>
        {/* Język / Language switcher temporarily hidden */}
        {/*
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <label htmlFor="lang-switch" style={{fontSize:14,opacity:.8}}>Język / Language:</label>
          <select
            id="lang-switch"
            value={cfg.lang || 'pl'}
            onChange={e => update('lang', e.target.value)}
            style={{padding:'4px 8px',borderRadius:6,border:'1px solid #ccc',fontSize:14}}
          >
            <option value="pl">Polski</option>
            <option value="en">English</option>
          </select>
        </div>
        */}
      </div>
      <div className="left">
        <div className="panel">
          <LeftPanel cfg={cfg} update={update} />
        </div>
      </div>

      <div className="center">
        <div className="container">
          <CenterPreview cfg={cfg} update={update} showRight={showRight} setShowRight={setShowRight} />
        </div>
      </div>

      <div className={`right ${!showRight ? 'hidden' : ''}`}> 
        <div className="panel">
          <RightPanel cfg={cfg} priceData={priceData} update={update} showRight={showRight} setShowRight={setShowRight} />
        </div>
      </div>

      {/* Przycisk do pokazania panelu podsumowania przy prawej krawędzi */}
      {!showRight && (
        <button
          className="btn btn-primary show-summary-btn vertical-btn"
          onClick={() => setShowRight(true)}
        >
          <span>Pokaż</span>
          <span>panel</span>
          <span>Podsumowanie</span>
        </button>
      )}

     <div className={`snack ${snack?'show':''}`}>{snack}</div>
    </div>
  )
}