export const PENDING_KEY = "pendingSend";

export async function setPending(pending) {
  const record = {
    ...pending,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  await chrome.storage.session.set({ [PENDING_KEY]: record });
  return record;
}

export async function getPending() {
  const result = await chrome.storage.session.get(PENDING_KEY);
  return result[PENDING_KEY] ?? null;
}

export async function clearPending() {
  await chrome.storage.session.remove(PENDING_KEY);
}
