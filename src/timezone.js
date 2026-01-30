// Country to timezone mapping
export const countryTimezones = {
    'af': 'Asia/Kabul',
    'al': 'Europe/Tirane',
    'dz': 'Africa/Algiers',
    'ar': 'America/Argentina/Buenos_Aires',
    'au': 'Australia/Sydney',
    'at': 'Europe/Vienna',
    'bd': 'Asia/Dhaka',
    'be': 'Europe/Brussels',
    'br': 'America/Sao_Paulo',
    'ca': 'America/Toronto',
    'cl': 'America/Santiago',
    'cn': 'Asia/Shanghai',
    'co': 'America/Bogota',
    'hr': 'Europe/Zagreb',
    'cz': 'Europe/Prague',
    'dk': 'Europe/Copenhagen',
    'eg': 'Africa/Cairo',
    'fi': 'Europe/Helsinki',
    'fr': 'Europe/Paris',
    'de': 'Europe/Berlin',
    'gr': 'Europe/Athens',
    'hk': 'Asia/Hong_Kong',
    'hu': 'Europe/Budapest',
    'is': 'Atlantic/Reykjavik',
    'in': 'Asia/Kolkata',
    'id': 'Asia/Jakarta',
    'ir': 'Asia/Tehran',
    'iq': 'Asia/Baghdad',
    'ie': 'Europe/Dublin',
    'il': 'Asia/Jerusalem',
    'it': 'Europe/Rome',
    'jp': 'Asia/Tokyo',
    'ke': 'Africa/Nairobi',
    'kr': 'Asia/Seoul',
    'kw': 'Asia/Kuwait',
    'my': 'Asia/Kuala_Lumpur',
    'mx': 'America/Mexico_City',
    'ma': 'Africa/Casablanca',
    'nl': 'Europe/Amsterdam',
    'nz': 'Pacific/Auckland',
    'ng': 'Africa/Lagos',
    'no': 'Europe/Oslo',
    'pk': 'Asia/Karachi',
    'pe': 'America/Lima',
    'ph': 'Asia/Manila',
    'pl': 'Europe/Warsaw',
    'pt': 'Europe/Lisbon',
    'qa': 'Asia/Qatar',
    'ro': 'Europe/Bucharest',
    'ru': 'Europe/Moscow',
    'sa': 'Asia/Riyadh',
    'sg': 'Asia/Singapore',
    'za': 'Africa/Johannesburg',
    'es': 'Europe/Madrid',
    'se': 'Europe/Stockholm',
    'ch': 'Europe/Zurich',
    'tw': 'Asia/Taipei',
    'th': 'Asia/Bangkok',
    'tr': 'Europe/Istanbul',
    'ua': 'Europe/Kyiv',
    'ae': 'Asia/Dubai',
    'gb': 'Europe/London',
    'us': 'America/New_York',
    'vn': 'Asia/Ho_Chi_Minh'
};

/**
 * Get timezone from country code
 */
export function getTimezone(countryCode) {
    return countryTimezones[countryCode.toLowerCase()] || 'UTC';
}

/**
 * Get current date in a specific timezone
 */
export function getDateInTimezone(timezone) {
    const now = new Date();
    const options = { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const parts = formatter.formatToParts(now);

    const year = parseInt(parts.find(p => p.type === 'year').value);
    const month = parseInt(parts.find(p => p.type === 'month').value);
    const day = parseInt(parts.find(p => p.type === 'day').value);

    return { year, month, day };
}

/**
 * Get day of year (1-365)
 */
export function getDayOfYear(year, month, day) {
    const date = new Date(year, month - 1, day);
    const start = new Date(year, 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Get week number of year (1-52)
 */
export function getWeekOfYear(year, month, day) {
    const date = new Date(year, month - 1, day);
    const firstDayOfYear = new Date(year, 0, 1);
    const daysSinceStart = Math.floor((date - firstDayOfYear) / (1000 * 60 * 60 * 24));
    return Math.ceil((daysSinceStart + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Calculate weeks between two dates
 */
export function getWeeksBetween(startDate, endDate) {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor((endDate - startDate) / msPerWeek);
}

/**
 * Calculate days between two dates
 */
export function getDaysBetween(startDate, endDate) {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.ceil((endDate - startDate) / msPerDay);
}

/**
 * Check if year is leap year
 */
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get total days in year
 */
export function getDaysInYear(year) {
    return isLeapYear(year) ? 366 : 365;
}
