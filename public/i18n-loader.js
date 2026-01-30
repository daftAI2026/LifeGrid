/**
 * [INPUT]: 依赖 data/i18n.js 的 i18nData、countryToLang、DEFAULT_LANG、SUPPORTED_LANGS
 * [OUTPUT]: 对外提供 window.i18n 全局对象，包含 get(key) 方法、setLanguage(lang)、getCurrentLang()
 * [POS]: 前端i18n系统的核心加载器，在index.html中最早执行，被app.js消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { i18nData, countryToLang, DEFAULT_LANG, SUPPORTED_LANGS } from './data/i18n.js';

class I18nManager {
  constructor() {
    this.currentLang = DEFAULT_LANG;
    this.data = i18nData;
    this.init();
  }

  /**
   * 初始化：检测用户语言
   * 优先级：localStorage > URL参数 > IP国家检测 > 浏览器语言 > 默认
   */
  init() {
    const detected = this.detectLanguage();
    this.setLanguage(detected);
  }

  /**
   * 检测用户应使用的语言
   */
  detectLanguage() {
    // 1. 检查 localStorage 用户手动选择
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && SUPPORTED_LANGS.includes(savedLang)) {
      return savedLang;
    }

    // 2. 检查 URL 参数 ?lang=zh-CN
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) {
      return urlLang;
    }

    // 3. 检查 HTML data-country 属性（由Worker注入）
    const country = document.documentElement.getAttribute('data-country');
    if (country && countryToLang[country]) {
      return countryToLang[country];
    }

    // 4. 检查浏览器语言
    const browserLang = this.getBrowserLanguage();
    if (browserLang) {
      return browserLang;
    }

    // 5. 默认英文
    return DEFAULT_LANG;
  }

  /**
   * 从浏览器 navigator.language 推断语言
   */
  getBrowserLanguage() {
    const navLang = navigator.language.toLowerCase();

    // 精确匹配: en-US → en
    if (navLang === 'en' || navLang.startsWith('en-')) return 'en';
    if (navLang === 'zh-cn' || navLang === 'zh-hans') return 'zh-CN';
    if (navLang === 'zh-tw' || navLang === 'zh-hant') return 'zh-TW';
    if (navLang === 'ja' || navLang.startsWith('ja-')) return 'ja';

    return null;
  }

  /**
   * 设置当前语言并触发更新
   */
  setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG;
    }

    this.currentLang = lang;
    localStorage.setItem('preferredLang', lang);

    // 更新 HTML lang 属性和 data 属性
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // 加载对应语言的Google字体
    this.loadFonts(lang);

    // 触发全局更新事件
    window.dispatchEvent(new CustomEvent('i18n-changed', { detail: { lang } }));
  }

  /**
   * 获取翻译字符串
   * 支持点符号访问：t('hero.title') 作为 flat key
   */
  get(key) {
    if (!key) return '';

    // i18nData 是 flat 结构，直接查表
    const langData = this.data[this.currentLang];
    if (langData && langData[key]) {
      return langData[key];
    }

    // 回退到默认语言
    const defaultData = this.data['en'];
    if (defaultData && defaultData[key]) {
      return defaultData[key];
    }

    // 最终回退到 key 本身
    return key;
  }

  /**
   * 获取当前语言代码
   */
  getCurrentLang() {
    return this.currentLang;
  }

  /**
   * 获取当前语言的显示名称
   */
  getLangName(lang = this.currentLang) {
    const key = `lang.${lang}`;
    return this.get(key);
  }

  /**
   * 为当前语言加载 Google Fonts
   */
  loadFonts(lang) {
    const fontLinks = {
      en: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      'zh-CN': 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap',
      'zh-TW': 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap',
      ja: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap',
    };

    const link = fontLinks[lang];
    if (!link) return;

    // 检查是否已加载
    const existing = document.querySelector(`link[href="${link}"]`);
    if (existing) return;

    const fontLink = document.createElement('link');
    fontLink.rel = 'preconnect';
    fontLink.href = link;
    document.head.appendChild(fontLink);

    // 也可使用 @import 在 CSS 中，这里提供备选方案
    this.updateCSSFonts(lang);
  }

  /**
   * 更新 CSS 字体变量以适应不同语言
   */
  updateCSSFonts(lang) {
    const fontMap = {
      en: '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      'zh-CN': '"Noto Sans SC", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      'zh-TW': '"Noto Sans TC", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      ja: '"Noto Sans JP", -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    };

    const fontFamily = fontMap[lang] || fontMap.en;
    document.documentElement.style.setProperty('--font-sans', fontFamily);
  }
}

// 初始化全局 i18n 对象
const i18nManager = new I18nManager();
window.i18n = {
  get: (key) => i18nManager.get(key),
  setLanguage: (lang) => i18nManager.setLanguage(lang),
  getCurrentLang: () => i18nManager.getCurrentLang(),
  getLangName: (lang) => i18nManager.getLangName(lang),
  manager: i18nManager, // 暴露完整对象用于高级操作
};

// 初始化后立即更新所有 UI 元素
function initializeUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    let text = i18nManager.get(key);
    
    // Hero 标题：英文保留句号，其他语言去掉句号
    if ((key === 'hero.title' || key === 'hero.titleAccent') && i18nManager.currentLang !== 'en') {
      text = text.replace(/。$/, '').replace(/\.$/, '');
    }
    
    if (el.tagName === 'OPTION') {
      el.textContent = text;
    } else if (el.tagName === 'INPUT') {
      el.placeholder = text;
    } else if (text.includes('<')) {
      // 如果翻译中包含 HTML 标签，用 innerHTML
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });
  
  // 设置 HTML lang 属性
  document.documentElement.lang = i18nManager.currentLang;
}

// 等待 DOM 完全加载后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  // DOM 已加载，延迟执行确保 script 加载完成
  setTimeout(initializeUI, 100);
}

// 调试模式：打印当前配置
if (window.location.search.includes('debug=i18n')) {
  console.log('🌍 i18n initialized');
  console.log('Current language:', i18nManager.currentLang);
  console.log('Available languages:', SUPPORTED_LANGS);
  console.log('Browser language:', navigator.language);
  console.log('IP Country (from Worker):', document.documentElement.getAttribute('data-country'));
}

export default i18nManager;
