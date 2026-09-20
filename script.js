/* ============================================================
   DIVYANSH SHANDIL — PORTFOLIO JAVASCRIPT
   Engineered for Smooth Performance & Zero Errors
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Mark document as JS-loaded for progressive enhancement
  document.documentElement.classList.add('js-loaded');

  /* ====== 1. SCROLL PROGRESS BAR ====== */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        progressBar.style.width = (scrolled / total * 100) + '%';
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ====== 2. NAVBAR SCROLL EFFECT ====== */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const updateNavbar = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  /* ====== 3. HAMBURGER MENU ====== */
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ====== 4. BACK TO TOP BUTTON ====== */
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ====== 5. THEME TOGGLE WITH LOCAL STORAGE ====== */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      themeBtn.textContent = '☀️';
    } else {
      document.body.classList.remove('light-mode');
      themeBtn.textContent = '🌙';
    }

    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeBtn.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }

  /* ====== 6. CUSTOM CURSOR ====== */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  if (cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    const isTouch = () => window.innerWidth < 768 || ('ontouchstart' in window);

    if (!isTouch()) {
      window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }, { passive: true });

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
      };
      animateCursor();

      document.querySelectorAll('a, button, .timeline-card, .info-card, .contact-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)';
          cursorRing.style.borderColor = 'var(--c-cyan)';
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
          cursorRing.style.borderColor = 'rgba(99,102,241,0.5)';
        });
      });
    } else {
      cursorDot.style.display = 'none';
      cursorRing.style.display = 'none';
    }
  }

  /* ====== 7. TYPING ANIMATION ====== */
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const roles = [
      'Software Engineer @ Google USA 🌐',
      'BTech CSE Student · IIT Mandi 🏛️',
      'AI & Deep Learning Builder 🧠',
      'Music Producer · Desi Dhun 🎵',
      'Full-Stack & Cloud Architect ⚡',
      'Digital Architect from Himachal 🏔️'
    ];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeLoop() {
      const current = roles[roleIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex--);
      } else {
        typingEl.textContent = current.substring(0, charIndex++);
      }

      let delay = isDeleting ? 35 : 75;
      if (!isDeleting && charIndex === current.length + 1) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex < 0) {
        isDeleting = false;
        charIndex = 0;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      setTimeout(typeLoop, delay);
    }
    typeLoop();
  }

  /* ====== 8. PARTICLES CANVAS ====== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const particleCount = window.innerWidth < 768 ? 35 : 70;
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '99,102,241' : '34,211,238'
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ====== 9. STATS COUNTER ANIMATION ====== */
  function animateCounter(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';
    const target = parseInt(el.dataset.target) || 0;
    if (target === 0) return;
    let current = 0;
    const duration = 1200;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, stepTime);
  }

  const statElements = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) counterObserver.observe(heroStats);
  } else {
    // Fallback: run immediately
    statElements.forEach(animateCounter);
  }
  // Guarantee stats counter triggers even on instant view
  setTimeout(() => {
    statElements.forEach(el => {
      if (el.textContent === '0') animateCounter(el);
    });
  }, 600);

  /* ====== 10. TIMELINE SCROLL & VISIBILITY ====== */
  const timelineItems = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    timelineItems.forEach(item => {
      timelineObserver.observe(item);
    });
  } else {
    timelineItems.forEach(item => item.classList.add('visible'));
  }

  // Safety fallback: if items are scrolled near or above viewport, mark them visible
  const checkTimelineVisibility = () => {
    const vh = window.innerHeight;
    timelineItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top < vh * 0.95) {
        item.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', checkTimelineVisibility, { passive: true });
  setTimeout(checkTimelineVisibility, 300);

  /* ====== 11. SKILL LEVEL BAR ANIMATION ====== */
  const skillGrids = document.querySelectorAll('.expertise-grid');
  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.level-fill').forEach(bar => {
            const width = bar.style.getPropertyValue('--w') || bar.getAttribute('data-width') || '85%';
            bar.style.width = width;
          });
        }
      });
    }, { threshold: 0.15 });

    skillGrids.forEach(grid => skillObserver.observe(grid));
  } else {
    document.querySelectorAll('.level-fill').forEach(b => {
      b.style.width = b.style.getPropertyValue('--w') || '85%';
    });
  }

  /* ====== 12. SMOOTH CARD REVEAL ON SCROLL ====== */
  const revealCards = document.querySelectorAll('.info-card, .exp-card, .venture-card, .contact-item, .project-card, .ach-card, .learn-card');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealCards.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      revealObserver.observe(el);
    });

    // Check cards in viewport immediately
    setTimeout(() => {
      const vh = window.innerHeight;
      revealCards.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }, 400);
  }

  /* ====== 13. CLICK-TO-COPY CONTACT DETAILS ====== */
  document.querySelectorAll('.contact-item').forEach(item => {
    const valueEl = item.querySelector('.contact-value');
    if (!valueEl) return;
    const hint = document.createElement('span');
    hint.className = 'copy-hint';
    hint.textContent = 'Click to copy';
    item.appendChild(hint);

    item.addEventListener('click', (e) => {
      // Don't hijack direct links inside contact-value
      if (e.target.tagName === 'A') return;
      const text = valueEl.textContent.trim();
      navigator.clipboard.writeText(text).then(() => {
        hint.textContent = '✓ Copied!';
        item.classList.add('copied');
        setTimeout(() => {
          hint.textContent = 'Click to copy';
          item.classList.remove('copied');
        }, 2000);
      }).catch(() => {});
    });
  });
});

/* ====== 14. CONTACT FORM SUBMISSION ====== */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  if (btn && success) {
    btn.textContent = 'Sending Message...';
    btn.disabled = true;
    setTimeout(() => {
      btn.style.display = 'none';
      success.style.display = 'block';
      e.target.reset();
    }, 1200);
  }
}
