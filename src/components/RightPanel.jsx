
import React, { useState } from 'react'
import { exportZip, exportConfigJson } from '../exporter'
import { getTranslation } from './i18n';

const fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
const baseText = { fontFamily, fontSize: 15, fontWeight: 400, color: '#222' };
const labelText = { fontFamily, fontSize: 15, fontWeight: 500, color: '#222', marginBottom: 2 };
const heading = { fontFamily, fontSize: 20, fontWeight: 700, color: '#18181b', margin: '16px 0 10px 0' };
const inputStyle = { fontFamily, fontSize: 15, padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 8, width: '100%' };
const btnStyle = { fontFamily, fontSize: 15, fontWeight: 500, borderRadius: 8, padding: '10px 18px', border: 'none', cursor: 'pointer' };
const tableStyle = { fontFamily, fontSize: 15, width: '100%', borderCollapse: 'collapse', marginBottom: 8 };
const thtd = { padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' };

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => {
    const result = reader.result || '';
    const base64 = typeof result === 'string' ? result.split(',').pop() : '';
    resolve(base64 || '');
  };
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});
export default function RightPanel({ cfg, priceData, update, showRight, setShowRight }){
  const t = getTranslation(cfg);
  // Determine package price
  const packagePrice = (!cfg.package || cfg.package === 'pro') ? 249 : 149;

  const handleExport = () => {
    exportZip(cfg);
  };

  const [jsonNotes, setJsonNotes] = useState('');
  return <>
    <button
      className="btn btn-primary hide-summary-btn"
      style={{ ...btnStyle, marginBottom: 12, background: '#ff0000', color: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
      onClick={() => setShowRight(false)}
    >
      {t.rightPanel?.hideSummary || 'Ukryj panel Podsumowanie'}
    </button>
    <h3 style={heading}>{t.rightPanel?.summary || 'Podsumowanie'}</h3>
    <div className="section" style={{ maxWidth: 420, width: '100%' }}>
      <table className="summary-table" style={tableStyle}>
        <tbody>
          <tr>
            <td className="label" style={thtd}>{cfg.package === 'basic' ? (t.rightPanel?.basicPackage || 'Pakiet podstawowy') : (t.rightPanel?.proPackage || 'Pakiet rozszerzony')}</td>
            <td className="value" style={thtd}>{packagePrice} zł</td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* --- ORDER SECTION --- */}
  <h3 style={heading}>{t.rightPanel?.orderHeader || 'Przejdź do zamówienia'}</h3>
    <div className="section" style={{ maxWidth: 420, width: '100%' }}>
      <label style={labelText}>{t.rightPanel?.companyOrName || 'Nazwa firmy/Imię i nazwisko'}</label>
      <input type="text" placeholder={t.rightPanel?.companyOrNamePlaceholder || 'Jan Kowalski'} style={inputStyle} value={cfg.invoice?.name || ''} onChange={e => update('invoice.name', e.target.value)} />
      <label style={labelText}>{t.rightPanel?.nip || 'NIP (opcjonalnie)'}</label>
      <input type="text" placeholder={t.rightPanel?.nipPlaceholder || '123-456-78-90'} style={inputStyle} value={cfg.invoice?.nip || ''} onChange={e => update('invoice.nip', e.target.value)} />
      <label style={labelText}>{t.rightPanel?.address || 'Adres'}</label>
      <input type="text" placeholder={t.rightPanel?.addressPlaceholder || 'ul. Sezamkowa 1, 00-001 Warszawa'} style={inputStyle} value={cfg.invoice?.address || ''} onChange={e => update('invoice.address', e.target.value)} />
      <label style={labelText}>{t.rightPanel?.deliveryEmail || 'Adres e-mail do wysyłki paczki'}</label>
      <input type="email" placeholder={t.rightPanel?.deliveryEmailPlaceholder || 'twoj@email.pl'} style={inputStyle} value={cfg.invoice?.deliveryEmail || ''} onChange={e => update('invoice.deliveryEmail', e.target.value)} />
      <div className="small" style={{...baseText, fontSize:14, color:'#444', marginTop: 8, marginBottom: 8}}>
        {t.rightPanel?.orderHint || 'Po zaksięgowaniu wpłaty na rachunku bankowym, w ciągu 48h otrzymasz na podany adres e-mail gotową paczkę do wrzucenia na Netlify wraz z instrukcją jak to zrobić.'}
      </div>
      <button
        className="btn btn-primary"
        style={{ ...btnStyle, background: '#2563eb', color: '#fff', marginTop: 8 }}
        onClick={async () => {
          try {
            const zipBlob = await exportZip(cfg, { returnBlob: true, includeJson: true });
            const zipBase64 = await blobToBase64(zipBlob);
            const payload = {
              cfg,
              zip: zipBase64,
              invoice: {
                name: cfg.invoice?.name || '',
                nip: cfg.invoice?.nip || '',
                address: cfg.invoice?.address || '',
                deliveryEmail: cfg.invoice?.deliveryEmail || ''
              },
              notes: jsonNotes || ''
            };
            const response = await fetch('/.netlify/functions/send-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!response.ok) {
              throw new Error('Request failed: ' + response.status);
            }
            alert(t.rightPanel?.orderSent || 'Zamowienie zostalo wyslane! Skontaktujemy sie z Toba wkrotce.');
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'kickmy-export.zip';
            link.click();
          } catch (err) {
            console.error('Order submission failed', err);
            alert(t.rightPanel?.orderError || 'Nie udalo sie wyslac zamowienia. Sprobuj ponownie lub skontaktuj sie bezposrednio.');
          }
        }}
      >
        {t.rightPanel?.orderBtn || 'Skladam zamowienie'}
      </button>
    </div>

    {/* JSON konfiguracyjny zostanie automatycznie dołączony do paczki ZIP przy składaniu zamówienia. */}
    {/* Opublikuj stronę section removed as requested */}
  </>
}






