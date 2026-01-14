import { createSVG, rect, circle, text, parseColor, colorWithAlpha } from '../svg.js';
import { getDateInTimezone, getWeeksBetween } from '../timezone.js';

/**
 * Generate Life Calendar Wallpaper
 * Shows weeks of life as a grid of dots, highlighting lived weeks
 */
export function generateLifeCalendar(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone,
        dob,
        lifespan = 80
    } = options;

    // Get current date in user's timezone
    const { year, month, day } = getDateInTimezone(timezone);
    const now = new Date(year, month - 1, day);

    // Parse date of birth
    let dobDate;
    if (dob) {
        const [dobYear, dobMonth, dobDay] = dob.split('-').map(Number);
        dobDate = new Date(dobYear, dobMonth - 1, dobDay);
    } else {
        // Default: assume user is 25 years old
        dobDate = new Date(year - 25, month - 1, day);
    }

    // Calculate weeks lived
    const weeksLived = Math.max(0, getWeeksBetween(dobDate, now));
    const totalWeeks = lifespan * 52;

    // Layout - 52 columns (weeks per year), rows = lifespan
    const cols = 52;
    const rows = lifespan;
    const padding = width * 0.05;
    const topPadding = height * 0.15;
    const bottomPadding = height * 0.12;

    const availableWidth = width - (padding * 2);
    const availableHeight = height - topPadding - bottomPadding;

    const gap = Math.max(1, width * 0.002);
    const cellWidth = (availableWidth - (gap * (cols - 1))) / cols;
    const cellHeight = (availableHeight - (gap * (rows - 1))) / rows;
    const cellSize = Math.min(cellWidth, cellHeight);
    const dotRadius = cellSize / 2 - 0.5;

    // Center the grid
    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = topPadding + (availableHeight - gridHeight) / 2;

    let content = '';

    // Background
    content += rect(0, 0, width, height, parseColor(bgColor));

    // Title
    content += text(width / 2, topPadding * 0.4, 'Life in Weeks', {
        fill: parseColor(accentColor),
        fontSize: width * 0.06,
        fontWeight: '700',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Age display
    const yearsLived = Math.floor(weeksLived / 52);
    const weeksIntoYear = weeksLived % 52;
    content += text(width / 2, topPadding * 0.7, `${yearsLived} years, ${weeksIntoYear} weeks`, {
        fill: colorWithAlpha('#ffffff', 0.5),
        fontSize: width * 0.03,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    // Week grid (dots)
    for (let i = 0; i < totalWeeks; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isLived = i < weeksLived;
        const isCurrentWeek = i === weeksLived;

        let fillColor;
        if (isCurrentWeek) {
            fillColor = parseColor(accentColor);
        } else if (isLived) {
            fillColor = colorWithAlpha(parseColor(accentColor), 0.7);
        } else {
            fillColor = colorWithAlpha('#ffffff', 0.05);
        }

        content += circle(cx, cy, dotRadius, fillColor);
    }

    // Stats at bottom
    const progressPercent = Math.round((weeksLived / totalWeeks) * 100);
    const weeksRemaining = totalWeeks - weeksLived;
    const yearsRemaining = Math.floor(weeksRemaining / 52);

    content += text(width / 2, height - bottomPadding * 0.6, `${progressPercent}% · ${weeksRemaining.toLocaleString()} weeks remaining`, {
        fill: colorWithAlpha('#ffffff', 0.4),
        fontSize: width * 0.025,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    content += text(width / 2, height - bottomPadding * 0.3, `~${yearsRemaining} years to make count`, {
        fill: colorWithAlpha('#ffffff', 0.3),
        fontSize: width * 0.02,
        fontWeight: '400',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    return createSVG(width, height, content);
}
