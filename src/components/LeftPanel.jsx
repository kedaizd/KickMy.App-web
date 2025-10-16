export default LeftPanel;
import React, { useState, useRef, useEffect } from 'react';
import { getTranslation } from './i18n';
import { PRESETS, SECTION_PRICES, CUSTOM_PRESET } from '../presets';
import ColorPicker from './ColorPicker';

// Main LeftPanel component
const FONT_FAMILY = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
const baseTextStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 400, fontStyle: 'normal' };
const headingStyle = { fontFamily: FONT_FAMILY, fontSize: 20, fontWeight: 700, fontStyle: 'normal', margin: 0 };
const subheadingStyle = { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: 600, fontStyle: 'normal' };
const labelStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 500, fontStyle: 'normal', display: 'block', marginBottom: 6 };
const inputStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 400, fontStyle: 'normal', borderRadius: 6, border: '1px solid #e5e7eb', padding: 6, width: '100%' };
const selectStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 400, fontStyle: 'normal', borderRadius: 6, border: '1px solid #e5e7eb', padding: 6, width: '100%' };
const tableCellStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 400, fontStyle: 'normal' };
const buttonStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 500, fontStyle: 'normal', borderRadius: 8, border: '1px solid #e5e7eb', padding: '8px 16px', cursor: 'pointer', background: '#fff' };

const SECTION_LABELS = Object.freeze({
  hero: 'Hero',
  usp: 'Unikalna Cecha Oferty',
  offer: 'Oferta',
  gallery: 'Galeria',
  pricing: 'Cennik',
  faq: 'FAQ',
  testimonials: 'Opinie',
  booking: 'Rezerwacje',
  contact: 'Kontakt',
  map: 'Mapa',
  social: 'Social media',
  newsletter: 'Newsletter',
  promo: 'Promocje',
  video: 'Wideo',
  footer: 'Stopka'
});

const getSectionLabel = (key) => SECTION_LABELS[key] || key;

function LeftPanel({ cfg, update, loadCompanyData }) {
  const t = getTranslation(cfg);
  const [activeSection, setActiveSection] = useState('');
  const [removedSections, setRemovedSections] = useState([]);
  const sectionRefs = useRef({});

  // Remove duplicate import and misplaced JSX
  // <ColorPicker ... /> (removed)

  const handleExcelUpload = (e) => {
    if (typeof window === 'undefined') return; // Zapobiega błędom w SSR
    import('exceljs').then((ExcelJS) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const workbook = new ExcelJS.Workbook();
          const buffer = evt.target.result;
          await workbook.xlsx.load(buffer);
          
          const worksheet = workbook.worksheets[0];
          const rows = [];
          worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) { // Pomijamy nagłówek
              rows.push({
                title: row.getCell(1).value || '',
                price: row.getCell(2).value || '',
                unit: row.getCell(3).value || ''
              });
            }
          });
          update('pricing.rows', rows);
        } catch (err) {
          console.error('Błąd podczas importu Excela:', err);
          alert('Błąd importu Excela. Sprawdź plik.');
        }
      };
      reader.readAsArrayBuffer(file); // exceljs wymaga ArrayBuffer
    }).catch((err) => {
      console.error('Błąd podczas ładowania exceljs:', err);
      alert('Błąd ładowania exceljs.');
    });
  };

  const removeImage = (i) => {
    const imgs = [...(cfg.gallery?.images || [])];
    imgs.splice(i, 1);
    update('gallery.images', imgs);
  };

  // Utility functions
  const addUSP = () => update('usp.items', [...(cfg.usp?.items || []), { icon: '✓', text: '' }]);
  const removeUSP = (i) => {
    const items = [...(cfg.usp?.items || [])];
    items.splice(i, 1);
    update('usp.items', items);
  };
  const addOffer = () => update('offer.items', [...(cfg.offer?.items || []), { title: '', desc: '', price: '' }]);
  const removeOffer = (i) => {
    const items = [...(cfg.offer?.items || [])];
    items.splice(i, 1);
    update('offer.items', items);
  };
  const addFAQ = () => update('faq.items', [...(cfg.faq?.items || []), { q: '', a: '' }]);
  const removeFAQ = (i) => {
    const items = [...(cfg.faq?.items || [])];
    items.splice(i, 1);
    update('faq.items', items);
  };
  const addTestimonial = () => update('testimonials.items', [...(cfg.testimonials?.items || []), { author: '', text: '' }]);
  const removeTestimonial = (i) => {
    const items = [...(cfg.testimonials?.items || [])];
    items.splice(i, 1);
    update('testimonials.items', items);
  };

  // --- MAIN PANEL UI (restored) ---
  // --- PRESET PICKER UI ---
  return (
  <div style={{ marginTop: 24, ...baseTextStyle }}>

      {/* COLOR SCHEME HEADER, PICKERS, DESCRIPTION - moved above Hero section */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>{t.leftPanel?.chooseColorScheme || 'Wybierz kolorystykę strony'}</label>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          {Object.entries(PRESETS).slice(0, 8).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => {
                const presetCfg = JSON.parse(JSON.stringify(preset));
                Object.keys(presetCfg).forEach(k => update(k, presetCfg[k]));
                if (preset.hero?.colors?.buttonPrimary) update('buttonColor', preset.hero.colors.buttonPrimary);
                if (preset.hero?.colors?.buttonPrimaryText) update('buttonTextColor', preset.hero.colors.buttonPrimaryText);
                update('preset', key);
              }}
              style={{
                border: cfg.preset === key ? '2px solid #2563eb' : '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 0,
                background: 'none',
                cursor: 'pointer',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: cfg.preset === key ? '0 2px 8px #2563eb22' : 'none',
                position: 'relative',
                outline: 'none',
                marginBottom: 4
              }}
              title={preset.name}
            >
              <span style={{
                display: 'block',
                width: 36,
                height: 36,
                borderRadius: 6,
                background: preset.hero?.bgType === 'solid'
                  ? (preset.hero?.colors?.solid || preset.hero?.colors?.brand || '#fff')
                  : `linear-gradient(135deg, ${preset.hero?.colors?.brand || '#fff'} 0%, ${preset.hero?.colors?.accent || '#eee'} 100%)`,
                border: '1px solid #ddd',
                boxShadow: '0 1px 2px #0001',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: FONT_FAMILY
              }}>
                <span style={{
                  position: 'absolute',
                  left: 4,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: preset.hero?.colors?.buttonPrimary || preset.brand?.colors?.brand || '#2563eb',
                  border: '1px solid #fff',
                  boxShadow: '0 1px 2px #0002'
                }} />
                <span style={{
                  position: 'absolute',
                  right: 4,
                  bottom: 4,
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: preset.footer?.background || '#f8fafc',
                  border: '1px solid #fff',
                  boxShadow: '0 1px 2px #0002'
                }} />
              </span>
            </button>
          ))}
          <button
            onClick={() => {
              Object.keys(CUSTOM_PRESET).forEach(k => update(k, CUSTOM_PRESET[k]));
              update('buttonColor', '');
              update('buttonTextColor', '');
              update('preset', '');
            }}
            style={{
              border: !cfg.preset ? '2px solid #2563eb' : '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 0,
              background: 'none',
              cursor: 'pointer',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: !cfg.preset ? '0 2px 8px #2563eb22' : 'none',
              position: 'relative',
              outline: 'none',
              marginBottom: 4
            }}
            title="Własny (dowolny)"
          >
            <span style={{
              display: 'block',
              width: 36,
              height: 36,
              borderRadius: 6,
              background: '#fff',
              border: '1px solid #ddd',
              boxShadow: '0 1px 2px #0001',
              position: 'relative',
              overflow: 'hidden',
              color: '#aaa',
              fontSize: 18,
              textAlign: 'center',
              lineHeight: '36px'
            }}>✎</span>
          </button>
        </div>

        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{t.leftPanel?.choosePresetHint || 'Możesz wybrać gotowy styl lub ustawić własne kolory poniżej.'}</div>
        {/* BRANŻE / PRESETY - SELECT */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500 }}>{t.leftPanel?.industryPreset || 'Branża / preset'}</label>
          <select
            value={cfg.preset || ''}
            onChange={e => {
              const key = e.target.value;
              if (!key) {
                Object.keys(CUSTOM_PRESET).forEach(k => update(k, CUSTOM_PRESET[k]));
                update('buttonColor', '');
                update('buttonTextColor', '');
                update('preset', '');
                return;
              }
              // Deep clone preset to avoid reference issues
              const presetCfg = JSON.parse(JSON.stringify(PRESETS[key]));
              Object.keys(presetCfg).forEach(k => update(k, presetCfg[k]));
              if (PRESETS[key]?.hero?.colors?.buttonPrimary) update('buttonColor', PRESETS[key].hero.colors.buttonPrimary);
              if (PRESETS[key]?.hero?.colors?.buttonPrimaryText) update('buttonTextColor', PRESETS[key].hero.colors.buttonPrimaryText);
              update('preset', key);
            }}
            style={{ width: '100%', marginTop: 4, padding: 6, borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 15 }}
          >
            <option value="">{t.leftPanel?.customPreset || 'Własny (dowolny)'}</option>
            {Object.keys(PRESETS).filter(key => !PRESETS[key].name).map(key => (
              <option key={key} value={key}>
                {PRESETS[key].brand?.title || key}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COMPANY INFO FIELDS */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{...subheadingStyle, margin: 0}}>{t.leftPanel?.brandInfo || 'Informacje o marce'}</h3>
          <button
            onClick={loadCompanyData}
            className="btn"
            style={{
              ...buttonStyle,
              fontSize: 13, padding: '6px 12px', background: '#f9fafb'
            }}
            title="Wczytaj dane z profilu firmy zapisanego w osobnym narzędziu"
          >
            {t.leftPanel?.loadCompanyData || 'Wczytaj dane firmy'}
          </button>
        </div>
        <label>{t.leftPanel?.companyName || 'Nazwa'}</label>
        <input
          type="text"
          placeholder={t.leftPanel?.companyNamePlaceholder || 'Nazwa firmy lub strony'}
          value={cfg.brand?.title || ''}
          onChange={e => update('brand.title', e.target.value)}
        />
  <label>{t.leftPanel?.desc || 'Opis'}</label>
        <input
          type="text"
          placeholder={t.leftPanel?.descPlaceholder || 'Krótki opis oferty'}
          value={cfg.brand?.desc || ''}
          onChange={e => update('brand.desc', e.target.value)}
        />
  <label>{t.leftPanel?.address || 'Adres'}</label>
        <input
          type="text"
          placeholder={t.leftPanel?.addressPlaceholder || 'Adres (ulica i nr)'}
          value={cfg.brand?.address || ''}
          onChange={e => update('brand.address', e.target.value)}
        />
  <label>{t.leftPanel?.city || 'Miasto'}</label>
        <input
          type="text"
          placeholder={t.leftPanel?.cityPlaceholder || 'Miasto'}
          value={cfg.brand?.city || ''}
          onChange={e => update('brand.city', e.target.value)}
        />
  <label>{t.leftPanel?.phone || 'Telefon'}</label>
        <input
          type="text"
          placeholder={t.leftPanel?.phonePlaceholder || 'Telefon'}
          value={cfg.brand?.phone || ''}
          onChange={e => update('brand.phone', e.target.value)}
        />
  <label>{t.leftPanel?.email || 'E-mail'}</label>
        <input
          type="email"
          placeholder={t.leftPanel?.emailPlaceholder || 'E-mail'}
          value={cfg.brand?.email || ''}
          onChange={e => update('brand.email', e.target.value)}
        />

        {/* HERO SECTION HEADER WITH TOOLTIP */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20, marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{t.leftPanel?.heroSection || 'Sekcja Hero'}</span>
          <span
            style={{
              marginLeft: 8,
              cursor: 'pointer',
              color: '#888',
              fontSize: 18,
              position: 'relative',
              display: 'inline-block'
            }}
            title={t.leftPanel?.heroTooltip || 'Sekcja Hero to duży, wyróżniający się obszar na górze strony – zwykle z tłem, nagłówkiem i krótkim opisem. To pierwsza rzecz, którą widzi odwiedzający. Służy do przyciągnięcia uwagi i szybkiego przekazania najważniejszych informacji.'}
          >
            ?
          </span>
        </div>
      </div>

      {/* LOGO UPLOAD */}
  <label>{t.leftPanel?.logo || 'Logo'}</label>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <input
          type="url"
          placeholder="URL do logo lub wgraj plik"
          value={cfg.brand?.logo || ''}
          onChange={e => update('brand.logo', e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = evt => update('brand.logo', evt.target.result);
            reader.readAsDataURL(file);
          }}
        />
        {cfg.brand?.logo && <img src={cfg.brand.logo} alt="logo" style={{ maxHeight: 32, maxWidth: 64, background: '#fff', borderRadius: 4 }} />}
      </div>
      {/* LOGO SIZE SLIDER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 13 }}>{t.leftPanel?.logoSize || 'Wielkość logo'}</span>
        <input
          type="range"
          min={0.2}
          max={2}
          step={0.01}
          value={cfg.brand?.logoSize ?? 1}
          onChange={e => update('brand.logoSize', parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ width: 32, textAlign: 'right', fontSize: 13 }}>{Math.round((cfg.brand?.logoSize ?? 1) * 100)}%</span>
      </div>


      {/* HERO SECTION BACKGROUND TABLE */}
      <div style={{ marginTop: 12, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{t.leftPanel?.heroBg || 'Tło sekcji Hero'}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, marginBottom: 12 }}>
        <tbody>
          {/* 1. Gradient */}
          <tr>
            <td style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 15, verticalAlign: 'top' }}>1.</td>
            <td style={{ minWidth: 120 }}>
              <span style={{ fontWeight: 700, fontStyle: 'italic', fontSize: 14 }}>{t.leftPanel?.gradient || 'Gradient'}</span>
              <div style={{ marginTop: 6, marginBottom: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{t.leftPanel?.mainColor || 'kolor główny'}</span>
                  <ColorPicker
                    color={cfg.hero?.colors?.brand || '#1d4ed8'}
                    onChange={val => update('hero.colors.brand', val)}
                    swatches={['#1d4ed8', '#fff', '#222', '#f59e0b', '#64748b', '#000']}
                    style={{ marginRight: 8 }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{t.leftPanel?.accentColor || 'kolor akcentu'}</span>
                  <ColorPicker
                    color={cfg.hero?.colors?.accent || '#f59e0b'}
                    onChange={val => update('hero.colors.accent', val)}
                    swatches={['#f59e0b', '#fff', '#222', '#1d4ed8', '#64748b', '#000']}
                    style={{ marginRight: 8 }}
                  />
                </div>
              </div>
            </td>
            <td style={{ width: 60, textAlign: 'center', verticalAlign: 'middle' }}>
              <input
                type="checkbox"
                checked={cfg.hero?.bgType === 'gradient'}
                onChange={() => update('hero.bgType', 'gradient')}
                style={{ margin: 0 }}
              />
            </td>
          </tr>
          {/* 2. Jednolity kolor */}
          <tr>
            <td style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 15, verticalAlign: 'top' }}>2.</td>
            <td style={{ minWidth: 120 }}>
              <span style={{ fontWeight: 700, fontStyle: 'italic', fontSize: 14 }}>{t.leftPanel?.solidColor || 'Jednolity kolor'}</span>
              <div style={{ marginTop: 6, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ColorPicker
                  color={cfg.hero?.colors?.solid || '#1d4ed8'}
                  onChange={val => update('hero.colors.solid', val)}
                  swatches={['#1d4ed8', '#fff', '#222', '#f59e0b', '#facc15', '#64748b', '#000']}
                  style={{ marginRight: 8 }}
                />
              </div>
            </td>
            <td style={{ width: 60, textAlign: 'center', verticalAlign: 'middle' }}>
              <input
                type="checkbox"
                checked={cfg.hero?.bgType === 'solid'}
                onChange={() => update('hero.bgType', 'solid')}
                style={{ margin: 0 }}
              />
            </td>
          </tr>
          {/* 3. Obrazek */}
          <tr>
            <td style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 15, verticalAlign: 'top' }}>3.</td>
            <td style={{ minWidth: 120 }}>
              <span style={{ fontWeight: 700, fontStyle: 'italic', fontSize: 14 }}>{t.leftPanel?.image || 'Obrazek'}</span>
              <div style={{ marginTop: 6, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="file"
                  accept="image/*"
                  id="hero-bg-image-upload"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = evt => update('hero.background', evt.target.result);
                    reader.readAsDataURL(file);
                  }}
                />
                <button
                  className="btn"
                  type="button"
                  onClick={() => document.getElementById('hero-bg-image-upload').click()}
                >
                  {t.leftPanel?.chooseImage || 'Wybierz obrazek'}
                </button>
                {cfg.hero?.background && cfg.hero.background.startsWith('data:') && (
                  <img
                    src={cfg.hero.background}
                    alt="hero bg"
                    style={{ maxHeight: 32, maxWidth: 64, background: '#fff', borderRadius: 4 }}
                  />
                )}
              </div>
            </td>
            <td style={{ width: 60, textAlign: 'center', verticalAlign: 'middle' }}>
              <input
                type="checkbox"
                checked={cfg.hero?.bgType === 'image'}
                onChange={() => update('hero.bgType', 'image')}
                style={{ margin: 0 }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* COLOR SWATCHES */}
      <hr />
      {/* Usunięto: Kolor główny (hero) i swatch */}
      {/* Usunięto: Kolor akcentu (hero) i swatch */}
      {/* Kolor tytułu (hero) */}
  <label>{t.leftPanel?.heroTitleColor || 'Kolor tytułu (hero)'}</label>
      <div className="swatches" style={{ marginBottom: 8 }}>
        <ColorPicker
          color={cfg.hero?.colors?.descTitle || '#222'}
          onChange={val => update('hero.colors.descTitle', val)}
          swatches={['#222', '#fff', '#1d4ed8', '#f59e0b', '#facc15', '#64748b', '#000']}
          style={{ marginRight: 8 }}
        />
      </div>
  <label>{t.leftPanel?.heroDescColor || 'Kolor opisu (hero)'}</label>
      <div className="swatches" style={{ marginBottom: 8 }}>
        <ColorPicker
          color={cfg.hero?.colors?.descText || '#fff'}
          onChange={val => update('hero.colors.descText', val)}
          swatches={['#fff', '#222', '#1d4ed8', '#f59e0b', '#facc15', '#64748b', '#000']}
          style={{ marginRight: 8 }}
        />
      </div>
      {/* Kolory przycisków (hero) */}
  <label>{t.leftPanel?.heroButtonColors || 'Kolory przycisków (hero)'}</label>
      <div className="swatches" style={{ marginBottom: 8, display: 'flex', gap: 12, justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, marginBottom: 2 }}>{t.leftPanel?.primary || 'Główny'}</span>
          <ColorPicker
            color={cfg.hero?.colors?.buttonPrimary || '#facc15'}
            onChange={val => update('hero.colors.buttonPrimary', val)}
            swatches={['#facc15', '#fff', '#222', '#1d4ed8', '#f59e0b', '#64748b', '#000']}
            style={{ marginRight: 8 }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 12, marginBottom: 2 }}>{t.leftPanel?.secondary || 'Drugorzędny'}</span>
          <ColorPicker
            color={cfg.hero?.colors?.buttonSecondary || '#fff'}
            onChange={val => update('hero.colors.buttonSecondary', val)}
            swatches={['#fff', '#facc15', '#222', '#1d4ed8', '#f59e0b', '#64748b', '#000']}
            style={{ marginRight: 8 }}
          />
        </div>
      </div>

      {/* PACKAGE SELECTION */}
      <hr />
  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{t.leftPanel?.choosePackage || 'Wybierz pakiet'}</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <button
          className="btn"
          style={{
            background: cfg.package === 'basic' ? '#0ea5e9' : '#f1f5f9',
            color: cfg.package === 'basic' ? '#fff' : '#222',
            border: cfg.package === 'basic' ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
            fontWeight: cfg.package === 'basic' ? 700 : 400,
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 15
          }}
          onClick={() => {
            update('package', 'basic');
            update('sections', ['hero', 'usp', 'offer', 'contact', 'footer']); // no 'video' in basic
          }}
        >
    {t.leftPanel?.basicPackage || 'Pakiet podstawowy'} (149 zł)
        </button>
        <button
          className="btn"
          style={{
            background: (!cfg.package || cfg.package === 'pro') ? '#0ea5e9' : '#f1f5f9',
            color: (!cfg.package || cfg.package === 'pro') ? '#fff' : '#222',
            border: (!cfg.package || cfg.package === 'pro') ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
            fontWeight: (!cfg.package || cfg.package === 'pro') ? 700 : 400,
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 15
          }}
          onClick={() => {
            update('package', 'pro');
            // All available sections, always keep hero first and footer last
            const allSections = ['hero','usp','offer','gallery','pricing','faq','testimonials','booking','map','social','newsletter','promo','video','contact','footer'];
            update('sections', allSections);
          }}
        >
    {t.leftPanel?.proPackage || 'Pakiet rozszerzony'} (249 zł)
        </button>
      </div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
        {t.leftPanel?.removeSectionHint || 'Sekcje, których nie chcesz, możesz usunąć na liście poniżej klikając na krzyżyk.'}
      </div>
      {/* removed: dynamic list of sections in package */}
      {/* SECTION ORDER */}
      <hr />
  <label>{t.leftPanel?.sectionOrder || 'Kolejność sekcji'}</label>
      <div className="draglist" style={{ marginBottom: 16 }}>
        {(() => {
          const sections = cfg.sections || [];
          // Always keep hero first and footer last
          const hasHero = sections[0] === 'hero';
          const hasFooter = sections[sections.length - 1] === 'footer';
          // Get all sections except hero and footer
          const middle = sections.filter(s => s !== 'hero' && s !== 'footer');
          // Compose the ordered list
          const ordered = [
            ...(hasHero ? ['hero'] : []),
            ...middle,
            ...(hasFooter ? ['footer'] : [])
          ];
          return ordered.map((s, idx) => {
            const isHero = s === 'hero';
            const isFooter = s === 'footer';
            return (
              <div
                key={s}
                className={`dragitem${activeSection === s ? ' active' : ''}`}
                draggable={!(isHero || isFooter)}
                style={{
                  background: activeSection === s ? '#e0f2fe' : undefined,
                  border: activeSection === s ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
                  borderRadius: 6,
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px',
                  cursor: (isHero || isFooter) ? 'default' : 'pointer',
                  opacity: isFooter ? 0.7 : 1
                }}
                onDragStart={e => {
                  if (isHero || isFooter) return;
                  e.dataTransfer.setData('sect', s);
                  e.currentTarget.classList.add('dragging');
                }}
                onDragEnd={e => e.currentTarget.classList.remove('dragging')}
                onDragOver={e => {
                  e.preventDefault();
                  if (!(isHero || isFooter)) e.currentTarget.classList.add('dropzone');
                }}
                onDragLeave={e => e.currentTarget.classList.remove('dropzone')}
                onDrop={e => {
                  e.preventDefault();
                  if (isHero || isFooter) return;
                  const id = e.dataTransfer.getData('sect');
                  if (!id || id === 'hero' || id === 'footer' || s === 'hero' || s === 'footer') return;
                  let list = [...(cfg.sections || [])].filter(x => x !== 'footer' && x !== 'hero');
                  const from = list.indexOf(id);
                  const to = list.indexOf(s);
                  if (from < 0 || from === to) return;
                  const it = list.splice(from, 1)[0];
                  list.splice(to, 0, it);
                  // Rebuild the full list with hero and footer
                  const newSections = [
                    ...(hasHero ? ['hero'] : []),
                    ...list,
                    ...(hasFooter ? ['footer'] : [])
                  ];
                  update('sections', newSections);
                }}
                onClick={() => setActiveSection(s)}
              >
                <span className="draghandle" style={{ fontSize: 18, marginRight: 8 }}>{(isHero || isFooter) ? '•' : '≡'}</span>
                <b style={{ minWidth: 120, textDecoration: activeSection === s ? 'underline' : 'none', color: activeSection === s ? '#0ea5e9' : undefined }}>{getSectionLabel(s)}</b>
                {!(isHero || isFooter) && (
                  <button
                    className="btn"
                    style={{ marginLeft: 'auto' }}
                    onClick={e => {
                      e.stopPropagation();
                      // Remove section from list and add to removedSections
                      const newSections = (cfg.sections || []).filter(x => x !== s);
                      update('sections', newSections);
                      setRemovedSections(prev => prev.includes(s) ? prev : [...prev, s]);
                    }}
                  >✕</button>
                )}
              </div>
            );
          });
        })()}
      </div>

      {/* RESTORE REMOVED SECTIONS */}
      <div style={{ marginBottom: 16 }}>
    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t.leftPanel?.restoreSections || 'Przywróć usunięte sekcje'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {removedSections.filter(s => !((cfg.sections || []).includes(s))).map(s => (
            <button
              key={s}
              className="btn"
              style={{ background: '#f1f5f9', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 12px', fontSize: 14, cursor: 'pointer' }}
              onClick={() => {
                // Insert before footer if present, else at end
                let newSections = [...(cfg.sections || [])];
                const footerIdx = newSections.indexOf('footer');
                if (footerIdx > 0) {
                  newSections.splice(footerIdx, 0, s);
                } else {
                  newSections.push(s);
                }
                update('sections', newSections);
                setRemovedSections(prev => prev.filter(x => x !== s));
              }}
            >{getSectionLabel(s)}</button>
          ))}
        </div>
      </div>

      {/* GLOBAL BUTTON COLOR */}
      <hr />
  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.leftPanel?.buttonColors || 'Kolory przycisków na Twojej stronie'}</div>
      <div className="swatches" style={{ marginBottom: 8 }}>
        <ColorPicker
          color={cfg.buttonColor || '#0ea5e9'}
          onChange={val => update('buttonColor', val)}
          swatches={['#0ea5e9', '#facc15', '#f59e0b', '#1d4ed8', '#64748b', '#222', '#fff', '#000']}
          style={{ marginRight: 8 }}
        />
      </div>
  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.leftPanel?.buttonTextColors || 'Kolory tekstu przycisków na Twojej stronie'}</div>
      <div className="swatches" style={{ marginBottom: 16 }}>
        <ColorPicker
          color={cfg.buttonTextColor || '#fff'}
          onChange={val => update('buttonTextColor', val)}
          swatches={['#fff', '#222', '#0ea5e9', '#facc15', '#f59e0b', '#64748b', '#000']}
          style={{ marginRight: 8 }}
        />
      </div>
  <label>{t.leftPanel?.footerText || 'Tekst w stopce'}</label>
      <input
        type="text"
        placeholder="Tekst w stopce"
        value={cfg.footer?.text || ''}
        onChange={e => update('footer.text', e.target.value)}
      />
  <div style={{ marginTop: 8, marginBottom: 0, fontWeight: 600 }}>{t.leftPanel?.footerColor || 'Kolor:'}</div>
  <div style={{ marginBottom: 0 }}>{t.leftPanel?.footerBgColor || 'tła stopki'}</div>
      <div className="swatches" style={{ marginBottom: 8 }}>
        <ColorPicker
          color={cfg.footer?.background || '#f8fafc'}
          onChange={val => update('footer.background', val)}
          swatches={['#f8fafc', '#fff', '#222', '#1d4ed8', '#f59e0b', '#64748b', '#000']}
          style={{ marginRight: 8 }}
        />
      </div>
  <div style={{ marginBottom: 0 }}>{t.leftPanel?.footerTextColor || 'tekstu stopki'}</div>
      <div className="swatches" style={{ marginBottom: 12 }}>
        <ColorPicker
          color={cfg.footer?.textColor || '#64748b'}
          onChange={val => update('footer.textColor', val)}
          swatches={['#64748b', '#fff', '#222', '#1d4ed8', '#f59e0b', '#facc15', '#000']}
          style={{ marginRight: 8 }}
        />
      </div>

      {/* --- MAIN DYNAMIC SECTION EDITOR BLOCK --- */}
      {/* Section navigation list */}
      <div style={{ fontWeight: 600, fontSize: 15, margin: '24px 0 8px 0' }}>
        {t.leftPanel?.chooseSection || 'Wybierz sekcję, którą chcesz edytować'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {((cfg.sections || []).filter(s => s !== 'hero' && s !== 'footer').concat((cfg.sections || []).includes('footer') ? ['footer'] : [])).map(s => (
          <button
            key={s}
            className="btn"
            style={{
              background: activeSection === s ? '#0ea5e9' : '#f1f5f9',
              color: activeSection === s ? '#fff' : '#222',
              border: activeSection === s ? '2px solid #0ea5e9' : '1px solid #e5e7eb',
              fontWeight: activeSection === s ? 700 : 400,
              textDecoration: activeSection === s ? 'underline' : 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 6,
              transition: 'all 0.2s',
            }}
            onClick={() => setActiveSection(s)}
          >
            {getSectionLabel(s)}
          </button>
        ))}
      </div>
      {/* Section editors */}
      {((cfg.sections || []).filter(s => s !== 'hero' && s !== 'footer').concat((cfg.sections || []).includes('footer') ? ['footer'] : [])).map((s) => {
        if (s === 'hero') return null;
        return (
          <div
            key={s}
            ref={el => sectionRefs.current[s] = el}
            style={{ marginBottom: 24, display: activeSection === s ? 'block' : 'none' }}
          >
            {s === 'usp' && (
              <>
                <hr />
                <label>Unikalna Cecha Oferty</label>
                <input
                  type="text"
                  placeholder="Tytuł sekcji USP (np. Dlaczego my)"
                  value={cfg.usp?.title || 'Dlaczego my'}
                  onChange={(e) => update('usp.title', e.target.value)}
                />
                <div className="draglist">
                  {(cfg.usp?.items || []).map((item, i) => (
                    <div
                      key={i}
                      className="dragitem"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('usp', String(i));
                        e.currentTarget.classList.add('dragging');
                      }}
                      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const from = parseInt(e.dataTransfer.getData('usp'), 10);
                        const to = i;
                        const list = [...(cfg.usp?.items || [])];
                        const it = list.splice(from, 1)[0];
                        list.splice(to, 0, it);
                        update('usp.items', list);
                      }}
                    >
                      <span className="draghandle">≡</span>
                      <input
                        type="text"
                        placeholder="Ikona"
                        value={item.icon || ''}
                        onChange={(e) => update(`usp.items.${i}.icon`, e.target.value)}
                        style={{ width: 40 }}
                      />
                      <input
                        type="text"
                        placeholder="Tekst"
                        value={item.text || ''}
                        onChange={(e) => update(`usp.items.${i}.text`, e.target.value)}
                      />
                      <button className="btn" onClick={() => removeUSP(i)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="btn" onClick={addUSP}>+ Dodaj USP</button>
                </div>
              </>
            )}
            {s === 'offer' && (
              <>
                <hr />
                <label>Oferta</label>
                <div className="draglist">
                  {(cfg.offer?.items || []).map((item, i) => (
                    <div
                      key={i}
                      className="dragitem"
                      draggable
                      style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('offer', String(i));
                        e.currentTarget.classList.add('dragging');
                      }}
                      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const from = parseInt(e.dataTransfer.getData('offer'), 10);
                        const to = i;
                        const list = [...(cfg.offer?.items || [])];
                        const it = list.splice(from, 1)[0];
                        list.splice(to, 0, it);
                        update('offer.items', list);
                      }}
                    >
                      <span className="draghandle">≡</span>
                      <input
                        type="text"
                        placeholder="Tytuł"
                        value={item.title || ''}
                        onChange={(e) => update(`offer.items.${i}.title`, e.target.value)}
                      />
                      <textarea
                        placeholder="Opis"
                        value={item.desc || ''}
                        onChange={(e) => update(`offer.items.${i}.desc`, e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Cena"
                        value={item.price || ''}
                        onChange={(e) => update(`offer.items.${i}.price`, e.target.value)}
                        style={{ width: 120 }}
                      />
                      <button className="btn" onClick={() => removeOffer(i)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="btn" onClick={addOffer}>+ Dodaj ofertę</button>
                </div>
              </>
            )}
            {s === 'faq' && (
              <>
                <hr />
                <label>FAQ</label>
                <div className="draglist">
                  {(cfg.faq?.items || []).map((item, i) => (
                    <div
                      key={i}
                      className="dragitem"
                      draggable
                      style={{ flexDirection: 'column', alignItems: 'stretch', gap: 4 }}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('faq', String(i));
                        e.currentTarget.classList.add('dragging');
                      }}
                      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const from = parseInt(e.dataTransfer.getData('faq'), 10);
                        const to = i;
                        const list = [...(cfg.faq?.items || [])];
                        const it = list.splice(from, 1)[0];
                        list.splice(to, 0, it);
                        update('faq.items', list);
                      }}
                    >
                      <span className="draghandle">≡</span>
                      <input
                        type="text"
                        placeholder="Pytanie"
                        value={item.q || ''}
                        onChange={(e) => update(`faq.items.${i}.q`, e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <textarea
                        placeholder="Odpowiedź"
                        value={item.a || ''}
                        onChange={(e) => update(`faq.items.${i}.a`, e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <button className="btn" onClick={() => removeFAQ(i)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="row" style={{ marginTop: 6 }}>
                  <button className="btn" onClick={addFAQ}>+ Dodaj FAQ</button>
                </div>
              </>
            )}
            {s === 'gallery' && (
              <>
                <hr />
                <label>Galeria zdjęć</label>
                <div style={{ marginBottom: 12 }}>
                  <label htmlFor="gallery-image-size" style={{ display: 'block', marginBottom: 4 }}>Rozmiar obrazów w galerii: <b>{cfg.gallery?.imageSize || 280}px</b></label>
                  <input
                    id="gallery-image-size"
                    type="range"
                    min={40}
                    max={400}
                    step={4}
                    value={cfg.gallery?.imageSize || 280}
                    onChange={e => {
                      update('gallery.imageSize', parseInt(e.target.value, 10));
                      setTimeout(() => {
                        const slider = document.getElementById('gallery-image-size');
                        const gallery = document.querySelector('.center-preview .gallery');
                        if (slider && gallery) {
                          const sliderRect = slider.getBoundingClientRect();
                          const galleryRect = gallery.getBoundingClientRect();
                          // Calculate the difference in Y position relative to viewport
                          const offset = galleryRect.top - sliderRect.top;
                          window.scrollBy({ top: offset, behavior: 'smooth' });
                        }
                      }, 50);
                    }}
                    style={{ width: '100%', marginBottom: 8 }}
                  />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  {(cfg.gallery?.images || []).map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img} alt="galeria" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ccc' }} />
                      <button className="btn" style={{ position: 'absolute', top: 2, right: 2, padding: 2, fontSize: 12 }} onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                  <label className="btn" style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: 6, cursor: 'pointer' }}>
                    +
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = evt => update('gallery.images', [...(cfg.gallery?.images || []), evt.target.result]);
                      reader.readAsDataURL(file);
                    }} />
                  </label>
                </div>
              </>
            )}
            {s === 'pricing' && (
              <>
                <hr />
                <label>Cennik</label>
                <div className="row" style={{ marginBottom: 8, gap: 8, alignItems: 'center' }}>
                  <label htmlFor="pricing-mode" style={{ marginRight: 4 }}>Tryb:</label>
                  <select
                    id="pricing-mode"
                    value={cfg.pricing?.mode || 'table'}
                    onChange={e => update('pricing.mode', e.target.value)}
                    style={{ minWidth: 100 }}
                  >
                    <option value="table">Tabela (uzupełnij ją pod spodem)</option>
                    <option value="list">Lista - pobierz dane z pliku excel)</option>
                  </select>
                  <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} />
                  <span style={{ fontSize: 12, color: '#888' }}>Import z Excela</span>
                </div>
                <div className="row" style={{ marginBottom: 8, gap: 8, alignItems: 'center' }}>
                  <label htmlFor="pricing-attachment" style={{ marginRight: 4 }}>Załącznik:</label>
                  <input
                    id="pricing-attachment"
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = evt => {
                        update('pricing.attachment', {
                          name: file.name,
                          type: file.type,
                          data: evt.target.result
                        });
                      };
                      if (file.type.startsWith('image/')) {
                        reader.readAsDataURL(file);
                      } else {
                        reader.readAsDataURL(file); // PDF as base64
                      }
                    }}
                  />
                  {cfg.pricing?.attachment && (
                    <span style={{ fontSize: 12, color: '#0077b5', marginLeft: 8 }}>
                      {cfg.pricing.attachment.name}
                      <button className="btn" style={{ marginLeft: 8 }} onClick={() => update('pricing.attachment', null)}>Usuń</button>
                    </span>
                  )}
                </div>
                <div className="pricing-table">
                  {(cfg.pricing?.rows || []).map((r, i) => (
                    <div key={i} className="pricing-row" style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <input
                        type="text"
                        placeholder="Nazwa usługi"
                        value={r.title || ''}
                        onChange={e => update(`pricing.rows.${i}.title`, e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        placeholder="Cena"
                        value={r.price || ''}
                        onChange={e => update(`pricing.rows.${i}.price`, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Jednostka (np. zł, m²)"
                        value={r.unit || ''}
                        onChange={e => update(`pricing.rows.${i}.unit`, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button className="btn" onClick={() => update('pricing.rows', (cfg.pricing?.rows || []).filter((_, j) => j !== i))}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn" onClick={() => update('pricing.rows', [...(cfg.pricing?.rows || []), { title: '', price: '', unit: '' }])}>+ Dodaj pozycję</button>
              </>
            )}
            {s === 'testimonials' && (
              <>
                <hr />
                <label>Opinie</label>
                <div className="testimonials-list">
                  {(cfg.testimonials?.items || []).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <input
                        type="text"
                        placeholder="Autor"
                        value={item.author || ''}
                        onChange={e => update(`testimonials.items.${i}.author`, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        placeholder="Opinia"
                        value={item.text || ''}
                        onChange={e => update(`testimonials.items.${i}.text`, e.target.value)}
                        style={{ flex: 2 }}
                      />
                      <button className="btn" onClick={() => removeTestimonial(i)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn" onClick={addTestimonial}>+ Dodaj opinię</button>
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Call to action (przycisk zachęty do opinii Google)
                    <span style={{ cursor: 'pointer', color: '#888' }} title="Aby skonfigurować link do opinii Google: 1. Wyszukaj swoją firmę w Google. 2. Kliknij 'Napisz opinię'. 3. Skopiuj adres URL z paska przeglądarki i wklej poniżej. Ten link przeniesie użytkownika bezpośrednio do formularza dodawania opinii.">?</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tekst przycisku (np. Dodaj opinię na Google)"
                    value={cfg.reviews?.cta || ''}
                    onChange={e => update('reviews.cta', e.target.value)}
                    style={{ width: '100%', marginBottom: 6 }}
                  />
                  <input
                    type="url"
                    placeholder="Link do opinii Google (https://...)"
                    value={cfg.reviews?.link || ''}
                    onChange={e => update('reviews.link', e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </>
            )}
            {s === 'video' && (
              <>
                <hr />
                <label>Video</label>
                <div style={{ marginBottom: 8 }}>
                  <input
                    type="url"
                    placeholder="Link do filmu YouTube lub Vimeo"
                    value={cfg.videos?.[0] || ''}
                    onChange={e => update('videos', [e.target.value])}
                    style={{ width: '100%' }}
                  />
                </div>
              </>
            )}
            {s === 'booking' && (
              <>
                <hr />
                <label>Rezerwacje</label>
                <input
                  type="text"
                  placeholder="Link do systemu rezerwacji (np. Booksy, Calendly)"
                  value={cfg.booking?.link || ''}
                  onChange={e => update('booking.link', e.target.value)}
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <div style={{ fontSize: 13, color: '#555', background: '#f8fafc', border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                  <b>Jak skonfigurować rezerwacje spotkań na żywo przez <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer">Calendly</a>?</b><br />
                  <ol style={{ margin: '8px 0 8px 18px', padding: 0 }}>
                    <li>Zarejestruj się na <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer">calendly.com</a> (możesz użyć konta Google lub e-maila).</li>
                    <li>Po rejestracji przejdź do <b>"Calendar Connections"</b> i połącz swój kalendarz Google, Outlook lub inny.</li>
                    <li>Utwórz wydarzenie (np. "Wizyta w gabinecie", "Spotkanie w salonie", "Konsultacja w biurze") i skonfiguruj dostępne dni oraz godziny.</li>
                    <li>W sekcji "Location" wybierz <b>"In person meeting"</b> lub wpisz adres swojego gabinetu/salonu/biura.</li>
                    <li>Po utworzeniu wydarzenia kliknij "Share" i skopiuj <b>link do rezerwacji</b> (np. <i>https://calendly.com/twoja-nazwa/wizyta</i>).</li>
                    <li>Wklej ten link powyżej, aby klienci mogli rezerwować wizyty stacjonarne.</li>
                  </ol>
                  <b>Darmowy plan:</b> 1 typ spotkania (np. jedna usługa lub lokalizacja), nielimitowana liczba rezerwacji miesięcznie.<br />
                  <b>Płatne plany:</b> od ok. 10 USD/mies. (więcej typów spotkań, integracje, automatyczne przypomnienia SMS/e-mail, płatności online itp.).<br />
                  Szczegóły: <a href="https://calendly.com/pricing" target="_blank" rel="noopener noreferrer">cennik Calendly</a>.<br />
                  <span style={{ color: '#b45309' }}><b>Uwaga:</b> Klient wybiera termin i miejsce spotkania stacjonarnego (np. w Twoim gabinecie, salonie, biurze).</span>
                </div>
              </>
            )}
            {/* removed vouchers section */}
            {s === 'social' && (
              <>
                <hr />
                <label>Social media</label>
                <input
                  type="url"
                  placeholder="Link do Facebooka"
                  value={cfg.social?.facebook || ''}
                  onChange={e => update('social.facebook', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
                <input
                  type="url"
                  placeholder="Link do Instagrama"
                  value={cfg.social?.instagram || ''}
                  onChange={e => update('social.instagram', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
                <input
                  type="url"
                  placeholder="Link do TikToka"
                  value={cfg.social?.tiktok || ''}
                  onChange={e => update('social.tiktok', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
                <input
                  type="url"
                  placeholder="Link do X.com (Twitter)"
                  value={cfg.social?.x || ''}
                  onChange={e => update('social.x', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
                <input
                  type="url"
                  placeholder="Link do YouTube"
                  value={cfg.social?.youtube || ''}
                  onChange={e => update('social.youtube', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
                <input
                  type="url"
                  placeholder="Link do LinkedIn"
                  value={cfg.social?.linkedin || ''}
                  onChange={e => update('social.linkedin', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
                <input
                  type="url"
                  placeholder="Inny link (np. Pinterest...)"
                  value={cfg.social?.other || ''}
                  onChange={e => update('social.other', e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }}
                />
              </>
            )}
            {s === 'newsletter' && (
              <>
                <hr />
                <label>Newsletter</label>
                <input
                  type="email"
                  placeholder="Adres e-mail do zapisu"
                  value={cfg.newsletter?.email || ''}
                  onChange={e => update('newsletter.email', e.target.value)}
                  style={{ width: '100%', marginBottom: 8 }}
                />
              </>
            )}
            {s === 'promo' && (
              <>
                <hr />
                <label>Promocje</label>
                <div className="promo-list">
                  {(cfg.promo && Array.isArray(cfg.promo) ? cfg.promo : []).map((item, i) => (
                    <div key={i} style={{ border: '1px solid #fbbf24', borderRadius: 8, padding: 12, marginBottom: 12, background: '#fef3c7', position: 'relative' }}>
                      <button className="btn" style={{ position: 'absolute', top: 8, right: 8, fontSize: 14, padding: '2px 8px' }} onClick={() => update('promo', (cfg.promo || []).filter((_, j) => j !== i))}>✕</button>
                      <input
                        type="text"
                        placeholder="Wysokość zniżki / rabatu (np. 20% taniej, -50 zł)"
                        value={item.discount || ''}
                        onChange={e => update(`promo.${i}.discount`, e.target.value)}
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                      <input
                        type="text"
                        placeholder="Hasło promocyjne (np. Skorzystaj z promocji!)"
                        value={item.text || ''}
                        onChange={e => update(`promo.${i}.text`, e.target.value)}
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                      <input
                        type="date"
                        placeholder="Data zakończenia promocji"
                        value={item.endDate || ''}
                        onChange={e => update(`promo.${i}.endDate`, e.target.value)}
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                      <textarea
                        placeholder="Regulamin promocji (opcjonalnie)"
                        value={item.terms || ''}
                        onChange={e => update(`promo.${i}.terms`, e.target.value)}
                        style={{ width: '100%', marginBottom: 8 }}
                      />
                    </div>
                  ))}
                </div>
                <button className="btn" onClick={() => update('promo', [...(cfg.promo && Array.isArray(cfg.promo) ? cfg.promo : []), { discount: '', text: '', endDate: '', terms: '' }])}>+ Dodaj promocję</button>
              </>
            )}
            {s === 'map' && (
              <div style={{ background: '#f1f5f9', borderRadius: 6, padding: 16, margin: '16px 0', color: '#555' }}>
                <b>Brak pól do edycji.</b><br />
                Lokalizacja mapy jest pobierana automatycznie na podstawie adresu i miasta z sekcji danych firmy powyżej.
              </div>
            )}
            {s === 'contact' && (
              <div style={{ background: '#f1f5f9', borderRadius: 6, padding: 16, margin: '16px 0', color: '#555' }}>
                <b>Brak pól do edycji.</b><br />
                Dane kontaktowe (telefon, e-mail, adres) są pobierane z sekcji danych firmy powyżej.
              </div>
            )}
            {s === 'footer' && (
              <div style={{ background: '#f1f5f9', borderRadius: 6, padding: 16, margin: '16px 0', color: '#555' }}>
                <b>Brak pól do edycji.</b><br />
                Tekst i kolory stopki możesz ustawić w sekcji "Tekst w stopce" powyżej.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
