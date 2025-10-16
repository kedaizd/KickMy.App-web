  // ===================== KONFIGURACJA I STAŁE =====================

  const FIELD_TYPES = {
    NUMBER: 'number',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    TEXT: 'text'
  };

  const COMMON_CLAUSES = {
    LIABILITY_LIMIT: { key: 'liability_limit', title: 'Limit odpowiedzialności', required: true, auto: true },
    PENALTIES: { key: 'penalties', title: 'Kary umowne', required: false },
    PAYMENTS_GENERAL: { key: 'payments_general', title: 'Płatności – ogólne', required: true, auto: true },
    EXCLUSIONS_GENERAL: { key: 'exclusions', title: 'Wyłączenia zakresu', required: true },
    TERMINATION: { key: 'termination', title: 'Rozwiązanie umowy', required: true },
    SLA_RESPONSE: { key: 'sla_response', title: 'SLA – czas reakcji', required: false },
    FORCE_MAJEURE: { key: 'force_majeure', title: 'Siła wyższa', required: true }
  };

  const INDUSTRY_CONFIG = {
    hydraulika: {
      requiredFields: [
        { id: 'hydro_response_hours', label: 'Czas reakcji awaryjnej (h)', type: FIELD_TYPES.NUMBER, min: 0.5, step: 0.5, required: true },
        { id: 'hydro_exclusions', label: 'Prace nieobjęte (np. kucie ścian)', type: FIELD_TYPES.TEXTAREA, required: true },
        { id: 'hydro_materials', label: 'Części i materiały — wycena osobno?', type: FIELD_TYPES.SELECT, options: ['tak', 'nie'], required: true },
        { id: 'hydro_warranty_m', label: 'Gwarancja (miesiące)', type: FIELD_TYPES.NUMBER, min: 0, step: 1, required: true }
      ],
      clauses: [
        { key: 'scope_general', title: 'Zakres usług – ogólne', required: true, auto: true },
        { ...COMMON_CLAUSES.SLA_RESPONSE, required: true, auto: true },
        { key: 'materials_billing', title: 'Materiały – rozliczanie', required: true, auto: true },
        { key: 'warranty_services', title: 'Gwarancja na usługę', required: false },
        { key: 'access_and_safety', title: 'Dostęp i BHP po stronie Klienta', required: true },
        { ...COMMON_CLAUSES.LIABILITY_LIMIT },
        { ...COMMON_CLAUSES.PENALTIES },
        { ...COMMON_CLAUSES.EXCLUSIONS_GENERAL, auto: true },
        { ...COMMON_CLAUSES.PAYMENTS_GENERAL },
        { ...COMMON_CLAUSES.TERMINATION }
      ]
    },
    elektryka: {
      requiredFields: [
        { id: 'elec_authorizations', label: 'Zakres uprawnień (np. SEP E/D)', type: FIELD_TYPES.TEXT, required: true },
        { id: 'elec_measurements', label: 'Protokoły pomiarów wymagane?', type: FIELD_TYPES.SELECT, options: ['tak', 'nie'], required: true },
        { id: 'elec_standard_excl', label: 'Wyłączenia (PN-HD 60364)', type: FIELD_TYPES.TEXTAREA, required: true },
        { id: 'elec_high_risk', label: 'Prace wysokiego ryzyka?', type: FIELD_TYPES.SELECT, options: ['tak', 'nie'], required: true }
      ],
      clauses: [
        { key: 'scope_electrical', title: 'Zakres – instalacje elektryczne', required: true, auto: true },
        { key: 'electrical_standards', title: 'Normy i standardy (PN-HD 60364)', required: true, auto: true },
        { key: 'measurements', title: 'Pomiary i protokoły', required: false },
        { key: 'work_safety', title: 'Bezpieczeństwo pracy / odłączenia', required: true },
        { ...COMMON_CLAUSES.SLA_RESPONSE },
        { ...COMMON_CLAUSES.LIABILITY_LIMIT },
        { ...COMMON_CLAUSES.PENALTIES },
        { ...COMMON_CLAUSES.EXCLUSIONS_GENERAL, auto: true, title: 'Wyłączenia zakresu (prace poza zleceniem)' },
        { ...COMMON_CLAUSES.PAYMENTS_GENERAL },
        { ...COMMON_CLAUSES.TERMINATION }
      ]
    },
    klimatyzacja: {
      requiredFields: [
        { id: 'ac_scope', label: 'Tryb: montaż/serwis', type: FIELD_TYPES.SELECT, options: ['montaż', 'serwis', 'montaż+serwis'], required: true },
        { id: 'ac_refrigerant', label: 'Czynnik chłodniczy (np. R32)', type: FIELD_TYPES.TEXT, required: true },
        { id: 'ac_warranty_equip_m', label: 'Gwarancja sprzętu (miesiące)', type: FIELD_TYPES.NUMBER, min: 0, step: 1, required: true },
        { id: 'ac_warranty_work_m', label: 'Gwarancja robocizny (miesiące)', type: FIELD_TYPES.NUMBER, min: 0, step: 1, required: true },
        { id: 'ac_service_freq', label: 'Serwis obowiązkowy (razy/rok)', type: FIELD_TYPES.NUMBER, min: 0, step: 1, required: true }
      ],
      clauses: [
        { key: 'scope_ac', title: 'Zakres – klimatyzacja (montaż/serwis)', required: true, auto: true },
        { key: 'f_gas', title: 'F-gaz – zgodność i obowiązki', required: true, auto: true },
        { key: 'warranty_split', title: 'Gwarancja: sprzÄ™t vs robocizna', required: true, auto: true },
        { key: 'service_schedule', title: 'Serwis okresowy (warunek gwarancji)', required: true, auto: true },
        { ...COMMON_CLAUSES.SLA_RESPONSE },
        { ...COMMON_CLAUSES.LIABILITY_LIMIT },
        { ...COMMON_CLAUSES.PENALTIES },
        { ...COMMON_CLAUSES.EXCLUSIONS_GENERAL, title: 'Wyłączenia (np. instalacja niestandardowa)' },
        { ...COMMON_CLAUSES.PAYMENTS_GENERAL },
        { ...COMMON_CLAUSES.TERMINATION }
      ]
    },
    remonty: {
      requiredFields: [
        { id: 'ren_partial_accept', label: 'Odbiory częściowe?', type: FIELD_TYPES.SELECT, options: ['tak', 'nie'], required: true },
        { id: 'ren_schedule', label: 'Harmonogram (kamienie milowe)', type: FIELD_TYPES.TEXTAREA, required: true },
        { id: 'ren_retention_pct', label: 'Kaucja gwarancyjna (%)', type: FIELD_TYPES.NUMBER, min: 0, max: 20, step: 1, required: true },
        { id: 'ren_warranty_m', label: 'Rękojmia/Gwarancja (miesiące)', type: FIELD_TYPES.NUMBER, min: 0, step: 1, required: true },
        { id: 'ren_bhp_waste', label: 'BHP i utylizacja odpadów – po czyjej stronie?', type: FIELD_TYPES.TEXT, required: true }
      ],
      clauses: [
        { key: 'scope_renovation', title: 'Zakres – prace remontowe', required: true, auto: true },
        { key: 'milestones', title: 'Harmonogram i odbiory', required: true, auto: true },
        { key: 'retention', title: 'Kaucja gwarancyjna', required: true, auto: true },
        { key: 'extended_warranty', title: 'Rozszerzona rękojmia/Gwarancja', required: true, auto: true },
        { key: 'bhp_waste', title: 'BHP i gospodarka odpadami', required: true, auto: true },
        { ...COMMON_CLAUSES.LIABILITY_LIMIT },
        { ...COMMON_CLAUSES.PENALTIES },
        { ...COMMON_CLAUSES.EXCLUSIONS_GENERAL, title: 'Wyłączenia (prace poza zakresem)' },
        { ...COMMON_CLAUSES.PAYMENTS_GENERAL },
        { ...COMMON_CLAUSES.TERMINATION }
      ]
    },
    eventy: {
      requiredFields: [
        { id: 'ev_acoustics', label: 'Akustyka i hałas – ograniczenia/poziomy', type: FIELD_TYPES.TEXT, required: true },
        { id: 'ev_travel', label: 'Dojazd/transport – zasady i koszty', type: FIELD_TYPES.TEXT, required: true },
        { id: 'ev_night_hours', label: 'Godziny nocne (dopłata %)', type: FIELD_TYPES.NUMBER, min: 0, max: 100, step: 1, required: true },
        { id: 'ev_media_rights', label: 'Prawo do rejestracji wideo/foto', type: FIELD_TYPES.SELECT, options: ['tak', 'nie', 'za zgodą'], required: true },
        { id: 'ev_deposits', label: 'Rezerwacje i zaliczki – zasady', type: FIELD_TYPES.TEXTAREA, required: true }
      ],
      clauses: [
        { key: 'scope_event', title: 'Zakres – obsługa wydarzeń', required: true, auto: true },
        { key: 'media_rights', title: 'Prawa do rejestracji i wykorzystania materiałów', required: true, auto: true },
        { key: 'night_hours_fee', title: 'Godziny nocne – dopłata', required: true, auto: true },
        { key: 'travel_costs', title: 'Dojazd/transport', required: true, auto: true },
        { key: 'cancellation', title: 'Polityka anulacji/rezerwacji', required: true, auto: true },
        { ...COMMON_CLAUSES.FORCE_MAJEURE },
        { ...COMMON_CLAUSES.LIABILITY_LIMIT },
        { ...COMMON_CLAUSES.PENALTIES },
        { ...COMMON_CLAUSES.PAYMENTS_GENERAL },
        { ...COMMON_CLAUSES.TERMINATION }
      ]
    },
    ogrody: {
      requiredFields: [
        { id: 'gr_season_scope', label: 'Sezonowość (zakres usług w sezonach)', type: FIELD_TYPES.TEXTAREA, required: true },
        { id: 'gr_watering', label: 'Podlewanie: klient czy wykonawca?', type: FIELD_TYPES.TEXT, required: true },
        { id: 'gr_waste', label: 'Utylizacja bioodpadów – zasady/koszty', type: FIELD_TYPES.TEXT, required: true },
        { id: 'gr_force_majeure', label: 'Szkody pogodowe (force majeure) – zapisy', type: FIELD_TYPES.TEXT, required: true }
      ],
      clauses: [
        { key: 'scope_garden', title: 'Zakres – pielęgnacja ogrodów', required: true, auto: true },
        { key: 'seasonality', title: 'Sezonowość usług', required: true, auto: true },
        { key: 'watering', title: 'Podlewanie i dostęp do wody', required: true, auto: true },
        { key: 'waste_disposal', title: 'Utylizacja bioodpadów', required: true, auto: true },
        { ...COMMON_CLAUSES.FORCE_MAJEURE, auto: true },
        { ...COMMON_CLAUSES.LIABILITY_LIMIT },
        { ...COMMON_CLAUSES.PENALTIES },
        { ...COMMON_CLAUSES.EXCLUSIONS_GENERAL },
        { ...COMMON_CLAUSES.PAYMENTS_GENERAL },
        { ...COMMON_CLAUSES.TERMINATION }
      ]
    }
  };

// ===================== SZABLONY KLAUZUL =====================

// Uwaga: Ta wczesna wersja szablonów została zachowana wyłącznie
// pod inną nazwą, aby uniknąć kolizji nazw. Faktycznie używane
// szablony znajdują się w nowszym bloku poniżej oraz w funkcji
// getClauseTemplate().
const CLAUSE_TEMPLATES_OLD = {
  // --- Ogólne ---
  liability_limit: ({ liabCapPct }) =>
    `Limit odpowiedzialności Wykonawcy ogranicza się do ${liabCapPct || 100}% wartości wynagrodzenia umownego, z wyłączeniem szkód wyrządzonych umyślnie lub rażącego niedbalstwa.`,

  penalties: ({ penaltiesEnabled, penaltyCapPct }) =>
    penaltiesEnabled
      ? `Łączny limit kar umownych wynosi ${penaltyCapPct || 10}% wynagrodzenia. Naliczanie kar nie wyłącza prawa do odszkodowania uzupełniającego w granicach ogólnych przepisów.`
      : `Strony wyłączają stosowanie kar umownych.`,

  exclusions: () =>
    `Wyłączenia obejmują czynności nieujęte w Zakresie usług, prace dodatkowe wymagające odrębnej wyceny oraz czynności, do których nie zapewniono odpowiednich warunków technicznych.`,

  payments_general: ({ payment, deposit }) =>
    `Płatności realizowane są zgodnie z ustalonymi warunkami: ${escapeHtml(payment || 'nie określono')}. Zaliczka: ${escapeHtml(deposit || 'brak')}.`,

  termination: () =>
    `Każda ze Stron może rozwiązać umowę z ważnych powodów z zachowaniem 14-dniowego okresu wypowiedzenia. Rozliczenie nastąpi proporcjonalnie do wykonanych prac.`,

  force_majeure: () =>
    `Strony nie ponoszą odpowiedzialności za niewykonanie lub nienależyte wykonanie umowy, jeśli było ono spowodowane działaniem siły wyższej (np. klęski żywiołowe, wojna, decyzje władz).`,

  // --- Hydraulika ---
  scope_general: ({ scope }) =>
    `Zakres usług hydraulicznych obejmuje: ${escapeHtml(scope)}.`,
  sla_response: ({ industryInputs }) =>
    `Czas reakcji na zgłoszenie awaryjne: ${escapeHtml(industryInputs.hydro_response_hours || 'nie określono')} godz.`,
  materials_billing: ({ industryInputs }) =>
    industryInputs.hydro_materials === 'tak'
      ? `Części i materiały rozliczane są osobno na podstawie faktycznego zużycia.`
      : `Części i materiały wliczone są w wynagrodzenie ryczałtowe.`,
  warranty_services: ({ industryInputs }) =>
    `Gwarancja na usługę: ${escapeHtml(industryInputs.hydro_warranty_m || '0')} miesięcy.`,
  access_and_safety: () =>
    `Klient zapewni dostęp do instalacji oraz warunki BHP zgodnie z obowiązującymi przepisami.`,

  // --- Elektryka ---
  scope_electrical: ({ scope }) =>
    `Zakres prac elektrycznych obejmuje: ${escapeHtml(scope)}.`,
  electrical_standards: ({ industryInputs }) =>
    `Prace prowadzone będą zgodnie z normami PN-HD 60364. Wyłączenia: ${escapeHtml(industryInputs.elec_standard_excl || 'nie podano')}.`,
  measurements: ({ industryInputs }) =>
    industryInputs.elec_measurements === 'tak'
      ? `Po zakończeniu prac zostaną wykonane pomiary i sporządzone protokoły.`
      : `Protokoły pomiarów nie są wymagane.`,
  work_safety: ({ industryInputs }) =>
    `W przypadku prac wysokiego ryzyka: ${escapeHtml(industryInputs.elec_high_risk || 'nie dotyczy')}. Uprawnienia: ${escapeHtml(industryInputs.elec_authorizations || 'nie podano')}.`,

  // --- Klimatyzacja ---
  scope_ac: ({ industryInputs }) =>
    `Tryb realizacji: ${escapeHtml(industryInputs.ac_scope || 'nie określono')}.`,
  f_gas: ({ industryInputs }) =>
    `Prace będą realizowane zgodnie z przepisami F-gas. Czynnik chłodniczy: ${escapeHtml(industryInputs.ac_refrigerant || 'nie określono')}.`,
  warranty_split: ({ industryInputs }) =>
    `Gwarancja sprzętu: ${escapeHtml(industryInputs.ac_warranty_equip_m || '0')} mies.; robocizny: ${escapeHtml(industryInputs.ac_warranty_work_m || '0')} mies.`,
  service_schedule: ({ industryInputs }) =>
    `Serwis okresowy: ${escapeHtml(industryInputs.ac_service_freq || '0')} raz(y) w roku.`,

  // --- Remonty ---
  scope_renovation: ({ scope }) =>
    `Zakres prac remontowych: ${escapeHtml(scope)}.`,
  milestones: ({ industryInputs, schedule }) =>
    `Realizacja zgodnie z harmonogramem: ${escapeHtml(industryInputs.ren_schedule || schedule || 'nie określono')}. Odbiory częściowe: ${escapeHtml(industryInputs.ren_partial_accept || 'nie określono')}.`,
  retention: ({ industryInputs }) =>
    `Kaucja gwarancyjna: ${escapeHtml(industryInputs.ren_retention_pct || '0')}% wartości wynagrodzenia.`,
  extended_warranty: ({ industryInputs }) =>
    `Rękojmia/Gwarancja: ${escapeHtml(industryInputs.ren_warranty_m || '0')} miesięcy.`,
  bhp_waste: ({ industryInputs }) =>
    `BHP i utylizacja odpadów: ${escapeHtml(industryInputs.ren_bhp_waste || 'po stronie Klienta')}.`,

  // --- Eventy ---
  scope_event: ({ scope }) =>
    `Zakres obsługi wydarzenia: ${escapeHtml(scope)}.`,
  media_rights: ({ industryInputs }) =>
    `Rejestracja materiałów: ${escapeHtml(industryInputs.ev_media_rights || 'za zgodą')}.`,
  night_hours_fee: ({ industryInputs }) =>
    `Godziny nocne: dopłata ${escapeHtml(industryInputs.ev_night_hours || '0')}%.`,
  travel_costs: ({ industryInputs }) =>
    `Dojazd i transport: ${escapeHtml(industryInputs.ev_travel || 'wg ustaleń')}.`,
  cancellation: ({ industryInputs }) =>
    `Zasady rezerwacji i zaliczek: ${escapeHtml(industryInputs.ev_deposits || 'wg ustaleń')}.`,

  // --- Ogrody ---
  scope_garden: ({ scope }) =>
    `Zakres pielęgnacji ogrodu: ${escapeHtml(scope)}.`,
  seasonality: ({ industryInputs }) =>
    `Sezonowość usług: ${escapeHtml(industryInputs.gr_season_scope || 'wg ustaleń')}.`,
  watering: ({ industryInputs }) =>
    `Podlewanie: ${escapeHtml(industryInputs.gr_watering || 'po stronie Klienta')}.`,
  waste_disposal: ({ industryInputs }) =>
    `Utylizacja bioodpadów: ${escapeHtml(industryInputs.gr_waste || 'wg ustaleń')}.`
};

// ===================== BUDOWANIE HTML =====================

function compileClausesHtml(agreement) {
  const { industry, selectedClauses } = agreement;
  const cfg = INDUSTRY_CONFIG[industry];
  if (!cfg) return '';

  const clausesText = cfg.clauses
    .filter(clause => selectedClauses[clause.key])
    .map(clause => {
      const templateContent = getClauseTemplate(clause.key, agreement);
      return `<h3>${escapeHtml(clause.title)}</h3><p>${templateContent}</p>`;
    })
    .join('');

  const industryFieldsText = cfg.requiredFields
    .map(field => {
      const value = agreement.industryInputs[field.id];
      if (value !== undefined && value !== '' && value !== null) {
        return `<p><strong>${escapeHtml(field.label)}:</strong> ${escapeHtml(String(value))}</p>`;
      }
      return '';
    })
    .filter(Boolean)
    .join('');

  return `
    <div class="industry-fields">${industryFieldsText}</div>
    <div class="clauses">${clausesText}</div>
  `;
}
  
// Prosty system tłumaczeń
const translations = {
  pl: {
    industryRequired: 'Wybierz branżę.',
    fieldRequired: 'Pole „{label}” jest wymagane.',
    priceNegative: 'Cena nie może być ujemna.',
    liabCapInvalid: 'Limit odpowiedzialności musi być >= 0%.',
    penaltyCapInvalid: 'Limit kar musi być w zakresie 0–100%.',
    numberInvalid: 'Pole „{label}” musi być liczbą.',
    minInvalid: 'Pole „{label}” nie może być < {min}.',
    maxInvalid: 'Pole „{label}” nie może być > {max}.',
    copyFailed: 'Nie udało się skopiować tekstu. Spróbuj ponownie.'
  }
};

// Nadpisania wybranych komunikatów (poprawne UTF-8)
const TRANSLATIONS_OVERRIDE = {
  pl: {
    industryRequired: 'Wybierz branżę.',
    fieldRequired: 'Pole „{label}” jest wymagane.',
    priceNegative: 'Cena nie może być ujemna.',
    liabCapInvalid: 'Limit odpowiedzialności musi być ≥ 0%.',
    penaltyCapInvalid: 'Limit kar musi być w zakresie 0–100%.',
    numberInvalid: 'Pole „{label}” musi być liczbą.',
    minInvalid: 'Pole „{label}” nie może być < {min}.',
    maxInvalid: 'Pole „{label}” nie może być > {max}.',
    copyFailed: 'Nie udało się skopiować tekstu. Spróbuj ponownie.'
  }
};

// ===================== ELEMENTY DOM =====================
const formElements = Object.fromEntries(
  [
    'industry',
    'provider', 'provider-address', // Ukryte pola
    'client-name', 'client-address',
    'date', 'place',
    'scope', 'schedule', 'location', 'price', 'deposit', 'payment',
    'warranty', 'notes', 'penalties-enabled'
  ].map(id => [id.replace(/-(\w)/g, (_m, p1) => p1.toUpperCase()), document.getElementById(id)])
);

const reqFieldsHost = document.getElementById('industry-required-fields');
const clausesPanel = document.getElementById('clauses-panel');
const errorMessages = document.getElementById('error-messages');
const generateBtn = document.getElementById('generate');
const preview = document.getElementById('preview-content');
const copyBtn = document.getElementById('copy-text');
  const pdfBtn = document.getElementById('download-pdf');
const applyCompanyBtn = document.getElementById('apply-company');

let currentAgreement = null;
let currentClausesState = {};
let currentIndustryFieldElements = {};

// ===================== UTILS =====================
function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function displayErrors(errors = []) {
  errorMessages.innerHTML = '';
  if (errors.length === 0) {
    errorMessages.style.display = 'none';
    return;
  }
  const ul = document.createElement('ul');
  errors.forEach(err => {
    const li = document.createElement('li');
    li.textContent = err.message;
    ul.appendChild(li);
  });
  errorMessages.appendChild(ul);
  errorMessages.style.display = 'block';
}

function clearErrors() {
  displayErrors([]);
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function t(key, params = {}) {
  let text = (TRANSLATIONS_OVERRIDE.pl?.[key] ?? translations.pl[key]) || key;
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  return text;
}

function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

// ===================== RENDEROWANIE FORMULARZA =====================

function createFieldWrapper(field) {
  const wrap = document.createElement('label');
  wrap.classList.add('form-label-wrapper');
  wrap.textContent = field.label;
  return wrap;
}

function createInputElement(field) {
  const input = document.createElement('input');
  input.type = field.type || FIELD_TYPES.TEXT;
  if (field.min != null) input.min = field.min;
  if (field.max != null) input.max = field.max;
  if (field.step != null) input.step = field.step;
  return input;
}

function createTextareaElement() {
  const textarea = document.createElement('textarea');
  textarea.rows = 2;
  return textarea;
}

function createSelectElement(field) {
  const select = document.createElement('select');
  const defaultOption = new Option('— wybierz —', '');
  select.add(defaultOption);
  (field.options || []).forEach(o => select.add(new Option(o, o)));
  return select;
}

const inputCreators = {
  [FIELD_TYPES.TEXT]: createInputElement,
  [FIELD_TYPES.NUMBER]: createInputElement,
  [FIELD_TYPES.TEXTAREA]: createTextareaElement,
  [FIELD_TYPES.SELECT]: createSelectElement
};

function renderIndustryFields(slug) {
  reqFieldsHost.innerHTML = '';
  clausesPanel.innerHTML = '';
  currentClausesState = {};
  currentIndustryFieldElements = {};

  if (!slug || !INDUSTRY_CONFIG[slug]) return;

  const cfg = INDUSTRY_CONFIG[slug];
  const fieldsFragment = document.createDocumentFragment();
  const clausesFragment = document.createDocumentFragment();

  // Pola wymagane
  cfg.requiredFields.forEach(field => {
    const wrap = createFieldWrapper(field);
    const creator = inputCreators[field.type] || createInputElement;
    const input = creator(field);
    input.id = field.id;
    input.classList.add('dynamic-field');
    if (field.required) input.required = true;
    currentIndustryFieldElements[field.id] = input;
    wrap.appendChild(input);
    fieldsFragment.appendChild(wrap);
  });
  reqFieldsHost.appendChild(fieldsFragment);

  // Klauzule
  cfg.clauses.forEach(c => {
    const row = document.createElement('div');
    row.classList.add('clause-row');
    const cb = document.createElement('input');
    const label = document.createElement('label');

    cb.type = 'checkbox';
    cb.id = `clause-${c.key}`;
    cb.checked = !!c.required || !!c.auto;
    cb.disabled = !!c.required || !!c.auto;
    currentClausesState[c.key] = cb.checked;
    cb.addEventListener('change', () => (currentClausesState[c.key] = cb.checked));

    label.htmlFor = cb.id;
    label.textContent = `${c.title}${c.required ? ' (wymagane)' : c.auto ? ' (auto)' : ''}`;

    row.append(cb, label);
    clausesFragment.appendChild(row);
  });
  clausesPanel.appendChild(clausesFragment);
}

// ===================== WALIDACJA =====================

function validateGeneralFields(_formElements, data, errors) {
  const requiredGeneralFields = {
    'client-name': 'Nazwa klienta',
    scope: 'Opis przedmiotu umowy',
    place: 'Miejsce zawarcia umowy'
  };

  Object.entries(requiredGeneralFields).forEach(([key, label]) => {
    const el = document.getElementById(key);
    const value = el ? el.value.trim() : '';
    if (!value) {
      const labelText = el?.closest('label')?.textContent?.trim().replace(':', '') || label;
      errors.push({ fieldId: el?.id || key, message: t('fieldRequired', { label: labelText }) });
    }
    data[key] = value;
  });
}

function validateIndustryFields(industryCfg, errors, industryInputs) {
  if (!industryCfg) return;

  industryCfg.requiredFields.forEach(f => {
    const el = currentIndustryFieldElements[f.id];
    if (!el) return;

    let val = el.value?.trim?.() ?? el.value;

    if (f.required && (val === '' || val == null)) {
      errors.push({ fieldId: f.id, message: t('fieldRequired', { label: f.label }) });
      return;
    }

    if (f.type === FIELD_TYPES.NUMBER && val !== '') {
      const num = Number(val);
      if (Number.isNaN(num)) {
        errors.push({ fieldId: f.id, message: t('numberInvalid', { label: f.label }) });
      } else {
        if (f.min != null && num < f.min) errors.push({ fieldId: f.id, message: t('minInvalid', { label: f.label, min: f.min }) });
        if (f.max != null && num > f.max) errors.push({ fieldId: f.id, message: t('maxInvalid', { label: f.label, max: f.max }) });
        val = num;
      }
    } else if (f.type === FIELD_TYPES.NUMBER && val === '') {
      val = null;
    }

    industryInputs[f.id] = val;
  });
}

function validateAndGetFormData() {
  clearErrors();
  const errors = [];
  const data = {};
  const industry = formElements.industry?.value;

  if (!industry) {
    errors.push({ fieldId: 'industry', message: t('industryRequired') });
  }

  validateGeneralFields(formElements, data, errors);

  // Dane specyficzne dla branży
  data.industry = industry;
  data.industryInputs = {};
  validateIndustryFields(INDUSTRY_CONFIG[industry], errors, data.industryInputs);
  if (errors.length > 0) {
    displayErrors(errors);
    errors.forEach(err => {
      const el = document.getElementById(err.fieldId);
      if (el) el.classList.add('error');
    });
    return null;
  }

  // Kompletne dane umowy
  const parsedDate = formElements.date?.value ? new Date(formElements.date.value) : new Date();
  const issuedAt = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  return {
    ...data,
    provider: formElements.provider?.value?.trim() || '',
    providerAddress: formElements.providerAddress?.value?.trim() || '',
    clientName: formElements.clientName?.value?.trim() || '',
    clientAddress: formElements.clientAddress?.value?.trim() || '',
    clientNip: formElements.clientNip?.value?.trim() || '',
    place: formElements.place?.value?.trim() || '',
    scope: formElements.scope?.value?.trim() || '',
    schedule: formElements.schedule?.value?.trim() || '',
    location: formElements.location?.value?.trim() || '',
    deposit: formElements.deposit?.value?.trim() || '',
    payment: formElements.payment?.value?.trim() || '',
    warranty: formElements.warranty?.value?.trim() || '',
    notes: formElements.notes?.value?.trim() || '',
    penaltiesEnabled: (formElements.penaltiesEnabled?.value || 'no') === 'yes',
    selectedClauses: { ...currentClausesState },
    issuedAt
  };
}

function generateAgreement() {
  const data = validateAndGetFormData();
  if (!data) return;
  currentAgreement = data;
  renderAgreement(currentAgreement);
}

// ===================== TEMPLATY KLAUZUL =====================

const CLAUSE_TEMPLATES = {
  liability_limit: ({ liabCapPct = 100 }) =>
    `Limit odpowiedzialności Wykonawcy ogranicza się do ${liabCapPct}% wartości wynagrodzenia umownego, z wyłączeniem szkód wyrządzonych umyślnie.`,

  penalties: ({ penaltiesEnabled = false, penaltyCapPct = 10 }) =>
    penaltiesEnabled
      ? `Łączny limit kar umownych wynosi ${penaltyCapPct}% wynagrodzenia. Naliczanie kar nie wyłącza prawa do odszkodowania uzupełniającego w granicach ogólnych przepisów.`
      : `Strony wyłączają kary umowne.`,

  exclusions: () =>
    `Wyłączenia obejmują czynności nieujęte w Zakresie usług, prace dodatkowe wymagające odrębnej wyceny oraz czynności, do których nie zapewniono warunków technicznych.`,

  payments_general: ({ payment, deposit }) =>
    `Płatności realizowane są zgodnie z uzgodnionymi warunkami: ${escapeHtml(payment || 'nie określono')}. Zaliczka: ${escapeHtml(deposit || 'brak')}.`,

  termination: () =>
    `Każda ze Stron może rozwiązać umowę z ważnych powodów z zachowaniem 14-dniowego okresu wypowiedzenia; rozliczenie nastąpi proporcjonalnie do prac wykonanych.`,

  force_majeure: () =>
    `Strony nie ponoszą odpowiedzialności za niewykonanie lub nienależyte wykonanie umowy spowodowane działaniem siły wyższej (m.in. klęski żywiołowe, wojna, działania władz).`,

  // Hydraulika
  scope_general: ({ scope }) =>
    `Zakres usług obejmuje czynności opisane w sekcji „Zakres usług”: ${escapeHtml(scope)}.`,

  sla_response: ({ industry, industryInputs }) =>
    industry === 'hydraulika'
      ? `Czas reakcji na zgłoszenie awaryjne: ${escapeHtml(String(industryInputs.hydro_response_hours ?? 'nie określono'))} godz.`
      : `Czas reakcji na zgłoszenie serwisowe: ${escapeHtml(String(industryInputs.sla_response ?? 'nie określono'))}.`,

  materials_billing: ({ industryInputs }) =>
    industryInputs.hydro_materials === 'tak'
      ? `Części i materiały rozliczane są osobno na podstawie faktycznego zużycia; cennik dostawców jest udostępniany na żądanie.`
      : `Części i materiały wliczone są w wynagrodzenie ryczałtowe, o ile uzgodniono inaczej.`,

  warranty_services: ({ industryInputs }) =>
    `Gwarancja na usługę: ${escapeHtml(String(industryInputs.hydro_warranty_m ?? '0'))} mies. od odbioru.`,

  access_and_safety: () =>
    `Klient zapewni dostęp do instalacji (w tym zamknięć głównych) oraz bezpieczne warunki pracy zgodnie z przepisami BHP.`,

  // Elektryka
  scope_electrical: ({ scope }) =>
    `Zakres prac elektrycznych wynika z sekcji „Zakres usług”: ${escapeHtml(scope)}.`,

  electrical_standards: ({ industryInputs }) =>
    `Prace będą wykonywane zgodnie z właściwymi normami, w szczególności PN-HD 60364. Wyłączenia: ${escapeHtml(industryInputs.elec_standard_excl || 'brak doprecyzowania')}.`,

  measurements: ({ industryInputs }) =>
    industryInputs.elec_measurements === 'tak'
      ? `Po zakończeniu prac zostaną wykonane pomiary i sporządzone protokoły zgodnie z normami.`
      : `Protokoły pomiarów nie są wymagane przez Zleceniodawcę.`,

  work_safety: ({ industryInputs }) =>
    `W przypadku prac wysokiego ryzyka (${escapeHtml(industryInputs.elec_high_risk || 'nie dotyczy')}) Strony uzgodnią plan odłączeń i dozoru uprawnień (np. SEP E/D: ${escapeHtml(industryInputs.elec_authorizations || 'nie podano')}).`,

  // Klimatyzacja
  scope_ac: ({ industryInputs }) =>
    `Tryb realizacji: ${escapeHtml(industryInputs.ac_scope || 'nie określono')} (instalacja/serwis).`,

  f_gas: ({ industryInputs }) =>
    `Prace będą realizowane zgodnie z przepisami F-gas. Czynnik chłodniczy: ${escapeHtml(industryInputs.ac_refrigerant || 'nie określono')}.`,

  warranty_split: ({ industryInputs }) =>
    `Gwarancja sprzętu: ${escapeHtml(String(industryInputs.ac_warranty_equip_m || '0'))} mies.; Gwarancja robocizny: ${escapeHtml(String(industryInputs.ac_warranty_work_m || '0'))} mies.`,

  service_schedule: ({ industryInputs }) =>
    `Warunkiem utrzymania gwarancji jest serwis okresowy – ${escapeHtml(String(industryInputs.ac_service_freq || '0'))} raz(y) w roku.`,

  // Remonty
  scope_renovation: ({ scope }) =>
    `Zakres prac remontowych: ${escapeHtml(scope)}.`,

  milestones: ({ industryInputs, schedule }) =>
    `Realizacja wg harmonogramu (kamienie milowe): ${escapeHtml(industryInputs.ren_schedule || schedule || 'nie określono')}. Odbiory częściowe: ${escapeHtml(industryInputs.ren_partial_accept || 'nie określono')}.`,

  retention: ({ industryInputs }) =>
    `Kaucja gwarancyjna: ${escapeHtml(String(industryInputs.ren_retention_pct || '0'))}% wartości wynagrodzenia, zwrot po upływie okresu rękojmi/gwarancji.`,

  extended_warranty: ({ industryInputs }) =>
    `Rękojmia/Gwarancja: ${escapeHtml(String(industryInputs.ren_warranty_m || '0'))} mies.; możliwe przedłużenie na warunkach dodatkowych.`,

  bhp_waste: ({ industryInputs }) =>
    `BHP i gospodarka odpadami: ${escapeHtml(industryInputs.ren_bhp_waste || 'po stronie Klienta, o ile nie uzgodniono inaczej')}.`,

  // Eventy
  scope_event: ({ scope }) =>
    `Obsługa wydarzenia zgodnie z zakresem: ${escapeHtml(scope)}.`,

  media_rights: ({ industryInputs }) =>
    `Rejestracja wideo/foto: ${escapeHtml(industryInputs.ev_media_rights || 'za zgodą')}; pola eksploatacji ustalane osobno.`,

  night_hours_fee: ({ industryInputs }) =>
    `Godziny nocne: dopłata ${escapeHtml(String(industryInputs.ev_night_hours || '0'))}% do stawek.`,

  travel_costs: ({ industryInputs }) =>
    `Dojazd/transport: ${escapeHtml(industryInputs.ev_travel || 'wg stawek wykonawcy lub rzeczywistych kosztów')}.`,

  cancellation: ({ industryInputs }) =>
    `Rezerwacje i zaliczki: ${escapeHtml(industryInputs.ev_deposits || 'wg zasad ustalonych w korespondencji')}.`,

  // Ogrody
  scope_garden: ({ scope }) =>
    `Pielęgnacja ogrodu zgodnie z zakresem: ${escapeHtml(scope)}.`,

  seasonality: ({ industryInputs }) =>
    `Sezonowość usług: ${escapeHtml(industryInputs.gr_season_scope || 'wg ustaleń')}.`,

  watering: ({ industryInputs }) =>
    `Podlewanie: ${escapeHtml(industryInputs.gr_watering || 'po stronie Klienta, chyba że uzgodniono inaczej')}.`,

  waste_disposal: ({ industryInputs }) =>
    `Utylizacja bioodpadów: ${escapeHtml(industryInputs.gr_waste || 'wg stawek wykonawcy / gminnych')}.`
};

function getClauseTemplate(clauseKey, agreement) {
  const fn = CLAUSE_TEMPLATES[clauseKey];
  if (typeof fn === 'function') return fn(agreement);
  return `Brak szablonu dla klauzuli ${escapeHtml(clauseKey)}.`;
}

// ===================== GENEROWANIE I RENDEROWANIE =====================

function compileClausesText(agreement) {
  const { industry, selectedClauses } = agreement;
  const cfg = INDUSTRY_CONFIG[industry];
  if (!cfg) return '';

  const clausesText = cfg.clauses
    .filter(clause => selectedClauses[clause.key])
    .map(clause => {
      const templateContent = getClauseTemplate(clause.key, agreement);
      return `<h3>${escapeHtml(clause.title)}</h3><p>${templateContent}</p>`;
    })
    .join('');

  const industryFieldsText = cfg.requiredFields
    .map(field => {
      const value = agreement.industryInputs[field.id];
      if (value !== undefined && value !== '' && value !== null) {
        return `<p><strong>${escapeHtml(field.label)}:</strong> ${escapeHtml(String(value))}</p>`;
      }
      return '';
    })
    .filter(Boolean)
    .join('');

  return `
    <div class="industry-fields">${industryFieldsText}</div>
    <div class="clauses">${clausesText}</div>
  `;
}

function renderAgreement(data) {
  const { provider, providerAddress, clientName, clientAddress, scope, schedule, location, price, deposit, warranty, notes, issuedAt } = data;

  const formattedDate = issuedAt.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const header = `
    <h1>UMOWA O ŚWIADCZENIE USŁUG</h1>
    <p>Zawarta w dniu ${formattedDate}${data.place ? ` w ${escapeHtml(data.place)}` : ''} pomiędzy:</p>
    <p><strong>Wykonawca:</strong> ${escapeHtml(provider || 'Brak danych')} (${escapeHtml(providerAddress || 'Brak danych')})</p>
      <p><strong>Zleceniodawca:</strong> ${escapeHtml(data.clientName || data.client || 'Brak danych')} (${escapeHtml(data.clientAddress || 'Brak danych')})</p>
  `;

  const priceDisplay = typeof price === 'number' && price !== null ? `${price} PLN` : escapeHtml(String(price || 'nie określono'));

  const details = `
    <h2>Szczegóły umowy</h2>
    <p><strong>Zakres usług:</strong> ${escapeHtml(scope)}</p>
    <p><strong>Harmonogram:</strong> ${escapeHtml(schedule || 'nie określono')}</p>
    <p><strong>Lokalizacja:</strong> ${escapeHtml(location || 'nie określono')}</p>
    <p><strong>Cena:</strong> ${priceDisplay}</p>
    <p><strong>Zaliczka:</strong> ${escapeHtml(deposit || 'brak')}</p>
    <p><strong>Warunki płatności:</strong> ${escapeHtml(data.payment || 'nie określono')}</p>
    <p><strong>Gwarancja:</strong> ${escapeHtml(warranty || 'nie określono')}</p>
    ${notes ? `<p><strong>Uwagi:</strong> ${escapeHtml(notes)}</p>` : ''}
  `;

  const clauses = compileClausesText(data);

  const host = document.getElementById('preview-content') || preview;
  host.innerHTML = `
    <div class="agreement">
      ${header}
      ${details}
      <h2>Warunki szczegółowe i klauzule</h2>
      ${clauses}
      <hr>
      <p>Podpisy Stron:</p>
      <p style="margin-top: 50px;">_________________________ (Wykonawca) &nbsp;&nbsp;&nbsp;&nbsp; _________________________ (Zleceniodawca)</p>
    </div>
  `;

  if (copyBtn) copyBtn.disabled = false;
  if (pdfBtn) pdfBtn.disabled = false;
}

function agreementToPlainText(agreement) {
  const {
    provider,
    providerAddress,
    clientName,
    clientAddress,
    scope,
    schedule,
    location,
    price,
    deposit,
    warranty,
    notes,
    issuedAt,
    place,
    industry,
    industryInputs,
    payment
  } = agreement;

  const cfg = INDUSTRY_CONFIG[industry];

  const formattedDate = issuedAt.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const priceDisplay = typeof price === 'number' && price !== null ? `${price} PLN` : String(price || 'nie określono');

  let text = `UMOWA O ŚWIADCZENIE USŁUG\n\n`;
  text += `Zawarta w dniu ${formattedDate} w ${place || '... (miejsce zawarcia umowy)'} pomiędzy:\n\n`;
  text += `1. WYKONAWCA: ${provider}\nadres: ${providerAddress}\n\n`;
  text += `2. ZLECENIODAWCA: ${clientName}\nadres: ${clientAddress}\n\n`;

  text += `==================================\n`;
  text += `Szczegóły umowy\n`;
  text += `==================================\n`;
  text += `Zakres usług: ${scope}\n`;
  text += `Harmonogram: ${schedule || 'nie określono'}\n`;
  text += `Lokalizacja: ${location || 'nie określono'}\n`;
  text += `Cena: ${priceDisplay}\n`;
  text += `Zaliczka: ${deposit || 'brak'}\n`;
  text += `Warunki płatności: ${payment || 'nie określono'}\n`;
  text += `Gwarancja: ${warranty || 'nie określono'}\n`;
  if (notes) text += `Uwagi: ${notes}\n`;
  text += `\n`;

  if (cfg?.requiredFields?.length) {
    text += `==================================\n`;
    text += `DANE SPECYFICZNE DLA BRANŻY (${(industry || '').toUpperCase()})\n`;
    text += `==================================\n`;
    cfg.requiredFields.forEach(field => {
      const value = industryInputs[field.id];
      if (value !== undefined && value !== '' && value !== null) {
        text += `${field.label}: ${String(value)}\n`;
      }
    });
    text += `\n`;
  }

  text += `==================================\n`;
  text += `WARUNKI SZCZEGÓŁOWE I KLAUZULE\n`;
  text += `==================================\n`;

  cfg?.clauses?.forEach((clause, index) => {
    if (agreement.selectedClauses[clause.key]) {
      const title = clause.title.toUpperCase();
      const content = getClauseTemplate(clause.key, agreement);
      text += `\n${index + 1}. ${title}\n`;
      text += `   ${content}\n`;
    }
  });

  text += `\n\n\n_________________________ (Wykonawca) \t\t _________________________ (Zleceniodawca)\n`;

  return text;
}

// ===================== INTEGRACJA Z PROFILEM FIRMY =====================

function applyCompanyProfile() {
  const COMPANY_PROFILE_KEY = 'kickmy-company-profile';
  try {
    const profileData = JSON.parse(localStorage.getItem(COMPANY_PROFILE_KEY) || '{}');
    if (Object.keys(profileData).length === 0) {
      alert('Nie znaleziono profilu firmy. Uzupełnij go w narzędziu "Dane firmy".');
      return;
    }

    if (profileData.name && formElements.provider) {
      formElements.provider.value = profileData.name;
    }

    const addressParts = [profileData.street, profileData.postal, profileData.city].filter(Boolean);
    if (profileData.nip) addressParts.push(`NIP: ${profileData.nip}`);
    if (formElements.providerAddress) {
      formElements.providerAddress.value = addressParts.join(', ');
    }

    generateAgreement();
  } catch (_e) {
    alert('Wystąpił błąd podczas wczytywania profilu firmy.');
  }
}

const debouncedIndustryChange = debounce(() => {
  const slug = formElements.industry?.value;
  renderIndustryFields(slug);
  generateAgreement();
}, 100);

if (formElements.industry) {
  formElements.industry.addEventListener('change', debouncedIndustryChange);
}

if (generateBtn) {
  generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    generateAgreement();
  });
}

const handleFormChange = debounce(generateAgreement, 500);

const agreementFormEl = document.getElementById('agreement-form');
if (agreementFormEl) {
  agreementFormEl.addEventListener('input', handleFormChange);
}
if (reqFieldsHost) reqFieldsHost.addEventListener('input', handleFormChange);
if (clausesPanel) clausesPanel.addEventListener('change', handleFormChange);

// Kopiowanie tekstu – tylko jeśli przycisk istnieje
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    if (!currentAgreement) return;
    const textToCopy = agreementToPlainText(currentAgreement);
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert('Tekst umowy został skopiowany do schowka!');
    } catch (err) {
      console.error('Błąd kopiowania:', err);
      alert(t('copyFailed'));
    }
  });
}

// Inicjalizacja formularza przy Ĺ‚adowaniu
if (formElements.industry?.value) {
  renderIndustryFields(formElements.industry.value);
}
// ===================== GENERATOR PDF =====================

function compileClausesPdf(agreement) {
  const { industry, selectedClauses } = agreement;
  const cfg = INDUSTRY_CONFIG[industry];
  if (!cfg) return [];

  const pdfContent = [];

  // Pola branĹĽowe
  const industryFields = cfg.requiredFields
    .map(field => {
      const value = agreement.industryInputs[field.id];
      if (value !== undefined && value !== '' && value !== null) {
        return `${field.label}: ${String(value)}`;
      }
      return null;
    })
    .filter(Boolean);

  if (industryFields.length > 0) {
    pdfContent.push({ text: 'Dane specyficzne dla branży', style: 'subheader', margin: [0, 10, 0, 5] });
    industryFields.forEach(fieldLine => {
      pdfContent.push({ text: fieldLine, margin: [0, 0, 0, 3] });
    });
  }

  // Klauzule
  pdfContent.push({ text: 'Warunki szczegółowe i klauzule', style: 'subheader', margin: [0, 15, 0, 8] });

  cfg.clauses
    .filter(clause => selectedClauses[clause.key])
    .forEach((clause, idx) => {
      const templateContent = CLAUSE_TEMPLATES[clause.key]
        ? CLAUSE_TEMPLATES[clause.key](agreement)
        : `Brak szablonu dla klauzuli: ${clause.key}`;
      pdfContent.push({ text: `${idx + 1}. ${clause.title}`, bold: true, margin: [0, 5, 0, 2] });
      pdfContent.push({ text: templateContent, margin: [0, 0, 0, 5] });
    });

  return pdfContent;
}

function exportToPdf() {
  if (!currentAgreement) {
    alert('Najpierw wygeneruj umowę.');
    return;
  }
  if (!window.pdfMake) {
    alert('Biblioteka pdfMake nie jest załadowana.');
    return;
  }

  const data = currentAgreement;
  const {
    provider,
    providerAddress,
    clientName,
    clientAddress,
    scope,
    schedule,
    location,
    price,
    deposit,
    payment,
    warranty,
    notes,
    issuedAt
  } = data;

  const formattedDate = issuedAt.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const priceDisplay =
    typeof price === 'number' && price !== null
      ? `${price.toFixed(2)} PLN`
      : String(price || 'nie określono');

  const docDefinition = {
    content: [
      { text: 'UMOWA O ŚWIADCZENIE USŁUG', style: 'header', alignment: 'center', margin: [0, 0, 0, 15] },
      { text: `Zawarta w dniu ${formattedDate}${data.place ? ` w ${data.place}` : ''} pomiędzy:`, alignment: 'center', margin: [0, 0, 0, 15] },
      {
        columns: [
          { width: '50%', text: `WYKONAWCA:\n${provider || 'Brak danych'}\n${providerAddress || ''}`, style: 'address' },
          { width: '50%', text: `ZLECENIODAWCA:\n${clientName || 'Brak danych'}\n${clientAddress || ''}`, style: 'address', alignment: 'right' }
        ],
        margin: [0, 0, 0, 20]
      },
      { text: '§1. Przedmiot umowy', style: 'subheader', margin: [0, 5, 0, 5] },
      { text: `Zakres usług: ${scope || 'nie określono'}` },
      { text: `Harmonogram: ${schedule || 'nie określono'}` },
      { text: `Lokalizacja: ${location || 'nie określono'}`, margin: [0, 0, 0, 10] },

      { text: '§2. Wynagrodzenie i płatności', style: 'subheader', margin: [0, 10, 0, 5] },
      { text: `Wynagrodzenie: ${priceDisplay}` },
      { text: `Zaliczka: ${deposit || 'brak'}` },
      { text: `Warunki płatności: ${payment || 'nie określono'}`, margin: [0, 0, 0, 10] },

      { text: '§3. Gwarancja i uwagi', style: 'subheader', margin: [0, 10, 0, 5] },
      { text: `Gwarancja: ${warranty || 'nie określono'}` },
      notes ? { text: `Uwagi: ${notes}`, margin: [0, 0, 0, 10] } : '',

      ...compileClausesPdf(data),

      {
        columns: [
          { text: '\n\n...........................................\nWykonawca', alignment: 'left' },
          { text: '\n\n...........................................\nZleceniodawca', alignment: 'right' }
        ],
        margin: [0, 40, 0, 0]
      }
    ],
    styles: {
      header: { fontSize: 18, bold: true, color: '#0f172a' },
      subheader: { fontSize: 14, bold: true, color: '#0f172a' },
      address: { fontSize: 10, color: '#475569', lineHeight: 1.3 }
    },
    defaultStyle: { fontSize: 11, color: '#0f172a', lineHeight: 1.4 }
  };

  const fileName = `umowa-${(clientName || 'klient').replace(/\s+/g, '_')}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
}

// Podpinamy przycisk "Pobierz PDF"
if (pdfBtn) {
  pdfBtn.addEventListener('click', exportToPdf);
}

// Podpinamy przycisk wstawiania danych firmy
if (applyCompanyBtn) {
  applyCompanyBtn.addEventListener('click', applyCompanyProfile);
}
