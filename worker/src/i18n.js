/**
 * [INPUT]: 无依赖
 * [OUTPUT]: 壁纸文字翻译数据和 t() 辅助函数
 * [POS]: Worker 内部的 i18n 模块，供三个生成器共享
 * [PROTOCOL]: 新增翻译时更新此文件
 */

export const wallpaperI18n = {
    en: {
        daysLeft: (n) => `${n} days left`,
        dayLeft: (n) => `${n} day left`,
        complete: (n) => `${n}% complete`,
        weeksLeft: (n) => `${n.toLocaleString()} weeks left`,
        weekLeft: (n) => `${n} week left`,
        lived: (n) => `${n}% lived`,
    },
    'zh-CN': {
        daysLeft: (n) => `剩余 ${n} 天`,
        dayLeft: (n) => `剩余 ${n} 天`,
        complete: (n) => `进度 ${n}%`,
        weeksLeft: (n) => `剩余 ${n.toLocaleString()} 周`,
        weekLeft: (n) => `剩余 ${n} 周`,
        lived: (n) => `已度过 ${n}%`,
    },
    'zh-TW': {
        daysLeft: (n) => `剩餘 ${n} 天`,
        dayLeft: (n) => `剩餘 ${n} 天`,
        complete: (n) => `進度 ${n}%`,
        weeksLeft: (n) => `剩餘 ${n.toLocaleString()} 週`,
        weekLeft: (n) => `剩餘 ${n} 週`,
        lived: (n) => `已度過 ${n}%`,
    },
    ja: {
        daysLeft: (n) => `残り ${n} 日`,
        dayLeft: (n) => `残り ${n} 日`,
        complete: (n) => `${n}% 完了`,
        weeksLeft: (n) => `残り ${n.toLocaleString()} 週`,
        weekLeft: (n) => `残り ${n} 週`,
        lived: (n) => `${n}% 生きた`,
    },
};

/**
 * 获取翻译后的壁纸文字
 * @param {string} key - 翻译键 (daysLeft, complete, etc.)
 * @param {number} value - 数值参数
 * @param {string} lang - 语言代码
 */
export function t(key, value, lang = 'en') {
    const langData = wallpaperI18n[lang] || wallpaperI18n.en;
    const fn = langData[key];
    return fn ? fn(value) : `${value}`;
}
