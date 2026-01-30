# 🌍 LifeGrid 多语言实现指南

> **一份快速参考文档，说明如何添加新语言或修改翻译**

---

## 快速查看

**当前支持的语言**：
- 🇺🇸 English (en)
- 🇨🇳 简体中文 (zh-CN)
- 🇹🇼 繁體中文 (zh-TW)
- 🇯🇵 日本語 (ja)

**自动检测顺序**：
1. 用户localStorage保存的选择
2. URL参数 `?lang=zh-CN`
3. 访问者IP国家（Cloudflare自动注入）
4. 浏览器语言设置
5. 默认English

---

## 核心文件说明

### 1. `data/i18n.js` - 所有翻译字符串

```js
export const i18nData = {
  en: {
    'nav.title': 'LifeGrid',
    'hero.title': 'Your time.',
    // ... 89个键
  },
  'zh-CN': {
    'nav.title': 'LifeGrid',
    'hero.title': '你的时间。',
    // ... 89个键
  },
  // zh-TW, ja ...
};

export const countryToLang = {
  US: 'en', GB: 'en',  // 国家代码 → 语言
  CN: 'zh-CN', TW: 'zh-TW',
  JP: 'ja',
};
```

**如何添加新语言**（例如西班牙语）：

```js
// 第1步：在 i18nData 中添加新语言对象
'es': {
  'nav.title': 'LifeGrid',
  'hero.title': 'Tu tiempo.',
  // ... 复制所有89个键，翻译成西班牙语
}

// 第2步：在 countryToLang 中添加国家映射
export const countryToLang = {
  // ... 现有映射
  ES: 'es', MX: 'es', AR: 'es',  // 西班牙、墨西哥、阿根廷
};

// 第3步：在 SUPPORTED_LANGS 中添加
export const SUPPORTED_LANGS = ['en', 'zh-CN', 'zh-TW', 'ja', 'es'];
```

---

### 2. `i18n-loader.js` - 语言加载和管理

**功能**：
- 检测用户语言偏好
- 动态加载 Google Fonts
- 提供全局 `window.i18n` 对象

**主要方法**：

```js
window.i18n.get('nav.title')           // 获取翻译字符串
window.i18n.setLanguage('zh-CN')       // 切换语言
window.i18n.getCurrentLang()           // 获取当前语言代码
window.i18n.getLangName('ja')          // 获取语言显示名称
```

---

### 3. `index.html` - UI中的语言标记

```html
<!-- 所有UI元素都用 data-i18n 属性标记 -->
<a href="#types" class="nav-link" data-i18n="nav.wallpapers">Wallpapers</a>

<!-- 语言选择器 -->
<select id="lang-select" class="lang-select">
  <option value="en" data-i18n="lang.en">English</option>
  <option value="zh-CN" data-i18n="lang.zh-CN">简体中文</option>
  <option value="zh-TW" data-i18n="lang.zh-TW">繁體中文</option>
  <option value="ja" data-i18n="lang.ja">日本語</option>
</select>
```

**如何标记新UI元素**：

```html
<!-- ❌ 硬编码（不好）-->
<button>Save</button>

<!-- ✅ 使用 data-i18n（好）-->
<button data-i18n="button.save">Save</button>
```

然后在 `data/i18n.js` 添加翻译：
```js
'button.save': 'Save',        // en
'button.save': '保存',        // zh-CN
'button.save': '保存',        // zh-TW
'button.save': '保存する',    // ja
```

---

### 4. `app.js` - 动态UI翻译

```js
// 使用 i18n() 获取翻译（不是硬编码字符串）
elements.selectedTypeIndicator.textContent = i18n('customize.selectedNone');

// 语言切换时自动重新渲染UI
window.addEventListener('i18n-changed', () => {
    updateUITranslations();
});
```

---

### 5. `worker/src/index.js` - IP检测

Cloudflare Worker自动读取访问者IP的国家信息，注入到HTML：

```html
<!-- Worker注入data-country属性 -->
<html lang="en" data-country="CN">
```

i18n-loader 自动读取这个属性并选择对应语言。

---

## 翻译键（Translation Keys）

### 导航 (nav)
```
'nav.title'       - 品牌名
'nav.wallpapers'  - 导航链接
'nav.customize'   - 导航链接
'nav.setup'       - 导航链接
'nav.github'      - 导航链接
```

### 英雄部分 (hero)
```
'hero.eyebrow'         - 小标题
'hero.title'           - 主标题
'hero.titleAccent'     - 强调文本
'hero.subtitle'        - 副标题
'hero.cta'             - 行动按钮
```

### 类型卡片 (type)
```
'type.year.name'        - "Year Progress"
'type.year.description' - 描述
'type.year.statDay'     - "Day"
'type.year.statWeek'    - "Week"
'type.year.statComplete'- "Complete"

'type.life.name'        - "Life Calendar"
'type.life.description' - 描述
# ... (类似的year/goal)
```

### 配置 (config)
```
'config.location'
'config.locationHint'
'config.dateOfBirth'
'config.lifespan'
'config.goalName'
'config.targetDate'
'config.colors'
'config.background'
'config.accent'
'config.device'
'config.deviceResolution'
'config.url'
```

### 语言选择器 (lang)
```
'lang.select'    - 下拉菜单标签
'lang.en'        - English
'lang.zh-CN'     - 简体中文
'lang.zh-TW'     - 繁體中文
'lang.ja'        - 日本語
```

---

## 字体支持

### Google Fonts 集成

在 `index.html` 中一次性加载所有语言字体：

```html
<link href="https://fonts.googleapis.com/css2?family=Inter&family=Noto+Sans+SC&family=Noto+Sans+TC&family=Noto+Sans+JP&display=swap">
```

`i18n-loader.js` 会根据当前语言，更新CSS变量：

```css
:root {
  --font-sans: "Inter", sans-serif;  /* 英文 */
  /* i18n 切换时变为 */
  --font-sans: "Noto Sans SC", sans-serif;  /* 中文 */
}
```

### 字体选择原因

- **Noto Sans SC** - Google官方推荐，简体中文完整字库
- **Noto Sans TC** - 繁体中文完整字库  
- **Noto Sans JP** - 日文完整字库（支持40K+汉字和平假名片假名）
- **Inter** - 英文极简设计，极佳可读性

---

## 常见任务

### 任务1：修改现有翻译

❌ **错误做法**：修改 `i18n-loader.js` 中的字符串

✅ **正确做法**：修改 `data/i18n.js` 中对应的翻译

```js
// data/i18n.js
export const i18nData = {
  en: {
    'hero.title': 'Your time.',  // ← 在这里改英文
  },
  'zh-CN': {
    'hero.title': '你的时间。',  // ← 在这里改中文
  },
  // ...
};
```

### 任务2：添加新的UI文本

1. **在 HTML 中标记**：
   ```html
   <span data-i18n="mySection.newText">Default English</span>
   ```

2. **在 `data/i18n.js` 中添加翻译**：
   ```js
   'mySection.newText': 'Default English',        // en
   'mySection.newText': '默认英文',              // zh-CN
   'mySection.newText': '預設英文',              // zh-TW
   'mySection.newText': 'デフォルト英文',        // ja
   ```

3. **验证**：
   - 切换语言，确认文本更新
   - 检查 localStorage 保存

### 任务3：调试语言检测

添加 `?debug=i18n` 到URL：

```
https://lifegrid.example.com/?debug=i18n

控制台输出：
🌍 i18n initialized
Current language: zh-CN
Available languages: [ 'en', 'zh-CN', 'zh-TW', 'ja' ]
Browser language: zh
IP Country (from Worker): CN
```

### 任务4：添加新语言

例如添加韩语（ko）：

1. 在 `data/i18n.js` 添加：
   ```js
   ko: {
     'nav.title': 'LifeGrid',
     'hero.title': '당신의 시간을',
     // ... 复制所有89个键，翻译成韩语
   }
   ```

2. 更新国家映射：
   ```js
   export const countryToLang = {
     // ... 现有
     KR: 'ko',  // South Korea
     KP: 'ko',  // North Korea
   };
   ```

3. 更新支持列表：
   ```js
   export const SUPPORTED_LANGS = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
   ```

4. 在 `index.html` 添加 option：
   ```html
   <option value="ko" data-i18n="lang.ko">한국어</option>
   ```

5. 在 `i18n-loader.js` 添加字体（如果需要）：
   ```js
   const fontLinks = {
     // ... 现有
     ko: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap',
   };
   ```

---

## 性能优化

### 包体积

- `i18n-loader.js`: ~3KB
- `data/i18n.js`: ~35KB（356条翻译）
- Google Fonts: ~150KB (全语言一次加载，但浏览器会缓存)
- **总开销**: ~190KB，可接受

### 加载顺序

1. 页面加载 → Worker检测IP注入 data-country
2. HTML解析 → i18n-loader.js最先执行（在任何UI脚本之前）
3. 语言检测 → 加载对应Google Fonts
4. app.js → 使用 i18n() 获取翻译
5. 用户切换语言 → localStorage保存，重新渲染UI

---

## 故障排查

### 问题1：语言没有自动检测

**原因**：IP国家不在 countryToLang 映射中

**解决**：
```js
// 检查 data-country 属性是否存在
console.log(document.documentElement.getAttribute('data-country'));

// 添加国家映射
export const countryToLang = {
  XX: 'en',  // 你的国家代码
};
```

### 问题2：切换语言后UI没有更新

**原因**：UI元素没有带 `data-i18n` 属性

**解决**：
```html
<!-- ❌ 这不会被更新 -->
<span>Hello</span>

<!-- ✅ 这会被更新 -->
<span data-i18n="hello">Hello</span>
```

### 问题3：中文显示乱码

**原因**：Google Fonts没有正确加载

**解决**：
1. 检查浏览器Network → 确认 Noto Sans SC/TC 已加载
2. 检查CSS → `--font-sans` 变量是否正确切换
3. 清空浏览器缓存重新加载

### 问题4：localStorage不保存语言选择

**原因**：浏览器隐私模式或localStorage被禁用

**解决**：
```js
// i18n-loader.js 会自动降级到 sessionStorage 或只在内存中
// 用户关闭浏览器后会丢失选择，这是预期行为
```

---

## 合规性检查清单

使用此清单确保多语言实现完整：

- [ ] `data/i18n.js` 包含所有89个翻译键，4种语言全覆盖
- [ ] `countryToLang` 映射包含主要国家/地区
- [ ] `index.html` 中所有UI文本都有 `data-i18n` 属性
- [ ] Google Fonts 全部语言预加载（不依赖动态加载）
- [ ] `app.js` 中所有硬编码字符串都改成 `i18n()` 调用
- [ ] 语言选择器在导航栏可见且可用
- [ ] localStorage 能正确保存语言选择
- [ ] Worker 正确注入 `data-country` 属性
- [ ] 测试了至少3种语言的切换
- [ ] 测试了URL参数 `?lang=zh-CN` 的强制切换
- [ ] 布局不因文本长度而破坏（中文通常较长）

---

## 更新日志

| 日期 | 变更 | 语言 |
|------|------|------|
| 2025-01-29 | 初始化多语言系统 | en, zh-CN, zh-TW, ja |
| | IP地理定位检测 | 4语言 |
| | Google Fonts集成 | Noto Sans (SC/TC/JP) |

---

## 联系方式

遇到问题？检查：
1. CLAUDE.md - 架构总览
2. README.md - 项目说明
3. i18n-loader.js - 代码注释
4. 浏览器控制台 - `?debug=i18n` 日志

