/* ============================================
   QASIM GLASS ALUMINUM & INTERIOR DESIGN
   Google Sheet Powered + Full Stable Version
   ============================================ */

const WHATSAPP_NUMBER = '923034348982';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

/* ✅ GOOGLE SHEET CSV LINK HERE */
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRomJ5RLxvhCU1DWN9pTCjloRPLdxFrfVjftqPOI48FkReBTn8vxhrhgt-vKTo7nH7sQmqS9VAn3yps/pub?output=csv";

let ALL_PRODUCTS = [];


/* ============================================
   ✅ SAFE CSV PARSER
   Commas + multiline descriptions support
============================================ */
function parseCSV(csvText) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    // Quotes handling
    if (char === '"') {
      // Google Sheet CSV escaped quote: ""
      if (inQuotes && nextChar === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    // New column
    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    // New row (only outside quotes)
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") i++;

      row.push(field);
      field = "";

      // Empty row ignore
      if (row.some(cell => String(cell).trim() !== "")) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    // Normal text, including line-break inside a quoted description
    field += char;
  }

  // Last row
  if (field.length || row.length) {
    row.push(field);

    if (row.some(cell => String(cell).trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

/* ============================================
   ✅ FETCH PRODUCTS FROM GOOGLE SHEET
============================================ */
/* ============================================
   ✅ FETCH PRODUCTS FROM GOOGLE SHEET
   Supports long + multiline description
============================================ */
async function loadProductsFromSheet() {

  const CACHE_KEY = "qasim_products_cache_v1";
  const CACHE_DURATION = 5 * 60 * 1000; // ✅ 5 minutes cache

  // ✅ 1. Check Local Storage Cache First
  const cachedData = localStorage.getItem(CACHE_KEY);

  if (cachedData) {
    const parsed = JSON.parse(cachedData);

    if (Date.now() - parsed.timestamp < CACHE_DURATION) {
      ALL_PRODUCTS = parsed.data;
      console.log("✅ Loaded products from cache:", ALL_PRODUCTS.length);
      return;
    }
  }

  try {
    // ✅ 2. If no valid cache, fetch from Google Sheet
    const response = await fetch(SHEET_CSV_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Google Sheet request failed: ${response.status}`);
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    const clean = (value) => String(value ?? "").trim();

    ALL_PRODUCTS = rows.slice(1).map(cols => {
      if (!cols || cols.length < 8) return null;

      const mainCategory = clean(cols[6]).toLowerCase();
      const subCategory = clean(cols[7]).toLowerCase();

      return {
        id: clean(cols[0]),
        name: clean(cols[1]),
        shortDesc: String(cols[2] ?? "")
          .replace(/\r\n?/g, "\n")
          .trim(),
        price: clean(cols[3]),
        size: clean(cols[4]),
        type: clean(cols[5]).toLowerCase(),
        mainCategory: mainCategory,
        subCategory: subCategory,
        category: subCategory || mainCategory
      };
    }).filter(product => product && product.id && product.name);

    // ✅ 3. Save to Local Storage
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: ALL_PRODUCTS
    }));

    console.log("✅ Loaded products from Google Sheet:", ALL_PRODUCTS.length);

  } catch (error) {
    console.error("❌ Google Sheet Load Error:", error);
    ALL_PRODUCTS = [];
  }
}

/* ============================================
   ✅ HELPERS
============================================ */
function getAllProducts() {
  return ALL_PRODUCTS.slice(0, 300);
}
function getImportedProducts() {
  return ALL_PRODUCTS.filter(p => p.type === "imported");
}

/* ============================================
   ✅ MOST SELLING PRODUCTS (MANUAL SELECTION)
   Yahan sirf apni product IDs likhein.
   Products isi order mein show hongay.
============================================ */
const MOST_SELLING_IDS = [
  "cat1-0-1",
  "cat1-0-21",
  "cat2-0-24",
  "cat1-0-4",
  "cat2-0-33",
  "cat1-0-23",
  "cat1-0-18",
  "cat1-0-8",
  "cat1-0-9",
  "cat1-0-10"
];

function getMostSellingProducts() {
  return MOST_SELLING_IDS
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(p => p); // Agar koi ID galat ho to skip ho jaye
}
/* ============================================
/* ============================================
   ✅ BACK TO TOP
============================================ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
function initProjectsPage() {
  // temporarily empty to prevent error
}
/* ============================================
   ✅ DOM READY
============================================ */
document.addEventListener("DOMContentLoaded", async function () {

  await loadProductsFromSheet();

  if (typeof initPreloader === "function") initPreloader();
  if (typeof initHeader === "function") initHeader();
  if (typeof initMenu === "function") initMenu();
  if (typeof initSearch === "function") initSearch();
  if (typeof initHeroSlider === "function") initHeroSlider();
  if (typeof initMostSelling === "function") initMostSelling();
  if (typeof initFAQ === "function") initFAQ();
  if (typeof initReviews === "function") initReviews();
  if (typeof initScrollAnimations === "function") initScrollAnimations();
  if (typeof initBackToTop === "function") initBackToTop();
  if (typeof initProductsPage === "function") initProductsPage();
  if (typeof initProductDetail === "function") initProductDetail();
  if (typeof initContactForm === "function") initContactForm();
  if (typeof initImportedPage === "function") initImportedPage();

  // ✅ IMPORTANT — FORCE PROJECTS INIT
  initProjectsPage();

});
/* ============================================
   ✅ PRODUCT CARD HTML
============================================ */
function createProductCardHTML(product) {
  const badgeClass = product.type === "imported" ? "imported" : "local";
  const badgeText = product.type === "imported" ? "Imported" : "Local";
  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in:\n\n📦 ${product.name}\n💰 ${product.price}\n📐 ${product.size}`
  );

  return `
    <div class="product-card">
      <div class="product-card-img">
        <img src="images/products/${product.id}/main.webp"
             loading="lazy"
             alt="${product.name}"
             onerror="this.src='images/products/default.webp'">
        <span class="product-badge ${badgeClass}">${badgeText}</span>
        <a href="product-detail.html?id=${product.id}" class="product-card-quick-view">👁</a>
      </div>
      <div class="product-card-info">
        <div class="product-card-category">${product.category}</div>
        <h3 class="product-card-name">${product.name}</h3>
        <p class="product-card-desc">${product.shortDesc}</p>
        <div class="product-card-size">📐 ${product.size}</div>
        <div class="product-card-price">${product.price}</div>
        <a href="product-detail.html?id=${product.id}" class="btn-view-details">View Details →</a>
        <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}" target="_blank" class="btn-whatsapp-order">📱 Order on WhatsApp</a>
      </div>
    </div>
  `;
}

/* ============================================
   ✅ PRELOADER
============================================ */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  window.addEventListener('load', () => preloader.classList.add('hidden'));
  setTimeout(() => preloader.classList.add('hidden'), 600);
}

/* ============================================
   ✅ HEADER
============================================ */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });
}

/* ============================================
   ✅ MENU
============================================ */
function initMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.fullscreen-menu');
  const menuClose = document.querySelector('.menu-close-btn');
  const menuLinks = document.querySelectorAll('.menu-nav a');
  if (!menuToggle || !menu) return;

  function openMenu() {
    menu.classList.add('active');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    menu.classList.contains('active') ? closeMenu() : openMenu();
  });
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  menuLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ============================================
   ✅ SEARCH
============================================ */
function initSearch() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('#searchInput');
  const searchResults = document.querySelector('.search-results');
  if (!searchToggle || !searchOverlay) return;

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');

    // ✅ LOCK BODY SCROLL
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    setTimeout(() => searchInput && searchInput.focus(), 300);
  });

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');

      // ✅ UNLOCK BODY SCROLL
      document.body.style.overflow = '';
      document.body.style.height = '';

      if (searchInput) searchInput.value = '';
      if (searchResults) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
      }
    });
  }

  if (searchInput) {
    let t;
    searchInput.addEventListener('input', e => {
      clearTimeout(t);
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        if (searchResults) { searchResults.classList.remove('active'); searchResults.innerHTML = ''; }
        return;
      }
      t = setTimeout(() => {
        const results = getAllProducts().filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.shortDesc.toLowerCase().includes(query)
        ).slice(0, 10);

        if (searchResults) {
          if (results.length) {
            searchResults.innerHTML = results.map(p => `
  <a href="product-detail.html?id=${p.id}" class="search-result-item">
    
    <div class="search-result-img">
      <img src="images/products/${p.id}/main.webp"
           alt="${p.name}"
           onerror="this.src='images/products/default.webp'">
    </div>

    <div class="search-result-info">
      <h4>${p.name}</h4>
      <span class="search-price">${p.price}</span>
    </div>

  </a>
`).join('');
          } else {
            searchResults.innerHTML = '<div style="padding:20px;text-align:center;color:#666;">No products found</div>';
          }
          searchResults.classList.add('active');
        }
      }, 300);
    });
  }

  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');

      // ✅ UNLOCK BODY SCROLL
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
  });
}

/* ============================================
   ✅ HERO SLIDER
============================================ */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-slider-dots .dot');
  if (!slides.length) return;
  let current = 0;

  function go(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[i].classList.add('active');
    if (dots[i]) dots[i].classList.add('active');
    current = i;
  }
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  setInterval(() => go((current + 1) % slides.length), 5000);
}

/* ============================================
   ✅ MOST SELLING
============================================ */
function initMostSelling() {
  const container = document.querySelector('.products-swiper-track');
  if (!container) return;
  container.innerHTML = getMostSellingProducts().map(p => createProductCardHTML(p)).join('');

  const wrapper = document.querySelector('.products-swiper-wrapper');
  const prevBtn = document.querySelector('.swiper-prev');
  const nextBtn = document.querySelector('.swiper-next');
  if (prevBtn && wrapper) prevBtn.addEventListener('click', () => wrapper.scrollBy({ left: -320, behavior: 'smooth' }));
  if (nextBtn && wrapper) nextBtn.addEventListener('click', () => wrapper.scrollBy({ left: 320, behavior: 'smooth' }));
}

/* ============================================
   ✅ FAQ
============================================ */
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const active = item.classList.contains('active');
      items.forEach(fi => {
        fi.classList.remove('active');
        const fa = fi.querySelector('.faq-answer');
        if (fa) fa.style.maxHeight = null;
      });
      if (!active) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================
   ✅ REVIEWS
============================================ */
function initReviews() {
  const cards = document.querySelectorAll('.reviews-slider .review-card');
  if (!cards.length) return;
  let current = 0;
  function show(i) {
    cards.forEach(c => { c.style.display = 'none'; c.style.opacity = '0'; });
    cards[i].style.display = 'block';
    setTimeout(() => cards[i].style.opacity = '1', 50);
    current = i;
  }
  show(0);
  setInterval(() => show((current + 1) % cards.length), 5000);
}

/* ============================================
   ✅ SCROLL ANIMATIONS
============================================ */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => obs.observe(el));
}
/* ============================================
   ✅ PRODUCTS PAGE - STABLE + HIERARCHY
============================================ */
function initProductsPage() {
  const pagination = document.querySelector("#productsPagination");

  const grid = document.querySelector("#productsGrid");
  const sidebar = document.querySelector("#sidebarNav");
  const sidebarWrapper = document.querySelector(".products-sidebar");
  const toggleBtn = document.querySelector(".mobile-filter-toggle");
  const count = document.querySelector("#productsCount");

  if (!grid || !sidebar) return;

  let filteredProducts = [...ALL_PRODUCTS];
  let currentPage = 1;
  const PER_PAGE = 21;   // ✅ 21 products per page

  /* ✅ FORMAT */
  function formatName(str) {
    if (!str) return "";
    return str.replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ✅ RENDER */
  function render() {




    const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);

    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * PER_PAGE;
    const pageItems = filteredProducts.slice(start, start + PER_PAGE);

    grid.innerHTML = pageItems.map(p => createProductCardHTML(p)).join("");

    // ✅ Pagination buttons
    if (pagination) {
      let html = "";

      if (totalPages > 1) {

        if (currentPage > 1) {
          html += `<button class="page-btn" data-page="${currentPage - 1}">‹</button>`;
        }

        for (let i = 1; i <= totalPages; i++) {
          html += `
          <button class="page-btn ${i === currentPage ? "active" : ""}" 
                  data-page="${i}">
            ${i}
          </button>`;
        }

        if (currentPage < totalPages) {
          html += `<button class="page-btn" data-page="${currentPage + 1}">›</button>`;
        }

      }

      pagination.innerHTML = html;

      pagination.querySelectorAll(".page-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          currentPage = parseInt(this.dataset.page);
          render();
          window.scrollTo({ top: grid.offsetTop - 100, behavior: "smooth" });
        });
      });
    }
  }

  /* ✅ BUILD SIDEBAR */
  function buildSidebar() {

    const grouped = {};

    ALL_PRODUCTS.forEach(p => {
      const main = (p.mainCategory || "other").toLowerCase().trim();
      const sub = (p.subCategory || "none").toLowerCase().trim();

      if (!grouped[main]) grouped[main] = new Set();
      grouped[main].add(sub);
    });

    let html = `
      <li>
        <input type="text" id="sidebarSearch" 
               placeholder="Search product..."
               class="sidebar-search-input">
      </li>

      <li class="filter-btn active" data-type="all">All</li>
      <li class="filter-btn" data-type="local">Local</li>
      <li class="filter-btn" data-type="imported">Imported</li>
    `;

    Object.keys(grouped).forEach(main => {

      html += `
        <li class="accordion-item">
          <div class="main-cat" data-main="${main}">
            <span class="arrow">▸</span>
            ${formatName(main)}
          </div>
          <ul class="sub-list">
      `;

      grouped[main].forEach(sub => {
        html += `
          <li class="sub-cat"
              data-main="${main}"
              data-sub="${sub}">
            ${formatName(sub)}
          </li>
        `;
      });

      html += `
          </ul>
        </li>
      `;
    });

    sidebar.innerHTML = html;
    bindEvents();
  }
  /* ✅ MOBILE SIDEBAR TOGGLE */
  const overlay = document.querySelector(".sidebar-overlay");


  /* ✅ EVENTS */
  function bindEvents() {

    /* -------- FILTER (All/Local/Imported) -------- */
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", function () {

        document.querySelectorAll(".filter-btn")
          .forEach(b => b.classList.remove("active"));

        this.classList.add("active");

        const type = this.dataset.type;

        if (type === "all") {
          filteredProducts = [...ALL_PRODUCTS];
        } else {
          filteredProducts = ALL_PRODUCTS.filter(p =>
            (p.type || "").toLowerCase() === type
          );
        }

        currentPage = 1;
        render();

        // ✅ Mobile close
        if (window.innerWidth < 992) {
          sidebarWrapper.classList.remove("active");
        }
      });
    });

    /* -------- MAIN CATEGORY -------- */
    document.querySelectorAll(".main-cat").forEach(title => {
      title.addEventListener("click", function () {

        const parent = this.closest(".accordion-item");
        const subList = parent.querySelector(".sub-list");
        const arrow = this.querySelector(".arrow");
        const main = this.dataset.main;

        parent.classList.toggle("open");

        if (parent.classList.contains("open")) {
          subList.style.maxHeight = subList.scrollHeight + "px";
          arrow.textContent = "▾";
        } else {
          subList.style.maxHeight = null;
          arrow.textContent = "▸";
        }

        filteredProducts = ALL_PRODUCTS.filter(p =>
          (p.mainCategory || "").toLowerCase().trim() === main
        );
        currentPage = 1;

        render();
      });
    });

    /* -------- SUB CATEGORY -------- */
    document.querySelectorAll(".sub-cat").forEach(item => {
      item.addEventListener("click", function (e) {

        e.stopPropagation();

        document.querySelectorAll(".sub-cat")
          .forEach(i => i.classList.remove("active"));

        this.classList.add("active");

        const main = this.dataset.main;
        const sub = this.dataset.sub;

        filteredProducts = ALL_PRODUCTS.filter(p => {
          const pMain = (p.mainCategory || "").toLowerCase().trim();
          const pSub = (p.subCategory || "").toLowerCase().trim();
          return pMain === main && pSub === sub;
        });
        currentPage = 1;

        render();

        // ✅ Mobile auto close after selection
        if (window.innerWidth < 992) {
          sidebarWrapper.classList.remove("active");
        }
      });
    });

    /* -------- SEARCH -------- */
    const searchInput = document.querySelector("#sidebarSearch");

    if (searchInput) {
      searchInput.addEventListener("input", function () {

        const q = this.value.trim().toLowerCase();

        if (!q) {
          filteredProducts = [...ALL_PRODUCTS];
        } else {
          filteredProducts = ALL_PRODUCTS.filter(p =>
            (p.name || "").toLowerCase().includes(q) ||
            (p.shortDesc || "").toLowerCase().includes(q)
          );
          currentPage = 1;
        }

        render();
      });
    }
  }

  /* ✅ MOBILE TOGGLE */
  if (toggleBtn && sidebarWrapper) {
    toggleBtn.addEventListener("click", () => {
      sidebarWrapper.classList.toggle("active");
    });
  }
  /* ✅ Auto Category from URL */
  const params = new URLSearchParams(window.location.search);
  const categoryFromURL = params.get("category");

  if (categoryFromURL) {
    filteredProducts = ALL_PRODUCTS.filter(p =>
      (p.mainCategory || "").toLowerCase() === categoryFromURL.toLowerCase()
    );
    currentPage = 1;
  }

  buildSidebar();
  render();
}









/* ============================================
   ✅ PRODUCT DETAIL
============================================ */
function initProductDetail() {
  const section = document.querySelector(".product-detail-section");
  if (!section) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const product = ALL_PRODUCTS.find(p => p.id === id);

  if (!product) {
    section.innerHTML = "<div class='container' style='padding:100px;text-align:center;'><h2>Product Not Found</h2></div>";
    return;
  }

  const set = (sel, val) => { const el = document.querySelector(sel); if (el) el.textContent = val; };
  set("#productTitle", product.name);
  set("#breadcrumbProduct", product.name);
  set("#productPrice", product.price);
  // ✅ Full description + multiple lines display
  const descEl = document.querySelector("#productDesc");

  if (descEl) {
    descEl.textContent = product.shortDesc || "";
  }
  set("#productSize", product.size);
  set("#productCategory", product.category);

  const typeEl = document.querySelector("#productType");
  if (typeEl) {
    typeEl.textContent = product.type === "imported" ? "✈ Imported" : "🏠 Local";
    typeEl.className = `product-type-badge ${product.type}`;
  }

  const wa = document.querySelector("#productWhatsapp");
  if (wa) {
    const msg = encodeURIComponent(`Hi, I'm interested in:\n📦 ${product.name}\n💰 ${product.price}\n📐 ${product.size}`);
    wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  }

  const galleryMain = document.querySelector("#galleryMainImg");
  const thumbs = document.querySelector("#galleryThumbnails");

  let images = [`images/products/${product.id}/main.webp`];
  for (let i = 1; i <= 20; i++) images.push(`images/products/${product.id}/color${i}.webp`);

  let idx = 0;
  function update() {
    if (galleryMain) galleryMain.innerHTML = `<img src="${images[idx]}" onerror="this.src='images/products/${product.id}/main.webp'">`;
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  }

  if (thumbs) {
    thumbs.innerHTML = images.map((img, i) => `
      <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
        <img src="${img}" onerror="this.parentElement.style.display='none'">
      </div>`).join('');
    thumbs.querySelectorAll('.gallery-thumb').forEach(t =>
      t.addEventListener('click', () => { idx = parseInt(t.dataset.index); update(); }));
  }
  update();

  const prev = document.querySelector('.gallery-nav-arrow.prev');
  const next = document.querySelector('.gallery-nav-arrow.next');

  if (prev) {
    prev.addEventListener('click', () => {
      idx = (idx - 1 + images.length) % images.length;
      update();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      idx = (idx + 1) % images.length;
      update();
    });
  }
}
/* ============================================
   ✅ PROJECTS PAGE (WORKING VERSION)
============================================ */
/* ============================================
   ✅ PROJECTS PAGE (WORKING VERSION)
============================================ */
function initProjectsPage() {

  const container = document.querySelector('#projectsGrid');
  const tabs = document.querySelector('#projectsTabs');

  console.log("✅ Projects function started");

  if (!container) {
    return;
  }

  const PER_PAGE = 12;
  const TOTAL_PROJECTS = 21;
  const TOTAL_PAGES = Math.ceil(TOTAL_PROJECTS / PER_PAGE);

  let currentPage = 1;

  function renderProjects(page) {

    let html = '';

    const start = (page - 1) * PER_PAGE + 1;
    const end = Math.min(start + PER_PAGE - 1, TOTAL_PROJECTS);

    for (let i = start; i <= end; i++) {
      html += `
        <div class="project-card">
          <img src="images/projects/project${i}.webp"
               alt="Project ${i}"
               loading="lazy">
          <div class="project-card-content">
            <h4>Project ${i}</h4>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  function renderTabs() {

    if (!tabs) return;

    let html = '';

    for (let i = 1; i <= TOTAL_PAGES; i++) {
      html += `
        <button class="${i === currentPage ? 'active' : ''}"
                data-page="${i}">
          ${i}
        </button>
      `;
    }

    tabs.innerHTML = html;

    tabs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        renderProjects(currentPage);
        renderTabs();
      });
    });
  }

  renderProjects(currentPage);
  renderTabs();
}
/* ============================================
   ✅ CONTACT FORM
============================================ */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const msg = encodeURIComponent(`New Inquiry\n\n👤 ${f.get('name')}\n📞 ${f.get('phone')}\n📋 ${f.get('subject')}\n💬 ${f.get('message')}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    const btn = form.querySelector('.form-submit');
    if (btn) { btn.innerHTML = '✓ Message Sent!'; btn.style.background = '#25D366'; }
    form.reset();
  });
}

/* ============================================
   ✅ IMPORTED PAGE
============================================ */
function initImportedPage() {
  const grid = document.querySelector("#importedGrid");
  if (!grid) return;

  const PER_PAGE = 20;
  let currentPage = 1;
  const products = getImportedProducts();
  const pagination = document.querySelector("#importedPagination");
  const count = document.querySelector("#importedCount");

  function render() {
    const totalPages = Math.ceil(products.length / PER_PAGE);
    const start = (currentPage - 1) * PER_PAGE;
    const pageItems = products.slice(start, start + PER_PAGE);

    if (count) count.innerHTML = `Showing <strong>${start + 1}-${Math.min(start + PER_PAGE, products.length)}</strong> of <strong>${products.length}</strong> imported products`;
    grid.innerHTML = pageItems.map(p => createProductCardHTML(p)).join('');

    if (pagination) {
      let html = `<button data-page="${currentPage - 1}" ${currentPage === 1 ? 'class="disabled"' : ''}>‹</button>`;
      for (let i = 1; i <= totalPages; i++) {
        if (i <= 3 || i > totalPages - 2 || Math.abs(i - currentPage) <= 1)
          html += `<button data-page="${i}" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
        else if (Math.abs(i - currentPage) === 2) html += `<span>...</span>`;
      }
      html += `<button data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'class="disabled"' : ''}>›</button>`;
      pagination.innerHTML = html;
      pagination.querySelectorAll('button:not(.disabled)').forEach(b =>
        b.addEventListener('click', () => {
          const p = parseInt(b.dataset.page);
          if (p >= 1 && p <= totalPages) { currentPage = p; render(); window.scrollTo({ top: grid.offsetTop - 100, behavior: 'smooth' }); }
        }));
    }
  }
  render();
}
