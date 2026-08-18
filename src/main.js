import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
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
  const menuButton = document.querySelector('#more-menu-button');
  const menu = document.querySelector('#more-menu');

  const closeMenu = () => {
    menu?.classList.remove('open');
    menu?.setAttribute('aria-hidden', 'true');
    menuButton?.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    menu?.classList.add('open');
    menu?.setAttribute('aria-hidden', 'false');
    menuButton?.setAttribute('aria-expanded', 'true');
  };

  document.querySelectorAll('[data-link]').forEach((element) => {
    element.addEventListener('click', () => {
      if (element.closest('#more-menu')) closeMenu();
      openExternal(element.dataset.link);
    });
  });

  menuButton?.addEventListener('click', () => {
    if (menu?.classList.contains('open')) closeMenu();
    else openMenu();
  });

  document.addEventListener('click', (event) => {
    if (!menu?.classList.contains('open')) return;
    const path = event.composedPath();
    if (!path.includes(menu) && !path.includes(menuButton)) closeMenu();
  }, { capture: true });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.matchMedia('(max-width: 1100px)').addEventListener('change', closeMenu);
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
  let publicationTransition = 0;
  let publicationAnimations = [];

  const transitionPublications = async () => {
    const list = document.querySelector('#publication-list');
    const transition = ++publicationTransition;

    publicationAnimations.forEach((animation) => animation.cancel());
    publicationAnimations = [];
    list.style.removeProperty('height');
    list.style.removeProperty('overflow');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderPublications(items, selectedTheme);
      return;
    }

    const startHeight = list.getBoundingClientRect().height;
    const outgoingAnimations = [...list.children].map((card) => card.animate([
      { opacity: 1, transform: 'translateY(0) scale(1)' },
      { opacity: 0, transform: 'translateY(-4px) scale(0.995)' },
    ], {
      duration: 110,
      easing: 'cubic-bezier(.3,0,.8,.15)',
      fill: 'forwards',
    }));
    publicationAnimations = outgoingAnimations;

    await Promise.all(outgoingAnimations.map((animation) => animation.finished.catch(() => {})));
    if (transition !== publicationTransition) return;

    renderPublications(items, selectedTheme);
    const cards = [...list.children];
    const endHeight = list.getBoundingClientRect().height;
    list.style.height = `${startHeight}px`;
    list.style.overflow = 'hidden';

    const heightAnimation = list.animate([
      { height: `${startHeight}px` },
      { height: `${endHeight}px` },
    ], {
      duration: 320,
      easing: 'cubic-bezier(.05,.7,.1,1)',
      fill: 'both',
    });
    const incomingAnimations = cards.map((card, index) => card.animate([
      { opacity: 0, transform: 'translateY(6px) scale(0.995)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], {
      duration: 280,
      delay: Math.min(index * 28, 112),
      easing: 'cubic-bezier(.05,.7,.1,1)',
      fill: 'both',
    }));
    const activeAnimations = [heightAnimation, ...incomingAnimations];
    publicationAnimations = activeAnimations;

    await Promise.all(activeAnimations.map((animation) => animation.finished.catch(() => {})));
    if (transition !== publicationTransition) return;
    list.style.removeProperty('height');
    list.style.removeProperty('overflow');
    activeAnimations.forEach((animation) => animation.cancel());
    publicationAnimations = [];
  };

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
    transitionPublications();

    buttons[event.detail.index]?.animate([
      { transform: 'scale(0.94)' },
      { transform: 'scale(1.035)', offset: 0.58 },
      { transform: 'scale(1)' },
    ], {
      duration: 450,
      easing: 'cubic-bezier(.42,1.67,.21,.9)',
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
  const viewerLoading = document.querySelector('#viewer-loading');
  const viewerFooter = document.querySelector('.viewer-footer');
  const closeButton = document.querySelector('#viewer-close-button');

  let viewerZoom = 1;
  let viewerPanX = 0;
  let viewerPanY = 0;
  let previousPinchDistance = 0;
  let activeTile = null;
  let imageRequest = 0;
  let heroAnimation = null;
  let footerAnimation = null;
  const viewerPointers = new Map();

  const constrainViewerPan = () => {
    const availableWidth = viewerCanvas.clientWidth;
    const availableHeight = viewerCanvas.clientHeight;
    const maxPanX = Math.max(0, ((viewerImage.offsetWidth * viewerZoom) - availableWidth) / 2);
    const maxPanY = Math.max(0, ((viewerImage.offsetHeight * viewerZoom) - availableHeight) / 2);
    viewerPanX = Math.min(maxPanX, Math.max(-maxPanX, viewerPanX));
    viewerPanY = Math.min(maxPanY, Math.max(-maxPanY, viewerPanY));
  };

  const updateViewerZoom = () => {
    constrainViewerPan();
    viewerImage.style.transform = `translate3d(${viewerPanX}px, ${viewerPanY}px, 0) scale(${viewerZoom})`;
    viewer.classList.toggle('is-zoomed', viewerZoom > 1);
  };

  const setViewerZoom = (zoom, origin) => {
    const nextZoom = Math.round(Math.min(4, Math.max(1, zoom)) * 100) / 100;
    if (origin && nextZoom !== viewerZoom) {
      const canvasRect = viewerCanvas.getBoundingClientRect();
      const originX = origin.x - canvasRect.left - (canvasRect.width / 2);
      const originY = origin.y - canvasRect.top - (canvasRect.height / 2);
      const zoomRatio = nextZoom / viewerZoom;
      viewerPanX = originX - ((originX - viewerPanX) * zoomRatio);
      viewerPanY = originY - ((originY - viewerPanY) * zoomRatio);
    }
    viewerZoom = nextZoom;
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
    previousPinchDistance = 0;
    viewerPointers.clear();
    viewer.classList.remove('is-panning');
    updateViewerZoom();
  };

  const setViewerLoading = (isLoading) => {
    viewer.classList.toggle('is-loading', isLoading);
    viewerCanvas.setAttribute('aria-busy', String(isLoading));
    viewerLoading.hidden = !isLoading;
  };

  window.addEventListener('resize', updateViewerZoom);

  viewerCanvas?.addEventListener('wheel', (event) => {
    event.preventDefault();
    const sensitivity = event.deltaMode === WheelEvent.DOM_DELTA_PIXEL ? 0.002 : 0.04;
    setViewerZoom(viewerZoom - (event.deltaY * sensitivity), { x: event.clientX, y: event.clientY });
  }, { passive: false });

  viewerCanvas?.addEventListener('dblclick', (event) => {
    setViewerZoom(viewerZoom > 1 ? 1 : 2, { x: event.clientX, y: event.clientY });
  });

  viewerCanvas?.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && viewerZoom <= 1) return;
    viewerPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    viewerCanvas.setPointerCapture(event.pointerId);
    if (viewerPointers.size === 1 && viewerZoom > 1) viewer.classList.add('is-panning');
    if (viewerPointers.size === 2) {
      const [firstPointer, secondPointer] = [...viewerPointers.values()];
      previousPinchDistance = Math.hypot(
        secondPointer.x - firstPointer.x,
        secondPointer.y - firstPointer.y,
      );
    }
  });

  viewerCanvas?.addEventListener('pointermove', (event) => {
    const previousPointer = viewerPointers.get(event.pointerId);
    if (!previousPointer) return;
    viewerPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (viewerPointers.size >= 2) {
      viewer.classList.add('is-panning');
      const [firstPointer, secondPointer] = [...viewerPointers.values()];
      const pinchDistance = Math.hypot(
        secondPointer.x - firstPointer.x,
        secondPointer.y - firstPointer.y,
      );
      if (previousPinchDistance > 0) {
        setViewerZoom(viewerZoom * (pinchDistance / previousPinchDistance), {
          x: (firstPointer.x + secondPointer.x) / 2,
          y: (firstPointer.y + secondPointer.y) / 2,
        });
      }
      previousPinchDistance = pinchDistance;
      return;
    }

    if (viewerZoom <= 1) return;
    viewerPanX += event.clientX - previousPointer.x;
    viewerPanY += event.clientY - previousPointer.y;
    updateViewerZoom();
  });

  const stopViewerPan = (event) => {
    if (!viewerPointers.has(event.pointerId)) return;
    viewerPointers.delete(event.pointerId);
    if (viewerPointers.size < 2) previousPinchDistance = 0;
    viewer.classList.toggle('is-panning', viewerPointers.size === 1 && viewerZoom > 1);
  };

  viewerCanvas?.addEventListener('pointerup', stopViewerPan);
  viewerCanvas?.addEventListener('pointercancel', stopViewerPan);

  const getHeroKeyframes = (opening) => {
    const sourceRect = activeTile?.getBoundingClientRect();
    const targetRect = viewerImage.getBoundingClientRect();
    if (!sourceRect?.width || !targetRect.width) return null;

    const scale = Math.max(
      sourceRect.width / targetRect.width,
      sourceRect.height / targetRect.height,
    );
    const visibleWidth = sourceRect.width / scale;
    const visibleHeight = sourceRect.height / scale;
    const clipX = Math.max(0, (targetRect.width - visibleWidth) / 2);
    const clipY = Math.max(0, (targetRect.height - visibleHeight) / 2);
    const translateX = sourceRect.left + (sourceRect.width / 2) - targetRect.left - (targetRect.width / 2);
    const translateY = sourceRect.top + (sourceRect.height / 2) - targetRect.top - (targetRect.height / 2);
    const sourceRadius = Number.parseFloat(getComputedStyle(activeTile).borderRadius) / scale;
    const targetRadius = Number.parseFloat(getComputedStyle(viewerImage).borderRadius);
    const sourceFrame = {
      transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
      clipPath: `inset(${clipY}px ${clipX}px ${clipY}px ${clipX}px round ${sourceRadius}px)`,
      borderRadius: `${sourceRadius}px`,
    };
    const targetFrame = {
      transform: 'translate3d(0, 0, 0) scale(1)',
      clipPath: `inset(0 0 0 0 round ${targetRadius}px)`,
      borderRadius: `${targetRadius}px`,
    };
    return opening ? [sourceFrame, targetFrame] : [targetFrame, sourceFrame];
  };

  const animateHero = (opening, duration) => {
    heroAnimation?.cancel();
    const keyframes = getHeroKeyframes(opening);
    if (!keyframes) return;
    if (opening) activeTile.classList.add('is-viewing');
    const animation = viewerImage.animate(keyframes, {
      duration,
      easing: opening ? 'cubic-bezier(.05,.7,.1,1)' : 'cubic-bezier(.3,0,.8,.15)',
      fill: 'both',
    });
    heroAnimation = animation;
    animation.finished.catch(() => {}).then(() => {
      if (heroAnimation !== animation) return;
      animation.cancel();
      heroAnimation = null;
    });
  };

  const animateFooter = (keyframes, options) => {
    footerAnimation?.cancel();
    const animation = viewerFooter.animate(keyframes, { ...options, fill: 'both' });
    footerAnimation = animation;
    animation.finished.catch(() => {}).then(() => {
      if (footerAnimation !== animation) return;
      animation.cancel();
      footerAnimation = null;
    });
  };

  viewer.getOpenAnimation = () => {
    animateHero(true, 460);
    animateFooter(
      [
        { opacity: 0, transform: 'translateY(8px)' },
        { opacity: 0, transform: 'translateY(8px)', offset: 0.42 },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 460, easing: 'cubic-bezier(.05,.7,.1,1)' },
    );
    return {
      dialog: [
        [
          [{ opacity: 1 }, { opacity: 1 }],
          { duration: 460 },
        ],
      ],
      scrim: [
        [
          [{ opacity: 0 }, { opacity: 0.32 }],
          { duration: 300, easing: 'linear' },
        ],
      ],
      container: [
        [
          [{ opacity: 0 }, { opacity: 0, offset: 0.34 }, { opacity: 1 }],
          { duration: 460, easing: 'linear', pseudoElement: '::before' },
        ],
      ],
    };
  };

  viewer.getCloseAnimation = () => {
    animateHero(false, 260);
    animateFooter(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 120, easing: 'linear' },
    );
    return {
      dialog: [
        [
          [{ opacity: 1 }, { opacity: 1 }],
          { duration: 260 },
        ],
      ],
      scrim: [
        [
          [{ opacity: 0.32 }, { opacity: 0 }],
          { duration: 260, easing: 'linear' },
        ],
      ],
      container: [
        [
          [{ opacity: 1 }, { opacity: 0 }],
          { delay: 90, duration: 170, easing: 'linear', pseudoElement: '::before' },
        ],
      ],
    };
  };

  const loadFullImage = async (src, request) => {
    const fullImage = new Image();
    fullImage.src = src;
    try {
      await fullImage.decode();
    } catch {
      if (request === imageRequest) setViewerLoading(false);
      return;
    }
    if (request !== imageRequest) return;
    viewerImage.src = src;
    setViewerLoading(false);
  };

  const closeViewer = () => {
    viewer.open = false;
  };

  closeButton?.addEventListener('click', closeViewer);
  viewer?.addEventListener('close', () => {
    imageRequest += 1;
    viewer.classList.add('is-closing');
    resetViewerZoom();
    setViewerLoading(false);
  });
  viewer?.addEventListener('closed', () => {
    viewer.classList.remove('is-closing');
    resetViewerZoom();
    setViewerLoading(false);
    viewerImage.removeAttribute('src');
    activeTile?.classList.remove('is-viewing');
    activeTile = null;
  });

  const tiles = galleryItems.map((item, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-tile';
    if (index === 0) button.classList.add('gallery-tile-featured');
    button.type = 'button';
    button.setAttribute('aria-label', `Open full image for ${item.title}`);
    button.addEventListener('click', () => {
      viewer.classList.remove('is-closing');
      activeTile = button;
      resetViewerZoom();
      setViewerLoading(true);
      viewerTitle.textContent = item.title;
      viewerImage.alt = `Polaroid photo from ${item.title}`;
      viewerImage.width = item.width;
      viewerImage.height = item.height;
      viewer.style.setProperty('--viewer-image-aspect', item.width / item.height);
      viewerImage.src = image.currentSrc || image.src;
      const request = ++imageRequest;
      viewer.open = true;
      loadFullImage(publicUrl(item.full), request);
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
