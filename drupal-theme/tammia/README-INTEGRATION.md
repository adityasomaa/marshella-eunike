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
