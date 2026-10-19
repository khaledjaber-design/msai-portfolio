const menuButton = document.querySelector('.nav-toggle');
const menuLinks = document.querySelector('#nav-links');
const mobileMenu = window.matchMedia('(max-width: 900px)');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuLinks.hidden = mobileMenu.matches && !open;
}
function syncMenu() {
  menuButton.hidden = !mobileMenu.matches;
  setMenu(false);
}
menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
menuLinks.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || !mobileMenu.matches) return;
  setMenu(false);
  if (link.hash) {
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  } else {
    menuButton.focus();
  }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileMenu.matches && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});
mobileMenu.addEventListener('change', syncMenu);
syncMenu();

document.querySelectorAll('[data-question]').forEach(button => {
  button.addEventListener('click', () => {
    const input = document.querySelector('#chat-message');
    if (!input || input.disabled) return;
    input.value = button.dataset.question;
    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
});

// Content stays visible when scripts or observers are unavailable.
if ('IntersectionObserver' in window) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reduceMotion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-enter');
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.skill-tile, .card, .split > div, .chat-section, .contact-section').forEach(element => reveal.observe(element));
  }
  const sectionLinks = [...menuLinks.querySelectorAll('a[href^="#"]')];
  const currentSection = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
  sectionLinks.forEach(link => {
    const target = document.querySelector(link.hash);
    if (target) currentSection.observe(target);
  });
}

const motionToggle = document.querySelector('.motion-toggle');
if (motionToggle) motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Resume animation' : 'Pause animation';
});


// The shared motion state pauses the ECG and all AI capability visuals.
const aiToggle = document.querySelector('.ai-motion-toggle');
const motionControls = [motionToggle, aiToggle].filter(Boolean);
function syncMotionControls() {
  const paused = document.body.classList.contains('motion-paused');
  motionControls.forEach(control => {
    control.setAttribute('aria-pressed', String(paused));
    control.textContent = paused ? 'Resume motion' : 'Pause motion';
  });
}
if (aiToggle) aiToggle.addEventListener('click', () => {
  document.body.classList.toggle('motion-paused');
  syncMotionControls();
});
if (motionToggle) motionToggle.addEventListener('click', syncMotionControls);
syncMotionControls();

