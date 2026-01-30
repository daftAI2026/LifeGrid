/**
 * Life Calendar Wallpaper - Cloudflare Worker
 * 
 * Generates dynamic wallpaper images based on:
 * - Year progress (days/weeks of the year)
 * - Life calendar (weeks of life)
 * - Goal countdown (days until target)
 */

import { getTimezone } from './timezone.js';
import { generateYearCalendar } from './generators/year.js';
import { generateLifeCalendar } from './generators/life.js';
import { generateGoalCountdown } from './generators/goal.js';
import { validateParams } from './validation.js';

// Resvg WASM for SVG to PNG conversion
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm';

let wasmInitialized = false;

async function initializeWasm() {
    if (!wasmInitialized) {
        await initWasm(resvgWasm);
        wasmInitialized = true;
    }
}

let fontBuffers = [];

async function loadFonts() {
    if (fontBuffers.length > 0) return;

    try {
        const fonts = [
            'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.woff2',
            'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Medium.woff2',
            'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.woff2',
            'https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.woff2'
        ];

        const responses = await Promise.all(fonts.map(url => fetch(url)));
        const buffers = await Promise.all(responses.map(res => res.arrayBuffer()));

        fontBuffers = buffers.map(buffer => new Uint8Array(buffer));
        console.log('Fonts loaded successfully');
    } catch (e) {
        console.error('Failed to load fonts:', e);
    }
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS 头部配置
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Expose-Headers': 'X-Cache-Status, X-Cache-Key, X-Server-Cache'
        };

        // 处理预检请求 (OPTIONS)
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // ====================================================================
        // 1. API 路由控制
        // ====================================================================
        if (url.pathname === '/generate') {
            return await handleGenerate(request, url, corsHeaders, ctx);
        }

        if (url.pathname === '/health') {
            return new Response(JSON.stringify({ status: 'ok' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // ====================================================================
        // 2. 静态资源转发 + 首页国家信息注入
        // ====================================================================

        // 我们利用 env.ASSETS.fetch 获取原始资源
        const response = await env.ASSETS.fetch(request);

        // 如果是 HTML 请求（特别是首页），我们注入 IP 国家信息
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/html')) {
            const country = request.headers.get('CF-IPCountry') || 'US';
            let html = await response.text();

            // 注入 data-country 到 html 标签
            html = html.replace(/<html[^>]*>/, `<html lang="en" data-country="${country}">`);

            return new Response(html, {
                status: response.status,
                headers: response.headers
            });
        }

        // 其他静态资源（CSS/JS/PNG）直接透传
        return response;
    }
};

async function handleGenerate(request, url, corsHeaders, ctx) {
    try {
        // Validate and parse parameters
        const validated = validateParams(url);

        // Get timezone from country
        const timezone = getTimezone(validated.country);

        // Build options object
        const options = {
            width: validated.width,
            height: validated.height,
            bgColor: validated.bg,
            accentColor: validated.accent,
            timezone,
            clockHeight: validated.clockHeight,
            lang: validated.lang,  // 壁纸语言
            dob: validated.dob,
            lifespan: validated.lifespan,
            goalDate: validated.goal,
            goalName: validated.goalName
        };

        // Generate SVG based on type
        let svg;
        switch (validated.type) {
            case 'life':
                svg = generateLifeCalendar(options);
                break;
            case 'goal':
                svg = generateGoalCountdown(options);
                break;
            case 'year':
            default:
                svg = generateYearCalendar(options);
                break;
        }

        // Generate cache key based on parameters and current date
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `${validated.country}-${validated.type}-${validated.bg}-${validated.accent}-${validated.width}x${validated.height}-${today}`;

        // Build a cache request URL to use with caches.default (Cloudflare Workers)
        // Only enable server-side caching for the non-user-specific `year` type
        let cacheRequest = null;
        const enableServerCache = validated.type === 'year' && (typeof caches !== 'undefined' && caches && caches.default);
        if (enableServerCache) {
            try {
                const cacheUrl = new URL(request.url);
                // Use a deterministic cache URL path and strip query/hash to avoid
                // cache misses due to query ordering or extra params
                cacheUrl.pathname = `/__cache__/${cacheKey}`;
                cacheUrl.search = '';
                cacheUrl.hash = '';
                cacheRequest = new Request(cacheUrl.toString(), { method: 'GET' });
                const cached = await caches.default.match(cacheRequest).catch(() => null);
                if (cached) {
                    try {
                        const buf = await cached.arrayBuffer();
                        const headers = new Headers(cached.headers);
                        // Ensure CORS/expose headers present on cached responses
                        Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
                        headers.set('X-Cache-Status', 'HIT');
                        headers.set('X-Cache-Key', cacheKey);
                        headers.set('X-Server-Cache', 'enabled');
                        return new Response(buf, { status: cached.status, statusText: cached.statusText, headers });
                    } catch (e) {
                        console.error('Returning cached response failed, will regenerate:', e);
                        // fall through to regenerate
                    }
                }
            } catch (e) {
                console.error('Cache lookup failed:', e);
                cacheRequest = null;
            }
        }

        // Check if SVG output is requested
        if (validated.format === 'svg') {
            const response = new Response(svg, {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=86400', // Cache for 1 day
                    'X-Cache-Key': cacheKey,
                    'X-Cache-Status': 'MISS'
                }
            });

            if (cacheRequest) {
                try { await caches.default.put(cacheRequest, response.clone()); } catch (e) { console.error('Cache put failed:', e); }
            }

            return response;
        }

        // Convert SVG to PNG using resvg
        await Promise.all([initializeWasm(), loadFonts()]);

        const resvg = new Resvg(svg, {
            fitTo: {
                mode: 'original'
            },
            font: {
                loadSystemFonts: false,
                defaultFontFamily: 'Inter',
                fontBuffers: fontBuffers // Pass the loaded font buffers
            }
        });

        const pngData = resvg.render();
        const pngBuffer = pngData.asPng();

        const response = new Response(pngBuffer, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400', // Cache for 1 day
                'X-Cache-Key': cacheKey,
                'X-Cache-Status': 'MISS'
            }
        });

        if (cacheRequest) {
            try { await caches.default.put(cacheRequest, response.clone()); } catch (e) { console.error('Cache put failed:', e); }
        }

        return response;
    } catch (e) {
        if (e.name === 'ZodError' || e.issues) {
            return new Response(JSON.stringify({
                error: 'Validation Error',
                issues: e.issues || e.errors
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        console.error('Worker Error:', e);
        return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
    }
}



