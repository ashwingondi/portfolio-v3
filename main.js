// ================================================
// ASHWIN KUMAR GONDI — PORTFOLIO V2
// White Glassmorphism + Interactive Layer
// ================================================

// ── Spline 3D Hero Background (Parallax & Scale) ──
const heroSpline = document.getElementById('heroSpline');
const splineContainer = document.getElementById('splineContainer');
const resumeFab = document.getElementById('resumeFab');

// Shared scroll state — computed once per frame, consumed by all scroll handlers
let ticking = false;
let lastScrollY = 0;

function onScroll() {
  lastScrollY = window.scrollY;
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(handleScrollFrame);
  }
}

function handleScrollFrame() {
  ticking = false;
  const scrollY = lastScrollY;

  // ── Hero Spline parallax + fade-out ──
  if (heroSpline && splineContainer) {
    const vh = window.innerHeight;
    const totalHeight = document.body.scrollHeight;
    const progress = Math.min(scrollY / (vh * 2.5), 1);

    heroSpline.style.transform = `translateY(${scrollY * 0.25}px) scale(${1 + progress * 0.08})`;

    // Fade out: start fading at ~60% scroll, fully gone by ~85% (before Contact section)
    const fadeStart = totalHeight * 0.55;
    const fadeEnd = totalHeight * 0.80;
    const fadeProgress = Math.max(0, Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1));
    splineContainer.style.opacity = 1 - fadeProgress;

    // Hide pointer events when invisible to avoid blocking clicks
    splineContainer.style.pointerEvents = fadeProgress >= 1 ? 'none' : '';
  }

  // ── Sticky Nav ──
  if (glassNav) {
    glassNav.classList.toggle('scrolled', scrollY > 80);
  }

  // ── Scroll Progress ──
  updateScrollProgress(scrollY);

  // ── Active Section Detection ──
  updateActiveSection();

  // ── Resume FAB visibility ──
  if (resumeFab) {
    const showFab = scrollY > window.innerHeight * 0.7;
    resumeFab.classList.toggle('visible', showFab);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ── Insight Aura (Radial Glow — smaller, brighter) ──
const insightAura = document.getElementById('insightAura');
let mouseX = 0, mouseY = 0;
let auraX = 0, auraY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

function animateAura() {
  auraX += (mouseX - auraX) * 0.15;
  auraY += (mouseY - auraY) * 0.15;

  if (insightAura) {
    insightAura.style.transform = `translate(${auraX - 200}px, ${auraY - 200}px)`;
  }

  requestAnimationFrame(animateAura);
}
animateAura();

// ── Sticky Nav ──
const glassNav = document.getElementById('glassNav');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const navMenuBtn = document.getElementById('navMenuBtn');
const mobileNav = document.getElementById('mobileNav');

navMenuBtn?.addEventListener('click', () => {
  mobileNav?.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('open');
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.hasAttribute('download')) return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Scroll Progress ──
const scrollProgressFill = document.getElementById('scrollProgressFill');
const scrollProgressIndicator = document.getElementById('scrollProgressIndicator');
const scrollPercent = document.getElementById('scrollPercent');

function updateScrollProgress(scrollY) {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
  const percent = Math.round(progress * 100);

  if (scrollProgressFill) scrollProgressFill.style.height = `${progress * 100}%`;
  if (scrollProgressIndicator) scrollProgressIndicator.style.top = `${progress * 100}%`;
  if (scrollPercent) scrollPercent.textContent = `${percent}%`;
}

document.querySelectorAll('.scroll-section-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const sectionId = dot.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Active Section Detection ──
const sections = document.querySelectorAll('.section');
const scrollSectionDots = document.querySelectorAll('.scroll-section-dot');

function updateActiveSection() {
  let currentSection = 'hero';
  const midpoint = window.innerHeight / 2;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= midpoint && rect.bottom > midpoint) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-section') === currentSection);
  });

  scrollSectionDots.forEach(dot => {
    dot.classList.toggle('active', dot.getAttribute('data-section') === currentSection);
  });
}

// ── Scroll Animations (IntersectionObserver) ──
const animateElements = document.querySelectorAll('.animate-on-scroll');

const scrollAnimObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bentoGrid = entry.target.closest('.bento-grid');
      const delay = bentoGrid
        ? Array.from(bentoGrid.children).indexOf(entry.target) * 120
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      scrollAnimObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

animateElements.forEach(el => scrollAnimObserver.observe(el));

// ── Hero Character Animation ──
const heroTitle = document.querySelector('.hero-title[data-animation="chars"]');
if (heroTitle) {
  const text = heroTitle.textContent.trim();
  // Build all spans in a DocumentFragment to minimize reflows
  const frag = document.createDocumentFragment();
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${i * 0.04}s`;
    frag.appendChild(span);
  });
  heroTitle.innerHTML = '';
  heroTitle.appendChild(frag);
}

// ── Typewriter Effect ──
const typewriterEl = document.querySelector('[data-animation="typewriter"]');
if (typewriterEl) {
  const fullText = typewriterEl.textContent.trim();
  typewriterEl.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  typewriterEl.appendChild(cursor);

  let charIndex = 0;
  function typeChar() {
    if (charIndex < fullText.length) {
      typewriterEl.insertBefore(
        document.createTextNode(fullText[charIndex]),
        cursor
      );
      charIndex++;
      setTimeout(typeChar, 50 + Math.random() * 40);
    }
  }

  setTimeout(typeChar, 1200);
}

// ── Modal System ──
const modalOverlay = document.getElementById('modalOverlay');
const modalCard = document.getElementById('modalCard');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalAttachment = document.getElementById('modalAttachment');

// Pre-create SVG icon template for attachment buttons (avoid recreating per-click)
const attachSvgTemplate = (() => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13');
  svg.appendChild(path);
  return svg;
})();

function openModal(contentEl, docsJsonStr) {
  if (!modalOverlay || !modalBody) return;

  // Clone the learn-more-content into the modal
  const clone = contentEl.cloneNode(true);
  clone.classList.add('open');
  clone.style.maxHeight = 'none';
  clone.style.opacity = '1';
  clone.style.marginTop = '0';

  modalBody.innerHTML = '';
  modalBody.appendChild(clone);

  // Handle attachments
  const modalFooter = document.getElementById('modalFooter');
  if (modalFooter) {
    modalFooter.innerHTML = ''; // clear existing attachments
    if (docsJsonStr) {
      try {
        const docs = JSON.parse(docsJsonStr);
        const frag = document.createDocumentFragment();
        docs.forEach(doc => {
          const a = document.createElement('a');
          a.href = doc.url;
          a.className = 'modal-attachment';
          a.target = '_blank';
          a.rel = 'noopener';
          
          a.appendChild(attachSvgTemplate.cloneNode(true));
          
          const span = document.createElement('span');
          span.textContent = doc.label;
          a.appendChild(span);
          
          frag.appendChild(a);
        });
        modalFooter.appendChild(frag);
        modalFooter.style.display = docs.length > 0 ? 'flex' : 'none';
        modalFooter.style.gap = '12px';
        modalFooter.style.flexWrap = 'wrap';
      } catch (e) {
        console.error("Error parsing data-docs", e);
        modalFooter.style.display = 'none';
      }
    } else {
      modalFooter.style.display = 'none';
    }
  }

  // Show
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close handlers
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ── Card Clicks → open modal ──
// Make the entire card clickable, not just the "Learn More" button
document.querySelectorAll('.exp-card, .bento-card').forEach(card => {
  card.style.cursor = 'pointer'; // Visual hint
  card.addEventListener('click', () => {
    const btn = card.querySelector('.learn-more-btn');
    if (!btn) return;
    const targetId = btn.getAttribute('data-target');
    const content = document.getElementById(targetId);
    const docsJsonStr = btn.getAttribute('data-docs') || null;

    if (content) {
      openModal(content, docsJsonStr);
    }
  });
});

// ── Certification Chip Click to Expand ──
// Use event delegation on the cert-grid to ensure the entire card is clickable
document.querySelectorAll('.cert-grid').forEach(grid => {
  grid.addEventListener('click', (e) => {
    const chip = e.target.closest('.cert-chip');
    if (!chip) return;

    // Close all others
    document.querySelectorAll('.cert-chip').forEach(c => {
      if (c !== chip) c.classList.remove('expanded');
    });
    chip.classList.toggle('expanded');
  });
});

// ── Know Me Better - In-Line Expansion ──
document.querySelectorAll('.about-card').forEach(card => {
  const btn = card.querySelector('.view-more-btn');
  const content = card.querySelector('.extra-content');
  const btnText = btn?.querySelector('.btn-text');
  
  if (!btn || !content) return;
  
  btn.addEventListener('click', () => {
    card.classList.toggle('expanded');
    
    // Smoothly animate height using scrollHeight
    if (card.classList.contains('expanded')) {
      content.style.maxHeight = content.scrollHeight + 'px';
      if (btnText) btnText.textContent = 'View Less';
    } else {
      content.style.maxHeight = null;
      if (btnText) btnText.textContent = 'View More';
    }
  });
});

// ── Skill Chip Proximity Glow (ONLY nearest one — throttled) ──
const skillChips = document.querySelectorAll('.skill-chip');
let currentGlowing = null;
let skillGlowTicking = false;
let skillMouseX = 0, skillMouseY = 0;

document.addEventListener('mousemove', (e) => {
  skillMouseX = e.clientX;
  skillMouseY = e.clientY;

  if (!skillGlowTicking) {
    skillGlowTicking = true;
    requestAnimationFrame(updateSkillGlow);
  }
}, { passive: true });

function updateSkillGlow() {
  skillGlowTicking = false;
  let nearestChip = null;
  let nearestDist = Infinity;

  skillChips.forEach(chip => {
    const rect = chip.getBoundingClientRect();
    const chipCenterX = rect.left + rect.width / 2;
    const chipCenterY = rect.top + rect.height / 2;
    const dx = skillMouseX - chipCenterX;
    const dy = skillMouseY - chipCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100 && distance < nearestDist) {
      nearestDist = distance;
      nearestChip = chip;
    }
  });

  // Only update DOM if the glowing chip actually changed
  if (nearestChip !== currentGlowing) {
    if (currentGlowing) currentGlowing.classList.remove('glowing');
    if (nearestChip) nearestChip.classList.add('glowing');
    currentGlowing = nearestChip;
  }
}

// ── Lightweight Glass Card Hover (CSS-only transform, JS shimmer only) ──
// Cache shimmer elements per card to avoid repeated querySelector calls
document.querySelectorAll('.glass-card').forEach(card => {
  const shimmer = card.querySelector('.exp-card-shimmer, .bento-card-shimmer, .cert-chip-shimmer');

  card.addEventListener('mousemove', (e) => {
    if (!shimmer) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    shimmer.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.08), transparent 60%)`;
    shimmer.style.opacity = '1';
  }, { passive: true });

  card.addEventListener('mouseleave', () => {
    if (shimmer) shimmer.style.opacity = '0';
  });
});

// ── Initialize ──
updateScrollProgress(window.scrollY);
updateActiveSection();

// ── Animated Number Counters ──
const statItems = document.querySelectorAll('.stat-item');

function animateCounter(el) {
  const numEl = el.querySelector('.stat-number');
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (!numEl || isNaN(target)) return;

  const duration = 1800; // ms
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const current = Math.round(easedProgress * target);
    numEl.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statItems.forEach(item => counterObserver.observe(item));

// ── Project Card Image Parallax ──
document.querySelectorAll('.bento-card').forEach(card => {
  const img = card.querySelector('.bento-image img');
  if (!img) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `scale(1.08) translate(${-x * 12}px, ${-y * 12}px)`;
  }, { passive: true });

  card.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1) translate(0, 0)';
  });
});

// ── Page Load Animation ──
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
