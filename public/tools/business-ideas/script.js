﻿// Ideas Database
const ideasBase = {
  pizza: {
    classic: [
      'Klasyczna pizza Margherita z mozzarellą di bufala i świeżą bazylią.',
      'Pizza Capricciosa z art. szynką, pieczarkami i oliwkami kalamata.',
      'Zestaw lunchowy: pizza 25 cm + lemoniada domowa + mini deser.'
    ],
    seasonal: [
      'Pizza jesienna z dynią, ricottą i prażonymi orzechami włoskimi.',
      'Letnia pizza z grillowaną cukinią, burratą i sosem pesto z rukoli.',
      'Oferta tygodnia: pizza z karczochami i świeżym tymiankiem (dostępna tylko do piątku).'
    ],
    premium: [
      'Pizza Premium z szynką parmeńską, rukolą, parmezanem i truflowym dressingiem.',
      'Degustacyjny flight: trzy mini pizze z wybranymi dodatkami premium.',
      'Pizza z krewetkami, sosem maślanym z czosnkiem i płatkami chili.'
    ],
    fun: [
      'Pizza Kids Party – ser + kukurydza + krążki ananasa + uśmiech na talerzu.',
      'Pizza Taco Party: awokado, salsa pomidorowa, ser jack – w zestawie chipsy nacho.',
      'Pizza deserowa: krem mascarpone, owoce sezonowe, biała czekolada (limitowana).'
    ]
  },
  salon: {
    classic: [
      'Pakiet „Regeneracja dłoni i stóp" – manicure, pedicure, masaż dłoni z maską nawilżającą.',
      'Zabieg oczyszczający z kwasami + serum witaminowe + konsultacja pielęgnacyjna.',
      'Klasyczne strzyżenie + modelowanie + odżywcza sauna na włosy.'
    ],
    seasonal: [
      'Letni rytuał body glow – peeling mango, masaż kokosowy, spray rozświetlający.',
      'Kosmetyczny „back to school": oczyszczanie + maska z zielonej herbaty + regeneracja brwi.',
      'Zabieg jesienny przeciw przesuszeniu – mezoterapia bezigłowa z kwasem hialuronowym.'
    ],
    premium: [
      'Pakiet VIP „Glow Night": zabieg z płatkami złota + masaż aromatyczny + przekąski premium.',
      'Karnet miesięczny na indywidualnie dobrane zabiegi z dedykowanymi kosmetykami.',
      'Zabieg bankietowy z liftingiem ultradźwiękowym + makijaż wieczorowy.'
    ],
    fun: [
      'Warsztaty DIY spa – własnoręczne tworzenie masek i peelingów dla grupy max 6 osób.',
      '„Beauty Party" z fryzurami w stylu lat 90. + manicure neonowy + fotobudka.',
      'Pakiet „Glow & Go": mini zabieg + szybki makijaż + wideo instruktaż do domu.'
    ]
  },
  mix: {
    classic: [
      'Tydzień „Włoskie klasyki": pizza lunchowa + mini warsztat makaronowy.',
      'Pakiet rodzinny: pizza + voucher na zabieg regeneracyjny dla rodzica.',
      'Subskrypcja: pizza miesiąca + kosmetyczny box pielęgnacyjny.'
    ],
    seasonal: [
      'Jesienny festiwal dyni: menu dyniowe + zabieg z olejem z pestek dyni.',
      'Letnia strefa chill: koktajle owocowe, lekkie pizze i strefa stóp z masażem.',
      'Zimowe „warm-up": pizza z gorgonzolą + zabieg rozgrzewający z imbirem.'
    ],
    premium: [
      'Weekendowy „all inclusive": kolacja degustacyjna + pakiet beauty VIP.',
      'Oferta wedding prep: catering finger food + szybkie zabiegi bankietowe.',
      'Box premium: pizza truflowa + zestaw kosmetyków luksusowych w prezencie.'
    ],
    fun: [
      'Wieczór „Pizza & Self-care": warsztaty pizzowe + sesja pielęgnacyjna.',
      'Event „Glow & Slice": konkurs na najciekawsze połączenia + mini zabiegi live.',
      '#Challenge – 7 dni nowych smaków i mikro-zadań pielęgnacyjnych dla społeczności.'
    ]
  }
};

// Storage Keys
const STORAGE_FAVORITES = 'kickmy-ideas-favorites';
const STORAGE_CUSTOM = 'kickmy-ideas-custom';

// DOM Elements
const categorySelect = document.getElementById('category');
const styleSelect = document.getElementById('style');
const countInput = document.getElementById('count');
const generateBtn = document.getElementById('generate');
const addOwnBtn = document.getElementById('add-own');
const ideasGrid = document.getElementById('ideas');
const favoritesList = document.getElementById('favorites');

function randomItems(array, n) {
  const copy = [...array];
  const picked = [];
  while (copy.length && picked.length < n) {
    const index = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(index, 1)[0]);
  }
  return picked;
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function loadFromStorage(key, defaultValue = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue));
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// State
let customIdeas = loadFromStorage(STORAGE_CUSTOM);
let favorites = loadFromStorage(STORAGE_FAVORITES);

// Generate Ideas
function generateIdeas() {
  const category = categorySelect.value;
  const style = styleSelect.value;
  const count = Math.min(Math.max(parseInt(countInput.value, 10) || 1, 1), 5);
  
  const base = ideasBase[category]?.[style] || [];
  const customForCategory = customIdeas.filter(item => 
    item.category === category || item.category === 'all'
  );
  
  const combined = [...base, ...customForCategory.map(item => item.text)];
  
  if (!combined.length) {
    alert('Brak pomysłów dla wybranej kategorii. Dodaj własny pomysł.');
    return;
  }
  
  const ideas = randomItems(combined, count);
  renderIdeas(ideas);
}

function renderIdeas(ideas) {
  if (!ideas.length) {
    ideasGrid.innerHTML = '<p class="empty">Brak pomysłów do wyświetlenia.</p>';
    return;
  }
  
  ideasGrid.innerHTML = ideas.map((idea, index) => `
    <article class="idea-card" data-index="${index}">
      <textarea readonly>${escapeHtml(idea)}</textarea>
      <div class="idea-actions">
        <button type="button" class="copy">Kopiuj</button>
        <button type="button" class="favorite">Dodaj do ulubionych</button>
        <button type="button" class="remove">Usuń z listy</button>
      </div>
    </article>
  `).join('');
}

// Custom Ideas
function addCustomIdea() {
  const text = prompt('Podaj treść pomysłu (np. nowa usługa, opis akcji promocyjnej):');
  if (!text || !text.trim()) return;
  
  const category = categorySelect.value;
  
  customIdeas.push({
    text: text.trim(),
    category: category,
    createdAt: new Date().toISOString()
  });
  
  saveToStorage(STORAGE_CUSTOM, customIdeas);
  alert('Dodano pomysł. Pojawi się w kolejnych losowaniach dla kategorii: ' + category);
}

// Favorites
function renderFavorites() {
  if (!favorites.length) {
    favoritesList.innerHTML = '<li class="favorites-item empty">Brak ulubionych. Dodaj coś z generatora.</li>';
    return;
  }
  
  favoritesList.innerHTML = favorites.map((item) => `
    <li class="favorites-item" data-id="${item.id}">
      <div class="favorite-text">${escapeHtml(item.text)}</div>
      <div class="favorite-meta">
        <small>${item.category} • ${new Date(item.addedAt).toLocaleDateString('pl-PL')}</small>
        <button type="button" class="delete">Usuń</button>
      </div>
    </li>
  `).join('');
}

function addToFavorites(text) {
  const category = categorySelect.value;
  
  // Sprawdź czy już istnieje
  if (favorites.some(f => f.text === text)) {
    alert('Ten pomysł już jest w ulubionych.');
    return;
  }
  
  favorites.push({
    id: Date.now(), // Unikalne ID dla bezpiecznego usuwania
    text: text,
    category: category,
    addedAt: new Date().toISOString()
  });
  
  saveToStorage(STORAGE_FAVORITES, favorites);
  renderFavorites();
}

// Event Handlers
ideasGrid.addEventListener('click', event => {
  const card = event.target.closest('.idea-card');
  if (!card) return;
  
  const textarea = card.querySelector('textarea');
  
  if (event.target.classList.contains('copy')) {
    navigator.clipboard.writeText(textarea.value).then(() => {
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = 'Skopiowano!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }).catch(() => {
      alert('Nie udało się skopiować.');
    });
  }
  
  if (event.target.classList.contains('favorite')) {
    addToFavorites(textarea.value);
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Dodano ✓';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 1500);
  }
  
  if (event.target.classList.contains('remove')) {
    if (confirm('Usunąć ten pomysł z bieżącej listy?')) {
      card.remove();
    }
  }
});

favoritesList.addEventListener('click', event => {
  if (event.target.classList.contains('delete')) {
    const item = event.target.closest('.favorites-item');
    const id = Number(item.dataset.id);
    
    if (confirm('Usunąć ten pomysł z ulubionych?')) {
      favorites = favorites.filter(fav => fav.id !== id);
      saveToStorage(STORAGE_FAVORITES, favorites);
      renderFavorites();
    }
  }
});

// Button Handlers
generateBtn.addEventListener('click', generateIdeas);
addOwnBtn.addEventListener('click', addCustomIdea);

// Category/Style change triggers regeneration
categorySelect?.addEventListener('change', generateIdeas);
styleSelect?.addEventListener('change', generateIdeas);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderFavorites();
  generateIdeas();
});