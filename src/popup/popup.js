import { ACTIONS, LANGUAGE_SUGGESTIONS } from "../shared/actions.js";
import { providers } from "../providers/registry.js";
import { buildPrompt } from "../prompts/build-prompt.js";
import { PENDING_KEY } from "../storage/pending.js";

const statusEl = document.querySelector("#status");
const errorEl = document.querySelector("#error");
const viewHome = document.querySelector("#view-home");
const viewSend = document.querySelector("#view-send");
const viewSettings = document.querySelector("#view-settings");
const defaultAiEl = document.querySelector("#default-ai");
const defaultLangEl = document.querySelector("#default-lang");
const panelDefaultAi = document.querySelector("#panel-default-ai");
const panelDefaultLang = document.querySelector("#panel-default-lang");
const toggleDefaultAi = document.querySelector("#toggle-default-ai");
const toggleDefaultLang = document.querySelector("#toggle-default-lang");
const settingsAiValue = document.querySelector("#settings-ai-value");
const settingsLangValue = document.querySelector("#settings-lang-value");
const chipRow = document.querySelector("#chip-row");
const aiList = document.querySelector("#ai-list");
const actionList = document.querySelector("#action-list");
const extraEl = document.querySelector("#extra");
const stepAi = document.querySelector("#step-ai");
const stepAction = document.querySelector("#step-action");
const stepStatus = document.querySelector("#step-status");
const statusText = document.querySelector("#status-text");
const fallbackImg = document.querySelector("#fallback-img");
const copyImageBtn = document.querySelector("#copy-image");
const prepareEl = document.querySelector("#prepare");
const stepperEl = document.querySelector("#stepper");
const headerTag = document.querySelector("#header-tag");

let pending = null;
let settings = null;
let providerId = "chatgpt";
let actionId = null;
let targetLanguage = "English";
let customInstruction = "";
let currentStep = "ai";
let wizardLive = false;

const ACTION_ICONS = {
  summarize:
    '<svg class="icon" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/></svg>',
  translate:
    '<svg class="icon" viewBox="0 0 256 256"><path d="M247.15,212.42l-56-112a8,8,0,0,0-14.31,0l-21.71,43.43A88,88,0,0,1,108,126.93,103.65,103.65,0,0,0,135.69,64H160a8,8,0,0,0,0-16H104V32a8,8,0,0,0-16,0V48H32a8,8,0,0,0,0,16h87.63A87.76,87.76,0,0,1,96,116.35a87.74,87.74,0,0,1-19-31,8,8,0,1,0-15.08,5.34A103.63,103.63,0,0,0,84,127a87.55,87.55,0,0,1-52,17,8,8,0,0,0,0,16,103.46,103.46,0,0,0,64-22.08,104.18,104.18,0,0,0,51.44,21.31l-26.6,53.19a8,8,0,0,0,14.31,7.16L148.94,192h70.11l13.79,27.58A8,8,0,0,0,240,224a8,8,0,0,0,7.15-11.58ZM156.94,176,184,121.89,211.05,176Z"/></svg>',
  explain:
    '<svg class="icon" viewBox="0 0 256 256"><path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/></svg>',
  "fact-check":
    '<svg class="icon" viewBox="0 0 256 256"><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM208,208V48H48V208H208Z"/></svg>',
  extract:
    '<svg class="icon" viewBox="0 0 256 256"><path d="M208,88H48a16,16,0,0,0-16,16v96a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104A16,16,0,0,0,208,88Zm0,112H48V104H208v96ZM48,64a8,8,0,0,1,8-8H200a8,8,0,0,1,0,16H56A8,8,0,0,1,48,64ZM64,32a8,8,0,0,1,8-8H184a8,8,0,0,1,0,16H72A8,8,0,0,1,64,32Z"/></svg>',
  custom:
    '<svg class="icon" viewBox="0 0 256 256"><path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z"/></svg>',
};

function setStatus(text) {
  statusEl.textContent = text;
}

function showError(text) {
  errorEl.textContent = text;
}

function showView(name) {
  viewHome.hidden = name !== "home";
  viewSend.hidden = name !== "send";
  viewSettings.hidden = name !== "settings";
  if (name === "home") headerTag.textContent = "See something. Ask anything.";
  if (name === "settings") {
    headerTag.textContent = "Settings";
    renderSettings();
  }
  if (name === "send" && pending) headerTag.textContent = kindLabel(pending.kind);
}

function renderStepper(step) {
  if (step === "status") {
    stepperEl.hidden = true;
    return;
  }
  stepperEl.hidden = false;
  const current = step === "ai" ? 1 : 2;
  const steps = [
    { n: 1, label: "Choose AI" },
    { n: 2, label: "Action" },
  ];
  stepperEl.replaceChildren();
  for (const s of steps) {
    const item = document.createElement("span");
    item.className = `step-item${s.n === current ? " active" : s.n < current ? " done" : ""}`;
    const num = document.createElement("span");
    num.className = "step-num";
    num.textContent = String(s.n);
    const lbl = document.createElement("span");
    lbl.className = "step-label";
    lbl.textContent = s.label;
    item.append(num, lbl);
    stepperEl.append(item);
    if (s.n < steps.length) {
      const line = document.createElement("span");
      line.className = "step-line";
      stepperEl.append(line);
    }
  }
}

function showStep(step) {
  currentStep = step;
  stepAi.hidden = step !== "ai";
  stepAction.hidden = step !== "action";
  stepStatus.hidden = step !== "status";
  renderStepper(step);
}

function selectedProviderName() {
  return providers.find((item) => item.id === providerId)?.name ?? "AI";
}

function kindLabel(kind) {
  if (kind === "url") return "Page URL";
  if (kind === "screenshot") return "Screenshot";
  return "Selected text";
}

function collapseAllPanels() {
  panelDefaultAi.hidden = true;
  panelDefaultLang.hidden = true;
  toggleDefaultAi.setAttribute("aria-expanded", "false");
  toggleDefaultLang.setAttribute("aria-expanded", "false");
}

function renderSettingsLanguage() {
  defaultLangEl.replaceChildren();
  const current = settings?.lastTargetLanguage || "English";
  settingsLangValue.textContent = current;
  for (const name of LANGUAGE_SUGGESTIONS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    if (name === current) btn.classList.add("active");
    btn.addEventListener("click", () => {
      settings.lastTargetLanguage = name;
      targetLanguage = name;
      void chrome.runtime.sendMessage({
        type: "SAVE_SETTINGS",
        settings: { lastTargetLanguage: name },
      });
      renderSettingsLanguage();
    });
    defaultLangEl.append(btn);
  }
}

function renderSettings() {
  collapseAllPanels();
  settingsAiValue.textContent = providers.find((p) => p.id === settings.defaultProvider)?.name ?? "ChatGPT";
  settingsLangValue.textContent = settings?.lastTargetLanguage || "English";
}

function renderHomeProviders() {
  defaultAiEl.replaceChildren();
  for (const provider of providers) {
    const row = document.createElement("label");
    row.className = `select-card${provider.status === "coming_soon" ? " disabled" : ""}${
      provider.id === settings.defaultProvider ? " selected" : ""
    }`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "default-ai";
    input.value = provider.id;
    input.checked = provider.id === settings.defaultProvider;
    input.disabled = provider.status === "coming_soon";
    const mark = document.createElement("span");
    mark.className = "select-mark";
    mark.innerHTML = '<svg class="icon" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>';
    const body = document.createElement("span");
    body.className = "select-body";
    const title = document.createElement("span");
    title.className = "select-title";
    title.textContent = provider.name;
    if (provider.status === "coming_soon") {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "Soon";
      title.append(" ", badge);
    }
    body.append(title);
    row.append(input, mark, body);
    if (provider.status === "ready") {
      input.addEventListener("change", () => {
        settings.defaultProvider = provider.id;
        settingsAiValue.textContent = provider.name;
        void chrome.runtime.sendMessage({
          type: "SAVE_SETTINGS",
          settings: { defaultProvider: provider.id },
        });
        renderHomeProviders();
      });
    }
    defaultAiEl.append(row);
  }
}

function renderChip() {
  chipRow.replaceChildren();
  if (!pending) return;
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = kindLabel(pending.kind);
  chipRow.append(chip);
  if (pending.kind === "screenshot" && pending.screenshotDataUrl) {
    const img = document.createElement("img");
    img.className = "preview";
    img.alt = "";
    img.src = pending.screenshotDataUrl;
    chipRow.append(img);
  }
}

function renderAi() {
  aiList.replaceChildren();
  for (const provider of providers) {
    const disabled = provider.status === "coming_soon";
    const row = document.createElement("label");
    row.className = `select-card${provider.id === providerId ? " selected" : ""}${disabled ? " disabled" : ""}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "ai";
    input.value = provider.id;
    input.checked = provider.id === providerId;
    input.disabled = disabled;
    const mark = document.createElement("span");
    mark.className = "select-mark";
    mark.innerHTML = '<svg class="icon" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>';
    const body = document.createElement("span");
    body.className = "select-body";
    const title = document.createElement("span");
    title.className = "select-title";
    title.textContent = provider.name;
    if (disabled) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "Soon";
      title.append(" ", badge);
    }
    body.append(title);
    row.append(input, mark, body);
    if (!disabled) {
      row.addEventListener("click", () => {
        providerId = provider.id;
        renderAi();
      });
    }
    aiList.append(row);
  }
}

function renderExtra() {
  extraEl.replaceChildren();
  if (actionId === "translate") {
    const field = document.createElement("div");
    field.className = "field";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Language";
    input.value = targetLanguage;
    input.addEventListener("input", () => {
      targetLanguage = input.value;
      renderLanguageChips(input);
      updateActionContinue();
    });
    field.append(input);
    extraEl.append(field);
    const chips = document.createElement("div");
    chips.className = "chips";
    extraEl.append(chips);
    renderLanguageChips(input, chips);
  }
  if (actionId === "custom") {
    const field = document.createElement("div");
    field.className = "field";
    const area = document.createElement("textarea");
    area.placeholder = "What would you like to ask?";
    area.value = customInstruction;
    area.addEventListener("input", () => {
      customInstruction = area.value;
      updateActionContinue();
    });
    field.append(area);
    extraEl.append(field);
  }
}

function renderLanguageChips(input, chipsEl) {
  const chips = chipsEl || extraEl.querySelector(".chips");
  if (!chips) return;
  chips.replaceChildren();
  const typed = targetLanguage.trim().toLowerCase();
  for (const name of LANGUAGE_SUGGESTIONS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = name;
    if (name.toLowerCase() === typed) btn.classList.add("active");
    btn.addEventListener("click", () => {
      targetLanguage = name;
      input.value = name;
      renderLanguageChips(input, chips);
      updateActionContinue();
    });
    chips.append(btn);
  }
}

function renderActions() {
  actionList.replaceChildren();
  for (const action of ACTIONS) {
    const row = document.createElement("label");
    row.className = `select-card${action.id === actionId ? " selected" : ""}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "action";
    input.value = action.id;
    input.checked = action.id === actionId;
    const mark = document.createElement("span");
    mark.className = "select-mark";
    mark.innerHTML = '<svg class="icon" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg>';
    const icon = document.createElement("span");
    icon.className = "action-icon";
    icon.innerHTML = ACTION_ICONS[action.id] || "";
    const body = document.createElement("span");
    body.className = "select-body";
    const title = document.createElement("span");
    title.className = "select-title";
    title.textContent = action.label;
    body.append(title);
    row.append(input, mark, icon, body);
    row.addEventListener("click", () => {
      actionId = action.id;
      renderActions();
    });
    actionList.append(row);
  }
  renderExtra();
  updateActionContinue();
}

function updateActionContinue() {
  const ready =
    Boolean(actionId) && (actionId !== "translate" || Boolean(targetLanguage.trim()));
  document.querySelector("#continue-action").disabled = !ready;
}

function resetWizardFields() {
  actionId = null;
  customInstruction = "";
  providerId = settings?.defaultProvider || "chatgpt";
  targetLanguage = settings?.lastTargetLanguage || "English";
  currentStep = "ai";
  showError("");
}

function discardSend() {
  wizardLive = false;
  pending = null;
  resetWizardFields();
  void chrome.runtime.sendMessage({ type: "CLEAR_PENDING" });
  showView("home");
}

function openWizard(resetSteps = true) {
  wizardLive = true;
  showView("send");
  if (resetSteps) {
    resetWizardFields();
    showStep("ai");
  } else {
    showStep(currentStep);
  }
  showError("");
  renderChip();
  renderAi();
  renderActions();
  document.querySelector("#continue-ai").disabled = !pending;
}

function isFreshPending(record) {
  const PENDING_TTL_MS = 10 * 60 * 1000;
  return Boolean(record?.createdAt) && Date.now() - record.createdAt < PENDING_TTL_MS;
}

async function focusDeliveredTab(result) {
  if (!result?.tabId) return;
  try {
    await chrome.tabs.update(result.tabId, { active: true });
  } catch {
    // Tab was closed before we could focus it.
  }
}

document.querySelector("#ask-page").addEventListener("click", async () => {
  setStatus("");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.runtime.sendMessage({
    type: "START_URL",
    url: tab?.url ?? "",
    openUi: false,
  });
  if (result?.error) {
    setStatus(result.error);
    return;
  }
  pending = (await chrome.runtime.sendMessage({ type: "GET_PENDING" })).pending;
  openWizard();
});

document.querySelector("#capture").addEventListener("click", async () => {
  setStatus("");
  const current = await chrome.windows.getCurrent();
  const result = await chrome.runtime.sendMessage({
    type: "START_SCREENSHOT",
    windowId: current.id,
    openUi: false,
  });
  if (result?.error) {
    setStatus(result.error);
    return;
  }
  pending = (await chrome.runtime.sendMessage({ type: "GET_PENDING" })).pending;
  openWizard();
});

document.querySelector("#open-settings").addEventListener("click", () => {
  showView("settings");
});

toggleDefaultAi.addEventListener("click", () => {
  const isOpen = !panelDefaultAi.hidden;
  collapseAllPanels();
  if (!isOpen) {
    renderHomeProviders();
    panelDefaultAi.hidden = false;
    toggleDefaultAi.setAttribute("aria-expanded", "true");
  }
});

toggleDefaultLang.addEventListener("click", () => {
  const isOpen = !panelDefaultLang.hidden;
  collapseAllPanels();
  if (!isOpen) {
    renderSettingsLanguage();
    panelDefaultLang.hidden = false;
    toggleDefaultLang.setAttribute("aria-expanded", "true");
  }
});

document.querySelector("#back-settings").addEventListener("click", () => {
  showView("home");
});

document.querySelector("#close-popup").addEventListener("click", () => {
  window.close();
});

document.querySelector("#continue-ai").addEventListener("click", () => {
  if (!pending) {
    showError("Nothing to send yet.");
    return;
  }
  showError("");
  showStep("action");
});

document.querySelector("#back-ai").addEventListener("click", () => {
  discardSend();
});

document.querySelector("#back-action").addEventListener("click", () => {
  showError("");
  showStep("ai");
});

document.querySelector("#back-status").addEventListener("click", () => {
  showError("");
  prepareEl.classList.remove("done");
  showStep("action");
});

document.querySelector("#continue-action").addEventListener("click", () => {
  void deliver();
});

copyImageBtn.addEventListener("click", async () => {
  const src = pending?.screenshotDataUrl;
  if (!src) return;
  try {
    const blob = await (await fetch(src)).blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    statusText.textContent = `Copied. Paste into ${selectedProviderName()}, then send it yourself.`;
    statusText.className = "status-msg ok";
  } catch {
    statusText.textContent = `Copy failed. Drag the image onto ${selectedProviderName()}.`;
    statusText.className = "status-msg error";
  }
});

async function deliver() {
  if (!pending || !actionId) {
    showError("Choose a task.");
    return;
  }
  if (actionId === "translate" && !targetLanguage.trim()) {
    showError("Type a language first.");
    return;
  }

  const promptText = buildPrompt({
    kind: pending.kind,
    action: actionId,
    text: pending.text,
    url: pending.url,
    customInstruction,
    targetLanguage: targetLanguage.trim(),
  });

  showError("");
  showStep("status");
  prepareEl.classList.remove("done", "status-ok", "status-error", "status-manual");
  statusText.className = "status-msg";
  statusText.textContent = `Opening ${selectedProviderName()}…`;
  fallbackImg.hidden = true;
  copyImageBtn.hidden = true;

  if (targetLanguage.trim() !== settings?.lastTargetLanguage) {
    settings.lastTargetLanguage = targetLanguage.trim();
    void chrome.runtime.sendMessage({
      type: "SAVE_SETTINGS",
      settings: { lastTargetLanguage: targetLanguage.trim() },
    });
  }

  const result = await chrome.runtime.sendMessage({
    type: "DELIVER",
    providerId,
    promptText,
    imageDataUrl: pending.screenshotDataUrl,
  });

  prepareEl.classList.add("done");

  if (!result?.ok && !result?.needsManualImage) {
    prepareEl.classList.add("status-error");
    statusText.textContent = result?.error || `Could not prepare ${selectedProviderName()}.`;
    statusText.className = "status-msg error";
    await focusDeliveredTab(result);
    return;
  }

  if (result.needsManualImage && pending.screenshotDataUrl) {
    prepareEl.classList.add("status-manual");
    statusText.textContent = `Copy or drag the screenshot into ${selectedProviderName()}, then send.`;
    statusText.className = "status-msg";
    fallbackImg.src = pending.screenshotDataUrl;
    fallbackImg.hidden = false;
    copyImageBtn.hidden = false;
    return;
  }

  prepareEl.classList.add("status-ok");
  statusText.textContent = `Ready in ${selectedProviderName()}. Send it yourself.`;
  statusText.className = "status-msg ok";
  await focusDeliveredTab(result);
}

async function init() {
  try {
    const settingsRes = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    settings = settingsRes?.settings ?? null;
  } catch {
    settings = null;
  }
  if (!settings) {
    settings = { defaultProvider: "chatgpt", lastTargetLanguage: "English" };
  }
  providerId = settings.defaultProvider || "chatgpt";
  targetLanguage = settings.lastTargetLanguage || "English";
  renderSettings();

  chrome.storage.session.onChanged.addListener((changes) => {
    const next = changes[PENDING_KEY]?.newValue;
    if (next && isFreshPending(next) && !wizardLive) {
      pending = next;
      void chrome.action.setBadgeText({ text: "" });
      openWizard(true);
    }
  });

  try {
    const existing = (await chrome.runtime.sendMessage({ type: "GET_PENDING" })).pending;
    if (existing && isFreshPending(existing)) {
      pending = existing;
      void chrome.action.setBadgeText({ text: "" });
      openWizard(true);
    } else {
      if (existing) void chrome.runtime.sendMessage({ type: "CLEAR_PENDING" });
      pending = null;
      showView("home");
    }
  } catch {
    pending = null;
    showView("home");
  }
}

window.addEventListener("pagehide", () => {
  wizardLive = false;
  void chrome.action.setBadgeText({ text: "" });
});

void init();
