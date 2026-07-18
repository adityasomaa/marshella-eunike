# Panduan Integrasi Theme Tammia — Drupal Commerce (Fresh Install → 1:1 Preview)

Dokumen ini panduan langkah demi langkah supaya theme **Tammia** terpasang di
**Drupal Commerce fresh install** dan tampil + berfungsi sama seperti preview:
**https://marshella-eunike.vercel.app/tammia-online/**

Konsep penting: **theme ini = "kulit" (design shell).** Semua CSS/layout/desain
sudah jadi. Yang perlu di-setup = konten & logika Commerce di balik kulit itu.
Markup bawaan Drupal/Commerce otomatis ter-skin oleh `css/style.css` (tombol,
form, select, tabel cart, grid produk — lihat blok "DRUPAL OVERRIDES" di CSS).

> Peta lengkap "fitur preview → padanan Drupal" ada di **README-INTEGRATION.md**
> (file terpisah di folder yang sama). Dokumen ini fokus ke urutan eksekusi.

---

## 0. Prasyarat
- Drupal **11** + Drupal **Commerce 3** (fresh). PHP 8.3+, Composer, Drush.
- Update core + Commerce ke patch terbaru dulu (advisory SA-CORE-2026-001..004,
  SA-CONTRIB-2026-041): `composer update drupal/core-* drupal/commerce --with-all-dependencies`

Install Commerce kalau belum:
```bash
composer require drupal/commerce
drush en commerce commerce_product commerce_order commerce_cart \
  commerce_checkout commerce_price commerce_store commerce_number_pattern -y
```

---

## 1. Pasang & aktifkan theme
1. Extract isi zip → `web/themes/custom/tammia/`
2. Aktifkan + jadikan default:
```bash
drush theme:enable tammia
drush config:set system.theme default tammia -y
drush cr
```
3. Buka situs. Kalau muncul **shipping bar (ticker) + navbar pill logo Tammia +
   footer gelap** → theme sudah kepasang benar. (Font, Bootstrap, GSAP,
   Product Sans dimuat otomatis dari `tammia.libraries.yml`.)

Region yang tersedia (untuk taruh block nanti):
`shipping_bar, header, primary_menu, highlighted, breadcrumb, content,
sidebar_first, footer_first, footer_second, footer_third, footer_bottom`
> `page.html.twig` sudah punya **fallback statis** (nav & footer) kalau region
> kosong, jadi situs tetap tampil rapi walau block belum diatur.

---

## 2. Product type + FIELD (paling penting untuk halaman produk 1:1)
Template `templates/commerce/commerce-product.html.twig` memanggil field dengan
nama placeholder di bawah. **Buat field ini** di product type (Admin → Commerce
→ Configuration → Product types → Manage fields), samakan namanya — atau kalau
nama berbeda, edit variabel di twig itu.

Field dasar:
| Field | Tipe | Keterangan |
|---|---|---|
| `field_brand` | Text / Taxonomy ref | Brand (uppercase merah di atas judul) |
| `field_images` | Image (multivalue) | Galeri foto produk |
| `field_image` | Image | (fallback foto tunggal) |
| `field_teaser` | Text | Tagline 1 baris |
| `body` | Text (long) | Paragraf deskripsi |

Field **Product Details terstruktur** (revisi wajib klien — tampil di section
`.pd-details`):
`field_desc_heading, field_material, field_dimensi, field_berat,
field_kompartemen, field_compliant, field_country, field_cocok,
field_howto_heading, field_howto (Text long/multivalue → tiap value = 1 langkah),
field_shipping`

Diskon: badge "−40%" dihitung otomatis di `tammia.theme` dari **`list_price`**
(harga coret) vs harga jual pada variation. Jadi cukup isi list_price di variation.

Variations: buat **attribute** Ukuran & Warna → otomatis jadi tombol "Pilih
Variasi" (CSS pill sudah ada).

---

## 3. Import katalog + foto
- Import produk (nama, brand, harga, list_price, stok, kategori, deskripsi,
  Product Details) via **Commerce CSV / Migrate**, atau manual.
- Kategori pakai **taxonomy**: Makeup Brushes, Sponges, Eyelash, Beauty Cases,
  Tweezers, Nail Care, Hair Tools, Bath Accessories.
- Upload foto produk (rasio 1:1, mis. 1000×1000).

---

## 4. Store, checkout, ongkir, pembayaran
- **Store** + currency **IDR**.
- **Checkout**: semua field alamat **open text** (bukan dropdown) + aktifkan
  **address book** (untuk fitur "simpan alamat"). Buy-now vs cart sudah bawaan.
- **Ongkir**: `commerce_shipping` + rate JNE/J&T/SiCepat, atau modul RajaOngkir/
  Biteship. Gratis ongkir ≥ Rp 150.000.
- **Pembayaran**: gateway transfer/VA/e-wallet (Midtrans/Xendit) + cicilan 0%.
- **JANGAN** aktifkan promotion/coupon (klien minta tanpa diskon/promo).

---

## 5. User role & permission
- Role **customer** (default pendaftar) & **admin**.
- Registrasi **email + password**.
- Permission: hanya **admin** yang bisa akses kelola produk/order; **customer
  tidak**. (Di preview: Marshella=admin, Aditya=customer.)
- Halaman akun = `/user` (acuan visual: `account.html` di preview).

---

## 6. Blok homepage (biar depan sama persis preview)
Buat sebagai **Custom Block** (Block layout) taruh di region `content`, atau
susun via front-page node/Layout Builder. Markup + CSS sudah tersedia:

- **Banner slideshow memanjang** — markup `.home-banner` + `#homeBanner`
  (banner-1..5.jpg). JS `Drupal.behaviors.tammiaHomeBanner` auto-jalan. Contoh
  markup di README-INTEGRATION.md.
- **Kategori showcase**, **brand marquee** (logo brand), **Why Tammia**,
  **Featured products** (view produk).
- **FAQ accordion** — markup `.faq-wrap` + `<details class="faq-item">`. JS
  `Drupal.behaviors.tammiaFaq` auto-jalan. Contoh di README.
- **Newsletter** — modul **Simplenews**, taruh form di footer.

Menu utama → region `primary_menu` (atau pakai fallback statis). Social links
footer sudah ada di `page.html.twig` (IG/FB/TikTok/WA Tammia).

---

## 7. Reviews produk
- Modul review Commerce/contrib + field foto.
- Aturan klien: **hanya user login** boleh review; upload **maks 5 foto / 2MB**;
  user boleh **hapus review sendiri**; **admin TIDAK boleh hapus review orang**
  (jangan beri permission "delete any review").

---

## 8. Halaman statis
- **About**, **Contact** (Webform), **FAQ** — konten dari preview.

---

## 9. Checklist testing sebelum go-live
- [ ] Homepage tampil sama: banner, kategori, produk, FAQ, footer
- [ ] Halaman produk: brand, harga (+badge diskon), variasi, Add to Cart,
      section Product Details (material/dimensi/cara pakai/pengiriman)
- [ ] Cart → checkout (field open text, simpan alamat) → order masuk
- [ ] Ongkir & pembayaran jalan
- [ ] Login/register; customer TIDAK bisa buka admin
- [ ] Responsive (mobile/tablet) + cross-browser
- [ ] `drush cr` setelah semua config

**Target akhir (samakan 1:1):** https://marshella-eunike.vercel.app/tammia-online/

Ada yang kurang jelas soal theme? Hubungi Aditya (frontend). Logika Commerce
(produk, cart, checkout, ongkir, order, role) mengikuti modul Drupal.
