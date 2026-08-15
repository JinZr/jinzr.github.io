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
  { image: 'assets/images/egs/egs1.webp', full: 'assets/images/egs_highres/egs1.webp', title: 'Dalian', width: 805, height: 978 },
  { image: 'assets/images/egs/egs2.webp', full: 'assets/images/egs_highres/egs2.webp', title: 'Dalian', width: 480, height: 584 },
  { image: 'assets/images/egs/egs3.webp', full: 'assets/images/egs_highres/egs3.webp', title: 'Dalian', width: 480, height: 584 },
  { image: 'assets/images/egs/egs4.webp', full: 'assets/images/egs_highres/egs4.webp', title: 'Dalian', width: 480, height: 584 },
  { image: 'assets/images/egs/egs5.webp', full: 'assets/images/egs_highres/egs5.webp', title: 'Hong Kong SAR', width: 480, height: 584 },
  { image: 'assets/images/egs/egs6.webp', full: 'assets/images/egs_highres/egs6.webp', title: 'Hong Kong SAR', width: 480, height: 584 },
  { image: 'assets/images/egs/egs7.webp', full: 'assets/images/egs_highres/egs7.webp', title: 'Hong Kong SAR', width: 480, height: 584 },
  { image: 'assets/images/egs/egs8.webp', full: 'assets/images/egs_highres/egs8.webp', title: 'Hong Kong SAR', width: 480, height: 584 },
];

const iconCodepoints = {
  auto_stories: 0xe666,
  calendar_today: 0xe935,
  asterisk: 0xf525,
  place: 0xf1db,
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

  let updatePending = false;

  const updateScrolledUnder = () => {
    const styles = getComputedStyle(topAppBar);
    const expandedHeight = Number.parseFloat(styles.getPropertyValue('--app-bar-expanded-height'));
    const collapsedHeight = Number.parseFloat(styles.getPropertyValue('--app-bar-collapsed-height'));
    const collapseRange = expandedHeight - collapsedHeight;
    const collapse = Math.min(window.scrollY, collapseRange);

    topAppBar.style.setProperty('--app-bar-collapse', `${collapse}px`);
    topAppBar.style.setProperty('--app-bar-progress', (collapse / collapseRange).toFixed(4));
    topAppBar.classList.toggle('scrolled-under', window.scrollY > collapseRange);
    updatePending = false;
  };

  const requestUpdate = () => {
    if (updatePending) return;
    updatePending = true;
    requestAnimationFrame(updateScrolledUnder);
  };

  updateScrolledUnder();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
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
  let timeoutId;
  const interactionEvents = ['pointerdown', 'keydown'];

  const loadAnalytics = () => {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    interactionEvents.forEach((eventName) => window.removeEventListener(eventName, loadAnalytics));
    window.clearTimeout(timeoutId);
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
    interactionEvents.forEach((eventName) => window.addEventListener(eventName, loadAnalytics, { once: true, passive: true }));
    timeoutId = window.setTimeout(loadAnalytics, 5000);
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
    const authors = document.createElement('span');
    authors.className = 'tile-support';
    item.author.split(', ').forEach((name, index) => {
      if (index > 0) authors.append(document.createTextNode(', '));
      if (name === 'Zengrui Jin') {
        const self = document.createElement('strong');
        self.className = 'publication-author-self';
        self.textContent = name;
        authors.append(self);
      } else {
        authors.append(document.createTextNode(name));
      }
    });
    tile.append(authors);
  }

  if (item.venue || item.year || item.co_first_author) {
    const metadata = document.createElement('span');
    metadata.className = 'metadata-row';
    if (item.venue) metadata.append(createMetadataChip('auto_stories', item.venue));
    if (item.year) metadata.append(createMetadataChip('calendar_today', item.year));
    if (item.co_first_author) metadata.append(createMetadataChip('asterisk', 'Co-first author'));
    tile.append(metadata);
  }

  return tile;
}

function renderPublications(items, selectedTheme) {
  const list = document.querySelector('#publication-list');
  const filtered = items
    .filter((item) => publicationTheme(item) === selectedTheme)
    .sort((a, b) => Number(b.year) - Number(a.year));

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

    buttons[event.detail.index]?.animate([
      { transform: 'scale(0.94)' },
      { transform: 'scale(1.035)', offset: 0.58 },
      { transform: 'scale(1)' },
    ], {
      duration: 450,
      easing: 'cubic-bezier(.42,1.67,.21,.9)',
    });

    document.querySelector('#publication-list')?.animate([
      { opacity: 0.72, transform: 'translateY(6px) scale(0.995)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], {
      duration: 360,
      easing: 'cubic-bezier(.05,.7,.1,1)',
    });
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
  const viewerCanvas = document.querySelector('#viewer-canvas');
  const viewerImage = document.querySelector('#viewer-image');
  const closeButton = document.querySelector('#viewer-close-button');
  const zoomOutButton = document.querySelector('#viewer-zoom-out');
  const zoomResetButton = document.querySelector('#viewer-zoom-reset');
  const zoomInButton = document.querySelector('#viewer-zoom-in');

  let viewerZoom = 1;
  let viewerPanX = 0;
  let viewerPanY = 0;
  let activePointerId;
  let previousPointerX = 0;
  let previousPointerY = 0;

  const isZoomControl = (event) => event.composedPath().some(
    (element) => element.classList?.contains('viewer-zoom-controls'),
  );

  const constrainViewerPan = () => {
    const availableWidth = Math.max(0, viewerCanvas.clientWidth - 16);
    const availableHeight = Math.max(0, viewerCanvas.clientHeight - 16);
    const maxPanX = Math.max(0, ((viewerImage.offsetWidth * viewerZoom) - availableWidth) / 2);
    const maxPanY = Math.max(0, ((viewerImage.offsetHeight * viewerZoom) - availableHeight) / 2);
    viewerPanX = Math.min(maxPanX, Math.max(-maxPanX, viewerPanX));
    viewerPanY = Math.min(maxPanY, Math.max(-maxPanY, viewerPanY));
  };

  const updateViewerZoom = () => {
    constrainViewerPan();
    viewerImage.style.transform = `translate3d(${viewerPanX}px, ${viewerPanY}px, 0) scale(${viewerZoom})`;
    zoomResetButton.textContent = `${Math.round(viewerZoom * 100)}%`;
    zoomOutButton.disabled = viewerZoom <= 1;
    zoomInButton.disabled = viewerZoom >= 4;
    viewer.classList.toggle('is-zoomed', viewerZoom > 1);
  };

  const setViewerZoom = (zoom) => {
    viewerZoom = Math.round(Math.min(4, Math.max(1, zoom)) * 100) / 100;
    if (viewerZoom === 1) {
      viewerPanX = 0;
      viewerPanY = 0;
    }
    updateViewerZoom();
  };

  const resetViewerZoom = () => {
    viewerZoom = 1;
    viewerPanX = 0;
    viewerPanY = 0;
    viewer.classList.remove('is-panning');
    updateViewerZoom();
  };

  zoomOutButton?.addEventListener('click', () => setViewerZoom(viewerZoom - 0.5));
  zoomResetButton?.addEventListener('click', resetViewerZoom);
  zoomInButton?.addEventListener('click', () => setViewerZoom(viewerZoom + 0.5));
  viewerImage?.addEventListener('load', resetViewerZoom);
  window.addEventListener('resize', updateViewerZoom);

  viewerCanvas?.addEventListener('wheel', (event) => {
    if (isZoomControl(event)) return;
    event.preventDefault();
    const sensitivity = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? 0.002 : 0.04;
    setViewerZoom(viewerZoom - (event.deltaY * sensitivity));
  }, { passive: false });

  viewerCanvas?.addEventListener('dblclick', (event) => {
    if (isZoomControl(event)) return;
    setViewerZoom(viewerZoom > 1 ? 1 : 2);
  });

  viewerCanvas?.addEventListener('pointerdown', (event) => {
    if (viewerZoom <= 1 || isZoomControl(event)) return;
    activePointerId = event.pointerId;
    previousPointerX = event.clientX;
    previousPointerY = event.clientY;
    viewer.classList.add('is-panning');
    viewerCanvas.setPointerCapture(event.pointerId);
  });

  viewerCanvas?.addEventListener('pointermove', (event) => {
    if (event.pointerId !== activePointerId) return;
    viewerPanX += event.clientX - previousPointerX;
    viewerPanY += event.clientY - previousPointerY;
    previousPointerX = event.clientX;
    previousPointerY = event.clientY;
    updateViewerZoom();
  });

  const stopViewerPan = (event) => {
    if (event.pointerId !== activePointerId) return;
    activePointerId = undefined;
    viewer.classList.remove('is-panning');
  };

  viewerCanvas?.addEventListener('pointerup', stopViewerPan);
  viewerCanvas?.addEventListener('pointercancel', stopViewerPan);

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
    content: [
      [
        [{ opacity: 0 }, { opacity: 0, offset: 0.22 }, { opacity: 1 }],
        { duration: 320, easing: 'linear', fill: 'forwards' },
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
    content: [
      [
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 120, easing: 'linear', fill: 'forwards' },
      ],
    ],
  });

  const closeViewer = () => {
    resetViewerZoom();
    viewer.open = false;
    viewer.removeAttribute('open');
    viewerImage.removeAttribute('src');
  };

  closeButton?.addEventListener('click', closeViewer);
  viewer?.addEventListener('closed', () => {
    resetViewerZoom();
    viewerImage.removeAttribute('src');
  });

  const tiles = galleryItems.map((item, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-tile';
    if (index === 0) button.classList.add('gallery-tile-featured');
    button.type = 'button';
    button.setAttribute('aria-label', `Open full image for ${item.title}`);
    button.addEventListener('click', () => {
      resetViewerZoom();
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
    image.width = item.width;
    image.height = item.height;

    const label = document.createElement('span');
    label.className = 'gallery-tile-label';
    label.textContent = item.title;

    button.append(image, label);
    return button;
  });

  wrapper.replaceChildren(...tiles);
}

function setupReveal() {
  const targets = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window)) {
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

const footer = document.querySelector('.site-footer');
if (footer) {
  footer.textContent = `Last edited on ${__LAST_EDITED__}.`;
}
