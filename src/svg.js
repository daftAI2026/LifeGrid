// SVG utility functions for building wallpaper graphics

/**
 * Create SVG document wrapper
 */
export function createSVG(width, height, content) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;display=swap');
    </style>
  </defs>
    ${content}
</svg>`;
}

/**
 * Create a rectangle element
 */
export function rect(x, y, width, height, fill, rx = 0) {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" rx="${rx}" />`;
}

/**
 * Create a circle element
 */
export function circle(cx, cy, r, fill) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
}

/**
 * Create a text element
 */
export function text(x, y, content, options = {}) {
    const {
        fill = '#ffffff',
        fontSize = 16,
        fontWeight = '400',
        fontFamily = 'Inter, sans-serif',
        textAnchor = 'start',
        dominantBaseline = 'auto',
        escape = true
    } = options;

    const inner = escape ? escapeXml(content) : content;
    return `<text x="${x}" y="${y}" fill="${fill}" font-size="${fontSize}" font-weight="${fontWeight}" font-family="${fontFamily}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}">${inner}</text>`;
}

/**
 * Create a group element
 */
export function group(content, transform = '') {
    const transformAttr = transform ? ` transform="${transform}"` : '';
    return `<g${transformAttr}>${content}</g>`;
}

/**
 * Create an arc path (for circular progress)
 */
export function arc(cx, cy, radius, startAngle, endAngle, stroke, strokeWidth) {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    const d = [
        'M', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return `<path d="${d}" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" />`;
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: cx + (radius * Math.cos(angleInRadians)),
        y: cy + (radius * Math.sin(angleInRadians))
    };
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Parse hex color to ensure it's valid
 */
export function parseColor(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Expand 3-digit hex
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    // Validate
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return '#111114'; // Default fallback
    }

    return '#' + hex;
}

/**
 * Lighten or darken a color
 */
export function adjustColor(hex, percent) {
    hex = hex.replace('#', '');

    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent / 100)));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100)));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent / 100)));

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Create color with opacity
 */
export function colorWithAlpha(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
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
export function getLuminance(hex) {
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
export function getContrastBase(bgHex) {
    return getLuminance(bgHex) > 0.5 ? '0,0,0' : '255,255,255';
}

/**
 * 生成与背景形成对比的半透明色
 * @param {string} bgHex - 背景色
 * @param {number} alpha - 透明度
 * @returns {string} rgba 颜色值
 */
export function contrastAlpha(bgHex, alpha) {
    return `rgba(${getContrastBase(bgHex)}, ${alpha})`;
}

/**
 * 检测两个颜色是否太接近（对比度 < 2:1）
 * @param {string} hex1 - 颜色1
 * @param {string} hex2 - 颜色2
 * @returns {boolean} 是否撞车
 */
export function isTooClose(hex1, hex2) {
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
export function isBlackOrWhite(hex) {
    const luminance = getLuminance(hex);
    return luminance < 0.1 || luminance > 0.9;
}

/**
 * 获取安全的强调色（仅当黑白色与背景撞车时反转）
 * @param {string} bgHex - 背景色
 * @param {string} accentHex - 用户选择的强调色
 * @returns {string} 安全的强调色
 */
export function getSafeAccent(bgHex, accentHex) {
    // 只处理黑白色的情况
    if (isBlackOrWhite(accentHex) && isTooClose(bgHex, accentHex)) {
        return getLuminance(bgHex) > 0.5 ? '#000000' : '#FFFFFF';
    }
    return accentHex;
}
