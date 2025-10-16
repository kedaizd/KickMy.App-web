(() => {
  const STORAGE_KEY = 'kickmy.companyProfile.v1';

  const read = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  };

  const write = (obj) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    window.dispatchEvent(new CustomEvent('companyProfile:change', { detail: obj }));
  };

  const bind = (formEl) => {
    if (!formEl) return;
    // Prefill
    const data = read();
    [...formEl.elements].forEach(el => {
      if (!el.name) return;
      if (data[el.name] != null) el.value = data[el.name];
      el.addEventListener('input', () => {
        const current = read();
        current[el.name] = el.value;
        write(current);
      });
    });

    // Reset profilu
    formEl.addEventListener('reset', (e) => {
      e.preventDefault();
      localStorage.removeItem(STORAGE_KEY);
      [...formEl.elements].forEach(el => { if (el.name) el.value = ''; });
      window.dispatchEvent(new CustomEvent('companyProfile:change', { detail: {} }));
      alert('Wyczyszczono zapisane dane firmy.');
    });
  };

  // Eksport / import
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(read(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'company-profile.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const importJSONFromFile = (file) => {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const obj = JSON.parse(fr.result);
        write(obj);
        // odśwież formularz, jeśli jest na stronie
        const form = document.querySelector('#companyProfileForm');
        if (form) {
          [...form.elements].forEach(el => {
            if (el.name && obj[el.name] != null) el.value = obj[el.name];
          });
        }
        alert('Zaimportowano dane firmy.');
      } catch {
        alert('Nieprawidłowy plik JSON.');
      }
    };
    fr.readAsText(file);
  };

  // Interpolacja: <span data-company="name"></span> → podmień na wartość
  const fillPlaceholders = (root = document) => {
    const data = read();
    root.querySelectorAll('[data-company]').forEach(el => {
      const key = el.getAttribute('data-company');
      if (data[key] != null) el.textContent = data[key];
    });
  };

  window.CompanyProfile = {
    read, write, bind, exportJSON, importJSONFromFile, fillPlaceholders,
    STORAGE_KEY
  };
})();