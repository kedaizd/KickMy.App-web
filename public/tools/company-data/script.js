// Storage Key
const STORAGE_KEY = 'kickmy-company-profile';

// DOM Elements
const form = document.getElementById('companyProfileForm');
const exportBtn = document.getElementById('companyExportBtn');
const importFile = document.getElementById('companyImportFile');

// Utility Functions
function saveProfile(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProfile() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function updateForm(profile) {
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.value = profile[input.name] || '';
  });
}

function getFormData() {
  const data = {};
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    data[input.name] = input.value.trim();
  });
  return data;
}

// Event Handlers
form.addEventListener('input', () => {
  const data = getFormData();
  saveProfile(data);
});

form.addEventListener('reset', (e) => {
  if (confirm('Czy na pewno chcesz wyczyścić cały profil firmy? Dane zostaną usunięte.')) {
    localStorage.removeItem(STORAGE_KEY);
    alert('Profil firmy został wyczyszczony.');
  } else {
    // Anuluj natywne zachowanie resetowania formularza, jeśli użytkownik zrezygnuje
    e.preventDefault();
  }
});


// Export/Import Logic
function handleExport() {
  const data = getFormData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kickmy_company_profile.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (typeof importedData === 'object' && importedData !== null) {
        updateForm(importedData);
        saveProfile(importedData); // Zapisz zaimportowane dane
        alert('Profil firmy został pomyślnie zaimportowany i zapisany.');
      } else {
        throw new Error('Niepoprawny format danych JSON.');
      }
    } catch (error) {
      alert('Błąd wczytywania pliku: ' + error.message);
    }
    // Zresetuj input, aby umożliwić ponowne załadowanie tego samego pliku
    event.target.value = null;
  };
  reader.readAsText(file);
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const profile = loadProfile();
  updateForm(profile);
  
  exportBtn.addEventListener('click', handleExport);
  importFile.addEventListener('change', handleImport);
});