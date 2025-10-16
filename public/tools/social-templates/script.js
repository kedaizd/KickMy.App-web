document.addEventListener('DOMContentLoaded', () => {
  const brandInput = document.getElementById('brand');
  const nicheInput = document.getElementById('niche');
  const hashtagInput = document.getElementById('hashtag');
  const applyProfileBtn = document.getElementById('apply-profile');
  const templatesGrid = document.getElementById('templates');

  const COMPANY_PROFILE_KEY = 'kickmy-company-profile';

  /**
   * Aktualizuje wszystkie szablony na podstawie wartości z pól personalizacji.
   */
  function updateAllTemplates() {
    const brand = brandInput.value.trim();
    const niche = nicheInput.value.trim();
    const hashtag = hashtagInput.value.trim();

    const textareas = templatesGrid.querySelectorAll('textarea[data-template]');

    textareas.forEach(textarea => {
      const originalTemplate = textarea.dataset.originalTemplate || textarea.value;
      // Zapisz oryginalny szablon przy pierwszym uruchomieniu
      if (!textarea.dataset.originalTemplate) {
        textarea.dataset.originalTemplate = originalTemplate;
      }

      let updatedText = originalTemplate
        .replace(/\[BRAND\]/g, brand || 'Twoja Marka')
        .replace(/\[NICHE\]/g, niche || 'Twoja Specjalizacja')
        .replace(/\[HASHTAG\]/g, hashtag || '#TwojaMarka');

      textarea.value = updatedText;
    });
  }

  /**
   * Wczytuje dane z profilu firmy i uzupełnia pole "Nazwa marki".
   */
  function applyCompanyProfile() {
    try {
      const profileData = JSON.parse(localStorage.getItem(COMPANY_PROFILE_KEY) || '{}');
      if (!profileData.name) {
        alert('Nie znaleziono profilu firmy. Uzupełnij go w narzędziu "Dane firmy", aby skorzystać z tej funkcji.');
        return;
      }

      brandInput.value = profileData.name;
      // Po wczytaniu danych, automatycznie zaktualizuj szablony
      updateAllTemplates();
      
      // Informacja dla użytkownika
      const originalText = applyProfileBtn.textContent;
      applyProfileBtn.textContent = 'Wczytano!';
      setTimeout(() => {
        applyProfileBtn.textContent = originalText;
      }, 1500);

    } catch (e) {
      alert('Wystąpił błąd podczas wczytywania profilu firmy.');
      console.error('Błąd wczytywania profilu:', e);
    }
  }

  // Nasłuchiwanie na zmiany w polach personalizacji
  [brandInput, nicheInput, hashtagInput].forEach(input => {
    input.addEventListener('input', updateAllTemplates);
  });

  // Nasłuchiwanie na kliknięcie przycisku wczytywania profilu
  if (applyProfileBtn) {
    applyProfileBtn.addEventListener('click', applyCompanyProfile);
  }

  // Kopiowanie tekstu szablonu
  templatesGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('copy-template')) {
      const textarea = event.target.previousElementSibling;
      navigator.clipboard.writeText(textarea.value).then(() => {
        event.target.textContent = 'Skopiowano!';
        setTimeout(() => { event.target.textContent = 'Skopiuj tekst'; }, 1500);
      }).catch(() => alert('Błąd kopiowania.'));
    }
  });

  // Inicjalizacja przy załadowaniu strony
  updateAllTemplates();
});