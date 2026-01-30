/**
 * [INPUT]: 依赖 ./data/countries.js 的 countries 数据，依赖 ./data/devices.js 的 devices/getDevice，依赖 ./data/i18n.js 的 i18n 国际化服务
 * [OUTPUT]: 提供 LifeGrid 主应用的完整交互逻辑、状态管理和 UI 渲染
 * [POS]: 应用顶层入口，聚合所有业务逻辑和用户交互
 * [PROTOCOL]: 修改时更新此头部，确保依赖关系准确；涉及翻译改动需同步检查 data/i18n.js
 */

import { countries } from './data/countries.js';
import { devices, getDevice } from './data/devices.js';
import { i18nData, countryToLang, DEFAULT_LANG, SUPPORTED_LANGS } from './data/i18n.js';

// ===== Configuration =====
const WORKER_URL = 'https://lifegrid.flydogcn.workers.dev';

// ===== i18n Helper =====
function i18n(key) {
    // 从 window.i18n 获取当前语言和翻译
    if (window.i18n && window.i18n.get) {
        return window.i18n.get(key);
    }
    // 回退：直接用 i18nData
    const lang = DEFAULT_LANG;
    if (!i18nData[lang] || !i18nData[lang][key]) {
        return i18nData[DEFAULT_LANG]?.[key] || key;
    }
    return i18nData[lang][key];
}

// ===== 壁纸文字国际化 Helper =====
function getWallpaperText(key, value) {
    // 使用 state.wallpaperLang，支持 {n} 占位符
    const lang = state.wallpaperLang || DEFAULT_LANG;
    const text = i18nData[lang]?.[key] || i18nData[DEFAULT_LANG]?.[key] || key;
    return text.replace('{n}', value);
}

// ===== Device State Machine (TODO-4 实现) =====
const DeviceState = Object.freeze({
    INITIALIZING: 'initializing',  // 正在探测默认设备
    SELECTED: 'selected',          // 已成功选中设备
    FALLBACK: 'fallback'           // 降级到默认设备
});

// ===== State =====
const state = {
    selectedType: null,
    country: null,
    timezone: null,
    bgColor: '#000000',
    accentColor: '#FFFFFF',
    originalAccentColor: '#FFFFFF',  // 用户原始选择的强调色
    width: 1179,
    height: 2556,
    clockHeight: 0.18,  // Space for iPhone clock/date
    dob: null,
    lifespan: 80,
    goalName: i18n('config.goalName'),
    goalDate: null,
    selectedDevice: null,
    deviceState: DeviceState.INITIALIZING,
    wallpaperLang: null,
    wallpaperLangLocked: false
};

// ===== 统一状态更新入口 =====
function setState(updates, options = {}) {
    Object.assign(state, updates);
    if (!options.silent) {
        // 检查颜色撞车并同步选择器
        syncAccentColorPicker();
        render();
    }
}

// ===== 强调色选择器同步逻辑 =====
function syncAccentColorPicker() {
    const safeAccent = getSafeAccent(state.bgColor, state.originalAccentColor);
    state.accentColor = safeAccent;

    // 同步 UI
    if (elements.accentColor) {
        elements.accentColor.value = safeAccent;
    }
    if (elements.accentHex) {
        elements.accentHex.textContent = safeAccent.toUpperCase();
    }
}

// ===== 统一渲染入口 =====
function render() {
    updatePreview();
    updateURL();
}

// ===== DOM Elements =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const elements = {
    typeCards: $$('.type-card'),
    selectedTypeIndicator: $('#selected-type .indicator-value'),
    countrySelect: $('#country-select'),
    wallpaperLangSelect: $('#wallpaper-lang-select'),
    deviceSelect: $('#device-select'),
    deviceResolution: $('#device-resolution'),
    bgColor: $('#bg-color'),
    bgHex: $('#bg-hex'),
    accentColor: $('#accent-color'),
    accentHex: $('#accent-hex'),
    presetBtns: $$('.preset-btn'),
    dobInput: $('#dob-input'),
    lifespanInput: $('#lifespan-input'),
    goalNameInput: $('#goal-name-input'),
    goalDateInput: $('#goal-date-input'),
    lifeConfig: $('#life-config'),
    goalConfig: $('#goal-config'),
    previewScreen: $('#preview-screen'),
    generatedUrl: $('#generated-url'),
    copyBtn: $('#copy-btn'),
    yearDay: $('#year-day'),
    yearWeek: $('#year-week'),
    yearPercent: $('#year-percent')
};

// ===== Initialize =====
function init() {
    populateCountries();
    populateDevices();
    populateCardPreviews();
    updateYearStats();
    bindEvents();
    autoDetectCountry();
    // Default to iOS
    switchSetupPlatform('ios');

    // 初始化壁纸语言：跟随网站语言
    const initialLang = window.i18n?.getCurrentLang() || 'en';
    state.wallpaperLang = initialLang;
    if (elements.wallpaperLangSelect) {
        elements.wallpaperLangSelect.value = initialLang;
    }

    // 监听网站语言变化：未锁定时跟随
    window.addEventListener('i18n-changed', (e) => {
        if (!state.wallpaperLangLocked) {
            state.wallpaperLang = e.detail.lang;
            if (elements.wallpaperLangSelect) {
                elements.wallpaperLangSelect.value = e.detail.lang;
            }
            render();
        }
    });
}

// ===== Populate Countries =====
function populateCountries() {
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${getFlagEmoji(country.code)} ${country.name}`;
        elements.countrySelect.appendChild(option);
    });
}

function getFlagEmoji(code) {
    const codePoints = code.toUpperCase().split('').map(c => 127397 + c.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

// ===== Populate Devices (TODO-4: 状态机驱动) =====
function populateDevices() {
    // Group devices by category
    const categories = {};
    devices.forEach(device => {
        if (!categories[device.category]) {
            categories[device.category] = [];
        }
        categories[device.category].push(device);
    });

    // Create optgroups
    Object.entries(categories).forEach(([category, deviceList]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        deviceList.forEach(device => {
            const option = document.createElement('option');
            option.value = device.name;
            option.textContent = device.name;
            option.dataset.width = device.width;
            option.dataset.height = device.height;
            option.dataset.clockHeight = device.clockHeight;
            optgroup.appendChild(option);
        });

        elements.deviceSelect.appendChild(optgroup);
    });

    // 状态机驱动的设备初始化
    initializeDevice();
}

/**
 * 设备初始化状态机入口 (TODO-4)
 * 状态转换: INITIALIZING → SELECTED | FALLBACK
 */
function initializeDevice() {
    const PREFERRED_DEVICE = 'iPhone 16 Pro';
    const preferredDevice = devices.find(d => d.name === PREFERRED_DEVICE);

    if (preferredDevice) {
        // 首选设备存在 → SELECTED
        transitionDeviceState(DeviceState.SELECTED, preferredDevice);
    } else if (devices.length > 0) {
        // 首选不存在但有其他设备 → FALLBACK
        console.warn(`[DeviceStateMachine] "${PREFERRED_DEVICE}" not found, falling back to "${devices[0].name}"`);
        transitionDeviceState(DeviceState.FALLBACK, devices[0]);
    } else {
        // 无设备可用（极端情况）
        console.error('[DeviceStateMachine] No devices available!');
        state.deviceState = DeviceState.FALLBACK;
    }
}

/**
 * 设备状态转换器 (TODO-4)
 * 统一的状态转换逻辑，确保所有变更可追溯
 */
function transitionDeviceState(newState, device) {
    const prevState = state.deviceState;
    state.deviceState = newState;

    if (device) {
        state.selectedDevice = device;
        state.width = device.width;
        state.height = device.height;
        state.clockHeight = device.clockHeight || 0.18;

        elements.deviceSelect.value = device.name;
        elements.deviceResolution.textContent = `${device.width} × ${device.height}`;
    }

    // 状态转换日志（开发调试用）
    if (prevState !== newState) {
        console.log(`[DeviceStateMachine] ${prevState} → ${newState}${device ? ` (${device.name})` : ''}`);
    }

    // 仅在非初始化阶段触发渲染（初始化时由 init() 统一调度）
    if (prevState !== DeviceState.INITIALIZING) {
        render();
    }
}

// ===== Card Previews =====
function populateCardPreviews() {
    // Year Grid Preview - 15 columns now
    const yearGrid = $('.year-grid-preview');
    yearGrid.innerHTML = '';
    const dayOfYear = getDayOfYear();
    for (let i = 0; i < 45; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell' + (i < Math.floor(dayOfYear / 8) ? ' filled' : '');
        yearGrid.appendChild(cell);
    }

    // Life Grid Preview
    const lifeGrid = $('.life-grid-preview');
    lifeGrid.innerHTML = '';
    for (let i = 0; i < 65; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i < 25 ? ' filled' : '');
        lifeGrid.appendChild(dot);
    }
}

function updateYearStats() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const weekOfYear = Math.ceil(dayOfYear / 7);
    const totalDays = isLeapYear(now.getFullYear()) ? 366 : 365;
    const percent = Math.round((dayOfYear / totalDays) * 100);

    elements.yearDay.textContent = dayOfYear;
    elements.yearWeek.textContent = weekOfYear;
    elements.yearPercent.textContent = percent + '%';
}

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// ===== Auto-detect Country =====
function autoDetectCountry() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const country = countries.find(c => c.timezone === tz);
        if (country) {
            elements.countrySelect.value = country.code;
            state.country = country.code;
            state.timezone = country.timezone;
        }
    } catch (e) {
        console.log(i18n('debug.autoDetectFailed'));
    }
}

// ===== Event Bindings =====
function bindEvents() {
    // Type Card Selection
    elements.typeCards.forEach(card => {
        card.addEventListener('click', () => selectType(card.dataset.type));
    });

    // Country Select
    elements.countrySelect.addEventListener('change', (e) => {
        const country = countries.find(c => c.code === e.target.value);
        if (country) {
            setState({
                country: country.code,
                timezone: country.timezone
            });
        }
    });

    // Device Select
    elements.deviceSelect.addEventListener('change', (e) => {
        selectDevice(e.target.value);
    });

    // Wallpaper Language Select (壁纸语言选择器)
    elements.wallpaperLangSelect?.addEventListener('change', (e) => {
        state.wallpaperLang = e.target.value;
        state.wallpaperLangLocked = true;  // 手动选择后锁定，不再跟随网站语言
        render();
    });

    // Color Pickers
    elements.bgColor.addEventListener('input', (e) => {
        elements.bgHex.textContent = e.target.value.toUpperCase();
        setState({ bgColor: e.target.value });
    });

    // 强调色选择器：更新 originalAccentColor
    elements.accentColor.addEventListener('input', (e) => {
        const newAccent = e.target.value;
        state.originalAccentColor = newAccent;  // 保存用户原始选择
        elements.accentHex.textContent = newAccent.toUpperCase();
        setState({ accentColor: newAccent });
    });

    // Make color wrappers clickable
    $$('.color-input-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                wrapper.querySelector('input[type="color"]').click();
            }
        });
    });

    // Color Presets
    elements.presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const bg = btn.dataset.bg;
            const accent = btn.dataset.accent;

            elements.bgColor.value = bg;
            elements.bgHex.textContent = bg.toUpperCase();
            elements.accentColor.value = accent;
            elements.accentHex.textContent = accent.toUpperCase();

            // 同时更新 originalAccentColor
            state.originalAccentColor = accent;
            setState({ bgColor: bg, accentColor: accent });
        });
    });

    // Life Calendar Inputs
    elements.dobInput?.addEventListener('change', (e) => {
        setState({ dob: e.target.value });
    });

    elements.lifespanInput?.addEventListener('input', (e) => {
        setState({ lifespan: parseInt(e.target.value) || 80 });
    });

    // Goal Inputs
    elements.goalNameInput?.addEventListener('input', (e) => {
        setState({ goalName: e.target.value || i18n('config.goalName') });
    });

    elements.goalDateInput?.addEventListener('change', (e) => {
        setState({ goalDate: e.target.value });
    });

    // Copy Button
    elements.copyBtn.addEventListener('click', copyURL);

    // Sidebar Items
    const setupItems = $$('.setup-sidebar-item');
    setupItems.forEach(item => {
        item.addEventListener('click', () => {
            switchSetupPlatform(item.dataset.platform);
        });
    });
}

// ===== Setup Switching =====
function switchSetupPlatform(platform) {
    // Update Sidebar
    const items = $$('.setup-sidebar-item');
    items.forEach(i => {
        i.classList.toggle('active', i.dataset.platform === platform);
    });

    // Update Content
    const wrappers = $$('.setup-content-wrapper');
    wrappers.forEach(w => {
        w.classList.remove('active');
        if (w.id === `setup-${platform}`) {
            // Small timeout to allow display:block to apply before animation if needed
            // But CSS animation handles it on class add
            w.classList.add('active');
        }
    });
}

// ===== Device Selection (TODO-4: 状态机驱动) =====
function selectDevice(deviceName) {
    const device = devices.find(d => d.name === deviceName);

    if (!device) {
        // 找不到设备 → 尝试降级
        console.warn(`[DeviceStateMachine] Device "${deviceName}" not found, attempting fallback`);
        if (devices.length > 0 && state.selectedDevice?.name !== devices[0].name) {
            transitionDeviceState(DeviceState.FALLBACK, devices[0]);
        }
        return;
    }

    // 用户手动选择 → 始终进入 SELECTED 状态
    transitionDeviceState(DeviceState.SELECTED, device);
}

// ===== Type Selection =====
function selectType(type) {
    state.selectedType = type;

    // Update card states
    elements.typeCards.forEach(card => {
        card.classList.toggle('selected', card.dataset.type === type);
    });

    // Update indicator
    const typeNames = {
        year: i18n('type.year.name'),
        life: i18n('type.life.name'),
        goal: i18n('type.goal.name')
    };
    elements.selectedTypeIndicator.textContent = typeNames[type];

    // Show/hide conditional config
    elements.lifeConfig?.classList.toggle('hidden', type !== 'life');
    elements.goalConfig?.classList.toggle('hidden', type !== 'goal');

    // Scroll to customize section
    $('#customize').scrollIntoView({ behavior: 'smooth', block: 'start' });

    render();
}

// ===== Preview Generator =====
function updatePreview() {
    if (!state.selectedType) {
        elements.previewScreen.innerHTML = `<div class="preview-placeholder"><span>${i18n('preview.selectType')}</span></div>`;
        return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Preview dimensions - higher scale for better quality
    const scale = 0.8;
    canvas.width = state.width * scale;
    canvas.height = state.height * scale;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'cover';  // cover 确保完全覆盖，无留白
    canvas.style.borderRadius = '24px';


    // Background
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    switch (state.selectedType) {
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

    elements.previewScreen.innerHTML = '';
    elements.previewScreen.appendChild(canvas);
}

// ===== 网格统计文本渲染器 =====
function drawStats(ctx, width, y, text1, text2, fontScale = 1) {
    const font1 = `500 ${width * 0.032 * fontScale}px Inter, sans-serif`;
    const font2 = `500 ${width * 0.032 * fontScale}px "SF Mono", "Menlo", "Courier New", monospace`;

    ctx.font = font1;
    const w1 = ctx.measureText(text1).width;
    ctx.font = font2;
    const w2 = ctx.measureText(text2).width;

    const totalW = w1 + w2;
    const x = (width - totalW) / 2;

    // Part 1: 安全强调色
    ctx.fillStyle = getSafeAccent(state.bgColor, state.accentColor);
    ctx.font = font1;
    ctx.textAlign = 'left';
    ctx.fillText(text1, x, y);

    // Part 2: 动态对比色
    ctx.fillStyle = contrastAlpha(state.bgColor, 0.5);
    ctx.font = font2;
    ctx.fillText(text2, x + w1, y);
}

function drawYearPreview(ctx, width, height) {
    const cols = 15;
    const totalDays = isLeapYear(new Date().getFullYear()) ? 366 : 365;
    const rows = Math.ceil(totalDays / cols);

    // Leave space for clock at top (increased margin)
    // Extra clearance for clock
    const clockSpace = height * (state.clockHeight + 0.05);
    const padding = width * 0.20;  // 20% horizontal padding
    const statsHeight = height * 0.05;
    const bottomMargin = height * 0.05;

    const availableWidth = width - (padding * 2);
    // Constrain height to avoid grid becoming too tall
    const availableHeight = height - clockSpace - statsHeight - bottomMargin;

    // Tighter gap
    const gap = Math.max(2, width * 0.008);
    const cellWidth = (availableWidth - (gap * (cols - 1))) / cols;

    // Ensure cells don't get too big vertically if there's excess height
    const cellHeight = cellWidth; // Keep it square based on width constraint
    const cellSize = cellWidth;
    const dotRadius = (cellSize / 2) * 0.85;

    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));

    const startX = (width - gridWidth) / 2;
    // Push down slightly more to ensure clock clearance
    const startY = clockSpace + (height * 0.02);

    const dayOfYear = getDayOfYear();

    // Draw dots grid
    for (let i = 0; i < totalDays; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isCompleted = i < dayOfYear;
        const isToday = i === dayOfYear - 1;

        // 安全强调色：仅在与背景撞车时反转
        const safeAccent = getSafeAccent(state.bgColor, state.accentColor);

        if (isToday) {
            ctx.fillStyle = safeAccent;
            ctx.beginPath();
            ctx.arc(cx, cy, dotRadius * 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else if (isCompleted) {
            ctx.fillStyle = hexToRgba(safeAccent, 0.75);
            ctx.beginPath();
            ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 背景圆点：根据背景亮度自动选择对比色
            ctx.fillStyle = contrastAlpha(state.bgColor, 0.12);
            ctx.beginPath();
            ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Stats just below the grid with padding
    const daysLeft = totalDays - dayOfYear;
    const percent = Math.round((dayOfYear / totalDays) * 100);
    const statsY = startY + gridHeight + (height * 0.03);

    const daysText = getWallpaperText(daysLeft === 1 ? 'wallpaper.dayLeft' : 'wallpaper.daysLeft', daysLeft);
    const completeText = getWallpaperText('wallpaper.complete', percent);
    drawStats(ctx, width, statsY, daysText, ` · ${completeText}`);
}

function drawLifePreview(ctx, width, height) {
    const cols = 52;
    const lifespan = state.lifespan || 80;
    const rows = lifespan;

    // Leave space for clock at top
    const clockSpace = height * state.clockHeight;
    const padding = width * 0.04;
    const statsHeight = height * 0.06;

    const availableWidth = width - (padding * 2);
    const availableHeight = height - clockSpace - statsHeight - (height * 0.05);

    const gap = Math.max(1.5, width * 0.003);
    const cellSize = Math.min(
        (availableWidth - (gap * (cols - 1))) / cols,
        (availableHeight - (gap * (rows - 1))) / rows
    );
    const radius = cellSize / 2 - 0.5;

    // Calculate weeks lived
    let weeksLived = 0;
    if (state.dob) {
        const dob = new Date(state.dob);
        const now = new Date();
        const msPerWeek = 7 * 24 * 60 * 60 * 1000;
        weeksLived = Math.floor((now - dob) / msPerWeek);
    }

    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = clockSpace;

    // Dots
    const totalWeeks = rows * cols;
    for (let i = 0; i < totalWeeks; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isLived = i < weeksLived;
        const isCurrentWeek = i === weeksLived;

        // 安全强调色：仅在与背景撞车时反转
        const safeAccent = getSafeAccent(state.bgColor, state.accentColor);

        if (isCurrentWeek) {
            ctx.fillStyle = safeAccent;
        } else if (isLived) {
            ctx.fillStyle = hexToRgba(safeAccent, 0.75);
        } else {
            // 背景圆点：根据背景亮度自动选择对比色
            ctx.fillStyle = contrastAlpha(state.bgColor, 0.06);
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Stats just below grid with padding
    const weeksLeft = totalWeeks - weeksLived;
    const percent = Math.round((weeksLived / totalWeeks) * 100);
    const statsY = startY + gridHeight + (height * 0.035);

    const weeksText = getWallpaperText(weeksLeft === 1 ? 'wallpaper.weekLeft' : 'wallpaper.weeksLeft', weeksLeft.toLocaleString());
    const livedText = getWallpaperText('wallpaper.lived', percent);
    // fontScale 0.8 适配 52 列更密集的网格
    drawStats(ctx, width, statsY, weeksText, ` · ${livedText}`, 0.8);
}

function drawGoalPreview(ctx, width, height) {
    // Leave space for clock
    const clockSpace = height * state.clockHeight;
    const centerX = width / 2;
    const centerY = clockSpace + (height - clockSpace) * 0.4;
    const radius = width * 0.25;

    // Calculate days remaining
    let daysRemaining = 0;
    let progress = 0;
    if (state.goalDate) {
        const goal = new Date(state.goalDate);
        const now = new Date();
        daysRemaining = Math.max(0, Math.ceil((goal - now) / (1000 * 60 * 60 * 24)));
        progress = Math.min(1, 1 - (daysRemaining / 365));
    }

    const safeAccent = getSafeAccent(state.bgColor, state.accentColor);

    // Background circle - 使用动态对比色
    ctx.strokeStyle = contrastAlpha(state.bgColor, 0.1);
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arc
    if (progress > 0) {
        ctx.strokeStyle = safeAccent;
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress));
        ctx.stroke();
    }

    // Days number - 使用安全强调色
    ctx.fillStyle = safeAccent;
    ctx.font = `bold ${width * 0.14}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(daysRemaining.toString(), centerX, centerY - 4);

    // Label - 使用动态对比色
    ctx.fillStyle = contrastAlpha(state.bgColor, 0.5);
    ctx.font = `${width * 0.03}px Inter, sans-serif`;
    const daysLeftText = getWallpaperText(daysRemaining === 1 ? 'wallpaper.dayLeft' : 'wallpaper.daysLeft', daysRemaining);
    ctx.fillText(daysLeftText, centerX, centerY + (height * 0.08));


    // Goal name - 使用动态对比色
    if (state.goalName) {
        ctx.fillStyle = contrastAlpha(state.bgColor, 0.9);
        ctx.font = `600 ${width * 0.035}px Inter, sans-serif`;
        ctx.fillText(state.goalName, centerX, height * 0.75);
    }

    // Progress percentage
    // const percent = Math.round(progress * 100);
    // ctx.fillStyle = hexToRgba(state.accentColor, 0.6);
    // ctx.font = `500 ${width * 0.025}px Inter, sans-serif`;
    // ctx.fillText(`${percent}% complete`, centerX, height * 0.82);
}

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============================================================================
// 颜色对比度自适应工具
// ============================================================================

/**
 * 计算相对亮度 (ITU-R BT.709 / WCAG 2.0)
 * @param {string} hex - 十六进制颜色值
 * @returns {number} 0-1 范围的亮度值
 */
function getLuminance(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const toLinear = (c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * 获取对比基底色 RGB 字符串
 * @param {string} bgHex - 背景色
 * @returns {string} '255,255,255' 或 '0,0,0'
 */
function getContrastBase(bgHex) {
    return getLuminance(bgHex) > 0.5 ? '0,0,0' : '255,255,255';
}

/**
 * 生成与背景形成对比的半透明色
 * @param {string} bgHex - 背景色
 * @param {number} alpha - 透明度
 * @returns {string} rgba 颜色值
 */
function contrastAlpha(bgHex, alpha) {
    return `rgba(${getContrastBase(bgHex)}, ${alpha})`;
}

/**
 * 检测两个颜色是否太接近（对比度 < 2:1）
 * @param {string} hex1 - 颜色1
 * @param {string} hex2 - 颜色2
 * @returns {boolean} 是否撞车
 */
function isTooClose(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio < 2;
}

/**
 * 检测颜色是否接近纯黑或纯白
 * @param {string} hex - 颜色值
 * @returns {boolean} 是否是黑白色
 */
function isBlackOrWhite(hex) {
    const luminance = getLuminance(hex);
    return luminance < 0.1 || luminance > 0.9;
}

/**
 * 获取安全的强调色（仅当黑白色与背景撞车时反转）
 * @param {string} bgHex - 背景色
 * @param {string} accentHex - 用户选择的强调色
 * @returns {string} 安全的强调色
 */
function getSafeAccent(bgHex, accentHex) {
    // 只处理黑白色的情况
    if (isBlackOrWhite(accentHex) && isTooClose(bgHex, accentHex)) {
        return getLuminance(bgHex) > 0.5 ? '#000000' : '#FFFFFF';
    }
    return accentHex;
}

// ===== URL Builder =====
function updateURL() {
    if (!state.selectedType || !state.country) {
        elements.generatedUrl.value = i18n('url.placeholder');
        return;
    }

    const params = new URLSearchParams();
    params.set('country', state.country.toLowerCase());
    params.set('type', state.selectedType);
    params.set('bg', state.bgColor.replace('#', ''));
    params.set('accent', state.accentColor.replace('#', ''));
    params.set('width', state.width);
    params.set('height', state.height);
    params.set('clockHeight', state.clockHeight);  // Pass clock height for proper spacing
    params.set('lang', state.wallpaperLang || 'en');  // 壁纸语言

    if (state.selectedType === 'life') {
        if (state.dob) params.set('dob', state.dob);
        params.set('lifespan', state.lifespan);
    }

    if (state.selectedType === 'goal') {
        if (state.goalDate) params.set('goal', state.goalDate);
        if (state.goalName) params.set('goalName', encodeURIComponent(state.goalName));
    }

    const url = `${WORKER_URL}/generate?${params.toString()}`;
    elements.generatedUrl.value = url;
}

// ===== Copy URL =====
async function copyURL() {
    const url = elements.generatedUrl.value;
    if (!url || url.includes('Select a')) return;

    try {
        await navigator.clipboard.writeText(url);
        const btnSpan = elements.copyBtn.querySelector('span');
        btnSpan.textContent = i18n('url.copied');
        setTimeout(() => {
            btnSpan.textContent = i18n('url.copy');
        }, 2000);
    } catch (e) {
        console.error(i18n('debug.copyFailed'), e);
    }
}

// ===== Language Switching =====
function setupLanguageSwitcher() {
    const langSelect = document.getElementById('lang-select');
    if (!langSelect) return;

    // 设置初始值
    langSelect.value = window.i18n.getCurrentLang();

    // 立即更新UI（首次加载）
    updateUITranslations();

    // 监听语言选择变化
    langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        // 更新全局 window.i18n 状态
        if (window.i18n && window.i18n.manager) {
            window.i18n.manager.currentLang = newLang;
            localStorage.setItem('preferredLang', newLang);
        }
        // 刷新UI（重新渲染所有文本）
        updateUITranslations();
    });

    // 监听全局i18n变化事件
    window.addEventListener('i18n-changed', (e) => {
        const lang = e.detail.lang;
        langSelect.value = lang;
        updateUITranslations();
    });
}

/**
 * 重新渲染所有UI文本（语言切换时调用）
 */
function updateUITranslations() {
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = window.i18n.get(key);

        // Hero 标题：英文保留句号，其他语言去掉句号
        if ((key === 'hero.title' || key === 'hero.titleAccent') && window.i18n.getCurrentLang() !== 'en') {
            text = text.replace(/。$/, '').replace(/\.$/, '');
        }

        // 对于 select 的 option，使用 textContent；对于其他元素，根据情况使用 textContent 或 innerHTML
        if (el.tagName === 'OPTION') {
            el.textContent = text;
        } else if (el.tagName === 'INPUT') {
            el.placeholder = text;
        } else if (text.includes('<')) {
            // 如果翻译中包含 HTML 标签，用 innerHTML
            el.innerHTML = text;
        } else {
            // 否则用 textContent
            el.textContent = text;
        }
    });

    // 更新动态UI元素
    elements.selectedTypeIndicator.textContent = i18n('customize.selectedNone');
    if (state.selectedType) {
        const typeKey = `type.${state.selectedType}.name`;
        elements.selectedTypeIndicator.textContent = i18n(typeKey);
    }

    // 重新渲染预览
    if (state.selectedType) {
        updatePreview();
    }
}

// ===== Theme System =====
/**
 * 主题切换系统
 * 支持三种状态：
 * - 'auto': 跟随系统偏好（默认）
 * - 'light': 强制明亮模式
 * - 'dark': 强制暗黑模式
 */
function setupThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // 获取系统主题偏好
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // 获取当前应用的主题（考虑用户偏好和系统偏好）
    const getCurrentTheme = () => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
            return stored;
        }
        // 默认或 'auto'：跟随系统
        return getSystemTheme();
    };

    // 应用主题到 DOM
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
    };

    // 切换主题（循环：auto → light → dark → auto）
    const cycleTheme = () => {
        const stored = localStorage.getItem('theme') || 'auto';
        let next;

        if (stored === 'auto') {
            // auto → 切换到与当前系统相反的模式
            next = getSystemTheme() === 'dark' ? 'light' : 'dark';
        } else if (stored === 'light') {
            next = 'dark';
        } else {
            // dark → back to auto
            next = 'auto';
        }

        localStorage.setItem('theme', next);
        const actualTheme = next === 'auto' ? getSystemTheme() : next;
        applyTheme(actualTheme);
    };

    // 初始化主题
    applyTheme(getCurrentTheme());

    // 监听系统主题变化（仅当用户选择 'auto' 时生效）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const stored = localStorage.getItem('theme');
        if (!stored || stored === 'auto') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // 绑定切换按钮
    themeToggle.addEventListener('click', cycleTheme);
}

// ===== Start =====
init();
setupLanguageSwitcher();
setupThemeSystem();
