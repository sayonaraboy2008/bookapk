# 📚 Folio — Onlayn Kitoblar Web va Mobil Ilovasi

Ushbu loyiha zamonaviy **«folio»** dizayn shabloniga to'liq mos keluvchi Web (React/Vite) va Mobil (React Native/Expo) tizimini o'z ichiga oladi.

---

## 📱 Mobil Ilova Dizayni (Folio Mobile):

1. **Home ekrani (`HomeScreen.js`):**
   * Yuqori status: `folio` brendi va foydalanuvchi avatari.
   * Asosiy sarlavha: `A whole world, one page away.`
   * `Search cloud catalog`: 1,248 ta kitob bo'yicha qidiruv va filtrlar.
   * Kategoriya tabletkalari: `Fiction`, `IT`, `Business`, `Science`.
   * **Trending on Folio**: Yonma-yon 3D muqovali kitob kartochkalari (`The Great Gatsby`, `Pride and Prejudice`).
   * **Pick up where you left off**: Qolgan joydan davom ettirish vidjeti (`45% read · Page 81 of 180`).

2. **My Library ekrani (`LibraryScreen.js`):**
   * Sarlavha: `My library` (`12 books · Your next chapter, always with you.`).
   * Filtrlar: `All 12`, `Downloaded 8`, `Local PDFs 4`.
   * Saralash va tartib: `Recently read ⌄` hamda Grid/List rejimlari.
   * Kitoblar ro'yxati: O'qish foizi, sahifalar hisobi (`81 / 180`), yuklab olinganlik yorliqlari.
   * **Add a PDF from your device**: Telefon xotirasidan lokal PDF fayllarni ilovaga yuklash tugmasi (`DocumentPicker`).

3. **Reader ekrani (`ReaderScreen.js`):**
   * Qulay kitob o'qish qog'oz interfeysi (`#fffdf9`), bo'lim va sahifa belgilari (`Chapter V`).
   * Matndagi jumlalarni sariq rang bilan belgilash (Highlight).
   * Pastki asboblar paneli: Mundarija, shrift sozlamasi (`Aa`), yorug'lik (`Sun`), sahifalar (`81 / 180`).
   * **Notes & Highlights Bottom Sheet**: Har bir kitob bo'yicha belgilangan matnlar, shaxsiy izohlar (`He’s in love with an idea...`) va yangi qayd kiritish inputi.

4. **Pastki menyu paneli (Bottom Navigation):**
   * `Home`, `My library`, `Reader`, `Profile`.

---

## 💻 Web Dastur Dizayni (Folio Web):

* **Dark & Light Mode**: Yuqoridagi Quyosh/Oy tugmasi orqali rejimlar almashadi.
* **4 ustunli kitoblar to'plami**: 8 ta original kitob muqovasi va ma'lumotlari.
* **⌘ K jonli qidiruv**, "Your reading list" vidjeti, brauzer ichidagi PDF o'quvchi va izohlar tizimi.

---

## 🚀 Ishga Tushirish:

### 1. Web ilovani ishga tushirish:
```bash
cd web
npm run dev
```
Brauzerda `http://localhost:3000` ochiladi.

### 2. Mobil ilovani ishga tushirish:
```bash
cd mobile
npm install
npx expo start
```
Telefoningizdagi **Expo Go** ilovasi orqali QR kodni skaner qilib oching.

# bookapk
