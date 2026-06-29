type PhotoLightboxWindow = Window & {
  __tpvTransparencyPhotoLightboxBooted?: boolean;
};

type PhotoItem = {
  trigger: HTMLButtonElement;
  src: string;
  fallbackSrc: string;
  alt: string;
};

const gallerySelector = "[data-transparency-photo-gallery]";
const triggerSelector = "[data-photo-trigger]";
const dialogSelector = "[data-photo-dialog]";
const imageSelector = "[data-photo-image]";
const captionSelector = "[data-photo-caption]";
const counterSelector = "[data-photo-counter]";
const closeSelector = "[data-photo-close]";
const previousSelector = "[data-photo-previous]";
const nextSelector = "[data-photo-next]";

const loadedGalleries = new WeakSet<HTMLElement>();

const modulo = (index: number, length: number) => (index + length) % length;

const readPhotoItems = (root: HTMLElement): PhotoItem[] =>
  Array.from(root.querySelectorAll<HTMLButtonElement>(triggerSelector))
    .map((trigger) => ({
      trigger,
      src: trigger.dataset.photoSrc ?? "",
      fallbackSrc: trigger.dataset.photoFallbackSrc ?? "",
      alt: trigger.dataset.photoAlt ?? "",
    }))
    .filter((item) => item.src.length > 0);

const setText = (element: Element | null, value: string) => {
  if (element) element.textContent = value;
};

const setupGallery = (root: HTMLElement) => {
  if (loadedGalleries.has(root)) return;

  const dialog = root.querySelector<HTMLDialogElement>(dialogSelector);
  const image = root.querySelector<HTMLImageElement>(imageSelector);
  const closeButton = root.querySelector<HTMLButtonElement>(closeSelector);
  const previousButton = root.querySelector<HTMLButtonElement>(previousSelector);
  const nextButton = root.querySelector<HTMLButtonElement>(nextSelector);
  const caption = root.querySelector(captionSelector);
  const counter = root.querySelector(counterSelector);
  const items = readPhotoItems(root);

  if (!dialog || !image || items.length === 0) return;

  loadedGalleries.add(root);

  const controller = new AbortController();
  const preloaded = new Set<string>();
  let activeIndex = 0;
  let lastTrigger: HTMLButtonElement | null = null;
  let renderToken = 0;

  const preload = (item: PhotoItem | undefined) => {
    if (!item || preloaded.has(item.src)) return;

    const preloadImage = new Image();
    preloadImage.decoding = "async";
    preloadImage.src = item.src;
    preloaded.add(item.src);
  };

  const preloadNeighbors = () => {
    if (items.length < 2) return;

    preload(items[modulo(activeIndex + 1, items.length)]);
    preload(items[modulo(activeIndex - 1, items.length)]);
  };

  const renderActivePhoto = () => {
    const item = items[activeIndex];
    const token = ++renderToken;
    let usedFallback = false;

    dialog.dataset.loading = "true";
    image.removeAttribute("src");
    image.alt = item.alt;
    setText(caption, item.alt);
    setText(counter, `${activeIndex + 1} / ${items.length}`);

    image.onload = () => {
      if (token === renderToken) dialog.dataset.loading = "false";
    };

    image.onerror = () => {
      if (!usedFallback && item.fallbackSrc.length > 0) {
        usedFallback = true;
        image.src = item.fallbackSrc;
        return;
      }

      if (token === renderToken) dialog.dataset.loading = "false";
    };

    image.src = item.src;
    preloadNeighbors();
  };

  const goTo = (index: number) => {
    activeIndex = modulo(index, items.length);
    renderActivePhoto();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const open = (index: number, trigger: HTMLButtonElement) => {
    activeIndex = modulo(index, items.length);
    lastTrigger = trigger;
    renderActivePhoto();

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    closeButton?.focus({ preventScroll: true });
  };

  items.forEach((item, index) => {
    item.trigger.addEventListener("click", () => open(index, item.trigger), {
      signal: controller.signal,
    });
  });

  previousButton?.addEventListener("click", () => goTo(activeIndex - 1), {
    signal: controller.signal,
  });
  nextButton?.addEventListener("click", () => goTo(activeIndex + 1), {
    signal: controller.signal,
  });
  closeButton?.addEventListener("click", close, { signal: controller.signal });

  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target === dialog) close();
    },
    { signal: controller.signal },
  );

  dialog.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(activeIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(activeIndex + 1);
      }

      if (event.key === "Escape") {
        close();
      }
    },
    { signal: controller.signal },
  );

  dialog.addEventListener(
    "close",
    () => {
      ++renderToken;
      image.onload = null;
      image.onerror = null;
      image.removeAttribute("src");
      dialog.dataset.loading = "false";
      lastTrigger?.focus({ preventScroll: true });
    },
    { signal: controller.signal },
  );
};

export const initTransparencyPhotoLightboxes = () => {
  document.querySelectorAll<HTMLElement>(gallerySelector).forEach(setupGallery);
};

export const bootTransparencyPhotoLightboxes = () => {
  initTransparencyPhotoLightboxes();

  const lightboxWindow = window as PhotoLightboxWindow;
  if (lightboxWindow.__tpvTransparencyPhotoLightboxBooted) return;

  lightboxWindow.__tpvTransparencyPhotoLightboxBooted = true;
  document.addEventListener("astro:page-load", initTransparencyPhotoLightboxes);
};
