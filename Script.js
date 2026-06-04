// ── CART STATE ──
let cart = [];
let total = 0;
let itemCount = 0;

const WA_NUMBER = '87053174471';
const IG_USER = 'thetasbolat';

// ── ADD TO CART ──
function addToCart(name, price) {
  // Check if already in cart
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
    existing.subtotal += price;
  } else {
    cart.push({ name, price, qty: 1, subtotal: price });
  }

  total += price;
  itemCount++;

  document.getElementById('cartCount').textContent = itemCount;
  document.getElementById('cartTotal').textContent = `= ${total.toLocaleString('ru')} тг.`;
  document.getElementById('cartBar').classList.add('visible');

  showToast(`✅ ${name} добавлен в корзину`);
}

// ── MODAL ──
function openModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('open');

  // Render cart items
  const cartEl = document.getElementById('modalCart');
  const totalEl = document.getElementById('modalTotalText');

  if (cart.length === 0) {
    cartEl.innerHTML = '<div class="modal-cart-empty">Корзина пуста. Добавьте товары из меню!</div>';
    totalEl.textContent = '';
  } else {
    cartEl.innerHTML = cart.map(item =>
      `<div class="modal-cart-item">
        <span>${item.name} × ${item.qty}</span>
        <span>${item.subtotal.toLocaleString('ru')} тг.</span>
      </div>`
    ).join('');
    totalEl.textContent = `Итого: ${total.toLocaleString('ru')} тг.`;
  }

  // Build WhatsApp message
  const message = buildOrderMessage();
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  document.getElementById('waLink').href = waUrl;

  // Instagram link
  document.getElementById('igLink').href = `https://instagram.com/${IG_USER}`;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModal();
  }
}

function buildOrderMessage() {
  if (cart.length === 0) {
    return 'Здравствуйте! Хочу сделать заказ в TokyoDash 🍣';
  }

  let msg = 'Здравствуйте! Хочу сделать заказ в TokyoDash 🍣\n\n';
  msg += '📋 Мой заказ:\n';
  cart.forEach(item => {
    msg += `• ${item.name} × ${item.qty} = ${item.subtotal.toLocaleString('ru')} тг.\n`;
  });
  msg += `\n💰 Итого: ${total.toLocaleString('ru')} тг.`;
  msg += '\n\nПожалуйста, уточните детали доставки!';
  return msg;
}

// ── TOAST ──
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── PROMO SLIDER ──
const promos = [
  {
    title: 'Сделайте заказ на 4000 тг. и получите скидку 10%!',
    desc: 'Скидка распространяется на все меню и действует с 11:00 до 13:00 каждый день.',
    badge: '-10%',
    img: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80'
  },
  {
    title: 'Первый заказ — бесплатная доставка!',
    desc: 'Оформите первый заказ и получите бесплатную доставку по всему Павлодару.',
    badge: '0 тг.',
    img: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=500&q=80'
  },
  {
    title: 'Сет дня со скидкой 20%!',
    desc: 'Каждый день новый сет по специальной цене. Успейте заказать!',
    badge: '-20%',
    img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80'
  }
];

let promoIdx = 0;

function updatePromo() {
  const p = promos[promoIdx];
  document.getElementById('promoTitle').textContent = p.title;
  document.getElementById('promoDesc').textContent = p.desc;
  document.getElementById('promoBadge').textContent = p.badge;
  document.getElementById('promoImg').src = p.img;
}

function nextSlide() {
  promoIdx = (promoIdx + 1) % promos.length;
  updatePromo();
}

function prevSlide() {
  promoIdx = (promoIdx - 1 + promos.length) % promos.length;
  updatePromo();
}

// Auto slide every 5 sec
setInterval(nextSlide, 5000);

// ── SMOOTH SCROLL ──
function smoothScroll(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.08 });
reveals.forEach(el => observer.observe(el));

// ── KEYBOARD CLOSE MODAL ──
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});