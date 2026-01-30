import { createSVG, rect, circle, text, arc, parseColor, colorWithAlpha, contrastAlpha, getSafeAccent } from '../svg.js';
import { getDateInTimezone, getDaysBetween } from '../timezone.js';
import { t } from '../i18n.js';

/**
 * Generate Goal Countdown Wallpaper
 * Shows countdown to a specific goal date with circular progress
 * Leaves space at top for iPhone clock/date
 */
export function generateGoalCountdown(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone,
        goalDate,
        goalName = 'Goal',
        clockHeight = 0.18,
        lang = 'en'
    } = options;

    // Get current date in user's timezone
    const { year, month, day } = getDateInTimezone(timezone);
    const now = new Date(year, month - 1, day);

    // Parse goal date
    let targetDate;
    if (goalDate) {
        const [goalYear, goalMonth, goalDay] = goalDate.split('-').map(Number);
        targetDate = new Date(goalYear, goalMonth - 1, goalDay);
    } else {
        // Default: 30 days from now
        targetDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    // Calculate days remaining
    const daysRemaining = Math.max(0, getDaysBetween(now, targetDate));

    // For progress, assume a reasonable span (e.g., from 365 days ago to goal)
    const totalDays = Math.max(daysRemaining + 1, 365);
    const daysElapsed = totalDays - daysRemaining;
    const progress = Math.min(1, daysElapsed / totalDays);

    // Leave space for clock (with extra padding)
    const clockSpace = height * (clockHeight + 0.05);

    let content = '';

    // Background
    content += rect(0, 0, width, height, parseColor(bgColor));

    // Center point (adjusted for clock)
    const centerX = width / 2;
    const centerY = clockSpace + (height - clockSpace) * 0.4;

    // Circular progress
    const radius = width * 0.28;
    const strokeWidth = width * 0.035;
    const safeAccent = getSafeAccent(bgColor, accentColor);

    // Background circle - 使用动态对比色
    content += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${contrastAlpha(bgColor, 0.1)}" stroke-width="${strokeWidth}" fill="none" />`;

    // Progress arc
    if (progress > 0) {
        const endAngle = progress * 360;
        content += arc(centerX, centerY, radius, 0, endAngle, parseColor(safeAccent), strokeWidth);
    }

    // Days number - 使用安全强调色
    content += text(centerX, centerY - height * 0.015, daysRemaining.toString(), {
        fill: parseColor(safeAccent),
        fontSize: width * 0.2,
        fontWeight: '700',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // "days left" label - 使用动态对比色
    const daysLeftText = daysRemaining === 1 ? t('dayLeft', daysRemaining, lang) : t('daysLeft', daysRemaining, lang);
    content += text(centerX, centerY + height * 0.08, daysLeftText, {
        fill: contrastAlpha(bgColor, 0.5),
        fontSize: width * 0.04,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Goal name - 使用动态对比色
    const decodedGoalName = decodeURIComponent(goalName);
    content += text(centerX, height * 0.75, decodedGoalName, {
        fill: contrastAlpha(bgColor, 0.9),
        fontSize: width * 0.05,
        fontWeight: '600',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Target date - 使用动态对比色
    const dateStr = targetDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    content += text(centerX, height * 0.77, dateStr, {
        fill: contrastAlpha(bgColor, 0.4),
        fontSize: width * 0.028,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Progress percentage (Commented out/Removed as per user request)
    // const progressPercent = Math.round(progress * 100);
    // content += text(centerX, height * 0.85, `${progressPercent}% complete`, { ... });

    return createSVG(width, height, content);
}
