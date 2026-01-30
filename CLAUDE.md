# LifeGrid Architecture & Refinement Plan

> Map IS the terrain. 代码即文档，变更即记忆。

## Current Stack
- **Frontend**: Vanilla JS (app.js 688L) + Canvas previews + DOM manipulation
- **Backend**: Cloudflare Worker (src/index.js) + Resvg WASM SVG→PNG
- **Styling**: CSS3 custom properties (1294L, Apple-inspired dark theme)
- **Data**: Static JS modules (countries.js, devices.js)

## L1 Architecture

```
lifegrid/
├── wrangler.toml       # Cloudflare Workers Static Assets 配置
├── package.json        # 依赖管理
│
├── public/             # 静态资源目录 (Cloudflare 自动托管)
│   ├── index.html      # Single-page entry, Apple design
│   ├── styles.css      # Dark theme + spacing scale
│   ├── app.js          # UI state + event binding + preview canvas
│   ├── i18n-loader.js  # Language detection + font loading
│   ├── favicon.svg     # Site icon
│   └── data/
│       ├── i18n.js     # 356 translations (en, zh-CN, zh-TW, ja)
│       ├── countries.js # 65+ countries + timezones
│       └── devices.js  # 15 device presets (iPhone 13~17 series)
│
└── src/                # Worker API 代码
    ├── index.js        # CORS + request routing + WASM init
    ├── timezone.js     # Timezone lookup utilities
    ├── validation.js   # Zod schema validation
    ├── svg.js          # SVG generation helpers
    ├── i18n.js         # Worker-side translations
    └── generators/
        ├── year.js     # 365-day grid (15 cols)
        ├── life.js     # Life calendar (52 cols, 80 rows)
        └── goal.js     # Goal countdown (circular progress)
```

### Deployment Architecture (Cloudflare Workers Static Assets)
```
git push → GitHub → Cloudflare Workers Builds → Deploy

路由逻辑:
  /           → public/index.html (静态)
  /api/*      → src/index.js (Worker)
  其他静态资源 → public/ 目录匹配
```

## Design Philosophy

### Core: Time as Immutable Parameter
- URL encodes ALL state: `?country=us&type=year&bg=000000&accent=FFFFFF&dob=2000-01-01...`
- No database = no sync issues
- User owns the link forever
- Zod validation prevents injection

### Two-Layer Rendering
1. **Frontend Canvas**: Fast, rough preview (feedback)
2. **Worker SVG+Resvg**: Precise, high-fidelity output (truth)
3. Separation ensures: quick interaction ≠ accurate generation

### Adaptation Layers
- **Timezone**: Different countries see different "day #"
- **Device**: Notch vs Dynamic Island height adjustments
- **Typography**: Font scales with width for perfect harmony

---

## 🎯 Code Taste Refinements (Post-Launch)

### [DONE] TODO-1: DOM Selector Consolidation
**Status**: ✅ 已完成（2025-01-30）
**实现**: `elements` 对象统一缓存所有 DOM 引用（第 60-87 行）

---

### [DONE] TODO-2: Grid Rendering Abstraction  
**Status**: ✅ 已完成（2025-01-30）
**实现**: 
- 提取 `drawStats()` 辅助函数（第 404-427 行）
- `drawYearPreview` 和 `drawLifePreview` 共享统计文本渲染逻辑
- 消除 ~50 行重复代码

---

### [DONE] TODO-3: State Update Unification
**Status**: ✅ 已完成（2025-01-30，2026-01-30 补完）
**实现**:
- `setState(updates, options)` 统一状态更新入口（第 46-51 行）
- `render()` 合并 `updatePreview()` + `updateURL()`（第 54-57 行）
- 所有事件处理器改用 `setState()` 单触发模式（包括 Country Select 第 223-230 行）
- **2026-01-30 补丁**: 修复 Country Select 遗漏的不一致性，完全消除手动双触发

---

### [DONE] TODO-4: Device Selection State Machine
**Status**: ✅ 已完成（2026-01-30）
**实现**:
- 引入显式状态机 `DeviceState`（第 29-34 行）：
  - `INITIALIZING` → 正在探测默认设备
  - `SELECTED` → 已成功选中设备
  - `FALLBACK` → 降级到默认设备
- 新增 `initializeDevice()` 函数（第 146-162 行）：状态机入口
- 新增 `transitionDeviceState()` 函数（第 168-191 行）：统一状态转换器
- 重构 `selectDevice()` 使用状态机（第 319-333 行）
- 所有状态转换带日志，完全可追溯
- 消除隐式 `if (!device) return` 降级

---

## 🌍 Multi-Language + IP Geolocation Plan (NEW)

### Architecture Decision

```
Frontend Request
    ↓
[1] IP Geolocation (Cloudflare CF-IPCountry header)
    ↓
[2] Lang Negotiation: IP country → language map
    ↓
[3] i18n Injection: Lang strings into HTML
    ↓
[4] User Override: localStorage persists choice
```

### Implementation Roadmap

#### Phase 1: Data Structure
Create: `data/i18n.js`
```js
const i18nData = {
  en: { /* all English strings */ },
  zh: { /* Chinese */ },
  es: { /* Spanish */ },
  // ... 10+ languages
};

const countryToLang = {
  US: 'en', GB: 'en',
  CN: 'zh', TW: 'zh-TW',
  ES: 'es', MX: 'es',
  // ... mapping
};
```

#### Phase 2: IP Detection
Modify: `index.html` → inject detection script
```html
<script>
  // Read CF-IPCountry from response header (Worker adds it)
  const country = document.documentElement.dataset.country;
  const lang = countryToLang[country] || 'en';
  // Load i18n strings, set on window.i18n
</script>
```

Worker injects:
```js
const country = request.headers.get('CF-IPCountry') || 'US';
response.headers.set('X-User-Country', country);
// + HTML injection
```

#### Phase 3: Dynamic String Replacement
Modify: `app.js` → use `window.i18n` for all text
```js
// Every hardcoded string becomes:
// OLD: 'Copy'
// NEW: i18n('copyBtn') or i18n.buttons.copy

// Centralized translation function
const t = (key) => {
  const parts = key.split('.');
  let obj = window.i18n;
  for (let p of parts) obj = obj[p];
  return obj || key; // fallback to key
};
```

#### Phase 4: User Language Override
Add: Language selector dropdown
```js
// Save to localStorage
localStorage.setItem('preferredLang', 'zh');

// Auto-apply on reload
const savedLang = localStorage.getItem('preferredLang');
const activeLang = savedLang || detectedLang;
```

### Tech Stack Options

#### Option A: Lightweight (Recommended)
- **Vanilla i18n module** (no library)
- Data structure: `{ en: {...}, zh: {...} }`
- Size: +8KB (gzipped)
- ✅ No dependencies
- ✅ Compatible with current stack
- ❌ Manual key management

#### Option B: i18next (if scale)
- Full-featured i18n library
- Namespace support, pluralization, interpolation
- Size: +25KB (gzipped)
- ✅ Battle-tested, large ecosystem
- ❌ Adds complexity early

#### Option C: Nuxt i18n (if migrate to Nuxt/Vue)
- If you decide to use Vue later
- Can wait for architecture refresh

**Recommendation**: Option A (Lightweight) → migrate to i18next IF language count > 15 or feature complexity ↑

---

## 🔄 Implementation Status

### ✅ Phase 1: i18n Infrastructure (COMPLETE)

```
✅ 1. Created data/i18n.js (356 translations across 4 languages)
✅ 2. Created i18n-loader.js (language detection + font loading)
✅ 3. Modified worker/src/index.js (IP detection + HTML injection)
✅ 4. Modified index.html (language selector + font links)
✅ 5. Modified styles.css (selector styling)
✅ 6. Modified app.js (i18n integration + language switching)
```

### 📋 Phase 2: Testing & Deployment (NEXT)

```
TODO: Test on different IPs
TODO: Verify localStorage persistence
TODO: Test language switching
TODO: Verify Google Fonts loading for CJK
TODO: Deploy Worker + frontend
TODO: Monitor language distribution
```

---

## File Status Tracking

| File | Status | Notes |
|------|--------|-------|
| app.js | ✅ Complete | i18n integrated, language switching implemented |
| styles.css | ✅ Complete | Language selector styling added |
| index.html | ✅ Complete | Language selector + i18n loader + Google Fonts |
| i18n-loader.js | ✅ New | Language detection + font loading + localStorage |
| data/i18n.js | ✅ Complete | 356 translations (en, zh-CN, zh-TW, ja) |
| worker/src/index.js | ✅ Complete | IP detection + data-country injection |
| worker/src/validation.js | ✅ Good | Already has Zod |
| README.md | ✅ Revamped | Bilingual (En/Zh) + Original Credits |

## 🎯 Phase 1: i18n Infrastructure Complete

✅ **Completed**:
1. `data/i18n.js`: Created with 4 language support (en, zh-CN, zh-TW, ja)
2. `app.js`: Refactored all hardcoded strings → `i18n(key)` calls
   - Line 20: Added i18n import + helper functions
   - Line 30: `goalName` default value → `i18n('config.goalName')`
   - Line 276: Event handler default → `i18n('config.goalName')`
   - Line 349-354: `typeNames` mapping → dynamic i18n calls
   - Line 369: Preview placeholder → `i18n('preview.selectType')`
   - Line 635: Goal label → conditional i18n for singular/plural
   - Line 663: URL placeholder → `i18n('url.placeholder')`
   - Line 697-702: Copy button feedback → `i18n('url.copy')`/`i18n('url.copied')`
3. Added translation keys:
   - `goal.dayLeft` / `goal.daysLeft` (singular/plural handling)
   - `debug.autoDetectFailed` / `debug.copyFailed` (console messages)
   - All 4 languages fully translated

**Next Phase**: 
- Phase 2: Worker IP detection + HTML i18n injection
- Phase 3: Language selector UI + localStorage persistence

---

## Protocol Note
When implementing:
1. Each phase completes → update this CLAUDE.md
2. New file created → create L3 header comment ([INPUT] [OUTPUT] [POS])
3. Architecture changes → update L1 section above
4. Keep the map & terrain in sync 🗺️

