import {
    getSavedTheme,
    saveTheme,
    getSavedDurations,
    saveDurations,
    getDayStats,
    saveDayStats
} from "./store.js";

// ==========================================
// 1. STATE VE SÜRELER
// ==========================================
let durationsInMinutes = getSavedDurations();

let MODES = {
    focus: durationsInMinutes.focus * 60,
    shortBreak: durationsInMinutes.shortBreak * 60,
    longBreak: durationsInMinutes.longBreak * 60
};

let currentMode = 'focus';
let timeLeft = MODES[currentMode];
let isRunning = false;
let timerInterval = null;

let currentDate = new Date();

// ==========================================
// 2. DOM ELEMENTLERİ
// ==========================================
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startButton');
const resetBtn = document.getElementById('resetButton');

const focusBtn = document.getElementById('focusButton');
const shortBreakBtn = document.getElementById('shortBreakButton');
const longBreakBtn = document.getElementById('longBreakButton');

const focusTimeEl = document.getElementById('focusTime');
const shortBreakTimeEl = document.getElementById('shortBreakTime');
const longBreakTimeEl = document.getElementById('longBreakTime');

const themeButton = document.getElementById('themeButton');
const prevDayBtn = document.getElementById('prevDayBtn');
const nextDayBtn = document.getElementById('nextDayBtn');
const todayDateEl = document.getElementById('todayDate');

const streakEl = document.getElementById('streak');
const todaySessionsEl = document.getElementById('todaySessions');
const totalFocusTimeEl = document.getElementById('totalFocusTime');

// Artı / Eksi Butonları
const focusDec = document.getElementById('focusDec');
const focusInc = document.getElementById('focusInc');
const shortBreakDec = document.getElementById('shortBreakDec');
const shortBreakInc = document.getElementById('shortBreakInc');
const longBreakDec = document.getElementById('longBreakDec');
const longBreakInc = document.getElementById('longBreakInc');

// ==========================================
// 3. SES KONTROLÜ (Web Audio API - Gürültülü Alarm)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 'sawtooth' dalga boyu en keskin ve yüksek sesli dalgadır
function playTone(freq, duration) {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Ses seviyesi (0.4 max sınırlara yakındır, oldukça gürültülüdür)
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

// Süre bittiğinde çalacak 3'lü güçlü siren
function playAlarm() {
    playTone(440, 0.4);
    setTimeout(() => playTone(440, 0.4), 450);
    setTimeout(() => playTone(587.33, 0.6), 900);
}

// ==========================================
// 4. YARDIMCI FORMAT FONKSİYONLARI
// ==========================================
function getFormattedKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDisplayDateString(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}.${month}.${year}`;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    timerDisplay.textContent = formatted;
    document.title = `(${formatted}) Pomodoro Timer`;
}

function updateDurationLabels() {
    focusTimeEl.textContent = `${durationsInMinutes.focus} dk`;
    shortBreakTimeEl.textContent = `${durationsInMinutes.shortBreak} dk`;
    longBreakTimeEl.textContent = `${durationsInMinutes.longBreak} dk`;
}

// ==========================================
// 5. İSTATİSTİK VE GÜNLÜK TAKİP
// ==========================================
function renderStats() {
    const key = getFormattedKey(currentDate);
    const todayKey = getFormattedKey(new Date());
    const stats = getDayStats(key);

    if (key === todayKey) {
        todayDateEl.textContent = `Bugün: ${getDisplayDateString(currentDate)}`;
        nextDayBtn.disabled = true;
    } else {
        todayDateEl.textContent = getDisplayDateString(currentDate);
        nextDayBtn.disabled = false;
    }

    streakEl.textContent = `🔥 ${stats.streak}`;
    todaySessionsEl.textContent = stats.sessions;
    totalFocusTimeEl.textContent = `${stats.focusMinutes} dk`;
}

function completeFocusSession() {
    const todayKey = getFormattedKey(new Date());
    const stats = getDayStats(todayKey);

    stats.sessions += 1;
    stats.focusMinutes += durationsInMinutes.focus;
    stats.streak += 1;

    saveDayStats(todayKey, stats);
    renderStats();
}

// ==========================================
// 6. TEMA YÖNETİMİ
// ==========================================
let currentTheme = getSavedTheme();

function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);

    const sunIcon = themeButton.querySelector('.theme-switch__icon--sun');
    const moonIcon = themeButton.querySelector('.theme-switch__icon--moon');

    if (theme === 'light') {
        if (sunIcon) sunIcon.classList.add('active');
        if (moonIcon) moonIcon.classList.remove('active');
    } else {
        if (sunIcon) sunIcon.classList.remove('active');
        if (moonIcon) moonIcon.classList.add('active');
    }
}

themeButton.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    changeTheme(currentTheme);
});

// ==========================================
// 7. SÜRE DEĞİŞTİRME (+5 / -5 DK)
// ==========================================
function adjustDuration(mode, delta) {
    let newVal = durationsInMinutes[mode] + delta;
    if (newVal < 5) newVal = 5; // Minimum 5 dakika

    durationsInMinutes[mode] = newVal;
    MODES[mode] = newVal * 60;

    saveDurations(durationsInMinutes);
    updateDurationLabels();

    if (currentMode === mode && !isRunning) {
        timeLeft = MODES[mode];
        updateDisplay();
    }
}

focusDec.addEventListener('click', () => adjustDuration('focus', -5));
focusInc.addEventListener('click', () => adjustDuration('focus', 5));
shortBreakDec.addEventListener('click', () => adjustDuration('shortBreak', -5));
shortBreakInc.addEventListener('click', () => adjustDuration('shortBreak', 5));
longBreakDec.addEventListener('click', () => adjustDuration('longBreak', -5));
longBreakInc.addEventListener('click', () => adjustDuration('longBreak', 5));

// ==========================================
// 8. SAYAÇ VE MOD MANTIĞI
// ==========================================
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Duraklat';

    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.textContent = 'Başlat';
            playAlarm();

            if (currentMode === 'focus') {
                completeFocusSession();
                switchMode('shortBreak');
            } else {
                switchMode('focus');
            }
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.textContent = 'Devam Et';
}

function resetTimer() {
    pauseTimer();
    timeLeft = MODES[currentMode];
    startBtn.textContent = 'Başlat';
    updateDisplay();
}

function switchMode(mode) {
    pauseTimer();
    currentMode = mode;
    timeLeft = MODES[mode];
    startBtn.textContent = 'Başlat';
    updateDisplay();

    focusBtn.classList.toggle('active', mode === 'focus');
    shortBreakBtn.classList.toggle('active', mode === 'shortBreak');
    longBreakBtn.classList.toggle('active', mode === 'longBreak');
}

startBtn.addEventListener('click', () => {
    if (isRunning) pauseTimer();
    else startTimer();
});

resetBtn.addEventListener('click', resetTimer);

focusBtn.addEventListener('click', () => switchMode('focus'));
shortBreakBtn.addEventListener('click', () => switchMode('shortBreak'));
longBreakBtn.addEventListener('click', () => switchMode('longBreak'));

// Tarih Gezgini Olayları
prevDayBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    renderStats();
});

nextDayBtn.addEventListener('click', () => {
    const todayKey = getFormattedKey(new Date());
    const currentKey = getFormattedKey(currentDate);
    if (currentKey !== todayKey) {
        currentDate.setDate(currentDate.getDate() + 1);
        renderStats();
    }
});

// ==========================================
// 9. BAŞLANGIÇ (INIT)
// ==========================================
function init() {
    changeTheme(currentTheme);
    updateDurationLabels();
    updateDisplay();
    renderStats();
}

init();