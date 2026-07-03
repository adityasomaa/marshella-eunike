# Tammia Theme — Panduan Integrasi

Custom theme untuk Tammia Online. Desain: DEWY direction + brand guideline Tammia 2026.
Dibuat & ditest di **Drupal 11.3.6 + Drupal Commerce 3.3.4** (match versi production).

Frontend: Aditya Soma · Juni 2026

## Install

1. Copy folder `tammia/` ke `web/themes/custom/tammia`
2. ```
   drush theme:enable tammia
   drush config:set system.theme default tammia -y
   drush cr
   ```

## Struktur

```
tammia/
├── tammia.info.yml          # regions: shipping_bar, header, primary_menu, footer_first..third, footer_bottom
├── tammia.libraries.yml     # Bootstrap 5.3.2 + GSAP 3.12.5 + Google Fonts (CDN) + css/js theme
├── tammia.theme             # preprocess: discount badge %, body classes
├── css/style.css            # design system lengkap + Drupal/Commerce overrides (bagian akhir file)
├── js/tammia.js             # Drupal.behaviors: blob canvas, nav scroll, reveal GSAP, qty stepper
├── img/logos/               # logo Tammia (red/white/black/gold) + 11 logo brand
└── templates/
    ├── layout/html.html.twig          # inject <canvas id="bg-canvas"> (background blob)
    ├── layout/page.html.twig          # ticker + nav + footer (markup sama dengan preview yang diapprove)
    └── commerce/commerce-product.html.twig  # halaman produk
```

## Mapping field produk (PERLU DISESUAIKAN)

Template `commerce-product.html.twig` mengasumsikan nama field berikut —
sesuaikan dengan field aktual di site:

| Tampilan                    | Asumsi template      | Keterangan |
|-----------------------------|----------------------|------------|
| Product brand (merah, atas) | `field_brand`        | taxonomy/text |
| Title                       | `title`              | — |
| Harga + coret + badge -%    | `variation_price` + `list_price` | badge % dihitung otomatis di `tammia.theme` dari list_price vs price |
| Pilih Variasi (Warna dst.)  | `variations`         | widget add-to-cart Commerce; styling radio→pill sudah di CSS (`.attribute-widgets`) |
| Quantity + Add to Cart      | `variations`         | bagian form yang sama |
| Teaser/summary              | `field_teaser`       | garis kiri merah |
| Image + thumbnails          | `field_images`       | gallery; bisa pakai formatter bawaan dulu |
| Deskripsi Produk            | `body`               | section bawah |

Field yang belum dipetakan tetap dirender (fallback `{{ product|without(...) }}`)
jadi tidak ada data hilang saat field name beda.

## Referensi visual

Preview yang sudah diapprove klien: https://marshella-eunike.vercel.app/tammia-online/
Gunakan itu sebagai acuan 1:1 untuk hasil akhir.

## Status sinkron theme vs preview (per 13 Juni 2026)

Theme ini = **design shell** (CSS design system + layout Twig + behavior dasar).
CSS sudah disinkronkan **penuh** dengan preview terbaru (termasuk komponen
review v2, fix checkbox, photo chip). Sebagian fitur interaktif di preview
sengaja TIDAK diport sebagai JS theme karena di produksi ditangani modul
Drupal Commerce. Pemetaannya:

| Fitur di preview | Di Drupal jadi |
|---|---|
| Cart, checkout, ongkir, pembayaran | Drupal Commerce (cart + checkout flow + shipping + payment) — porsi Bion |
| Login / register / akun | Drupal user + Commerce; review hanya untuk user login = permission |
| Simpan alamat | Commerce **address book** (bawaan), bukan localStorage |
| Review + rating + upload foto | modul **review Commerce / contrib** + field image; lihat catatan permission di bawah |
| Hapus review sendiri, admin tak bisa hapus | permission Drupal: customer = "delete own review", admin JANGAN diberi "delete any review" |
| Social links footer | sudah ada di `page.html.twig`; idealnya jadi block/menu agar editable admin |
| WhatsApp template per konteks | link statis; untuk product page sertakan judul produk via Twig/JS kecil |
| Foto produk asli (14/20) | field image produk Commerce (data asli sudah di backend Bion) |
| Role admin vs customer | Drupal roles + permissions (customer JANGAN diberi akses admin); di preview: user_metadata.role Supabase + RLS |
| Halaman "Akun Saya" | Drupal user page (`/user`) — preview punya account.html sebagai acuan visual |
| Tombol pesanan per status (Batalkan/Lacak/CS/Beli Ulang) | Commerce order states + view riwayat pesanan; acuan visual di orders.html |
| **Product Details terstruktur** (deskripsi heading, deskripsi, material, dimensi, berat, kompartemen, compliant, country, cocok untuk, heading+detail cara pakai, pengiriman & garansi) | **field terpisah di product type Commerce** (bukan satu body). Di preview: kolom jsonb `products.details`, dirender `tammiaRenderProductDetailsTabs` ke tab produk, diedit via Admin Panel > Edit Produk |

Yang **visual/CSS/layout** sudah 1:1 dengan preview. Yang **logika commerce**
mengikuti modul Drupal, bukan JS demo.

## Revisi home 18 Juni 2026 (banner memanjang, ticker, FAQ)

Tiga perubahan halaman depan yang CSS-nya sudah ada di `css/style.css`:

1. **Banner memanjang di header** — full-bleed **slideshow gambar saja**
   (transisi fade + pagination dots), tanpa teks/CTA. JS = behavior
   `Drupal.behaviors.tammiaHomeBanner` (sudah di `js/tammia.js`). Di Drupal:
   buat **Block** custom (region `content` paling atas / region baru
   `home_banner`) berisi markup:
   ```html
   <section class="home-banner">
     <div class="home-banner-slider" id="homeBanner" data-autoplay="5000">
       <div class="hb-slide active"><img src="/themes/custom/tammia/img/placeholders/banner-1.jpg" alt="Promo 1"></div>
       <div class="hb-slide"><img src="/themes/custom/tammia/img/placeholders/banner-2.jpg" alt="Promo 2"></div>
       <!-- banner-3..5.jpg -->
       <div class="hb-dots" id="homeBannerDots"></div>
     </div>
   </section>
   ```
   `banner-1..5.jpg` masih **placeholder graphic** — ganti dengan banner
   desain-jadi dari klien (jumlah slide bebas; dots auto-generate via JS).
2. **Ticker announcement diperlambat** — `.shipping-bar .ticker` animasi
   `28s → 56s` + pause saat hover. Murni CSS, sudah ikut tersinkron.
3. **Section "Top Picks of the Week" diganti FAQ** — accordion
   `<details>/<summary>` (kelas `.faq-wrap/.faq-item/.faq-q/.faq-a`) dengan
   **animasi buka/tutup** (height + fade) via `Drupal.behaviors.tammiaFaq`
   (di `js/tammia.js`; tanpa JS pun tetap toggle native). Di Drupal bisa jadi
   **Block** custom atau view "FAQ" (judul = `.faq-q`, isi = `.faq-a`). Markup
   contoh ada di preview `index.html`. Tiap `.faq-q` wajib punya
   `<i class="bi bi-plus faq-ic"></i>` di akhir (ikon +/× yang berotasi).

## Brand guideline cepat

- Merah primary `#e11d25` · off-white `#f4f2f0` · gold accent `#d3ac50`
- Secondary `#a22a34`, `#6d1b24`, abu `#414042`
- Font: Comfortaa (judul) + Poppins (body) + JetBrains Mono (label kecil)
- Logo jangan dipotong/dipisah komponennya; varian red/white/black/gold tersedia di `img/logos/`

## Catatan keamanan (penting)

Composer audit menandai Drupal core 11.3.6 kena advisories
**SA-CORE-2026-001 s/d 004** dan Commerce 3.3.4 kena **SA-CONTRIB-2026-041**.
Sangat disarankan update core + Commerce ke patch release terbaru
sebelum/saat integrasi theme ini (theme kompatibel `^11`).
