/**
 * store.js - Veri Katmanı
 */

export function getSavedTheme() {
    return localStorage.getItem('pomodoro_theme') || 'dark';
}

export function saveTheme(theme) {
    localStorage.setItem('pomodoro_theme', theme);
}

export function getSavedDurations() {
    const stored = localStorage.getItem('pomodoro_durations');
    return stored ? JSON.parse(stored) : { focus: 30, shortBreak: 5, longBreak: 20 };
}

export function saveDurations(durations) {
    localStorage.setItem('pomodoro_durations', JSON.stringify(durations));
}

export function getDayStats(dateKey) {
    const stored = localStorage.getItem(`pomodoro_stats_${dateKey}`);
    return stored ? JSON.parse(stored) : { sessions: 0, focusMinutes: 0, streak: 0 };
}

export function saveDayStats(dateKey, stats) {
    localStorage.setItem(`pomodoro_stats_${dateKey}`, JSON.stringify(stats));
}

// Genel / En Güncel Seri Bilgisini Alır
export function getCurrentStreak() {
    return parseInt(localStorage.getItem('pomodoro_current_streak') || '0', 10);
}

// En Güncel Seri Bilgisini Kaydeder
export function saveCurrentStreak(streak) {
    localStorage.setItem('pomodoro_current_streak', streak.toString());
}

// En Son Aktif Olunan Tarihi Kaydeder (Format: YYYY-MM-DD)
export function getLastActiveDate() {
    return localStorage.getItem('pomodoro_last_active_date') || '';
}

export function saveLastActiveDate(dateKey) {
    localStorage.setItem('pomodoro_last_active_date', dateKey);
}