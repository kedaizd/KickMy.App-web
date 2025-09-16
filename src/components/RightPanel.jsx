
import React, { useMemo } from 'react'

export default function RightPanel({ cfg, price, update }){
  const total = useMemo(()=> price, [price])

  return <>
    <h3>Podsumowanie</h3>
    <div className="section">
      <div className="row"><span>Pakiet</span><b>{total} zł</b></div>
      <div className="small">Sekcje dodatkowe liczone po 49 zł/szt.</div>
    </div>

    <h3>Hosting i domena <span className="tooltip">?<span className="tip">Hosting = miejsce na pliki, Domena = adres www. Możesz dodać teraz lub później.</span></span></h3>
    <div className="grid2">
      <select onChange={e=>update('hosting.plan', e.target.value)} defaultValue={cfg.hosting?.plan||'none'}>
        <option value="none">Bez hostingu</option>
        <option value="basic">Hosting Basic</option>
        <option value="pro">Hosting Pro</option>
      </select>
      <input type="text" placeholder="Domena (np. firma.pl)" onChange={e=>update('domain.name', e.target.value)} />
    </div>

    <div className="row" style={{marginTop:12}}>
      <button className="btn" onClick={()=>{
        const payload = { cfg, price: total }
        const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'})
        const a = document.createElement('a'); a.download = 'kickmy-order.json'; a.href = URL.createObjectURL(blob); a.click()
        setTimeout(()=>URL.revokeObjectURL(a.href), 3000)
      }}>Zamów (JSON)</button>
    </div>
  </>
}
