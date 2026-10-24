// Qosain Bukhari portfolio: menu, project filters, scroll reveal, copy email.
(function () {
  document.documentElement.classList.add('js');

  // Mobile menu
  const btn = document.querySelector('.menu-btn');
  const nav = document.getElementById('main-nav');
  if (btn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Project filters (projects page)
  const filters = document.getElementById('filters');
  const grid = document.querySelector('[data-projects="all"]');
  if (filters && grid) {
    const cards = [...grid.querySelectorAll('.pcard')];
    const count = document.getElementById('project-count');
    const cats = [...new Set(cards.flatMap((c) => c.dataset.category.split('|')))];
    const show = (cat) => {
      let n = 0;
      cards.forEach((c) => {
        const on = cat === 'All' || c.dataset.category.split('|').includes(cat);
        c.hidden = !on;
        if (on) n++;
      });
      count.textContent = n + (n === 1 ? ' project' : ' projects');
      filters.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    };
    ['All', ...cats].forEach((cat) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.cat = cat;
      b.textContent = cat;
      b.addEventListener('click', () => show(cat));
      filters.appendChild(b);
    });
    filters.hidden = false;
    show('All');
  }

  // Reveal on scroll
  const targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach((t) => t.classList.add('in'));
  }

  // Copy email
  const toast = document.getElementById('toast');
  let timer;
  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', async () => {
      const text = el.dataset.copy;
      let msg = 'Email copied: ' + text;
      try { await navigator.clipboard.writeText(text); } catch { msg = text; }
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 2200);
    });
  });

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
