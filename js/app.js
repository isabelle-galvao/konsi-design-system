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
