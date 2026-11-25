/* Sameer Bhatti portfolio – interactions */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  $('#year').textContent = new Date().getFullYear();

  /* Sticky nav + scroll progress */
  const nav = $('#nav');
  const progress = $('#progress');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 20);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = $('#burger');
  const links = $('#navLinks');
  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* Active nav link on scroll */
  const sections = $$('main section[id]');
  const navAnchors = $$('a[href^="#"]', links).filter((a) => !a.classList.contains('btn'));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        navAnchors.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* Reveal on scroll (with small stagger inside grids) */
  $$('.cards, .skills, .pricing, .projects').forEach((grid) => {
    $$('.reveal', grid).forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.08 + 's'));
  });
  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      $$('.bar i[data-w]', el).forEach((b) => { b.style.width = b.dataset.w + '%'; });
      $$('[data-count]', el).forEach(countUp);
      obs.unobserve(el);
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach((el) => reveal.observe(el));

  /* Number counters */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    const dur = 1600;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  // The hero stats live inside a .reveal parent, so countUp is triggered above.

  /* Typing effect */
  const typed = $('#typed');
  const words = ['Web Developer', 'E-commerce Expert', 'Python Developer', 'AI Integrator'];
  if (typed && !reduce) {
    let w = 0, c = 0, del = false;
    const tick = () => {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      let delay = del ? 45 : 90;
      if (!del && c === word.length) { del = true; delay = 1600; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
      c += del ? -1 : 1;
      setTimeout(tick, delay);
    };
    typed.textContent = '';
    tick();
  }

  /* Portfolio filter */
  const chips = $$('.chip');
  const projects = $$('.project');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.toggle('is-active', c === chip));
    const f = chip.dataset.filter;
    projects.forEach((p) => p.classList.toggle('is-hidden', f !== 'all' && p.dataset.cat !== f));
  }));

  /* Pricing buttons preselect the plan in the form */
  const serviceSel = $('#service');
  $$('[data-plan]').forEach((btn) => btn.addEventListener('click', () => {
    const opt = [...serviceSel.options].find((o) => o.text === btn.dataset.plan);
    if (opt) serviceSel.value = opt.value || opt.text;
  }));

  /* Contact form */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const submit = $('#submitBtn');
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  const showErrors = (errs) => {
    $$('.field', form).forEach((f) => f.classList.remove('has-error'));
    $$('.err', form).forEach((e) => { e.textContent = ''; });
    Object.entries(errs).forEach(([k, msg]) => {
      const e = $(`.err[data-for="${k}"]`, form);
      if (e) { e.textContent = msg; e.closest('.field').classList.add('has-error'); }
    });
  };

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const errs = {};
    if ((data.name || '').trim().length < 2) errs.name = 'Please enter your name.';
    if (!emailRe.test((data.email || '').trim())) errs.email = 'Please enter a valid email address.';
    if ((data.message || '').trim().length < 10) errs.message = 'Please write at least 10 characters.';
    showErrors(errs);
    status.className = 'form__status';
    status.textContent = '';
    if (Object.keys(errs).length) return;

    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        status.className = 'form__status ok';
        status.textContent = json.message || 'Message sent!';
        form.reset();
      } else {
        if (json.errors) showErrors(json.errors);
        status.className = 'form__status bad';
        status.textContent = json.message || 'Please check the highlighted fields.';
      }
    } catch (_) {
      status.className = 'form__status bad';
      status.textContent = 'Network error. Please message me on Fiverr instead.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send Message';
    }
  });
})();
