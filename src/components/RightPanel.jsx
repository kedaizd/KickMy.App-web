import React, { useState } from 'react'
import { exportZip, exportConfigJson, getExportZipBase64 } from '../exporter'
import { getTranslation } from './i18n';

const fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
const baseText = { fontFamily, fontSize: 15, fontWeight: 400, color: '#222' };
const labelText = { fontFamily, fontSize: 15, fontWeight: 500, color: '#222', marginBottom: 2 };
const heading = { fontFamily, fontSize: 20, fontWeight: 700, color: '#18181b', margin: '16px 0 10px 0' };
const inputStyle = { fontFamily, fontSize: 15, padding: '8px 10px', borderRadius: 6, border: '1px solid #e5e7eb', marginBottom: 8, width: '100%' };
const btnStyle = { fontFamily, fontSize: 15, fontWeight: 500, borderRadius: 8, padding: '10px 18px', border: 'none', cursor: 'pointer' };
const tableStyle = { fontFamily, fontSize: 15, width: '100%', borderCollapse: 'collapse', marginBottom: 8 };
const thtd = { padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' };

export default function RightPanel({ cfg, priceData, update, showRight, setShowRight }){
  const t = getTranslation(cfg);
  const [isSending, setIsSending] = useState(false);

  // Cena pakietu
  const packagePrice = (!cfg.package || cfg.package === 'pro') ? 249 : 149;

  const handleExport = () => {
    exportZip(cfg);
  };

  // Główny handler "Składam zamówienie"
  const handlePlaceOrder = async () => {
    try {
      setIsSending(true);

      // 1) Zbierz dane kontaktowe i do faktury
      const contact = {
        name:  cfg.invoice?.name || '',
        email: cfg.invoice?.deliveryEmail || ''
        // phone: (jeśli dodasz pole telefonu w UI)
      };
      const invoice = {
        name:    cfg.invoice?.name || '',
        nip:     cfg.invoice?.nip || '',
        address: cfg.invoice?.address || '',
        email:   cfg.invoice?.deliveryEmail || ''
      };

      // 2) Aktualny config
      const config = cfg;

      // 3) ZIP jako base64 (do wysyłki przez funkcję)
      const zipBase64 = await getExportZipBase64(config);

      // 4) Unikalne ID zamówienia
      const orderId = `ORD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

      // 5) Wyślij do Netlify Function
      const res = await fetch('/.netlify/functions/send-order', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${import.meta.env.VITE_ORDER_WEBHOOK_TOKEN || ''}`
        },
        body: JSON.stringify({ orderId, contact, invoice, config, zipBase64 })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      alert(t.rightPanel?.orderSent || 'Zamówienie zostało wysłane! Sprawdź skrzynkę.');

      // (opcjonalnie) Pobierz ZIP lokalnie dla użytkownika
      exportZip(cfg);

    } catch (err) {
      console.error('Order submission failed', err);
      const msgId = data?.id ? `\nID: ${data.id}` : '';
        alert(`${t.rightPanel?.orderSent || 'Zamówienie zostało wysłane!'}${msgId}`);
    } finally {
      setIsSending(false);
    }
  };

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
      <input
        type="text"
        placeholder={t.rightPanel?.companyOrNamePlaceholder || 'Jan Kowalski'}
        style={inputStyle}
        value={cfg.invoice?.name || ''}
        onChange={e => update('invoice.name', e.target.value)}
      />

      <label style={labelText}>{t.rightPanel?.nip || 'NIP (opcjonalnie)'}</label>
      <input
        type="text"
        placeholder={t.rightPanel?.nipPlaceholder || '123-456-78-90'}
        style={inputStyle}
        value={cfg.invoice?.nip || ''}
        onChange={e => update('invoice.nip', e.target.value)}
      />

      <label style={labelText}>{t.rightPanel?.address || 'Adres'}</label>
      <input
        type="text"
        placeholder={t.rightPanel?.addressPlaceholder || 'ul. Sezamkowa 1, 00-001 Warszawa'}
        style={inputStyle}
        value={cfg.invoice?.address || ''}
        onChange={e => update('invoice.address', e.target.value)}
      />

      <label style={labelText}>{t.rightPanel?.deliveryEmail || 'Adres e-mail do wysyłki paczki'}</label>
      <input
        type="email"
        placeholder={t.rightPanel?.deliveryEmailPlaceholder || 'twoj@email.pl'}
        style={inputStyle}
        value={cfg.invoice?.deliveryEmail || ''}
        onChange={e => update('invoice.deliveryEmail', e.target.value)}
      />

      <div className="small" style={{...baseText, fontSize:14, color:'#444', marginTop: 8, marginBottom: 8}}>
        {t.rightPanel?.orderHint || 'Po zaksięgowaniu wpłaty na rachunku bankowym, w ciągu 48h otrzymasz na podany adres e-mail gotową paczkę do wrzucenia na Netlify wraz z instrukcją jak to zrobić.'}
      </div>

      <button
        className="btn btn-primary"
        style={{ ...btnStyle, background: isSending ? '#6b7280' : '#2563eb', color: '#fff', marginTop: 8, opacity: isSending ? 0.8 : 1 }}
        onClick={handlePlaceOrder}
        disabled={isSending}
      >
        {isSending ? (t.rightPanel?.ordering || 'Wysyłanie…') : (t.rightPanel?.orderBtn || 'Składam zamówienie')}
      </button>
    </div>

    {/* JSON konfiguracyjny zostanie dołączony do e-maila jako osobny załącznik `order-<id>.json`. */}
  </>
}
