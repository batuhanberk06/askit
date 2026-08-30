const CHATGPT_URL = "https://chatgpt.com/";
const INJECT_FILE = "src/providers/chatgpt/inject.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForTabComplete(tabId, timeoutMs = 20000) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      chrome.tabs.onUpdated.removeListener(onUpdated);
      resolve();
    };

    const timeout = setTimeout(finish, timeoutMs);

    function onUpdated(id, info) {
      if (id === tabId && info.status === "complete") finish();
    }

    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.get(tabId).then((tab) => {
      if (tab.status === "complete") finish();
    }).catch(finish);
  });
}

async function injectIfNeeded(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [INJECT_FILE],
    });
  } catch {
    // Manifest content script may already be present.
  }
}

export const chatgptProvider = {
  id: "chatgpt",
  name: "ChatGPT",
  status: "ready",
  async deliver(request) {
    const tab = await chrome.tabs.create({ url: CHATGPT_URL, active: false });
    if (!tab.id) {
      return { ok: false, error: "Could not open ChatGPT." };
    }
    const tabId = tab.id;

    await waitForTabComplete(tabId);
    await injectIfNeeded(tabId);

    let lastError = "Could not reach the ChatGPT composer. Sign in and try again.";
    for (let attempt = 0; attempt < 40; attempt++) {
      try {
        const result = await chrome.tabs.sendMessage(tabId, {
          type: "POPULATE",
          prompt: request.promptText,
          imageDataUrl: request.imageDataUrl ?? null,
        });
        if (result) return { ...result, tabId };
      } catch (err) {
        lastError = err instanceof Error ? err.message : lastError;
        if (attempt === 4 || attempt === 12) {
          await injectIfNeeded(tabId);
        }
      }
      await sleep(250);
    }

    return { ok: false, error: lastError, tabId };
  },
};
