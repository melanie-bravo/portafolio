// Scroll reveal — unobserve after trigger to free memory
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Hamburger menu
const hamburger = document.getElementById('nav-hamburger');
const mobileNav = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
});

// ── SEMESTER SECTIONS: dynamic counts ──
function imageExists(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function countImages(basePath) {
  let count = 0;
  for (let i = 1; i <= 20; i++) {
    if (!await imageExists(`${basePath}/${i}.jpg`)) break;
    count++;
  }
  return count;
}

async function initSemSections() {
  // "N proyectos" — count cards in each sem-grid
  document.querySelectorAll('.sem-grid').forEach(grid => {
    const n = grid.querySelectorAll('.sem-card').length;
    const countEl = grid.closest('section')?.querySelector('.section-count');
    if (countEl) countEl.textContent = `${n} proyecto${n !== 1 ? 's' : ''}`;
  });

  // "N fotos" badge — probe actual images on disk
  for (const card of document.querySelectorAll('.sem-card[data-img-base]')) {
    const count = await countImages(card.dataset.imgBase);
    const badge = card.querySelector('.sem-img-count');
    // Cache image array on card for lightbox
    card._lbImages = Array.from({ length: count }, (_, i) => `${card.dataset.imgBase}/${i + 1}.jpg`);
    if (!badge) continue;
    if (count > 1) {
      badge.textContent = `${count} fotos`;
    } else {
      badge.remove();
    }
  }
}

initSemSections();

// ── Lightbox / Carousel ──
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-img');
const lbPrev = lightbox.querySelector('.lb-prev');
const lbNext = lightbox.querySelector('.lb-next');
const lbDots = lightbox.querySelector('.lb-dots');
const lbCloseBtn = lightbox.querySelector('.lb-close');
const lbBackdrop = lightbox.querySelector('.lb-backdrop');
let lbImages = [], lbIndex = 0;

function openLightbox(images, startIndex = 0) {
  lbImages = images;
  lbIndex = startIndex;
  renderLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lbCloseBtn.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function renderLightbox() {
  lbImg.classList.remove('loaded');
  lbImg.src = lbImages[lbIndex];
  lbImg.onload = () => lbImg.classList.add('loaded');
  lbImg.onerror = () => lbImg.classList.add('loaded');

  const single = lbImages.length === 1;
  lbPrev.hidden = single;
  lbNext.hidden = single;
  lbPrev.disabled = lbIndex === 0;
  lbNext.disabled = lbIndex === lbImages.length - 1;

  lbDots.innerHTML = '';
  if (!single) {
    lbImages.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'lb-dot' + (i === lbIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => { lbIndex = i; renderLightbox(); });
      lbDots.appendChild(dot);
    });
  }
}

lbPrev.addEventListener('click', () => {
  if (lbIndex > 0) { lbIndex--; renderLightbox(); }
});
lbNext.addEventListener('click', () => {
  if (lbIndex < lbImages.length - 1) { lbIndex++; renderLightbox(); }
});
lbCloseBtn.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft' && lbIndex > 0) { lbIndex--; renderLightbox(); }
  if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) { lbIndex++; renderLightbox(); }
});

// Attach click handlers to semester cards
document.querySelectorAll('.sem-card[data-img-base]').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    const images = card._lbImages;
    if (!images || !images.length) return;
    openLightbox(images);
  });
});

// Pikmin easter egg
const pikminTrigger = document.getElementById('pikmin-trigger');
const pikminFloat = document.getElementById('pikmin-float');

pikminTrigger.addEventListener('click', () => {
  const visible = pikminFloat.classList.toggle('visible');
  pikminTrigger.style.color = visible ? 'rgba(91,184,232,0.7)' : 'rgba(255,255,255,0.18)';
});
