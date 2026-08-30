import { captureVisibleTab } from "../capture/screenshot.js";
import { getProvider } from "../providers/registry.js";
import { clearPending, getPending, setPending } from "../storage/pending.js";
import { getSettings, saveSettings } from "../storage/settings.js";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "send-to-ai-selection",
      title: "Ask selected text with AskIt",
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== "send-to-ai-selection") return;
  const text = (info.selectionText || "").trim();
  if (!text) return;
  void (async () => {
    await setPending({ kind: "text", text });
    await openSendUi();
  })();
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== "capture-screenshot") return;
  void startScreenshot(tab?.windowId);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  void handleMessage(message)
    .then(sendResponse)
    .catch((err) => {
      sendResponse({
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    });
  return true;
});

async function handleMessage(message) {
  switch (message.type) {
    case "START_TEXT":
      await startText(message.text, message.openUi !== false);
      return { ok: true };
    case "START_URL":
      await startUrl(message.url, message.openUi !== false);
      return { ok: true };
    case "START_SCREENSHOT":
      await startScreenshot(message.windowId, message.openUi !== false);
      return { ok: true };
    case "GET_PENDING":
      return { pending: await getPending() };
    case "GET_SETTINGS":
      return { settings: await getSettings() };
    case "SAVE_SETTINGS":
      return { settings: await saveSettings(message.settings) };
    case "CLEAR_PENDING":
      await clearPending();
      await chrome.action.setBadgeText({ text: "" });
      return { ok: true };
    case "DELIVER":
      return deliver(message.providerId, message.promptText, message.imageDataUrl);
    default:
      return { ok: false, error: "Unknown message" };
  }
}

async function startText(text, openUi = true) {
  await setPending({ kind: "text", text: text.trim() });
  if (openUi) await openSendUi();
}

function isRestrictedPageUrl(url) {
  if (!url) return true;
  const lower = url.toLowerCase();
  return (
    lower.startsWith("chrome://") ||
    lower.startsWith("chrome-extension://") ||
    lower.startsWith("chrome-search://") ||
    lower.startsWith("edge://") ||
    lower.startsWith("about:") ||
    lower.startsWith("devtools:") ||
    lower.startsWith("view-source:") ||
    lower.startsWith("brave://")
  );
}

async function startUrl(url, openUi = true) {
  if (isRestrictedPageUrl(url)) {
    throw new Error("This page has no sendable URL.");
  }
  await setPending({ kind: "url", url });
  if (openUi) await openSendUi();
}

async function startScreenshot(windowId, openUi = true) {
  const screenshotDataUrl = await captureVisibleTab(windowId);
  await setPending({ kind: "screenshot", screenshotDataUrl });
  if (openUi) await openSendUi();
}

async function openSendUi() {
  await chrome.action.setBadgeText({ text: "" });
  try {
    await chrome.action.openPopup();
  } catch {
    await chrome.action.setBadgeText({ text: "1" });
    await chrome.action.setBadgeBackgroundColor({ color: "#3B82F6" });
  }
}

async function deliver(providerId, promptText, imageDataUrl) {
  const provider = getProvider(providerId);
  const result = await provider.deliver({ promptText, imageDataUrl });
  if (result.ok && !result.needsManualImage) {
    await clearPending();
    await chrome.action.setBadgeText({ text: "" });
  }
  return result;
}
