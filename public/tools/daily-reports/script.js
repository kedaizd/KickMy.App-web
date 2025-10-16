﻿const STORAGE_KEY = 'kickmy-daily-reports-v2';
const COMPANY_PROFILE_KEY = 'kickmy-company-profile';
const PREFS_KEY = 'kickmy-daily-reports-prefs';

// DOM Elements
const form = document.getElementById('entryForm');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const incomeInput = document.getElementById('income');
const notesInput = document.getElementById('notes');
const clearDayBtn = document.getElementById('clearDay');

const daysList = document.getElementById('daysList');
const currentDateEl = document.getElementById('currentDate');
const entriesTableBody = document.getElementById('entriesTable');
const categorySumsTable = document.getElementById('categorySums');

const chartCanvas = document.getElementById('chart');
const chartTypeSelect = document.getElementById('chartType');
const refreshChartBtn = document.getElementById('refreshChart');

const exportPdfBtn = document.getElementById('exportPDF');
const sendEmailBtn = document.getElementById('sendEmail');
const savePrefsBtn = document.getElementById('savePrefs');

// State
let allEntries = {};
let categories = ['Usługa', 'Produkt', 'Konsultacja', 'Inne'];
let activeDate = new Date().toISOString().slice(0, 10);
let chartInstance = null;

const fmt = {
    currency: new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }),
    time: new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit' }),
};

// --- Data Management ---

function loadData() {
    try {
        allEntries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
        if (prefs.categories && prefs.categories.length) {
            categories = prefs.categories;
        }
    } catch (e) {
        console.error("Błąd wczytywania danych:", e);
        allEntries = {};
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allEntries));
}

function savePrefs() {
    const newCategories = prompt("Podaj kategorie oddzielone przecinkami:", categories.join(', '));
    if (newCategories) {
        categories = newCategories.split(',').map(c => c.trim()).filter(Boolean);
        localStorage.setItem(PREFS_KEY, JSON.stringify({ categories }));
        populateCategorySelect();
        renderDay(activeDate);
        alert("Zapisano nowe kategorie.");
    }
}

// --- Rendering ---

function populateCategorySelect() {
    categorySelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function renderDaysList() {
    const dates = Object.keys(allEntries).sort().reverse().slice(0, 30);
    daysList.innerHTML = dates.map(date => `
        <li class="${date === activeDate ? 'active' : ''}" data-date="${date}">
            <span>${date}</span>
            <button data-delete-date="${date}" title="Usuń dzień">×</button>
        </li>
    `).join('');
}

function renderDay(date) {
    activeDate = date;
    currentDateEl.textContent = date;
    dateInput.value = date;

    const entries = allEntries[date] || [];
    entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    if (!entries.length) {
        entriesTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#64748b;">Brak wpisów dla tego dnia.</td></tr>`;
    } else {
        entriesTableBody.innerHTML = entries.map(entry => `
            <tr>
                <td>${fmt.time.format(new Date(entry.timestamp))}</td>
                <td>${entry.category}</td>
                <td>${fmt.currency.format(entry.income)}</td>
                <td>${entry.notes || '-'}</td>
                <td><button class="delete-btn" data-id="${entry.id}" title="Usuń wpis">×</button></td>
            </tr>
        `).join('');
    }

    renderCategorySums(entries);
    renderDaysList();
    renderChart(entries);
}

function renderCategorySums(entries) {
    const sums = entries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + entry.income;
        return acc;
    }, {});

    const total = entries.reduce((sum, entry) => sum + entry.income, 0);

    if (Object.keys(sums).length === 0) {
        categorySumsTable.innerHTML = `<tr><td style="color:#64748b;">Brak danych do podsumowania.</td></tr>`;
        return;
    }

    categorySumsTable.innerHTML = Object.entries(sums)
        .map(([category, sum]) => `
            <tr>
                <td>${category}</td>
                <td>${fmt.currency.format(sum)}</td>
            </tr>
        `).join('') + `
        <tr style="font-weight:700; border-top: 2px solid var(--border);">
            <td>Suma</td>
            <td>${fmt.currency.format(total)}</td>
        </tr>`;
}

function renderChart(entries) {
    if (!chartInstance && !entries.length) {
        chartCanvas.getContext('2d').clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        return;
    }

    if (!entries.length) {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        chartCanvas.getContext('2d').clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        return;
    }

    const type = chartTypeSelect.value;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        plugins: {
            legend: {
                position: type === 'pie' ? 'right' : 'top',
                display: type !== 'line'
            }
        }
    };

    let newChartData;

    if (type === 'pie') {
        const sums = entries.reduce((acc, entry) => {
            acc[entry.category] = (acc[entry.category] || 0) + entry.income;
            return acc;
        }, {});
        newChartData = {
            labels: Object.keys(sums),
            datasets: [{
                label: 'Podział przychodów',
                data: Object.values(sums),
                backgroundColor: ['#f97316', '#ea580c', '#d97706', '#fb923c', '#fdba74'],
            }]
        };
    } else {
        const historyDates = Object.keys(allEntries).sort().slice(-30);
        const historyTotals = historyDates.map(date =>
            (allEntries[date] || []).reduce((sum, entry) => sum + entry.income, 0)
        );
        newChartData = {
            labels: historyDates,
            datasets: [{
                label: 'Przychody w czasie',
                data: historyTotals,
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                fill: true,
                tension: 0.3,
            }]
        };
    }

    if (chartInstance && chartInstance.config.type === type) {
        chartInstance.data = newChartData;
        chartInstance.options = chartOptions;
        chartInstance.update('none');
    } else {
        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(chartCanvas, {
            type: type,
            data: newChartData,
            options: chartOptions
        });
    }
}

// --- Event Handlers ---

function handleAddEntry(e) {
    e.preventDefault();
    const newEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        category: categorySelect.value,
        income: parseFloat(incomeInput.value),
        notes: notesInput.value.trim(),
    };

    if (!newEntry.category || isNaN(newEntry.income) || newEntry.income <= 0) {
        alert("Uzupełnij kategorię i poprawny przychód.");
        return;
    }

    const date = dateInput.value;
    if (!allEntries[date]) {
        allEntries[date] = [];
    }
    allEntries[date].push(newEntry);

    saveData();
    renderDay(date);
    form.reset();
    dateInput.value = date;
}

function handleTableClick(e) {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const entryId = deleteBtn.dataset.id;
        if (confirm("Czy na pewno usunąć ten wpis?")) {
            allEntries[activeDate] = allEntries[activeDate].filter(entry => entry.id !== entryId);
            if (allEntries[activeDate].length === 0) {
                delete allEntries[activeDate];
            }
            saveData();
            renderDay(activeDate);
        }
    }
}

function handleDaysListClick(e) {
    const dayLi = e.target.closest('li[data-date]');
    const deleteBtn = e.target.closest('button[data-delete-date]');

    if (deleteBtn) {
        e.stopPropagation();
        const dateToDelete = deleteBtn.dataset.deleteDate;
        if (confirm(`Czy na pewno usunąć wszystkie wpisy z dnia ${dateToDelete}?`)) {
            delete allEntries[dateToDelete];
            saveData();
            if (activeDate === dateToDelete) {
                activeDate = new Date().toISOString().slice(0, 10);
            }
            renderDay(activeDate);
        }
    } else if (dayLi) {
        renderDay(dayLi.dataset.date);
    }
}

function handleClearDay() {
    if (confirm(`Czy na pewno usunąć wszystkie wpisy z dnia ${activeDate}?`)) {
        delete allEntries[activeDate];
        saveData();
        renderDay(activeDate);
    }
}

function generateReportText(forEmail = false) {
    const entries = allEntries[activeDate] || [];
    if (!entries.length) return "Brak danych dla tego dnia.";

    let companyName = 'Raport dzienny';
    try {
        const profile = JSON.parse(localStorage.getItem(COMPANY_PROFILE_KEY) || '{}');
        if (profile.name) companyName = `Raport dzienny: ${profile.name}`;
    } catch {}

    const total = entries.reduce((sum, entry) => sum + entry.income, 0);
    const sums = entries.reduce((acc, entry) => {
        acc[entry.category] = (acc[entry.category] || 0) + entry.income;
        return acc;
    }, {});

    const separator = forEmail ? "<br>" : "\n";
    let report = `${companyName} - ${activeDate}${separator}${separator}`;
    report += `Podsumowanie:${separator}`;
    report += Object.entries(sums).map(([cat, sum]) => `- ${cat}: ${fmt.currency.format(sum)}`).join(separator);
    report += `${separator}--------------------${separator}`;
    report += `Suma dnia: ${fmt.currency.format(total)}${separator}${separator}`;
    report += `Szczegółowe wpisy:${separator}`;
    report += entries.map(e => `- ${fmt.time.format(new Date(e.timestamp))} | ${e.category} | ${fmt.currency.format(e.income)} | ${e.notes || ''}`).join(separator);

    return report;
}

function handleSendEmail() {
    const body = encodeURIComponent(generateReportText(true));
    const subject = encodeURIComponent(`Raport dzienny ${activeDate}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

async function handleExportPdf() {
    if (!window.pdfMake) {
        alert("Biblioteka pdfmake nie jest załadowana.");
        return;
    }

    const entries = allEntries[activeDate] || [];
    if (!entries.length) {
        alert("Brak wpisów dla tego dnia do wygenerowania raportu.");
        return;
    }

    let companyName = 'Raport dzienny';
    try {
        const profile = JSON.parse(localStorage.getItem(COMPANY_PROFILE_KEY) || '{}');
        if (profile.name) companyName = `Raport dzienny: ${profile.name}`;
    } catch {}

    const total = entries.reduce((sum, entry) => sum + entry.income, 0);

    const tableBody = [
        ['Godzina', 'Kategoria', 'Przychód', 'Notatki'].map(h => ({ text: h, style: 'tableHeader' }))
    ];
    entries.forEach(e => {
        tableBody.push([
            fmt.time.format(new Date(e.timestamp)),
            e.category,
            fmt.currency.format(e.income),
            e.notes || '-'
        ]);
    });

    const docDefinition = {
        content: [
            { text: companyName, style: 'header' },
            { text: `Data: ${activeDate}`, style: 'subheader', margin: [0, 2, 0, 20] },
            {
                layout: 'lightHorizontalLines',
                table: {
                    headerRows: 1,
                    widths: ['auto', '*', 'auto', '*'],
                    body: tableBody
                }
            },
            { text: `Suma dnia: ${fmt.currency.format(total)}`, style: 'total', alignment: 'right', margin: [0, 20, 0, 0] }
        ],
        styles: {
            header: { fontSize: 18, bold: true, color: '#0f172a', margin: [0, 0, 0, 10] },
            subheader: { fontSize: 14, color: '#475569' },
            tableHeader: { bold: true, fontSize: 10, color: '#475569' },
            total: { fontSize: 14, bold: true, color: '#f97316' }
        },
        defaultStyle: {
            fontSize: 10,
            color: '#0f172a'
        }
    };

    pdfMake.createPdf(docDefinition).download(`raport-${activeDate}.pdf`);
}

// --- Initialization ---

function init() {
    loadData();
    populateCategorySelect();
    renderDay(activeDate);

    form.addEventListener('submit', handleAddEntry);
    entriesTableBody.addEventListener('click', handleTableClick);
    daysList.addEventListener('click', handleDaysListClick);
    clearDayBtn.addEventListener('click', handleClearDay);
    savePrefsBtn.addEventListener('click', savePrefs);

    chartTypeSelect.addEventListener('change', () => renderChart(allEntries[activeDate] || []));

    sendEmailBtn.addEventListener('click', handleSendEmail);
    exportPdfBtn.addEventListener('click', handleExportPdf);
}

document.addEventListener('DOMContentLoaded', init);