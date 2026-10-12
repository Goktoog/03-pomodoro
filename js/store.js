/**
 * store.js - Veri Katmanı (LocalStorage Yönetimi)
 */

// Kayıtlı temayı okuma
export function getSavedTheme() {
    return localStorage.getItem('pomodoro_theme') || 'dark';
}

// Seçilen temayı kaydetme
export function saveTheme(theme) {
    localStorage.setItem('pomodoro_theme', theme);
}

// Kullanıcının özelleştirdiği süreleri okuma (Varsayılan: 30 dk odak, 5 dk kısa mola, 20 dk uzun mola)
export function getSavedDurations() {
    const stored = localStorage.getItem('pomodoro_durations');
    return stored ? JSON.parse(stored) : { focus: 30, shortBreak: 5, longBreak: 20 };
}

// Süreleri kaydetme
export function saveDurations(durations) {
    localStorage.setItem('pomodoro_durations', JSON.stringify(durations));
}

// Belirli bir güne ait istatistikleri okuma (Key formatı: YYYY-MM-DD)
export function getDayStats(dateKey) {
    const stored = localStorage.getItem(`pomodoro_stats_${dateKey}`);
    return stored ? JSON.parse(stored) : { sessions: 0, focusMinutes: 0, streak: 0 };
}

// Belirli bir günün istatistiklerini kaydetme
export function saveDayStats(dateKey, stats) {
    localStorage.setItem(`pomodoro_stats_${dateKey}`, JSON.stringify(stats));
}