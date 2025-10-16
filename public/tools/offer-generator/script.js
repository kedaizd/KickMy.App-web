// ====== Stałe & Storage ======
const STORAGE_KEY = 'kickmy-offer-generator';
const COMPANY_PROFILE_KEY = 'kickmy-company-profile';
const MAX_DRAFTS = 25;

// ====== PRESETY - 9 wybranych branż ======
const PRESETY = {
  "uslugi-hydrauliczne": {
    nazwa: "Usługi hydrauliczne",
    propozycje: [
      { nazwa: "Wizyta diagnostyczna", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 },
      { nazwa: "Udrażnianie zlewu/syfonu", jednostka: "szt.", cena: 129, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana baterii umywalkowej", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 },
      { nazwa: "Montaż WC kompakt", jednostka: "szt.", cena: 249, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana syfonu", jednostka: "szt.", cena: 99, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana grzejnika", jednostka: "szt.", cena: 299, vat: 23, ilosc: 1 },
      { nazwa: "Uszczelnianie połączeń", jednostka: "pkt", cena: 69, vat: 23, ilosc: 1 },
      { nazwa: "Montaż zmywarki", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Montaż pralki", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 },
      { nazwa: "Awaryjny dojazd (poza 18:00)", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 }
    ]
  },

  "uslugi-elektryczne": {
    nazwa: "Usługi elektryczne",
    propozycje: [
      { nazwa: "Przegląd instalacji (mieszkanie)", jednostka: "szt.", cena: 299, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana gniazda/wyłącznika", jednostka: "pkt", cena: 89, vat: 23, ilosc: 1 },
      { nazwa: "Montaż lampy sufitowej", jednostka: "szt.", cena: 129, vat: 23, ilosc: 1 },
      { nazwa: "Podłączenie płyty indukcyjnej", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Pomiary i protokół", jednostka: "szt.", cena: 249, vat: 23, ilosc: 1 },
      { nazwa: "Diagnoza zwarcia / awarii", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana bezpiecznika/wyłącznika", jednostka: "szt.", cena: 79, vat: 23, ilosc: 1 },
      { nazwa: "Montaż domofonu / wideofonu", jednostka: "szt.", cena: 299, vat: 23, ilosc: 1 },
      { nazwa: "Modernizacja rozdzielnicy", jednostka: "szt.", cena: 590, vat: 23, ilosc: 1 },
      { nazwa: "Punkt elektryczny (nowy obwód)", jednostka: "pkt", cena: 140, vat: 23, ilosc: 1 }
    ]
  },

  "instalacje-klimatyzacji": {
    nazwa: "Instalacje klimatyzacji",
    propozycje: [
      { nazwa: "Montaż split do 3,5 kW", jednostka: "szt.", cena: 2399, vat: 8, ilosc: 1 },
      { nazwa: "Montaż multi 1x2", jednostka: "szt.", cena: 3999, vat: 8, ilosc: 1 },
      { nazwa: "Przegląd sezonowy", jednostka: "szt.", cena: 249, vat: 8, ilosc: 1 },
      { nazwa: "Dezynfekcja i odgrzybianie", jednostka: "szt.", cena: 199, vat: 8, ilosc: 1 },
      { nazwa: "Uzupełnienie czynnika (R32/R410A)", jednostka: "100 g", cena: 60, vat: 8, ilosc: 1 },
      { nazwa: "Demontaż jednostki", jednostka: "szt.", cena: 349, vat: 8, ilosc: 1 },
      { nazwa: "Montaż skroplin (pompa/pasywny)", jednostka: "szt.", cena: 249, vat: 8, ilosc: 1 },
      { nazwa: "Dodatkowa osłona przewodów", jednostka: "mb", cena: 49, vat: 8, ilosc: 1 },
      { nazwa: "Wydłużenie instalacji (powyżej 3 m)", jednostka: "mb", cena: 89, vat: 8, ilosc: 1 },
      { nazwa: "Audyt doboru mocy na miejscu", jednostka: "szt.", cena: 149, vat: 8, ilosc: 1 }
    ]
  },

  "uslugi-slusarskie": {
    nazwa: "Usługi ślusarskie",
    propozycje: [
      { nazwa: "Awaryjne otwieranie mieszkania", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Awaryjne otwieranie auta", jednostka: "szt.", cena: 299, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana wkładki zamka", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 },
      { nazwa: "Montaż zamka antywłamaniowego", jednostka: "szt.", cena: 349, vat: 23, ilosc: 1 },
      { nazwa: "Serwis drzwi i zawiasów", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 },
      { nazwa: "Naprawa zamka po włamaniu", jednostka: "szt.", cena: 249, vat: 23, ilosc: 1 },
      { nazwa: "Dorobienie klucza (bez immobil.)", jednostka: "szt.", cena: 29, vat: 23, ilosc: 1 },
      { nazwa: "Regulacja samozamykacza", jednostka: "szt.", cena: 99, vat: 23, ilosc: 1 },
      { nazwa: "Montaż szyldów/klamek", jednostka: "szt.", cena: 79, vat: 23, ilosc: 1 },
      { nazwa: "Dojazd nocny/świąteczny", jednostka: "szt.", cena: 149, vat: 23, ilosc: 1 }
    ]
  },

  "firma-remontowa": {
    nazwa: "Usługi remontowo-wykończeniowe",
    propozycje: [
      { nazwa: "Projekt łazienki (do 6 m²)", jednostka: "pakiet", cena: 990, vat: 23, ilosc: 1 },
      { nazwa: "Układanie płytek 60×60", jednostka: "m²", cena: 150, vat: 23, ilosc: 1 },
      { nazwa: "Montaż kabiny prysznicowej", jednostka: "szt.", cena: 450, vat: 23, ilosc: 1 },
      { nazwa: "Gładzie gipsowe", jednostka: "m²", cena: 35, vat: 23, ilosc: 1 },
      { nazwa: "Malowanie ścian (2x)", jednostka: "m²", cena: 25, vat: 23, ilosc: 1 },
      { nazwa: "Sufit podwieszany", jednostka: "m²", cena: 120, vat: 23, ilosc: 1 },
      { nazwa: "Montaż drzwi wewnętrznych", jednostka: "szt.", cena: 350, vat: 23, ilosc: 1 },
      { nazwa: "Wyrównanie ścian (tynk)", jednostka: "m²", cena: 40, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana parapetów", jednostka: "szt.", cena: 150, vat: 23, ilosc: 1 },
      { nazwa: "Sprzątanie poremontowe", jednostka: "m²", cena: 8, vat: 23, ilosc: 1 }
    ]
  },

  "obsluga-imprez": {
    nazwa: "Obsługa imprez / Eventy",
    propozycje: [
      { nazwa: "Pakiet konferencyjny Basic", jednostka: "pakiet", cena: 2900, vat: 23, ilosc: 1 },
      { nazwa: "Pakiet weselny Standard", jednostka: "pakiet", cena: 3900, vat: 23, ilosc: 1 },
      { nazwa: "Nagłośnienie sali", jednostka: "doba", cena: 699, vat: 23, ilosc: 1 },
      { nazwa: "Oświetlenie sceniczne", jednostka: "doba", cena: 799, vat: 23, ilosc: 1 },
      { nazwa: "DJ / Wodzirej", jednostka: "event", cena: 1800, vat: 23, ilosc: 1 },
      { nazwa: "Technik na wydarzeniu", jednostka: "h", cena: 120, vat: 23, ilosc: 5 },
      { nazwa: "Projektor + ekran", jednostka: "doba", cena: 399, vat: 23, ilosc: 1 },
      { nazwa: "Fotobudka", jednostka: "h", cena: 250, vat: 23, ilosc: 3 },
      { nazwa: "Transport i montaż", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Koordynacja wydarzenia", jednostka: "event", cena: 1200, vat: 23, ilosc: 1 }
    ]
  },

  "pielegnacja-ogrodow": {
    nazwa: "Pielęgnacja ogrodów",
    propozycje: [
      { nazwa: "Zakładanie trawnika z rolki", jednostka: "m²", cena: 25, vat: 8, ilosc: 10 },
      { nazwa: "Nawadnianie automatyczne", jednostka: "m²", cena: 5, vat: 8, ilosc: 50 },
      { nazwa: "Przycinka drzew", jednostka: "szt.", cena: 200, vat: 8, ilosc: 1 },
      { nazwa: "Sadzenie krzewów", jednostka: "szt.", cena: 20, vat: 8, ilosc: 5 },
      { nazwa: "Aeracja i wertykulacja", jednostka: "m²", cena: 2.5, vat: 8, ilosc: 100 },
      { nazwa: "Koszenie trawy", jednostka: "m²", cena: 1.5, vat: 8, ilosc: 100 },
      { nazwa: "Odchwaszczanie rabat", jednostka: "h", cena: 60, vat: 8, ilosc: 2 },
      { nazwa: "Nawożenie sezonowe", jednostka: "m²", cena: 2, vat: 8, ilosc: 50 },
      { nazwa: "Projekt ogrodu (mini)", jednostka: "pakiet", cena: 690, vat: 23, ilosc: 1 },
      { nazwa: "Stała opieka (5 wizyt)", jednostka: "pakiet", cena: 1200, vat: 8, ilosc: 1 }
    ]
  },

  "naprawa-agd": {
    nazwa: "Serwis sprzętu AGD",
    propozycje: [
      { nazwa: "Diagnoza u klienta", jednostka: "szt.", cena: 120, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana grzałki pralki", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Naprawa silnika odkurzacza", jednostka: "szt.", cena: 249, vat: 23, ilosc: 1 },
      { nazwa: "Serwis piekarnika", jednostka: "szt.", cena: 299, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana uszczelki zmywarki", jednostka: "szt.", cena: 99, vat: 23, ilosc: 1 },
      { nazwa: "Czyszczenie filtra pralki", jednostka: "szt.", cena: 79, vat: 23, ilosc: 1 },
      { nazwa: "Naprawa lodówki - chłodzenie", jednostka: "szt.", cena: 349, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana pompy spustowej", jednostka: "szt.", cena: 219, vat: 23, ilosc: 1 },
      { nazwa: "Konserwacja zmywarki", jednostka: "szt.", cena: 159, vat: 23, ilosc: 1 },
      { nazwa: "Dojazd poza miasto (do 30 km)", jednostka: "szt.", cena: 79, vat: 23, ilosc: 1 }
    ]
  },

  "serwis-samochodowy": {
    nazwa: "Serwis samochodowy",
    propozycje: [
      { nazwa: "Diagnostyka komputerowa", jednostka: "szt.", cena: 120, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana klocków hamulcowych (oś)", jednostka: "szt.", cena: 120, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana tarcz + klocków (oś)", jednostka: "szt.", cena: 240, vat: 23, ilosc: 1 },
      { nazwa: "Przegląd przed zakupem", jednostka: "szt.", cena: 180, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana oleju i filtrów (robocizna)", jednostka: "szt.", cena: 150, vat: 23, ilosc: 1 },
      { nazwa: "Serwis klimatyzacji - odgrzybianie", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Napełnianie klimatyzacji", jednostka: "szt.", cena: 199, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana rozrządu (robocizna)", jednostka: "szt.", cena: 800, vat: 23, ilosc: 1 },
      { nazwa: "Wymiana opon (4 szt.)", jednostka: "zestaw", cena: 150, vat: 23, ilosc: 1 },
      { nazwa: "Ustawienie zbieżności", jednostka: "szt.", cena: 159, vat: 23, ilosc: 1 }
    ]
  }
};

// ====== DOM Elements ======
const form = {
  sellerName: document.getElementById('seller-name'),
  sellerDetails: document.getElementById('seller-details'),
  client: document.getElementById('client'),
  email: document.getElementById('email'),
  offerId: document.getElementById('offer-id'),
  date: document.getElementById('date'),
  title: document.getElementById('title'),
  validity: document.getElementById('validity'),
  payment: document.getElementById('payment'),
  notes: document.getElementById('notes')
};

const selectIndustry = document.getElementById('industry-select');
const suggestionsBox = document.getElementById('industry-suggestions');
const tbodyItems = document.getElementById('items-tbody');
const sumNetEl = document.getElementById('sum-net');
const sumVatEl = document.getElementById('sum-vat');
const sumGrossEl = document.getElementById('sum-gross');
const inCustomName = document.getElementById('custom-name');
const inCustomUnit = document.getElementById('custom-unit');
const inCustomPrice = document.getElementById('custom-price');
const inCustomQty = document.getElementById('custom-qty');
const inCustomVat = document.getElementById('custom-vat');
const btnAddCustomRow = document.getElementById('add-custom');

const applySellerBtn = document.getElementById('apply-seller');
const preview = document.getElementById('preview');
const draftsUl = document.getElementById('drafts');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy');
const saveDraftBtn = document.getElementById('save-draft');
const clearBtn = document.getElementById('clear');

const exportPdfBtn = document.getElementById('export-pdf');


const fmtPL = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ====== Utility Functions ======
function toNum(v) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const s = String(v).replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ====== Initialize Industry Select ======
function initIndustrySelect() {
  if (!selectIndustry) return;
  Object.entries(PRESETY).forEach(([id, p]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = p.nazwa;
    selectIndustry.appendChild(opt);
  });
}

// ====== Industry Suggestions ======
if (selectIndustry) {
  selectIndustry.addEventListener('change', () => {
    suggestionsBox.innerHTML = '';
    const id = selectIndustry.value;
    if (!id || !PRESETY[id]) return;

    PRESETY[id].propozycje.forEach(p => {
      const card = document.createElement('div');
      card.className = 'suggestion';
      card.innerHTML = `<div>
        <h4 style="margin-bottom: 4px;">${escapeHtml(p.nazwa)}</h4>
        <div class="meta">Jednostka: ${escapeHtml(p.jednostka)} • Cena: ${fmtPL.format(p.cena)} zł • VAT: ${p.vat}%</div></div>
        <button type="button" class="btn">Dodaj</button>
      `;
      card.querySelector('.btn').addEventListener('click', () => addRow({
        nazwa: p.nazwa,
        jednostka: p.jednostka,
        cena: p.cena,
        ilosc: p.ilosc ?? 1,
        vat: p.vat ?? 23
      }));
      suggestionsBox.appendChild(card);
    });
  });
}

// ====== Table Management ======
function addRow({ nazwa, jednostka, cena, ilosc, vat }) {
  const tr = document.createElement('tr');

  const tdName = document.createElement('td');
  const inpName = document.createElement('input');
  inpName.type = 'text';
  inpName.value = nazwa || '';
  tdName.appendChild(inpName);

  const tdUnit = document.createElement('td');
  const inpUnit = document.createElement('input');
  inpUnit.type = 'text';
  inpUnit.value = jednostka || 'szt.';
  tdUnit.appendChild(inpUnit);

  const tdPrice = document.createElement('td');
  const inpPrice = document.createElement('input');
  inpPrice.type = 'number';
  inpPrice.min = '0';
  inpPrice.step = 'any'; // Umożliwia wpisywanie z przecinkiem
  inpPrice.value = (cena ?? 0);
  tdPrice.appendChild(inpPrice);

  const tdQty = document.createElement('td');
  const inpQty = document.createElement('input');
  inpQty.type = 'number';
  inpQty.min = '0';
  inpQty.step = 'any'; // Umożliwia wpisywanie z przecinkiem
  inpQty.value = (ilosc ?? 1);
  tdQty.appendChild(inpQty);

  const tdVat = document.createElement('td');
  const inpVat = document.createElement('input');
  inpVat.type = 'number';
  inpVat.min = '0';
  inpVat.max = '99';
  inpVat.step = '1';
  inpVat.value = (vat ?? 23);
  tdVat.appendChild(inpVat);

  const tdNet = document.createElement('td');
  tdNet.className = 'right sum-cell';
  tdNet.textContent = '0,00';
  
  const tdVatAmt = document.createElement('td');
  tdVatAmt.className = 'right sum-cell';
  tdVatAmt.textContent = '0,00';
  
  const tdGross = document.createElement('td');
  tdGross.className = 'right sum-cell';
  tdGross.textContent = '0,00';

  const tdDel = document.createElement('td');
  const btnDel = document.createElement('button');
  btnDel.className = 'btn-danger';
  btnDel.textContent = 'Usuń';
  btnDel.addEventListener('click', () => {
    tr.remove();
    recomputeTotals();
  });
  tdDel.appendChild(btnDel);

  tr.appendChild(tdName);
  tr.appendChild(tdUnit);
  tr.appendChild(tdPrice);
  tr.appendChild(tdQty);
  tr.appendChild(tdVat);
  tr.appendChild(tdNet);
  tr.appendChild(tdVatAmt);
  tr.appendChild(tdGross);
  tr.appendChild(tdDel);

  [inpPrice, inpQty, inpVat].forEach(inp => 
    inp.addEventListener('input', () => recomputeRow(tr))
  );
  
  tbodyItems.appendChild(tr);
  recomputeRow(tr);
}

function recomputeRow(tr) {
  const [tdName, tdUnit, tdPrice, tdQty, tdVat, tdNet, tdVatAmt, tdGross] = tr.children;
  const price = toNum(tdPrice.querySelector('input').value);
  const qty = toNum(tdQty.querySelector('input').value);
  const vatP = toNum(tdVat.querySelector('input').value);

  const net = price * qty;
  const vat = net * (vatP / 100);
  const gross = net + vat;

  tdNet.textContent = fmtPL.format(net);
  tdVatAmt.textContent = fmtPL.format(vat);
  tdGross.textContent = fmtPL.format(gross);

  recomputeTotals();
}

function recomputeTotals() {
  let net = 0, vat = 0, gross = 0;
  [...tbodyItems.querySelectorAll('tr')].forEach(tr => {
    const tdNet = tr.children[5];
    const tdVatAmt = tr.children[6];
    const tdGross = tr.children[7];
    net += toNum(tdNet.textContent);
    vat += toNum(tdVatAmt.textContent);
    gross += toNum(tdGross.textContent);
  });
  sumNetEl.textContent = fmtPL.format(net);
  sumVatEl.textContent = fmtPL.format(vat);
  sumGrossEl.textContent = fmtPL.format(gross);
}

// ====== Add Custom Row ======
if (btnAddCustomRow) {
  btnAddCustomRow.addEventListener('click', () => {
    const nazwa = (inCustomName.value || '').trim();
    const jednostka = (inCustomUnit.value || 'szt.').trim();
    const cena = toNum(inCustomPrice.value);
    const ilosc = toNum(inCustomQty.value) || 1;
    const vat = toNum(inCustomVat.value);
    
    if (!nazwa) {
      alert('Podaj nazwę pozycji.');
      return;
    }
    
    addRow({ nazwa, jednostka, cena, ilosc, vat });
    inCustomName.value = '';
    inCustomUnit.value = '';
    inCustomPrice.value = '';
    inCustomQty.value = '';
    inCustomVat.value = '23';
  });
}

// ====== Generate Offer Preview ======
function collectSelectedServices() {
  const selections = [];
  
  if (tbodyItems && tbodyItems.children.length > 0) {
    [...tbodyItems.querySelectorAll('tr')].forEach(tr => {
      const [tdName, tdUnit, tdPrice, tdQty, tdVat] = tr.children;
      const name = (tdName.querySelector('input')?.value || '').trim();
      const unit = (tdUnit.querySelector('input')?.value || 'szt.').trim();
      const price = toNum(tdPrice.querySelector('input')?.value);
      const qty = toNum(tdQty.querySelector('input')?.value);
      const vatP = toNum(tdVat.querySelector('input')?.value);
      const net = price * qty;
      const vatAmt = net * (vatP / 100);
      const gross = net + vatAmt;

      if (name && qty > 0 && price >= 0) {
        selections.push({
          name, unit, qty, price, vatP, net, vatAmt, gross
        });
      }
    });
  }
  
  return selections;
}

function renderPreview() {
  const data = {
    sellerName: form.sellerName.value.trim(),
    sellerDetails: form.sellerDetails.value.trim(),
    client: form.client.value.trim(),
    email: form.email.value.trim(),
    offerId: form.offerId.value.trim(),
    date: form.date.value,
    title: form.title.value.trim(),
    validity: form.validity.value,
    payment: form.payment.value.trim(),
    notes: form.notes.value.trim(),
    items: collectSelectedServices()
  };

  if (!data.items.length) {
    preview.innerHTML = `<p class="muted">Brak pozycji. Dodaj elementy do tabeli.</p>`;
    return;
  }

  const rows = data.items.map(i => `
    <tr>
      <td>${escapeHtml(i.name)} (${escapeHtml(i.unit)})</td>
      <td class="right">${i.qty}</td>
      <td class="right">${fmtPL.format(i.price)} zł</td>
      <td class="right">${fmtPL.format(i.net)} zł</td>
      <td class="right">${fmtPL.format(i.vatAmt)} zł</td>
      <td class="right">${fmtPL.format(i.gross)} zł</td>
    </tr>
  `).join('');

  const totalNet = data.items.reduce((sum, i) => sum + i.net, 0);
  const totalVat = data.items.reduce((sum, i) => sum + i.vatAmt, 0);
  const totalGross = data.items.reduce((sum, i) => sum + i.gross, 0);

  preview.innerHTML = `
    <div style="padding:20px;background:#fff;border:1px solid #e2e8f0;border-radius:12px">
      <div style="display:flex; justify-content:space-between; align-items:start; flex-wrap:wrap;">
        <div><strong>Sprzedawca:</strong><br>${escapeHtml(data.sellerName || 'Twoja firma')}<br>${escapeHtml(data.sellerDetails || 'Adres, NIP')}</div>
        <div><strong>Nabywca:</strong><br>${escapeHtml(data.client || 'Klient')}<br>${escapeHtml(data.email || '')}</div>
      </div>
      <hr style="border:0; border-top:1px solid #e2e8f0; margin: 16px 0;">
      <h3>${escapeHtml(data.title || 'Oferta handlowa')}</h3>
      <p><strong>Numer oferty:</strong> ${escapeHtml(data.offerId || 'Brak')} | <strong>Data wystawienia:</strong> ${new Date(data.date).toLocaleDateString('pl-PL')}</p>
      ${data.email ? `<p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>` : ''}
      
      <h4>Wycena</h4>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f8fafc">
            <th style="text-align:left;padding:8px;border-bottom:2px solid #cbd5e1">Pozycja</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1">Ilość</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1">Cena j.</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1">Netto</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1">VAT</th>
            <th style="text-align:right;padding:8px;border-bottom:2px solid #cbd5e1">Brutto</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        <tfoot>
          <tr style="font-weight:700;border-top:2px solid #cbd5e1">
            <td colspan="3" style="text-align:right;padding:8px">Razem:</td>
            <td style="text-align:right;padding:8px">${fmtPL.format(totalNet)} zł</td>
            <td style="text-align:right;padding:8px">${fmtPL.format(totalVat)} zł</td>
            <td style="text-align:right;padding:8px">${fmtPL.format(totalGross)} zł</td>
          </tr>
        </tfoot>
      </table>
      
      ${data.validity ? `<p><strong>Ważność oferty:</strong> ${new Date(data.validity).toLocaleDateString('pl-PL')}</p>` : ''}
      ${data.payment ? `<p><strong>Warunki płatności:</strong> ${escapeHtml(data.payment)}</p>` : ''}
      ${data.notes ? `<p><strong>Uwagi:</strong><br/>${escapeHtml(data.notes).replace(/\n/g, '<br/>')}</p>` : ''}
    </div>
  `;
}

function exportToPdf() {
  const data = {
    sellerName: form.sellerName.value.trim(),
    sellerDetails: form.sellerDetails.value.trim(),
    client: form.client.value.trim(),
    email: form.email.value.trim(),
    offerId: form.offerId.value.trim(),
    date: form.date.value,
    title: form.title.value.trim(),
    validity: form.validity.value,
    payment: form.payment.value.trim(),
    notes: form.notes.value.trim(),
    items: collectSelectedServices()
  };

  if (!data.items.length) {
    alert('Brak pozycji do wygenerowania PDF.');
    return;
  }

  const tableBody = [
    ['Pozycja', 'Ilość', 'Cena j.', 'Netto', 'VAT', 'Brutto'].map(h => ({ text: h, style: 'tableHeader' }))
  ];
  data.items.forEach(i => {
    tableBody.push([
      { text: `${i.name}\n${i.unit}`, style: 'itemDescription' },
      { text: i.qty, alignment: 'right' },
      { text: `${fmtPL.format(i.price)} zł`, alignment: 'right' },
      { text: `${fmtPL.format(i.net)} zł`, alignment: 'right' },
      { text: `${fmtPL.format(i.vatAmt)} zł`, alignment: 'right' },
      { text: `${fmtPL.format(i.gross)} zł`, alignment: 'right', bold: true }
    ]);
  });

  const totalNet = data.items.reduce((sum, i) => sum + i.net, 0);
  const totalVat = data.items.reduce((sum, i) => sum + i.vatAmt, 0);
  const totalGross = data.items.reduce((sum, i) => sum + i.gross, 0);

  tableBody.push([
    { text: 'Razem:', colSpan: 3, alignment: 'right', bold: true, style: 'tableFooter' }, {}, {},
    { text: `${fmtPL.format(totalNet)} zł`, alignment: 'right', bold: true, style: 'tableFooter' },
    { text: `${fmtPL.format(totalVat)} zł`, alignment: 'right', bold: true, style: 'tableFooter' },
    { text: `${fmtPL.format(totalGross)} zł`, alignment: 'right', bold: true, style: 'tableFooter' }
  ]);

  const docDefinition = {
    content: [
      {
        columns: [
          { text: `Sprzedawca:\n${data.sellerName}\n${data.sellerDetails}`, style: 'address' },
          { text: `Nabywca:\n${data.client}\n${data.email}`, style: 'address', alignment: 'right' }
        ]
      },
      { text: data.title || 'Oferta handlowa', style: 'header', margin: [0, 20, 0, 5] },
      { text: `Numer oferty: ${data.offerId || 'Brak'} | Data: ${new Date(data.date).toLocaleDateString('pl-PL')}`, margin: [0, 0, 0, 20] },
      { text: 'Wycena', style: 'subheader' },
      {
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: tableBody
        }
      },
      { text: `Do zapłaty: ${fmtPL.format(totalGross)} zł`, style: 'total', alignment: 'right', margin: [0, 20, 0, 0] },
      { text: `Ważność oferty: ${data.validity ? new Date(data.validity).toLocaleDateString('pl-PL') : 'do uzgodnienia'}`, margin: [0, 20, 0, 5] },
      { text: `Warunki płatności: ${data.payment || 'do uzgodnienia'}`, margin: [0, 0, 0, 5] },
      data.notes ? { text: `Uwagi:\n${data.notes}`, margin: [0, 10, 0, 0] } : ''
    ],
    styles: {
      header: { fontSize: 18, bold: true, color: '#0f172a' },
      subheader: { fontSize: 14, bold: true, color: '#0f172a', margin: [0, 10, 0, 5] },
      tableHeader: { bold: true, fontSize: 9, color: '#475569' },
      tableFooter: { bold: true, fontSize: 10 },
      itemDescription: { fontSize: 9 },
      total: { fontSize: 14, bold: true, color: '#f97316' },
      address: { fontSize: 9, color: '#475569', lineHeight: 1.4 }
    },
    defaultStyle: { fontSize: 10, color: '#0f172a' }
  };

  pdfMake.createPdf(docDefinition).download(`oferta-${data.offerId || Date.now()}.pdf`);
}
// ====== Drafts Management ======
function loadDrafts() {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  
  if (!all.length) {
    draftsUl.innerHTML = '<li style="color:#64748b;font-style:italic">Brak zapisanych szkiców.</li>';
    return;
  }
  
  draftsUl.innerHTML = '';
  all.slice().reverse().forEach((d, i) => {
    const actualIndex = all.length - 1 - i;
    const li = document.createElement('li');
    li.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;margin-bottom:8px';
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(d.client || 'Szkic ' + (actualIndex + 1))}</strong>
        <small style="display:block;color:#64748b;font-size:12px">${new Date(d.ts).toLocaleString('pl-PL')}</small>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn-secondary" data-load="${actualIndex}">Wczytaj</button>
        <button class="btn-danger" data-del="${actualIndex}">Usuń</button>
      </div>
    `;
    draftsUl.appendChild(li);
  });

  draftsUl.querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const d = all[parseInt(b.dataset.load, 10)];
    if (!d) return;
    
    form.client.value = d.client || '';
    form.sellerName.value = d.sellerName || '';
    form.sellerDetails.value = d.sellerDetails || '';
    form.email.value = d.email || '';
    form.offerId.value = d.offerId || '';
    form.title.value = d.title || '';
    form.validity.value = d.validity || '';
    form.payment.value = d.payment || '';
    form.notes.value = d.notes || '';
    
    tbodyItems.innerHTML = '';
    (d.items || []).forEach(it => addRow({
      nazwa: it.name,
      jednostka: it.unit || 'szt.',
      cena: it.price,
      ilosc: it.qty,
      vat: it.vatP || 23
    }));
    
    renderPreview();
  }));

  draftsUl.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
    if (!confirm('Usunąć ten szkic?')) return;
    const idx = parseInt(b.dataset.del, 10);
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    all.splice(idx, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(-MAX_DRAFTS)));
    loadDrafts();
  }));
}

function saveDraft() {
  const items = collectSelectedServices();
  
  if (!items.length) {
    alert('Brak pozycji do zapisania.');
    return;
  }
  
  const payload = {
    ts: Date.now(),
    client: form.client.value.trim(),
    sellerName: form.sellerName.value.trim(),
    sellerDetails: form.sellerDetails.value.trim(),
    email: form.email.value.trim(),
    offerId: form.offerId.value.trim(),
    title: form.title.value.trim(),
    validity: form.validity.value,
    payment: form.payment.value.trim(),
    notes: form.notes.value.trim(),
    items: items.map(it => ({
      name: it.name,
      unit: it.unit,
      price: it.price,
      qty: it.qty,
      vatP: it.vatP
    }))
  };
  
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  all.push(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(-MAX_DRAFTS)));
  loadDrafts();
  
  alert('Zapisano szkic.');
}

function applySellerProfile() {
    try {
      const profileData = JSON.parse(localStorage.getItem(COMPANY_PROFILE_KEY) || '{}');
      if (Object.keys(profileData).length === 0) {
        alert('Nie znaleziono profilu firmy. Uzupełnij go w narzędziu "Dane firmy".');
        return;
      }

      if (form.sellerName && profileData.name) {
        form.sellerName.value = profileData.name;
      }

      if (form.sellerDetails) {
        const details = [profileData.street, profileData.postal, profileData.city].filter(Boolean);
        if (profileData.nip) details.push(`NIP: ${profileData.nip}`);
        form.sellerDetails.value = details.join(', ');
      }
      alert('Dane sprzedawcy zostały wczytane.');
    } catch (e) {
      alert('Wystąpił błąd podczas wczytywania profilu firmy.');
    }
}
// ====== Action Buttons ======
generateBtn.addEventListener('click', renderPreview);

if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportToPdf);

copyBtn.addEventListener('click', async () => {
  if (!preview.innerHTML || preview.innerHTML.includes('Brak pozycji')) {
    alert('Najpierw wygeneruj ofertę.');
    return;
  }
  
  const tmp = document.createElement('div');
  tmp.innerHTML = preview.innerHTML;
  
  try {
    await navigator.clipboard.writeText(tmp.innerText);
    alert('Skopiowano treść oferty do schowka.');
  } catch {
    alert('Nie udało się skopiować.');
  }
});

saveDraftBtn.addEventListener('click', saveDraft);

if (applySellerBtn) applySellerBtn.addEventListener('click', applySellerProfile);

clearBtn.addEventListener('click', () => {
  if (!confirm('Wyczyścić wszystkie pola?')) return;
  
  Object.values(form).forEach(el => el && (el.value = ''));
  if (tbodyItems) tbodyItems.innerHTML = '';
  if (suggestionsBox) suggestionsBox.innerHTML = '';
  if (selectIndustry) selectIndustry.value = '';
  
  sumNetEl.textContent = '0,00';
  sumVatEl.textContent = '0,00';
  sumGrossEl.textContent = '0,00';
  
  renderPreview();
});

// ====== Initialize ======
document.addEventListener('DOMContentLoaded', () => {
  initIndustrySelect();
  loadDrafts();
  renderPreview();
});