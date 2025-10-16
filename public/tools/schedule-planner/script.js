const STORAGE_KEY = 'kickmy-schedule-events';
const MAX_EVENTS = 300;

// DOM Elements
const form = document.getElementById('event-form');
const dateInput = document.getElementById('date');
const startInput = document.getElementById('start');
const endInput = document.getElementById('end');
const clientInput = document.getElementById('client');
const notesInput = document.getElementById('notes');
const scheduleList = document.getElementById('schedule-list');
const conflictBanner = document.getElementById('conflict-banner');
const nextEventEl = document.getElementById('next-event');
const weekCountEl = document.getElementById('week-count');
const copyBtn = document.getElementById('copy-day');
const clearBtn = document.getElementById('clear-all');
const listRangeSelect = document.getElementById('listRange');
const stationCountSelect = document.getElementById('stationCount');
const stationSelect = document.getElementById('station');
const stationFilterSelect = document.getElementById('stationFilter');
const calTitle = document.getElementById('calTitle');
const calGrid = document.getElementById('calGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const calStationsBtn = document.getElementById('calStationsBtn');
const calStationsPanel = document.getElementById('calStationsPanel');
const calStationsList = document.getElementById('calStationsList');
const calStationAll = document.getElementById('calStationAll');

// State
let events = [];
let calYear;
let calMonth;
let selectedDateKey;
let stationCount = 1;
let calStationsVisible = new Set();

// Utility Functions
function loadEvents() {
  try {
    events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (events.length > MAX_EVENTS) {
      events = events.slice(events.length - MAX_EVENTS);
    }
  } catch {
    events = [];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function dateToKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function sortEvents() {
  events.sort((a, b) => {
    if (a.date === b.date) {
      return timeToMinutes(a.start) - timeToMinutes(b.start);
    }
    return new Date(a.date) - new Date(b.date);
  });
}

function groupEvents(filtered) {
  const map = new Map();
  filtered.forEach(event => {
    const key = dateToKey(event.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(event);
  });
  return Array.from(map.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));
}

function detectConflicts(grouped) {
  const conflicts = new Set();
  grouped.forEach(([, items]) => {
    const byStation = {};
    items.forEach(ev => {
      const s = String(ev.station || 1);
      (byStation[s] = byStation[s] || []).push(ev);
    });
    
    Object.values(byStation).forEach(arr => {
      arr.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
      for (let i = 0; i < arr.length - 1; i++) {
        const cur = arr[i];
        const nxt = arr[i + 1];
        if (timeToMinutes(nxt.start) < timeToMinutes(cur.end)) {
          conflicts.add(cur.id);
          conflicts.add(nxt.id);
        }
      }
    });
  });
  return conflicts;
}

function getListEvents() {
  const days = Number(listRangeSelect.value || '1');
  const start = new Date(selectedDateKey);
  const end = new Date(selectedDateKey);
  end.setDate(end.getDate() + (days - 1));
  const stationFilter = stationFilterSelect.value;
  
  return events.filter(ev => {
    const d = new Date(ev.date);
    const inRange = d >= start && d <= end;
    const sOk = (stationFilter === 'all') || (String(ev.station || 1) === stationFilter);
    return inRange && sOk;
  });
}

function updateSummary() {
  if (!events.length) {
    nextEventEl.textContent = 'Brak wpisow';
    weekCountEl.textContent = '0';
    return;
  }
  
  const base = new Date((selectedDateKey || dateToKey(new Date())) + 'T00:00');
  const stationFilter = stationFilterSelect.value;
  
  const upcoming = events
    .filter(e => {
      const eventDate = new Date(`${e.date}T${e.start}`);
      const sOk = (stationFilter === 'all') || (String(e.station || 1) === stationFilter);
      return eventDate >= base && sOk;
    })
    .sort((a, b) => new Date(`${a.date}T${a.start}`) - new Date(`${b.date}T${b.start}`))[0];
  
  if (upcoming) {
    nextEventEl.textContent = `${upcoming.date} [S${upcoming.station || 1}] ${upcoming.start}–${upcoming.end} — ${upcoming.client}`;
  } else {
    nextEventEl.textContent = 'Brak nadchodzacych terminow';
  }
  
  const weekAhead = new Date(base);
  weekAhead.setDate(base.getDate() + 7);
  
  const weekCount = events.filter(e => {
    const d = new Date(e.date);
    const sOk = (stationFilter === 'all') || (String(e.station || 1) === stationFilter);
    return sOk && d >= base && d < weekAhead;
  }).length;
  
  weekCountEl.textContent = weekCount.toString();
}

function render() {
  sortEvents();
  if (!selectedDateKey) selectedDateKey = dateToKey(new Date());
  
  const filtered = getListEvents();
  const grouped = groupEvents(filtered);
  const conflicts = detectConflicts(grouped);

  if (!grouped.length) {
    scheduleList.innerHTML = '<div class="empty">Brak wpisow w wybranym zakresie.</div>';
  } else {
    scheduleList.innerHTML = grouped.map(([date, items]) => {
      const eventsHtml = items.map(event => {
        const conflictClass = conflicts.has(event.id) ? 'event conflict' : 'event';
        const notesHtml = event.notes ? `<div class="notes">${event.notes}</div>` : '';
        return `
          <div class="${conflictClass}">
            <button type="button" data-id="${event.id}" title="Usun wpis">×</button>
            <strong>${event.client}</strong>
            <div class="time">[S${event.station || 1}] ${event.start} - ${event.end}</div>
            ${notesHtml}
          </div>
        `;
      }).join('');
      return `
        <section class="day-group">
          <h3>${date}</h3>
          <div class="events">${eventsHtml}</div>
        </section>
      `;
    }).join('');
  }

  conflictBanner.classList.toggle('hidden', conflicts.size === 0);
  updateSummary();
  renderCalendar();
}

function addEvent(event) {
  event.preventDefault();
  
  const data = {
    id: crypto.randomUUID(),
    date: dateInput.value,
    start: startInput.value,
    end: endInput.value,
    client: clientInput.value.trim(),
    station: Number(stationSelect.value || 1),
    notes: notesInput.value.trim(),
    createdAt: new Date().toISOString()
  };
  
  if (!data.date || !data.start || !data.end || !data.client) {
    alert('Prosze wypelnic wszystkie wymagane pola.');
    return;
  }
  
  if (timeToMinutes(data.end) <= timeToMinutes(data.start)) {
    alert('Godzina zakonczenia musi byc pozniejsza niz start.');
    return;
  }
  
  events.push(data);
  if (events.length > MAX_EVENTS) {
    events = events.slice(events.length - MAX_EVENTS);
  }
  
  saveEvents();
  form.reset();
  dateInput.valueAsDate = new Date();
  selectedDateKey = dateToKey(data.date);
  render();
}

function deleteEvent(id) {
  events = events.filter(event => event.id !== id);
  saveEvents();
  render();
}

function handleScheduleClick(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  deleteEvent(button.dataset.id);
}

function copyTodayReport() {
  if (!events.length) {
    alert('Brak wpisow do skopiowania.');
    return;
  }
  
  const selectedDay = selectedDateKey || dateToKey(new Date());
  const dayEvents = events.filter(event => dateToKey(event.date) === selectedDay);
  
  if (!dayEvents.length) {
    alert('Brak wizyt w wybranym dniu.');
    return;
  }
  
  const lines = [`Raport dnia: ${selectedDay}`, ''];
  dayEvents.forEach(event => {
    lines.push(`[S${event.station || 1}] ${event.start} - ${event.end} | ${event.client}`);
    if (event.notes) lines.push(`  Notatka: ${event.notes}`);
  });
  
  navigator.clipboard.writeText(lines.join('\n')).then(() => {
    copyBtn.textContent = 'Skopiowano!';
    setTimeout(() => (copyBtn.textContent = 'Kopiuj raport dnia'), 1800);
  }).catch(() => alert('Nie udalo sie skopiowac raportu.'));
}

function clearAllEvents() {
  if (!events.length) return;
  if (!confirm('Na pewno usunac wszystkie terminy?')) return;
  events = [];
  localStorage.removeItem(STORAGE_KEY);
  render();
}

function initDefaults() {
  const now = new Date();
  dateInput.valueAsDate = now;
  startInput.value = '09:00';
  endInput.value = '10:00';
}

function populateStations() {
  try {
    stationCount = Math.min(5, Math.max(1, Number(localStorage.getItem('scheduleStationCount') || 1)));
  } catch {
    stationCount = 1;
  }
  
  if (stationCountSelect) stationCountSelect.value = String(stationCount);
  if (stationSelect) stationSelect.innerHTML = '';
  if (stationFilterSelect) stationFilterSelect.innerHTML = '<option value="all">Wszystkie</option>';
  
  for (let i = 1; i <= stationCount; i++) {
    if (stationSelect) {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = String(i);
      stationSelect.appendChild(o);
    }
    if (stationFilterSelect) {
      const f = document.createElement('option');
      f.value = String(i);
      f.textContent = String(i);
      stationFilterSelect.appendChild(f);
    }
  }
}

function updateStationCheckboxes() {
  if (!calStationsList) return;
  
  calStationsList.innerHTML = '';
  for (let i = 1; i <= stationCount; i++) {
    const id = `cal-st-${i}`;
    const checked = calStationsVisible.has(String(i)) ? 'checked' : '';
    const lbl = document.createElement('label');
    lbl.className = 'chk';
    lbl.innerHTML = `<input type="checkbox" id="${id}" data-station="${i}" ${checked} /> Stanowisko ${i}`;
    calStationsList.appendChild(lbl);
  }
}

// Calendar Functions
function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells = [];
  
  for (let i = 0; i < 42; i++) {
    const dayNum = i - startDay + 1;
    let d, other = false;
    
    if (dayNum < 1) {
      d = new Date(year, month - 1, prevDays + dayNum);
      other = true;
    } else if (dayNum > daysInMonth) {
      d = new Date(year, month + 1, dayNum - daysInMonth);
      other = true;
    } else {
      d = new Date(year, month, dayNum);
    }
    
    cells.push({ date: d, other });
  }
  return cells;
}

function renderCalendar() {
  const cells = monthMatrix(calYear, calMonth);
  const monthName = new Intl.DateTimeFormat('pl-PL', { month: 'long', year: 'numeric' }).format(new Date(calYear, calMonth, 1));
  calTitle.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  
  while (calGrid.children.length > 7) {
    calGrid.removeChild(calGrid.lastChild);
  }
  
  const todayKey = dateToKey(new Date());
  const selectedKey = selectedDateKey || dateToKey(new Date());
  const eventsByDay = events.reduce((m, e) => {
    const k = dateToKey(e.date);
    if (!m[k]) m[k] = [];
    m[k].push(e);
    return m;
  }, {});
  
  cells.forEach(cell => {
    const k = dateToKey(cell.date);
    const div = document.createElement('div');
    div.className = 'cal-cell' + 
      (cell.other ? ' other' : '') + 
      (k === todayKey ? ' today' : '') + 
      (k === selectedKey ? ' selected' : '');
    
    const dateEl = document.createElement('div');
    dateEl.className = 'date';
    dateEl.textContent = cell.date.getDate();
    
    const mini = document.createElement('div');
    mini.className = 'mini-events';
    
    let dayEvents = eventsByDay[k] ? 
      eventsByDay[k].slice().sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)) : [];
    
    if (calStationsVisible.size) {
      dayEvents = dayEvents.filter(ev => calStationsVisible.has(String(ev.station || 1)));
    }
    
    dayEvents.slice(0, 2).forEach(ev => {
      const shortClient = (ev.client || '').toString();
      mini.innerHTML += `<div>[S${ev.station || 1}] ${ev.start} ${shortClient}</div>`;
    });
    
    const badges = document.createElement('div');
    badges.className = 'badges';
    
    if (dayEvents.length) {
      const b = document.createElement('span');
      b.className = 'badge has';
      badges.appendChild(b);
    }
    
    if (dayEvents.length > 2) {
      const extra = document.createElement('span');
      extra.style.fontSize = '11px';
      extra.style.color = '#475569';
      extra.textContent = `+${dayEvents.length - 2}`;
      badges.appendChild(extra);
    }
    
    div.appendChild(dateEl);
    if (dayEvents.length) div.appendChild(mini);
    div.appendChild(badges);
    div.dataset.date = k;
    
    div.addEventListener('click', () => {
      dateInput.value = k;
      selectedDateKey = k;
      scheduleList.scrollIntoView({ behavior: 'smooth' });
      render();
    });
    
    calGrid.appendChild(div);
  });
}

// Event Listeners
form.addEventListener('submit', addEvent);
scheduleList.addEventListener('click', handleScheduleClick);
copyBtn.addEventListener('click', copyTodayReport);
clearBtn.addEventListener('click', clearAllEvents);
listRangeSelect?.addEventListener('change', render);
stationFilterSelect?.addEventListener('change', render);

stationCountSelect?.addEventListener('change', () => {
  stationCount = Math.min(5, Math.max(1, Number(stationCountSelect.value || 1)));
  localStorage.setItem('scheduleStationCount', String(stationCount));
  populateStations();
  
  if (calStationAll && calStationAll.checked) {
    calStationsVisible = new Set(Array.from({ length: stationCount }, (_, i) => String(i + 1)));
  }
  
  updateStationCheckboxes();
  render();
});

prevMonthBtn?.addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }
  renderCalendar();
});

nextMonthBtn?.addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }
  renderCalendar();
});

calStationsBtn?.addEventListener('click', () => {
  calStationsPanel?.classList.toggle('hidden');
});

calStationAll?.addEventListener('change', () => {
  if (calStationAll.checked) {
    calStationsVisible = new Set(Array.from({ length: stationCount }, (_, i) => String(i + 1)));
    calStationsList?.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
  }
  renderCalendar();
});

calStationsList?.addEventListener('change', (e) => {
  const cb = e.target.closest('input[type="checkbox"][data-station]');
  if (!cb) return;
  
  const s = cb.getAttribute('data-station');
  if (cb.checked) {
    calStationsVisible.add(s);
  } else {
    calStationsVisible.delete(s);
  }
  
  if (calStationAll) {
    calStationAll.checked = (calStationsVisible.size === stationCount);
  }
  
  renderCalendar();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initDefaults();
  loadEvents();
  
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  selectedDateKey = dateToKey(now);
  
  populateStations();
  calStationsVisible = new Set(Array.from({ length: stationCount }, (_, i) => String(i + 1)));
  updateStationCheckboxes();
  
  render();
});