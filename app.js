/* ============================================================
   CHAUHAN Sporting — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Loader ─────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1500);
  }

  // ── Custom Cursor ───────────────────────────────────────────
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.querySelectorAll('a, button, .bat-card, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        cursor.style.background = 'transparent';
        cursor.style.border = '1px solid var(--gold)';
        follower.style.width = '60px';
        follower.style.height = '60px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--gold)';
        cursor.style.border = 'none';
        follower.style.width = '36px';
        follower.style.height = '36px';
      });
    });
  }

  // ── Scroll Progress Bar ─────────────────────────────────────
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / total) * 100;
      progressBar.style.width = pct + '%';
    });
  }

  // ── Sticky Navbar ───────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // ── Scroll Animations (Intersection Observer) ───────────────
  const animatedEls = document.querySelectorAll('.fade-up, .fade-in');
  if (animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animatedEls.forEach(el => observer.observe(el));
  }

  // ── Ripple Effect ───────────────────────────────────────────
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size/2}px;top:${y - size/2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // ── Counter Animation ───────────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + suffix;
            if (current >= target) clearInterval(timer);
          }, 16);
          cObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObserver.observe(c));
  }

  // ── 3D Tilt Effect on Cards ─────────────────────────────────
  document.querySelectorAll('.bat-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
      card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
    });
  });

  // ── Collection Filters ──────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const batCards = document.querySelectorAll('.bat-card-wrapper');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        batCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = 'none';
            requestAnimationFrame(() => {
              card.style.animation = 'fadeInCard 0.4s ease forwards';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ── Cart System ─────────────────────────────────────────────
  let cartCount = 0;
  const cartCountEl = document.querySelector('.cart-count');
  const cartToast = document.querySelector('.cart-toast');

  window.addToCart = function(name, price) {
    cartCount++;
    if (cartCountEl) cartCountEl.textContent = cartCount;
    if (cartToast) {
      cartToast.querySelector('.toast-msg').textContent = `"${name}" added to cart`;
      cartToast.classList.add('show');
      setTimeout(() => cartToast.classList.remove('show'), 2500);
    }
  };

  // ── Bat Detail Modal ────────────────────────────────────────
  window.openBatModal = function(data) {
    const modalEl = document.getElementById('batModal');
    if (!modalEl) return;
    modalEl.querySelector('.modal-title').textContent = data.name;
    modalEl.querySelector('.modal-bat-img').src = data.img;
    modalEl.querySelector('.modal-price').textContent = '₹' + data.price.toLocaleString('en-IN');
    modalEl.querySelector('.modal-bat-grade').textContent = data.grade;
    modalEl.querySelector('.modal-bat-wood').textContent = data.wood;
    modalEl.querySelector('.modal-bat-weight').textContent = data.weight;
    modalEl.querySelector('.modal-bat-grip').textContent = data.grip;
    modalEl.querySelector('.modal-bat-length').textContent = data.length;
    modalEl.querySelector('.modal-bat-desc').textContent = data.desc;
    modalEl.querySelector('.btn-modal-cart').onclick = () => {
      addToCart(data.name, data.price);
      bootstrap.Modal.getInstance(modalEl).hide();
    };
    new bootstrap.Modal(modalEl).show();
  };

  // ── Contact Form Validation ─────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      this.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('is-invalid');
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          valid = false;
        }
        if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          field.classList.add('is-invalid');
          valid = false;
        }
      });
      if (valid) {
        const btn = this.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span>Sending...</span>';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<span>Send Message</span>';
          showContactSuccess();
          contactForm.reset();
        }, 1800);
      }
    });
  }

  function showContactSuccess() {
    const alert = document.getElementById('contactSuccess');
    if (alert) {
      alert.style.display = 'flex';
      setTimeout(() => alert.style.display = 'none', 4000);
    }
  }

  // ── Login Form ──────────────────────────────────────────────
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      this.querySelectorAll('[required]').forEach(field => {
        field.classList.remove('is-invalid');
        if (!field.value.trim()) { field.classList.add('is-invalid'); valid = false; }
      });
      if (valid) {
        const btn = this.querySelector('[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span>Signing In...</span>';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = '<span>Sign In</span>';
          alert('Welcome back to CHAUHAN Sporting!');
        }, 1500);
      }
    });
  }

  // ── Password Toggle ─────────────────────────────────────────
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.closest('.input-group-glass').querySelector('input');
      const icon = toggle.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
      }
    });
  });

  // ── Active nav link ─────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// CSS for card fade-in
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInCard {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;
document.head.appendChild(style);