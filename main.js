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

// Pikmin easter egg
const pikminTrigger = document.getElementById('pikmin-trigger');
const pikminFloat = document.getElementById('pikmin-float');

pikminTrigger.addEventListener('click', () => {
  const visible = pikminFloat.classList.toggle('visible');
  pikminTrigger.style.color = visible ? 'rgba(91,184,232,0.7)' : 'rgba(255,255,255,0.18)';
});
