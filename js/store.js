/* store.js veri katmanı */

//Kayıtlı temayı okumak için get fonksiyonu (eğer varsa) ve varsayılan olarak 'light' temayı döndürmek için bir fonksiyon
export function getSavedTheme() {
    return localStorage.getItem('theme') || 'light'; // Varsayılan tema 'light' olarak ayarlanır.
}

//Seçilen temayı kaydetmek için set fonksiyonu
export function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}
