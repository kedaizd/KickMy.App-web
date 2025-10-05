// --- PRICING ---
const generatePricingHtml = (cfg) => {
  const t = getTranslation(cfg);
  const pricing = cfg.pricing || {};
  const rows = Array.isArray(pricing.rows) ? pricing.rows : [];
  const hasRows = rows.length > 0;
  const attachment = pricing.attachment;
  const hasAttachment = attachment && attachment.data;
  if (!hasRows && !hasAttachment) return '';

  const attachmentHtml = (() => {
    if (!hasAttachment) return '';
    if (attachment.type?.startsWith('image/')) {
      return `
        <div style="margin:12px 0">
          <img src="${attachment.data}" alt="${attachment.name || 'Cennik'}" style="max-width:100%;max-height:320px;border-radius:8px;box-shadow:0 2px 8px #0001;display:block;" />
        </div>
      `;
    }
    if (attachment.type === 'application/pdf') {
      return `
        <div style="margin:12px 0">
          <a href="${attachment.data}" target="_blank" rel="noopener noreferrer" style="display:inline-block;color:#0077b5;font-weight:500;">&#128196; ${t.pricing?.pdf || 'Zobacz cennik PDF'} (${attachment.name || 'cennik.pdf'})</a>
        </div>
      `;
    }
    return '';
  })();

  const rowsHtml = hasRows ? `
      <div class="pricing-table">
        ${rows.map(row => `
          <div class="pricing-row">
            <span>${row.title || row.name || ''}</span>
            <b style="color:var(--accent);">${row.price || ''}</b>
          </div>
        `).join('')}
      </div>
  ` : '';

  return `
    <section class="section">
      <h3>${t.pricing?.header || 'Cennik'}</h3>
      ${attachmentHtml}
      ${rowsHtml}
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
  const t = getTranslation(cfg);
  const s = cfg.social || {};
  if (!s.facebook && !s.instagram && !s.tiktok && !s.x && !s.youtube && !s.linkedin && !s.other) return '';

  const icons = {
    facebook: '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M29 0H3C1.3 0 0 1.3 0 3v26c0 1.7 1.3 3 3 3h13V20h-4v-5h4v-3.6C16 7.7 18.4 6 21.2 6c1.3 0 2.5.1 2.8.1v4h-1.9c-1.5 0-1.8.7-1.8 1.8V15h5l-1 5h-4v12h7c1.7 0 3-1.3 3-3V3c0-1.7-1.3-3-3-3z"/></svg>',
    instagram: '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M16 7.3A8.7 8.7 0 1 0 24.7 16 8.7 8.7 0 0 0 16 7.3zm0 14.3A5.6 5.6 0 1 1 21.6 16 5.6 5.6 0 0 1 16 21.6zm8.8-14.5a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm5.7 2.1a6.1 6.1 0 0 0-1.7-4.3A6.1 6.1 0 0 0 24.5 1.6C22.1.6 17.9.6 15.5 1.6a6.1 6.1 0 0 0-4.3 1.7A6.1 6.1 0 0 0 1.6 7.5C.6 9.9.6 14.1 1.6 16.5a6.1 6.1 0 0 0 1.7 4.3 6.1 6.1 0 0 0 4.3 1.7c2.4 1 6.6 1 9 0a6.1 6.1 0 0 0 4.3-1.7 6.1 6.1 0 0 0 1.7-4.3c1-2.4 1-6.6 0-9zM28.5 24a3.9 3.9 0 0 1-2.2 2.2c-1.5.6-5.1.5-6.3.5s-4.8.1-6.3-.5A3.9 3.9 0 0 1 3.5 24c-.6-1.5-.5-5.1-.5-6.3s-.1-4.8.5-6.3A3.9 3.9 0 0 1 7.5 3.5c1.5-.6 5.1-.5 6.3-.5s4.8-.1 6.3.5A3.9 3.9 0 0 1 28.5 8c.6 1.5.5 5.1.5 6.3s.1 4.8-.5 6.3z"/></svg>',
    tiktok: '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M28.5 10.5c-2.2 0-4-1.8-4-4V2h-4v18.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.3 0 .7 0 1 .1V14c-.3 0-.7-.1-1-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V14.5c1.2 1 2.7 1.5 4.5 1.5v-4z"/></svg>',
    x: '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M26.6 4H5.4C4.1 4 3 5.1 3 6.4v19.2C3 26.9 4.1 28 5.4 28h21.2c1.3 0 2.4-1.1 2.4-2.4V6.4C29 5.1 27.9 4 26.6 4zM23.7 22.3h-2.2l-3.2-4.2-3.2 4.2h-2.2l4.3-5.6-4.3-5.6h2.2l3.2 4.2 3.2-4.2h2.2l-4.3 5.6z"/></svg>',
    youtube: '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><path d="M31.7 8.3c-.4-1.6-1.7-2.9-3.3-3.3C25.1 4.5 16 4.5 16 4.5s-9.1 0-12.4.5c-1.6.4-2.9 1.7-3.3 3.3C0 11.6 0 16 0 16s0 4.4.3 7.7c.4 1.6 1.7 2.9 3.3 3.3C6.9 27.5 16 27.5 16 27.5s9.1 0 12.4-.5c1.6-.4 2.9-1.7 3.3-3.3.3-3.3.3-7.7.3-7.7s0-4.4-.3-7.7zM12.8 21.1V10.9l8.3 5.1-8.3 5.1z"/></svg>',
    linkedin: '<svg width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zm-46.44-340.7C24.09 107.3 0 83.2 0 53.6A53.6 53.6 0 0 1 53.6 0c29.6 0 53.6 24.09 53.6 53.6 0 29.6-24 53.7-53.36 53.7zM447.8 448h-92.4V302.4c0-34.7-12.4-58.4-43.3-58.4-23.6 0-37.6 15.9-43.7 31.3-2.3 5.6-2.8 13.4-2.8 21.2V448h-92.4s1.2-242.1 0-267.1h92.4v37.9c12.3-19 34.3-46.1 83.5-46.1 60.9 0 106.7 39.8 106.7 125.4V448z"/></svg>',
    other: '<svg width="1em" height="1em" viewBox="0 0 32 32" fill="currentColor"><circle cx="16" cy="16" r="16"/></svg>'
  };

  return `
    <section class="section">
      <h3>${t.social?.header || 'Media społecznościowe'}</h3>
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
  const buttonBg = cfg.buttonColor || (cfg.hero?.colors?.buttonPrimary || 'var(--accent)');
  const buttonText = cfg.buttonTextColor || (cfg.hero?.colors?.buttonPrimaryText || '#fff');
  const buttonFont = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:18px;font-weight:400;font-style:normal;";
  const mailto = email ? `mailto:${email}` : '#';
  return `
    <section class="section" id="contact">
      <h3>${t.contact?.header || 'Kontakt'}</h3>
      <ul class="list">
        ${phone ? `<li><span>📞</span> <a href="tel:${phone}" style="color:#2563eb;text-decoration:underline;">${t.contact?.phone || 'Telefon'}: ${phone}</a></li>` : ''}
        ${email ? `<li><span>✉️</span> <a href="mailto:${email}" style="color:#2563eb;text-decoration:underline;">${t.contact?.email || 'E-mail'}: ${email}</a></li>` : ''}
        ${(address && city) ? `<li><span>📍</span> ${t.contact?.address || 'Adres'}: ${address}, ${city}</li>` : ''}
      </ul>
      <form class="contact-form" action="${mailto}" method="post">
        <input type="text" name="name" placeholder="${t.contact?.name || 'Twoje imię'}" required />
        <input type="email" name="email" placeholder="${t.contact?.email || 'Twój email'}" required />
        <textarea name="message" placeholder="${t.contact?.message || 'Twoja wiadomość'}" required></textarea>
        <button type="submit" class="btn btn-primary" style="background:${buttonBg};color:${buttonText};${buttonFont}padding:16px 32px;border:none;border-radius:14px;box-shadow:0 2px 8px #0001;cursor:pointer;transition:background 0.2s;">${t.contact?.send || 'Wyślij'}</button>
      </form>
    </section>
  `;
};

// --- USP ---
const generateUspHtml = (cfg) => {
  const t = getTranslation(cfg);
  const usp = cfg.usp || {};
  if (!usp.items || usp.items.length === 0) return '';
  return `
    <section class="section">
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
  const t = getTranslation(cfg);
  const items = Array.isArray(cfg.offer?.items) ? cfg.offer.items : [];
  if (!items.length) return '';
  return `
    <section class="section" id="offer">
      <h3>${t.offer?.header || 'Oferta'}</h3>
      <div class="grid2">
        ${items.map(o => `
          <div class="section" style="margin:0;">
            <b>${o.title || ''}</b>
            <div class="small">${o.desc || ''}</div>
            <div class="price" style="color:var(--accent);">${o.price || ''}</div>
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
          <div class="faq-item" style="border:1px solid #e5e7eb;border-radius:6px;background:#f9fafb;">
            <div class="faq-q" data-faq-idx="${idx}" style="display:flex;align-items:center;cursor:pointer;padding:10px;user-select:none;">
              <b style="flex:1">${i.q || t.faq?.question || 'Pytanie...'}</b>
              <span class="faq-toggle" style="font-size:18px">&#x25BC;</span>
            </div>
            <div class="faq-a" style="padding:10px;border-top:1px solid #e5e7eb;background:#fff;display:none;">
              <div>${i.a || `<span style="color:#aaa">${t.faq?.noAnswer || 'Brak odpowiedzi'}</span>`}</div>
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
            <div style="font-weight:600">&ldquo;${tt.text}&rdquo;</div>
            <div class="small">- ${tt.author || t.testimonials?.author || 'Klient'}</div>
          </blockquote>
        `).join('')}
      </div>
      ${cfg.reviews?.link ? `<div style="display:flex;justify-content:center;margin-top:32px;"><a class="btn btn-primary" href="${cfg.reviews.link}" target="_blank" rel="noreferrer" style="background:${cfg.buttonColor || (cfg.hero?.colors?.buttonPrimary || 'var(--accent)')};color:${cfg.buttonTextColor || (cfg.hero?.colors?.buttonPrimaryText || '#fff')};font-size:18px;font-weight:400;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-style:normal;padding:16px 32px;border:none;border-radius:14px;box-shadow:0 2px 8px #0001;transition:background 0.2s;text-align:center;text-decoration:none;">${cfg.reviews.cta || t.testimonials?.cta || 'Dodaj opinię na Google'}</a></div>` : ''}
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
        ${videos.map((videoUrl) => {
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
  let heroStyle = '';
  const heroClasses = ['hero'];
  const bgType = hero.bgType || 'gradient';
  if (bgType === 'image' && hero.background) {
    heroStyle = `background-image:url('${hero.background}');background-size:cover;background-position:center;`;
    heroClasses.push('has-image');
  } else if (bgType === 'solid') {
    heroStyle = `background:${hero.colors?.solid || '#1d4ed8'};`;
  } else {
    const start = hero.colors?.brand || '#1d4ed8';
    const end = hero.colors?.accent || '#f59e0b';
    heroStyle = `background:linear-gradient(135deg, ${start} 0%, ${end} 100%);`;
  }

  const buttonFont = "font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;font-size:18px;font-weight:400;font-style:normal;";
  const buttonPrimary = hero.colors?.buttonPrimary || cfg.buttonColor || 'var(--accent)';
  const buttonPrimaryText = hero.colors?.buttonPrimaryText || cfg.buttonTextColor || '#fff';
  const buttonSecondary = hero.colors?.buttonSecondary || '#fff';
  const buttonSecondaryText = hero.colors?.buttonSecondaryText || '#222';
  const logoSize = brand.logoSize ?? 1;
  const logo = brand.logo ? `<img class="hero-logo" src="${brand.logo}" alt="Logo" style="max-height:${80 * logoSize}px;max-width:${120 * logoSize}px;object-fit:contain;background:#fff;border-radius:8px;box-shadow:0 2px 8px #0001;transition:max-width 0.2s,max-height 0.2s;" />` : '';

  return `
    <section class="${heroClasses.join(' ')}" style="${heroStyle}">
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <h3 style="color:${hero.colors?.descTitle || '#222'};margin:0;text-align:center;">${brand.title || t.hero?.title || 'Twoja firma'}</h3>
        <div class="small" style="color:${hero.colors?.descText || '#fff'};margin:0;text-align:center;">${brand.desc || t.hero?.desc || 'Krótki opis oferty'}</div>
        <div style="display:flex;justify-content:center;gap:16px;margin-top:16px;flex-wrap:wrap;">
          <a href="#contact" class="cta cta-primary" style="background:${buttonPrimary};color:${buttonPrimaryText};${buttonFont}min-width:150px;border:none;border-radius:12px;padding:16px 28px;box-shadow:0 2px 8px #0001;cursor:pointer;transition:background 0.2s;text-decoration:none;display:inline-block;text-align:center;">${t.hero?.ctaContact || 'Skontaktuj się'}</a>
          <a href="#offer" class="cta cta-outline" style="background:${buttonSecondary};color:${buttonSecondaryText};${buttonFont}min-width:150px;border:none;border-radius:12px;padding:16px 28px;box-shadow:0 2px 8px #0001;cursor:pointer;transition:background 0.2s;text-decoration:none;display:inline-block;text-align:center;">${t.hero?.ctaOffer || 'Zobacz ofertę'}</a>
        </div>
      </div>
      ${logo}
    </section>
  `;
};

// --- PROMO (naprawiona deklaracja) ---
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
* { box-sizing: border-box; }
body {
  margin: 0;
  background: #f8fafc;
  color: #0f172a;
  line-height: 1.6;
}
.preview {
  max-width: 900px;
  margin: 0 auto;
  padding: 12px 8px 40px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  font-weight: 400;
  font-style: normal;
}
.section, .hero {
  max-width: 800px;
  margin: 12px auto;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: #fff;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}
.section:hover, .hero:hover { transform: translateY(-4px); }
.hero {
  color: #fff;
  border-radius: 0;
  border: none;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 90px;
}
.hero.has-image { background-size: cover; background-position: center; color: #fff; }
.hero-logo {
  display: block;
  max-height: 64px;
  margin: 0 0 8px 24px;
  object-fit: contain;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #0001;
}
.cta {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}
.cta-primary { background: var(--accent); color: #fff; border-color: transparent; }
.cta-outline { background: #fff; color: #111; }
.cta:hover { transform: scale(1.05); box-shadow: var(--shadow); }
.btn {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}
.btn:hover { transform: scale(1.05); box-shadow: var(--shadow); }
.btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.small { color: #64748b; font-size: 12px; opacity: 0.9; }
.price { font-size: 22px; font-weight: 800; color: var(--accent); }
.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
.usp-grid { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; }
.usp-item { flex: 1 1 calc(33.33% - 16px); min-width: 0; padding: 12px; border: 1px solid var(--line); border-radius: 10px; background: #fff; text-align: center; }
.gallery { display: grid; gap: 16px; }
.thumb { position: relative; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px #0001; }
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pricing-table { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.pricing-row { display: flex; justify-content: space-between; align-items: center; padding: 8px; border-radius: 8px; border: 1px solid var(--line); }
.pricing-row b { margin-left: auto; text-align: right; }
.faq-accordion { display: flex; flex-direction: column; gap: 8px; }
.faq-item { border-radius: 6px; background: #f9fafb; border: 1px solid #e5e7eb; overflow: hidden; }
.faq-q { display: flex; align-items: center; cursor: pointer; padding: 10px; user-select: none; }
.faq-q span { font-size: 18px; }
.faq-a { padding: 10px; border-top: 1px solid #e5e7eb; background: #fff; display: none; }
.testimonials-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.testimonial-card { margin: 0; padding: 12px; border: 1px solid var(--line); border-radius: 12px; background: #fff; }
.contact-form { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.contact-form input, .contact-form textarea { padding: 12px; border-radius: 12px; border: 1px solid var(--line); background: #fff; }
.contact-form textarea { min-height: 120px; resize: vertical; }
.contact-form .form-message { margin-top: 8px; text-align: center; color: var(--accent); }
.promo-block { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin-bottom: 18px; text-align: center; }
.newsletter-form { display: flex; flex-direction: column; gap: 8px; max-width: 400px; margin: 0 auto; }
.newsletter-form input { padding: 10px; border-radius: 6px; border: 1px solid #ccc; }
.video-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 12px; }
.video-item { position: relative; padding-top: 56.25%; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; }
.video-item iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; border-radius: 12px; }
.footer { width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0; text-align: center; background: #f8fafc; color: #64748b; }
.list { list-style: none; padding: 0; margin: 0 0 16px; display: flex; flex-direction: column; gap: 6px; }
.list li { display: flex; align-items: center; gap: 8px; }
.list a { color: inherit; text-decoration: none; }
a { color: inherit; }
@media (max-width: 768px) {
  .preview { padding: 8px; }
  .section, .hero { max-width: 100%; padding: 16px; }
  .grid2 { grid-template-columns: 1fr; }
  .usp-grid { flex-direction: column; }
  .usp-item { flex: 1 1 100%; }
  .video-grid { grid-template-columns: 1fr; }
}
`;

// ============== WSPÓLNY BUILDER ZIP ==============
export async function buildZipBlob(cfg) {
  const zip = new JSZip();
  const htmlFolder = zip.folder('export-html');
  zip.folder('dist');

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
  <div class="preview">
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
          <div class="gallery" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(${size}px,1fr));gap:16px;justify-items:center;align-items:center;width:100%;overflow:visible;box-sizing:border-box;">
            ${images.map(img => {
              if (!img) return '';
              const url = typeof img === 'string' ? img : img.url;
              if (!url) return '';
              return `<div class="thumb" style="background:#f3f4f6;width:${size}px;height:${size}px;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px #0001;display:flex;align-items:center;justify-content:center;border:1px solid #ccc;"><img src="${url}" alt="Galeria" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:8px;" /></div>`;
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
  };

  const sections = Array.isArray(cfg.sections) ? [...cfg.sections] : ['hero', 'promo', 'pricing', 'contact'];
  const filteredSections = sections.filter(s => s !== 'footer');

  const body = filteredSections.map(s => {
    const gen = sectionGenerators[s];
    const html = gen ? gen(cfg) : '';
    return html;
  }).filter(Boolean).join('\n');

  const includeFooter = sections.includes('footer');
  const yearFooter = new Date().getFullYear();
  const footerBg = cfg.footer?.background || '#f8fafc';
  const footerColor = cfg.footer?.textColor || '#64748b';
  const footerText = cfg.footer?.text || `© ${yearFooter} ${cfg.brand?.title || 'Twoja firma'}`;
  const t = getTranslation(cfg);
  const footerHtml = includeFooter ? `
    <footer class="footer" style="background:${footerBg};color:${footerColor};padding:24px 0;text-align:center;">
      <div class="small" style="color:inherit;">${footerText}</div>
      <div class="small" style="color:inherit;font-size:11px;opacity:.7;margin-top:2px;">${t.footer?.generated || 'Stworzono w'} <a href="https://www.KickMy.App" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">www.KickMy.App</a></div>
    </footer>
  ` : '';

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
        const icon = this.querySelector('.faq-toggle');
        if (icon) { icon.innerHTML = isOpen ? '&#x25BC;' : '&#x25B2;'; }
      });
    });
  `;
  const scriptTag = `<script>window.addEventListener('DOMContentLoaded',function(){${faqScript}});</script>`;

  htmlFolder.file('index.html', head + body + footerHtml + scriptTag + foot);
  htmlFolder.file('styles.css', CSS_TEXT);
  // Nie dokładamy plików .js, żeby załączniki mailowe nie były blokowane

  return zip.generateAsync({ type: 'blob' });
}

// ============== PUBLICZNE API EKSPORTU ==============

export async function exportZip(cfg, opts = {}) {
  const zipBlob = await buildZipBlob(cfg);
  if (opts.returnBlob) return zipBlob;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipBlob);
  link.download = 'kickmy-export.zip';
  link.click();
}

export async function getExportZipBase64(cfg) {
  const zipBlob = await buildZipBlob(cfg);
  const arrayBuf = await zipBlob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));
  return base64;
}

export function exportConfigJson(cfg, notes) {
  const data = { ...cfg };
  if (notes) data.notes = notes;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'kickmy-config.json';
  link.click();
}
