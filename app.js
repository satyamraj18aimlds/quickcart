// ============================================================
//  QuickCart — Main Application
//  Pure Vanilla JS, single-page with view routing
// ============================================================

// ── Mock Data (inlined so no ES module issues with file://) ──
const PRODUCTS = [
  { id:1, category:"Fruits & Vegetables", name:"Fresh Tomatoes", emoji:"🍅", weight:"500g", price:40, mrp:55 },
  { id:2, category:"Fruits & Vegetables", name:"Onions", emoji:"🧅", weight:"1 kg", price:35, mrp:45 },
  { id:3, category:"Fruits & Vegetables", name:"Baby Spinach", emoji:"🥬", weight:"200g", price:29, mrp:40 },
  { id:4, category:"Fruits & Vegetables", name:"Alphonso Mangoes", emoji:"🥭", weight:"6 pcs", price:149, mrp:180 },
  { id:5, category:"Fruits & Vegetables", name:"Green Capsicum", emoji:"🫑", weight:"250g", price:25, mrp:35 },
  { id:6, category:"Fruits & Vegetables", name:"Bananas", emoji:"🍌", weight:"6 pcs", price:39, mrp:50 },
  { id:7, category:"Dairy & Eggs", name:"Amul Full Cream Milk", emoji:"🥛", weight:"1 L", price:68, mrp:72 },
  { id:8, category:"Dairy & Eggs", name:"Farm Fresh Eggs", emoji:"🥚", weight:"12 pcs", price:89, mrp:99 },
  { id:9, category:"Dairy & Eggs", name:"Amul Butter", emoji:"🧈", weight:"100g", price:55, mrp:60 },
  { id:10, category:"Dairy & Eggs", name:"Mother Dairy Curd", emoji:"🫙", weight:"400g", price:45, mrp:50 },
  { id:11, category:"Dairy & Eggs", name:"Amul Paneer", emoji:"🧀", weight:"200g", price:85, mrp:95 },
  { id:12, category:"Dairy & Eggs", name:"Go Cheese Slices", emoji:"🫕", weight:"200g", price:99, mrp:120 },
  { id:13, category:"Snacks", name:"Lay's Classic Salted", emoji:"🥔", weight:"73g", price:20, mrp:20 },
  { id:14, category:"Snacks", name:"Maggi Noodles", emoji:"🍜", weight:"4×70g", price:56, mrp:64 },
  { id:15, category:"Snacks", name:"Parle-G Biscuits", emoji:"🍪", weight:"800g", price:65, mrp:70 },
  { id:16, category:"Snacks", name:"Kurkure Masala Munch", emoji:"🌽", weight:"90g", price:20, mrp:20 },
  { id:17, category:"Snacks", name:"Bingo Mad Angles", emoji:"🔷", weight:"130g", price:30, mrp:35 },
  { id:18, category:"Snacks", name:"Haldiram's Bhujia Sev", emoji:"🫘", weight:"200g", price:69, mrp:80 },
  { id:19, category:"Beverages", name:"Coca-Cola", emoji:"🥤", weight:"750ml", price:45, mrp:50 },
  { id:20, category:"Beverages", name:"Tropicana Orange Juice", emoji:"🍊", weight:"1 L", price:99, mrp:120 },
  { id:21, category:"Beverages", name:"Bisleri Mineral Water", emoji:"💧", weight:"1 L", price:20, mrp:20 },
  { id:22, category:"Beverages", name:"Red Bull Energy Drink", emoji:"⚡", weight:"250ml", price:115, mrp:125 },
  { id:23, category:"Beverages", name:"Tata Tea Premium", emoji:"☕", weight:"250g", price:105, mrp:120 },
  { id:24, category:"Personal Care", name:"Dove Moisturising Soap", emoji:"🧼", weight:"100g", price:49, mrp:58 },
  { id:25, category:"Personal Care", name:"Head & Shoulders Shampoo", emoji:"🧴", weight:"340ml", price:349, mrp:399 },
  { id:26, category:"Personal Care", name:"Colgate MaxFresh", emoji:"🦷", weight:"150g", price:99, mrp:110 },
  { id:27, category:"Personal Care", name:"Dettol Hand Sanitizer", emoji:"🤲", weight:"200ml", price:89, mrp:105 },
  { id:28, category:"Personal Care", name:"Vaseline Body Lotion", emoji:"🫧", weight:"400ml", price:189, mrp:225 },
];

const CATEGORIES = [
  { id:"all", label:"All", emoji:"🛒" },
  { id:"Fruits & Vegetables", label:"Fruits & Veggies", emoji:"🥦" },
  { id:"Dairy & Eggs", label:"Dairy & Eggs", emoji:"🥛" },
  { id:"Snacks", label:"Snacks", emoji:"🍿" },
  { id:"Beverages", label:"Beverages", emoji:"🥤" },
  { id:"Personal Care", label:"Personal Care", emoji:"✨" },
];

const BANNERS = [
  { bg:"linear-gradient(135deg,#FFD700,#FF6B00)", emoji:"🥭", title:"Fresh Mangoes", subtitle:"Farm-fresh Alphonso • Starting ₹149", tag:"Summer Special" },
  { bg:"linear-gradient(135deg,#00C851,#007E33)", emoji:"🥬", title:"Organic Veggies", subtitle:"No pesticides • Delivered fresh", tag:"Healthy Choice" },
  { bg:"linear-gradient(135deg,#4A90E2,#7B2FF7)", emoji:"⚡", title:"10-Min Delivery", subtitle:"Order now — delivered before you blink", tag:"QuickCart Promise" },
  { bg:"linear-gradient(135deg,#FF416C,#FF4B2B)", emoji:"🎁", title:"Weekend Sale", subtitle:"Up to 30% off on selected items", tag:"Offer of the Week" },
];

const ADDRESSES = [
  { icon:"🏠", label:"Home", detail:"42, Indira Nagar, 3rd Cross, Bengaluru – 560038" },
  { icon:"💼", label:"Office", detail:"WeWork Galaxy, Residency Rd, Bengaluru – 560025" },
  { icon:"➕", label:"Add New Address", detail:"Tap to add a new delivery location" },
];

const PAYMENT_METHODS = [
  { icon:"💵", label:"Cash on Delivery", sublabel:"Pay when your order arrives" },
  { icon:"📱", label:"UPI / PhonePe / GPay", sublabel:"Instant payment via UPI" },
  { icon:"💳", label:"Credit / Debit Card", sublabel:"Visa, Mastercard, RuPay accepted" },
];

// ── State ──
const state = {
  cart: JSON.parse(localStorage.getItem('qc_cart') || '{}'),
  currentView: 'home',
  searchQuery: '',
  selectedCategory: 'all',
  selectedBanner: 0,
  selectedAddress: 0,
  selectedPayment: 0,
  orderTimer: null,
  orderTimerSeconds: 600,
  orderSteps: [],
  orderId: '',
};

function saveCart() {
  localStorage.setItem('qc_cart', JSON.stringify(state.cart));
}

// ── Cart Helpers ──
function getCartCount() {
  return Object.values(state.cart).reduce((s, q) => s + q, 0);
}
function getCartTotal() {
  return Object.entries(state.cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === +id);
    return p ? s + p.price * qty : s;
  }, 0);
}
function getMRP() {
  return Object.entries(state.cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === +id);
    return p ? s + p.mrp * qty : s;
  }, 0);
}
function cartItemCount() { return Object.keys(state.cart).filter(k => state.cart[k] > 0).length; }

// ── Navigate ──
function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + view);
  if (el) { el.classList.add('active'); }
  state.currentView = view;
  if (view === 'home') renderHome();
  if (view === 'cart') renderCart();
  if (view === 'checkout') renderCheckout();
  if (view === 'tracking') renderTracking();
  updateCartBar();
  window.scrollTo(0, 0);
}

// ── Root Render ──
function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeaderHTML()}
    <div id="view-home" class="view active">${renderHomeHTML()}</div>
    <div id="view-cart" class="view"></div>
    <div id="view-checkout" class="view"></div>
    <div id="view-tracking" class="view"></div>
    ${renderCartBarHTML()}
  `;
  attachHeaderEvents();
  attachHomeEvents();
  updateCartBar();
  startBannerAutoplay();
}

// ══════════════════════════════════════
//  HEADER
// ══════════════════════════════════════
function renderHeaderHTML() {
  return `
  <header class="header" id="main-header">
    <div class="header-top">
      <div class="header-brand">Quick<span>Cart</span></div>
      <div class="delivery-badge">
        <span class="lightning">⚡</span>
        <div class="delivery-badge-text">
          <div class="delivery-badge-title">Delivery in 10 mins</div>
          <div class="delivery-badge-address">42, Indira Nagar, Bengaluru</div>
        </div>
      </div>
      <div class="header-avatar">S</div>
    </div>
    <div class="search-bar" id="search-bar">
      <span class="search-icon">🔍</span>
      <input class="search-input" id="search-input" type="search" placeholder="Search for groceries, snacks..." autocomplete="off" />
      <button class="search-clear hidden" id="search-clear">✕</button>
    </div>
  </header>`;
}

function attachHeaderEvents() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!input) return;
  input.addEventListener('input', e => {
    state.searchQuery = e.target.value;
    clearBtn.classList.toggle('hidden', !state.searchQuery);
    renderProductGrid();
  });
  clearBtn.addEventListener('click', () => {
    state.searchQuery = '';
    input.value = '';
    clearBtn.classList.add('hidden');
    renderProductGrid();
  });
}

// ══════════════════════════════════════
//  HOME
// ══════════════════════════════════════
function renderHomeHTML() {
  return `
    <div id="home-content">
      ${renderCategoriesHTML()}
      ${renderBannersHTML()}
      <div id="products-section">
        ${renderProductsSectionHTML()}
      </div>
      <div class="home-cart-spacer"></div>
    </div>`;
}

function renderHome() {
  const el = document.getElementById('home-content');
  if (el) {
    el.innerHTML = `
      ${renderCategoriesHTML()}
      ${renderBannersHTML()}
      <div id="products-section">
        ${renderProductsSectionHTML()}
      </div>
      <div class="home-cart-spacer"></div>`;
    attachHomeEvents();
    startBannerAutoplay();
  }
}

function attachHomeEvents() {
  // Category chips
  document.querySelectorAll('.category-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      state.selectedCategory = chip.dataset.cat;
      document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderProductGrid();
    });
  });
  // Product Add/Qty buttons (delegated)
  const grid = document.getElementById('product-grid');
  if (grid) {
    grid.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const id = +btn.dataset.id;
      const action = btn.dataset.action;
      if (action === 'add') {
        state.cart[id] = 1;
      } else if (action === 'inc') {
        state.cart[id] = Math.min((state.cart[id] || 0) + 1, 20);
      } else if (action === 'dec') {
        state.cart[id] = (state.cart[id] || 1) - 1;
        if (state.cart[id] <= 0) delete state.cart[id];
      }
      saveCart();
      updateProductCard(id);
      updateCartBar();
    });
  }
  // Banner dots
  document.querySelectorAll('.banner-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToBanner(i));
  });
}

// ── Categories ──
function renderCategoriesHTML() {
  return `<div class="categories-section">
    <div class="categories-scroll">
      ${CATEGORIES.map(c => `
        <button class="category-chip${state.selectedCategory === c.id ? ' active' : ''}" data-cat="${c.id}">
          <span class="chip-emoji">${c.emoji}</span>
          <span class="chip-label">${c.label}</span>
        </button>`).join('')}
    </div>
  </div>`;
}

// ── Banners ──
function renderBannersHTML() {
  return `<div class="banners-section">
    <div class="banners-track-wrapper">
      <div class="banners-track" id="banners-track">
        ${BANNERS.map((b, i) => `
          <div class="banner-card" style="background:${b.bg}" data-banner="${i}">
            <div class="banner-content">
              <div class="banner-tag">${b.tag}</div>
              <div class="banner-title">${b.title}</div>
              <div class="banner-subtitle">${b.subtitle}</div>
            </div>
            <div class="banner-emoji">${b.emoji}</div>
          </div>`).join('')}
      </div>
    </div>
    <div class="banner-dots" id="banner-dots">
      ${BANNERS.map((_, i) => `<div class="banner-dot${i === 0 ? ' active' : ''}" data-dot="${i}"></div>`).join('')}
    </div>
  </div>`;
}

let bannerInterval = null;
function startBannerAutoplay() {
  if (bannerInterval) clearInterval(bannerInterval);
  bannerInterval = setInterval(() => {
    const next = (state.selectedBanner + 1) % BANNERS.length;
    scrollToBanner(next);
  }, 3200);

  const track = document.getElementById('banners-track');
  if (track) {
    track.addEventListener('scroll', () => {
      const idx = Math.round(track.scrollLeft / track.offsetWidth);
      if (idx !== state.selectedBanner) updateBannerDots(idx);
    }, { passive: true });
  }
}

function scrollToBanner(idx) {
  const track = document.getElementById('banners-track');
  if (!track) return;
  const cards = track.querySelectorAll('.banner-card');
  if (cards[idx]) {
    cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  updateBannerDots(idx);
}

function updateBannerDots(idx) {
  state.selectedBanner = idx;
  document.querySelectorAll('.banner-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ── Products ──
function renderProductsSectionHTML() {
  const filtered = getFilteredProducts();
  const cat = CATEGORIES.find(c => c.id === state.selectedCategory);
  const title = state.searchQuery
    ? `Results for "${state.searchQuery}"`
    : (cat?.id === 'all' ? '🛍️ All Products' : `${cat?.emoji} ${cat?.label}`);
  return `
    <div class="section-title">${title}</div>
    ${filtered.length ? `<div class="product-count">${filtered.length} item${filtered.length !== 1 ? 's' : ''}</div>` : ''}
    <div id="product-grid" class="product-grid">
      ${filtered.map(p => renderProductCardHTML(p)).join('') || renderEmptyHTML()}
    </div>`;
}

function getFilteredProducts() {
  let prods = PRODUCTS;
  if (state.selectedCategory !== 'all') {
    prods = prods.filter(p => p.category === state.selectedCategory);
  }
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  return prods;
}

function renderEmptyHTML() {
  return `<div class="empty-state" style="grid-column:1/-1">
    <div class="empty-emoji">🔍</div>
    <div class="empty-title">No products found</div>
    <div class="empty-subtitle">Try a different search or category</div>
  </div>`;
}

function renderProductCardHTML(p) {
  const qty = state.cart[p.id] || 0;
  const discount = p.mrp > p.price ? Math.round((p.mrp - p.price) / p.mrp * 100) : 0;
  return `
  <div class="product-card" id="product-card-${p.id}">
    <div class="product-emoji-wrap">
      ${discount ? `<span class="product-discount-badge">${discount}% OFF</span>` : ''}
      <span style="font-size:58px;line-height:1">${p.emoji}</span>
    </div>
    <div class="product-info">
      <div class="product-name">${p.name}</div>
      <div class="product-weight">${p.weight}</div>
      <div class="product-price-row">
        <span class="product-price">₹${p.price}</span>
        ${p.mrp > p.price ? `<span class="product-mrp">₹${p.mrp}</span>` : ''}
      </div>
      ${qty === 0
        ? `<button class="btn-add" data-action="add" data-id="${p.id}">+ Add</button>`
        : `<div class="qty-stepper">
            <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
            <span class="qty-count">${qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
           </div>`}
    </div>
  </div>`;
}

function updateProductCard(id) {
  const card = document.getElementById('product-card-' + id);
  if (!card) return;
  const p = PRODUCTS.find(p => p.id === id);
  if (!p) return;
  // Only update the button/stepper portion inside .product-info
  const info = card.querySelector('.product-info');
  if (!info) return;
  const qty = state.cart[id] || 0;
  // Remove existing add btn or stepper
  const existing = info.querySelector('.btn-add, .qty-stepper');
  if (existing) existing.remove();
  const frag = document.createElement('div');
  frag.innerHTML = qty === 0
    ? `<button class="btn-add" data-action="add" data-id="${id}">+ Add</button>`
    : `<div class="qty-stepper">
        <button class="qty-btn" data-action="dec" data-id="${id}">−</button>
        <span class="qty-count">${qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${id}">+</button>
       </div>`;
  info.appendChild(frag.firstElementChild);
}

function renderProductGrid() {
  const section = document.getElementById('products-section');
  if (section) {
    section.innerHTML = renderProductsSectionHTML();
    // Re-attach grid event (already delegated to #product-grid which is re-rendered)
    const grid = document.getElementById('product-grid');
    if (grid) {
      grid.addEventListener('click', e => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const id = +btn.dataset.id;
        const action = btn.dataset.action;
        if (action === 'add') {
          state.cart[id] = 1;
        } else if (action === 'inc') {
          state.cart[id] = Math.min((state.cart[id] || 0) + 1, 20);
        } else if (action === 'dec') {
          state.cart[id] = (state.cart[id] || 1) - 1;
          if (state.cart[id] <= 0) delete state.cart[id];
        }
        saveCart();
        updateProductCard(id);
        updateCartBar();
      });
    }
  }
}

// ══════════════════════════════════════
//  CART BAR
// ══════════════════════════════════════
function renderCartBarHTML() {
  return `<div class="cart-bar" id="cart-bar">
    <div class="cart-bar-inner">
      <div class="cart-bar-left">
        <span class="cart-bar-icon">🛒</span>
        <div>
          <div class="cart-bar-count" id="cb-count"></div>
          <div class="cart-bar-price" id="cb-price"></div>
        </div>
      </div>
      <button class="cart-bar-btn" id="cb-btn">
        View Cart <span>→</span>
      </button>
    </div>
  </div>`;
}

function updateCartBar() {
  const bar = document.getElementById('cart-bar');
  if (!bar) return;
  const count = getCartCount();
  const total = getCartTotal();
  const visible = count > 0;
  bar.classList.toggle('visible', visible);
  document.getElementById('cb-count').textContent = `${count} item${count !== 1 ? 's' : ''}`;
  document.getElementById('cb-price').textContent = `₹${total}`;
  const btn = document.getElementById('cb-btn');
  if (btn && !btn._bound) {
    btn._bound = true;
    btn.addEventListener('click', () => navigate('cart'));
  }
}

// ══════════════════════════════════════
//  CART PAGE
// ══════════════════════════════════════
function renderCart() {
  const view = document.getElementById('view-cart');
  const cartItems = Object.entries(state.cart).filter(([,q]) => q > 0).map(([id, qty]) => ({
    product: PRODUCTS.find(p => p.id === +id),
    qty
  })).filter(i => i.product);

  const itemTotal = getCartTotal();
  const mrpTotal = getMRP();
  const savings = mrpTotal - itemTotal;
  const deliveryFee = itemTotal >= 200 ? 0 : 25;
  const handlingFee = 5;
  const grandTotal = itemTotal + deliveryFee + handlingFee;

  if (cartItems.length === 0) {
    view.innerHTML = `
      <div class="page-header">
        <button class="btn-back" id="cart-back">←</button>
        <span class="page-title">My Cart</span>
      </div>
      <div class="empty-state" style="margin-top:60px">
        <div class="empty-emoji">🛒</div>
        <div class="empty-title">Your cart is empty</div>
        <div class="empty-subtitle">Add items to get started</div>
      </div>`;
    document.getElementById('cart-back').addEventListener('click', () => navigate('home'));
    return;
  }

  view.innerHTML = `
    <div class="page-header">
      <button class="btn-back" id="cart-back">←</button>
      <span class="page-title">My Cart</span>
      <span style="font-size:13px;color:var(--text-muted)">${cartItemCount()} items</span>
    </div>

    <div class="delivery-info-bar">
      <span class="delivery-info-icon">⚡</span>
      <span class="delivery-info-text">Delivery in 10 minutes to Indira Nagar, Bengaluru</span>
    </div>

    <div class="cart-items-section" id="cart-items-list">
      ${cartItems.map(({product:p, qty}) => `
        <div class="cart-item" id="ci-${p.id}">
          <span class="cart-item-emoji">${p.emoji}</span>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-weight">${p.weight}</div>
            <div class="cart-item-price">₹${p.price * qty}</div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-stepper-sm">
              <button class="qty-btn-sm" data-caction="dec" data-cid="${p.id}">−</button>
              <span class="qty-count-sm" id="cqty-${p.id}">${qty}</span>
              <button class="qty-btn-sm" data-caction="inc" data-cid="${p.id}">+</button>
            </div>
          </div>
        </div>`).join('')}
    </div>

    <div class="bill-section">
      <div class="bill-title">💰 Bill Summary</div>
      <div class="bill-row"><span>Item Total</span><span>₹${mrpTotal}</span></div>
      ${savings > 0 ? `<div class="bill-row discount"><span>✅ Discount</span><span>−₹${savings}</span></div>` : ''}
      <div class="bill-row"><span>Delivery Fee</span><span>${deliveryFee === 0 ? '<span style="color:var(--brand-green-dark);font-weight:600">FREE</span>' : '₹' + deliveryFee}</span></div>
      <div class="bill-row"><span>Platform Handling Fee</span><span>₹${handlingFee}</span></div>
      <hr class="bill-divider"/>
      <div class="bill-row total"><span>Grand Total</span><span>₹${grandTotal}</span></div>
      ${savings > 0 ? `<div class="bill-savings">🎉 You're saving ₹${savings} on this order!</div>` : ''}
    </div>

    <div class="checkout-btn-wrap">
      <button class="btn-primary" id="proceed-checkout">Proceed to Checkout →</button>
    </div>
    <div style="height:20px"></div>
  `;

  document.getElementById('cart-back').addEventListener('click', () => navigate('home'));
  document.getElementById('proceed-checkout').addEventListener('click', () => navigate('checkout'));

  // Cart qty controls (delegated)
  document.getElementById('cart-items-list').addEventListener('click', e => {
    const btn = e.target.closest('[data-caction]');
    if (!btn) return;
    const id = +btn.dataset.cid;
    const action = btn.dataset.caction;
    if (action === 'inc') {
      state.cart[id] = Math.min((state.cart[id] || 0) + 1, 20);
    } else if (action === 'dec') {
      state.cart[id] = (state.cart[id] || 1) - 1;
      if (state.cart[id] <= 0) {
        delete state.cart[id];
        saveCart();
        renderCart(); // re-render fully when item removed
        updateCartBar();
        return;
      }
    }
    saveCart();
    // Update UI optimistically
    const qtyEl = document.getElementById('cqty-' + id);
    const priceEl = document.querySelector(`#ci-${id} .cart-item-price`);
    if (qtyEl) qtyEl.textContent = state.cart[id];
    const p = PRODUCTS.find(p => p.id === id);
    if (priceEl && p) priceEl.textContent = '₹' + (p.price * state.cart[id]);
    updateCartBar();
  });
}

// ══════════════════════════════════════
//  CHECKOUT
// ══════════════════════════════════════
function renderCheckout() {
  const view = document.getElementById('view-checkout');
  const itemTotal = getCartTotal();
  const mrpTotal = getMRP();
  const savings = mrpTotal - itemTotal;
  const deliveryFee = itemTotal >= 200 ? 0 : 25;
  const handlingFee = 5;
  const grandTotal = itemTotal + deliveryFee + handlingFee;

  view.innerHTML = `
    <div class="page-header">
      <button class="btn-back" id="checkout-back">←</button>
      <span class="page-title">Checkout</span>
    </div>

    <!-- Delivery Address -->
    <div class="checkout-section">
      <div class="checkout-section-title">📍 Delivery Address</div>
      ${ADDRESSES.map((a, i) => `
        <div class="address-option${state.selectedAddress === i ? ' selected' : ''}" data-addr="${i}">
          <div class="address-radio">
            <div class="address-radio-dot"></div>
          </div>
          <span class="address-icon">${a.icon}</span>
          <div class="address-content">
            <div class="address-label">${a.label}</div>
            <div class="address-detail">${a.detail}</div>
          </div>
        </div>`).join('')}
    </div>

    <!-- Payment Method -->
    <div class="checkout-section">
      <div class="checkout-section-title">💳 Payment Method</div>
      ${PAYMENT_METHODS.map((m, i) => `
        <div class="payment-option${state.selectedPayment === i ? ' selected' : ''}" data-pay="${i}">
          <div class="address-radio">
            <div class="address-radio-dot"></div>
          </div>
          <span class="payment-icon">${m.icon}</span>
          <div style="flex:1">
            <div class="payment-label">${m.label}</div>
            <div class="payment-sublabel">${m.sublabel}</div>
          </div>
        </div>`).join('')}
    </div>

    <!-- Order Summary -->
    <div class="checkout-summary">
      <div style="font-size:14px;font-weight:700;margin-bottom:10px">📋 Order Summary</div>
      <div class="checkout-summary-row"><span>${cartItemCount()} items</span><span>₹${mrpTotal}</span></div>
      ${savings > 0 ? `<div class="checkout-summary-row" style="color:var(--brand-green-dark)"><span>Discount</span><span>−₹${savings}</span></div>` : ''}
      <div class="checkout-summary-row"><span>Delivery</span><span>${deliveryFee === 0 ? 'FREE' : '₹'+deliveryFee}</span></div>
      <div class="checkout-summary-row"><span>Platform Fee</span><span>₹${handlingFee}</span></div>
      <div class="checkout-summary-total">
        <span>To Pay</span><span>₹${grandTotal}</span>
      </div>
    </div>

    <!-- Place Order -->
    <div class="checkout-btn-wrap">
      <button class="btn-primary" id="place-order-btn">
        🛵 Place Order • ₹${grandTotal}
      </button>
    </div>
    <div style="height:20px"></div>
  `;

  document.getElementById('checkout-back').addEventListener('click', () => navigate('cart'));

  // Address selection
  view.querySelectorAll('.address-option').forEach(opt => {
    opt.addEventListener('click', () => {
      state.selectedAddress = +opt.dataset.addr;
      view.querySelectorAll('.address-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Payment selection
  view.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      state.selectedPayment = +opt.dataset.pay;
      view.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

// ══════════════════════════════════════
//  ORDER PLACEMENT
// ══════════════════════════════════════
function placeOrder() {
  // Animate button
  const btn = document.getElementById('place-order-btn');
  btn.textContent = '⏳ Placing Order...';
  btn.disabled = true;
  setTimeout(() => {
    state.orderId = 'QC' + Date.now().toString().slice(-6);
    state.orderTimerSeconds = 600;
    state.orderSteps = [
      { label: 'Order Placed', emoji: '✅', time: 'Just now', status: 'done' },
      { label: 'Being Packed', emoji: '📦', time: '', status: 'active' },
      { label: 'Out for Delivery', emoji: '🛵', time: '', status: 'pending' },
      { label: 'Delivered', emoji: '🏠', time: '', status: 'pending' },
    ];
    // Clear cart
    state.cart = {};
    saveCart();
    navigate('tracking');
    startOrderTracking();
  }, 1000);
}

// ══════════════════════════════════════
//  ORDER TRACKING
// ══════════════════════════════════════
function renderTracking() {
  const view = document.getElementById('view-tracking');
  const steps = state.orderSteps;
  view.innerHTML = `
    <div class="tracking-hero">
      <div class="tracking-icon">🛵</div>
      <div class="tracking-order-id">Order #${state.orderId}</div>
      <div class="tracking-main-title">Your order is on the way!</div>
      <div class="timer-wrap">
        <div>
          <div class="timer-label">Arriving in</div>
          <div class="timer-display" id="order-timer">10:00</div>
        </div>
      </div>
    </div>

    <!-- Map Placeholder -->
    <div class="map-placeholder">
      <div class="map-bg"></div>
      <div class="map-road-h"></div>
      <div class="map-road-v"></div>
      <div class="delivery-rider" id="delivery-rider">🛵</div>
      <div class="map-destination">📍</div>
    </div>

    <!-- Steps -->
    <div class="steps-section">
      <div class="steps-title">🚦 Order Status</div>
      <div class="steps-list" id="steps-list">
        ${steps.map(s => renderStepHTML(s)).join('')}
      </div>
    </div>

    <div style="padding:0 12px 24px">
      <button class="btn-primary" id="back-to-home-btn">🏠 Back to Home</button>
    </div>
  `;

  document.getElementById('back-to-home-btn').addEventListener('click', () => {
    if (state.orderTimer) clearInterval(state.orderTimer);
    navigate('home');
    // Re-render home fully
    renderHome();
    updateCartBar();
  });
}

function renderStepHTML(s) {
  const isDone = s.status === 'done';
  const isActive = s.status === 'active';
  const cls = isDone ? 'done' : isActive ? 'active' : '';
  return `<div class="step-item ${cls}">
    <div class="step-dot">${isDone ? '✓' : s.emoji}</div>
    <div class="step-content">
      <div class="step-label">${s.label}</div>
      ${s.time ? `<div class="step-time">${s.time}</div>` : ''}
    </div>
  </div>`;
}

function updateStepsList() {
  const list = document.getElementById('steps-list');
  if (list) list.innerHTML = state.orderSteps.map(s => renderStepHTML(s)).join('');
}

function startOrderTracking() {
  if (state.orderTimer) clearInterval(state.orderTimer);

  const STEP_TIMES = [0, 120, 300, 570]; // seconds at which steps activate
  const startTime = Date.now();
  let totalSecs = state.orderTimerSeconds;

  state.orderTimer = setInterval(() => {
    totalSecs--;
    state.orderTimerSeconds = totalSecs;

    // Update timer display
    const timerEl = document.getElementById('order-timer');
    if (timerEl) {
      const m = Math.floor(Math.max(0, totalSecs) / 60).toString().padStart(2, '0');
      const s = (Math.max(0, totalSecs) % 60).toString().padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }

    // Auto-progress steps
    const elapsed = 600 - totalSecs;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (elapsed >= STEP_TIMES[1] && state.orderSteps[1].status !== 'done') {
      state.orderSteps[0].status = 'done';
      state.orderSteps[1].status = 'active';
      state.orderSteps[1].time = now;
      updateStepsList();
    }
    if (elapsed >= STEP_TIMES[2] && state.orderSteps[2].status !== 'done') {
      state.orderSteps[1].status = 'done';
      state.orderSteps[2].status = 'active';
      state.orderSteps[2].time = now;
      updateStepsList();
    }
    if (elapsed >= STEP_TIMES[3] && state.orderSteps[3].status !== 'done') {
      state.orderSteps[2].status = 'done';
      state.orderSteps[3].status = 'active';
      state.orderSteps[3].time = now;
      clearInterval(state.orderTimer);
      state.orderTimer = null;
      updateStepsList();

      // Show delivered state
      const timerWrap = document.querySelector('.timer-wrap');
      if (timerWrap) {
        timerWrap.innerHTML = `<div><div class="timer-label" style="text-align:center">🎉 Delivered!</div><div class="timer-display" style="font-size:24px">All done!</div></div>`;
      }
      const hero = document.querySelector('.tracking-main-title');
      if (hero) hero.textContent = 'Order Delivered! Enjoy 🎉';
      const rider = document.getElementById('delivery-rider');
      if (rider) { rider.style.animation = 'none'; rider.textContent = '🎉'; }
    }

    if (totalSecs <= 0) {
      clearInterval(state.orderTimer);
      state.orderTimer = null;
    }
  }, 1000);
}

// ══════════════════════════════════════
//  BOOT
// ══════════════════════════════════════
renderApp();
