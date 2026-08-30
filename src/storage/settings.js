import { UI_LANG_TO_NAME } from "../shared/actions.js";

const SETTINGS_KEY = "settings";

function defaultLanguageName() {
  const short = chrome.i18n.getUILanguage().toLowerCase().split("-")[0];
  return UI_LANG_TO_NAME[short] ?? "English";
}

export const DEFAULT_SETTINGS = {
  defaultProvider: "chatgpt",
  lastTargetLanguage: "English",
};

const READY_PROVIDERS = new Set(["chatgpt", "gemini", "claude", "perplexity"]);

function normalizeProvider(id) {
  return READY_PROVIDERS.has(id) ? id : DEFAULT_SETTINGS.defaultProvider;
}

export async function getSettings() {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  const stored = result[SETTINGS_KEY] ?? {};
  return {
    defaultProvider: normalizeProvider(stored.defaultProvider),
    lastTargetLanguage: stored.lastTargetLanguage || defaultLanguageName(),
  };
}

export async function saveSettings(patch) {
  const current = await getSettings();
  const next = {
    defaultProvider: normalizeProvider(patch.defaultProvider ?? current.defaultProvider),
    lastTargetLanguage: patch.lastTargetLanguage ?? current.lastTargetLanguage,
  };
  await chrome.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}
