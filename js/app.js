// ============================================================
// KONSI DESIGN SYSTEM — app.js
// Versão 2.0 · 2026
// ============================================================

(function () {
  'use strict';

  // ── Section map: page → top-nav section ─────────────────
  const PAGE_SECTION = {
    'home':                'home',
    'cores':               'fundamentos',
    'tipografia':          'fundamentos',
    'espacamento':         'fundamentos',
    'elevacao':            'fundamentos',
    'tokens':              'fundamentos',
    'comp-botoes':         'componentes',
    'comp-inputs':         'componentes',
    'comp-cards':          'componentes',
    'comp-badges':         'componentes',
    'comp-feedback':       'componentes',
    'acessibilidade':      'componentes',
    'principios':          'componentes',
    'brand-identidade':    'brand',
    'brand-paleta':        'brand',
    'brand-voz':           'brand',
    'conteudo-escrita':    'conteudo',
    'conteudo-microcopy':  'conteudo',
    'recursos-figma':      'recursos',
    'recursos-flutter':    'recursos',
    'recursos-contribuir': 'recursos',
  };

  // ── Navigate to a page ──────────────────────────────────
  function navigate(pageId) {
    // Hide all pages, deactivate nav items
    document.querySelectorAll('.ds-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.ds-nav__item').forEach(n => n.classList.remove('active'));

    const page = document.getElementById('page-' + pageId);
    const nav  = document.querySelector(`[data-page="${pageId}"]`);

    if (page) page.classList.add('active');
    if (nav)  nav.classList.add('active');

    // Update top-nav active state
    const section = PAGE_SECTION[pageId] || 'home';
    activateSection(section, false);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState({ page: pageId }, '', '#' + pageId);

    buildToc(pageId);
  }

  // ── TOC helpers ──────────────────────────────────────────
  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim();
  }

  let tocObserver = null;

  function buildToc(pageId) {
    const tocEl   = document.getElementById('ds-toc');
    const tocList = document.getElementById('ds-toc-list');
    if (!tocEl || !tocList) return;

    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }

    const page = document.getElementById('page-' + pageId);
    if (!page) {
      tocEl.classList.remove('visible');
      document.body.classList.remove('has-toc');
      return;
    }

    const headings = [...page.querySelectorAll('h2')];
    if (headings.length < 3) {
      tocEl.classList.remove('visible');
      document.body.classList.remove('has-toc');
      return;
    }

    tocList.innerHTML = '';
    headings.forEach(h => {
      if (!h.id) h.id = 'toc-' + slugify(h.textContent);
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.className   = 'ds-toc__link';
      a.textContent = h.textContent;
      a.addEventListener('click', e => {
        e.preventDefault();
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => window.scrollBy(0, -90), 150);
      });
      li.appendChild(a);
      tocList.appendChild(li);
    });

    tocEl.classList.add('visible');
    document.body.classList.add('has-toc');

    const links = [...tocList.querySelectorAll('.ds-toc__link')];
    tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          links[headings.indexOf(entry.target)]?.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    headings.forEach(h => tocObserver.observe(h));
  }

  // ── Activate a top-nav section (show/hide sidebar groups) ──
  function activateSection(sectionId, navigateToFirst) {
    // Update top-nav items
    document.querySelectorAll('.ds-topnav__item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    // Keep all sidebar groups always visible
    document.querySelectorAll('.ds-nav__group[data-section]').forEach(group => {
      group.classList.remove('hidden');
    });

    // Navigate to the first page of section if requested
    if (navigateToFirst) {
      const firstPage = Object.keys(PAGE_SECTION).find(k => PAGE_SECTION[k] === sectionId);
      if (firstPage) navigate(firstPage);
    }
  }

  // ── Wire top-nav items ───────────────────────────────────
  document.querySelectorAll('.ds-topnav__item').forEach(item => {
    item.addEventListener('click', () => {
      activateSection(item.dataset.section, true);
    });
  });

  // ── Wire sidebar nav items ───────────────────────────────
  document.querySelectorAll('.ds-nav__item[data-page]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.page));
  });

  // ── Wire home cards and buttons (data-goto) ──────────────
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.goto));
  });

  // ── Handle back/forward ──────────────────────────────────
  window.addEventListener('popstate', e => {
    const id = (e.state && e.state.page) || 'home';
    navigate(id);
  });

  // ── Initial page from hash ───────────────────────────────
  const initial = window.location.hash.replace('#', '') || 'home';
  navigate(initial);

  // ── Copy hex on click ────────────────────────────────────
  document.querySelectorAll('.ds-color-swatch, .ds-color-card').forEach(el => {
    el.addEventListener('click', () => {
      const hex = el.querySelector('.ds-color-swatch__hex, .ds-color-card__hex')?.textContent?.trim();
      if (hex) {
        navigator.clipboard.writeText(hex).then(() => showToast('Copiado: ' + hex));
      }
    });
    el.style.cursor = 'pointer';
    el.title = 'Clique para copiar o hex';
  });

  // ── Toast notification ───────────────────────────────────
  let toastEl = null;
  function showToast(msg) {
    if (toastEl) toastEl.remove();
    toastEl = document.createElement('div');
    toastEl.className = 'ds-toast-notification';
    toastEl.textContent = msg;
    Object.assign(toastEl.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      background: '#04513F', color: '#fff',
      padding: '10px 18px', borderRadius: '8px',
      fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
      fontWeight: '500', zIndex: '9999',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      transform: 'translateY(12px)', opacity: '0',
      transition: 'all 0.25s'
    });
    document.body.appendChild(toastEl);
    requestAnimationFrame(() => {
      toastEl.style.transform = 'translateY(0)';
      toastEl.style.opacity = '1';
    });
    setTimeout(() => {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateY(8px)';
      setTimeout(() => toastEl && toastEl.remove(), 300);
    }, 2000);
  }

  // ── Search ──────────────────────────────────────────────
  const searchBox     = document.getElementById('ds-search-box');
  const searchInput   = document.querySelector('.ds-header__search-input');
  const searchResults = document.getElementById('ds-search-results');

  if (searchInput && searchResults) {
    const SECTION_LABEL = {
      home: 'Início', fundamentos: 'Fundamentos', componentes: 'Componentes',
      brand: 'Brand', conteudo: 'Conteúdo', recursos: 'Recursos',
    };

    const index = [...document.querySelectorAll('.ds-nav__item[data-page]')]
      .filter(el => el.dataset.page !== 'home')
      .map(el => ({
        pageId:       el.dataset.page,
        label:        el.textContent.trim(),
        sectionLabel: SECTION_LABEL[PAGE_SECTION[el.dataset.page]] || '',
      }));

    let focusedIdx = -1;

    function renderResults(items) {
      searchResults.innerHTML = '';
      focusedIdx = -1;
      if (!items.length) { searchResults.hidden = true; return; }
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'ds-search-result';
        div.innerHTML =
          `<span class="ds-search-result__label">${item.label}</span>` +
          `<span class="ds-search-result__section">${item.sectionLabel}</span>`;
        div.addEventListener('mousedown', e => {
          e.preventDefault();
          closeSearch();
          navigate(item.pageId);
        });
        searchResults.appendChild(div);
      });
      searchResults.hidden = false;
    }

    function closeSearch() {
      searchResults.hidden = true;
      searchInput.value = '';
      focusedIdx = -1;
    }

    function setFocus(idx) {
      const items = [...searchResults.querySelectorAll('.ds-search-result')];
      focusedIdx = Math.max(0, Math.min(idx, items.length - 1));
      items.forEach((el, i) => el.classList.toggle('focused', i === focusedIdx));
    }

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.hidden = true; return; }
      renderResults(index.filter(item =>
        item.label.toLowerCase().includes(q) || item.sectionLabel.toLowerCase().includes(q)
      ));
    });

    searchInput.addEventListener('keydown', e => {
      const items = [...searchResults.querySelectorAll('.ds-search-result')];
      if (e.key === 'ArrowDown')  { e.preventDefault(); setFocus(focusedIdx + 1); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setFocus(focusedIdx - 1); }
      else if (e.key === 'Enter' && focusedIdx >= 0) { items[focusedIdx]?.dispatchEvent(new MouseEvent('mousedown')); }
      else if (e.key === 'Escape') { closeSearch(); searchInput.blur(); }
    });

    searchInput.addEventListener('blur', () => setTimeout(closeSearch, 150));
    searchBox.addEventListener('click', () => searchInput.focus());
  }

  // ── Mobile sidebar toggle ────────────────────────────────
  const menuBtn = document.getElementById('menu-toggle');
  const sidebar = document.querySelector('.ds-sidebar');
  if (menuBtn && sidebar) {
    menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

})();
