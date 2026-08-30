/**
 * Perplexity composer populate — never clicks Send.
 */
(() => {
  if (window.__sendToAiPerplexityInjected) return;
  window.__sendToAiPerplexityInjected = true;

  const COMPOSER_SELECTORS = [
    "#ask-input",
    'div#ask-input[contenteditable="true"]',
    '[contenteditable="true"][role="textbox"]',
    '[contenteditable="true"][aria-placeholder*="Ask" i]',
    '[contenteditable="true"][aria-placeholder*="search" i]',
    'textarea[placeholder*="Ask" i]',
    'textarea[placeholder*="Search" i]',
  ];

  const FILE_INPUT_SELECTORS = [
    'input[type="file"][accept*="image"]',
    'input[type="file"][multiple]',
    "form input[type=file]",
    'input[type="file"]',
  ];

  function isVisible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return (
      rect.width > 8 &&
      rect.height > 8 &&
      style.visibility !== "hidden" &&
      style.display !== "none"
    );
  }

  function findComposer() {
    for (const sel of COMPOSER_SELECTORS) {
      for (const el of document.querySelectorAll(sel)) {
        if (isVisible(el)) return el;
      }
    }
    return null;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForComposer(timeoutMs = 25000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const el = findComposer();
      if (el) return el;
      await sleep(250);
    }
    throw new Error("Perplexity composer not found. Sign in at perplexity.ai and try again.");
  }

  function pasteText(el, text) {
    const dt = new DataTransfer();
    dt.setData("text/plain", text);
    let event;
    try {
      event = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: dt,
      });
    } catch {
      event = new Event("paste", { bubbles: true, cancelable: true });
    }
    if (!event.clipboardData) {
      Object.defineProperty(event, "clipboardData", { value: dt });
    }
    el.dispatchEvent(event);
  }

  function insertMultiline(text) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) document.execCommand("insertParagraph", false);
      if (lines[i]) document.execCommand("insertText", false, lines[i]);
    }
  }

  function insertText(el, text) {
    if (!text) return true;

    el.focus();
    el.click();

    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      const proto = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value");
      proto?.set?.call(el, text);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      return el.value.includes(text.slice(0, Math.min(40, text.length)));
    }

    document.execCommand("selectAll", false);
    if (text.includes("\n")) {
      pasteText(el, text);
      const afterPaste = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
      const sample = text.replace(/\s+/g, " ").slice(0, 40).trim();
      if (!sample || afterPaste.includes(sample)) {
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return true;
      }
      insertMultiline(text);
    } else {
      const inserted = document.execCommand("insertText", false, text);
      if (!inserted) pasteText(el, text);
    }

    el.dispatchEvent(new Event("input", { bubbles: true }));

    const sample = text.replace(/\s+/g, " ").slice(0, 40).trim();
    const current = (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
    return !sample || current.includes(sample);
  }

  async function dataUrlToFile(dataUrl) {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const type = blob.type || "image/jpeg";
    const ext = type.includes("png") ? "png" : "jpg";
    return new File([blob], `screenshot.${ext}`, { type });
  }

  function findFileInput() {
    for (const sel of FILE_INPUT_SELECTORS) {
      for (const el of document.querySelectorAll(sel)) {
        if (el instanceof HTMLInputElement && !el.disabled) return el;
      }
    }
    return null;
  }

  function attachViaFileInput(file) {
    const input = findFileInput();
    if (!input) return false;
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function attachViaPaste(el, file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    el.focus();
    let event;
    try {
      event = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: dt,
      });
    } catch {
      event = new Event("paste", { bubbles: true, cancelable: true });
    }
    if (!event.clipboardData) {
      Object.defineProperty(event, "clipboardData", { value: dt });
    }
    return el.dispatchEvent(event);
  }

  function looksAttached() {
    return Boolean(
      document.querySelector(
        '[data-testid*="file"], [data-testid*="attachment"], [data-testid*="thumbnail"], button[aria-label*="Remove" i], button[aria-label*="remove file" i], img[src^="blob:"], img[alt*="Uploaded" i], [class*="thumbnail"] img, [class*="attachment"] img'
      )
    );
  }

  async function attachImage(composer, dataUrl) {
    const file = await dataUrlToFile(dataUrl);
    attachViaPaste(composer, file);
    await sleep(500);
    if (looksAttached()) return true;
    attachViaFileInput(file);
    await sleep(500);
    return looksAttached();
  }

  async function populate(prompt, imageDataUrl) {
    const composer = await waitForComposer();
    const textInserted = insertText(composer, prompt);
    let imageAttached = false;
    if (imageDataUrl) {
      try {
        imageAttached = await attachImage(composer, imageDataUrl);
      } catch {
        imageAttached = false;
      }
    }
    return {
      ok: textInserted || Boolean(imageDataUrl && imageAttached),
      textInserted,
      imageAttached,
      needsManualImage: Boolean(imageDataUrl) && !imageAttached,
      error: textInserted || imageDataUrl ? undefined : "Could not insert text into Perplexity.",
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || message.type !== "POPULATE") return;
    void populate(message.prompt ?? "", message.imageDataUrl ?? null)
      .then(sendResponse)
      .catch((err) => {
        sendResponse({
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    return true;
  });
})();
