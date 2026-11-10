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

  // In-page photo viewer: category chips, search, arrows, keyboard, escape, backdrop.
  const galleryTiles = $$('#gallery-grid .gallery-tile');
  const gallerySearch = $('#gallery-search');
  const galleryFilters = $$('.gallery-filter');
  const galleryDialog = $('#gallery-dialog');
  let currentCategory = 'All';
  let activePhoto = 0;
  let originControl = null;
  if (galleryTiles.length) {
    const shownTiles = () => galleryTiles.filter(item => !item.hidden);
    const filterGallery = () => {
      const q = (gallerySearch?.value || '').toLowerCase().trim();
      let count = 0;
      galleryTiles.forEach(tile => {
        const visible = (currentCategory === 'All' || tile.dataset.galleryCategory === currentCategory) &&
          (!q || (tile.dataset.gallerySearch || '').includes(q));
        tile.hidden = !visible;
        if (visible) count++;
      });
      if ($('#gallery-visible')) $('#gallery-visible').textContent = String(count);
      if ($('#gallery-empty')) $('#gallery-empty').hidden = count > 0;
    };
    gallerySearch?.addEventListener('input', filterGallery);
    galleryFilters.forEach(chip => chip.addEventListener('click', () => {
      currentCategory = chip.dataset.galleryFilter || 'All';
      galleryFilters.forEach(item => {
        const active = item === chip;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      filterGallery();
    }));
    const renderDialogPhoto = () => {
      const visible = shownTiles();
      if (!visible.length) return;
      activePhoto = (activePhoto + visible.length) % visible.length;
      const tile = visible[activePhoto];
      $('#gallery-dialog-image').src = tile.dataset.fullImage;
      $('#gallery-dialog-image').alt = tile.querySelector('img')?.alt || tile.dataset.galleryTitle;
      $('#gallery-dialog-title').textContent = tile.dataset.galleryTitle;
      $('#gallery-dialog-caption').textContent = tile.dataset.galleryCaption;
      $('#gallery-position').textContent = `${activePhoto + 1} / ${visible.length}`;
    };
    galleryTiles.forEach(tile => tile.addEventListener('click', () => {
      originControl = tile;
      activePhoto = shownTiles().indexOf(tile);
      renderDialogPhoto();
      if (typeof galleryDialog?.showModal === 'function') galleryDialog.showModal();
    }));
    $('#gallery-close')?.addEventListener('click', () => galleryDialog?.close());
    $('#gallery-prev')?.addEventListener('click', () => {activePhoto--;renderDialogPhoto();});
    $('#gallery-next')?.addEventListener('click', () => {activePhoto++;renderDialogPhoto();});
    galleryDialog?.addEventListener('close', () => {
      $('#gallery-dialog-image')?.removeAttribute('src');
      originControl?.focus();
    });
    galleryDialog?.addEventListener('click', event => {if (event.target === galleryDialog) galleryDialog.close();});
    galleryDialog?.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') {activePhoto--;renderDialogPhoto();}
      if (event.key === 'ArrowRight') {activePhoto++;renderDialogPhoto();}
    });
  }

  // One-click contact that also works when no desktop email client is configured.
  $$('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
    const email = button.dataset.copyEmail;
    if (!email) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      button.textContent = 'Email copied ✓';
    } catch (_) {
      window.prompt('Copy this email address:', email);
    }
  }));
})();
