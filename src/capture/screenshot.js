function jpegQualityForByteLength(bytes) {
  if (bytes > 4_500_000) return 55;
  if (bytes > 2_500_000) return 70;
  return 80;
}

export async function captureVisibleTab(windowId) {
  let targetWindowId = windowId;
  if (targetWindowId === undefined) {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    targetWindowId = tab?.windowId;
  }
  if (targetWindowId === undefined) {
    throw new Error("No window to capture.");
  }

  let quality = 80;
  let dataUrl = await chrome.tabs.captureVisibleTab(targetWindowId, {
    format: "jpeg",
    quality,
  });

  const bytes = Math.ceil((dataUrl.length * 3) / 4);
  const nextQuality = jpegQualityForByteLength(bytes);
  if (nextQuality < quality) {
    try {
      dataUrl = await chrome.tabs.captureVisibleTab(targetWindowId, {
        format: "jpeg",
        quality: nextQuality,
      });
    } catch {
      // Keep the first capture. Size limits are not a V1 blocker.
    }
  }

  return dataUrl;
}
