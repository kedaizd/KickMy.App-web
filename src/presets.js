// Szablon domyślny "Własny" — tylko sekcje z Pakietu podstawowego, bez danych
export const CUSTOM_PRESET = {
  brand: {
    title: '',
    desc: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    colors: {
      brand: '',
      accent: ''
    }
  },
  sections: [
    'hero',
    'usp',
    'offer',
    'contact',
    'footer'
  ],
  hero: {},
  usp: {},
  offer: {},
  contact: {},
  footer: {}
};

export const SECTION_PRICES = {
  "gallery": 29,
  "pricing": 29,
  "faq": 9,
  "testimonials": 29,
  "booking": 29,
  "map": 19,
  "social": 19,
  "newsletter": 9,
  "promo": 19,
  "video": 29
};

const ALL_SECTIONS = [
  "hero",
  "usp",
  "offer",
  "gallery",
  "pricing",
  "faq",
  "testimonials",
  "booking",
  "contact",
  "map",
  "social",
  "newsletter",
  "promo",
  "video",
  "footer"
];

export const PRESETS = {
  "nowoczesny-niebieski": {
    name: "Nowoczesny niebieski",
    brand: { colors: { brand: "#2563eb", accent: "#f59e42" } },
    hero: { bgType: "gradient", colors: { brand: "#2563eb", accent: "#f59e42", buttonPrimary: "#2563eb", buttonPrimaryHover: "#1d4ed8", buttonPrimaryText: "#fff", buttonSecondary: "#fff", buttonSecondaryHover: "#f3f4f6", buttonSecondaryText: "#222", descTitle: "#222", descText: "#555" } },
    footer: { background: "#f8fafc", textColor: "#64748b" }
  },
  "ciemny-elegancki": {
    name: "Ciemny elegancki",
    brand: { colors: { brand: "#18181b", accent: "#f59e42" } },
    hero: { bgType: "solid", colors: { solid: "#18181b", buttonPrimary: "#f59e42", buttonPrimaryHover: "#d97706", buttonPrimaryText: "#fff", buttonSecondary: "#232323", buttonSecondaryHover: "#18181b", buttonSecondaryText: "#f59e42", descTitle: "#fff", descText: "#d1d5db" } },
    footer: { background: "#232323", textColor: "#f59e42" }
  },
  "zielony-naturalny": {
    name: "Zielony naturalny",
    brand: { colors: { brand: "#15803d", accent: "#84cc16" } },
    hero: { bgType: "gradient", colors: { brand: "#15803d", accent: "#84cc16", buttonPrimary: "#15803d", buttonPrimaryHover: "#166534", buttonPrimaryText: "#fff", buttonSecondary: "#fff", buttonSecondaryHover: "#e5e7eb", buttonSecondaryText: "#15803d", descTitle: "#222", descText: "#555" } },
    footer: { background: "#e5f9e0", textColor: "#15803d" }
  },
  "pastelowy-roz": {
    name: "Pastelowy róż",
    brand: { colors: { brand: "#f472b6", accent: "#fcd34d" } },
    hero: { bgType: "gradient", colors: { brand: "#f472b6", accent: "#fcd34d", buttonPrimary: "#f472b6", buttonPrimaryHover: "#db2777", buttonPrimaryText: "#fff", buttonSecondary: "#fff", buttonSecondaryHover: "#fcd34d", buttonSecondaryText: "#db2777", descTitle: "#db2777", descText: "#555" } },
    footer: { background: "#fff0f6", textColor: "#db2777" }
  },
  "sloneczny-zolty": {
    name: "Słoneczny żółty",
    brand: { colors: { brand: "#facc15", accent: "#f59e42" } },
    hero: { bgType: "solid", colors: { solid: "#facc15", buttonPrimary: "#f59e42", buttonPrimaryHover: "#fbbf24", buttonPrimaryText: "#222", buttonSecondary: "#fff", buttonSecondaryHover: "#f3f4f6", buttonSecondaryText: "#f59e42", descTitle: "#222", descText: "#555" } },
    footer: { background: "#fffbe6", textColor: "#f59e42" }
  },
  "minimalistyczny-bialy": {
    name: "Minimalistyczny biały",
    brand: { colors: { brand: "#fff", accent: "#64748b" } },
    hero: { bgType: "solid", colors: { solid: "#fff", buttonPrimary: "#64748b", buttonPrimaryHover: "#334155", buttonPrimaryText: "#fff", buttonSecondary: "#fff", buttonSecondaryHover: "#f3f4f6", buttonSecondaryText: "#64748b", descTitle: "#222", descText: "#555" } },
    footer: { background: "#f8fafc", textColor: "#64748b" }
  },
  "fioletowy-nowoczesny": {
    name: "Fioletowy nowoczesny",
    brand: { colors: { brand: "#7c3aed", accent: "#06b6d4" } },
    hero: { bgType: "gradient", colors: { brand: "#7c3aed", accent: "#06b6d4", buttonPrimary: "#7c3aed", buttonPrimaryHover: "#6d28d9", buttonPrimaryText: "#fff", buttonSecondary: "#fff", buttonSecondaryHover: "#e0e7ff", buttonSecondaryText: "#7c3aed", descTitle: "#222", descText: "#555" } },
    footer: { background: "#ede9fe", textColor: "#7c3aed" }
  },
  "czerwony-energetyczny": {
    name: "Czerwony energetyczny",
    brand: { colors: { brand: "#dc2626", accent: "#facc15" } },
    hero: { bgType: "gradient", colors: { brand: "#dc2626", accent: "#facc15", buttonPrimary: "#dc2626", buttonPrimaryHover: "#b91c1c", buttonPrimaryText: "#fff", buttonSecondary: "#fff", buttonSecondaryHover: "#f3f4f6", buttonSecondaryText: "#dc2626", descTitle: "#b91c1c", descText: "#555" } },
    footer: { background: "#fff5f5", textColor: "#dc2626" }
  },
  "testowy": {
    brand: {
      title: "Testowy",
      desc: "Profesjonalne doradztwo biznesowe i szkolenia dla firm. Skuteczność, doświadczenie, zaufanie.",
      phone: "+48 600 700 800",
      email: "kontakt@testowy-consulting.pl",
      city: "Warszawa",
      address: "ul. Przykładowa 123",
      colors: { brand: "#2563eb", accent: "#f59e42" }
    },
    sections: [
      "hero", "usp", "offer", "gallery", "pricing", "faq", "testimonials", "booking", "contact", "map", "social", "newsletter", "promo", "video", "footer"
    ],
    hero: {
      bgType: "gradient",
      colors: {
        brand: "#2563eb",
        accent: "#f59e42",
        buttonPrimary: "#2563eb",
        buttonPrimaryHover: "#1d4ed8",
        buttonPrimaryText: "#fff",
        buttonSecondary: "#fff",
        buttonSecondaryHover: "#f3f4f6",
        buttonSecondaryText: "#222",
        descTitle: "#222",
        descText: "#555"
      }
    },
    usp: {
      items: [
        { icon: "💼", text: "20+ lat doświadczenia" },
        { icon: "📈", text: "Wzrost efektywności firm" },
        { icon: "🎯", text: "Indywidualne podejście" }
      ]
    },
    offer: {
      items: [
        { title: "Konsultacje strategiczne", desc: "Analiza i optymalizacja procesów biznesowych", price: "od 500 zł/h" },
        { title: "Szkolenia dla zespołów", desc: "Rozwój kompetencji menedżerskich i sprzedażowych", price: "od 3000 zł" },
        { title: "Coaching indywidualny", desc: "Wsparcie liderów i managerów", price: "od 400 zł/h" }
      ]
    },
    gallery: {
      images: [
        "https://images.unsplash.com/photo-1731370963892-32c7347cd2d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1731370963892-32c7347cd2d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1731370963892-32c7347cd2d8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      ]
    },
    pricing: {
      mode: "table",
      rows: [
        { title: "Audyt firmy", price: "2500 zł", unit: "pakiet" },
        { title: "Konsultacja online", price: "600 zł", unit: "godzina" },
        { title: "Szkolenie zamknięte", price: "od 5000 zł", unit: "grupa" }
      ]
    },
    faq: {
      items: [
        { q: "Jak wygląda pierwsza konsultacja?", a: "Pierwsza rozmowa jest niezobowiązująca i pozwala określić potrzeby klienta." },
        { q: "Czy prowadzicie szkolenia online?", a: "Tak, większość szkoleń dostępna jest także w formie zdalnej." },
        { q: "Czy można zamówić audyt całej firmy?", a: "Tak, przygotowujemy indywidualną wycenę po wstępnej analizie." }
      ]
    },
    testimonials: {
      items: [
        { author: "Anna, CEO", text: "Dzięki konsultacjom wdrożyliśmy skuteczne zmiany i poprawiliśmy wyniki." },
        { author: "Marek, HR Manager", text: "Szkolenia były praktyczne i świetnie poprowadzone." },
        { author: "Ewa, właścicielka firmy", text: "Polecam za indywidualne podejście i realne efekty!" }
      ]
    },
    booking: {
      link: "https://calendly.com/testowy-consulting/spotkanie"
    },
    contact: {},
    map: {},
    social: {
      facebook: "https://facebook.com/testowyconsulting",
      linkedin: "https://linkedin.com/company/testowy-consulting",
      youtube: "https://youtube.com/@testowyconsulting"
    },
    newsletter: {
      email: "newsletter@testowy-consulting.pl"
    },
    promo: [
      { discount: "-20%", text: "Pierwsza konsultacja taniej!", endDate: "2025-12-31", terms: "Promocja dotyczy nowych klientów." }
    ],
    video: [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    ],
    footer: {
      background: "#f8fafc",
      textColor: "#64748b",
      text: "© 2025 Testowy Consulting. Wygenerowano w KickMy.App."
    }
  },
  // ====== ZMODYFIKOWANE ISTNIEJĄCE PRESETY ======

  "firma-remontowa": {
    "brand": {
      "title": "Wykończenia i remonty",
      "desc": "Mieszkania, łazienki, kuchnie. Darmowa wycena w 24h.",
      "phone": "+48 511 222 333",
      "email": "biuro@remontpro.pl",
      "city": "Poznań",
      "address": "Święty Marcin 1",
      "colors": { "brand": "#1d4ed8", "accent": "#f97316" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "🧱", "text": "Ekipa z doświadczeniem" },
        { "icon": "⏱️", "text": "Terminy do 21 dni" },
        { "icon": "🧹", "text": "Czysto po pracach" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Wykończenie łazienki", "desc": "Płytki, hydraulika, montaż", "price": "od 9 900 zł" },
        { "title": "Malowanie mieszkań", "desc": "Farby premium, zabezpieczenia", "price": "od 1 990 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Projekt łazienki (do 6 m²)", "price": "990 zł", "unit": "" },
        { "title": "Układanie płytek (60x60)", "price": "150 zł/m²", "unit": "m²" },
        { "title": "Montaż kabiny prysznicowej", "price": "450 zł", "unit": "" },
        { "title": "Gładzie gipsowe", "price": "35 zł/m²", "unit": "m²" },
        { "title": "Malowanie ścian (2x)", "price": "25 zł/m²", "unit": "m²" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy sprzątacie po remoncie?", "a": "Tak, w cenie usługi końcowej." },
        { "q": "Czy robicie wyceny zdalne?", "a": "Tak, na podstawie zdjęć i wymiarów." },
        { "q": "Jak rezerwować termin?", "a": "Telefonicznie lub przez formularz — potwierdzamy w 24h." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Marta", "text": "Łazienka zrobiona na czas i bez poprawek." },
        { "author": "Kamil", "text": "Świetny kontakt i porządek po pracy." },
        { "author": "Zofia", "text": "Profesjonalizm na najwyższym poziomie, polecam!" }
      ]
    }
  },

  "salon-fryzjerski": {
    "brand": {
      "title": "Salon Fryzjerski",
      "desc": "Profesjonalne strzyżenie i koloryzacja dla pań i panów.",
      "phone": "+48 123 456 789",
      "email": "kontakt@elegance.pl",
      "city": "Kraków",
      "address": "ul. Floriańska 10",
      "colors": { "brand": "#8b5cf6", "accent": "#ec4899" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "✂️", "text": "Styliści z certyfikatami" },
        { "icon": "🪞", "text": "Indywidualne konsultacje" },
        { "icon": "🌿", "text": "Kosmetyki premium i wege" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Strzyżenie damskie", "desc": "Nowoczesne cięcia i stylizacja", "price": "99 zł" },
        { "title": "Koloryzacja", "desc": "Bezpieczne farby, naturalne efekty", "price": "od 199 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Strzyżenie damskie", "price": "99 zł", "unit": "" },
        { "title": "Strzyżenie męskie", "price": "69 zł", "unit": "" },
        { "title": "Modelowanie", "price": "49 zł", "unit": "" },
        { "title": "Koloryzacja jednolita", "price": "199 zł", "unit": "" },
        { "title": "Fryzura okolicznościowa", "price": "199 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy można umówić się online?", "a": "Tak, przez formularz rezerwacji lub telefon." },
        { "q": "Czy farby są bezpieczne?", "a": "Używamy produktów bez amoniaku i SLS." },
        { "q": "Czy jest parking?", "a": "Tak, 3 miejsca dla klientów od ul. Pijarskiej." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Jan Kowalski", "text": "Fachowo, szybko i miło." },
        { "author": "Anna Nowak", "text": "Kolor idealny, fryzura trzyma formę." },
        { "author": "Tomasz Wiśniewski", "text": "Obsługa na poziomie, wrócę!" }
      ]
    }
  },

  "restauracja": {
    "brand": {
      "title": "Pizzeria",
      "desc": "Prawdziwa włoska pizza w sercu miasta.",
      "phone": "+48 500 400 300",
      "email": "rezerwacja@pizzeriaitaliana.pl",
      "city": "Wrocław",
      "address": "Rynek 15",
      "colors": { "brand": "#b91c1c", "accent": "#facc15" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "🍕", "text": "Piec opalany drewnem" },
        { "icon": "⏱️", "text": "Czas oczekiwania 10–15 min" },
        { "icon": "🥗", "text": "Świeże, lokalne składniki" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Pizza Margherita", "desc": "Sos pomidorowy, mozzarella, bazylia", "price": "28 zł" },
        { "title": "Pizza Prosciutto", "desc": "Sos, mozzarella, szynka, pieczarki", "price": "36 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Pizza Margherita", "price": "28 zł", "unit": "" },
        { "title": "Pizza Prosciutto", "price": "36 zł", "unit": "" },
        { "title": "Makaron Carbonara", "price": "32 zł", "unit": "" },
        { "title": "Sałatka Cezar", "price": "28 zł", "unit": "" },
        { "title": "Lemoniada domowa", "price": "12 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy dostępne są opcje bezglutenowe?", "a": "Tak, na życzenie za dopłatą." },
        { "q": "Czy dowozicie?", "a": "Tak, w promieniu 5 km." },
        { "q": "Czy przyjmujecie rezerwacje?", "a": "Tak, telefonicznie lub online." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Jan Kowalski", "text": "Najlepsza pizza w mieście, gorąco polecam!" },
        { "author": "Anna Nowak", "text": "Przytulnie, pysznie i bez ukrytych kosztów." },
        { "author": "Tomasz Wiśniewski", "text": "Świetna obsługa, wracam regularnie." }
      ]
    }
  },

  "bar-kebab": {
  brand: {
    title: "Kebab",
    desc: "Najlepszy kebab w mieście! Zawsze świeże mięso, chrupiące warzywa i autorskie sosy.",
    phone: "+48 789 123 456",
    email: "zamowienia@kingkebab.pl",
    city: "Poznań",
    address: "ul. Smaczna 7",
    colors: { brand: "#4338ca", accent: "#f59e0b" } // Głęboki niebieski i złoty/żółty
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "🥙", text: "Mięso 100% z kurczaka/wołowiny" },
      { icon: "🌶️", text: "Autorskie, świeże sosy" },
      { icon: "🏍️", text: "Szybki dowóz w okolicy" }
    ]
  },
  offer: {
    items: [
      { title: "Kebab w Bułce XXL", desc: "Nasza specjalność! Duża porcja mięsa i warzyw.", price: "25 zł" },
      { title: "Tortilla Kebab", desc: "Chrupiąca tortilla, klasyczny smak, idealny na lunch.", price: "22 zł" },
      { title: "Box Kebab z Frytkami", desc: "Idealna opcja na szybkie danie, dużo mięsa i frytek.", price: "28 zł" }
    ]
  },
  pricing: {
    mode: "list", // Zmieniono na "list" - bardziej pasuje do menu
    rows: [
      { title: "Kebab w bułce (Mały)", price: "18 zł", unit: "" },
      { title: "Kebab w bułce (Duży)", price: "25 zł", unit: "" },
      { title: "Kebab na talerzu", price: "35 zł", unit: "" },
      { title: "Falafel (wegetariański)", price: "20 zł", unit: "" },
      { title: "Frytki z sosem", price: "10 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Czy macie opcje wegetariańskie?", a: "Tak, oferujemy świeży Falafel z hummusem i warzywami." },
      { q: "Jaki jest koszt dowozu?", a: "Zależy od strefy. Sprawdź cennik dostaw lub zadzwoń!" },
      { q: "Czy mogę wybrać rodzaj mięsa?", a: "Oczywiście. Do wyboru kurczak, wołowina lub mieszane." }
    ]
  },
  testimonials: {
    items: [
      { author: "Ewa", text: "Najlepszy sos czosnkowy, jakiego próbowałam! Mięso zawsze idealnie doprawione." },
      { author: "Arek", text: "Zawsze zamawiam z dowozem. Gorący i duży. Pełna satysfakcja!" },
      { author: "Ola", text: "Porcje są ogromne, a obsługa bardzo miła. Polecam szczególnie Kebab Box." }
    ]
  }
},

  "salon-kosmetyczny": {
    "brand": {
      "title": "Salon Kosmetyczny",
      "desc": "Zabiegi na twarz i ciało, manicure, pedicure, relaks i piękno.",
      "phone": "+48 600 700 800",
      "email": "kontakt@bellakosmetyka.pl",
      "city": "Warszawa",
      "address": "ul. Piękna 5",
      "colors": { "brand": "#e11d48", "accent": "#f472b6" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "💅", "text": "Profesjonalna obsługa" },
        { "icon": "🧖‍♀️", "text": "Relaksująca atmosfera" },
        { "icon": "🌸", "text": "Nowoczesne zabiegi" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Zabieg na twarz", "desc": "Oczyszczanie, nawilżanie, odżywianie", "price": "od 120 zł" },
        { "title": "Manicure hybrydowy", "desc": "Trwały efekt, szeroka gama kolorów", "price": "80 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Zabieg na twarz", "price": "120 zł", "unit": "" },
        { "title": "Manicure hybrydowy", "price": "80 zł", "unit": "" },
        { "title": "Pedicure klasyczny", "price": "100 zł", "unit": "" },
        { "title": "Masaż relaksacyjny", "price": "150 zł", "unit": "" },
        { "title": "Henna brwi", "price": "40 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy można umówić się online?", "a": "Tak, przez naszą stronę lub telefonicznie." },
        { "q": "Jakie są godziny otwarcia?", "a": "Pon–Pt 9:00–19:00, Sob 9:00–14:00." },
  // { "q": "Czy są vouchery podarunkowe?", "a": "Tak, dostępne na recepcji i online." } // removed
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Kasia", "text": "Najlepszy manicure w mieście!" },
        { "author": "Ola", "text": "Cudowna atmosfera i profesjonalizm." },
        { "author": "Magda", "text": "Zabiegi skuteczne, efekty widać od razu." }
      ]
    }
  },

  // ====== NOWE PRESETY ======

  "uslugi-slusarskie": {
    "brand": {
      "title": "Ślusarz",
      "desc": "Zamki, wkładki, drzwi, sejfy. Dojazd w 30–60 minut.",
      "phone": "+48 511 000 111",
      "email": "kontakt@slusarz247.pl",
      "city": "Warszawa",
      "address": "al. Jana Pawła II 20",
      "colors": { "brand": "#0f766e", "accent": "#f59e0b" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "🔐", "text": "Bez uszkodzeń drzwi" },
        { "icon": "⏰", "text": "Dyżur 24/7" },
        { "icon": "🧾", "text": "Jasny cennik, faktura VAT" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Awaryjne otwieranie", "desc": "Mieszkania, auta, sejfy", "price": "od 149 zł" },
        { "title": "Wymiana zamków", "desc": "Wkładki antywłamaniowe", "price": "od 129 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Otwieranie mieszkania", "price": "149–299 zł", "unit": "" },
        { "title": "Otwieranie auta (bez klucza)", "price": "199–399 zł", "unit": "" },
        { "title": "Wymiana wkładki", "price": "129–249 zł", "unit": "" },
        { "title": "Montaż zamka antywłam.", "price": "249–449 zł", "unit": "" },
        { "title": "Serwis drzwi i zawiasów", "price": "99–199 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy działacie w nocy?", "a": "Tak, pełne 24/7 z dyżurem świątecznym." },
        { "q": "Czy usługa uszkadza drzwi?", "a": "Stosujemy metody bezinwazyjne, gdy to możliwe." },
        { "q": "Czy wystawiacie fakturę?", "a": "Tak, paragon lub faktura VAT." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Paweł", "text": "Przyjechali w 25 minut, drzwi otwarte w 2 minuty." },
        { "author": "Iwona", "text": "Profesjonalnie i bez szkód." },
        { "author": "Robert", "text": "Uczciwe ceny i szybki serwis." }
      ]
    }
  },

  "uslugi-hydrauliczne": {
    "brand": {
      "title": "Hydraulik",
      "desc": "Naprawy, montaże, przeglądy. Dojazd w ten sam dzień.",
      "phone": "+48 512 111 222",
      "email": "biuro@hydrofix.pl",
      "city": "Kraków",
      "address": "ul. Kamienna 7",
      "colors": { "brand": "#2563eb", "accent": "#10b981" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "🚿", "text": "Naprawy bez bałaganu" },
        { "icon": "⚙️", "text": "Części na miejscu" },
        { "icon": "🔁", "text": "Gwarancja 12 miesięcy" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Usuwanie wycieków", "desc": "Syfony, baterie, rury", "price": "od 99 zł" },
        { "title": "Montaż urządzeń", "desc": "Zmywarki, pralki, WC", "price": "od 149 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Wymiana baterii umywalkowej", "price": "149 zł", "unit": "" },
        { "title": "Udrażnianie zlewu", "price": "129 zł", "unit": "" },
        { "title": "Wymiana syfonu", "price": "99 zł", "unit": "" },
        { "title": "Montaż WC kompakt", "price": "249 zł", "unit": "" },
        { "title": "Wymiana grzejnika", "price": "299 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy dojeżdżacie poza miasto?", "a": "Tak, do 30 km za dopłatą kilometrową." },
        { "q": "Czy macie części na miejscu?", "a": "Najczęstsze części mamy w busie, resztę szybko zamawiamy." },
        { "q": "Jak działa gwarancja?", "a": "12 miesięcy na usługę, zgodnie z protokołem." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Ewelina", "text": "Uratowali łazienkę przed zalaniem." },
        { "author": "Norbert", "text": "Szybko, czysto, fachowo." },
        { "author": "Irek", "text": "Dobre doradztwo i uczciwa cena." }
      ]
    }
  },

  "uslugi-elektryczne": {
    "brand": {
      "title": "Elektryk",
      "desc": "Instalacje, pomiary, naprawy. Bezpieczeństwo przede wszystkim.",
      "phone": "+48 513 222 333",
      "email": "kontakt@voltmax.pl",
      "city": "Gdańsk",
      "address": "ul. Długa 4",
      "colors": { "brand": "#111827", "accent": "#f59e0b" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "⚡", "text": "SEP E+D, aktualne pomiary" },
        { "icon": "🛡️", "text": "Bezpieczne rozwiązania" },
        { "icon": "📅", "text": "Terminy ekspresowe" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Pomiary instalacji", "desc": "Przeglądy okresowe i protokoły", "price": "od 199 zł" },
        { "title": "Montaż osprzętu", "desc": "Gniazda, lampy, zabezpieczenia", "price": "od 79 zł/punkt" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Wymiana gniazda/wyłącznika", "price": "79–99 zł", "unit": "pkt" },
        { "title": "Montaż lampy sufitowej", "price": "129 zł", "unit": "" },
        { "title": "Przegląd instalacji (mieszkanie)", "price": "299 zł", "unit": "" },
        { "title": "Podłączenie płyty indukcyjnej", "price": "199 zł", "unit": "" },
        { "title": "Pomiary i protokół", "price": "249 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy wystawiacie protokoły?", "a": "Tak, zgodnie z normami aktualnymi." },
        { "q": "Czy przerabiacie instalacje aluminiowe?", "a": "Tak, rekomendujemy wymianę na miedź." },
        { "q": "Jak rozliczacie punkty?", "a": "Zgodnie z wyceną, jeden punkt to osprzęt + podłączenie." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Krzysztof", "text": "Naprawa zwarcia w godzinę, pełna dokumentacja." },
        { "author": "Julia", "text": "Estetyczny montaż i doradztwo." },
        { "author": "Michał", "text": "Profesjonalnie i terminowo." }
      ]
    }
  },

  "instalacje-klimatyzacji": {
    "brand": {
      "title": "Instalacje klimatyzacji",
      "desc": "Dobór, montaż, serwis. Komfort przez cały rok.",
      "phone": "+48 514 333 444",
      "email": "biuro@coolair.pl",
      "city": "Łódź",
      "address": "ul. Piotrkowska 120",
      "colors": { "brand": "#0ea5e9", "accent": "#22d3ee" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "❄️", "text": "Autoryzowany serwis" },
        { "icon": "🧊", "text": "Montaż w 48h" },
        { "icon": "🧾", "text": "Dofinansowania i gwarancja" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Montaż klimatyzatora split", "desc": "Standard do 3,5 kW", "price": "od 2 399 zł" },
        { "title": "Przegląd i czyszczenie", "desc": "Dezynfekcja, pomiar szczelności", "price": "od 249 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Montaż split do 3,5 kW", "price": "2 399 zł", "unit": "" },
        { "title": "Montaż multi (1x2)", "price": "od 3 999 zł", "unit": "" },
        { "title": "Przegląd sezonowy", "price": "249 zł", "unit": "" },
        { "title": "Uzupełnienie czynnika", "price": "od 199 zł", "unit": "" },
        { "title": "Demontaż jednostki", "price": "349 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy oferujecie montaż w weekend?", "a": "Tak, po wcześniejszym umówieniu." },
        { "q": "Jak długo trwa montaż?", "a": "Zwykle 3–6 godzin w zależności od warunków." },
        { "q": "Czy pomagacie w doborze mocy?", "a": "Tak, bezpłatna konsultacja i wizja lokalna." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Natalia", "text": "Latem wreszcie chłodno, montaż czysto i szybko." },
        { "author": "Bartek", "text": "Świetny dobór sprzętu, cicho pracuje." },
        { "author": "Ewa", "text": "Przegląd przypomniany SMS-em — super." }
      ]
    }
  },

  "biuro-tlumaczen": {
    "brand": {
      "title": "Biuro tłumaczeń",
      "desc": "Tłumaczenia zwykłe i przysięgłe. 40+ języków.",
      "phone": "+48 515 444 555",
      "email": "kontakt@linguapro.pl",
      "city": "Poznań",
      "address": "ul. Ratajczaka 12",
      "colors": { "brand": "#7c3aed", "accent": "#06b6d4" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "📝", "text": "Native speakerzy i QA" },
        { "icon": "⏱️", "text": "Ekspres 24h" },
        { "icon": "🔒", "text": "Poufność danych" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Tłumaczenia zwykłe", "desc": "Strony WWW, umowy, marketing", "price": "od 39 zł/str." },
        { "title": "Tłumaczenia przysięgłe", "desc": "Dokumenty urzędowe i medyczne", "price": "wg stawek MS" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "EN→PL tłum. zwykłe", "price": "39–55 zł/str.", "unit": "" },
        { "title": "PL→EN tłum. zwykłe", "price": "45–65 zł/str.", "unit": "" },
        { "title": "Tłum. przysięgłe (str. 1125 zzs)", "price": "wg stawek", "unit": "" },
        { "title": "Korekta native", "price": "25 zł/str.", "unit": "" },
        { "title": "DTP i skład", "price": "od 49 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Jak liczycie stronę rozliczeniową?", "a": "1125 znaków ze spacjami." },
        { "q": "Czy podpisujecie NDA?", "a": "Tak, na życzenie klienta." },
        { "q": "Czy przyjmujecie pliki PDF/Scan?", "a": "Tak, także skany i zdjęcia." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Milan", "text": "Szybko i bezbłędnie, polecam." },
        { "author": "Karolina", "text": "Świetna komunikacja i terminowość." },
        { "author": "Oskar", "text": "Korekta native zrobiła różnicę." }
      ]
    }
  },

  "obsluga-imprez": {
    "brand": {
      "title": "Eventy i obsługa imprez",
      "desc": "Konferencje, wesela, plener. Nagłośnienie, oświetlenie, DJ.",
      "phone": "+48 516 555 666",
      "email": "hello@eventcrew.pl",
      "city": "Wrocław",
      "address": "ul. Świdnicka 2",
      "colors": { "brand": "#ef4444", "accent": "#22c55e" }
    },
    "sections": ALL_SECTIONS,
    "usp": {
      "items": [
        { "icon": "🔊", "text": "Pro audio i światło" },
        { "icon": "🧑‍🔧", "text": "Ekipa techniczna 24/7" },
        { "icon": "🎛️", "text": "Scenariusz i koordynacja" }
      ]
    },
    "offer": {
      "items": [
        { "title": "Obsługa konferencji", "desc": "Nagłośnienie, mikrofony, operatorzy", "price": "od 2 900 zł" },
        { "title": "Oprawa wesela", "desc": "DJ, oświetlenie, fotobudka", "price": "od 3 900 zł" }
      ]
    },
    "pricing": {
      "mode": "table",
      "rows": [
        { "title": "Pakiet konferencyjny Basic", "price": "2 900 zł", "unit": "" },
        { "title": "Pakiet weselny Standard", "price": "3 900 zł", "unit": "" },
        { "title": "Wynajem projektora + ekran", "price": "399 zł/doba", "unit": "" },
        { "title": "Technik na wydarzeniu", "price": "120 zł/h", "unit": "" },
        { "title": "Transport i montaż", "price": "od 199 zł", "unit": "" }
      ]
    },
    "faq": {
      "items": [
        { "q": "Czy macie zapasowy sprzęt?", "a": "Tak, duplikujemy kluczowe elementy." },
        { "q": "Czy gracie playlisty gości?", "a": "Tak, po konsultacji z DJ-em." },
        { "q": "Czy obsługujecie plener?", "a": "Tak, posiadamy agregaty i zadaszenia." }
      ]
    },
    "testimonials": {
      "items": [
        { "author": "Damian", "text": "Konferencja bez potknięć, super ekipa." },
        { "author": "Zuzanna", "text": "Wesele marzeń, parkiet pełny do rana." },
        { "author": "Olek", "text": "Szybki montaż, świetne światło." }
      ]
    }
  },
  "pielegnacja-ogrodow": {
  brand: {
    title: "Usługi ogrodowe",
    desc: "Projektowanie, zakładanie i pielęgnacja ogrodów.",
    phone: "+48 600 123 456",
    email: "kontakt@zielonyzakatek.pl",
    city: "Lublin",
    address: "ul. Ogrodowa 8",
    colors: { brand: "#15803d", accent: "#84cc16" }
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "🌿", text: "Ekologiczne rozwiązania" },
      { icon: "🧑‍🌾", text: "Doświadczeni ogrodnicy" },
      { icon: "📆", text: "Stała opieka sezonowa" }
    ]
  },
  offer: {
    items: [
      { title: "Zakładanie trawnika", desc: "Sianie lub z rolki", price: "od 10 zł/m²" },
      { title: "Przycinka drzew i krzewów", desc: "Kształtowanie, odmładzanie", price: "od 150 zł" }
    ]
  },
  pricing: {
    mode: "table",
    rows: [
      { title: "Zakładanie trawnika z rolki", price: "25 zł/m²", unit: "m²" },
      { title: "Nawadnianie ogrodowe", price: "od 5 zł/m²", unit: "m²" },
      { title: "Przycinka drzew", price: "200 zł/drzewo", unit: "" },
      { title: "Sadzenie krzewów", price: "od 20 zł/szt.", unit: "szt." },
      { title: "Opieka sezonowa (5 wizyt)", price: "od 1 200 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Czy przycinacie sezonowo?", a: "Tak — plan pielęgnacji ustalany jest z klientem." },
      { q: "Czy wykonujecie nawadnianie automatyczne?", a: "Tak, dobieramy system i instalujemy." },
      { q: "Czy ze względu na warunki pogodowe cena się zmienia?", a: "Koszt może ulec zmianie przy bardzo specyficznych wymaganiach lub lokalizacji." }
    ]
  },
  testimonials: {
    items: [
      { author: "Alicja", text: "Mój ogród odmieniony, wszystko zgodnie z umową." },
      { author: "Mateusz", text: "Profesjonalnie, terminowo, piękne rośliny." },
      { author: "Grażyna", text: "Zielony Zakątek zadbał o mój trawnik jak o swój." }
    ]
  }
},

"kwiaciarnia": {
  brand: {
    title: "Kwiaciarnia",
    desc: "Bukiety, dekoracje, dostawa w 2h.",
    phone: "+48 601 987 654",
    email: "zamowienia@florissima.pl",
    city: "Gdynia",
    address: "ul. Kwiatowa 2",
    colors: { brand: "#db2777", accent: "#fcd34d" }
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "💐", text: "Świeże dostawy codziennie" },
      { icon: "🚚", text: "Ekspresowa dostawa" },
      { icon: "🎨", text: "Kompozycje na życzenie" }
    ]
  },
  offer: {
    items: [
      { title: "Bukiet okazjonalny", desc: "Na urodziny, imieniny, rocznicę", price: "od 79 zł" },
      { title: "Dekoracje ślubne", desc: "Kościół, sala, auto", price: "od 499 zł" }
    ]
  },
  pricing: {
    mode: "table",
    rows: [
      { title: "Bukiet standardowy", price: "79 zł", unit: "" },
      { title: "Bukiet premium", price: "149 zł", unit: "" },
      { title: "Dekoracja samochodu", price: "od 199 zł", unit: "" },
      { title: "Dekoracja sali", price: "od 999 zł", unit: "" },
      { title: "Kosz upominkowy", price: "od 129 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Czy kwiaty są świeże?", a: "Tak — dostawy codzienne, dbamy o warunki przechowywania." },
      { q: "Czy można zamówić bukiet online?", a: "Tak, oferujemy formularz i opcję dostawy." },
      { q: "Czy dekorujecie miejsca ślubów?", a: "Tak, pracujemy z klientami indywidualnie." }
    ]
  },
  testimonials: {
    items: [
      { author: "Julia", text: "Bukiet dla mamy piękny i pachnący!" },
      { author: "Piotr", text: "Dekoracja weselna przewyższyła oczekiwania." },
      { author: "Karolina", text: "Dostawa błyskawiczna, kwiaty świeże." }
    ]
  }
},

"naprawa-agd": {
  brand: {
    title: "Serwis sprzętu AGD",
    desc: "Naprawy z dojazdem, ekspresowe terminy.",
    phone: "+48 602 123 321",
    email: "serwis@agdfix.pl",
    city: "Katowice",
    address: "ul. Naprawcza 14",
    colors: { brand: "#1e40af", accent: "#f59e0b" }
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "🔧", text: "Naprawa u klienta" },
      { icon: "🕒", text: "Czas reakcji 24h" },
      { icon: "📋", text: "Diagnoza + gwarancja" }
    ]
  },
  offer: {
    items: [
      { title: "Naprawa pralki", desc: "Nie pobiera wody, nie wiruje", price: "od 149 zł" },
      { title: "Serwis lodówki", desc: "Nie chłodzi, hałasuje", price: "od 199 zł" }
    ]
  },
  pricing: {
    mode: "table",
    rows: [
      { title: "Wymiana grzałki pralki", price: "od 199 zł", unit: "" },
      { title: "Naprawa silnika odkurzacza", price: "od 249 zł", unit: "" },
      { title: "Serwis piekarnika", price: "od 299 zł", unit: "" },
      { title: "Regeneracja chłodziarki", price: "od 349 zł", unit: "" },
      { title: "Wymiana uszczelki zmywarki", price: "od 99 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Czy serwis jest z dojazdem?", a: "Tak — usługę wykonujemy u klienta jeśli to możliwe." },
      { q: "Ile trwa diagnoza?", a: "Zazwyczaj do 24h po przyjęciu sprzętu." },
      { q: "Czy oferujecie części zamienne?", a: "Tak, mamy części oryginalne i zamienniki wysokiej jakości." }
    ]
  },
  testimonials: {
    items: [
      { author: "Łukasz", text: "Naprawa pralki bez problemów, wszystko działa!" },
      { author: "Agnieszka", text: "Lodówka naprawiona szybko, kurs doradczyek bardzo pomocny." },
      { author: "Tomasz", text: "Dobra jakość, uczciwa cena." }
    ]
  }
},

"fizjoterapia": {
  brand: {
    title: "Fizjoterapia",
    desc: "Rehabilitacja, masaże, terapia manualna.",
    phone: "+48 603 456 789",
    email: "kontakt@fizjocare.pl",
    city: "Szczecin",
    address: "ul. Zdrowia 5",
    colors: { brand: "#4f46e5", accent: "#22d3ee" }
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "💪", text: "Indywidualne podejście" },
      { icon: "🧘", text: "Nowoczesne metody" },
      { icon: "🏡", text: "Możliwość dojazdu" }
    ]
  },
  offer: {
    items: [
      { title: "Terapia manualna", desc: "Bóle kręgosłupa, stawy", price: "od 120 zł" },
      { title: "Masaż leczniczy", desc: "60 minut zabiegu", price: "150 zł" }
    ]
  },
  pricing: {
    mode: "table",
    rows: [
      { title: "Terapia manualna – godzina", price: "120 zł", unit: "" },
      { title: "Masaż leczniczy 60 min", price: "150 zł", unit: "" },
      { title: "Kinezyterapia sesja", price: "100 zł", unit: "" },
      { title: "Rehabilitacja po urazach", price: "od 200 zł", unit: "" },
      { title: "Terapia online", price: "od 80 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Czy przyjmujecie na NFZ?", a: "Obecnie prywatnie — do współpracy z NFZ przygotowujemy ofertę." },
      { q: "Czy dojeżdżacie do domu?", a: "Tak — oferujemy wizyty domowe po ustaleniu." },
      { q: "Jak długo trwa rehabilitacja?", a: "Zależy od stanu pacjenta, zwykle 4‑8 tygodni." }
    ]
  },
  testimonials: {
    items: [
      { author: "Marta", text: "Ból pleców ustąpił po serii terapii." },
      { author: "Kamil", text: "Profesjonalne podejście, dobre rezultaty." },
      { author: "Sylwia", text: "Cieszy mnie możliwość masażu w domu." }
    ]
  }
},

"pomoc-drogowa": {
  brand: {
    title: "Pomoc drogowa",
    desc: "Laweta, awarie, holowanie w całej Polsce.",
    phone: "+48 604 222 333",
    email: "pomoc@autoratunek.pl",
    city: "Rzeszów",
    address: "ul. Awariów 11",
    colors: { brand: "#dc2626", accent: "#facc15" }
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "🚗", text: "Dojazd w 30 minut" },
      { icon: "🆘", text: "Pomoc 24/7" },
      { icon: "💸", text: "Stałe, jasne ceny" }
    ]
  },
  offer: {
    items: [
      { title: "Holowanie w mieście", desc: "Osobówki i dostawcze", price: "od 199 zł" },
      { title: "Pomoc przy rozruchu", desc: "Rozładowany akumulator", price: "od 99 zł" }
    ]
  },
  pricing: {
    mode: "table",
    rows: [
      { title: "Holowanie osoby/auta (do 50 km)", price: "od 199 zł", unit: "" },
      { title: "Dojazd + pomoc", price: "od 129 zł", unit: "" },
      { title: "Awaryjne otwieranie drzwi", price: "od 149 zł", unit: "" },
      { title: "Awaryjny rozruch akumulatora", price: "od 99 zł", unit: "" },
      { title: "Transport pojazdu ciężarowego", price: "od 499 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Czy działacie całodobowo?", a: "Tak — 24/7, także święta i weekendy." },
      { q: "Czy holujecie cały kraj?", a: "Tak, w większości przypadków — do ustalenia." },
      { q: "Jak płatność? Karta / gotówka?", a: "Obsługujemy gotówkę, kartę oraz przelew." }
    ]
  },
  testimonials: {
    items: [
      { author: "Robert", text: "Holowanie sprawnie, bez problemów." },
      { author: "Kasia", text: "Pomoc w nocy — przyjechali szybko." },
      { author: "Marek", text: "Uczciwa cena i fachowa obsługa." }
    ]
  }
},

"serwis-samochodowy": {
  brand: {
    title: "Mechanika Samochodowa",
    desc: "Kompleksowy serwis, naprawy bieżące i diagnostyka. Szybko, solidnie i z gwarancją.",
    phone: "+48 501 100 200",
    email: "kontakt@twojmechanik.pl",
    city: "Kraków",
    address: "ul. Serwisowa 5",
    colors: { brand: "#059669", accent: "#f97316" } // Ciemna zieleń i pomarańcz jako akcent
  },
  sections: ALL_SECTIONS,
  usp: {
    items: [
      { icon: "🔧", text: "Gwarancja na usługi" },
      { icon: "⚙️", text: "Komputerowa diagnostyka" },
      { icon: "🗓️", text: "Krótkie terminy napraw" }
    ]
  },
  offer: {
    items: [
      { title: "Wymiana Oleju i Filtrów", desc: "Szybki serwis eksploatacyjny, wszystkie marki.", price: "od 150 zł (robocizna)" },
      { title: "Serwis Klimatyzacji", desc: "Napełnianie, odgrzybianie i diagnostyka.", price: "od 199 zł" },
      { title: "Wymiana Rozrządu", desc: "Kompleksowa usługa z częściami i gwarancją.", price: "Wycena indywidualna" }
    ]
  },
  pricing: {
    mode: "table",
    rows: [
      { title: "Diagnostyka komputerowa", price: "120 zł", unit: "" },
      { title: "Wymiana klocków hamulcowych (oś)", price: "od 100 zł", unit: "" },
      { title: "Wymiana tarcz i klocków (oś)", price: "od 220 zł", unit: "" },
      { title: "Przegląd przed zakupem", price: "od 180 zł", unit: "" },
      { title: "Montaż/Demontaż opon (za 4 koła)", price: "od 150 zł", unit: "" }
    ]
  },
  faq: {
    items: [
      { q: "Jak długo trwa typowa naprawa?", a: "To zależy od złożoności. Podamy wstępny czas przy przyjęciu pojazdu." },
      { q: "Czy mogę przywieźć własne części?", a: "Tak, jednak na części klienta nie udzielamy gwarancji." },
      { q: "Czy prowadzicie serwis klimatyzacji?", a: "Tak, pełen serwis: odgrzybianie, sprawdzenie szczelności i napełnianie czynnika." }
    ]
  },
  testimonials: {
    items: [
      { author: "Piotr", text: "Szybka i profesjonalna naprawa zawieszenia. Polecam za uczciwość." },
      { author: "Ania", text: "Świetna obsługa i rzetelna diagnostyka! Wreszcie znalazłam zaufanego mechanika." },
      { author: "Krzysztof", text: "Wymiana rozrządu bez problemów, konkurencyjna cena i fachowe doradztwo." }
      ]
  }
},
}