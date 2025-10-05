import React, { useState, useEffect, useRef } from 'react';
import { getTranslation } from './i18n';

const FONT_FAMILY = 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
const baseTextStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 400, fontStyle: 'normal' };
const headingStyle = { fontFamily: FONT_FAMILY, fontSize: 20, fontWeight: 700, fontStyle: 'normal', margin: 0 };
const subheadingStyle = { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: 600, fontStyle: 'normal' };
const labelStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 500, fontStyle: 'normal', display: 'block', marginBottom: 6 };
const inputStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 400, fontStyle: 'normal', borderRadius: 6, border: '1px solid #e5e7eb', padding: 6, width: '100%' };
const buttonStyle = { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: 500, fontStyle: 'normal', borderRadius: 8, border: '1px solid #e5e7eb', padding: '8px 16px', cursor: 'pointer', background: '#fff' };

export default function CenterPreview({ cfg, update, showRight, setShowRight }) {
  const galleryRef = useRef(null);
  // Listen for gallery scroll event from LeftPanel
  useEffect(() => {
    const handler = () => {
      if (galleryRef.current) {
        galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('scroll-to-gallery', handler);
    return () => window.removeEventListener('scroll-to-gallery', handler);
  }, []);
  const [openFAQ, setOpenFAQ] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [messageStatus, setMessageStatus] = useState('');

  const toggleFAQ = (index) => {
    setOpenFAQ((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setMessageStatus('');

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setMessageStatus('Wiadomość wysłana! Dziękujemy!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setMessageStatus('Wystąpił błąd. Spróbuj ponownie.');
      }
    } catch (error) {
      setMessageStatus('Błąd połączenia. Sprawdź internet.');
    } finally {
      setIsSending(false);
      setTimeout(() => setMessageStatus(''), 3000);
    }
  };

  // Usunięto automatyczne dodawanie sekcji 'video' przy obecności wideo

  const t = getTranslation(cfg);
  return (
    <div className="preview" style={baseTextStyle}>
      {(() => {
        const sections = cfg.sections || [];
        const filtered = sections.filter(s => s !== 'footer');

        return [...filtered, ...(sections.includes('footer') ? ['footer'] : [])].map((s, idx) => {
          // Hide 'video' section if package is basic
          if (s === 'video' && cfg.package === 'basic') return null;
          // HIDE EMPTY SECTIONS (move booking up to prevent container render)
          if (s === 'gallery' && (!cfg.gallery?.images || cfg.gallery.images.length === 0)) return null;
          if (s === 'pricing' && (!cfg.pricing?.rows || cfg.pricing.rows.length === 0)) return null;
          if (s === 'testimonials' && (!cfg.testimonials?.items || cfg.testimonials.items.length === 0)) return null;
          if (s === 'faq' && (!cfg.faq?.items || cfg.faq.items.length === 0)) return null;
          if (s === 'video' && (!cfg.videos || cfg.videos.length === 0 || !cfg.videos[0])) return null;
          // booking handled below
          if (s === 'social' && !(
            cfg.social?.facebook ||
            cfg.social?.instagram ||
            cfg.social?.tiktok ||
            cfg.social?.x ||
            cfg.social?.youtube ||
            cfg.social?.linkedin ||
            cfg.social?.other
          )) return null;
          if (s === 'newsletter' && (!cfg.newsletter?.email)) return null;
          if (s === 'promo' && (!Array.isArray(cfg.promo) || cfg.promo.length === 0)) return null;

          const isHero = s === 'hero';
          const isFooter = s === 'footer';
          const sectionClass = isHero ? 'hero' : (isFooter ? 'footer' : 'section');

          let heroStyle = {};
          if (isHero) {
            const bgType = cfg.hero?.bgType || 'gradient';
            if (bgType === 'image' && cfg.hero?.background) {
              heroStyle = {
                backgroundImage: `url('${cfg.hero.background}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              };
            } else if (bgType === 'solid') {
              heroStyle = {
                background: cfg.hero?.colors?.solid || '#1d4ed8',
              };
            } else {
              // gradient (default)
              const start = cfg.hero?.colors?.brand || '#1d4ed8';
              const end = cfg.hero?.colors?.accent || '#f59e0b';
              heroStyle = {
                background: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
              };
            }
          }

          // Add id for anchor navigation
          let id = undefined;
          if (s === 'contact') id = 'contact';
          if (s === 'offer') id = 'offer';

          // Render booking section only if link is present
          if (s === 'booking') {
            if (!cfg.booking?.link || cfg.booking.link.trim() === '') return null;
            return (
              <div key={s} className={sectionClass}>
                <h3>{t.booking?.header || 'Rezerwacja terminu'}</h3>
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    title={t.booking?.header || 'Rezerwacja'}
                    src={cfg.booking.link}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '1px solid var(--line)', borderRadius: '12px' }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          }
          return (
            <div
              key={s}
              className={sectionClass}
              style={
                isHero ? heroStyle :
                (isFooter ? {
                  background: cfg.footer?.background || '#f8fafc',
                  color: cfg.footer?.textColor || '#64748b'
                } : {})
              }
              {...(id ? { id } : {})}
            >
              {s === 'hero' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 90 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ color: cfg.hero?.colors?.descTitle || '#222', margin: 0, textAlign: 'center' }}>{cfg.brand?.title || t.hero?.title || 'Twoja firma'}</h3>
                    <div className="small" style={{ color: cfg.hero?.colors?.descText || '#fff', margin: 0, textAlign: 'center' }}>{cfg.brand?.desc || t.hero?.desc || 'Krótki opis oferty'}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
                      <button
                        className="cta cta-primary"
                        style={{
                          background: cfg.hero?.colors?.buttonPrimary || '#facc15',
                          color: cfg.hero?.colors?.buttonPrimaryText || '#fff',
                          minWidth: 150,
                          fontWeight: 400,
                          fontSize: 18,
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif',
                          fontStyle: 'normal',
                          border: 'none',
                          borderRadius: 12,
                          padding: '16px 28px',
                          boxShadow: '0 2px 8px #0001',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        onMouseOver={e => e.currentTarget.style.background = cfg.hero?.colors?.buttonPrimaryHover || '#eab308'}
                        onMouseOut={e => e.currentTarget.style.background = cfg.hero?.colors?.buttonPrimary || '#facc15'}
                      >
                        {t.hero?.ctaContact || 'Skontaktuj się'}
                      </button>
                      <button
                        className="cta cta-outline"
                        style={{
                          background: cfg.hero?.colors?.buttonSecondary || '#fff',
                          color: cfg.hero?.colors?.buttonSecondaryText || '#222',
                          minWidth: 150,
                          fontWeight: 400,
                          fontSize: 18,
                          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif',
                          fontStyle: 'normal',
                          border: 'none',
                          borderRadius: 12,
                          padding: '16px 28px',
                          boxShadow: '0 2px 8px #0001',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
                        onMouseOver={e => e.currentTarget.style.background = cfg.hero?.colors?.buttonSecondaryHover || '#f3f4f6'}
                        onMouseOut={e => e.currentTarget.style.background = cfg.hero?.colors?.buttonSecondary || '#fff'}
                      >
                        {t.hero?.ctaOffer || 'Zobacz ofertę'}
                      </button>
                    </div>
                  </div>
                  {cfg.brand?.logo && (
                    <img
                      className="hero-logo"
                      src={cfg.brand.logo}
                      alt="Logo"
                      style={{
                        maxHeight: `${80 * (cfg.brand.logoSize ?? 1)}px`,
                        maxWidth: `${120 * (cfg.brand.logoSize ?? 1)}px`,
                        marginLeft: 24,
                        marginRight: 0,
                        objectFit: 'contain',
                        background: '#fff',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px #0001',
                        transition: 'max-width 0.2s, max-height 0.2s'
                      }}
                    />
                  )}
                </div>
              )}
              {s === 'usp' && (
                <>
                  <h3>{cfg.usp?.title || t.usp?.header || 'Dlaczego my'}</h3>
                  <div className="usp-grid">
                    {(cfg.usp?.items || []).map((u, i) => (
                      <div key={i} className="usp-item" style={{ margin: 0 }}>
                        {u.icon || '✄'} {u.text}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {s === 'whyus' && (
                <>
                  <h3>{t.whyus?.header || 'Dlaczego my'}</h3>
                  <div className="small">{cfg.whyus?.text}</div>
                </>
              )}
              {s === 'offer' && (
                <>
                  <h3>Oferta</h3>
                  <div className="grid2">
                    {(cfg.offer?.items || []).map((o, i) => (
                      <div key={i} className="section" style={{ margin: 0 }}>
                        <b>{o.title}</b>
                        <div className="small">{o.desc}</div>
                        <div className="price" style={{ color: 'var(--accent)' }}>{o.price}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {s === 'gallery' && cfg.gallery?.images?.length && (
                <>
                  <h3>{t.gallery?.header || 'Galeria'}</h3>
                  <div
                    className="gallery"
                    ref={galleryRef}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(auto-fit, minmax(${cfg.gallery?.imageSize || 280}px, 1fr))`,
                      gap: 16,
                      justifyItems: 'center',
                      alignItems: 'center',
                      width: '100%',
                      overflow: 'visible',
                      boxSizing: 'border-box',
                    }}
                  >
                    {cfg.gallery.images.map((src, i) => {
                      const size = cfg.gallery?.imageSize || 280;
                      return (
                        <div key={i} className="thumb" style={{ width: size, height: size, background: '#f3f4f6', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc' }}>
                          <img
                            src={src}
                            alt={`Gallery item ${i}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {s === 'pricing' && (
                <>
                  <h3>{t.pricing?.header || 'Cennik'}</h3>
                  {cfg.pricing?.attachment && (
                    <div style={{ margin: '12px 0' }}>
                      {cfg.pricing.attachment.type.startsWith('image/') ? (
                        <img
                          src={cfg.pricing.attachment.data}
                          alt={cfg.pricing.attachment.name}
                          style={{ maxWidth: '100%', maxHeight: 320, borderRadius: 8, boxShadow: '0 2px 8px #0001', marginBottom: 8 }}
                        />
                      ) : cfg.pricing.attachment.type === 'application/pdf' ? (
                        <a
                          href={cfg.pricing.attachment.data}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-block', color: '#0077b5', fontWeight: 500, marginBottom: 8 }}
                        >
                          🄄 {t.pricing?.pdf || 'Zobacz cennik PDF'} ({cfg.pricing.attachment.name})
                        </a>
                      ) : null}
                    </div>
                  )}
                  {cfg.pricing?.mode === 'table' && (
                    <div className="pricing-table">
                      {cfg.pricing.rows.map((r, i) => (
                        <div key={i} className="pricing-row">
                          <span>{r.title}</span>
                          <b style={{ color: 'var(--accent)' }}>{r.price}</b>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {s === 'faq' && cfg.faq?.items?.length && (
                <>
                  <h3>{t.faq?.header || 'FAQ'}</h3>
                  <div className="faq-accordion">
                    {cfg.faq.items.map((i, ix) => (
                      <div key={ix} className="faq-item" style={{ border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 8, background: '#f9fafb' }}>
                        <div
                          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 10 }}
                          onClick={() => toggleFAQ(ix)}
                        >
                          <b style={{ flex: 1 }}>{i.q || t.faq?.question || 'Pytanie...'}</b>
                          <span style={{ fontSize: 18 }}>{openFAQ[ix] ? '▲' : '▼'}</span>
                        </div>
                        {openFAQ[ix] && (
                          <div style={{ padding: 10, borderTop: '1px solid #e5e7eb', background: '#fff' }}>
                            <div>{i.a || <span style={{ color: '#aaa' }}>{t.faq?.noAnswer || 'Brak odpowiedzi'}</span>}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {s === 'testimonials' && (
                <>
                  <h3>{t.testimonials?.header || 'Opinie'}</h3>
                  <div className="testimonials-grid">
                    {(cfg.testimonials?.items || []).map((t, i) => (
                      <blockquote key={i} className="testimonial-card">
                      <div style={{ fontWeight: 600 }}>„{t.text}”</div>
                      <div className="small">- {t.author || t.testimonials?.author || 'Klient'}</div>
                    </blockquote>
                    ))}
                  </div>
                  {cfg.reviews?.link && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                      <a className="btn btn-primary" href={cfg.reviews.link} target="_blank" rel="noreferrer" style={{ background: cfg.buttonColor || (cfg.hero?.colors?.buttonPrimary || 'var(--accent)'), color: cfg.buttonTextColor || (cfg.hero?.colors?.buttonPrimaryText || '#fff'), fontWeight: 400, fontSize: 18, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', fontStyle: 'normal', padding: '16px 32px', border: 'none', borderRadius: 14, boxShadow: '0 2px 8px #0001', transition: 'background 0.2s', display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                        {cfg.reviews?.cta || t.testimonials?.cta || 'Dodaj opinię na Google'}
                      </a>
                    </div>
                  )}
                </>
              )}
              {s === 'contact' && (
                <>
                  <h3>{t.contact?.header || 'Kontakt'}</h3>
                  <ul className="list">
                    {cfg.brand?.phone && (
                      <li>
                        <span>☎️</span> <a href={`tel:${cfg.brand.phone}`} style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 500 }}>{t.contact?.phone || 'Telefon'}: {cfg.brand.phone}</a>
                      </li>
                    )}
                    {cfg.brand?.email && (
                      <li>
                        <span>✉️</span> <a href={`mailto:${cfg.brand.email}`} style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 500 }}>{t.contact?.email || 'E-mail'}: {cfg.brand.email}</a>
                      </li>
                    )}
                    {cfg.brand?.address && cfg.brand?.city && (
                      <li>
                        <span>🄍</span> {t.contact?.address || 'Adres'}: {cfg.brand.address}, {t.contact?.city || 'Miasto'}: {cfg.brand.city}
                      </li>
                    )}
                  </ul>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <input
                      type="text"
                      name="name"
                      placeholder={t.contact?.name || 'Twoje imię'}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder={t.contact?.email || 'Twój email'}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <textarea
                      name="message"
                      placeholder={t.contact?.message || 'Twoja wiadomość'}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    <button type="submit" className="btn btn-primary" disabled={isSending} style={{ background: cfg.buttonColor || (cfg.hero?.colors?.buttonPrimary || 'var(--accent)'), color: cfg.buttonTextColor || (cfg.hero?.colors?.buttonPrimaryText || '#fff'), fontWeight: 400, fontSize: 18, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', fontStyle: 'normal', padding: '16px 32px', border: 'none', borderRadius: 14, boxShadow: '0 2px 8px #0001', transition: 'background 0.2s', display: 'inline-block', textAlign: 'center' }}>
                      {isSending ? (t.contact?.sending || 'Wysyłanie...') : (t.contact?.send || 'Wyślij')}
                    </button>
                    {messageStatus && <div className="form-message">{messageStatus}</div>}
                  </form>
                </>
              )}
              {s === 'map' && cfg.brand?.address && cfg.brand?.city && (
                <>
                  <h3>{t.map?.header || 'Mapa dojazdu'}</h3>
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe
                      title={t.map?.header || 'Mapa'}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(`${cfg.brand.address}, ${cfg.brand.city}`)}&output=embed`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '1px solid var(--line)', borderRadius: '12px' }}
                      loading="lazy"
                      allowFullScreen
                    />
                  </div>
                </>
              )}
              {s === 'video' && cfg.videos?.length > 0 && (
                <>
                  <h3>{t.video?.header || 'Wideo'}</h3>
                  <div className="video-grid">
                    {cfg.videos.map((videoUrl, i) => {
                      const videoId = videoUrl.match(/[?&]v=([^&]+)/)?.[1] || videoUrl.split('/').pop();
                      return (
                        <div key={i} className="video-item">
                          <iframe
                            title={`YouTube Video ${i + 1}`}
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '12px', zIndex: 1 }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {/* removed vouchers section */}
              {s === 'social' && (
                <>
                  <h3>{t.social?.header || 'Media społecznościowe'}</h3>
                  <div className="row" style={{ flexWrap: 'wrap', gap: 16, fontSize: 32, alignItems: 'center' }}>
                    {cfg.social?.facebook && (
                      <a href={cfg.social.facebook} target="_blank" rel="noreferrer" title="Facebook" style={{ color: '#1877f3' }}>
                        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M29 0H3C1.3 0 0 1.3 0 3v26c0 1.7 1.3 3 3 3h13V20h-4v-5h4v-3.6C16 7.7 18.4 6 21.2 6c1.3 0 2.5.1 2.8.1v4h-1.9c-1.5 0-1.8.7-1.8 1.8V15h5l-1 5h-4v12h7c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"/></svg>
                      </a>
                    )}
                    {cfg.social?.instagram && (
                      <a href={cfg.social.instagram} target="_blank" rel="noreferrer" title="Instagram" style={{ color: '#e1306c' }}>
                        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M16 7.3A8.7 8.7 0 1 0 24.7 16 8.7 8.7 0 0 0 16 7.3zm0 14.3A5.6 5.6 0 1 1 21.6 16 5.6 5.6 0 0 1 16 21.6zm8.8-14.5a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm5.7 2.1a6.1 6.1 0 0 0-1.7-4.3A6.1 6.1 0 0 0 24.5 1.6C22.1.6 17.9.6 15.5 1.6a6.1 6.1 0 0 0-4.3 1.7A6.1 6.1 0 0 0 1.6 7.5C.6 9.9.6 14.1 1.6 16.5a6.1 6.1 0 0 0 1.7 4.3 6.1 6.1 0 0 0 4.3 1.7c2.4 1 6.6 1 9 0a6.1 6.1 0 0 0 4.3-1.7 6.1 6.1 0 0 0 1.7-4.3c1-2.4 1-6.6 0-9zM28.5 24a3.9 3.9 0 0 1-2.2 2.2c-1.5.6-5.1.5-6.3.5s-4.8.1-6.3-.5A3.9 3.9 0 0 1 3.5 24c-.6-1.5-.5-5.1-.5-6.3s-.1-4.8.5-6.3A3.9 3.9 0 0 1 7.5 3.5c1.5-.6 5.1-.5 6.3-.5s4.8-.1 6.3.5A3.9 3.9 0 0 1 28.5 8c.6 1.5.5 5.1.5 6.3s.1 4.8-.5 6.3z"/></svg>
                      </a>
                    )}
                    {cfg.social?.tiktok && (
                      <a href={cfg.social.tiktok} target="_blank" rel="noreferrer" title="TikTok" style={{ color: '#000' }}>
                        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M28.5 10.5c-2.2 0-4-1.8-4-4V2h-4v18.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.3 0 .7 0 1 .1V14c-.3 0-.7-.1-1-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V14.5c1.2 1 2.7 1.5 4.5 1.5v-4z"/></svg>
                      </a>
                    )}
                    {cfg.social?.x && (
                      <a href={cfg.social.x} target="_blank" rel="noreferrer" title="X.com" style={{ color: '#000' }}>
                        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M26.6 4H5.4C4.1 4 3 5.1 3 6.4v19.2C3 26.9 4.1 28 5.4 28h21.2c1.3 0 2.4-1.1 2.4-2.4V6.4C29 5.1 27.9 4 26.6 4zM23.7 22.3h-2.2l-3.2-4.2-3.2 4.2h-2.2l4.3-5.6-4.3-5.6h2.2l3.2 4.2 3.2-4.2h2.2l-4.3 5.6z"/></svg>
                      </a>
                    )}
                    {cfg.social?.youtube && (
                      <a href={cfg.social.youtube} target="_blank" rel="noreferrer" title="YouTube" style={{ color: '#ff0000' }}>
                        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M31.7 8.3c-.4-1.6-1.7-2.9-3.3-3.3C25.1 4.5 16 4.5 16 4.5s-9.1 0-12.4.5c-1.6.4-2.9 1.7-3.3 3.3C0 11.6 0 16 0 16s0 4.4.3 7.7c.4 1.6 1.7 2.9 3.3 3.3C6.9 27.5 16 27.5 16 27.5s9.1 0 12.4-.5c1.6-.4 2.9-1.7 3.3-3.3.3-3.3.3-7.7.3-7.7s0-4.4-.3-7.7zM12.8 21.1V10.9l8.3 5.1-8.3 5.1z"/></svg>
                      </a>
                    )}
                    {cfg.social?.linkedin && (
                      <a href={cfg.social.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" style={{ color: '#0077b5' }}>
                        <svg width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340.7C24.09 107.3 0 83.2 0 53.6A53.6 53.6 0 0 1 53.6 0c29.6 0 53.6 24.09 53.6 53.6 0 29.6-24 53.7-53.36 53.7zM447.8 448h-92.4V302.4c0-34.7-12.4-58.4-43.3-58.4-23.6 0-37.6 15.9-43.7 31.3-2.3 5.6-2.8 13.4-2.8 21.2V448h-92.4s1.2-242.1 0-267.1h92.4v37.9c12.3-19 34.3-46.1 83.5-46.1 60.9 0 106.7 39.8 106.7 125.4V448z"/>
                        </svg>
                      </a>
                    )}
                    {cfg.social?.other && (
                      <a href={cfg.social.other} target="_blank" rel="noreferrer" title="Inne" style={{ color: '#64748b' }}>
                        <svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="16"/><text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff">?</text></svg>
                      </a>
                    )}
                  </div>
                </>
              )}
              {s === 'newsletter' && (
                <>
                  <h3>{t.newsletter?.header || 'Newsletter'}</h3>
                  {cfg.newsletter?.url ? (
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                      <iframe
                        title="Newsletter"
                        src={cfg.newsletter.url}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '1px solid var(--line)', borderRadius: '12px' }}
                        loading="lazy"
                      />
                    </div>
                  ) : cfg.newsletter?.email ? (
                    <form className="newsletter-form" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400, margin: '0 auto' }} onSubmit={e => { e.preventDefault(); window.open(`mailto:${cfg.newsletter.email}`); }}>
                      <input type="email" required placeholder={t.newsletter?.placeholder || 'Twój email'} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
                      <button type="submit" className="cta cta-primary" style={{ padding: 10, borderRadius: 6, background: cfg.buttonColor || (cfg.hero?.colors?.buttonPrimary || 'var(--accent)'), color: cfg.buttonTextColor || (cfg.hero?.colors?.buttonPrimaryText || '#fff'), border: 'none', fontWeight: 400, fontSize: 18, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif', fontStyle: 'normal' }}>{t.newsletter?.cta || 'Zapisz się'}</button>
                    </form>
                  ) : null}
                </>
              )}
              {s === 'promo' && Array.isArray(cfg.promo) && cfg.promo.length > 0 && (
                <div style={{ margin: '24px 0' }}>
                  <h3>{t.promo?.header || 'Aktualne promocje'}</h3>
                  {cfg.promo.map((promo, i) => (
                    (promo.discount || promo.text || promo.endDate || promo.terms) && (
                      <div key={i} className="promo-block" style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: 16, marginBottom: 18, textAlign: 'center' }}>
                        {promo.discount && <div style={{ fontSize: 28, fontWeight: 700, color: '#b45309', marginBottom: 4 }}>{promo.discount}</div>}
                        {promo.text && <div style={{ fontSize: 20, fontWeight: 500, color: '#92400e', marginBottom: 4 }}>{promo.text}</div>}
                        {promo.endDate && <div style={{ fontSize: 14, color: '#92400e', marginBottom: 4 }}>{t.promo?.endDate || 'Promocja trwa do:'} <b>{promo.endDate}</b></div>}
                        {promo.terms && <div style={{ fontSize: 13, color: '#92400e', marginTop: 8, background: '#fff7ed', borderRadius: 4, padding: 8 }}>{promo.terms}</div>}
                      </div>
                    )
                  ))}
                </div>
              )}
              {s === 'footer' && (
                <section className="footer" style={{ background: 'transparent', color: 'inherit', border: 'none', boxShadow: 'none', padding: 0 }}>
                  <div className="small" style={{ color: 'inherit' }}>
                    {cfg.footer?.text || `© ${new Date().getFullYear()} ${cfg.brand?.title || t.hero?.title || 'Twoja firma'}`}
                  </div>
                  <div className="small" style={{ color: 'inherit', fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                    {t.footer?.generated || 'Stworzono w'} <a href="https://www.KickMy.App" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>www.KickMy.App</a>
                  </div>
                </section>
              )}
            </div>
          );
        });
      })()}
    </div>
  );
}