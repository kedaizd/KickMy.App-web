document.addEventListener('DOMContentLoaded', () => {
  const inputs = {
    brand: document.getElementById('brand'),
    contact: document.getElementById('contact'),
    date: document.getElementById('date'),
    bonus: document.getElementById('bonus'),
  };

  const applyBtn = document.getElementById('apply');
  const resetBtn = document.getElementById('reset');
  const applyProfileBtn = document.getElementById('apply-profile');
  const templateAreas = document.querySelectorAll('textarea[data-template]');
  const copyButtons = document.querySelectorAll('.copy');

  const COMPANY_PROFILE_KEY = 'kickmy-company-profile';

  const defaults = {
    brand: '',
    contact: '',
    date: '',
    bonus: '',
  };

  function applyPlaceholders(text, replacements) {
    return text
      .replaceAll('[BRAND]', replacements.brand || '[BRAND]')
      .replaceAll('[CONTACT]', replacements.contact || '[CONTACT]')
      .replaceAll('[DATE]', replacements.date || '[DATE]')
      .replaceAll('[BONUS]', replacements.bonus || '[BONUS]');
  }

  function updateTemplates() {
    const values = {
      brand: inputs.brand.value.trim(),
      contact: inputs.contact.value.trim(),
      date: inputs.date.value.trim(),
      bonus: inputs.bonus.value.trim(),
    };
    templateAreas.forEach(area => {
      const raw = area.dataset.templateRaw || area.value;
      if (!area.dataset.templateRaw) {
        area.dataset.templateRaw = raw;
      }
      area.value = applyPlaceholders(raw, values);
    });
  }

  function resetTemplates() {
    Object.keys(inputs).forEach(key => {
      if (inputs[key]) inputs[key].value = defaults[key];
    });
    updateTemplates();
  }

  function copyTemplate(event) {
    const area = event.target.closest('.template-card').querySelector('textarea');
    navigator.clipboard.writeText(area.value).then(() => {
      event.target.textContent = 'Skopiowano!';
      setTimeout(() => (event.target.textContent = 'Kopiuj'), 2000);
    }).catch(() => alert('Nie udało się skopiować tekstu.'));
  }

  function applyCompanyProfile() {
    try {
      const profileData = JSON.parse(localStorage.getItem(COMPANY_PROFILE_KEY) || '{}');
      if (!profileData.name) {
        alert('Nie znaleziono profilu firmy. Uzupełnij go w narzędziu "Dane firmy".');
        return;
      }
      if (inputs.brand) inputs.brand.value = profileData.name || '';
      if (inputs.contact) inputs.contact.value = profileData.phone || profileData.email || '';
      
      updateTemplates();
      alert('Dane firmy zostały wczytane.');
    } catch (e) {
      alert('Wystąpił błąd podczas wczytywania profilu firmy.');
    }
  }

  applyBtn?.addEventListener('click', updateTemplates);
  resetBtn?.addEventListener('click', resetTemplates);
  applyProfileBtn?.addEventListener('click', applyCompanyProfile);
  copyButtons.forEach(btn => btn.addEventListener('click', copyTemplate));

  // Initial state
  templateAreas.forEach(area => {
    area.dataset.templateRaw = area.value;
  });
  updateTemplates();
});