/* ============================================================
   TAMMIA ONLINE - Main JS
   ============================================================ */

/* ---------- Shared product catalog ----------
   Loaded async from Supabase via tammiaLoadProducts().
   Code that needs the data should `await window.TAMMIA_PRODUCTS_READY`
   or `await tammiaProductsReady()`. */
window.TAMMIA_PRODUCTS = [];
window.TAMMIA_PRODUCTS_READY = new Promise(resolve => { window._resolveProducts = resolve; });
let TAMMIA_PRODUCTS = window.TAMMIA_PRODUCTS; // local mutable alias used by older code


/* Real product photos scraped from d11.tammiaonline.com (others stay SVG until
   full catalog photos arrive from client). Keyed by product slug. */
const TAMMIA_LOCAL_IMAGES = {
  // foto asli dari katalog lama (d11 + arsip Wayback tammiaonline.com)
  'sonia-miller-transparent-travel-case-pouch': 'assets/img/products/sonia-miller-transparent-travel-case-pouch.jpg',
  'tammia-professional-1310-deluxe-duo-brow-brush': 'assets/img/products/tammia-professional-1310-deluxe-duo-brow-brush.jpg',
  'tammia-professional-pcus52-cushion-sponge': 'assets/img/products/tammia-professional-pcus52-cushion-sponge.jpg',
  'd-up-lash-focus-eyelash-k-pop-idol': 'assets/img/products/d-up-lash-focus-eyelash-k-pop-idol.jpg',
  'real-techniques-everyday-essentials-brush-set': 'assets/img/products/real-techniques-everyday-essentials-brush-set.jpg',
  'real-techniques-miracle-complexion-sponge': 'assets/img/products/real-techniques-miracle-complexion-sponge.jpg',
  'tweezerman-slant-tweezer-stainless': 'assets/img/products/tweezerman-slant-tweezer-stainless.jpg',
  'tweezerman-mini-slant-tweezer-pink': 'assets/img/products/tweezerman-mini-slant-tweezer-pink.jpg',
  'ardell-wispies-natural-false-lashes': 'assets/img/products/ardell-wispies-natural-false-lashes.jpg',
  'duo-brush-on-lash-adhesive-clear': 'assets/img/products/duo-brush-on-lash-adhesive-clear.jpg',
  'tangle-teezer-original-detangler-pink': 'assets/img/products/tangle-teezer-original-detangler-pink.jpg',
  'ecotools-bamboo-buffer-block': 'assets/img/products/ecotools-bamboo-buffer-block.jpg',
  'goody-quick-style-boar-bristle-brush': 'assets/img/products/goody-quick-style-boar-bristle-brush.jpg',
  'tammia-pro-contour-brush-1245-angled': 'assets/img/products/tammia-pro-contour-brush-1245-angled.jpg',
};


/* ============================================================
   Reviews per-produk (maks 10) — pool per kategori, deterministik
   ============================================================ */
const TAMMIA_REVIEW_PEOPLE = [
  ['Fitri R.', 'Surabaya'], ['Adelia P.', 'Jakarta'], ['Mawar S.', 'Bandung'],
  ['Nadia K.', 'Tangerang'], ['Sari W.', 'Bekasi'], ['Putri A.', 'Depok'],
  ['Citra L.', 'Yogyakarta'], ['Rani M.', 'Semarang'], ['Vina H.', 'Medan'],
  ['Dewi S.', 'Bali'], ['Indah P.', 'Malang'], ['Lia F.', 'Bogor'],
  ['Karina D.', 'Jakarta'], ['Tasya R.', 'Surabaya'], ['Bella N.', 'Makassar'],
  ['Gita P.', 'Palembang'], ['Maya S.', 'Solo'], ['Rina W.', 'Bandung'],
  ['Sinta A.', 'Jakarta'], ['Olivia T.', 'Tangerang'], ['Hana K.', 'Bekasi'],
  ['Zahra M.', 'Depok'], ['Cindy L.', 'Jakarta'], ['Aulia R.', 'Surabaya'],
];

const TAMMIA_REVIEW_POOL = {
  'Makeup Brushes': [
    { r: 5, h: 'Bulu halus, nggak rontok', b: 'Kuasnya lembut banget di kulit, blending jadi gampang dan hasilnya flawless. Udah cuci beberapa kali bulunya tetap rapi, nggak rontok sama sekali.', photo: 1, days: 6 },
    { r: 5, h: 'Worth banget buat MUA', b: 'Aku MUA freelance dan ini jadi andalan di kit. Pegangannya enak, nggak bikin pegel pas job panjang. Kualitas premium tapi harga masih masuk akal.', photo: 1, days: 12 },
    { r: 5, h: 'Hasil makeup makin rapi', b: 'Sejak pakai brush ini makeup aku jadi jauh lebih rapi, apalagi buat bagian detail. Pengiriman dari Tammia juga cepet dan dipacking aman.', photo: 0, days: 19 },
    { r: 4, h: 'Bagus, cuma agak besar', b: 'Kualitas oke banget, bulunya padat. Cuma buat aku yang muka kecil head-nya agak gede, jadi harus hati-hati pas aplikasi. Overall puas.', photo: 0, days: 27 },
    { r: 5, h: 'Repeat order ke-3', b: 'Ini pembelian ketiga aku, nggak pernah kecewa. Bulunya soft, gampang dibersihkan, dan awet. Recommended buat yang baru mulai belajar makeup.', photo: 0, days: 34 },
    { r: 5, h: 'Premium feel', b: 'Berasa kaya brush high-end tapi harganya jauh lebih ramah. Finishing-nya rapi, nggak ada bulu yang lepas pas pertama dipakai.', photo: 1, days: 41 },
    { r: 4, h: 'Sesuai ekspektasi', b: 'Sesuai sama foto dan deskripsi. Nyaman dipakai harian. Bintang 4 karena packaging luarnya agak penyok pas sampai, tapi produknya aman.', photo: 0, days: 52 },
    { r: 5, h: 'Pemula friendly', b: 'Baru belajar makeup dan brush ini ngebantu banget. Aplikasi foundation jadi lebih merata. CS Tammia juga ramah pas aku tanya-tanya.', photo: 0, days: 63 },
    { r: 5, h: 'Soft dan gampang dicuci', b: 'Teksturnya lembut, dicuci pakai sabun bayi langsung bersih dan cepet kering. Nggak bau apek. Suka banget!', photo: 1, days: 78 },
    { r: 5, h: 'Kualitas konsisten', b: 'Beli buat restock kit, kualitasnya tetap konsisten kaya yang lama. Brand lokal favorit aku buat tools.', photo: 0, days: 95 },
  ],
  'Makeup Sponges': [
    { r: 5, h: 'Nggak nyerap foundation', b: 'Sponge-nya empuk dan yang penting nggak rakus nyerap foundation. Hasil akhir natural, nyatu sama kulit. Udah dipakai berkali-kali masih bagus.', photo: 1, days: 5 },
    { r: 5, h: 'Mengembang sempurna', b: 'Pas dibasahin langsung mengembang gede dan empuk. Blending jadi cepet dan hasilnya dewy. Bakal repeat order lagi.', photo: 1, days: 11 },
    { r: 5, h: 'Hasil flawless', b: 'Buat aplikasi cushion sama foundation hasilnya flawless banget, nggak cakey. Worth the price, apalagi dapet lebih dari satu.', photo: 0, days: 18 },
    { r: 4, h: 'Bagus tapi cepet kotor', b: 'Kualitas oke, empuk dan nyaman. Cuma emang harus rajin dicuci karena cepet keliatan kotor. Tapi itu wajar sih buat sponge.', photo: 0, days: 26 },
    { r: 5, h: 'Lembut di kulit', b: 'Teksturnya lembut banget, nggak bikin iritasi di kulit sensitif aku. Bagus buat naburin bedak juga. Suka!', photo: 0, days: 33 },
    { r: 5, h: 'Pas buat sehari-hari', b: 'Dipakai harian dan awet. Gampang dibersihin, cepet kering. Harga terjangkau buat kualitas segini.', photo: 1, days: 44 },
    { r: 5, h: 'Repurchase terus', b: 'Udah langganan beli sponge di sini. Konsisten bagus, nggak gampang sobek. Pengiriman juga rapi.', photo: 0, days: 58 },
    { r: 4, h: 'Oke buat harga segini', b: 'Lumayan banget buat harganya. Empuk dan ngebantu blending. Minus dikit karena agak cepet mengecil setelah sering dicuci.', photo: 0, days: 71 },
    { r: 5, h: 'Dewy finish', b: 'Hasilnya selalu dewy dan nyatu. Nggak ninggalin garis. Favorit aku banget buat daily makeup.', photo: 1, days: 89 },
  ],
  'Eyelash': [
    { r: 5, h: 'Natural banget', b: 'Bulu matanya tipis dan natural, cocok buat daily look. Tulang lashnya lentur jadi nyaman dipakai dan gampang nempel. Suka banget!', photo: 1, days: 7 },
    { r: 5, h: 'Ringan di mata', b: 'Hampir nggak kerasa pas dipakai, ringan banget. Bentuknya cantik bikin mata keliatan lebih hidup. Bisa dipakai ulang juga.', photo: 1, days: 14 },
    { r: 5, h: 'Reusable dan awet', b: 'Udah dipakai beberapa kali masih bagus bentuknya, asal hati-hati lepasnya. Worth it banget buat harganya.', photo: 0, days: 21 },
    { r: 4, h: 'Cantik tapi agak panjang', b: 'Bentuknya bagus, cuma buat mata aku agak kepanjangan jadi mesti digunting dikit. Selebihnya nyaman dan natural.', photo: 0, days: 29 },
    { r: 5, h: 'Cocok buat pemula', b: 'Pertama kali pakai bulu mata palsu dan ini gampang banget nempelnya. Nggak kaku, hasilnya natural. Recommended!', photo: 0, days: 38 },
    { r: 5, h: 'Ala Korean look', b: 'Hasilnya persis kaya idol Korea, natural tapi tetap bikin mata pop. Bahannya lembut, nggak bikin perih.', photo: 1, days: 49 },
    { r: 5, h: 'Repeat buyer', b: 'Ini beli lagi karena udah cocok. Bentuk konsisten, packaging rapi, sampai dalam kondisi mulus.', photo: 0, days: 64 },
    { r: 4, h: 'Bagus, lem nyusul', b: 'Lashnya bagus dan natural. Cuma di paketan ini lemnya tipis jadi aku pakai lem terpisah. Tetap puas kok.', photo: 0, days: 82 },
  ],
  'Eyelash Glue': [
    { r: 5, h: 'Nempel kuat seharian', b: 'Lemnya nempel kuat dari pagi sampai malam, bulu mata nggak lepas walau kena keringat. Pas kering jadi clear, nggak keliatan.', photo: 1, days: 8 },
    { r: 5, h: 'Clear dan nggak iritasi', b: 'Setelah kering bener-bener bening, jadi rapi banget. Nggak bikin mata perih atau merah. Aplikatornya juga gampang.', photo: 0, days: 16 },
    { r: 5, h: 'Cepet kering', b: 'Daya rekatnya cepet, jadi nggak perlu nunggu lama buat nempelin lash. Tahan lama dan gampang dibersihin pas mau dilepas.', photo: 0, days: 24 },
    { r: 4, h: 'Bagus tapi kecil', b: 'Kualitas lem oke banget, tahan seharian. Cuma ukurannya agak kecil jadi cepet habis kalau sering pakai. Worth buat dicoba.', photo: 0, days: 35 },
    { r: 5, h: 'Andalan buat MUA', b: 'Aku pakai buat klien dan nggak pernah ngecewain. Rekat kuat, aman di kulit sensitif. Bakal restock terus.', photo: 1, days: 47 },
    { r: 5, h: 'Tahan walau berkeringat', b: 'Dipakai seharian di acara outdoor, bulu mata tetap nempel sempurna. Impressed banget sama dayanya.', photo: 0, days: 61 },
  ],
  'Tweezers': [
    { r: 5, h: 'Jepitannya presisi', b: 'Ujungnya ketemu sempurna, jadi bulu sehalus apapun kejepit. Stainless-nya kokoh dan nggak licin pas dipegang. Best tweezer aku.', photo: 1, days: 6 },
    { r: 5, h: 'Tajam dan akurat', b: 'Buat rapihin alis jadi gampang banget, sekali jepit langsung kena. Bahannya berkualitas, kerasa awet. Recommended!', photo: 0, days: 13 },
    { r: 5, h: 'Worth setiap rupiah', b: 'Awalnya ragu sama harganya, tapi pas dipakai langsung paham kenapa worth. Presisi banget, beda jauh sama tweezer murahan.', photo: 0, days: 22 },
    { r: 4, h: 'Bagus, ujung tajam', b: 'Kualitas mantap, jepitannya akurat. Cuma karena ujungnya tajam banget mesti hati-hati nyimpannya. Overall puas.', photo: 0, days: 31 },
    { r: 5, h: 'Enteng dan nyaman', b: 'Ringan dipegang, nyaman buat detail. Cocok juga buat aplikasi bulu mata palsu. Packaging aman sampai rumah.', photo: 1, days: 43 },
    { r: 5, h: 'Premium quality', b: 'Kerasa banget kualitas premiumnya, beda sama yang biasa. Pegasnya pas, nggak terlalu keras. Suka!', photo: 0, days: 57 },
    { r: 5, h: 'Pas buat alis', b: 'Cabut alis jadi rapi dan cepet. Genggamannya pas, nggak licin. Bakal jadi andalan di pouch aku.', photo: 0, days: 74 },
  ],
  'Beauty Cases': [
    { r: 5, h: 'Muat banyak banget', b: 'Pouchnya luas, semua brush kit aku muat plus masih ada space buat sponge sama lipstick. Materialnya tebal, kelihatan awet.', photo: 1, days: 5 },
    { r: 5, h: 'Perfect buat travel', b: 'Pakai buat mobile job, gampang cek isi tanpa buka semua zipper karena transparan. Resleting halus, packaging rapi. Repeat fix.', photo: 1, days: 12 },
    { r: 4, h: 'Bagus, ukuran pas-pasan', b: 'Kualitas oke, cuma menurut aku size M agak kecil kalau bawa brush set lengkap. Next mau coba size L. Overall puas.', photo: 1, days: 20 },
    { r: 5, h: 'Transparan praktis', b: 'Suka banget karena transparan jadi gampang nyari barang. Bahannya kokoh, nggak gampang penyok. Worth banget.', photo: 0, days: 28 },
    { r: 5, h: 'Awet dan rapi', b: 'Udah dipakai beberapa bulan, zipper masih lancar dan nggak ada yang sobek. Kualitas jauh di atas harganya.', photo: 0, days: 39 },
    { r: 5, h: 'Premium look', b: 'Tampilannya premium, nggak murahan. Kompartemennya banyak jadi semua tertata rapi. Senang banget.', photo: 1, days: 53 },
    { r: 4, h: 'Sesuai foto', b: 'Sesuai sama foto dan deskripsi. Praktis dibawa kemana-mana. Bintang 4 karena baunya agak menyengat pas baru dibuka, tapi hilang sendiri.', photo: 0, days: 68 },
  ],
  'Nail Care': [
    { r: 5, h: 'Hasil kuku halus', b: 'Buat ngehalusin permukaan kuku jadi gampang banget, hasilnya mulus. Materialnya berkualitas, nggak cepet aus. Suka!', photo: 1, days: 7 },
    { r: 5, h: 'Praktis dan awet', b: 'Ringan, gampang dipakai, dan awet. Kuku jadi rapi tanpa harus ke salon. Worth buat dirawat di rumah.', photo: 0, days: 15 },
    { r: 5, h: 'Rapi banget', b: 'Hasil akhirnya rapi dan bersih, nggak bikin kuku rusak. Pengiriman cepet dan dipacking aman. Recommended.', photo: 0, days: 23 },
    { r: 4, h: 'Oke buat harga', b: 'Lumayan banget buat harganya. Berfungsi sesuai ekspektasi. Minus dikit karena packaging sederhana, tapi produknya bagus.', photo: 0, days: 34 },
    { r: 5, h: 'Wajib punya', b: 'Salah satu tools yang wajib ada di rumah. Gampang dipakai dan hasilnya memuaskan. Bakal repeat.', photo: 1, days: 48 },
    { r: 5, h: 'Berkualitas', b: 'Kerasa kokoh dan berkualitas. Nggak gampang rusak walau sering dipakai. Senang nemu produk sebagus ini.', photo: 0, days: 66 },
  ],
  'Hair Tools': [
    { r: 5, h: 'Rambut nggak kusut lagi', b: 'Nyisir rambut basah jadi nggak sakit dan nggak rontok. Kusutnya kebuka pelan-pelan tanpa narik. Game changer buat rambut panjang aku.', photo: 1, days: 6 },
    { r: 5, h: 'Lembut di kulit kepala', b: 'Bristle-nya lembut, nyaman di kulit kepala, nggak bikin perih. Rambut jadi lebih rapi dan berkilau. Suka banget!', photo: 1, days: 14 },
    { r: 5, h: 'Praktis dibawa', b: 'Ukurannya pas buat dimasukin tas, jadi bisa rapihin rambut kapan aja. Kualitasnya bagus, gigi sisirnya kuat.', photo: 0, days: 22 },
    { r: 4, h: 'Bagus, warna beda dikit', b: 'Fungsinya mantap, rambut jadi gampang diatur. Warnanya agak beda sama foto tapi nggak masalah. Tetap puas.', photo: 0, days: 30 },
    { r: 5, h: 'Cocok rambut tebal', b: 'Rambut aku tebal dan sering kusut, sejak pakai ini jadi gampang banget diatur. Nggak ada rambut patah. Recommended.', photo: 0, days: 42 },
    { r: 5, h: 'Awet dan kokoh', b: 'Udah dipakai lama, gigi sisirnya masih kuat semua, nggak ada yang patah. Worth banget buat harganya.', photo: 1, days: 59 },
  ],
  'Bath Accessories': [
    { r: 5, h: 'Praktis banget', b: 'Ngebantu banget buat kebutuhan sehari-hari, gampang dipakai dan hasilnya rapi. Kualitasnya bagus buat harganya.', photo: 0, days: 9 },
    { r: 5, h: 'Sesuai ekspektasi', b: 'Sesuai sama deskripsi, berfungsi dengan baik. Pengiriman cepet dan dipacking rapi. Puas belanja di Tammia.', photo: 0, days: 18 },
    { r: 4, h: 'Lumayan oke', b: 'Berfungsi sesuai kebutuhan. Materialnya lumayan. Minus dikit di packaging, tapi produknya aman sampai rumah.', photo: 0, days: 29 },
    { r: 5, h: 'Wajib punya', b: 'Salah satu item yang ngebantu banget di rumah. Gampang dipakai, awet. Recommended buat dicoba.', photo: 1, days: 45 },
    { r: 5, h: 'Kualitas bagus', b: 'Kerasa kokoh dan berkualitas, nggak gampang rusak. Senang nemu produk sepraktis ini di Tammia.', photo: 0, days: 63 },
  ],
};

function tammiaReviewHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

function tammiaSeededOrder(seed, total) {
  const arr = Array.from({ length: total }, (_, i) => i);
  let s = seed || 1;
  for (let i = total - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

/* Hasilkan daftar review stabil & relevan untuk satu produk (maks 10). */
function tammiaReviewsForProduct(product) {
  const pool = TAMMIA_REVIEW_POOL[product.category] || TAMMIA_REVIEW_POOL['Makeup Brushes'];
  const seed = tammiaReviewHash(product.slug || product.name || 'x');
  const count = Math.min(pool.length, 10, 5 + (seed % 6)); // 5..10
  const order = tammiaSeededOrder(seed, pool.length);
  const people = tammiaSeededOrder(seed + 7, TAMMIA_REVIEW_PEOPLE.length);
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = pool[order[i]];
    const who = TAMMIA_REVIEW_PEOPLE[people[i % TAMMIA_REVIEW_PEOPLE.length]];
    out.push({
      name: who[0], city: who[1], rating: t.r, headline: t.h,
      body: t.b, photo: t.photo, days: t.days,
    });
  }
  return out;
}

function tammiaReviewDateLabel(days) {
  const d = new Date(Date.now() - days * 86400000);
  const bln = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${bln[d.getMonth()]} ${d.getFullYear()}`;
}

async function tammiaLoadProducts() {
  if (!window.tammiaSupabase) {
    console.warn('Supabase client not initialised. Products will be empty.');
    window._resolveProducts([]);
    return [];
  }
  try {
    const { data, error } = await window.tammiaSupabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    const mapped = (data || []).map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      was: undefined, // diskon dinonaktifkan (request klien 12 Jun 2026)
      svg: p.svg_type || 'brush',
      image_url: p.image_url || TAMMIA_LOCAL_IMAGES[p.slug] || null,
      rating: parseFloat(p.rating) || 4.5,
      reviewCount: p.review_count || 0,
      stock: p.stock,
      featured: p.is_featured,
      short_description: p.short_description || '',
      description: p.description || '',
      created_at: p.created_at,
    }));
    // Sinkronkan rating + jumlah review dengan dataset review per-produk (maks 10)
    mapped.forEach(p => {
      const rv = tammiaReviewsForProduct(p);
      p._reviews = rv;
      p.reviewCount = rv.length;
      p.rating = rv.length ? Math.round((rv.reduce((a, r) => a + r.rating, 0) / rv.length) * 10) / 10 : p.rating;
    });
    window.TAMMIA_PRODUCTS = mapped;
    TAMMIA_PRODUCTS = mapped;
    window._resolveProducts(mapped);
    return mapped;
  } catch (e) {
    console.warn('Failed to load products from Supabase:', e);
    window._resolveProducts([]);
    return [];
  }
}

function tammiaProductsReady() {
  return window.TAMMIA_PRODUCTS_READY;
}

/* ---------- Helpers ---------- */
/* ---------- WhatsApp Tammia Online + template per konteks ---------- */
const TAMMIA_WA_NUMBER = '62818883349';
function tammiaWaLink(message) {
  return 'https://wa.me/' + TAMMIA_WA_NUMBER + '?text=' + encodeURIComponent(message);
}

function tammiaFormatPrice(n) {
  return 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* Returns e.g. "40% OFF" or "" if no sale */
function tammiaCalcSalePercent(price, was) {
  const p = parseInt(price, 10);
  const w = parseInt(was, 10);
  if (!w || !p || w <= p) return '';
  const pct = Math.round(((w - p) / w) * 100);
  return pct > 0 ? `${pct}% OFF` : '';
}

/* Renders an <img> if image_url set, else fallback inline SVG.
   For card-sized usage the SVG keeps its existing centered styling
   via .product-img svg. The <img> covers the full square box. */
function tammiaProductImg(product) {
  if (product && product.image_url) {
    const safeAlt = (product.name || '').replace(/"/g, '&quot;');
    return `<img src="${product.image_url}" alt="${safeAlt}" loading="lazy" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;">`;
  }
  return tammiaSearchSvg(product ? product.svg : 'brush');
}

/* Build one product-cell HTML for shop grid (and reusable for index/related).
   Wrap in col classes externally. */
function tammiaProductCardHtml(p) {
  const wasAttr = p.was ? p.was : '';
  const saleFlag = p.was ? '1' : '0';
  const salePct = tammiaCalcSalePercent(p.price, p.was);
  const isNew = !!p.featured;
  let badge = '';
  if (salePct) {
    badge = `<span class="product-badge badge-sale">${salePct}</span>`;
  } else if (isNew) {
    badge = `<span class="product-badge badge-new">NEW</span>`;
  }
  const priceHtml = p.was
    ? `<span class="product-price sale">${tammiaFormatPrice(p.price)}</span><span class="product-price-was">${tammiaFormatPrice(p.was)}</span>`
    : `<span class="product-price">${tammiaFormatPrice(p.price)}</span>`;
  const ratingNum = (p.rating || 0).toFixed(1);
  const slug = p.slug || '';
  const safeName = (p.name || '').replace(/"/g, '&quot;');
  const safeBrand = (p.brand || '').replace(/"/g, '&quot;');
  return `
    <a href="product.html?slug=${encodeURIComponent(slug)}" class="product-card d-block text-decoration-none">
      <div class="product-img">
        ${badge}
        ${tammiaProductImg(p)}
        <button class="product-quick" data-open-cart type="button"><i class="bi bi-plus"></i></button>
      </div>
      <span class="product-brand">${safeBrand}</span>
      <div class="product-name">${safeName}</div>
      <div class="product-price-row">${priceHtml}</div>
      <div class="product-rating"><span class="stars">★★★★★</span> ${ratingNum} <span class="dot-sep"></span> ${p.reviewCount || 0}</div>
    </a>`;
}

function tammiaProductCellHtml(p, colClasses = 'col-6 col-lg-3') {
  const wasAttr = p.was ? p.was : '';
  const saleFlag = p.was ? '1' : '0';
  const safeName = (p.name || '').replace(/"/g, '&quot;');
  const safeBrand = (p.brand || '').replace(/"/g, '&quot;');
  const safeCat = (p.category || '').replace(/"/g, '&quot;');
  return `
    <div class="${colClasses} product-cell"
         data-name="${safeName}"
         data-brand="${safeBrand}"
         data-price="${p.price}"
         data-was="${wasAttr}"
         data-cat="${safeCat}"
         data-rating="${(p.rating || 0).toFixed(1)}"
         data-sale="${saleFlag}"
         data-slug="${p.slug || ''}">
      ${tammiaProductCardHtml(p)}
    </div>`;
}

function tammiaSkeletonCellHtml(colClasses = 'col-6 col-lg-3') {
  return `
    <div class="${colClasses}">
      <div class="product-card-skeleton">
        <div class="sk-img"></div>
        <div class="sk-line short"></div>
        <div class="sk-line"></div>
        <div class="sk-line med"></div>
      </div>
    </div>`;
}

/* ---------- Custom confirm modal (replaces window.confirm) ---------- */
function tammiaConfirm({ title = 'Konfirmasi', message = '', confirmText = 'OK', cancelText = 'Batal', danger = false, onConfirm = null, onCancel = null } = {}) {
  // Remove any stray prior instance
  const prior = document.getElementById('tammiaConfirmModal');
  if (prior) prior.remove();

  const wrap = document.createElement('div');
  wrap.id = 'tammiaConfirmModal';
  wrap.className = 'tammia-confirm-wrap';
  wrap.innerHTML = `
    <div class="tammia-confirm-backdrop"></div>
    <div class="tammia-confirm-box" role="dialog" aria-modal="true" aria-labelledby="tammiaConfirmTitle">
      <div class="tammia-confirm-icon ${danger ? 'danger' : ''}">
        <i class="bi ${danger ? 'bi-trash3' : 'bi-question-circle'}"></i>
      </div>
      <h4 class="tammia-confirm-title" id="tammiaConfirmTitle">${title}</h4>
      <p class="tammia-confirm-message">${message}</p>
      <div class="tammia-confirm-actions">
        <button type="button" class="btn-ghost-confirm" data-confirm-cancel>${cancelText}</button>
        <button type="button" class="btn-action-confirm ${danger ? 'danger' : ''}" data-confirm-ok>${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Lock scroll
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  function close() {
    wrap.classList.remove('open');
    setTimeout(() => {
      wrap.remove();
      document.body.style.overflow = prevOverflow;
    }, 220);
    document.removeEventListener('keydown', onKey);
  }
  function confirm() {
    close();
    if (typeof onConfirm === 'function') onConfirm();
  }
  function cancel() {
    close();
    if (typeof onCancel === 'function') onCancel();
  }
  function onKey(e) {
    if (e.key === 'Escape') cancel();
    else if (e.key === 'Enter') confirm();
  }

  wrap.querySelector('[data-confirm-ok]').addEventListener('click', confirm);
  wrap.querySelector('[data-confirm-cancel]').addEventListener('click', cancel);
  wrap.querySelector('.tammia-confirm-backdrop').addEventListener('click', cancel);
  document.addEventListener('keydown', onKey);

  // Animate in
  requestAnimationFrame(() => wrap.classList.add('open'));

  // Auto-focus confirm button for keyboard users
  setTimeout(() => {
    const btn = wrap.querySelector('[data-confirm-ok]');
    if (btn) btn.focus();
  }, 220);
}

function tammiaSearchSvg(type) {
  switch (type) {
    case 'brush':
      return '<svg viewBox="0 0 100 100"><rect x="46" y="14" width="8" height="50" rx="2" fill="#1a1a1a"/><ellipse cx="50" cy="74" rx="14" ry="18" fill="#d3ac50"/></svg>';
    case 'sponge':
      return '<svg viewBox="0 0 100 100"><path d="M50,10 C28,10 12,32 14,58 C16,84 36,92 50,92 C64,92 84,84 86,58 C88,32 72,10 50,10 Z" fill="#f0c2c4"/></svg>';
    case 'lash':
      return '<svg viewBox="0 0 140 60"><path d="M10,40 Q70,52 130,40" stroke="#1a1a1a" stroke-width="2.5" fill="none"/><line x1="40" y1="44" x2="38" y2="6" stroke="#1a1a1a" stroke-width="2.5"/><line x1="70" y1="46" x2="70" y2="2" stroke="#1a1a1a" stroke-width="2.7"/><line x1="100" y1="44" x2="102" y2="6" stroke="#1a1a1a" stroke-width="2.5"/></svg>';
    case 'case':
      return '<svg viewBox="0 0 100 100"><rect x="20" y="30" width="60" height="50" rx="4" fill="#1a1a1a"/><rect x="24" y="34" width="52" height="42" rx="3" fill="#f8f1e2"/><rect x="38" y="22" width="24" height="12" rx="3" fill="#1a1a1a"/></svg>';
    case 'tweezer':
      return '<svg viewBox="0 0 100 100"><path d="M40,12 L48,80 L52,80 L60,12 L56,10 L50,72 L44,10 Z" fill="#1a1a1a"/><circle cx="50" cy="86" r="6" fill="#d3ac50"/></svg>';
    case 'nail':
      return '<svg viewBox="0 0 100 100"><rect x="36" y="24" width="28" height="56" rx="6" fill="#e11d25"/><rect x="42" y="18" width="16" height="10" rx="3" fill="#1a1a1a"/></svg>';
    case 'hair':
      return '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="32" ry="20" fill="#1a1a1a"/><rect x="44" y="68" width="12" height="22" rx="2" fill="#1a1a1a"/></svg>';
    default:
      return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#d3ac50"/></svg>';
  }
}

/* ---------- Toast helper ---------- */
function tammiaToast(message, icon) {
  let toast = document.getElementById('tammiaToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'tammiaToast';
    toast.className = 'tammia-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = (icon ? `<i class="bi ${icon}"></i>` : '') + `<span>${message}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- Wishlist storage ---------- */
function tammiaGetWishlist() {
  try { return JSON.parse(localStorage.getItem('tammia_wishlist') || '[]'); }
  catch (e) { return []; }
}
function tammiaSaveWishlist(list) {
  localStorage.setItem('tammia_wishlist', JSON.stringify(list));
  tammiaUpdateWishlistBadge();
}
function tammiaUpdateWishlistBadge() {
  const list = tammiaGetWishlist();
  document.querySelectorAll('.wishlist-badge').forEach(b => {
    b.textContent = list.length;
    b.setAttribute('data-count', String(list.length));
  });
}
/* Sync all heart UI for a given product name (card buttons + product detail).
   Updates both the .liked class AND the inner icon class. */
function tammiaSyncWishlistHearts(name, liked) {
  const safe = (window.CSS && CSS.escape) ? CSS.escape(name) : name.replace(/"/g, '\\"');
  // Product card hearts
  document.querySelectorAll(`.product-wish[data-name="${safe}"]`).forEach(h => {
    h.classList.toggle('liked', liked);
    h.innerHTML = liked
      ? '<i class="bi bi-heart-fill"></i>'
      : '<i class="bi bi-heart"></i>';
    h.setAttribute('aria-pressed', String(!!liked));
  });
  // Product detail heart (in pd-info CTA row)
  document.querySelectorAll(`[data-pd-wish][data-name="${safe}"]`).forEach(btn => {
    btn.classList.toggle('liked', liked);
    const i = btn.querySelector('i');
    if (i) i.className = liked ? 'bi bi-heart-fill' : 'bi bi-heart';
    const label = btn.querySelector('.pd-wish-label');
    if (label) label.textContent = liked ? 'Tersimpan' : 'Wishlist';
    btn.setAttribute('aria-pressed', String(!!liked));
  });
}

/* ---------- User storage ---------- */
function tammiaGetUser() {
  try { return JSON.parse(localStorage.getItem('tammia_user') || 'null'); }
  catch (e) { return null; }
}
function tammiaSaveUser(user) {
  if (user) localStorage.setItem('tammia_user', JSON.stringify(user));
  else localStorage.removeItem('tammia_user');
}

/* ---------- Cart storage + helpers (localStorage-backed) ---------- */
function getCart() {
  try {
    const arr = JSON.parse(localStorage.getItem('tammia_cart') || '[]');
    arr.forEach(i => { if (i.was) i.was = null; }); // diskon dinonaktifkan
    return arr;
  }
  catch (e) { return []; }
}
function setCart(arr) {
  localStorage.setItem('tammia_cart', JSON.stringify(arr || []));
  renderCartDrawer();
  tammiaUpdateCartBadge();
  document.dispatchEvent(new CustomEvent('tammia:cart-changed'));
}
function tammiaUpdateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((s, it) => s + (parseInt(it.qty, 10) || 0), 0);
  document.querySelectorAll('.cart-badge').forEach(b => {
    if (b.classList.contains('wishlist-badge')) return;
    b.textContent = count;
    b.style.display = count > 0 ? '' : 'none';
  });
}
function tammiaSvgForProductName(name) {
  const p = (window.TAMMIA_PRODUCTS || []).find(p => p.name === name);
  return p ? p.svg : 'brush';
}
function addToCart(product) {
  if (!product || !product.name) return;
  const cart = getCart();
  const existing = cart.find(i => i.name === product.name);
  const addedQty = parseInt(product.qty, 10) || 1;
  if (existing) {
    existing.qty = (parseInt(existing.qty, 10) || 0) + addedQty;
  } else {
    cart.push({
      name: product.name,
      brand: product.brand || '',
      price: parseInt(product.price, 10) || 0,
      was: product.was ? parseInt(product.was, 10) : null,
      qty: addedQty,
      svg: product.svg || tammiaSvgForProductName(product.name),
    });
  }
  setCart(cart);
}
function removeFromCart(name) {
  const cart = getCart().filter(i => i.name !== name);
  setCart(cart);
}
function updateCartQty(name, qty) {
  const cart = getCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  const q = parseInt(qty, 10);
  if (!q || q <= 0) {
    setCart(cart.filter(i => i.name !== name));
  } else {
    item.qty = q;
    setCart(cart);
  }
}

/* Render the cart drawer body from current localStorage cart. */
function renderCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  const body = drawer.querySelector('.drawer-body');
  const foot = drawer.querySelector('.drawer-foot');
  const headCount = drawer.querySelector('.drawer-head h5 span');
  if (!body) return;

  const cart = getCart();
  const totalQty = cart.reduce((s, it) => s + (parseInt(it.qty, 10) || 0), 0);
  const subtotal = cart.reduce((s, it) => s + (parseInt(it.price, 10) || 0) * (parseInt(it.qty, 10) || 0), 0);

  if (headCount) headCount.textContent = `(${totalQty})`;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="drawer-empty" style="text-align:center; padding:48px 16px;">
        <div style="font-size:48px; margin-bottom:12px; opacity:0.4;"><i class="bi bi-bag"></i></div>
        <div style="font-family:'Comfortaa',sans-serif; font-size:20px; margin-bottom:6px;">Keranjang masih kosong</div>
        <div style="color:var(--muted); font-size:14px; margin-bottom:20px;">Yuk pilih beauty tools favoritmu.</div>
        <a href="shop.html" class="btn btn-peach btn-sm">Mulai Belanja</a>
      </div>`;
    if (foot) foot.style.display = 'none';
    return;
  }

  if (foot) foot.style.display = '';
  body.innerHTML = cart.map(it => `
    <div class="drawer-item" data-name="${it.name.replace(/"/g, '&quot;')}" style="position:relative;">
      <div class="drawer-item-img">${tammiaSearchSvg(it.svg || 'brush')}</div>
      <div>
        <div class="drawer-item-name">${it.name}</div>
        <div class="drawer-item-brand">${it.brand || ''}</div>
        <div class="drawer-item-price">${tammiaFormatPrice(it.price)}</div>
      </div>
      <div class="qty-stepper">
        <button class="qty-minus" type="button">−</button>
        <input type="text" value="${it.qty}" readonly>
        <button class="qty-plus" type="button">+</button>
      </div>
      <button class="drawer-item-remove" type="button" aria-label="Hapus produk"
        style="background:transparent; border:none; padding:6px; color:var(--muted); cursor:pointer; transition:color .15s ease; position:absolute; top:8px; right:8px; border-radius:6px; line-height:1;">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  `).join('');

  // Update subtotal in footer
  const totalVal = drawer.querySelector('.drawer-total .val');
  if (totalVal) totalVal.textContent = tammiaFormatPrice(subtotal);

  // Wire item interactions
  body.querySelectorAll('.drawer-item').forEach(item => {
    const name = item.dataset.name;
    const minus = item.querySelector('.qty-minus');
    const plus = item.querySelector('.qty-plus');
    const rm = item.querySelector('.drawer-item-remove');
    if (minus) minus.addEventListener('click', () => {
      const current = (getCart().find(i => i.name === name) || {}).qty || 1;
      if (current > 1) {
        updateCartQty(name, current - 1);
      } else {
        tammiaConfirm({
          title: 'Hapus dari Keranjang?',
          message: `<strong>${name}</strong> akan dihapus dari keranjang kamu.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          danger: true,
          onConfirm: () => removeFromCart(name),
        });
      }
    });
    if (plus) plus.addEventListener('click', () => {
      const current = (getCart().find(i => i.name === name) || {}).qty || 1;
      updateCartQty(name, current + 1);
    });
    if (rm) {
      rm.addEventListener('mouseenter', () => { rm.style.color = 'var(--rouge)'; });
      rm.addEventListener('mouseleave', () => { rm.style.color = 'var(--muted)'; });
      rm.addEventListener('click', () => {
        tammiaConfirm({
          title: 'Hapus dari Keranjang?',
          message: `<strong>${name}</strong> akan dihapus dari keranjang kamu.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          danger: true,
          onConfirm: () => removeFromCart(name),
        });
      });
    }
  });
}

/* ---------- Custom select component ---------- */
function initCustomSelect(selectEl) {
  if (!selectEl || selectEl.dataset.cinit === '1') return;
  selectEl.dataset.cinit = '1';
  const isFull = selectEl.classList.contains('custom-select-full');
  const wrap = document.createElement('div');
  wrap.className = 'custom-select-wrap' + (isFull ? ' full' : '');
  selectEl.parentNode.insertBefore(wrap, selectEl);
  wrap.appendChild(selectEl);
  selectEl.style.display = 'none';

  const btn = document.createElement('div');
  btn.className = 'custom-select';
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('role', 'combobox');
  btn.setAttribute('aria-expanded', 'false');

  const list = document.createElement('ul');
  list.className = 'custom-select-list';
  list.setAttribute('role', 'listbox');

  function syncLabel() {
    const opt = selectEl.options[selectEl.selectedIndex];
    btn.textContent = opt ? opt.text : '';
  }
  function buildList() {
    list.innerHTML = '';
    Array.from(selectEl.options).forEach((opt, idx) => {
      const li = document.createElement('li');
      li.textContent = opt.text;
      li.setAttribute('role', 'option');
      if (idx === selectEl.selectedIndex) li.classList.add('selected');
      li.addEventListener('mousedown', e => { e.preventDefault(); });
      li.addEventListener('click', () => {
        selectEl.selectedIndex = idx;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        syncLabel();
        Array.from(list.children).forEach(c => c.classList.remove('selected'));
        li.classList.add('selected');
        close();
      });
      list.appendChild(li);
    });
  }
  syncLabel();
  buildList();
  wrap.appendChild(btn);
  wrap.appendChild(list);

  function open() {
    btn.classList.add('open');
    list.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
  function close() {
    btn.classList.remove('open');
    list.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function toggle() {
    if (btn.classList.contains('open')) close();
    else open();
  }
  btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    if (e.key === 'Escape') close();
  });
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Re-sync if select changed externally
  selectEl.addEventListener('change', () => {
    syncLabel();
    Array.from(list.children).forEach((c, i) => {
      c.classList.toggle('selected', i === selectEl.selectedIndex);
    });
  });
}

/* ---------- Login modal builder ---------- */
function tammiaBuildAuthModal() {
  if (document.getElementById('tammiaAuthModal')) return;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop-custom';
  backdrop.id = 'tammiaAuthBackdrop';

  const modal = document.createElement('div');
  modal.className = 'auth-modal';
  modal.id = 'tammiaAuthModal';
  const realAuth = !!window.TAMMIA_USE_REAL_AUTH;
  modal.innerHTML = `
    <div class="auth-modal-head">
      <h5>Masuk / <em style="font-style:italic; color:var(--rouge);">Daftar</em></h5>
      <button class="auth-modal-close" data-close-auth aria-label="Tutup"><i class="bi bi-x-lg"></i></button>
    </div>
    ${realAuth ? '' : `
    <div class="auth-demo-banner">
      <i class="bi bi-info-circle"></i>
      <span><strong>Demo Mode</strong> — Real OAuth requires Supabase setup. See <code>SUPABASE-SETUP.md</code></span>
    </div>`}
    <div class="auth-tabs">
      <button class="auth-tab active" data-auth-tab="login">Masuk</button>
      <button class="auth-tab" data-auth-tab="register">Daftar</button>
    </div>
    <div class="auth-pane active" data-auth-pane="login">
      <div class="auth-field">
        <label>Username atau Email</label>
        <input type="text" placeholder="username atau email@kamu.com" id="authLoginEmail" autocomplete="username" required>
      </div>
      <div class="auth-field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" id="authLoginPass" required>
      </div>
      <div class="auth-row-between">
        <span></span>
        <a href="#" data-auth-forgot>Lupa password?</a>
      </div>
      <button class="btn btn-peach auth-submit" data-auth-action="login">Masuk <i class="bi bi-arrow-right"></i></button>

      <div class="auth-divider">atau</div>
      <div class="auth-social-row">
        <button class="auth-social-btn" data-auth-social="google">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Lanjut dengan Google
        </button>
      </div>
      <div class="auth-bottom-link">Belum punya akun? <a data-auth-switch="register">Daftar di sini</a></div>
    </div>
    <div class="auth-pane" data-auth-pane="register">
      <div class="auth-field">
        <label>Nama Lengkap</label>
        <input type="text" placeholder="Marshella Eunike" id="authRegName" required>
      </div>
      <div class="auth-field">
        <label>Username</label>
        <input type="text" placeholder="marshella" id="authRegUsername" autocomplete="username" required pattern="[a-zA-Z0-9_]{3,20}" title="3-20 karakter, hanya huruf, angka, dan underscore">
        <small style="display:block; margin-top:6px; color:var(--muted); font-size:12px;">3-20 karakter. Hanya huruf, angka, dan underscore.</small>
      </div>
      <div class="auth-field">
        <label>Email <span style="color:var(--muted); font-weight:400;">(opsional)</span></label>
        <input type="email" placeholder="email@kamu.com (opsional)" id="authRegEmail">
      </div>
      <div class="auth-field">
        <label>No. WhatsApp</label>
        <input type="tel" placeholder="+62 812 xxxx xxxx" id="authRegPhone">
      </div>
      <div class="auth-field">
        <label>Password</label>
        <input type="password" placeholder="••••••••" id="authRegPass" required>
      </div>
      <div class="auth-field">
        <label>Konfirmasi Password</label>
        <input type="password" placeholder="••••••••" id="authRegConfirm" required>
      </div>
      <label class="auth-terms">
        <input type="checkbox" id="authRegTerms" required>
        <span>Saya setuju dengan <a href="#">Syarat &amp; Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> Tammia Online.</span>
      </label>
      <button class="btn btn-peach auth-submit" data-auth-action="register">Buat Akun <i class="bi bi-arrow-right"></i></button>
      <div class="auth-divider">atau</div>
      <div class="auth-social-row">
        <button class="auth-social-btn" data-auth-social="google">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
          Lanjut dengan Google
        </button>
      </div>
      <div class="auth-bottom-link">Sudah punya akun? <a data-auth-switch="login">Masuk di sini</a></div>
    </div>
    <div class="auth-pane" data-auth-pane="forgot">
      <div class="auth-forgot-head">
        <h6 style="font-family:'Comfortaa',sans-serif; font-weight:400; font-size:22px; margin:0 0 6px;">Reset Password</h6>
        <p style="color:var(--muted); font-size:13px; margin:0 0 18px;">Masukkan email kamu, link reset akan dikirim.</p>
      </div>
      <div class="auth-field">
        <label>Email</label>
        <input type="email" placeholder="email@kamu.com" id="authForgotEmail" required>
      </div>
      <button class="btn btn-peach auth-submit" data-auth-action="forgot">Kirim Link Reset <i class="bi bi-send"></i></button>
      <div class="auth-bottom-link" style="margin-top:18px;"><a data-auth-switch="login"><i class="bi bi-arrow-left"></i> Kembali ke Masuk</a></div>
      <div class="auth-forgot-success" data-forgot-success style="display:none; text-align:center; padding:18px 0 4px;">
        <div style="
          width:56px; height:56px; border-radius:50%;
          background:var(--pink-tint); color:var(--rouge);
          display:flex; align-items:center; justify-content:center;
          font-size:28px; margin:0 auto 14px;">
          <i class="bi bi-check-lg"></i>
        </div>
        <div style="font-family:'Comfortaa',sans-serif; font-size:20px; margin-bottom:6px;">Link reset telah dikirim</div>
        <div style="color:var(--muted); font-size:13px;" data-forgot-success-body>Periksa inbox dan folder spam.</div>
        <div class="auth-bottom-link" style="margin-top:18px;"><a data-auth-switch="login"><i class="bi bi-arrow-left"></i> Kembali ke Masuk</a></div>
      </div>
    </div>`;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  function openAuth() {
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeAuth() {
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  backdrop.addEventListener('click', closeAuth);
  modal.querySelectorAll('[data-close-auth]').forEach(b => b.addEventListener('click', closeAuth));
  modal.querySelectorAll('.auth-tab').forEach(t => {
    t.addEventListener('click', () => {
      modal.querySelectorAll('.auth-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.authTab;
      modal.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('active', p.dataset.authPane === target));
    });
  });
  modal.querySelectorAll('[data-auth-switch]').forEach(a => {
    a.addEventListener('click', () => {
      const target = a.dataset.authSwitch;
      switchPane(target);
    });
  });

  // Helper to switch to a pane that has no tab (forgot)
  function switchPane(target) {
    modal.querySelectorAll('.auth-tab').forEach(x => x.classList.toggle('active', x.dataset.authTab === target));
    modal.querySelectorAll('.auth-pane').forEach(p => p.classList.toggle('active', p.dataset.authPane === target));
    // Reset forgot pane success view when switching away from it
    if (target !== 'forgot') {
      const succ = modal.querySelector('[data-forgot-success]');
      const formBits = modal.querySelectorAll('[data-auth-pane="forgot"] .auth-field, [data-auth-pane="forgot"] .auth-forgot-head, [data-auth-pane="forgot"] [data-auth-action="forgot"]');
      if (succ) succ.style.display = 'none';
      formBits.forEach(b => b.style.display = '');
      const bottom = modal.querySelector('[data-auth-pane="forgot"] > .auth-bottom-link');
      if (bottom) bottom.style.display = '';
    }
  }

  // Forgot link triggers switch to forgot pane
  modal.querySelectorAll('[data-auth-forgot]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      switchPane('forgot');
    });
  });

  function authComplete(name, email) {
    tammiaSaveUser({ name: name || 'Tammia Lover', email: email || 'tammia@example.com', loggedIn: true });
    closeAuth();
    tammiaRefreshAuthUi();
    tammiaToast(`Halo, ${name || 'kamu'}! Selamat berbelanja.`, 'bi-check-circle-fill');
  }

  function setBtnBusy(btn, busy, label) {
    if (!btn) return;
    if (busy) {
      btn.dataset.origHtml = btn.dataset.origHtml || btn.innerHTML;
      btn.innerHTML = `<span class="auth-spinner"></span> ${label || 'Memproses...'}`;
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.origHtml || btn.innerHTML;
      btn.disabled = false;
    }
  }
  function showAuthError(btn, msg) {
    // Toast for now (keeps modal tidy)
    tammiaToast(msg, 'bi-exclamation-triangle-fill');
  }

  /* Map username -> email for accounts created via Admin API.
     Username metadata is on auth.users but anon can't query it directly.
     For these seeded accounts we keep a small lookup map; new sign-ups
     auto-generate "{username}@tammia.users.id" so they self-map below. */
  const TAMMIA_USERNAME_MAP = {
    'aditya': 'adityasomagc@gmail.com',
    'marshella': 'marshella@tammia.users.id'
  };

  function tammiaResolveEmail(identifier) {
    const id = (identifier || '').trim();
    if (!id) return null;
    if (id.includes('@')) return id; // already an email
    const lower = id.toLowerCase();
    // Check explicit map first
    if (TAMMIA_USERNAME_MAP[lower]) return TAMMIA_USERNAME_MAP[lower];
    // Fallback: convention "{username}@tammia.users.id"
    return `${lower}@tammia.users.id`;
  }

  modal.querySelector('[data-auth-action="login"]').addEventListener('click', async e => {
    e.preventDefault();
    const btn = e.currentTarget;
    const identifier = modal.querySelector('#authLoginEmail').value.trim();
    const pass = modal.querySelector('#authLoginPass').value;
    const email = tammiaResolveEmail(identifier);
    if (tammiaUseRealAuth()) {
      if (!identifier || !pass) { showAuthError(btn, 'Username/email dan password wajib diisi.'); return; }
      setBtnBusy(btn, true);
      try {
        const { data, error } = await window.tammiaSupabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        // onAuthStateChange will sync localStorage + UI
        const name = (data.user && data.user.user_metadata && data.user.user_metadata.full_name) || identifier;
        closeAuth();
        tammiaToast(`Halo, ${name}! Selamat berbelanja.`, 'bi-check-circle-fill');
      } catch (err) {
        showAuthError(btn, err.message || 'Login gagal. Cek email/password.');
      } finally {
        setBtnBusy(btn, false);
      }
      return;
    }
    // Demo mode
    const demoEmail = email || 'tammia@example.com';
    const name = (demoEmail.split('@')[0] || 'Sayang');
    authComplete(name.charAt(0).toUpperCase() + name.slice(1), demoEmail);
  });

  modal.querySelector('[data-auth-action="register"]').addEventListener('click', async e => {
    e.preventDefault();
    const btn = e.currentTarget;
    const name = modal.querySelector('#authRegName').value.trim() || 'Tammia Lover';
    const usernameRaw = (modal.querySelector('#authRegUsername') || {}).value || '';
    const username = usernameRaw.trim().toLowerCase();
    const emailInput = modal.querySelector('#authRegEmail').value.trim();
    const phone = modal.querySelector('#authRegPhone').value.trim();
    const pass = modal.querySelector('#authRegPass').value;
    const confirm = modal.querySelector('#authRegConfirm').value;

    // Username required + validation
    if (!username) { showAuthError(btn, 'Username wajib diisi.'); return; }
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      showAuthError(btn, 'Username 3-20 karakter (huruf, angka, underscore).');
      return;
    }
    // Auto-generate email if not provided
    const email = emailInput || `${username}@tammia.users.id`;

    if (tammiaUseRealAuth()) {
      if (!pass) { showAuthError(btn, 'Password wajib diisi.'); return; }
      if (pass !== confirm) { showAuthError(btn, 'Password dan konfirmasi tidak cocok.'); return; }
      setBtnBusy(btn, true);
      try {
        const { error } = await window.tammiaSupabase.auth.signUp({
          email,
          password: pass,
          options: { data: { full_name: name, username, phone } }
        });
        if (error) throw error;
        closeAuth();
        const msg = emailInput
          ? `Akun dibuat. Cek email untuk konfirmasi, ${name}!`
          : `Akun dibuat. Selamat datang, ${name}!`;
        tammiaToast(msg, 'bi-check-circle-fill');
      } catch (err) {
        showAuthError(btn, err.message || 'Pendaftaran gagal.');
      } finally {
        setBtnBusy(btn, false);
      }
      return;
    }
    // Demo mode
    authComplete(name, email);
  });

  modal.querySelectorAll('[data-auth-social]').forEach(b => {
    b.addEventListener('click', async e => {
      e.preventDefault();
      const provider = b.dataset.authSocial; // 'google'
      if (tammiaUseRealAuth()) {
        setBtnBusy(b, true, 'Mengarahkan...');
        try {
          const { error } = await window.tammiaSupabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: window.location.href }
          });
          if (error) throw error;
          // Redirect happens automatically
        } catch (err) {
          showAuthError(b, err.message || 'OAuth gagal.');
          setBtnBusy(b, false);
        }
        return;
      }
      // Demo
      const name = provider === 'google' ? 'Marshella' : 'Eunike';
      authComplete(name, `${name.toLowerCase()}@${provider}.com`);
    });
  });

  // Forgot password
  modal.querySelector('[data-auth-action="forgot"]').addEventListener('click', async e => {
    e.preventDefault();
    const btn = e.currentTarget;
    const email = modal.querySelector('#authForgotEmail').value.trim();
    if (!tammiaIsValidEmail(email)) {
      showAuthError(btn, 'Email tidak valid.');
      return;
    }
    if (tammiaUseRealAuth()) {
      setBtnBusy(btn, true);
      try {
        const { error } = await window.tammiaSupabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname,
        });
        if (error) throw error;
      } catch (err) {
        showAuthError(btn, err.message || 'Tidak bisa kirim email reset.');
        setBtnBusy(btn, false);
        return;
      } finally {
        setBtnBusy(btn, false);
      }
    } else {
      tammiaToast('Link reset terkirim. Cek email kamu.', 'bi-envelope-check-fill');
    }
    // Show success view in pane
    const succ = modal.querySelector('[data-forgot-success]');
    const formBits = modal.querySelectorAll('[data-auth-pane="forgot"] .auth-field, [data-auth-pane="forgot"] .auth-forgot-head, [data-auth-pane="forgot"] [data-auth-action="forgot"]');
    const bottom = modal.querySelector('[data-auth-pane="forgot"] > .auth-bottom-link');
    const body = modal.querySelector('[data-forgot-success-body]');
    if (body) body.textContent = `Link reset telah dikirim ke ${email}. Periksa inbox dan folder spam.`;
    if (succ) succ.style.display = 'block';
    formBits.forEach(b => b.style.display = 'none');
    if (bottom) bottom.style.display = 'none';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeAuth();
  });

  // Expose openers
  window.tammiaOpenAuth = openAuth;
  window.tammiaCloseAuth = closeAuth;
}

/* ---------- Refresh navbar user UI ---------- */
function tammiaRefreshAuthUi() {
  const user = tammiaGetUser();
  document.querySelectorAll('.nav-icons').forEach(navIcons => {
    // Find existing account slot
    let slot = navIcons.querySelector('.nav-account-slot');
    if (!slot) {
      // Locate the static person-icon link
      const personIcon = navIcons.querySelector('i.bi-person');
      if (personIcon) {
        slot = personIcon.closest('a, button, div');
        if (slot) slot.classList.add('nav-account-slot');
      }
    }
    if (!slot) return;

    if (user && user.loggedIn) {
      const initials = (user.name || '?').split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
      const isAdmin = !!user.isAdmin;
      const newSlot = document.createElement('div');
      newSlot.className = 'profile-wrap nav-account-slot';
      newSlot.innerHTML = `
        <button class="profile-avatar" type="button" aria-haspopup="true">${initials || 'U'}</button>
        <div class="profile-menu">
          <div class="profile-menu-greet">
            <div class="name">Halo, ${user.name || 'Tammia'}</div>
            <div class="email">${user.email || ''}</div>
          </div>
          <a href="account.html"><i class="bi bi-person"></i> Akun Saya</a>
          <a href="orders.html"><i class="bi bi-bag-check"></i> Pesanan Saya</a>
          <a href="#" data-open-wishlist><i class="bi bi-heart"></i> Wishlist <span class="badge-mini" data-wishlist-count>0</span></a>
          <a href="contact.html"><i class="bi bi-question-circle"></i> Bantuan</a>
          ${isAdmin ? `<div class="divider"></div><a href="admin.html" style="color:var(--rouge); font-weight:500;"><i class="bi bi-shield-check"></i> Admin Panel</a>` : ''}
          <div class="divider"></div>
          <button type="button" data-logout><i class="bi bi-box-arrow-right"></i> Keluar</button>
        </div>`;
      slot.replaceWith(newSlot);
      const avatar = newSlot.querySelector('.profile-avatar');
      const menu = newSlot.querySelector('.profile-menu');
      avatar.addEventListener('click', e => {
        e.stopPropagation();
        menu.classList.toggle('open');
      });
      document.addEventListener('click', e => {
        if (!newSlot.contains(e.target)) menu.classList.remove('open');
      });
      newSlot.querySelector('[data-logout]').addEventListener('click', async () => {
        if (tammiaUseRealAuth()) {
          try { await window.tammiaSupabase.auth.signOut(); } catch (e) {}
        }
        tammiaSaveUser(null);
        tammiaToast('Berhasil keluar dari akun.', 'bi-box-arrow-right');
        tammiaRefreshAuthUi();
      });
      const wishLink = newSlot.querySelector('[data-open-wishlist]');
      if (wishLink) {
        wishLink.addEventListener('click', e => {
          e.preventDefault();
          menu.classList.remove('open');
          const wd = document.getElementById('wishlistDrawer');
          if (wd) {
            if (wd._render) wd._render();
            wd.classList.add('open');
            document.getElementById('drawerBackdrop').classList.add('open');
            document.body.style.overflow = 'hidden';
          }
        });
      }
      const wc = newSlot.querySelector('[data-wishlist-count]');
      if (wc) wc.textContent = tammiaGetWishlist().length;
    } else {
      // Build a fresh person-icon button that opens auth modal
      const newSlot = document.createElement('button');
      newSlot.type = 'button';
      newSlot.className = 'nav-icon-btn nav-account-slot';
      newSlot.setAttribute('aria-label', 'Masuk / Daftar');
      newSlot.innerHTML = '<i class="bi bi-person"></i>';
      newSlot.addEventListener('click', e => {
        e.preventDefault();
        if (window.tammiaOpenAuth) window.tammiaOpenAuth();
      });
      slot.replaceWith(newSlot);
    }
  });
}

/* ---------- Wishlist drawer builder ---------- */
function tammiaBuildWishlistDrawer() {
  if (document.getElementById('wishlistDrawer')) return;
  const drawer = document.createElement('aside');
  drawer.className = 'wishlist-drawer';
  drawer.id = 'wishlistDrawer';
  drawer.innerHTML = `
    <div class="drawer-head">
      <h5>Wishlist <span style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--muted);" data-wishlist-count-h>(0)</span></h5>
      <button class="drawer-close" data-close-wishlist><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="drawer-body" id="wishlistBody"></div>
    <div class="drawer-foot">
      <div class="drawer-actions">
        <a href="shop.html" class="btn btn-ghost">Lihat Semua Produk</a>
        <a href="cart.html" class="btn btn-peach">Lihat Keranjang</a>
      </div>
    </div>`;
  document.body.appendChild(drawer);

  function close() {
    drawer.classList.remove('open');
    const bd = document.getElementById('drawerBackdrop');
    if (bd) bd.classList.remove('open');
    document.body.style.overflow = '';
  }
  drawer.querySelector('[data-close-wishlist]').addEventListener('click', close);

  // Render content
  function render() {
    const list = tammiaGetWishlist();
    const body = drawer.querySelector('#wishlistBody');
    const head = drawer.querySelector('[data-wishlist-count-h]');
    head.textContent = `(${list.length})`;
    if (list.length === 0) {
      body.innerHTML = `
        <div class="wishlist-empty">
          <div class="big-heart"><i class="bi bi-heart"></i></div>
          <p>Wishlist kamu kosong.<br>Suka produk dengan ❤️ untuk simpan di sini.</p>
        </div>`;
      return;
    }
    body.innerHTML = list.slice(0, 10).map(name => {
      const product = (window.TAMMIA_PRODUCTS || []).find(p => p.name === name);
      if (!product) return '';
      const priceHtml = product.was
        ? `${tammiaFormatPrice(product.price)}`
        : `${tammiaFormatPrice(product.price)}`;
      const thumb = product.image_url
        ? `<img src="${product.image_url}" alt="${product.name.replace(/"/g, '&quot;')}" loading="lazy" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`
        : tammiaSearchSvg(product.svg);
      return `
        <div class="wishlist-item" data-name="${product.name}">
          <div class="wishlist-item-img">${thumb}</div>
          <div class="wishlist-item-meta">
            <div class="br">${product.brand}</div>
            <div class="nm">${product.name}</div>
            <div class="pr">${priceHtml}</div>
          </div>
          <div class="wishlist-item-actions">
            <button data-move-cart>Ke Keranjang</button>
            <button class="wishlist-remove" data-remove>Hapus</button>
          </div>
        </div>`;
    }).join('') + (list.length > 6 ? '<div style="text-align:center; padding:14px 0;"><a href="#" style="font-family:\'JetBrains Mono\',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--rouge);">Lihat Semua</a></div>' : '');

    body.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.wishlist-item');
        const name = item.dataset.name;
        const list = tammiaGetWishlist().filter(n => n !== name);
        tammiaSaveWishlist(list);
        // Sync hearts on page — class AND inner icon
        tammiaSyncWishlistHearts(name, false);
        render();
        tammiaToast('Dihapus dari wishlist.', 'bi-heart');
      });
    });
    body.querySelectorAll('[data-move-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.wishlist-item');
        tammiaToast('Dipindahkan ke keranjang.', 'bi-bag-check-fill');
        // Open cart drawer
        const cd = document.getElementById('cartDrawer');
        if (cd) {
          close();
          cd.classList.add('open');
          document.getElementById('drawerBackdrop').classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }
  drawer._render = render;
  render();
}

/* ---------- Mobile nav drawer ---------- */
function tammiaBuildMobileNav() {
  if (document.getElementById('mobileNavDrawer')) return;
  const drawer = document.createElement('aside');
  drawer.className = 'mobile-nav-drawer';
  drawer.id = 'mobileNavDrawer';
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  drawer.innerHTML = `
    <div class="mobile-nav-head">
      <a href="index.html" class="brand-logo"><img src="assets/img/logos/tammia-red.png" alt="Tammia" class="brand-logo-img"></a>
      <button class="drawer-close" data-close-mobile-nav><i class="bi bi-x-lg"></i></button>
    </div>
    <div class="mobile-nav-body">
      <div class="mobile-nav-search nav-search">
        <i class="bi bi-search"></i>
        <input type="text" placeholder="Cari produk, brand..." id="mobileSearchInput" autocomplete="off">
      </div>
      <ul class="mobile-nav-links">
        <li><a href="shop.html"${currentPage === 'shop.html' ? ' class="active"' : ''}>Shop</a></li>
        <li><a href="about.html"${currentPage === 'about.html' ? ' class="active"' : ''}>About</a></li>
        <li><a href="contact.html"${currentPage === 'contact.html' ? ' class="active"' : ''}>Contact</a></li>
      </ul>
    </div>`;
  document.body.appendChild(drawer);
  drawer.querySelector('[data-close-mobile-nav]').addEventListener('click', () => closeMobileNav());

  // Wire mobile search with live dropdown (same behavior as desktop)
  const wrap = drawer.querySelector('.mobile-nav-search');
  const inp = wrap.querySelector('input');
  const dropdown = document.createElement('div');
  dropdown.className = 'search-results-dropdown';
  wrap.appendChild(dropdown);

  let debounceTimer = null;

  function renderResults(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) { dropdown.classList.remove('open'); dropdown.innerHTML = ''; return; }
    const matches = (window.TAMMIA_PRODUCTS || []).filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    ).slice(0, 6);
    let html = '';
    if (matches.length === 0) {
      html = '<div class="search-empty">Tidak ada produk yang cocok</div>';
    } else {
      matches.forEach(m => {
        const priceHtml = m.was
          ? `<span class="sr-price sale">${tammiaFormatPrice(m.price)}</span> <span class="sr-was">${tammiaFormatPrice(m.was)}</span>`
          : `<span class="sr-price">${tammiaFormatPrice(m.price)}</span>`;
        const thumb = m.image_url
          ? `<img src="${m.image_url}" alt="${m.name.replace(/"/g, '&quot;')}" loading="lazy" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`
          : tammiaSearchSvg(m.svg);
        html += `<a class="search-result-row" href="product.html?slug=${encodeURIComponent(m.slug || '')}">
          <span class="sr-thumb">${thumb}</span>
          <span class="sr-meta">
            <span class="sr-brand">${m.brand}</span>
            <span class="sr-name">${m.name}</span>
            <span class="sr-price-row">${priceHtml}</span>
          </span></a>`;
      });
      html += `<a class="search-see-all" href="shop.html?q=${encodeURIComponent(q)}">Lihat semua hasil <i class="bi bi-arrow-right"></i></a>`;
    }
    dropdown.innerHTML = html;
    dropdown.classList.add('open');
  }

  inp.addEventListener('input', e => {
    clearTimeout(debounceTimer);
    const val = e.target.value;
    debounceTimer = setTimeout(() => renderResults(val), 150);
  });
  inp.addEventListener('focus', () => {
    if (inp.value.trim()) renderResults(inp.value);
  });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = inp.value.trim();
      if (q) { e.preventDefault(); location.href = 'shop.html?q=' + encodeURIComponent(q); }
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
  // Prevent dropdown clicks from blurring input prematurely
  dropdown.addEventListener('mousedown', e => e.preventDefault());
  dropdown.addEventListener('touchstart', e => { /* allow natural touch */ }, { passive: true });
}

function openMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.add('open');
  if (bd) bd.classList.add('open');
  document.body.classList.add('nav-drawer-open');
}
function closeMobileNav() {
  const drawer = document.getElementById('mobileNavDrawer');
  const bd = document.getElementById('drawerBackdrop');
  if (drawer) drawer.classList.remove('open');
  if (bd) bd.classList.remove('open');
  document.body.classList.remove('nav-drawer-open');
}

/* ---------- Inject wishlist nav button + badge ---------- */
function tammiaInjectWishlistNavButton() {
  document.querySelectorAll('.nav-icons').forEach(navIcons => {
    // skip if exists
    if (navIcons.querySelector('[data-open-wishlist-drawer]')) return;
    // Find existing static heart link <a href="#" class="nav-icon-btn"><i class="bi bi-heart"></i></a>
    const existingHearts = navIcons.querySelectorAll('a.nav-icon-btn');
    let staticHeart = null;
    existingHearts.forEach(a => {
      const i = a.querySelector('i.bi-heart');
      if (i && a.getAttribute('href') === '#') staticHeart = a;
    });
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-icon-btn';
    btn.setAttribute('data-open-wishlist-drawer', '');
    btn.innerHTML = '<i class="bi bi-heart"></i><span class="cart-badge wishlist-badge" data-count="0">0</span>';
    if (staticHeart) staticHeart.replaceWith(btn);
    else {
      // insert before cart
      const cartBtn = navIcons.querySelector('[data-open-cart]');
      if (cartBtn) navIcons.insertBefore(btn, cartBtn);
      else navIcons.appendChild(btn);
    }
    btn.addEventListener('click', () => {
      const wd = document.getElementById('wishlistDrawer');
      const bd = document.getElementById('drawerBackdrop');
      if (wd) {
        if (wd._render) wd._render();
        wd.classList.add('open');
        if (bd) bd.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });
  tammiaUpdateWishlistBadge();
}

/* ---------- Inject mobile filter trigger on shop page ---------- */
function tammiaInjectMobileFilterTrigger() {
  const toolbar = document.querySelector('.shop-toolbar');
  const sidebar = document.getElementById('filterSidebar');
  if (!toolbar || !sidebar) return;
  if (toolbar.querySelector('.mobile-filter-trigger')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'mobile-filter-trigger';
  btn.innerHTML = '<i class="bi bi-funnel"></i> Filter';
  toolbar.insertBefore(btn, toolbar.firstChild);

  // Add close button to sidebar
  if (!sidebar.querySelector('.filter-sidebar-close')) {
    const cl = document.createElement('button');
    cl.type = 'button';
    cl.className = 'filter-sidebar-close';
    cl.innerHTML = '<i class="bi bi-x-lg"></i>';
    sidebar.insertBefore(cl, sidebar.firstChild);
    cl.addEventListener('click', () => closeSidebar());
  }
  function openSidebar() {
    sidebar.classList.add('open');
    const bd = document.getElementById('drawerBackdrop');
    if (bd) bd.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    const bd = document.getElementById('drawerBackdrop');
    if (bd) bd.classList.remove('open');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', openSidebar);
}

/* ---------- Inject wishlist hearts onto product cards ---------- */
function tammiaInjectProductHearts() {
  document.querySelectorAll('.product-card').forEach(card => {
    if (card.querySelector('.product-wish')) return;
    const img = card.querySelector('.product-img');
    if (!img) return;
    const nameEl = card.querySelector('.product-name');
    const name = nameEl ? nameEl.textContent.trim() : '';
    const wished = tammiaGetWishlist().includes(name);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'product-wish' + (wished ? ' liked' : '');
    btn.setAttribute('data-name', name);
    btn.setAttribute('aria-label', 'Tambah ke wishlist');
    btn.innerHTML = wished ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
    img.appendChild(btn);
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const list = tammiaGetWishlist();
      const idx = list.indexOf(name);
      const willLike = idx < 0;
      if (idx >= 0) list.splice(idx, 1);
      else list.push(name);
      tammiaSaveWishlist(list);
      tammiaSyncWishlistHearts(name, willLike);
      tammiaToast(
        willLike ? 'Ditambahkan ke wishlist.' : 'Dihapus dari wishlist.',
        willLike ? 'bi-heart-fill' : 'bi-heart'
      );
      const wd = document.getElementById('wishlistDrawer');
      if (wd && wd._render) wd._render();
    });
  });
}

/* ---------- Product detail wishlist button ---------- */
function tammiaInitProductDetailWish() {
  const info = document.querySelector('.pd-info');
  if (!info) return;
  const name = info.dataset.productName;
  if (!name) return;
  // If button already injected via HTML, just wire it.
  let btn = document.querySelector('[data-pd-wish]');
  if (!btn) {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-ink btn-lg pd-wish-btn';
    btn.setAttribute('data-pd-wish', '');
    btn.setAttribute('data-name', name);
    btn.innerHTML = '<i class="bi bi-heart"></i> <span class="pd-wish-label">Wishlist</span>';
    // Insert in pd-cta-row (right of buy buttons)
    const ctaRow = info.querySelector('.pd-cta-row');
    if (ctaRow) ctaRow.appendChild(btn);
  } else {
    btn.setAttribute('data-name', name);
  }
  // Initial state
  const wished = tammiaGetWishlist().includes(name);
  tammiaSyncWishlistHearts(name, wished);

  btn.addEventListener('click', e => {
    e.preventDefault();
    const list = tammiaGetWishlist();
    const idx = list.indexOf(name);
    const willLike = idx < 0;
    if (idx >= 0) list.splice(idx, 1);
    else list.push(name);
    tammiaSaveWishlist(list);
    tammiaSyncWishlistHearts(name, willLike);
    tammiaToast(
      willLike ? 'Ditambahkan ke wishlist.' : 'Dihapus dari wishlist.',
      willLike ? 'bi-heart-fill' : 'bi-heart'
    );
    const wd = document.getElementById('wishlistDrawer');
    if (wd && wd._render) wd._render();
  });
}

/* ============================================================
   MAIN BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Kick off async product fetch ASAP ---------- */
  tammiaLoadProducts();

  /* ---------- Sticky navbar shrink ---------- */
  const navWrap = document.querySelector('.nav-wrap');
  if (navWrap) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) navWrap.classList.add('scrolled');
      else navWrap.classList.remove('scrolled');
    });
  }

  /* ---------- Cart drawer ---------- */
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openCartBtns = document.querySelectorAll('[data-open-cart]');
  const closeCartBtns = document.querySelectorAll('[data-close-cart]');

  function openCart() {
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeAllDrawers() {
    if (drawer) drawer.classList.remove('open');
    const wd = document.getElementById('wishlistDrawer');
    if (wd) wd.classList.remove('open');
    const mn = document.getElementById('mobileNavDrawer');
    if (mn) mn.classList.remove('open');
    const fs = document.getElementById('filterSidebar');
    if (fs && window.innerWidth <= 991) fs.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
    document.body.classList.remove('nav-drawer-open');
  }
  openCartBtns.forEach(b => b.addEventListener('click', e => { e.preventDefault(); openCart(); }));
  closeCartBtns.forEach(b => b.addEventListener('click', closeAllDrawers));
  if (backdrop) backdrop.addEventListener('click', closeAllDrawers);

  /* ---------- Quick-add buttons on product cards ---------- */
  function bindProductQuickAddButtons(scope) {
    (scope || document).querySelectorAll('.product-quick').forEach(btn => {
      if (btn.dataset.qaBound === '1') return;
      btn.dataset.qaBound = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // Read product data from the nearest cell or card
        const cell = btn.closest('.product-cell, .product-card');
        let name = '', brand = '', price = 0, was = null, svg = 'brush';
        if (cell) {
          // Prefer dataset (shop.html), else fallback to inner text (index.html etc.)
          if (cell.dataset.name) {
            name = cell.dataset.name;
            brand = cell.dataset.brand || '';
            price = parseInt(cell.dataset.price, 10) || 0;
            was = cell.dataset.was ? parseInt(cell.dataset.was, 10) : null;
          } else {
            const nameEl = cell.querySelector('.product-name');
            const brandEl = cell.querySelector('.product-brand');
            const priceEl = cell.querySelector('.product-price.sale, .product-price');
            const wasEl = cell.querySelector('.product-price-was');
            if (nameEl) name = nameEl.textContent.trim();
            if (brandEl) brand = brandEl.textContent.trim();
            if (priceEl) price = parseInt(priceEl.textContent.replace(/[^\d]/g, ''), 10) || 0;
            if (wasEl) was = parseInt(wasEl.textContent.replace(/[^\d]/g, ''), 10) || null;
          }
          svg = tammiaSvgForProductName(name);
        }
        if (!name) {
          // Nothing identifiable -> just open the drawer
          openCart();
          return;
        }
        addToCart({ name, brand, price, was, svg });
        tammiaToast('Ditambahkan ke keranjang', 'bi-bag-check-fill');
        openCart();
      });
    });
  }
  window.tammiaBindProductQuickAddButtons = bindProductQuickAddButtons;
  bindProductQuickAddButtons();

  /* ---------- Generic qty steppers (non-cart, non-drawer) ---------- */
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    // Skip if it's a cart row stepper or a cart-drawer item stepper
    if (stepper.closest('[data-cart-row]')) return;
    if (stepper.closest('.drawer-item')) return;
    const minus = stepper.querySelector('.qty-minus');
    const plus = stepper.querySelector('.qty-plus');
    const input = stepper.querySelector('input');
    if (!input) return;
    if (minus) minus.addEventListener('click', () => {
      let v = parseInt(input.value || '1');
      if (v > 1) input.value = v - 1;
    });
    if (plus) plus.addEventListener('click', () => {
      let v = parseInt(input.value || '1');
      input.value = v + 1;
    });
  });

  /* ---------- Product detail page: Tambah ke Keranjang ---------- */
  document.querySelectorAll('[data-pd-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const info = btn.closest('.pd-info') || document.querySelector('.pd-info[data-product-name]');
      if (!info) { openCart(); return; }
      const qtyInput = document.querySelector('.pd-variant-block .qty-stepper input');
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;
      const name = info.dataset.productName || '';
      const brand = info.dataset.productBrand || '';
      const price = parseInt(info.dataset.productPrice, 10) || 0;
      const was = info.dataset.productWas ? parseInt(info.dataset.productWas, 10) : null;
      const svg = info.dataset.productSvg || tammiaSvgForProductName(name);
      if (!name) { openCart(); return; }
      addToCart({ name, brand, price, was, svg, qty });
      tammiaToast(`${qty}× ditambahkan ke keranjang`, 'bi-bag-check-fill');
      openCart();
    });
  });

  /* ---------- Cart drawer: render from localStorage (empty by default) ---------- */
  // This wipes any hardcoded HTML items and re-renders from tammia_cart.
  renderCartDrawer();
  tammiaUpdateCartBadge();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (q) q.addEventListener('click', () => item.classList.toggle('open'));
  });

  /* ---------- Filter toggle switches ---------- */
  document.querySelectorAll('.toggle-switch').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  /* ---------- Product detail tabs ---------- */
  document.querySelectorAll('.pd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pd-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.pd-tab-content').forEach(c => {
        c.style.display = c.dataset.tab === target ? 'block' : 'none';
      });
    });
  });

  /* ---------- Product detail thumbs ---------- */
  document.querySelectorAll('.pd-thumb').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.pd-thumb').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const main = document.querySelector('.pd-main');
      const inner = t.querySelector('svg');
      if (main && inner) main.innerHTML = inner.outerHTML;
    });
  });

  /* ---------- Product detail variants ---------- */
  document.querySelectorAll('.pd-variants').forEach(group => {
    group.querySelectorAll('.pd-variant').forEach(v => {
      v.addEventListener('click', () => {
        group.querySelectorAll('.pd-variant').forEach(x => x.classList.remove('active'));
        v.classList.add('active');
      });
    });
  });

  /* ---------- Shipping/payment option selection ---------- */
  document.querySelectorAll('[data-option-group]').forEach(group => {
    const name = group.dataset.optionGroup;
    document.querySelectorAll(`[data-option-of="${name}"]`).forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll(`[data-option-of="${name}"]`).forEach(x => x.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  });

  /* ---------- Checkout step navigation ---------- */
  document.querySelectorAll('[data-step-next]').forEach(b => {
    b.addEventListener('click', () => {
      const next = parseInt(b.dataset.stepNext);
      goToStep(next);
    });
  });
  document.querySelectorAll('[data-step-back]').forEach(b => {
    b.addEventListener('click', () => {
      const prev = parseInt(b.dataset.stepBack);
      goToStep(prev);
    });
  });
  function goToStep(n) {
    document.querySelectorAll('.checkout-step').forEach(s => {
      s.style.display = parseInt(s.dataset.step) === n ? 'block' : 'none';
    });
    document.querySelectorAll('.step-item').forEach(s => {
      const idx = parseInt(s.dataset.stepIndex);
      s.classList.remove('active', 'done');
      if (idx === n) s.classList.add('active');
      else if (idx < n) s.classList.add('done');
    });
    window.scrollTo({ top: 200, behavior: 'smooth' });
  }

  /* ---------- GSAP reveals ---------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    /* Hero floating SVGs */
    gsap.utils.toArray('.hero-svg-float').forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? -18 : 14,
        rotate: i % 2 === 0 ? 4 : -3,
        duration: 4 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    });
  }

  /* ---------- Newsletter submit with validation + storage ---------- */
  document.querySelectorAll('.newsletter-form, .footer-newsletter').forEach(form => {
    tammiaInitNewsletterForm(form);
  });

  /* ---------- Contact form submit ---------- */
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Pesan Terkirim ✓';
        btn.disabled = true;
        btn.style.background = 'var(--rouge)';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
          form.reset();
        }, 2500);
      }
    });
  });

  /* ---------- Live search dropdown (navbar) ---------- */
  document.querySelectorAll('.nav-search').forEach(wrap => {
    const input = wrap.querySelector('input[type="text"]');
    if (!input) return;

    // Inject dropdown shell
    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    wrap.appendChild(dropdown);

    let debounceTimer = null;
    let mousedownInside = false;

    function renderResults(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        dropdown.classList.remove('open');
        dropdown.innerHTML = '';
        return;
      }
      const matches = (window.TAMMIA_PRODUCTS || []).filter(p =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      ).slice(0, 6);

      let html = '';
      if (matches.length === 0) {
        html = '<div class="search-empty">Tidak ada produk yang cocok</div>';
      } else {
        matches.forEach(m => {
          const priceHtml = m.was
            ? `<span class="sr-price sale">${tammiaFormatPrice(m.price)}</span> <span class="sr-was">${tammiaFormatPrice(m.was)}</span>`
            : `<span class="sr-price">${tammiaFormatPrice(m.price)}</span>`;
          const thumb = m.image_url
            ? `<img src="${m.image_url}" alt="${m.name.replace(/"/g, '&quot;')}" loading="lazy" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">`
            : tammiaSearchSvg(m.svg);
          html += `
            <a class="search-result-row" href="product.html?slug=${encodeURIComponent(m.slug || '')}">
              <span class="sr-thumb">${thumb}</span>
              <span class="sr-meta">
                <span class="sr-brand">${m.brand}</span>
                <span class="sr-name">${m.name}</span>
                <span class="sr-price-row">${priceHtml}</span>
              </span>
            </a>`;
        });
        html += `<a class="search-see-all" href="shop.html?q=${encodeURIComponent(query.trim())}">Lihat semua hasil <i class="bi bi-arrow-right"></i></a>`;
      }
      dropdown.innerHTML = html;
      dropdown.classList.add('open');
    }

    input.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      const val = e.target.value;
      debounceTimer = setTimeout(() => renderResults(val), 150);
    });

    input.addEventListener('focus', () => {
      if (input.value.trim()) renderResults(input.value);
    });

    // FIX: prevent blur from killing click via mousedown trap on dropdown
    dropdown.addEventListener('mousedown', e => {
      mousedownInside = true;
      // Prevent input from losing focus before click registers
      e.preventDefault();
    });
    dropdown.addEventListener('mouseup', () => {
      mousedownInside = false;
    });

    input.addEventListener('blur', () => {
      // Skip blur-hide if user clicked inside dropdown
      if (mousedownInside) return;
      setTimeout(() => {
        if (!mousedownInside) dropdown.classList.remove('open');
      }, 120);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('open');
        input.blur();
      } else if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) {
          e.preventDefault();
          window.location.href = 'shop.html?q=' + encodeURIComponent(q);
        }
      }
    });
  });

  /* ---------- Shop page: render from Supabase + live filtering ---------- */
  const grid = document.getElementById('productGrid');
  const sidebar = document.getElementById('filterSidebar');
  if (grid && sidebar) {
    const countEl = document.getElementById('shopCount');
    const emptyEl = document.getElementById('shopEmpty');
    const pagEl = document.getElementById('paginationWrap');
    const priceRange = document.getElementById('priceRange');
    const priceMaxLabel = document.getElementById('priceMaxLabel');
    const sortSelect = document.getElementById('sortSelect');
    const saleToggle = document.getElementById('saleOnlyToggle');
    const resetBtn = document.getElementById('resetAllFilters');
    const emptyResetBtn = document.getElementById('emptyResetBtn');

    // Show 8 skeleton cards while loading
    grid.innerHTML = Array.from({ length: 8 }).map(() => tammiaSkeletonCellHtml()).join('');

    let cells = []; // populated after products load

    function getState() {
      const cats = Array.from(sidebar.querySelectorAll('input[data-filter="cat"]:checked')).map(i => i.value);
      const brands = Array.from(sidebar.querySelectorAll('input[data-filter="brand"]:checked')).map(i => i.value);
      const priceMax = priceRange ? parseInt(priceRange.value, 10) : Infinity;
      const ratingInput = sidebar.querySelector('input[data-filter="rating"]:checked');
      const minRating = ratingInput ? parseFloat(ratingInput.value) : 0;
      const saleOnly = saleToggle && saleToggle.classList.contains('on');
      const sort = sortSelect ? sortSelect.value : 'featured';
      const q = (new URLSearchParams(window.location.search).get('q') || '').toLowerCase();
      return { cats, brands, priceMax, minRating, saleOnly, sort, q };
    }

    function applyFilters() {
      const s = getState();
      if (priceMaxLabel && priceRange) {
        priceMaxLabel.textContent = tammiaFormatPrice(parseInt(priceRange.value, 10));
      }

      const visible = [];
      cells.forEach(cell => {
        const cat = cell.dataset.cat || '';
        const brand = cell.dataset.brand || '';
        const price = parseInt(cell.dataset.price, 10) || 0;
        const rating = parseFloat(cell.dataset.rating) || 0;
        const isSale = cell.dataset.sale === '1';
        const name = (cell.dataset.name || '').toLowerCase();

        let show = true;
        if (s.cats.length && !s.cats.includes(cat)) show = false;
        if (s.brands.length && !s.brands.includes(brand)) show = false;
        if (price > s.priceMax) show = false;
        if (s.minRating && rating < s.minRating) show = false;
        if (s.saleOnly && !isSale) show = false;
        if (s.q && !(name.includes(s.q) || brand.toLowerCase().includes(s.q))) show = false;

        if (show) visible.push(cell);
        else cell.style.display = 'none';
      });

      visible.sort((a, b) => {
        const pa = parseInt(a.dataset.price, 10) || 0;
        const pb = parseInt(b.dataset.price, 10) || 0;
        const ra = parseFloat(a.dataset.rating) || 0;
        const rb = parseFloat(b.dataset.rating) || 0;
        const na = (a.dataset.name || '').toLowerCase();
        const nb = (b.dataset.name || '').toLowerCase();
        switch (s.sort) {
          case 'price-asc': return pa - pb;
          case 'price-desc': return pb - pa;
          case 'name': return na.localeCompare(nb);
          case 'rating': return rb - ra;
          default: return 0;
        }
      });

      grid.style.transition = 'opacity 200ms ease';
      grid.style.opacity = '0.4';
      visible.forEach(c => { c.style.display = ''; grid.appendChild(c); });
      cells.forEach(c => { if (!visible.includes(c)) grid.appendChild(c); });
      setTimeout(() => { grid.style.opacity = '1'; }, 30);

      const total = cells.length;
      const shown = visible.length;
      if (countEl) countEl.textContent = `Menampilkan ${shown} dari ${total} produk`;
      if (emptyEl) emptyEl.style.display = shown === 0 ? 'block' : 'none';
      if (pagEl) pagEl.style.display = shown === 0 ? 'none' : '';
    }

    function resetAll() {
      sidebar.querySelectorAll('input[type="checkbox"][data-filter]').forEach(cb => { cb.checked = false; });
      const semuaRating = sidebar.querySelector('input[data-filter="rating"][value="0"]');
      if (semuaRating) semuaRating.checked = true;
      if (priceRange) priceRange.value = priceRange.max;
      if (saleToggle) saleToggle.classList.remove('on');
      if (sortSelect) {
        sortSelect.value = 'featured';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      applyFilters();
    }

    sidebar.querySelectorAll('input[data-filter]').forEach(inp => {
      inp.addEventListener('change', applyFilters);
    });
    if (priceRange) priceRange.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    if (saleToggle) saleToggle.addEventListener('click', () => applyFilters());
    if (resetBtn) resetBtn.addEventListener('click', resetAll);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAll);

    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('cat');
    if (catParam) {
      const map = { brush: 'Makeup Brushes', sponge: 'Makeup Sponges', lash: 'Eyelash', case: 'Beauty Cases', tweezer: 'Tweezers', nail: 'Nail Care', hair: 'Hair Tools', bath: 'Bath Accessories' };
      const target = map[catParam];
      if (target) {
        const cb = sidebar.querySelector(`input[data-filter="cat"][value="${target}"]`);
        if (cb) cb.checked = true;
      }
    }
    if (params.get('sale') === '1' && saleToggle) saleToggle.classList.add('on');
    const qParam = params.get('q');
    if (qParam) {
      const searchInput = document.querySelector('.nav-search input');
      if (searchInput) searchInput.value = qParam;
    }

    // Wait for products, then render cells
    tammiaProductsReady().then(products => {
      if (!products || products.length === 0) {
        grid.innerHTML = '';
        if (countEl) countEl.textContent = 'Menampilkan 0 dari 0 produk';
        if (emptyEl) emptyEl.style.display = 'block';
        return;
      }
      grid.innerHTML = products.map(p => tammiaProductCellHtml(p)).join('');
      cells = Array.from(grid.querySelectorAll('.product-cell'));
      // Re-bind dynamic UI on freshly rendered cards
      bindProductQuickAddButtons(grid);
      tammiaInjectProductHearts();
      applyFilters();
    });
  }

  /* ---------- TASK 3: Init custom selects ---------- */
  document.querySelectorAll('select.custom-select-source').forEach(initCustomSelect);

  /* ---------- TASK 5: Auth modal + nav UI ---------- */
  tammiaBuildAuthModal();
  tammiaRefreshAuthUi();
  tammiaInitSupabaseAuthSync();

  /* ---------- TASK 6: Wishlist drawer + nav button + product hearts ---------- */
  tammiaBuildWishlistDrawer();
  tammiaInjectWishlistNavButton();
  tammiaInjectProductHearts();
  tammiaInitProductDetailWish();
  tammiaUpdateWishlistBadge();

  /* ---------- STAGE 2: Page-specific async product renderers ---------- */
  tammiaInitFeaturedSection();
  tammiaInitHeroSlider();
  tammiaInitHomeBanner();
  tammiaInitFaq();
  tammiaInitProductDetailPage();
  // Re-render wishlist drawer + re-inject hearts after products arrive
  tammiaProductsReady().then(() => {
    const wd = document.getElementById('wishlistDrawer');
    if (wd && wd._render) wd._render();
    tammiaInjectProductHearts();
  });

  /* ---------- TASK 8: Mobile nav drawer ---------- */
  tammiaBuildMobileNav();
  document.querySelectorAll('.nav-mobile-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openMobileNav();
      const bd = document.getElementById('drawerBackdrop');
      if (bd) bd.classList.add('open');
    });
  });

  /* ---------- TASK 8: Mobile filter trigger on shop page ---------- */
  tammiaInjectMobileFilterTrigger();

  /* ---------- TASK 4: Cart page interactions ---------- */
  tammiaInitCartPage();
  tammiaInitCheckoutPage();
  tammiaInitBuyNowButtons();

  /* ---------- TASK 5: Orders page (orders.html) ---------- */
  tammiaInitOrdersPage();

  /* ---------- TASK 7: Reviews dirender per-produk via tammiaRenderProductDetail ---------- */

  /* ---------- TASK 8: Checkout summary collapsible on mobile ---------- */
  tammiaInitOrderSummaryCollapsible();

}); // End DOMContentLoaded

/* ============================================================
   STAGE 2 — Featured products on index.html
   ============================================================ */
function tammiaInitHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  if (slides.length <= 1) return;
  const dotsWrap = document.getElementById('heroDots');
  const prev = document.getElementById('heroPrev');
  const next = document.getElementById('heroNext');
  let i = 0, timer = null;
  const delay = parseInt(slider.dataset.autoplay, 10) || 5000;

  // dots
  const dots = slides.map((_, idx) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Slide ' + (idx + 1));
    if (idx === 0) b.classList.add('active');
    b.addEventListener('click', () => { go(idx); restart(); });
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((sl, idx) => sl.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  function nextSlide() { go(i + 1); }
  function start() { timer = setInterval(nextSlide, delay); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  if (prev) prev.addEventListener('click', () => { go(i - 1); restart(); });
  if (next) next.addEventListener('click', () => { go(i + 1); restart(); });
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // swipe (mobile)
  let sx = 0;
  slider.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); restart(); }
  }, { passive: true });

  start();
}

/* ============================================================
   Home banner slideshow (memanjang) — gambar saja, transisi fade
   ============================================================ */
function tammiaInitHomeBanner() {
  const slider = document.getElementById('homeBanner');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('.hb-slide'));
  if (!slides.length) return;
  const dotsWrap = document.getElementById('homeBannerDots');
  let i = 0, timer = null;
  const delay = parseInt(slider.dataset.autoplay, 10) || 5000;

  const dots = slides.map((_, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Banner ' + (idx + 1));
    if (idx === 0) { b.classList.add('active'); b.setAttribute('aria-selected', 'true'); }
    b.addEventListener('click', () => { go(idx); restart(); });
    if (dotsWrap) dotsWrap.appendChild(b);
    return b;
  });

  function go(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach((sl, idx) => sl.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => {
      const on = idx === i;
      d.classList.toggle('active', on);
      d.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
  function next() { go(i + 1); }
  function start() { if (slides.length > 1) timer = setInterval(next, delay); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // swipe (mobile)
  let sx = 0;
  slider.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); restart(); }
  }, { passive: true });

  start();
}

/* ============================================================
   FAQ accordion — animasi buka/tutup (height + fade), bukan popping up
   ============================================================ */
function tammiaInitFaq() {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  if (!items.length) return;

  items.forEach(item => {
    const summary = item.querySelector('.faq-q');
    const body = item.querySelector('.faq-a');
    if (!summary || !body) return;

    // State awal: kalau sudah open di HTML, biarkan tampil penuh (tanpa animasi)
    if (!item.open) { body.style.height = '0px'; body.style.opacity = '0'; }

    summary.addEventListener('click', e => {
      e.preventDefault();
      if (body.dataset.animating === '1') return;
      body.dataset.animating = '1';

      if (item.open) {
        // ---- Tutup: dari tinggi sekarang -> 0 ----
        body.style.height = body.scrollHeight + 'px';
        void body.offsetHeight; // force reflow
        body.style.height = '0px';
        body.style.opacity = '0';
        const done = () => {
          item.open = false;
          body.removeEventListener('transitionend', onEnd);
          body.dataset.animating = '0';
        };
        const onEnd = ev => { if (ev.propertyName === 'height') done(); };
        body.addEventListener('transitionend', onEnd);
        setTimeout(() => { if (body.dataset.animating === '1') done(); }, 480);
      } else {
        // ---- Buka: set open dulu (konten terukur), animasikan 0 -> tinggi konten ----
        item.open = true;
        body.style.height = '0px';
        body.style.opacity = '0';
        void body.offsetHeight; // force reflow
        body.style.height = body.scrollHeight + 'px';
        body.style.opacity = '1';
        const done = () => {
          body.style.height = 'auto'; // responsif kalau viewport berubah
          body.removeEventListener('transitionend', onEnd);
          body.dataset.animating = '0';
        };
        const onEnd = ev => { if (ev.propertyName === 'height') done(); };
        body.addEventListener('transitionend', onEnd);
        setTimeout(() => { if (body.dataset.animating === '1') done(); }, 480);
      }
    });
  });
}

function tammiaInitFeaturedSection() {
  // Use #featuredGrid as the explicit hook to avoid clobbering related-product
  // grids on other pages. We add this id to index.html.
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const max = parseInt(grid.dataset.max || '4', 10);

  // Skeletons
  grid.innerHTML = Array.from({ length: max }).map(() => tammiaSkeletonCellHtml()).join('');

  tammiaProductsReady().then(products => {
    if (!products || products.length === 0) {
      grid.innerHTML = '<div class="col-12" style="color:var(--muted); text-align:center; padding:32px;">Belum ada produk untuk ditampilkan.</div>';
      return;
    }
    // Prefer featured, then fall back to newest
    let pick = products.filter(p => p.featured);
    if (pick.length < max) {
      const rest = products.filter(p => !p.featured);
      pick = pick.concat(rest);
    }
    pick = pick.slice(0, max);
    grid.innerHTML = pick.map(p => `
      <div class="col-6 col-lg-3">${tammiaProductCardHtml(p)}</div>
    `).join('');
    if (window.tammiaBindProductQuickAddButtons) window.tammiaBindProductQuickAddButtons(grid);
    tammiaInjectProductHearts();
  });
}

/* ============================================================
   STAGE 2 — Product detail page renderer (?slug=...)
   ============================================================ */
function tammiaInitProductDetailPage() {
  const info = document.querySelector('.pd-info');
  if (!info) return; // not a product page

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  tammiaProductsReady().then(products => {
    if (!products || products.length === 0) return;

    let product = null;
    if (slug) {
      product = products.find(p => p.slug === slug);
      if (!product) {
        // Slug not found -> redirect
        window.location.replace('shop.html');
        return;
      }
    } else {
      // Default: keep original hardcoded product (Sonia Miller) — find by name.
      const defaultName = info.dataset.productName;
      product = products.find(p => p.name === defaultName) || products[0];
    }

    if (!product) return;
    tammiaRenderProductDetail(product, products);
  });
}

function tammiaRenderProductDetail(product, allProducts) {
  const info = document.querySelector('.pd-info');
  if (!info) return;

  // 1) Update data-attrs (used by add-to-cart logic + wishlist sync)
  info.dataset.productName = product.name;
  info.dataset.productBrand = product.brand;
  info.dataset.productPrice = product.price;
  info.dataset.productWas = product.was || '';
  info.dataset.productSvg = product.svg || 'brush';

  // 2) Visible content
  document.title = `${product.name} - Tammia Online`;
  const brandTag = info.querySelector('.brand-tag');
  if (brandTag) brandTag.textContent = `${product.brand}${product.category ? ' · ' + product.category : ''}`;
  const h1 = info.querySelector('h1');
  if (h1) h1.textContent = product.name;

  const ratingRow = info.querySelector('.pd-rating-row');
  if (ratingRow) {
    const ratingNum = (product.rating || 0).toFixed(1);
    ratingRow.innerHTML = `
      <span><span class="stars">★★★★★</span> <strong>${ratingNum}</strong></span>
      <span><i class="bi bi-chat-square-text"></i> ${product.reviewCount || 0} reviews</span>
      <span><i class="bi bi-bag-check"></i> ${product.stock || 0} stok</span>`;
  }

  // Savings + price row
  const savingsEl = info.querySelector('.pd-savings');
  const priceRow = info.querySelector('.pd-price-row');
  if (product.was && product.was > product.price) {
    const hemat = product.was - product.price;
    const pct = tammiaCalcSalePercent(product.price, product.was);
    if (savingsEl) {
      savingsEl.style.display = '';
      savingsEl.textContent = `Hemat ${tammiaFormatPrice(hemat)} · ${pct}`;
    }
    if (priceRow) {
      priceRow.innerHTML = `
        <span class="pd-price">${tammiaFormatPrice(product.price)}</span>
        <span class="pd-price-was">${tammiaFormatPrice(product.was)}</span>`;
    }
  } else {
    if (savingsEl) savingsEl.style.display = 'none';
    if (priceRow) {
      priceRow.innerHTML = `<span class="pd-price">${tammiaFormatPrice(product.price)}</span>`;
    }
  }

  // Stock indicator
  const stockEl = info.querySelector('.pd-stock');
  if (stockEl) {
    const stock = product.stock || 0;
    if (stock <= 0) {
      stockEl.innerHTML = `<span class="dot" style="background:#e11d25;"></span> Stok Habis`;
    } else if (stock < 10) {
      stockEl.innerHTML = `<span class="dot" style="background:#e8b04a;"></span> Stok terbatas · tersisa ${stock}`;
    } else {
      stockEl.innerHTML = `<span class="dot"></span> Stok Tersedia · ${stock} unit siap kirim`;
    }
  }

  // Description tab content (replace only the lead paragraph if present)
  const descTab = document.querySelector('.pd-tab-content[data-tab="desc"]');
  if (descTab) {
    const lead = descTab.querySelector('h3');
    const firstP = descTab.querySelector('p');
    if (lead && product.short_description) lead.textContent = product.short_description;
    if (firstP && product.description) firstP.textContent = product.description;
  }

  // Main image + thumbs
  const mainImg = document.querySelector('.pd-main');
  if (mainImg) {
    if (product.image_url) {
      mainImg.innerHTML = `<img src="${product.image_url}" alt="${product.name.replace(/"/g, '&quot;')}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
      mainImg.innerHTML = tammiaSearchSvg(product.svg || 'brush');
    }
  }
  // Hide all thumbs except first (single image only)
  const thumbsWrap = document.querySelector('.pd-thumbs');
  if (thumbsWrap) {
    const thumbs = thumbsWrap.querySelectorAll('.pd-thumb');
    thumbs.forEach((t, i) => {
      if (i === 0) {
        t.classList.add('active');
        t.innerHTML = product.image_url
          ? `<img src="${product.image_url}" alt="thumb" style="width:100%; height:100%; object-fit:cover;">`
          : tammiaSearchSvg(product.svg || 'brush');
      } else {
        t.style.display = 'none';
      }
    });
  }

  // Update breadcrumb's last segment if present
  const crumb = document.querySelector('section .mono-label span[style*="--rouge"]');
  if (crumb) crumb.textContent = product.name;

  // Re-sync product-detail wishlist button state
  if (typeof tammiaInitProductDetailWish === 'function') {
    // Remove existing wish btn so it rebinds with new name
    const oldBtn = document.querySelector('[data-pd-wish]');
    if (oldBtn) oldBtn.remove();
    tammiaInitProductDetailWish();
  }

  // WhatsApp produk-aware: sebut nama produk di pesan
  const waAdvisor = document.getElementById('waAdvisorBtn');
  if (waAdvisor) {
    waAdvisor.href = tammiaWaLink(
      'Halo Tammia Online 👋 Saya tertarik dengan produk "' + product.name +
      '". Boleh info ketersediaan, varian, dan detailnya?');
  }
  const waShare = document.getElementById('waShareBtn');
  if (waShare) {
    waShare.href = tammiaWaLink(
      'Cek produk ini dari Tammia Online: ' + product.name + ' — ' + window.location.href);
  }
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  if (copyLinkBtn && !copyLinkBtn._bound) {
    copyLinkBtn._bound = 1;
    copyLinkBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () { tammiaToast('Link produk disalin', 'bi-link-45deg'); });
      } else {
        tammiaToast('Link: ' + url, 'bi-link-45deg');
      }
    });
  }

  // Reviews per-produk
  tammiaRenderProductReviews(product);

  // Related products: same category, 4 cards
  tammiaRenderRelatedProducts(product, allProducts);
}

function tammiaRenderRelatedProducts(product, allProducts) {
  // Find the "Complete the Look" row by its row.g-4.reveal that's NOT featuredGrid
  // We add an explicit hook: #relatedGrid -- if not present, fall back to first .row.g-4.reveal under "Complete the Look".
  let related = document.getElementById('relatedGrid');
  if (!related) {
    // Look for a row that contains product-card cells outside our pd-info area
    const candidates = document.querySelectorAll('section .row.g-4.reveal');
    candidates.forEach(c => {
      if (!related && c.querySelector('.product-card')) related = c;
    });
  }
  if (!related) return;
  const pool = (allProducts || []).filter(p => p.slug !== product.slug);
  let pick = pool.filter(p => p.category === product.category);
  if (pick.length < 4) {
    const rest = pool.filter(p => p.category !== product.category);
    pick = pick.concat(rest);
  }
  pick = pick.slice(0, 4);
  related.innerHTML = pick.map(p => `
    <div class="col-6 col-lg-3">${tammiaProductCardHtml(p)}</div>
  `).join('');
  if (window.tammiaBindProductQuickAddButtons) window.tammiaBindProductQuickAddButtons(related);
  tammiaInjectProductHearts();
}

/* ============================================================
   TASK 4 — Cart page logic (localStorage-driven)
   ============================================================ */
function tammiaInitCartPage() {
  const table = document.querySelector('.cart-table');
  if (!table) return;

  const SHIPPING_FREE_THRESHOLD = 150000;
  const SHIPPING_COST = 18000;
  const tbody = table.querySelector('tbody');
  const tableWrapper = table.parentElement; // overflow-x wrapper

  function renderRows() {
    const cart = getCart();
    if (!tbody) return;

    // Empty state
    const existingEmpty = tableWrapper.querySelector('.cart-empty-state');
    if (cart.length === 0) {
      table.style.display = 'none';
      if (!existingEmpty) {
        const empty = document.createElement('div');
        empty.className = 'cart-empty-state';
        empty.innerHTML = `
          <div class="icon-big"><i class="bi bi-bag-x"></i></div>
          <h3>Keranjang kamu masih kosong</h3>
          <p>Yuk, isi keranjang dengan beauty tools pilihan kamu.</p>
          <a href="shop.html" class="btn btn-peach">Lihat Produk <i class="bi bi-arrow-right"></i></a>`;
        tableWrapper.appendChild(empty);
      }
      recalc();
      return;
    }
    if (existingEmpty) existingEmpty.remove();
    table.style.display = '';

    tbody.innerHTML = cart.map(it => {
      const safeName = (it.name || '').replace(/"/g, '&quot;');
      const wasHtml = it.was
        ? `<div style="font-size:12px; color:var(--muted); text-decoration:line-through;">${tammiaFormatPrice(it.was)}</div>`
        : '';
      const priceColor = it.was ? 'color:var(--rouge);' : '';
      return `
        <tr data-cart-row data-name="${safeName}" data-price="${it.price}" data-qty="${it.qty}">
          <td>
            <div class="cart-item-cell">
              <div class="cart-item-img">${tammiaSearchSvg(it.svg || 'brush')}</div>
              <div>
                <div class="mono-label">${it.brand || ''}</div>
                <div style="font-weight:500; font-size:15px; margin: 6px 0;">
                  <a href="product.html" style="color:var(--ink);">${it.name}</a>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-family:'Comfortaa',sans-serif; font-weight:500; font-size:16px; ${priceColor}">${tammiaFormatPrice(it.price)}</div>
            ${wasHtml}
          </td>
          <td>
            <div class="qty-stepper">
              <button class="qty-minus" type="button">−</button>
              <input type="text" value="${it.qty}" readonly>
              <button class="qty-plus" type="button">+</button>
            </div>
          </td>
          <td>
            <div style="font-family:'Comfortaa',sans-serif; font-size:18px; font-weight:500;">${tammiaFormatPrice(it.price * it.qty)}</div>
          </td>
          <td>
            <button class="cart-remove" type="button" aria-label="Hapus"><i class="bi bi-x-lg"></i></button>
          </td>
        </tr>`;
    }).join('');

    // Wire row controls
    tbody.querySelectorAll('tr[data-cart-row]').forEach(row => {
      const name = row.dataset.name;
      const minus = row.querySelector('.qty-minus');
      const plus = row.querySelector('.qty-plus');
      const removeBtn = row.querySelector('.cart-remove');

      function askRemove() {
        tammiaConfirm({
          title: 'Hapus dari Keranjang?',
          message: `<strong>${name}</strong> akan dihapus dari keranjang kamu.`,
          confirmText: 'Hapus',
          cancelText: 'Batal',
          danger: true,
          onConfirm: () => {
            row.classList.add('removing');
            setTimeout(() => {
              removeFromCart(name); // triggers re-render via setCart
            }, 260);
          },
        });
      }

      if (minus) minus.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.name === name);
        if (!item) return;
        if (item.qty > 1) {
          updateCartQty(name, item.qty - 1);
        } else {
          askRemove();
        }
      });
      if (plus) plus.addEventListener('click', () => {
        const cart = getCart();
        const item = cart.find(i => i.name === name);
        if (!item) return;
        updateCartQty(name, item.qty + 1);
      });
      if (removeBtn) removeBtn.addEventListener('click', askRemove);
    });

    recalc();
  }

  function recalc() {
    const cart = getCart();
    let subtotal = 0;
    let totalQty = 0;
    cart.forEach(it => {
      subtotal += (parseInt(it.price, 10) || 0) * (parseInt(it.qty, 10) || 0);
      totalQty += parseInt(it.qty, 10) || 0;
    });
    const shipping = subtotal === 0 ? 0 : (subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_COST);

    // Update order-summary
    const summary = document.querySelector('.order-summary');
    let extraDeductions = 0;
    if (summary) {
      const rows = summary.querySelectorAll('.summary-row');
      if (rows[0]) {
        rows[0].innerHTML = `<span>Subtotal (${totalQty} item)</span><span>${tammiaFormatPrice(subtotal)}</span>`;
      }
      summary.querySelectorAll('.summary-row:not(.total)').forEach((srow, idx) => {
        if (idx === 0) return;
        const lbl = srow.querySelector('span:first-child');
        if (!lbl) return;
        if (/Pengiriman/i.test(lbl.textContent)) {
          srow.innerHTML = shipping === 0
            ? `<span>Pengiriman</span><span><i class="bi bi-check-circle-fill" style="color:#2d9b5e;"></i> Gratis</span>`
            : `<span>Pengiriman</span><span>${tammiaFormatPrice(shipping)}</span>`;
        } else {
          const val = srow.querySelector('span:last-child');
          if (val) {
            const m = val.textContent.match(/(\d[\d.]*)/);
            if (m) {
              const n = parseInt(m[1].replace(/\./g, ''), 10);
              const sign = /[-−]/.test(val.textContent) ? -1 : 1;
              extraDeductions += sign * n;
            }
          }
        }
      });
      const totalRow = summary.querySelector('.summary-row.total');
      if (totalRow) {
        const total = Math.max(0, subtotal + shipping + extraDeductions);
        totalRow.innerHTML = `<span>Total</span><span>${tammiaFormatPrice(total)}</span>`;
      }
    }

    // Shipping progress bar
    const progress = document.querySelector('.shipping-progress');
    if (progress) {
      const remaining = Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);
      const pct = Math.min(100, (subtotal / SHIPPING_FREE_THRESHOLD) * 100);
      const fill = progress.querySelector('.shipping-progress-fill');
      if (fill) fill.style.width = pct + '%';
      const headRow = progress.querySelector('.d-flex');
      if (headRow) {
        if (remaining <= 0) {
          headRow.innerHTML = `<div><strong style="font-family:'Comfortaa',sans-serif; font-size:18px;">Yay! Kamu dapat gratis ongkir</strong> <span style="color:var(--muted); font-size:14px;">untuk pesanan ini.</span></div>
          <span class="mono-label">${tammiaFormatPrice(subtotal)} / ${tammiaFormatPrice(SHIPPING_FREE_THRESHOLD)}</span>`;
        } else {
          headRow.innerHTML = `<div><strong style="font-family:'Comfortaa',sans-serif; font-size:18px;">Belanja ${tammiaFormatPrice(remaining)} lagi</strong> <span style="color:var(--muted); font-size:14px;">untuk gratis ongkir!</span></div>
          <span class="mono-label">${tammiaFormatPrice(subtotal)} / ${tammiaFormatPrice(SHIPPING_FREE_THRESHOLD)}</span>`;
        }
      }
    }

    // Update cart count badge in header
    const headerCount = document.querySelector('h1 [style*="0.6em"]');
    if (headerCount) headerCount.textContent = `(${totalQty} item)`;
  }

  // Re-render whenever the global cart changes (from drawer, etc.)
  document.addEventListener('tammia:cart-changed', renderRows);

  renderRows();
}

/* ============================================================
   Checkout page — ringkasan real + buy-now vs cart mode
   ============================================================ */
function tammiaGetBuyNowItem() {
  try { return JSON.parse(sessionStorage.getItem('tammia_buynow') || 'null'); }
  catch (e) { return null; }
}

function tammiaInitBuyNowButtons() {
  document.querySelectorAll('[data-pd-buy-now]').forEach(btn => {
    btn.addEventListener('click', () => {
      const info = document.querySelector('.pd-info');
      if (!info) return; // fallback: checkout mode cart
      const qtyInput = info.querySelector('.qty-stepper input');
      const h1 = info.querySelector('h1');
      const item = {
        name: info.dataset.productName || (h1 ? h1.textContent.trim() : 'Produk'),
        brand: info.dataset.productBrand || '',
        price: parseInt(info.dataset.productPrice, 10) || 0,
        qty: parseInt(qtyInput ? qtyInput.value : '1', 10) || 1,
        svg: info.dataset.productSvg || 'brush',
      };
      sessionStorage.setItem('tammia_buynow', JSON.stringify(item));
      // anchor href sudah menuju checkout.html?mode=buynow
    });
  });
}

function tammiaInitCheckoutPage() {
  const itemsEl = document.getElementById('checkoutItems');
  if (!itemsEl) return;

  const FREE_THRESHOLD = 150000;
  const params = new URLSearchParams(window.location.search);
  const buyNow = params.get('mode') === 'buynow' && !!tammiaGetBuyNowItem();
  if (params.get('mode') !== 'buynow') sessionStorage.removeItem('tammia_buynow');

  let shipName = 'JNE REG';
  let shipCost = 18000;

  function getItems() {
    if (buyNow) {
      const it = tammiaGetBuyNowItem();
      return it ? [it] : [];
    }
    return getCart();
  }
  function subtotal() {
    return getItems().reduce((sum, it) => sum + (parseInt(it.price, 10) || 0) * (parseInt(it.qty, 10) || 1), 0);
  }
  function isFreeShip() {
    return subtotal() >= FREE_THRESHOLD && /JNE REG/i.test(shipName);
  }
  function effectiveShip() {
    const sub = subtotal();
    if (sub === 0) return 0;
    return isFreeShip() ? 0 : shipCost;
  }
  function itemThumb(it) {
    const prod = (window.TAMMIA_PRODUCTS || []).find(p => p.name === it.name);
    if (prod && prod.image_url) {
      return '<img src="' + prod.image_url + '" alt="" loading="lazy" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">';
    }
    return tammiaSearchSvg(it.svg || 'brush');
  }
  function setEl(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function render() {
    const items = getItems();
    if (items.length === 0) {
      itemsEl.innerHTML = '<div style="text-align:center; padding:18px 0; color:var(--muted); font-size:14px;">' +
        'Belum ada produk untuk di-checkout.<br>' +
        '<a href="shop.html" style="color:var(--rouge); font-weight:600;">Belanja dulu <i class="bi bi-arrow-right"></i></a></div>';
    } else {
      itemsEl.innerHTML = items.map((it, i) => {
        const line = (parseInt(it.price, 10) || 0) * (parseInt(it.qty, 10) || 1);
        return '<div class="drawer-item" style="grid-template-columns:56px 1fr auto; padding:12px 0; ' +
          (i === items.length - 1 ? 'border-bottom:none;' : '') + '">' +
          '<div class="drawer-item-img" style="width:56px; height:56px;">' + itemThumb(it) + '</div>' +
          '<div><div style="font-size:13px; font-weight:500; line-height:1.3;">' + it.name + '</div>' +
          '<div class="mono-label" style="font-size:9px; margin-top:2px;">Qty ' + it.qty + (buyNow ? ' · Beli Langsung' : '') + '</div></div>' +
          '<div style="font-family:\'Comfortaa\',sans-serif; font-size:13px; font-weight:500;">' + tammiaFormatPrice(line) + '</div></div>';
      }).join('');
    }
    recalc();
  }

  function recalc() {
    const sub = subtotal();
    const ship = effectiveShip();
    setEl('coSubtotal', tammiaFormatPrice(sub));
    setEl('coShipLabel', 'Ongkir (' + shipName + ')');
    setEl('coShipVal', ship === 0 && sub > 0
      ? '<i class="bi bi-check-circle-fill" style="color:#2d9b5e;"></i> Gratis'
      : tammiaFormatPrice(ship));
    setEl('coTotal', tammiaFormatPrice(sub + ship));
  }

  function syncReview() {
    const form = document.querySelector('.checkout-form');
    if (form) {
      const ins = form.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], textarea');
      const v = i => (ins[i] && ins[i].value.trim()) || '';
      // urutan: 0 nama, 1 wa, 2 email, 3 provinsi, 4 kota, 5 kecamatan, 6 kodepos, 7 alamat
      if (v(0)) setEl('rvName', v(0));
      if (v(7)) {
        const wilayah = [v(5), v(4), v(3)].filter(Boolean).join(', ');
        setEl('rvAddr', [v(1), v(7), (wilayah + ' ' + v(6)).trim()].filter(Boolean).join('<br>'));
      }
    }
    setEl('rvCourier', '<strong>' + shipName + '</strong>' + (isFreeShip()
      ? ' · <span style="color:#2d7548; font-weight:600;">GRATIS</span>'
      : ' · ' + tammiaFormatPrice(shipCost)));
    const paySel = document.querySelector('.payment-option.selected .payment-wordmark');
    if (paySel) {
      setEl('rvPayment', '<strong style="font-family:\'Comfortaa\',sans-serif; font-size:18px;">' + paySel.textContent.trim() + '</strong>');
    }
  }

  function readShipOption(opt) {
    const c = opt.querySelector('.courier');
    shipName = (c ? c.textContent : 'Kurir').trim();
    const pr = opt.querySelector('.price');
    const m = (pr ? pr.textContent : '').match(/(\d[\d.]*)/);
    shipCost = m ? parseInt(m[1].replace(/\./g, ''), 10) : 0;
  }
  const selectedShip = document.querySelector('.shipping-option.selected');
  if (selectedShip) readShipOption(selectedShip);
  document.querySelectorAll('.shipping-option').forEach(opt => {
    opt.addEventListener('click', () => {
      readShipOption(opt);
      recalc();
      syncReview();
    });
  });
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => setTimeout(syncReview, 30));
  });
  document.querySelectorAll('[data-step-next]').forEach(b => {
    b.addEventListener('click', () => setTimeout(syncReview, 30));
  });

  /* ----- Simpan alamat untuk pesanan berikutnya ----- */
  const ADDR_FIELDS = ['coName', 'coWa', 'coEmail', 'coProv', 'coKota', 'coKec', 'coPos', 'coAlamat', 'coCatatan'];
  const saveBox = document.getElementById('coSaveAddr');

  function persistAddress(silent) {
    if (!saveBox) return;
    if (saveBox.checked) {
      const data = {};
      ADDR_FIELDS.forEach(id => { const el = document.getElementById(id); data[id] = el ? el.value : ''; });
      // hanya simpan kalau minimal nama + alamat terisi
      if ((data.coName || '').trim() && (data.coAlamat || '').trim()) {
        localStorage.setItem('tammia_address', JSON.stringify(data));
        if (!silent) tammiaToast('Alamat disimpan untuk pesanan berikutnya', 'bi-check-circle-fill');
      }
    } else {
      localStorage.removeItem('tammia_address');
    }
  }

  // Prefill dari alamat tersimpan
  let savedAddr = null;
  try { savedAddr = JSON.parse(localStorage.getItem('tammia_address') || 'null'); } catch (e) {}
  if (savedAddr) {
    ADDR_FIELDS.forEach(id => {
      const el = document.getElementById(id);
      if (el && savedAddr[id] != null) el.value = savedAddr[id];
    });
    if (saveBox) saveBox.checked = true;
    setTimeout(syncReview, 0);
  }

  if (saveBox) saveBox.addEventListener('change', () => persistAddress(false));
  // Update alamat tersimpan saat field diubah (kalau checkbox aktif)
  ADDR_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { if (saveBox && saveBox.checked) persistAddress(true); });
  });

  const payBtn = document.getElementById('payNowBtn');
  if (payBtn) payBtn.addEventListener('click', () => {
    const items = getItems();
    if (items.length === 0) {
      tammiaConfirm({
        title: 'Belum Ada Produk',
        message: 'Keranjang checkout kamu kosong. Yuk belanja dulu.',
        confirmText: 'Ke Toko',
        cancelText: 'Tutup',
        onConfirm: () => { window.location.href = 'shop.html'; },
      });
      return;
    }
    persistAddress(true);
    const sub = subtotal();
    const ship = effectiveShip();
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem('tammia_orders') || '[]'); } catch (e) {}
    orders.unshift({
      id: 'TM-' + Date.now().toString(36).toUpperCase(),
      date: new Date().toISOString(),
      items: items,
      subtotal: sub,
      shipping: ship,
      total: sub + ship,
      courier: shipName,
    });
    localStorage.setItem('tammia_orders', JSON.stringify(orders));
    if (buyNow) sessionStorage.removeItem('tammia_buynow');
    else setCart([]);
    tammiaConfirm({
      title: 'Pesanan Berhasil Dibuat!',
      message: 'Terima kasih! Pesanan kamu sedang diproses. (Demo checkout, belum ada pembayaran sungguhan.)',
      confirmText: 'Lihat Pesanan',
      cancelText: 'Ke Beranda',
      onConfirm: () => { window.location.href = 'orders.html'; },
      onCancel: () => { window.location.href = 'index.html'; },
    });
  });

  render();
  tammiaProductsReady().then(render); // re-render thumbs setelah foto produk siap
  document.addEventListener('tammia:cart-changed', render);
}

/* ============================================================
   TASK 7 — Reviews per-produk (render dari product._reviews)
   ============================================================ */
/* ---------- Review v2: penyimpanan review user + util foto ---------- */
const TAMMIA_REVIEW_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
function tammiaReviewTsLabel(ts) {
  const d = new Date(ts);
  return d.getDate() + ' ' + TAMMIA_REVIEW_MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}
function tammiaGetUserReviews(slug) {
  try {
    const all = JSON.parse(localStorage.getItem('tammia_reviews') || '{}');
    return Array.isArray(all[slug]) ? all[slug] : [];
  } catch (e) { return []; }
}
function tammiaSaveUserReviews(slug, arr) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem('tammia_reviews') || '{}'); } catch (e) {}
  all[slug] = arr;
  localStorage.setItem('tammia_reviews', JSON.stringify(all)); // bisa throw quota
}
function tammiaReviewHasPhoto(r) {
  return !!(r.photo || (r.photos && r.photos.length));
}
/* Kompres gambar di browser jadi data URL kecil untuk penyimpanan demo. */
function tammiaDownscaleImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (Math.max(w, h) > maxDim) {
          const sc = maxDim / Math.max(w, h);
          w = Math.round(w * sc); h = Math.round(h * sc);
        }
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(cv.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function tammiaStarsHtml(rating, size) {
  const full = Math.round(rating);
  let out = '';
  for (let i = 1; i <= 5; i++) {
    out += i <= full ? '★' : '<span style="color:var(--line);">★</span>';
  }
  const sz = size ? ` style="color:#e8b04a; font-size:${size};"` : ' style="color:#e8b04a;"';
  return `<span class="stars"${sz}>${out}</span>`;
}

function tammiaRenderProductReviews(product) {
  const tab = document.querySelector('.pd-tab-content[data-tab="review"]');
  if (!tab) return;
  const slug = (product && product.slug) || 'x';
  const generated = (product && product._reviews) ? product._reviews
    : tammiaReviewsForProduct(product || { category: 'Makeup Brushes', slug: 'x' });
  const userReviews = tammiaGetUserReviews(slug);       // tersimpan (punya user)
  const reviews = userReviews.concat(generated);         // review user di atas

  const user = tammiaGetUser();
  const loggedIn = !!(user && user.loggedIn);

  const count = reviews.length;
  const avg = count ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / count) * 10) / 10 : 0;
  const dist = [0, 0, 0, 0, 0];
  reviews.forEach(r => { dist[r.rating - 1]++; });
  const pct = n => count ? Math.round((n / count) * 100) : 0;
  const withPhoto = reviews.filter(tammiaReviewHasPhoto).length;

  const tabBtn = document.querySelector('.pd-tab[data-tab="review"]');
  if (tabBtn) tabBtn.textContent = 'Reviews (' + count + ')';
  // sinkronkan jumlah di rating row atas
  const rrCount = document.querySelector('.pd-rating-row span:nth-child(2)');
  if (rrCount) rrCount.innerHTML = '<i class="bi bi-chat-square-text"></i> ' + count + ' reviews';

  const INITIAL = 3;

  function cardHtml(r) {
    const isOwn = loggedIn && r.ownerEmail && user.email === r.ownerEmail;
    let photoHtml = '';
    if (r.photos && r.photos.length) {
      photoHtml = '<div class="review-photo-row">' +
        r.photos.map(p => '<img class="rv-photo" src="' + p + '" alt="foto review" loading="lazy">').join('') +
        '</div>';
    } else if (r.photo) {
      photoHtml = '<div class="review-photo-row"><span class="review-photo-chip"><i class="bi bi-camera-fill"></i> Foto pembeli</span></div>';
    }
    const ownBadge = isOwn ? '<span class="rv-own-badge">Ulasan kamu</span>' : '';
    const delBtn = isOwn ? '<button type="button" class="rv-delete" data-del="' + r.id + '"><i class="bi bi-trash3"></i> Hapus</button>' : '';
    const dateLabel = r.ts ? tammiaReviewTsLabel(r.ts) : tammiaReviewDateLabel(r.days);
    return '' +
      '<div class="review-card polished" data-review-rating="' + r.rating + '" data-review-photo="' + (tammiaReviewHasPhoto(r) ? 1 : 0) + '" data-review-verified="1">' +
        '<div class="review-head">' +
          '<div class="testimonial-avatar">' + (r.name || '?').charAt(0) + '</div>' +
          '<div style="flex:1;">' +
            '<strong style="font-size:14px;">' + r.name + '</strong>' + ownBadge +
            '<span class="verified-pill"><i class="bi bi-patch-check-fill"></i> Verified</span>' +
            '<div class="mono-label" style="font-size:9px; margin-top:2px;">Pembelian Terverifikasi</div>' +
          '</div>' +
          tammiaStarsHtml(r.rating) +
        '</div>' +
        '<h4 class="review-headline">' + r.headline + '</h4>' +
        '<p class="review-body">' + r.body + '</p>' +
        photoHtml +
        '<div class="review-footer">' + r.city + ' · ' + dateLabel + (delBtn ? '</div>' + '<div class="review-actions">' + delBtn + '</div>' : '</div>') +
      '</div>';
  }

  const barsHtml = [5, 4, 3, 2, 1].map(star => {
    const n = dist[star - 1];
    return '<div class="review-bar-row"><span class="star-num">' + star + '★</span><div class="track"><div class="fill" style="width:' + pct(n) + '%"></div></div><span class="pct">' + pct(n) + '%</span></div>';
  }).join('');

  const writeBtnLabel = loggedIn ? '<i class="bi bi-pencil"></i> Tulis Review' : '<i class="bi bi-lock"></i> Login untuk Review';

  tab.innerHTML =
    '<div class="review-summary">' +
      '<div>' +
        '<div class="big-rating">' + avg.toFixed(1) + '<sub>/5</sub></div>' +
        '<div class="stars-row">' + tammiaStarsHtml(avg) + '</div>' +
        '<div class="meta">' + count + ' ulasan terverifikasi</div>' +
      '</div>' +
      '<div class="review-bars">' + barsHtml + '</div>' +
    '</div>' +
    '<div class="review-filter-row" id="reviewFilterRow">' +
      '<button class="review-filter-btn active" data-rfilter="all">Semua (' + count + ')</button>' +
      '<button class="review-filter-btn" data-rfilter="5star">Bintang 5 (' + dist[4] + ')</button>' +
      '<button class="review-filter-btn" data-rfilter="photo">Dengan Foto (' + withPhoto + ')</button>' +
      '<button class="review-filter-btn" data-rfilter="mine">Punya Saya</button>' +
      '<button class="btn btn-peach btn-sm ms-auto" id="openReviewForm">' + writeBtnLabel + '</button>' +
    '</div>' +
    '<div class="review-form-wrap" id="reviewFormWrap">' +
      '<h5 style="font-family:\'Comfortaa\',sans-serif; font-weight:400; font-size:20px; margin-bottom:6px;">Tulis ulasan kamu</h5>' +
      '<p style="color:var(--muted); font-size:13px; margin-bottom:14px;">Bantu beauty enthusiast lain dengan pengalamanmu.</p>' +
      '<label>Rating Kamu</label>' +
      '<div class="star-picker" data-picker><span class="star" data-star="1">★</span><span class="star" data-star="2">★</span><span class="star" data-star="3">★</span><span class="star" data-star="4">★</span><span class="star" data-star="5">★</span></div>' +
      '<label>Nama</label>' +
      '<input type="text" id="rvFormName" placeholder="Nama kamu" value="' + (loggedIn ? (user.name || '').replace(/"/g, '&quot;') : '') + '" readonly>' +
      '<label>Headline Review</label>' +
      '<input type="text" id="rvFormHeadline" placeholder="Worth banget!">' +
      '<label>Ulasan Lengkap</label>' +
      '<textarea id="rvFormBody" placeholder="Ceritakan pengalaman kamu..."></textarea>' +
      '<label>Foto Produk (opsional, maks 5 foto · 2MB per foto)</label>' +
      '<input type="file" id="rvFormPhotos" accept="image/*" multiple style="display:none;">' +
      '<div class="upload-zone" id="rvUploadZone"><i class="bi bi-image"></i> Tap untuk pilih foto · maks 5 foto, 2MB/foto</div>' +
      '<div class="review-photo-preview" id="rvPhotoPreview"></div>' +
      '<button type="button" class="btn btn-peach" id="submitReview">Kirim Review</button>' +
    '</div>' +
    '<div id="reviewList">' +
      reviews.map((r, i) => '<div class="review-item-wrap" data-mine="' + ((loggedIn && r.ownerEmail && user.email === r.ownerEmail) ? 1 : 0) + '" data-extra="' + (i >= INITIAL ? 1 : 0) + '"' + (i >= INITIAL ? ' style="display:none;"' : '') + '>' + cardHtml(r) + '</div>').join('') +
    '</div>' +
    (count > INITIAL ? '<div style="text-align:center; padding: 22px 0 0;"><button type="button" class="btn btn-ghost" id="toggleAllReviews">Lihat semua ' + count + ' review <i class="bi bi-chevron-down"></i></button></div>' : '');

  // ----- Lihat semua / sembunyikan -----
  const toggleBtn = tab.querySelector('#toggleAllReviews');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.classList.toggle('expanded');
      tab.querySelectorAll('#reviewList .review-item-wrap[data-extra="1"]').forEach(w => {
        if (expanded) { if (w.dataset.filtered !== '0') w.style.display = ''; }
        else { w.style.display = 'none'; }
      });
      toggleBtn.innerHTML = expanded
        ? 'Sembunyikan review <i class="bi bi-chevron-up"></i>'
        : 'Lihat semua ' + count + ' review <i class="bi bi-chevron-down"></i>';
      if (!expanded) tab.querySelector('.review-summary').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ----- Filter -----
  function applyReviewFilter(f) {
    const expanded = toggleBtn ? toggleBtn.classList.contains('expanded') : true;
    tab.querySelectorAll('#reviewList .review-item-wrap').forEach(w => {
      const card = w.querySelector('.review-card');
      let ok = true;
      if (f === '5star') ok = card.dataset.reviewRating === '5';
      if (f === 'photo') ok = card.dataset.reviewPhoto === '1';
      if (f === 'mine') ok = w.dataset.mine === '1';
      w.dataset.filtered = ok ? '1' : '0';
      const isExtra = w.dataset.extra === '1';
      w.style.display = (ok && (!isExtra || expanded)) ? '' : 'none';
    });
    if (toggleBtn) toggleBtn.style.display = (f === 'all') ? '' : 'none';
  }
  tab.querySelectorAll('.review-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tab.querySelectorAll('.review-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyReviewFilter(btn.dataset.rfilter);
    });
  });

  // ----- Hapus review sendiri (hanya pemilik; admin tidak punya tombol ini) -----
  tab.querySelectorAll('[data-del]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.del;
      tammiaConfirm({
        title: 'Hapus Review?',
        message: 'Ulasan kamu akan dihapus permanen.',
        confirmText: 'Hapus', cancelText: 'Batal', danger: true,
        onConfirm: () => {
          const arr = tammiaGetUserReviews(slug).filter(x => x.id !== id);
          try { tammiaSaveUserReviews(slug, arr); } catch (e) {}
          tammiaRenderProductReviews(product);
          tammiaToast('Review kamu dihapus', 'bi-check-circle-fill');
        },
      });
    });
  });

  // ----- Star picker -----
  const picker = tab.querySelector('[data-picker]');
  let chosen = 5;
  if (picker) {
    picker.dataset.value = '5';
    picker.querySelectorAll('.star').forEach(st => st.classList.add('lit'));
    picker.querySelectorAll('.star').forEach(star => {
      star.addEventListener('mouseenter', () => {
        const v = parseInt(star.dataset.star, 10);
        picker.querySelectorAll('.star').forEach(x => x.classList.toggle('lit', parseInt(x.dataset.star, 10) <= v));
      });
      star.addEventListener('click', () => { chosen = parseInt(star.dataset.star, 10); picker.dataset.value = chosen; });
    });
    picker.addEventListener('mouseleave', () => {
      picker.querySelectorAll('.star').forEach(x => x.classList.toggle('lit', parseInt(x.dataset.star, 10) <= chosen));
    });
  }

  // ----- Upload foto (maks 5, maks 2MB) -----
  const pendingPhotos = [];
  const fileInput = tab.querySelector('#rvFormPhotos');
  const uploadZone = tab.querySelector('#rvUploadZone');
  const previewBox = tab.querySelector('#rvPhotoPreview');
  function renderPhotoPreview() {
    if (!previewBox) return;
    previewBox.innerHTML = pendingPhotos.map((p, i) =>
      '<div class="rv-photo-thumb"><img src="' + p + '" alt="preview"><button type="button" data-rmphoto="' + i + '" aria-label="Hapus foto">&times;</button></div>').join('');
    previewBox.querySelectorAll('[data-rmphoto]').forEach(btn => {
      btn.addEventListener('click', () => { pendingPhotos.splice(parseInt(btn.dataset.rmphoto, 10), 1); renderPhotoPreview(); });
    });
    if (uploadZone) uploadZone.innerHTML = pendingPhotos.length
      ? '<i class="bi bi-image"></i> ' + pendingPhotos.length + '/5 foto · tap untuk tambah'
      : '<i class="bi bi-image"></i> Tap untuk pilih foto · maks 5 foto, 2MB/foto';
  }
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', async () => {
      const files = Array.from(fileInput.files || []);
      for (const f of files) {
        if (pendingPhotos.length >= 5) { tammiaToast('Maksimal 5 foto per review', 'bi-exclamation-circle'); break; }
        if (!f.type || f.type.indexOf('image/') !== 0) { tammiaToast('"' + f.name + '" bukan gambar', 'bi-exclamation-circle'); continue; }
        if (f.size > 2 * 1024 * 1024) { tammiaToast('"' + f.name + '" lebih dari 2MB', 'bi-exclamation-circle'); continue; }
        try { pendingPhotos.push(await tammiaDownscaleImage(f, 900, 0.72)); } catch (e) {}
      }
      fileInput.value = '';
      renderPhotoPreview();
    });
  }

  // ----- Buka form (gated login) -----
  const formWrap = tab.querySelector('#reviewFormWrap');
  const openBtn = tab.querySelector('#openReviewForm');
  function requireLogin() {
    tammiaToast('Login dulu untuk menulis review', 'bi-lock');
    if (window.tammiaOpenAuth) window.tammiaOpenAuth();
  }
  if (openBtn && formWrap) {
    openBtn.addEventListener('click', () => {
      if (!loggedIn) { requireLogin(); return; }
      formWrap.classList.toggle('open');
      if (formWrap.classList.contains('open')) formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ----- Submit (gated login + simpan + foto) -----
  const submitBtn = tab.querySelector('#submitReview');
  if (submitBtn) submitBtn.addEventListener('click', () => {
    if (!loggedIn) { requireLogin(); return; }
    const hl = (tab.querySelector('#rvFormHeadline').value || '').trim();
    const bd = (tab.querySelector('#rvFormBody').value || '').trim();
    if (!bd) { tammiaToast('Tulis ulasan kamu dulu ya', 'bi-exclamation-circle'); return; }
    const review = {
      id: 'rv-' + Date.now().toString(36) + Math.floor(Math.random() * 1000),
      name: user.name || 'Pelanggan Tammia',
      city: 'Pembeli Terverifikasi',
      rating: chosen,
      headline: hl || 'Ulasan',
      body: bd,
      photos: pendingPhotos.slice(),
      ts: Date.now(),
      ownerEmail: user.email || '',
    };
    const arr = tammiaGetUserReviews(slug);
    arr.unshift(review);
    try {
      tammiaSaveUserReviews(slug, arr);
    } catch (e) {
      // kuota localStorage penuh -> simpan tanpa foto
      review.photos = [];
      try { tammiaSaveUserReviews(slug, arr); } catch (e2) {}
      tammiaToast('Review tersimpan, tapi foto terlalu besar untuk demo ini', 'bi-exclamation-circle');
    }
    submitBtn.innerHTML = 'Review Terkirim ✓';
    submitBtn.disabled = true;
    submitBtn.style.background = '#2d9b5e';
    submitBtn.style.color = '#fff';
    setTimeout(() => {
      tammiaRenderProductReviews(product);
      tammiaToast('Review berhasil dikirim. Terima kasih!', 'bi-check-circle-fill');
    }, 700);
  });
}

/* ============================================================
   TASK 8 — Order summary collapsible on mobile
   ============================================================ */
function tammiaInitOrderSummaryCollapsible() {
  const summary = document.querySelector('.order-summary');
  if (!summary) return;
  // Only on checkout page (look for step progress)
  if (!document.querySelector('.step-progress')) return;
  summary.classList.add('collapsible');
  // Wrap existing children into toggle/content
  const original = Array.from(summary.children);
  const heading = original[0];
  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'summary-toggle';
  toggleBtn.innerHTML = `<span style="font-family:'Comfortaa',sans-serif; font-size:22px;">Ringkasan Pesanan</span><i class="bi bi-chevron-down chevron"></i>`;
  const content = document.createElement('div');
  content.className = 'summary-content';
  original.forEach((el, i) => {
    if (i === 0) return; // skip heading h5 (we replaced with toggle text)
    content.appendChild(el);
  });
  // Remove heading h5 since we used its text in toggle
  if (heading) heading.remove();
  summary.appendChild(toggleBtn);
  summary.appendChild(content);

  // Open by default on desktop
  function syncOpen() {
    if (window.innerWidth > 991) summary.classList.add('open');
  }
  syncOpen();
  window.addEventListener('resize', syncOpen);
  toggleBtn.addEventListener('click', () => {
    summary.classList.toggle('open');
  });
}

/* ============================================================
   TASK 4 — Newsletter form (validation + storage + success card)
   ============================================================ */
function tammiaIsValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || '').trim());
}
function tammiaGetNewsletter() {
  try { return JSON.parse(localStorage.getItem('tammia_newsletter') || '[]'); }
  catch (e) { return []; }
}
function tammiaSaveNewsletter(list) {
  localStorage.setItem('tammia_newsletter', JSON.stringify(list || []));
}
function tammiaInitNewsletterForm(form) {
  if (!form || form.dataset.nlInit === '1') return;
  form.dataset.nlInit = '1';

  const isFooter = form.classList.contains('footer-newsletter');
  const input = form.querySelector('input[type="email"], input[type="text"], input');
  const btn = form.querySelector('button');
  if (!input || !btn) return;

  // Inline error helper
  let errorEl = form.querySelector('.newsletter-error');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'newsletter-error';
    errorEl.style.cssText = `
      display: none;
      width: 100%;
      margin-top: 8px;
      font-size: 12px;
      color: ${isFooter ? '#ff9a9a' : 'var(--rouge)'};
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.04em;
    `;
    form.appendChild(errorEl);
  }
  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
    input.style.borderColor = isFooter ? '#ff9a9a' : 'var(--rouge)';
  }
  function clearError() {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
    input.style.borderColor = '';
  }
  input.addEventListener('input', clearError);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = (input.value || '').trim();
    if (!tammiaIsValidEmail(email)) {
      showError('Email tidak valid. Coba lagi.');
      return;
    }
    const list = tammiaGetNewsletter();
    if (list.includes(email.toLowerCase())) {
      showSuccess(form, isFooter, 'Email kamu sudah terdaftar', 'Kami sudah punya emailmu — kamu akan terus dapat info Friday Flash Sale tiap minggu.');
      return;
    }
    list.push(email.toLowerCase());
    tammiaSaveNewsletter(list);

    // Optional: send to Supabase
    if (window.TAMMIA_USE_REAL_AUTH && window.tammiaSupabase) {
      window.tammiaSupabase
        .from('newsletter_subscribers')
        .insert({ email })
        .then(() => {}, err => console.warn('Newsletter insert failed:', err));
    }
    showSuccess(form, isFooter);
  });

  function showSuccess(form, isFooter, title = 'Terima kasih sudah subscribe!', body = 'Kamu akan dapat info flash sale, produk baru, dan promo eksklusif setiap minggu.') {
    if (form.dataset.original) return; // already showing
    form.dataset.original = form.innerHTML;
    const tintBg = isFooter ? 'rgba(255,255,255,0.08)' : 'var(--cream-1)';
    const ringColor = isFooter ? '#fff' : 'var(--pink)';
    const titleColor = isFooter ? '#fff' : 'var(--ink)';
    const bodyColor = isFooter ? '#bbb' : 'var(--ink-soft)';
    form.style.display = 'block';
    form.innerHTML = `
      <div class="newsletter-success" style="
        display:flex; align-items:center; gap:14px;
        background:${tintBg};
        border:1px solid ${ringColor === '#fff' ? 'rgba(255,255,255,0.18)' : 'var(--pink)'};
        border-radius:14px; padding:18px 20px;">
        <div style="
          width:44px; height:44px; flex:0 0 44px; border-radius:50%;
          background:${isFooter ? 'rgba(225,29,37,0.25)' : 'var(--pink-tint)'};
          color:${isFooter ? '#e6cfa0' : 'var(--rouge)'};
          display:flex; align-items:center; justify-content:center;
          font-size:20px;
        "><i class="bi bi-check-lg"></i></div>
        <div style="flex:1; min-width:0;">
          <div style="font-family:'Comfortaa',sans-serif; font-size:18px; line-height:1.2; color:${titleColor};">${title}</div>
          <div style="font-size:13px; color:${bodyColor}; margin-top:4px;">${body}</div>
        </div>
        <button type="button" class="newsletter-close" style="
          background:transparent; border:1px solid ${ringColor === '#fff' ? 'rgba(255,255,255,0.25)' : 'var(--line)'};
          color:${titleColor}; border-radius:10px; padding:8px 14px;
          font-family:'JetBrains Mono',monospace; font-size:11px;
          letter-spacing:0.16em; text-transform:uppercase; cursor:pointer;
          flex-shrink:0;
        ">Tutup</button>
      </div>`;
    const closeBtn = form.querySelector('.newsletter-close');
    function revert() {
      if (!form.dataset.original) return;
      form.innerHTML = form.dataset.original;
      delete form.dataset.original;
      form.style.display = '';
      // Re-init in case event listeners need re-binding
      delete form.dataset.nlInit;
      tammiaInitNewsletterForm(form);
    }
    if (closeBtn) closeBtn.addEventListener('click', revert);
    setTimeout(revert, 4000);
  }
}

/* ============================================================
   TASK 1 — Supabase auth helpers
   ============================================================ */
function tammiaUseRealAuth() {
  return !!(window.TAMMIA_USE_REAL_AUTH && window.tammiaSupabase);
}

/* Sync the Supabase session to localStorage so existing UI works. */
function tammiaSyncSupabaseSessionToLocal(session) {
  if (!session || !session.user) {
    tammiaSaveUser(null);
    return;
  }
  const u = session.user;
  const meta = u.user_metadata || {};
  const username = meta.username || (u.email ? u.email.split('@')[0] : '');
  const name = meta.full_name || meta.name || username || 'Tammia';
  // Hide placeholder internal email from UI display
  const displayEmail = (u.email && u.email.endsWith('@tammia.users.id')) ? '' : (u.email || '');
  tammiaSaveUser({
    name: (name + '').charAt(0).toUpperCase() + (name + '').slice(1),
    username: username,
    email: displayEmail,
    loggedIn: true,
    supabaseId: u.id,
    isAdmin: meta.role === 'admin',
    role: meta.role || null,
  });
}

function tammiaInitSupabaseAuthSync() {
  if (!tammiaUseRealAuth()) return;
  const sb = window.tammiaSupabase;
  // Hydrate from existing session (returns a Promise)
  sb.auth.getSession().then(({ data }) => {
    tammiaSyncSupabaseSessionToLocal(data && data.session);
    tammiaRefreshAuthUi();
  }, () => {});
  sb.auth.onAuthStateChange((event, session) => {
    tammiaSyncSupabaseSessionToLocal(session);
    tammiaRefreshAuthUi();
  });
}

/* ============================================================
   TASK 5 — Orders page (status filters + tracking + buy again)
   ============================================================ */
function tammiaInitOrdersPage() {
  const list = document.getElementById('ordersList');
  if (!list) return;

  const filterRow = document.getElementById('ordersFilterRow');
  const emptyEl = document.getElementById('ordersEmpty');
  const cards = Array.from(list.querySelectorAll('.order-card'));

  function applyFilter(filter) {
    let visible = 0;
    cards.forEach(c => {
      const show = filter === 'all' || c.dataset.orderStatus === filter;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (emptyEl) {
      if (visible === 0) {
        emptyEl.style.display = '';
        list.style.display = 'none';
      } else {
        emptyEl.style.display = 'none';
        list.style.display = '';
      }
    }
  }

  if (filterRow) {
    filterRow.querySelectorAll('[data-order-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterRow.querySelectorAll('[data-order-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.orderFilter);
      });
    });
  }

  // Tracking timeline toggle
  list.querySelectorAll('[data-tracking-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.order-card');
      if (!card) return;
      card.classList.toggle('tracking-open');
    });
  });

  // Buy again — add product to cart by product name lookup
  list.querySelectorAll('[data-buy-again]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.buyAgain;
      const product = (window.TAMMIA_PRODUCTS || []).find(p => p.name === name);
      if (!product) {
        tammiaToast('Produk tidak ditemukan di katalog.', 'bi-exclamation-triangle-fill');
        return;
      }
      addToCart({
        name: product.name,
        brand: product.brand,
        price: product.price,
        was: product.was || null,
        svg: product.svg,
      });
      tammiaToast('Ditambahkan ke keranjang', 'bi-bag-check-fill');
      const drawer = document.getElementById('cartDrawer');
      const bd = document.getElementById('drawerBackdrop');
      if (drawer) drawer.classList.add('open');
      if (bd) bd.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Initial: show all
  applyFilter('all');
}

/* ============================================================
   DEWY blob canvas background — Tammia brand tints
   ============================================================ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let bubbles = [];
  const mouse = { x: -1000, y: -1000 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function pickColor() {
    const palette = [
      [240, 194, 196],  // blush
      [230, 207, 160],  // light gold
      [248, 241, 226],  // gold tint
      [247, 222, 223],  // soft blush
      [235, 138, 143]   // soft red
    ];
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function createBubbles() {
    const w = window.innerWidth, h = window.innerHeight;
    const count = w < 768 ? 10 : 18;
    bubbles = [];
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x: Math.random() * w,
        y: Math.random() * h + h * 0.2,
        r: 30 + Math.random() * 90,
        vy: -(0.12 + Math.random() * 0.35),
        vx: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002,
        amp: 0.3 + Math.random() * 0.7,
        alpha: 0.18 + Math.random() * 0.35,
        color: pickColor(),
        pushX: 0, pushY: 0
      });
    }
  }

  function draw() {
    const w = window.innerWidth, h = window.innerHeight;
    if (canvas.width === 0 && w > 0) { resize(); createBubbles(); }
    ctx.clearRect(0, 0, w, h);
    bubbles.forEach(b => {
      b.phase += b.speed * 16;
      b.vx = Math.sin(b.phase) * b.amp;
      const dx = b.x - mouse.x, dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 0) {
        const force = (200 - dist) / 200;
        b.pushX += (dx / dist) * force * 4;
        b.pushY += (dy / dist) * force * 4;
      }
      b.pushX *= 0.92;
      b.pushY *= 0.92;
      b.x += b.vx + b.pushX;
      b.y += b.vy + b.pushY;
      if (b.y + b.r < 0) { b.y = h + b.r; b.x = Math.random() * w; }
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;
      const [r, g, bl] = b.color;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `rgba(${r},${g},${bl},${b.alpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reduced) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createBubbles(); });
  window.addEventListener('load', () => { if (canvas.width === 0) { resize(); createBubbles(); } });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize();
  createBubbles();
  draw();
})();
