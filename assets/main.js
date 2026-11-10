(() => {
  'use strict';
  const root = document.documentElement;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const themeToggle = $('[data-theme-toggle]');
  if (themeToggle) {
    const setTheme = (value) => {
      root.dataset.theme = value;
      try { localStorage.setItem('sm-theme', value); } catch (_) {}
      themeToggle.setAttribute('aria-label', `Switch to ${value === 'dark' ? 'light' : 'dark'} mode`);
      themeToggle.title = themeToggle.getAttribute('aria-label');
    };
    themeToggle.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
    setTheme(root.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }

  const menuToggle = $('[data-menu-toggle]');
  const mobileMenu = $('#mobile-nav');
  if (menuToggle && mobileMenu) {
    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      mobileMenu.hidden = true;
    };
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileMenu.hidden = !open;
    });
    mobileMenu.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  const copyright = $('#copyright-year');
  if (copyright) copyright.textContent = String(new Date().getFullYear());

  // Publication filtering works entirely on pre-rendered HTML—without analytics or network calls.
  const search = $('#pub-search');
  const year = $('#pub-year');
  const type = $('#pub-type');
  const chips = $$('.topic-chip');
  const paperCards = $$('#pub-results .pub-card');
  if (search && year && type) {
    let topic = 'all';
    const applyFilters = () => {
      const query = search.value.trim().toLowerCase();
      const selectedYear = year.value;
      const selectedType = type.value;
      let total = 0;
      paperCards.forEach(card => {
        const visible = (!query || card.dataset.search.includes(query)) &&
          (selectedYear === 'all' || card.dataset.year === selectedYear) &&
          (selectedType === 'all' || card.dataset.type === selectedType) &&
          (topic === 'all' || card.dataset.topic === topic);
        card.hidden = !visible;
        if (visible) total++;
      });
      const count = $('#pub-visible');
      const noResults = $('#no-results');
      if (count) count.textContent = String(total);
      if (noResults) noResults.hidden = total > 0;
    };
    search.addEventListener('input', applyFilters);
    year.addEventListener('change', applyFilters);
    type.addEventListener('change', applyFilters);
    chips.forEach(chip => chip.addEventListener('click', () => {
      topic = chip.dataset.topic || 'all';
      chips.forEach(item => {
        const active = item === chip;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      applyFilters();
    }));
    const reset = $('#reset-filters');
    if (reset) reset.addEventListener('click', () => {
      search.value = ''; year.value = 'all'; type.value = 'all';
      chips.find(chip => chip.dataset.topic === 'all')?.click();
    });
  }

  // Media archive: filter curated external reporting, interviews and institutional items.
  const mediaSearch = $('#media-search');
  const mediaTabs = $$('.media-tab');
  const mediaCards = $$('#media-card-grid .media-card');
  if (mediaSearch && mediaCards.length) {
    let category = 'all';
    const applyMediaFilter = () => {
      const q = mediaSearch.value.trim().toLowerCase();
      let visible = 0;
      mediaCards.forEach(card => {
        const show = (category === 'all' || card.dataset.mediaCategory === category) &&
          (!q || (card.dataset.mediaSearch || '').includes(q));
        card.hidden = !show;
        if (show) visible++;
      });
      const count = $('#media-count');
      if (count) count.textContent = String(visible);
      const empty = $('#media-empty');
      if (empty) empty.hidden = visible !== 0;
    };
    mediaSearch.addEventListener('input', applyMediaFilter);
    mediaTabs.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.mediaFilter || 'all';
      mediaTabs.forEach(tab => {
        const active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      applyMediaFilter();
    }));
  }

  // Only copy text after a direct user interaction. No third-party tracking.
  $$('.copy-button').forEach(button => {
    button.addEventListener('click', async () => {
      const text = button.dataset.copy;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const old = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => { button.textContent = old; }, 1500);
      } catch (_) {
        // Local file previews may not permit clipboard operations.
        button.textContent = 'Open DOI instead';
      }
    });
  });
})();
