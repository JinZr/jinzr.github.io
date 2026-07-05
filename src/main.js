import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/progress/circular-progress.js';
import './styles.css';

const baseUrl = import.meta.env.BASE_URL || './';
const publicUrl = (path) => new URL(`${baseUrl}${path}`, window.location.href).toString();
const googleAnalyticsId = 'G-4SJNNRFW4C';

const galleryItems = [
  { image: 'assets/images/egs/egs1.webp', full: 'assets/images/egs_highres/egs1.webp', title: 'Dalian' },
  { image: 'assets/images/egs/egs2.webp', full: 'assets/images/egs_highres/egs2.webp', title: 'Dalian' },
  { image: 'assets/images/egs/egs3.webp', full: 'assets/images/egs_highres/egs3.webp', title: 'Dalian' },
  { image: 'assets/images/egs/egs4.webp', full: 'assets/images/egs_highres/egs4.webp', title: 'Dalian' },
  { image: 'assets/images/egs/egs5.webp', full: 'assets/images/egs_highres/egs5.webp', title: 'Hong Kong SAR' },
  { image: 'assets/images/egs/egs6.webp', full: 'assets/images/egs_highres/egs6.webp', title: 'Hong Kong SAR' },
  { image: 'assets/images/egs/egs7.webp', full: 'assets/images/egs_highres/egs7.webp', title: 'Hong Kong SAR' },
  { image: 'assets/images/egs/egs8.webp', full: 'assets/images/egs_highres/egs8.webp', title: 'Hong Kong SAR' },
];

const iconCodepoints = {
  auto_stories: 0xeeaf,
  calendar_today: 0xef11,
  place: 0xf2ac,
};

const openExternal = (url) => {
  window.open(url, '_blank', 'noopener');
};

const createIcon = (name) => {
  const icon = document.createElement('md-icon');
  icon.textContent = iconCodepoints[name] ? String.fromCodePoint(iconCodepoints[name]) : name;
  return icon;
};

function setupLinks() {
  document.querySelectorAll('[data-link]').forEach((element) => {
    element.addEventListener('click', () => openExternal(element.dataset.link));
  });

  const menuButton = document.querySelector('#more-menu-button');
  const menu = document.querySelector('#more-menu');
  menuButton?.addEventListener('click', () => {
    menu.open = !menu.open;
  });
}

function setupTopAppBarElevation() {
  const topAppBar = document.querySelector('.top-app-bar');
  if (!topAppBar) return;

  const updateScrolledUnder = () => {
    topAppBar.classList.toggle('scrolled-under', window.scrollY > 0);
  };

  updateScrolledUnder();
  window.addEventListener('scroll', updateScrolledUnder, { passive: true });
}

function setupZoomLock() {
  const blockGesture = (event) => {
    event.preventDefault();
  };

  document.addEventListener('gesturestart', blockGesture, { passive: false });
  document.addEventListener('gesturechange', blockGesture, { passive: false });
  document.addEventListener('gestureend', blockGesture, { passive: false });

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  }, { passive: false });

  window.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (['+', '-', '=', '_', '0'].includes(event.key)) event.preventDefault();
  });
}

function setupAnalytics() {
  let scheduled = false;

  const loadAnalytics = () => {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', googleAnalyticsId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.head.appendChild(script);
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
    } else {
      setTimeout(loadAnalytics, 1500);
    }
  };

  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('visible'), 4000);
}

function setupEmailCopy() {
  const tile = document.querySelector('[data-copy-email]');
  tile?.addEventListener('click', async () => {
    const email = tile.dataset.copyEmail;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Email address copied to clipboard.');
    } catch {
      showToast(email);
    }
  });
}

async function loadJson(path) {
  const response = await fetch(publicUrl(path), { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

function publicationTheme(item) {
  return item.theme || 'Other';
}

function createTextSpan(className, text) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}

function createMetadataChip(iconName, label) {
  const chip = document.createElement('span');
  chip.className = 'metadata-chip';
  chip.append(createIcon(iconName), document.createTextNode(label));
  return chip;
}

function buildPublicationCard(item) {
  const tile = document.createElement('a');
  tile.className = 'content-tile publication-tile';
  tile.href = item.link || '#';
  tile.target = '_blank';
  tile.rel = 'noopener';

  tile.append(createTextSpan('tile-title', item.title || 'Untitled publication'));
  if (item.author) {
    tile.append(createTextSpan('tile-support', item.author));
  }

  if (item.venue || item.year) {
    const metadata = document.createElement('span');
    metadata.className = 'metadata-row';
    if (item.venue) metadata.append(createMetadataChip('auto_stories', item.venue));
    if (item.year) metadata.append(createMetadataChip('calendar_today', item.year));
    tile.append(metadata);
  }

  return tile;
}

function renderPublications(items, selectedTheme) {
  const list = document.querySelector('#publication-list');
  const filtered = items.filter((item) => publicationTheme(item) === selectedTheme);

  list.replaceChildren(...filtered.map(buildPublicationCard));
}

function renderPublicationFilters(items) {
  const filters = document.querySelector('#publication-filters');
  const themes = [...new Set(items.map(publicationTheme))];
  let selectedTheme = themes[0];

  const themeControl = document.createElement('md-outlined-segmented-button-set');
  themeControl.className = 'theme-segmented-button-set';

  const buttons = themes.map((theme) => {
    const button = document.createElement('md-outlined-segmented-button');
    button.setAttribute('label', theme);
    button.toggleAttribute('selected', theme === selectedTheme);
    return button;
  });

  themeControl.addEventListener('segmented-button-set-selection', (event) => {
    selectedTheme = themes[event.detail.index];
    renderPublications(items, selectedTheme);
  });

  themeControl.replaceChildren(...buttons);
  filters.replaceChildren(themeControl);
  renderPublications(items, selectedTheme);
}

function buildServiceCard(item) {
  const tile = document.createElement('a');
  tile.className = 'content-tile service-tile';
  tile.href = item.link || '#';
  tile.target = '_blank';
  tile.rel = 'noopener';

  tile.append(createTextSpan('tile-title', item.role || 'Service'));
  if (item.organization) {
    tile.append(createTextSpan('tile-support', item.organization));
  }

  if (item.location || item.year) {
    const metadata = document.createElement('span');
    metadata.className = 'metadata-row';
    if (item.location) metadata.append(createMetadataChip('place', item.location));
    if (item.year) metadata.append(createMetadataChip('calendar_today', item.year));
    tile.append(metadata);
  }

  return tile;
}

function renderServices(items) {
  const list = document.querySelector('#service-list');
  list.replaceChildren(...items.map(buildServiceCard));
}

function renderLoadError(containerSelector, message) {
  const container = document.querySelector(containerSelector);
  const error = document.createElement('div');
  error.className = 'content-tile';
  error.textContent = message;
  container.replaceChildren(error);
}

async function setupContent() {
  try {
    renderPublicationFilters(await loadJson('assets/texts/selected_pub_list.json'));
  } catch (error) {
    renderLoadError('#publication-list', error.message);
  }

  try {
    renderServices(await loadJson('assets/texts/academic_service_list.json'));
  } catch (error) {
    renderLoadError('#service-list', error.message);
  }
}

function setupGallery() {
  const wrapper = document.querySelector('#gallery-wrapper');
  const viewer = document.querySelector('#gallery-viewer');
  const viewerTitle = document.querySelector('#viewer-title');
  const viewerImage = document.querySelector('#viewer-image');
  const closeButton = document.querySelector('#viewer-close-button');

  viewer.quick = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  viewer.getOpenAnimation = () => ({
    dialog: [
      [
        [
          { opacity: 0, transform: 'translateY(24px) scale(0.92)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' },
        ],
        { duration: 420, easing: 'cubic-bezier(.05,.7,.1,1)' },
      ],
    ],
    scrim: [
      [
        [{ opacity: 0 }, { opacity: 0.32 }],
        { duration: 300, easing: 'linear' },
      ],
    ],
    headline: [
      [
        [{ opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1 }],
        { duration: 300, easing: 'linear', fill: 'forwards' },
      ],
    ],
    content: [
      [
        [{ opacity: 0 }, { opacity: 0, offset: 0.22 }, { opacity: 1 }],
        { duration: 320, easing: 'linear', fill: 'forwards' },
      ],
    ],
    actions: [
      [
        [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }],
        { duration: 300, easing: 'linear', fill: 'forwards' },
      ],
    ],
  });

  viewer.getCloseAnimation = () => ({
    dialog: [
      [
        [
          { opacity: 1, transform: 'translateY(0) scale(1)' },
          { opacity: 0, transform: 'translateY(12px) scale(0.96)' },
        ],
        { duration: 180, easing: 'cubic-bezier(.3,0,.8,.15)' },
      ],
    ],
    scrim: [
      [
        [{ opacity: 0.32 }, { opacity: 0 }],
        { duration: 180, easing: 'linear' },
      ],
    ],
    headline: [
      [
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 120, easing: 'linear', fill: 'forwards' },
      ],
    ],
    content: [
      [
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 120, easing: 'linear', fill: 'forwards' },
      ],
    ],
    actions: [
      [
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 120, easing: 'linear', fill: 'forwards' },
      ],
    ],
  });

  const closeViewer = () => {
    viewer.open = false;
    viewer.removeAttribute('open');
    viewerImage.removeAttribute('src');
  };

  closeButton?.addEventListener('click', closeViewer);
  viewer?.addEventListener('closed', () => {
    viewerImage.removeAttribute('src');
  });

  const tiles = galleryItems.map((item, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-tile';
    if (index === 0) button.classList.add('gallery-tile-featured');
    button.type = 'button';
    button.setAttribute('aria-label', `Open full image for ${item.title}`);
    button.addEventListener('click', () => {
      viewerTitle.textContent = item.title;
      viewerImage.src = publicUrl(item.full);
      viewerImage.alt = `Polaroid photo from ${item.title}`;
      viewer.open = true;
      viewer.setAttribute('open', '');
    });

    const image = document.createElement('img');
    image.src = publicUrl(item.image);
    image.alt = `Polaroid photo from ${item.title}`;
    image.loading = 'lazy';
    image.decoding = 'async';

    const label = document.createElement('span');
    label.className = 'gallery-tile-label';
    label.textContent = item.title;

    button.append(image, label);
    return button;
  });

  wrapper.replaceChildren(...tiles);
}

function setupReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [...document.querySelectorAll('.reveal')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  targets.forEach((target, index) => {
    if (index <= 1) {
      target.classList.add('is-visible');
      return;
    }
    target.style.transitionDelay = `${80 * (index - 1)}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

  targets.slice(2).forEach((target) => observer.observe(target));
}

setupZoomLock();
setupAnalytics();
setupTopAppBarElevation();
setupLinks();
setupEmailCopy();
setupContent();
setupGallery();
setupReveal();
