# Pomodoro Timer

Modern, modüler ve duyarlı bir Pomodoro Timer web uygulaması. HTML5, CSS3 ve Vanilla JavaScript (ES Modules) kullanılarak geliştirildi.

## Özellikler

- **Modüler Mimari:** Veri yönetimi (`store.js`) ve uygulama mantığı (`app.js`) 
- **Özelleştirilebilir Süreler:** Odaklanma, kısa mola ve uzun mola süreleri butonlarla dinamik olarak ayarlanabilir ve LocalStorage'da saklanır.
- **Tema Desteği:** Koyu Tema ve Beyaz Tema seçenekleri bulunur.
- **Günlük İstatistikler ve Gün Serisi:** Tamamlanan seanslar, toplam odaklanma süresi ve kesintisiz gün serisi (Day Streak) `YYYY-MM-DD` formatına göre takip edilir.
- **Web Audio API Alarmları:** Harici ses dosyalarına ihtiyaç duymadan, tarayıcının kendi ses sentezleyicisiyle çalışan güçlü alarm sistemi.

## Kullanılan Teknolojiler

- **HTML5:** Anlamsal etiketler ve duyarlı düzen.
- **CSS3:** CSS değişkenleri (variables), Flexbox, Grid ve uyarlanabilir tema yapısı.
- **JavaScript (ES6+):** ES Modülleri, Web Audio API ve LocalStorage yönetimi.

## Proje Yapısı

```text
├── index.html
├── style.css
├── README.md
└── js/
    ├── app.js
    └── store.js