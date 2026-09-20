/* ====== SCROLL PROGRESS BAR ====== */
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrolled = window.scrollY;
  const total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ====== NAVBAR SCROLL ====== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ====== HAMBURGER MENU ====== */
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ====== BACK TO TOP ====== */
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => backBtn.classList.toggle('visible', window.scrollY > 500), { passive: true });
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ====== THEME TOGGLE ====== */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeBtn.textContent = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

/* ====== CUSTOM CURSOR ====== */
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
const isMobile = () => window.innerWidth < 768;
window.addEventListener('mousemove', e => {
  if (isMobile()) return;
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px';
});
function animateCursor() {
  if (!isMobile()) {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)'; cursorRing.style.borderColor = 'var(--c-cyan)'; });
  el.addEventListener('mouseleave', () => { cursorRing.style.transform = 'translate(-50%,-50%) scale(1)'; cursorRing.style.borderColor = 'rgba(99,102,241,0.5)'; });
});

/* ====== TYPING ANIMATION ====== */
const roles = [
  'Software Engineer @ Google USA 🌐',
  'BTech CSE Student · IIT Mandi 🏛️',
  'AI & Deep Learning Builder 🧠',
  'Music Producer · Desi Dhun 🎵',
  'Agentic AI Developer 🤖',
  'Digital Architect from Himachal 🏔️'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');
function typeLoop() {
  if (!typingEl) return;
  const current = roles[roleIndex];
  typingEl.textContent = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);
  let delay = isDeleting ? 40 : 80;
  if (!isDeleting && charIndex === current.length + 1) { delay = 2000; isDeleting = true; }
  else if (isDeleting && charIndex < 0) { isDeleting = false; charIndex = 0; roleIndex = (roleIndex + 1) % roles.length; delay = 400; }
  setTimeout(typeLoop, delay);
}
typeLoop();

/* ====== PARTICLES CANVAS ====== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
  vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
  radius: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1,
  color: Math.random() > 0.5 ? '99,102,241' : '34,211,238'
}));
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`; ctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99,102,241,${0.1 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ====== COUNTER ANIMATION ====== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target); let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + target / 40, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 40);
}
new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.stat-number').forEach(animateCounter); } });
}, { threshold: 0.5 }).observe(document.querySelector('.hero-stats'));

/* ====== TIMELINE SCROLL ANIMATION ====== */
const tlObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.15 });
document.querySelectorAll('.timeline-item').forEach(i => tlObs.observe(i));

/* ====== SKILL BAR ANIMATION ====== */
new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.querySelectorAll('.level-fill').forEach(b => { b.style.width = b.style.getPropertyValue('--w'); }); });
}, { threshold: 0.3 }).observe(document.querySelector('.expertise-grid'));

/* ====== SCROLL REVEAL ====== */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }});
}, { threshold: 0.1 });
document.querySelectorAll('.info-card, .exp-card, .venture-card, .contact-item, .project-card, .ach-card, .learn-card').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObs.observe(el);
});

/* ====== COPY TO CLIPBOARD ====== */
document.querySelectorAll('.contact-item').forEach(item => {
  const valueEl = item.querySelector('.contact-value');
  if (!valueEl) return;
  // Add copy hint span
  const hint = document.createElement('span');
  hint.className = 'copy-hint'; hint.textContent = 'Click to copy';
  item.appendChild(hint);
  item.addEventListener('click', () => {
    const text = valueEl.textContent.trim();
    navigator.clipboard.writeText(text).then(() => {
      hint.textContent = '✓ Copied!'; item.classList.add('copied');
      setTimeout(() => { hint.textContent = 'Click to copy'; item.classList.remove('copied'); }, 2000);
    }).catch(() => {});
  });
});

/* ====== FORM SUBMIT ====== */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  btn.textContent = 'Sending...'; btn.disabled = true;
  setTimeout(() => { btn.style.display = 'none'; success.style.display = 'block'; e.target.reset(); }, 1500);
}


/* ====== HAMBURGER MENU ====== */
const hamburger = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ====== PARTICLES CANVAS ====== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '99,102,241' : '34,211,238'
  };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
  });
  // Draw lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(99,102,241,${0.1 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ====== COUNTER ANIMATION ====== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 40);
}

const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
      countersObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) countersObserver.observe(heroStats);

/* ====== TIMELINE SCROLL ANIMATION ====== */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.timeline-item').forEach(item => timelineObserver.observe(item));

/* ====== SKILL BAR ANIMATION ====== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.level-fill').forEach(bar => {
        bar.style.width = bar.style.getPropertyValue('--w');
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.expertise-grid').forEach(el => skillObserver.observe(el));

/* ====== FORM SUBMIT ====== */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = 'none';
    success.style.display = 'block';
    e.target.reset();
  }, 1500);
}

/* ====== SMOOTH REVEAL on SCROLL ====== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card, .exp-card, .venture-card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
