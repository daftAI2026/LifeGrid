import { createSVG, rect, circle, text, parseColor, colorWithAlpha } from '../svg.js';
import { getDateInTimezone, getWeeksBetween } from '../timezone.js';

/**
 * Generate Life Calendar Wallpaper
 * Shows weeks of life as a grid of dots, highlighting lived weeks
 * Leaves space at top for iPhone clock/date
 */
export function generateLifeCalendar(options) {
    const {
        width,
        height,
        bgColor,
        accentColor,
        timezone,
        dob,
        lifespan = 80,
        clockHeight = 0.22
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
        dobDate = new Date(year - 25, month - 1, day);
    }

    // Calculate weeks lived
    const weeksLived = Math.max(0, getWeeksBetween(dobDate, now));
    const totalWeeks = lifespan * 52;

    // Layout - 52 columns (weeks per year), rows = lifespan
    const cols = 52;
    const rows = lifespan;

    // Leave space for clock at top
    // Leave space for clock at top (with extra padding)
    const clockSpace = height * (clockHeight + 0.05); // Extra clearance
    const padding = width * 0.15;  // 15% horizontal padding (slightly less than year due to 52 cols)
    const statsHeight = height * 0.05;
    const bottomMargin = height * 0.05;

    const availableWidth = width - (padding * 2);
    // Constrain height
    const availableHeight = height - clockSpace - statsHeight - bottomMargin;

    // Tighter gap
    const gap = Math.max(1.5, width * 0.003);
    const cellWidth = (availableWidth - (gap * (cols - 1))) / cols;
    // Keep it roughly square
    const cellSize = cellWidth;
    const dotRadius = (cellSize / 2) * 0.85;

    // Center grid
    const gridWidth = (cellSize * cols) + (gap * (cols - 1));
    const gridHeight = (cellSize * rows) + (gap * (rows - 1));
    const startX = (width - gridWidth) / 2;
    const startY = clockSpace + (height * 0.02);

    let content = '';

    // Background
    content += rect(0, 0, width, height, parseColor(bgColor));

    // Week grid (dots)
    for (let i = 0; i < totalWeeks; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = startX + col * (cellSize + gap) + cellSize / 2;
        const cy = startY + row * (cellSize + gap) + cellSize / 2;

        const isLived = i < weeksLived;
        const isCurrentWeek = i === weeksLived;

        let fillColor;
        let radius = dotRadius;

        if (isCurrentWeek) {
            fillColor = parseColor(accentColor);
            radius = dotRadius * 1.15;
        } else if (isLived) {
            fillColor = colorWithAlpha(parseColor(accentColor), 0.75);
        } else {
            fillColor = colorWithAlpha('#ffffff', 0.06);
        }

        content += circle(cx, cy, radius, fillColor);
    }

    // Stats just below grid
    const progressPercent = Math.round((weeksLived / totalWeeks) * 100);
    const weeksRemaining = totalWeeks - weeksLived;
    const statsY = startY + gridHeight + (height * 0.025);

    content += text(width / 2, statsY, `${weeksRemaining.toLocaleString()} weeks left · ${progressPercent}% lived`, {
        fill: colorWithAlpha('#ffffff', 0.5),
        fontSize: width * 0.022,
        fontWeight: '500',
        fontFamily: '"SF Mono", "Menlo", "Courier New", monospace',
        textAnchor: 'middle',
        dominantBaseline: 'middle'
    });

    return createSVG(width, height, content);
}
