(function () {
  const el = (id) => document.getElementById(id);
  const fmt = (n) => (isNaN(n) ? '0.00' : (Math.round((Number(n) + Number.EPSILON) * 100) / 100).toFixed(2));

  const state = {
    services: [],
    materials: [],
    extras: [],
    result: null,
    history: [], // Store last 5 calculations
    comparisons: [], // Store competitor comparisons
  };

  const CATEGORIES = {
    'Remont': [
      ['Malowanie ścian', 'm²', 20, 1, 23], ['Gładź gipsowa', 'm²', 35, 1, 23], ['Tapetowanie', 'm²', 30, 1, 23], ['Układanie paneli', 'm²', 35, 1, 23], ['Sufit podwieszany', 'm²', 80, 1, 23],
      ['Montaż drzwi', 'szt.', 200, 1, 23], ['Montaż listew', 'mb', 12, 5, 23], ['Układanie płytek', 'm²', 90, 1, 23], ['Fuga i silikonowanie', 'm²', 20, 1, 23], ['Wymiana parapetów', 'szt.', 120, 1, 23],
      ['Szpachlowanie', 'm²', 25, 1, 23], ['Skrobanie farby', 'm²', 18, 1, 23], ['Zabudowa GK', 'm²', 75, 1, 23], ['Malowanie sufitów', 'm²', 22, 1, 23], ['Gruntowanie ścian', 'm²', 8, 1, 23]
    ],
    'Usługi ślusarskie': [
      ['Dorobienie kluczy', 'szt.', 20, 1, 23], ['Awaryjne otwieranie drzwi', 'szt.', 250, 1, 23], ['Montaż zamka', 'szt.', 150, 1, 23], ['Wymiana wkładki', 'szt.', 100, 1, 23], ['Naprawa zamka', 'szt.', 120, 1, 23],
      ['Montaż samozamykacza', 'szt.', 180, 1, 23], ['Ochrona antywłamaniowa', 'szt.', 220, 1, 23], ['Konserwacja zamków', 'szt.', 90, 1, 23], ['Montaż zasuwy', 'szt.', 90, 1, 23], ['Naprawa zawiasów', 'szt.', 70, 1, 23],
      ['Instalacja klamki', 'szt.', 60, 1, 23], ['Regulacja drzwi', 'szt.', 80, 1, 23], ['Wymiana zamka w bramie', 'szt.', 200, 1, 23], ['Awaryjne otwarcie sejfu', 'szt.', 400, 1, 23], ['Montaż wizjera', 'szt.', 60, 1, 23]
    ],
    'Hydraulika': [
      ['Wymiana baterii', 'szt.', 80, 1, 23], ['Montaż zlewu', 'szt.', 180, 1, 23], ['Montaż WC', 'szt.', 300, 1, 23], ['Udrażnianie rur', 'h', 150, 1, 23], ['Wymiana syfonu', 'szt.', 90, 1, 23],
      ['Naprawa spłuczki', 'szt.', 120, 1, 23], ['Montaż pralki', 'szt.', 120, 1, 23], ['Uszczelnienie połączeń', 'szt.', 60, 1, 23], ['Wymiana grzejnika', 'szt.', 250, 1, 23], ['Odpowietrzanie instalacji', 'szt.', 80, 1, 23],
      ['Naprawa przecieku', 'h', 160, 1, 23], ['Wymiana rur', 'm', 35, 3, 23], ['Montaż kabiny prysznicowej', 'szt.', 450, 1, 23], ['Montaż brodzika', 'szt.', 250, 1, 23], ['Montaż bojlera', 'szt.', 300, 1, 23]
    ],
    'Elektryka': [
      ['Montaż gniazdka', 'szt.', 50, 2, 23], ['Montaż włącznika', 'szt.', 45, 2, 23], ['Wymiana bezpiecznika', 'szt.', 60, 1, 23], ['Podłączenie płyty indukcyjnej', 'szt.', 220, 1, 23], ['Montaż lampy', 'szt.', 80, 2, 23],
      ['Przegląd instalacji', 'h', 150, 1, 23], ['Wymiana przewodów', 'm', 8, 10, 23], ['Montaż domofonu', 'szt.', 220, 1, 23], ['Montaż czujnika ruchu', 'szt.', 120, 1, 23], ['Naprawa zwarcia', 'h', 180, 1, 23],
      ['Montaż rozdzielni', 'szt.', 600, 1, 23], ['Uziemienie', 'pkt', 120, 2, 23], ['Pomiar instalacji', 'pkt', 40, 5, 23], ['Montaż RCD', 'szt.', 140, 1, 23], ['Wymiana licznika', 'szt.', 300, 1, 23]
    ],
    'Instalacje klimatyzacji': [
      ['Montaż jednostki split', 'szt.', 1500, 1, 23], ['Czyszczenie klimatyzacji', 'szt.', 180, 1, 23], ['Uzupełnianie czynnika', 'szt.', 250, 1, 23], ['Serwis gwarancyjny', 'szt.', 200, 1, 23], ['Naprawa wycieku', 'h', 180, 1, 23],
      ['Przegląd okresowy', 'szt.', 180, 1, 23], ['Wymiana filtra', 'szt.', 60, 1, 23], ['Dezynfekcja układu', 'szt.', 140, 1, 23], ['Montaż sterownika Wi-Fi', 'szt.', 160, 1, 23], ['Przeniesienie jednostki', 'szt.', 600, 1, 23],
      ['Montaż odpływu skroplin', 'szt.', 140, 1, 23], ['Uszczelnienie instalacji', 'szt.', 160, 1, 23], ['Diagnoza usterek', 'h', 150, 1, 23], ['Montaż osłony', 'szt.', 100, 1, 23], ['Odgrzybianie', 'szt.', 120, 1, 23]
    ],
    'Usługi tłumaczeń': [
      ['Tłumaczenie CV', 'str', 60, 1, 23], ['Tłumaczenie umowy', 'str', 90, 1, 23], ['Tłumaczenie techniczne', 'str', 120, 1, 23], ['Korekta językowa', 'str', 40, 1, 23], ['Lokalizacja strony', 'h', 120, 1, 23],
      ['Tłumaczenie ofert', 'str', 80, 1, 23], ['Tłumaczenie korespondencji', 'str', 60, 1, 23], ['Transkreacja', 'h', 150, 1, 23], ['Tłumaczenie medyczne', 'str', 130, 1, 23], ['Streszczenie tekstu', 'str', 50, 1, 23],
      ['Tłumaczenie prezentacji', 'slajd', 30, 4, 23], ['Tłumaczenie instrukcji', 'str', 90, 1, 23], ['Tłumaczenie świadectw', 'str', 80, 1, 23], ['Redakcja', 'str', 35, 1, 23], ['Proofreading', 'str', 30, 1, 23]
    ],
    'Usługi pielęgnacji ogrodów': [
      ['Koszenie trawy', 'm²', 1.5, 200, 8], ['Przycinanie żywopłotu', 'mb', 8, 20, 8], ['Nawożenie', 'm²', 0.8, 200, 8], ['Nawadnianie', 'pkt', 50, 2, 23], ['Aeracja trawnika', 'm²', 1.2, 150, 8],
      ['Sadzenie roślin', 'szt.', 10, 10, 8], ['Usuwanie chwastów', 'h', 80, 2, 8], ['Formowanie krzewów', 'szt.', 20, 10, 8], ['Pielęgnacja drzew', 'szt.', 120, 2, 8], ['Zgrabywanie liści', 'h', 60, 2, 8],
      ['Zakładanie trawnika', 'm²', 20, 50, 8], ['Opryski', 'm²', 1, 200, 8], ['Mulczowanie', 'm²', 2, 100, 8], ['Wertykulacja', 'm²', 1.8, 150, 8], ['Pielęgnacja rabat', 'm²', 4, 60, 8]
    ],
    'Serwis sprzętu AGD': [
      ['Naprawa pralki', 'h', 160, 2, 23], ['Naprawa zmywarki', 'h', 160, 2, 23], ['Naprawa lodówki', 'h', 180, 2, 23], ['Wymiana grzałki', 'szt.', 140, 1, 23], ['Czyszczenie filtra', 'szt.', 60, 1, 23],
      ['Naprawa suszarki', 'h', 160, 2, 23], ['Wymiana pompy', 'szt.', 180, 1, 23], ['Uszczelnienie drzwiczek', 'szt.', 80, 1, 23], ['Naprawa piekarnika', 'h', 170, 2, 23], ['Wymiana termostatu', 'szt.', 160, 1, 23],
      ['Naprawa płyty', 'h', 180, 2, 23], ['Diagnoza usterki', 'szt.', 120, 1, 23], ['Czyszczenie układu', 'szt.', 120, 1, 23], ['Wymiana łożysk', 'szt.', 250, 1, 23], ['Naprawa mikrofali', 'h', 160, 2, 23]
    ],
    'Mechanik samochodowy': [
      ['Wymiana oleju', 'szt.', 120, 1, 23], ['Wymiana klocków', 'szt.', 160, 1, 23], ['Wymiana tarcz', 'szt.', 200, 1, 23], ['Wymiana świec', 'szt.', 80, 4, 23], ['Diagnostyka', 'szt.', 120, 1, 23],
      ['Wymiana rozrządu', 'szt.', 1200, 1, 23], ['Geometria kół', 'szt.', 150, 1, 23], ['Wymiana amortyzatorów', 'szt.', 300, 2, 23], ['Serwis klimatyzacji', 'szt.', 220, 1, 23], ['Wymiana akumulatora', 'szt.', 120, 1, 23],
      ['Naprawa zawieszenia', 'h', 180, 3, 23], ['Wymiana filtrów', 'szt.', 70, 3, 23], ['Naprawa wydechu', 'szt.', 200, 1, 23], ['Wymiana sprzęgła', 'szt.', 900, 1, 23], ['Naprawa chłodnicy', 'szt.', 250, 1, 23]
    ],
  };

  function levelFactor() {
    const v = el('priceLevel')?.value || 'mid';
    return v === 'low' ? 0.9 : v === 'high' ? 1.15 : 1.0;
  }

  function rowTotals(row) {
    const unitNet = parseFloat(row.unitNet) || 0;
    const qty = parseFloat(row.qty) || 0;
    const vat = parseFloat(row.vat) || 0;
    const net = unitNet * qty;
    const vatCost = net * (vat / 100);
    const gross = net + vatCost;
    return { net, vatCost, gross };
  }

  function renderTable(bodyId, rows, subtotalIds) {
    const tbody = el(bodyId);
    if (!tbody) return { sumNet: 0, sumVat: 0, sumGross: 0 };
    tbody.innerHTML = '';
    let sumNet = 0, sumVat = 0, sumGross = 0;
    rows.forEach((row, idx) => {
      const t = rowTotals(row);
      sumNet += t.net;
      sumVat += t.vatCost;
      sumGross += t.gross;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input data-type="name" data-idx="${idx}" value="${row.name || ''}" aria-label="Nazwa"></td>
        <td><input data-type="unit" data-idx="${idx}" value="${row.unit || ''}" aria-label="Jednostka"></td>
        <td><input type="number" min="0" step="0.01" data-type="unitNet" data-idx="${idx}" value="${fmt(row.unitNet || 0)}" aria-label="Cena jednostkowa netto"></td>
        <td><input type="number" min="0" step="0.01" data-type="qty" data-idx="${idx}" value="${fmt(row.qty || 0)}" aria-label="Ilość"></td>
        <td><input type="number" min="0" step="1" data-type="vat" data-idx="${idx}" value="${row.vat || 23}" aria-label="Stawka VAT"></td>
        <td>${fmt(t.net)}</td>
        <td>${fmt(t.vatCost)}</td>
        <td>${fmt(t.gross)}</td>
        <td><button type="button" class="del" data-del="${idx}" aria-label="Usuń wiersz">×</button></td>
      `;
      tbody.appendChild(tr);
    });
    if (el(subtotalIds.net)) el(subtotalIds.net).textContent = fmt(sumNet);
    if (el(subtotalIds.vat)) el(subtotalIds.vat).textContent = fmt(sumVat);
    if (el(subtotalIds.gross)) el(subtotalIds.gross).textContent = fmt(sumGross);
    return { sumNet, sumVat, sumGross };
  }

  function renderAll() {
    const s = renderTable('servicesBody', state.services, { net: 'servicesNet', vat: 'servicesVat', gross: 'servicesGross' });
    const m = renderTable('materialsBody', state.materials, { net: 'materialsNet', vat: 'materialsVat', gross: 'materialsGross' });
    const e = renderTable('extrasBody', state.extras, { net: 'extrasNet', vat: 'extrasVat', gross: 'extrasGross' });
    return { s, m, e };
  }

  function attachHandlers(bodyId, arr) {
    const tbody = el(bodyId);
    if (!tbody) return;
    tbody.addEventListener('input', (ev) => {
      const i = ev.target.getAttribute('data-idx');
      const field = ev.target.getAttribute('data-type');
      if (i == null || !field) return;
      let val = ev.target.value;
      if (field === 'unitNet' || field === 'qty') {
        val = parseFloat(val) || 0;
        if (val < 0) {
          ev.target.value = 0;
          ev.target.classList.add('error');
          setTimeout(() => ev.target.classList.remove('error'), 1000);
          val = 0;
        }
      }
      if (field === 'vat') {
        val = parseFloat(val) || 0;
        if (![0, 8, 23].includes(val)) {
          ev.target.value = 23;
          ev.target.classList.add('error');
          setTimeout(() => ev.target.classList.remove('error'), 1000);
          val = 23;
        }
      }
      arr[i][field] = val;
      renderAll();
    });
    tbody.addEventListener('click', (ev) => {
      const del = ev.target.getAttribute('data-del');
      if (del == null) return;
      arr.splice(Number(del), 1);
      renderAll();
    });
  }

  function addRow(arr) {
    arr.push({ name: '', unit: 'szt.', unitNet: 0, qty: 1, vat: 23 });
    renderAll();
  }

  function seedFromCategory() {
    const cat = el('category')?.value;
    if (!cat) return;
    const factor = levelFactor();
    let tpl = (CATEGORIES[cat] || []).map(([name, unit, unitNet, qty, vat]) => ({
      name,
      unit,
      unitNet: Number((unitNet * factor).toFixed(2)),
      qty,
      vat
    }));

    // POPRAWKA: Ograniczenie liczby wierszy dla "Hydrauliki" do 11, jak na obrazku.
    if (cat === 'Hydraulika') {
        tpl = tpl.slice(0, 11);
    }
    
    state.services = tpl;
    state.materials = [];
    state.extras = [];
    renderAll();
  }

  function saveToHistory() {
    if (!state.result) return;
    const entry = {
      timestamp: new Date().toLocaleString('pl-PL'),
      category: el('category')?.value || 'Brak kategorii',
      result: { ...state.result },
      services: [...state.services],
      materials: [...state.materials],
      extras: [...state.extras]
    };
    state.history.unshift(entry);
    if (state.history.length > 5) state.history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(state.history));
    renderHistory();
  }

  function renderHistory() {
    const historyEl = el('history');
    if (!historyEl) return;
    historyEl.innerHTML = '';
    state.history.forEach((entry, idx) => {
      const div = document.createElement('div');
      div.className = 'history-entry';
      div.innerHTML = `
        <div><strong>Data:</strong> ${entry.timestamp}</div>
        <div><strong>Kategoria:</strong> ${entry.category}</div>
        <div><strong>Razem:</strong> ${fmt(entry.result.total)} PLN</div>
        <button type="button" class="btn" data-restore="${idx}" aria-label="Przywróć kalkulację ${idx + 1}">Przywróć</button>
      `;
      historyEl.appendChild(div);
    });
  }

  function restoreHistory(idx) {
    const entry = state.history[idx];
    if (!entry) return;
    state.services = [...entry.services];
    state.materials = [...entry.materials];
    state.extras = [...entry.extras];
    state.result = { ...entry.result };

    if (el('category')) el('category').value = entry.category;

    renderAll();

    // Ręczne odświeżenie wyników bez ponownego zapisywania do historii
    const resultsEl = el('results');
    if (resultsEl) resultsEl.classList.remove('hidden');
    if (el('costMaterials')) el('costMaterials').textContent = fmt(state.result.materials);
    if (el('costLabor')) el('costLabor').textContent = fmt(state.result.labor);
    if (el('costExtras')) el('costExtras').textContent = fmt(state.result.extras);
    if (el('costNet')) el('costNet').textContent = fmt(state.result.net);
    if (el('costTotal')) el('costTotal').textContent = fmt(state.result.total);
    renderComparisons();
  }

  function renderComparisons() {
    const tbody = el('compareTable')?.querySelector('tbody');
    if (!tbody || !state.result) return;
    tbody.innerHTML = '';
    state.comparisons.forEach((comp, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${comp.name}</td>
        <td>${fmt(state.result.total)}</td>
        <td>${fmt(comp.price)} <button type="button" class="del" data-del="${idx}" aria-label="Usuń porównanie ${comp.name}">×</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function calcAndRenderResults() {
    const totals = renderAll();
    const net = totals.s.sumNet + totals.m.sumNet + totals.e.sumNet;
    const total = totals.s.sumGross + totals.m.sumGross + totals.e.sumGross;
    state.result = { materials: totals.m.sumNet, labor: totals.s.sumNet, extras: totals.e.sumNet, net, total };
    const resultsEl = el('results');
    if (resultsEl) resultsEl.classList.remove('hidden');
    if (el('costMaterials')) el('costMaterials').textContent = fmt(state.result.materials);
    if (el('costLabor')) el('costLabor').textContent = fmt(state.result.labor);
    if (el('costExtras')) el('costExtras').textContent = fmt(state.result.extras);
    if (el('costNet')) el('costNet').textContent = fmt(state.result.net);
    if (el('costTotal')) el('costTotal').textContent = fmt(state.result.total);
    if (el('eta')) el('eta').textContent = '-';
    if (el('hourly')) el('hourly').textContent = '-';
    saveToHistory();
    renderComparisons();
  }

  function exportPDF() {
    if (!state.result) { 
      return alert('Najpierw oblicz koszt!');
    }
    if (!window.pdfMake) {
      return alert('Biblioteka pdfmake nie jest załadowana!');
    }

    const tableLayout = {
      fillColor: function (rowIndex, node, columnIndex) {
        return (rowIndex === 0) ? '#0f172a' : null;
      },
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => '#e2e8f0',
      vLineColor: () => '#e2e8f0',
    };

    const buildTable = (title, data) => {
      if (!data.length) return [];
      const header = [{ text: 'Nazwa', style: 'tableHeader' }, { text: 'J.m.', style: 'tableHeader' }, { text: 'Ilość', style: 'tableHeader' }, { text: 'Cena netto', style: 'tableHeader' }, { text: 'VAT', style: 'tableHeader' }, { text: 'Wartość brutto', style: 'tableHeader' }];
      const body = data.map(s => [s.name, s.unit, fmt(s.qty), `${fmt(s.unitNet)} zł`, `${s.vat}%`, { text: `${fmt(rowTotals(s).gross)} zł`, bold: true }]);
      return [
        { text: title, style: 'subheader', margin: [0, 15, 0, 5] },
        {
          layout: tableLayout,
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: [header, ...body]
          }
        }
      ];
    };

    const docDefinition = {
      content: [
        { text: 'Kalkulacja Kosztów', style: 'header', alignment: 'center' },
        { text: `Data: ${new Date().toLocaleDateString('pl-PL')}`, alignment: 'right', margin: [0, 2, 0, 20] },

        ...buildTable('Usługi', state.services),
        ...buildTable('Materiały', state.materials),
        ...buildTable('Koszty dodatkowe', state.extras),

        { text: `SUMA BRUTTO: ${fmt(state.result.total)} PLN`, style: 'total', alignment: 'right', margin: [0, 20, 0, 0] },
      ],
      footer: {
        text: 'Wygenerowano za pomocą KickMy.App Tools',
        alignment: 'center',
        fontSize: 8,
        color: '#64748b',
        margin: [0, 0, 0, 10]
      },
      styles: {
        header: { fontSize: 18, bold: true, color: '#0f172a' },
        subheader: { fontSize: 14, bold: true, color: '#0f172a' },
        tableHeader: { bold: true, fontSize: 10, color: 'white' },
        total: { fontSize: 14, bold: true, color: '#f97316' }
      },
      defaultStyle: {
        fontSize: 10,
        color: '#0f172a'
      }
    };

    pdfMake.createPdf(docDefinition).download('kalkulacja.pdf');
  }

  function sendEmail() {
    if (!state.result) return alert('Najpierw oblicz koszt!');
    const subject = 'Kalkulacja kosztów usług';
    let body = `Materiały: ${fmt(state.result.materials)} PLN\nRobocizna: ${fmt(state.result.labor)} PLN\nDodatkowe: ${fmt(state.result.extras)} PLN\n\nRAZEM: ${fmt(state.result.total)} PLN`;
    if (state.comparisons.length > 0) {
      body += '\n\nPorównanie ofert:\n' + state.comparisons.map(comp => `${comp.name}: ${fmt(comp.price)} PLN`).join('\n');
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function saveTemplate() {
    const data = JSON.stringify({ services: state.services, materials: state.materials, extras: state.extras });
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'szablon.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function loadTemplate() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          state.services = Array.isArray(data.services) ? data.services : [];
          state.materials = Array.isArray(data.materials) ? data.materials : [];
          state.extras = Array.isArray(data.extras) ? data.extras : [];
          renderAll();
        } catch (err) {
          alert('Błąd wczytywania szablonu: Nieprawidłowy format pliku.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function init() {
    // Load history from localStorage
    state.history = JSON.parse(localStorage.getItem('calcHistory') || '[]').slice(0, 5);
    renderHistory();

    const cat = el('category');
    if (cat) {
      cat.innerHTML = '<option value="">— wybierz kategorię —</option>' +
        Object.keys(CATEGORIES).map(k => `<option value="${k}">${k}</option>`).join('');
      cat.addEventListener('change', seedFromCategory);
    }
    if (el('priceLevel')) el('priceLevel').addEventListener('change', seedFromCategory);
    if (el('addServiceRow')) el('addServiceRow').addEventListener('click', () => addRow(state.services));
    if (el('addMaterialRow')) el('addMaterialRow').addEventListener('click', () => addRow(state.materials));
    if (el('addExtraRow')) el('addExtraRow').addEventListener('click', () => addRow(state.extras));
    if (el('clearServiceRows')) el('clearServiceRows').addEventListener('click', () => { state.services = []; renderAll(); });
    if (el('clearMaterialRows')) el('clearMaterialRows').addEventListener('click', () => { state.materials = []; renderAll(); });
    if (el('clearExtraRows')) el('clearExtraRows').addEventListener('click', () => { state.extras = []; renderAll(); });
    if (el('clearHistory')) el('clearHistory').addEventListener('click', () => {
      state.history = [];
      localStorage.removeItem('calcHistory');
      renderHistory();
    });
    if (el('calcBtn')) el('calcBtn').addEventListener('click', calcAndRenderResults);
    if (el('exportPDF')) el('exportPDF').addEventListener('click', exportPDF);
    if (el('sendEmail')) el('sendEmail').addEventListener('click', sendEmail);
    if (el('saveTemplate')) el('saveTemplate').addEventListener('click', saveTemplate);
    if (el('loadTemplate')) el('loadTemplate').addEventListener('click', loadTemplate);
    if (el('addCompare')) el('addCompare').addEventListener('click', () => {
      const name = el('competitorName')?.value.trim();
      const price = parseFloat(el('competitorPrice')?.value) || 0;
      if (!name || price <= 0) {
        alert('Podaj nazwę konkurencji i prawidłową cenę.');
        return;
      }
      state.comparisons.push({ name, price });
      el('competitorName').value = '';
      el('competitorPrice').value = '';
      renderComparisons();
    });
    if (el('compareTable')) el('compareTable').addEventListener('click', (ev) => {
      const del = ev.target.getAttribute('data-del');
      if (del == null) return;
      state.comparisons.splice(Number(del), 1);
      renderComparisons();
    });
    if (el('history')) el('history').addEventListener('click', (ev) => {
      const restore = ev.target.getAttribute('data-restore');
      if (restore == null) return;
      restoreHistory(Number(restore));
    });
    attachHandlers('servicesBody', state.services);
    attachHandlers('materialsBody', state.materials);
    attachHandlers('extrasBody', state.extras);
  }

  // Initialize
  init();
})();