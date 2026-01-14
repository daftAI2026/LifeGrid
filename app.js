import { countries, getTimezone } from './data/countries.js';
import { devices } from './data/devices.js';

// ===== State =====
const state = {
    calendarType: 'year',
    country: null,
    timezone: null,
    bgColor: '#111114',
    accentColor: '#FFD700',
    width: 1179,
    height: 2556,
    dob: null,
    lifespan: 80,
    goalName: 'Goal',
    goalDate: null
};

// Backend URL - update this when deploying
const WORKER_URL = 'https://life-calendar.your-worker.workers.dev';

// ===== DOM Elements =====
const elements = {
    calendarTypes: document.querySelectorAll('.calendar-type'),
    countrySearch: document.getElementById('country-search'),
    countryList: document.getElementById('country-list'),
    selectedCountry: document.getElementById('selected-country'),
    lifeOptions: document.getElementById('life-options'),
    goalOptions: document.getElementById('goal-options'),
    bgColor: document.getElementById('bg-color'),
    bgValue: document.getElementById('bg-value'),
    accentColor: document.getElementById('accent-color'),
    accentValue: document.getElementById('accent-value'),
    deviceSelect: document.getElementById('device-select'),
    customSize: document.getElementById('custom-size'),
    customWidth: document.getElementById('custom-width'),
    customHeight: document.getElementById('custom-height'),
    dob: document.getElementById('dob'),
    lifespan: document.getElementById('lifespan'),
    goalName: document.getElementById('goal-name'),
    goalDate: document.getElementById('goal-date'),
    preview: document.getElementById('preview'),
    generatedUrl: document.getElementById('generated-url'),
    copyBtn: document.getElementById('copy-btn')
};

// ===== Country Selector =====
function initCountrySelector() {
    // Populate country list
    renderCountryList(countries);

    // Search functionality
    elements.countrySearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = countries.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query)
        );
        renderCountryList(filtered);
    });

    // Show/hide dropdown
    elements.countrySearch.addEventListener('focus', () => {
        elements.countryList.classList.add('open');
    });

    elements.countrySearch.addEventListener('blur', () => {
        // Delay to allow click on item
        setTimeout(() => {
            elements.countryList.classList.remove('open');
        }, 200);
    });

    // Try to auto-detect country
    autoDetectCountry();
}

function renderCountryList(countryData) {
    elements.countryList.innerHTML = countryData.map(country => `
    <div class="country-item" data-code="${country.code}">
      <span class="flag">${getFlagEmoji(country.code)}</span>
      <span class="name">${country.name}</span>
      <span class="tz">${country.timezone}</span>
    </div>
  `).join('');

    // Add click handlers
    elements.countryList.querySelectorAll('.country-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.dataset.code;
            selectCountry(code);
        });
    });
}

function selectCountry(code) {
    const country = countries.find(c => c.code === code);
    if (!country) return;

    state.country = code;
    state.timezone = country.timezone;

    // Update UI
    elements.selectedCountry.innerHTML = `
    <span class="country-flag">${getFlagEmoji(code)}</span>
    <span class="country-name">${country.name}</span>
    <span class="country-tz">${country.timezone}</span>
  `;

    elements.countrySearch.value = '';
    elements.countryList.classList.remove('open');

    updateURL();
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

async function autoDetectCountry() {
    try {
        // Use timezone to guess country
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const country = countries.find(c => c.timezone === tz);
        if (country) {
            selectCountry(country.code);
        }
    } catch (e) {
        console.log('Could not auto-detect country');
    }
}

// ===== Calendar Type Selector =====
function initCalendarTypes() {
    elements.calendarTypes.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            elements.calendarTypes.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update state
            state.calendarType = btn.dataset.type;

            // Show/hide conditional options
            elements.lifeOptions.classList.toggle('hidden', state.calendarType !== 'life');
            elements.goalOptions.classList.toggle('hidden', state.calendarType !== 'goal');

            updateURL();
        });
    });
}

// ===== Color Pickers =====
function initColorPickers() {
    // Background color
    elements.bgColor.addEventListener('input', (e) => {
        state.bgColor = e.target.value;
        elements.bgValue.textContent = e.target.value;
        updateURL();
        updatePreview();
    });

    // Accent color
    elements.accentColor.addEventListener('input', (e) => {
        state.accentColor = e.target.value;
        elements.accentValue.textContent = e.target.value;
        updateURL();
        updatePreview();
    });

    // Color presets
    document.querySelectorAll('.color-presets').forEach(presetGroup => {
        const target = presetGroup.dataset.target;
        presetGroup.querySelectorAll('.preset').forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                const input = document.getElementById(target);
                const valueDisplay = document.getElementById(target.replace('color', 'value'));

                input.value = color;
                valueDisplay.textContent = color;

                if (target === 'bg-color') {
                    state.bgColor = color;
                } else {
                    state.accentColor = color;
                }

                updateURL();
                updatePreview();
            });
        });
    });
}

// ===== Device Selector =====
function initDeviceSelector() {
    elements.deviceSelect.addEventListener('change', (e) => {
        const value = e.target.value;

        if (value === 'custom') {
            elements.customSize.classList.remove('hidden');
        } else {
            elements.customSize.classList.add('hidden');
            const [width, height] = value.split('x').map(Number);
            state.width = width;
            state.height = height;
            updateURL();
        }
    });

    elements.customWidth.addEventListener('input', (e) => {
        state.width = parseInt(e.target.value) || 1179;
        updateURL();
    });

    elements.customHeight.addEventListener('input', (e) => {
        state.height = parseInt(e.target.value) || 2556;
        updateURL();
    });
}

// ===== Life Calendar Options =====
function initLifeOptions() {
    elements.dob.addEventListener('change', (e) => {
        state.dob = e.target.value;
        updateURL();
    });

    elements.lifespan.addEventListener('input', (e) => {
        state.lifespan = parseInt(e.target.value) || 80;
        updateURL();
    });
}

// ===== Goal Options =====
function initGoalOptions() {
    elements.goalName.addEventListener('input', (e) => {
        state.goalName = e.target.value || 'Goal';
        updateURL();
    });

    elements.goalDate.addEventListener('change', (e) => {
        state.goalDate = e.target.value;
        updateURL();
    });
}

// ===== URL Builder =====
function updateURL() {
    if (!state.country) {
        elements.generatedUrl.value = 'Please select a country first';
        return;
    }

    // Build params
    const params = new URLSearchParams();
    params.set('country', state.country.toLowerCase());
    params.set('type', state.calendarType);
    params.set('bg', state.bgColor.replace('#', ''));
    params.set('accent', state.accentColor.replace('#', ''));
    params.set('width', state.width);
    params.set('height', state.height);

    // Add conditional params
    if (state.calendarType === 'life') {
        if (state.dob) params.set('dob', state.dob);
        params.set('lifespan', state.lifespan);
    }

    if (state.calendarType === 'goal') {
        if (state.goalDate) params.set('goal', state.goalDate);
        if (state.goalName) params.set('goalName', encodeURIComponent(state.goalName));
    }

    const url = `${WORKER_URL}/generate?${params.toString()}`;
    elements.generatedUrl.value = url;

    updatePreview();
}

// ===== Copy Button =====
function initCopyButton() {
    elements.copyBtn.addEventListener('click', async () => {
        const url = elements.generatedUrl.value;
        if (!url || url.startsWith('Please')) return;

        try {
            await navigator.clipboard.writeText(url);
            const btnText = elements.copyBtn.querySelector('span');
            btnText.textContent = 'Copied!';
            setTimeout(() => {
                btnText.textContent = 'Copy';
            }, 2000);
        } catch (e) {
            console.error('Failed to copy:', e);
        }
    });
}

// ===== Preview Generator =====
function updatePreview() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Use scaled down size for preview
    const scale = 0.15;
    canvas.width = state.width * scale;
    canvas.height = state.height * scale;

    // Background
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw calendar preview based on type
    switch (state.calendarType) {
        case 'year':
            drawYearPreview(ctx, canvas.width, canvas.height);
            break;
        case 'life':
            drawLifePreview(ctx, canvas.width, canvas.height);
            break;
        case 'goal':
            drawGoalPreview(ctx, canvas.width, canvas.height);
            break;
    }

    // Clear and add canvas to preview
    elements.preview.innerHTML = '';
    elements.preview.appendChild(canvas);
}

function drawYearPreview(ctx, width, height) {
    const cols = 7;
    const rows = Math.ceil(365 / cols);
    const padding = width * 0.1;
    const gap = 3;
    const cellSize = (width - padding * 2 - gap * (cols - 1)) / cols;

    const startY = height * 0.35;

    // Calculate current day of year
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    for (let i = 0; i < 365; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padding + col * (cellSize + gap);
        const y = startY + row * (cellSize + gap);

        ctx.fillStyle = i < dayOfYear ? state.accentColor : 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(x, y, cellSize, cellSize, 1);
        ctx.fill();
    }
}

function drawLifePreview(ctx, width, height) {
    const cols = 52; // weeks per year
    const rows = state.lifespan;
    const padding = width * 0.05;
    const gap = 1;
    const cellSize = Math.min(
        (width - padding * 2 - gap * (cols - 1)) / cols,
        (height * 0.6 - gap * (rows - 1)) / rows
    );

    const startY = height * 0.2;

    // Calculate weeks lived (simplified for preview)
    let weeksLived = 0;
    if (state.dob) {
        const dob = new Date(state.dob);
        const now = new Date();
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        weeksLived = Math.floor((now - dob) / msPerWeek);
    }

    const totalWeeks = rows * cols;

    for (let i = 0; i < Math.min(totalWeeks, 2000); i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padding + col * (cellSize + gap);
        const y = startY + row * (cellSize + gap);

        ctx.fillStyle = i < weeksLived ? state.accentColor : 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGoalPreview(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.3;

    // Calculate days remaining
    let progress = 0;
    let daysRemaining = 0;
    if (state.goalDate) {
        const goal = new Date(state.goalDate);
        const now = new Date();
        const total = 365; // Assume 1 year goal for simplicity
        daysRemaining = Math.max(0, Math.ceil((goal - now) / (1000 * 60 * 60 * 24)));
        progress = Math.max(0, Math.min(1, 1 - (daysRemaining / total)));
    }

    // Background circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
    ctx.strokeStyle = state.accentColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
    ctx.stroke();

    // Days remaining text
    ctx.fillStyle = state.accentColor;
    ctx.font = `bold ${width * 0.12}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(daysRemaining.toString(), centerX, centerY - 5);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = `${width * 0.04}px Inter, sans-serif`;
    ctx.fillText('days left', centerX, centerY + 15);
}

// ===== Initialize =====
function init() {
    initCountrySelector();
    initCalendarTypes();
    initColorPickers();
    initDeviceSelector();
    initLifeOptions();
    initGoalOptions();
    initCopyButton();

    // Initial preview
    updatePreview();
}

// Start app
init();
