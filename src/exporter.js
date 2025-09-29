// --- PRICING ---
const generatePricingHtml = (cfg) => {
  const t = getTranslation(cfg);
  const pricing = cfg.pricing || {};
  if (!pricing.items || pricing.items.length === 0) return '';
  return `
    <section class="section">
      <h3>${t.pricing?.header || 'Cennik'}</h3>
      <div class="pricing-table">
        ${pricing.items.map(row => `
          <div class="pricing-row">
            <div>${row.name || ''}</div>
            <div>${row.price || ''}</div>
            <div>${row.unit || ''}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};
// --- BOOKING ---
const generateBookingHtml = (cfg) => {
  const booking = cfg.booking || {};
  if (!booking.link || booking.link.trim() === '') return '';
  return `
    <section class="section">
      <h3>Rezerwacja terminu</h3>
      <div style="position:relative;padding-top:56.25%">
        <iframe title="Rezerwacja" src="${booking.link}" style="position:absolute;inset:0;width:100%;height:100%;border:1px solid var(--line);border-radius:12px;" loading="lazy" allowfullscreen></iframe>
      </div>
    </section>
  `;
};
// --- SOCIAL ---
const generateSocialHtml = (cfg) => {
  const s = cfg.social || {};
  if (!s.facebook && !s.instagram && !s.tiktok && !s.x && !s.youtube && !s.linkedin && !s.other) return '';
  const icons = {
    facebook: '<svg width="24" height="24" fill="#1877f3"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/></svg>',
    instagram: '<svg width="24" height="24" fill="#e1306c"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.8.31 4.01.54c-.8.23-1.48.54-2.16 1.22-.68.68-.99 1.36-1.22 2.16-.23.79-.412 1.76-.47 3.04C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.25.47 3.04.23.8.54 1.48 1.22 2.16.68.68 1.36.99 2.16 1.22.79.23 1.76.412 3.04.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.28-.058 2.25-.24 3.04-.47.8-.23 1.48-.54 2.16-1.22.68-.68.99-1.36 1.22-2.16.23-.79.412-1.76.47-3.04.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.24-2.25-.47-3.04-.23-.8-.54-1.48-1.22-2.16-.68-.68-1.36-.99-2.16-1.22-.79-.23-1.76-.412-3.04-.47C15.668.012 15.264 0 12 0zm0 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.406-11.844a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg>',
    tiktok: '<svg width="24" height="24" fill="#000"><path d="M21.5 7.5c-1.38 0-2.5-1.12-2.5-2.5V2h-2v12.5c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4c.34 0 .67.04 1 .09V8.07c-.33-.04-.66-.07-1-.07-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V9.5c.81.63 1.84 1 3 1v-2z"/></svg>',
    x: '<svg width="24" height="24" fill="#000"><path d="M17.53 3H6.47A3.47 3.47 0 0 0 3 6.47v11.06A3.47 3.47 0 0 0 6.47 21h11.06A3.47 3.47 0 0 0 21 17.53V6.47A3.47 3.47 0 0 0 17.53 3zm-1.06 12.47l-2.47-2.47-2.47 2.47-1.06-1.06 2.47-2.47-2.47-2.47 1.06-1.06 2.47 2.47 2.47-2.47 1.06 1.06-2.47 2.47 2.47 2.47-1.06 1.06z"/></svg>',
    youtube: '<svg width="24" height="24" fill="#ff0000"><path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.12C19.24 3.5 12 3.5 12 3.5s-7.24 0-9.386.566a2.997 2.997 0 0 0-2.112 2.12C0 8.34 0 12 0 12s0 3.66.502 5.814a2.997 2.997 0 0 0 2.112 2.12C4.76 20.5 12 20.5 12 20.5s7.24 0 9.386-.566a2.997 2.997 0 0 0 2.112-2.12C24 15.66 24 12 24 12s0-3.66-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    linkedin: '<svg width="24" height="24" fill="#0077b5"><path d="M20.447 20.452h-3.554v-5.569c0-1.327-.025-3.037-1.849-3.037-1.851 0-2.132 1.445-2.132 2.939v5.667H9.358V9h3.414v1.561h.049c.476-.899 1.637-1.849 3.369-1.849 3.602 0 4.267 2.369 4.267 5.455v6.285zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.777 13.019H3.56V9h3.554v11.452z"/></svg>',
    other: '<svg width="24" height="24" fill="#64748b"><circle cx="12" cy="12" r="10"/></svg>'
  };
  return `
    <section class="section">
      <h3>Media społecznościowe</h3>
      <div class="row" style="flex-wrap:wrap;gap:16px;font-size:32px;align-items:center;">
        ${s.facebook ? `<a href="${s.facebook}" target="_blank" rel="noreferrer" title="Facebook" style="color:#1877f3">${icons.facebook}</a>` : ''}
        ${s.instagram ? `<a href="${s.instagram}" target="_blank" rel="noreferrer" title="Instagram" style="color:#e1306c">${icons.instagram}</a>` : ''}
        ${s.tiktok ? `<a href="${s.tiktok}" target="_blank" rel="noreferrer" title="TikTok" style="color:#000">${icons.tiktok}</a>` : ''}
        ${s.x ? `<a href="${s.x}" target="_blank" rel="noreferrer" title="X.com" style="color:#000">${icons.x}</a>` : ''}
        ${s.youtube ? `<a href="${s.youtube}" target="_blank" rel="noreferrer" title="YouTube" style="color:#ff0000">${icons.youtube}</a>` : ''}
        ${s.linkedin ? `<a href="${s.linkedin}" target="_blank" rel="noreferrer" title="LinkedIn" style="color:#0077b5">${icons.linkedin}</a>` : ''}
        ${s.other ? `<a href="${s.other}" target="_blank" rel="noreferrer" title="Inne" style="color:#64748b">${icons.other}</a>` : ''}
      </div>
    </section>
  `;
};
// --- CONTACT ---
const generateContactHtml = (cfg) => {
  const t = getTranslation(cfg);
  const brand = cfg.brand || {};
  const { phone, email, address, city } = brand;
  const buttonColor = cfg.buttonColor || 'var(--accent)';
  const buttonColorHover = cfg.buttonColorHover || '#eab308';
  const buttonTextColor = cfg.buttonTextColor || '#fff';
  const buttonFont = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:18px;font-weight:400;font-style:normal;";
  return `
    <section class="section" id="contact">
      <h3>${t.contact?.header || 'Kontakt'}</h3>
      <div class="contact-grid">
        <div class="contact-info">
          <ul class="list">
            ${phone ? `<li><span>☎️</span> <a href="tel:${phone}">${t.contact?.phone || 'Telefon'}: ${phone}</a></li>` : ''}
            ${email ? `<li><span>✉️</span> <a href="mailto:${email}">${t.contact?.email || 'E-mail'}: ${email}</a></li>` : ''}
            ${(address && city) ? `<li><span>📍</span> ${t.contact?.address || 'Adres'}: ${address}, ${t.contact?.city || 'Miasto'}: ${city}</li>` : ''}
          </ul>
        </div>
        <form class="contact-form">
          <input type="text" name="name" placeholder="${t.contact?.name || 'Twoje imię'}" required />
          <input type="email" name="email" placeholder="${t.contact?.email || 'Twój email'}" required />
          <textarea name="message" placeholder="${t.contact?.message || 'Twoja wiadomość'}" required></textarea>
          <button type="submit" style="background:${buttonColor};color:${buttonTextColor};${buttonFont}padding:16px 32px;border:none;border-radius:14px;box-shadow:0 2px 8px #0001;transition:background 0.2s;display:inline-block;text-align:center;cursor:pointer;"
            onmouseover="this.style.background='${buttonColorHover}'" onmouseout="this.style.background='${buttonColor}'"
          >${t.contact?.send || 'Wyślij'}</button>
        </form>
      </div>
    </section>
  `;
};
// --- USP ---
const generateUspHtml = (cfg) => {
  const t = getTranslation(cfg);
  const usp = cfg.usp || {};
  if (!usp.items || usp.items.length === 0) return '';
  return `
    <section class="section" id="offer">
      <h3>${usp.title || t.usp?.header || 'Dlaczego my'}</h3>
      <div class="usp-grid">
        ${usp.items.map(u => `<div class="usp-item">${u.icon || '✓'} ${u.text}</div>`).join('')}
      </div>
    </section>
  `;
};

// --- WHY US ---
const generateWhyUsHtml = (cfg) => {
  const t = getTranslation(cfg);
  const whyus = cfg.whyus || {};
  if (!whyus.text) return '';
  return `
    <section class="section">
      <h3>${t.whyus?.header || 'Dlaczego my'}</h3>
      <div class="small">${whyus.text}</div>
    </section>
  `;
};

// --- OFFER ---
const generateOfferHtml = (cfg) => {
  const offer = cfg.offer || {};
  if (!offer.items || offer.items.length === 0) return '';
  return `
    <section class="section">
      <h3>Oferta</h3>
      <div class="grid2">
        ${offer.items.map(o => `
          <div class="offer-tile" style="margin:0;padding:16px 14px;min-height:auto;box-shadow:0 4px 16px 0 #0002;border-radius:14px;background:#fff;display:flex;flex-direction:column;align-items:flex-start;gap:6px;">
            <b style="font-size:17px;line-height:1.2;">${o.title}</b>
            <div class="small" style="margin:0 0 2px 0;line-height:1.5;">${o.desc}</div>
            <div class="price" style="color:var(--accent);font-weight:600;margin-top:2px;">${o.price}</div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

// --- FAQ ---
const generateFaqHtml = (cfg) => {
  const t = getTranslation(cfg);
  const faq = cfg.faq || {};
  if (!faq.items || faq.items.length === 0) return '';
  // Each answer is hidden by default, toggled by clicking the question
  return `
    <section class="section">
      <h3>${t.faq?.header || 'FAQ'}</h3>
      <div class="faq-accordion">
        ${faq.items.map((i, idx) => `
          <div class="faq-item" style="border:1px solid #e5e7eb;border-radius:6px;margin-bottom:8px;background:#f9fafb;">
            <div class="faq-q" data-faq-idx="${idx}" style="display:flex;align-items:center;cursor:pointer;padding:10px;user-select:none;">
              <b style="flex:1">${i.q || t.faq?.question || 'Pytanie...'}</b>
              <span style="font-size:18px">▼</span>
            </div>
            <div class="faq-a" style="padding:10px;border-top:1px solid #e5e7eb;background:#fff;display:none;">
              <div>${i.a || `<span style=\"color:#aaa\">${t.faq?.noAnswer || 'Brak odpowiedzi'}</span>`}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
};

// --- TESTIMONIALS ---
const generateTestimonialsHtml = (cfg) => {
  const t = getTranslation(cfg);
  const test = cfg.testimonials || {};
  if (!test.items || test.items.length === 0) return '';
  return `
    <section class="section">
      <h3>${t.testimonials?.header || 'Opinie'}</h3>
      <div class="testimonials-grid">
        ${test.items.map(tt => `
          <blockquote class="testimonial-card">
            <div><b>„${tt.text}”</b></div>
            <div class="small">— ${tt.author || t.testimonials?.author || 'Klient'}</div>
          </blockquote>
        `).join('')}
      </div>
  ${(cfg.reviews && cfg.reviews.link) ? (() => {
    const buttonColor = cfg.buttonColor || 'var(--accent)';
    const buttonColorHover = cfg.buttonColorHover || '#eab308';
    const buttonTextColor = cfg.buttonTextColor || '#fff';
    const buttonFont = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:18px;font-weight:400;font-style:normal;";
    return `<div style=\"display:flex;justify-content:center;margin-top:32px;\"><a href=\"${cfg.reviews.link}\" target=\"_blank\" rel=\"noreferrer\" style=\"background:${buttonColor};color:${buttonTextColor};${buttonFont}padding:16px 32px;border:none;border-radius:14px;box-shadow:0 2px 8px #0001;transition:background 0.2s;display:inline-block;text-align:center;cursor:pointer;text-decoration:none;\" onmouseover=\"this.style.background='${buttonColorHover}'\" onmouseout=\"this.style.background='${buttonColor}'\">${cfg.reviews.cta || t.testimonials?.cta || 'Dodaj opinię na Google'}</a></div>`;
  })() : ''}
    </section>
  `;
};

// --- MAP ---
const generateMapHtml = (cfg) => {
  const t = getTranslation(cfg);
  const brand = cfg.brand || {};
  if (!brand.address || !brand.city) return '';
  return `
    <section class="section">
      <h3>${t.map?.header || 'Mapa dojazdu'}</h3>
      <div style="position:relative;padding-top:56.25%">
        <iframe title="${t.map?.header || 'Mapa'}" src="https://maps.google.com/maps?q=${encodeURIComponent(`${brand.address}, ${brand.city}`)}&output=embed" style="position:absolute;inset:0;width:100%;height:100%;border:1px solid var(--line);border-radius:12px;" loading="lazy" allowfullscreen></iframe>
      </div>
    </section>
  `;
};

// --- VIDEO ---
const generateVideoHtml = (cfg) => {
  const t = getTranslation(cfg);
  const videos = cfg.videos || [];
  if (!videos.length || !videos[0]) return '';
  return `
    <section class="section">
      <h3>${t.video?.header || 'Wideo'}</h3>
      <div class="video-grid">
        ${videos.map((videoUrl, i) => {
          if (!videoUrl) return '';
          // YouTube URL detection
          let ytId = '';
          let ytMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
          if (!ytMatch) ytMatch = videoUrl.match(/[?&]v=([\w-]{11})/);
          if (ytMatch && ytMatch[1]) {
            ytId = ytMatch[1];
            const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            return `<div class="video-item" style="position:relative;aspect-ratio:16/9;overflow:hidden;cursor:pointer;"><a href="https://www.youtube.com/watch?v=${ytId}" target="_blank" rel="noopener noreferrer"><img src="${thumb}" alt="Miniaturka wideo" style="width:100%;height:100%;object-fit:cover;display:block;position:absolute;top:0;left:0;" /><span style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.6);border-radius:50%;padding:18px;display:flex;align-items:center;justify-content:center;"><svg width="40" height="40" viewBox="0 0 40 40" fill="#fff"><polygon points="16,12 30,20 16,28"/></svg></span></a></div>`;
          }
          // Direct video file
          return `<div class="video-item"><video controls style="width:100%;height:100%;border-radius:12px;object-fit:cover;"><source src="${videoUrl}" /></video></div>`;
        }).join('')}
      </div>
    </section>
  `;
};

import JSZip from 'jszip';
import pl from './pl.json';
import en from './en.json';

// Helper to get translation object
function getTranslation(cfg) {
  const lang = (cfg.lang || 'pl').toLowerCase();
  if (lang === 'en') return en;
  return pl;
}

const generateHeroHtml = (cfg) => {
  const t = getTranslation(cfg);
  const brand = cfg.brand || {};
  const hero = cfg.hero || {};
  // Background logic
  let heroStyle = '';
  const bgType = hero.bgType || 'gradient';
  if (bgType === 'image' && hero.background) {
    heroStyle = `background-image:url('${hero.background}');background-size:cover;background-position:center;`;
  } else if (bgType === 'solid') {
    heroStyle = `background:${hero.colors?.solid || '#1d4ed8'};`;
  } else {
    const start = hero.colors?.brand || '#1d4ed8';
    const end = hero.colors?.accent || '#f59e0b';
    heroStyle = `background:linear-gradient(135deg, ${start} 0%, ${end} 100%);`;
  }

  // Przyciski hero: tylko hero.colors
  const buttonFont = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:18px;font-weight:400;font-style:normal;";
  const buttonPrimary = hero.colors?.buttonPrimary || '#facc15';
  const buttonPrimaryHover = hero.colors?.buttonPrimaryHover || '#eab308';
  const buttonPrimaryText = hero.colors?.buttonPrimaryText || '#fff';
  const buttonSecondary = hero.colors?.buttonSecondary || '#fff';
  const buttonSecondaryHover = hero.colors?.buttonSecondaryHover || '#f3f4f6';
  const buttonSecondaryText = hero.colors?.buttonSecondaryText || '#222';

  // Logo style
  const logoSize = brand.logoSize ?? 1;
  const logo = brand.logo ? `<img class="hero-logo" src="${brand.logo}" alt="Logo" style="max-height:${80 * logoSize}px;max-width:${120 * logoSize}px;margin-left:24px;object-fit:contain;background:#fff;border-radius:8px;box-shadow:0 2px 8px #0001;transition:max-width 0.2s,max-height 0.2s;" />` : '';

  // Layout
  return `
    <section class="hero" style="display:flex;align-items:center;justify-content:space-between;min-height:90px;${heroStyle}">
      <div style="flex:1;min-width:0;">
        <h3 style="color:${hero.colors?.descTitle || '#222'};margin:0;text-align:center;">${brand.title || t.hero?.title || 'Twoja firma'}</h3>
        <div class="small" style="color:${hero.colors?.descText || '#fff'};margin:0;text-align:center;">${brand.desc || t.hero?.desc || 'Krótki opis oferty'}</div>
        <div style="display:flex;justify-content:center;gap:16px;margin-top:16px;">
          <a href="#contact" class="cta cta-primary" style="background:${buttonPrimary};color:${buttonPrimaryText};${buttonFont}min-width:150px;border:none;border-radius:12px;padding:16px 28px;box-shadow:0 2px 8px #0001;cursor:pointer;transition:background 0.2s;display:inline-block;text-align:center;"
            onmouseover="this.style.background='${buttonPrimaryHover}'" onmouseout="this.style.background='${buttonPrimary}'"
          >${t.hero?.ctaContact || 'Skontaktuj się'}</a>
          <a href="#offer" class="cta cta-outline" style="background:${buttonSecondary};color:${buttonSecondaryText};${buttonFont}min-width:150px;border:none;border-radius:12px;padding:16px 28px;box-shadow:0 2px 8px #0001;cursor:pointer;transition:background 0.2s;display:inline-block;text-align:center;"
            onmouseover="this.style.background='${buttonSecondaryHover}'" onmouseout="this.style.background='${buttonSecondary}'"
          >${t.hero?.ctaOffer || 'Zobacz ofertę'}</a>
        </div>
      </div>
      ${logo}
    </section>
  `;
};

const generatePromoHtml = (cfg) => {
  const t = getTranslation(cfg);
  const promos = Array.isArray(cfg.promo) ? cfg.promo : [];
  if (!promos.length) return '';
  const promoBlocks = promos
    .map(promo => {
      if (!(promo.discount || promo.text || promo.endDate || promo.terms)) return '';
      return `
        <div class="promo-block" style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin-bottom:18px;text-align:center;">
          ${promo.discount ? `<div style="font-size:28px;font-weight:700;color:#b45309;margin-bottom:4px;">${promo.discount}</div>` : ''}
          ${promo.text ? `<div style="font-size:20px;font-weight:500;color:#92400e;margin-bottom:4px;">${promo.text}</div>` : ''}
          ${promo.endDate ? `<div style="font-size:14px;color:#92400e;margin-bottom:4px;">${t.promo?.endDate || 'Promocja trwa do:'} <b>${promo.endDate}</b></div>` : ''}
          ${promo.terms ? `<div style="font-size:13px;color:#92400e;margin-top:8px;background:#fff7ed;border-radius:4px;padding:8px;">${promo.terms}</div>` : ''}
        </div>
      `;
    })
    .join('');
  return `
    <section class="section">
      <h3>${t.promo?.header || 'Aktualne promocje'}</h3>
      ${promoBlocks}
    </section>
  `;
};

// --- CSS (naprawione domknięcie :root) ---
const CSS_TEXT = `
:root {
  --line: rgba(2,6,23,.08);
  --shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
}
* {box-sizing:border-box}
body {
  margin:0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #0f172a;
  background: #f8fafc;
  line-height: 1.6;
}
  .container {max-width:900px; margin:0 auto; padding:12px 8px;}
  .section, .hero {
    max-width:800px;
    margin-left:auto; margin-right:auto;
    padding:32px 12px;
    border-bottom:1px solid var(--line);
    box-shadow: var(--shadow);
    border-radius:14px;
    margin:10px auto;
    background:#fff;
    transition: transform 0.3s ease;
  }
  .section:hover, .hero:hover {transform: translateY(-2px);}
  .hero {
    color:#fff;
    background: linear-gradient(135deg, var(--hero1) 0%, var(--hero2) 100%);
    position:relative;
    overflow:hidden;
  }
.hero.has-image { 
  background-size:cover; 
  background-position:center; 
  color:#fff; 
}
.hero.has-image::before {
  content:'';
  position:absolute;
  inset:0;
  background: rgba(0,0,0,0.3);
  z-index:1;
}
.hero > * {position:relative; z-index:2;}
.hero-logo { display:block; max-height:80px; margin:0 0 12px 0; }
.row {display:flex; gap:12px; flex-wrap:wrap; align-items:center;}
.cta {
  padding:12px 16px;
  border-radius:12px;
  border:1px solid var(--line);
  text-decoration:none;
  transition: all 0.2s ease;
}
.cta:hover {transform: scale(1.05); box-shadow: var(--shadow);}
.cta-primary {background:var(--accent); color:#fff; border-color:transparent;}
.cta-outline {background:#fff; color:#111;}
.small {font-size:14px; opacity:0.9;}
.muted {color:#475569;}
.grid2 {display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;}
.list {list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px;}
form input, form textarea {
  border:1px solid var(--line); 
  border-radius:12px; 
  padding:12px; 
  width:100%; 
  background:#fff;
  transition: border-color 0.2s;
}
form input:focus, form textarea:focus {border-color:var(--accent);}
form textarea {min-height:120px;}
.pricing-table {display:flex; flex-direction:column; gap:8px;}
.pricing-row {
  display:grid; 
  grid-template-columns: 2fr 1fr 1fr; 
  align-items:center; 
  padding:12px; 
  border-radius:12px; 
  border:1px solid var(--line);
  background:#f8fafc;
}
.tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 12px;
  color: #475569;
  background: #fff;
  margin-left: 6px;
  cursor: help;
}
.tooltip .tip {
  position: absolute;
  top: calc(100% + 6px);
  right: auto;
  left: 0;
  display: none;
  background: #0f172a;
  color: #fff;
  padding: 8px 10px;
  border-radius: 8px;
  min-width: 180px;
  max-width: 280px;
  z-index: 10;
}
.tooltip:hover .tip { display: block; }
.tooltip .tip:before {
  content: "";
  position: absolute;
  top: -6px;
  right: 12px;
  border: 6px solid transparent;
  border-bottom-color: #0f172a;
}
.pricing-table { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.pricing-row { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-radius: 8px; border: 1px solid var(--line); }
.testimonials-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.testimonial-card { margin: 0; padding: 12px; border: 1px solid var(--line); border-radius: 12px; background: #fff; }
  /* .hero specific max-width removed, now unified with .section */
  .hero.has-image { background-size: cover; background-position: center; color: #fff; }
  .hero-logo { display: block; max-height: 64px; margin: 0 0 8px 0; }
.usp-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}
.usp-item {
  flex: 1 1 calc(33.33% - 16px);
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
  text-align: center;
}
.usp-item .icon {
  display: block;
  font-size: 24px;
  margin-bottom: 8px;
}
.footer {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  color: #64748b;
  text-align: center;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}
.contact-form input,
.contact-form textarea {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
}
.contact-form textarea {
  min-height: 120px;
  resize: vertical;
}
.contact-form .form-message {
  margin-top: 8px;
  text-align: center;
  color: var(--brand);
}
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 12px;
}
.video-item {
  position: relative;
  width: 100%;
  height: 400px;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-item iframe,
.video-item video {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
  object-fit: cover;
  display: block;
}
@media (max-width: 1024px) {
  .container {max-width: 98vw; padding: 12px;}
  .section, .hero {max-width: 98vw;}
}
@media (max-width: 768px) {
  .container {padding: 8px;}
  .section, .hero {max-width: 100vw; padding: 28px 4vw; margin: 8px 0; border-radius: 10px;}
  .grid2 {grid-template-columns: 1fr;}
  .row {flex-direction: column; gap: 10px;}
  .gallery-grid {grid-template-columns: 1fr;}
  .testimonials-grid {grid-template-columns: 1fr;}
  .usp-grid {flex-direction: column; gap: 10px;}
  .usp-item {flex-basis: 100%;}
  .pricing-table, .pricing-row {flex-direction: column; gap: 6px;}
  .video-grid {grid-template-columns: 1fr;}
  .video-item {height: 240px;}
  .video-item iframe,
  .video-item video {height: 240px;}
  .footer {padding: 16px 4vw; font-size: 14px;}
  h1 {font-size: 1.5rem;}
  h3 {font-size: 1.15rem;}
  .cta, .btn, button {font-size: 15px; padding: 10px 12px;}
  form input, form textarea {font-size: 15px;}
}
@media (max-width: 480px) {
  .container {padding: 2px;}
  .section, .hero {padding: 16px 2vw;}
  .gallery-img-wrap, .video-item {border-radius: 8px;}
  .usp-item {padding: 8px; font-size: 14px;}
  .footer {padding: 10px 2vw; font-size: 13px;}
  h1 {font-size: 1.1rem;}
  h3 {font-size: 1rem;}
  .cta, .btn, button {font-size: 14px; padding: 8px 8px;}
}
`;

// ============== WSPÓLNY BUILDER ZIP (NOWE) ==============
export async function buildZipBlob(cfg) {
  const zip = new JSZip();
  const htmlFolder = zip.folder('export-html');
  zip.folder('dist'); // przygotowane na assets, jeśli będziesz dopinać

  const brand = cfg.brand || {};
  const accent = brand.colors?.accent || '#f59e0b';
  const start = (cfg.hero?.colors?.start) || (brand.colors?.brand) || '#0ea5e9';
  const end = (cfg.hero?.colors?.end) || accent;

  const head = `<!doctype html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${brand.title || 'Strona'}</title>
  <style>:root{ --brand:${start}; --accent:${accent}; --hero1:${start}; --hero2:${end}; --line:rgba(2,6,23,.08); }</style>
  <style>${CSS_TEXT}</style>
</head>
<body>
  <div class="container">
`;

  const sectionGenerators = {
    booking: generateBookingHtml,
    hero: generateHeroHtml,
    usp: generateUspHtml,
    whyus: generateWhyUsHtml,
    offer: generateOfferHtml,
    gallery: (cfg) => {
      const t = getTranslation(cfg);
      let images = [];
      if (Array.isArray(cfg.gallery)) {
        images = cfg.gallery;
      } else if (cfg.gallery?.items) {
        images = cfg.gallery.items;
      } else if (cfg.gallery?.images) {
        images = cfg.gallery.images;
      }
      if (!images.length) return '';
      const size = cfg.gallery?.imageSize || 280;
      return `
        <section class="section">
          <h3>${t.gallery?.header || 'Galeria'}</h3>
          <div class="gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(${size}px,1fr));gap:18px;justify-items:center;">
            ${images.map(img => {
              if (!img) return '';
              const url = typeof img === 'string' ? img : img.url;
              if (!url) return '';
              return `<div class="gallery-img-wrap" style="background:#f3f4f6;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px #0001;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;"><img src="${url}" alt="Galeria" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:8px;border:1px solid #ccc;" /></div>`;
            }).join('')}
          </div>
        </section>
      `;
    },
    pricing: generatePricingHtml,
    faq: generateFaqHtml,
    testimonials: generateTestimonialsHtml,
    contact: generateContactHtml,
    map: generateMapHtml,
    social: generateSocialHtml,
    newsletter: (cfg) => {
      const t = getTranslation(cfg);
      const newsletter = cfg.newsletter || {};
      if (!newsletter.email && !newsletter.url) return '';
      if (newsletter.url) {
        return `
          <section class="section">
            <h3>${t.newsletter?.header || 'Newsletter'}</h3>
            <div style="position:relative;padding-top:56.25%">
              <iframe title="Newsletter" src="${newsletter.url}" style="position:absolute;inset:0;width:100%;height:100%;border:1px solid var(--line);border-radius:12px;" loading="lazy"></iframe>
            </div>
          </section>
        `;
      } else if (newsletter.email) {
        const buttonColor = cfg.buttonColor || 'var(--accent)';
        const buttonTextColor = cfg.buttonTextColor || '#fff';
        const buttonFont = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:18px;font-weight:400;font-style:normal;";
        return `
          <section class="section">
            <h3>${t.newsletter?.header || 'Newsletter'}</h3>
            <form class="newsletter-form" style="display:flex;flex-direction:column;gap:8px;max-width:400px;margin:0 auto;" onsubmit="window.open('mailto:${newsletter.email}');return false;">
              <input type="email" required placeholder="${t.newsletter?.placeholder || 'Twój e-mail'}" style="padding:10px;border-radius:6px;border:1px solid #ccc;" />
              <button type="submit" class="cta cta-primary" style="padding:10px;border-radius:6px;background:${buttonColor};color:${buttonTextColor};${buttonFont}border:none;font-weight:400;font-size:18px;font-style:normal;"
                onmouseover="this.style.background='#eab308'" onmouseout="this.style.background='${buttonColor}'"
              >${t.newsletter?.cta || 'Zapisz się'}</button>
            </form>
          </section>
        `;
      }
      return '';
    },
    promo: generatePromoHtml,
    video: generateVideoHtml,
    // footer generujemy osobno poniżej
  };

  const sections = Array.isArray(cfg.sections) ? cfg.sections : ['hero', 'promo', 'pricing', 'contact'];
  const filteredSections = Array.isArray(cfg.sections) ? cfg.sections.filter(s => s !== 'footer') : ['hero', 'promo', 'pricing', 'contact'];

  const body = filteredSections.map(s => {
    const gen = sectionGenerators[s];
    return gen ? gen(cfg) : '';
  }).join('\n');

  const yearFooter = new Date().getFullYear();
  const footerBg = cfg.footer?.background || '#f8fafc';
  const footerColor = cfg.footer?.textColor || '#64748b';
  const footerText = cfg.footer?.text || `© ${yearFooter} ${cfg.brand?.title || 'Twoja firma'}`;
  const t = getTranslation(cfg);
  const footerHtml = `
    <footer class="footer" style="max-width:800px;margin:40px auto 0 auto;padding:32px 0 16px 0;text-align:center;background:${footerBg};color:${footerColor};font-size:15px;opacity:.85;">
      <div style="margin-bottom:4px;">${footerText}</div>
      <div style="font-size:13px;opacity:.7;">${t.footer?.generated || 'Wygenerowano w KickMy.App'}</div>
    </footer>
  `;

  const foot = `
  </div>
</body>
</html>
`;

  const faqScript = `
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', function() {
        const a = this.parentElement.querySelector('.faq-a');
        if (!a) return;
        const isOpen = a.style.display === 'block';
        a.style.display = isOpen ? 'none' : 'block';
      });
    });
  `;
  const scriptTag = `<script>window.addEventListener('DOMContentLoaded',function(){${faqScript}});</script>`;

  htmlFolder.file('index.html', head + body + footerHtml + scriptTag + foot)
  htmlFolder.file('styles.css', CSS_TEXT)
// UWAGA: nie dołączamy żadnych .js do ZIP-a, żeby Gmail nie blokował wiadomości

  // Zwracamy gotowy Blob ZIP
  return zip.generateAsync({ type: 'blob' });
}

// ============== PUBLICZNE API EKSPORTU ==============

// (ZMIANA) exportZip korzysta z buildera; zwraca Blob, gdy opts.returnBlob === true
export async function exportZip(cfg, opts = {}) {
  const zipBlob = await buildZipBlob(cfg);
  if (opts.returnBlob) return zipBlob;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = 'kickmy-export.zip';
  link.click();
}

// (NOWE) ZIP jako base64 – do wysyłki w JSON do funkcji Netlify
export async function getExportZipBase64(cfg) {
  const zipBlob = await buildZipBlob(cfg);
  const arrayBuf = await zipBlob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
  return base64;
}

// Export config JSON (with optional notes field) – bez zmian
export function exportConfigJson(cfg, notes) {
  const data = { ...cfg };
  if (notes) data.notes = notes;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'kickmy-config.json';
  link.click();
}
