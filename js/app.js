import { getSavedTheme, saveTheme } from "./store.js"; // store.js dosyasından getSavedTheme ve saveTheme fonksiyonlarını içe aktar

const themeButton = document.getElementById('themeButton'); // Tema değiştirme butonunu seç

//Sayfa yüklendiğinde kaydedilmiş temayı uygula
let currentTheme = getSavedTheme();

// Temayı uygulayan fonksiyon
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme); // Seçilen temayı kaydet
}

// Tema değiştirme butonuna tıklama olayını gerçekleştiren event listener
themeButton.addEventListener('click', () => {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'light';
    }
    changeTheme(currentTheme);
});

// Sayfa yüklendiğinde kaydedilmiş temayı uygula
changeTheme(currentTheme);