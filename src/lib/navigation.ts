const stateKey = "__siteNavigationId";
const scrollPositions = new Map<string, [number, number]>();
let activeId: string = crypto.randomUUID();
let renderedUrl = new URL(location.href);
let pending: AbortController | undefined;

history.scrollRestoration = "manual";
history.replaceState({ ...history.state, [stateKey]: activeId }, "");

function saveScroll() {
  scrollPositions.set(activeId, [window.scrollX, window.scrollY]);
}

window.addEventListener("scroll", saveScroll, { passive: true });
window.addEventListener("site:replace-state", () => {
  renderedUrl = new URL(location.href);
});

function scrollToHash(hash: string) {
  if (!hash || hash === "#") {
    window.scrollTo(0, 0);
    return;
  }

  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // Use the original hash if it contains invalid escapes.
  }
  const target = document.getElementById(id) ?? document.getElementsByName(id)[0];
  if (target) target.scrollIntoView();
  else window.scrollTo(0, 0);
}

function runScripts(main: HTMLElement) {
  for (const oldScript of main.querySelectorAll("script")) {
    const script = document.createElement("script");
    for (const attribute of oldScript.attributes) {
      script.setAttribute(attribute.name, attribute.value);
    }
    script.textContent = oldScript.textContent;
    oldScript.replaceWith(script);
  }
}

async function navigate(url: URL, restoreId?: string) {
  pending?.abort();
  const request = new AbortController();
  pending = request;

  try {
    const response = await fetch(url.href, { signal: request.signal });
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
      throw new Error("The destination is not an HTML page.");
    }

    const destination = new URL(response.url);
    if (destination.origin !== location.origin) throw new Error("The destination is external.");
    destination.hash = url.hash;
    const html = await response.text();
    if (request.signal.aborted) return;
    const page = new DOMParser().parseFromString(html, "text/html");
    const nextMain = page.querySelector<HTMLElement>("body > main");
    const currentMain = document.querySelector<HTMLElement>("body > main");
    if (!page.querySelector('meta[name="site-layout"][content="main"]') || !nextMain || !currentMain) {
      throw new Error("The destination does not use the shared layout.");
    }

    if (restoreId) {
      activeId = restoreId;
    } else {
      saveScroll();
      activeId = crypto.randomUUID();
      history.pushState({ [stateKey]: activeId }, "", destination.href);
    }
    renderedUrl = new URL(location.href);
    document.title = page.title;
    const description = document.querySelector('meta[name="description"]');
    const nextDescription = page.querySelector('meta[name="description"]');
    if (description && nextDescription) {
      description.setAttribute("content", nextDescription.getAttribute("content") ?? "");
    }

    const main = document.importNode(nextMain, true);
    currentMain.replaceWith(main);
    // Astro islands use this event to release their Preact components.
    document.dispatchEvent(new Event("astro:after-swap"));
    runScripts(main);
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });

    const position = restoreId && scrollPositions.get(restoreId);
    if (position) window.scrollTo(...position);
    else scrollToHash(destination.hash);
  } catch (error) {
    if (request.signal.aborted) return;
    if (restoreId) location.reload();
    else location.assign(url.href);
  } finally {
    if (pending === request) pending = undefined;
  }
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const link = target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download") || link.hasAttribute("data-no-navigation") ||
      (link.target && link.target.toLowerCase() !== "_self") || link.relList.contains("external")) return;

  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !["http:", "https:"].includes(url.protocol)) return;
  if (url.pathname === location.pathname && url.search === location.search) {
    pending?.abort();
    return;
  }

  event.preventDefault();
  void navigate(url);
});

window.addEventListener("popstate", (event) => {
  pending?.abort();
  saveScroll();
  const id = typeof event.state?.[stateKey] === "string" ? event.state[stateKey] : crypto.randomUUID();
  if (!event.state?.[stateKey]) history.replaceState({ ...event.state, [stateKey]: id }, "");
  const url = new URL(location.href);
  if (url.pathname === renderedUrl.pathname && url.search === renderedUrl.search) {
    activeId = id;
    renderedUrl = url;
    const position = scrollPositions.get(id);
    if (position) requestAnimationFrame(() => window.scrollTo(...position));
    return;
  }
  void navigate(url, id);
});
