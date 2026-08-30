# AskIt Release Checklist

AskIt has no build step. The release artifact is a filtered ZIP containing only the extension runtime.

## 1. Repository preflight

- [ ] Work from the dedicated `batuhanberk06/askit` repository, not the parent `omenlite` repository.
- [ ] Confirm `manifest.json`, `icons/`, `src/`, bundled fonts, and font license files are committed.
- [ ] Confirm no credentials, `.pem` files, session data, or personal screenshots are tracked.
- [ ] Confirm `manifest.json` and the release notes use the intended version.
- [ ] Review the public [Privacy Policy](PRIVACY.md) and [Support](SUPPORT.md) text.

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\verify-release.ps1
```

## 2. Manual Chrome smoke test

Use Chrome 127 or newer. Reload the unpacked extension after every code or manifest change.

### General

- [ ] AskIt loads without manifest or service-worker errors.
- [ ] Icons appear at 16, 48, and 128 pixels.
- [ ] The context menu says “Ask selected text with AskIt” and does not display the selection.
- [ ] The toolbar popup opens and all settings controls are usable.
- [ ] Default AI and translation language persist after closing and reopening the popup.
- [ ] Restricted browser pages show a clear error instead of preparing a URL.

### Selected text

For ChatGPT, Gemini, Claude, and Perplexity:

- [ ] Select harmless sample text and start AskIt from the context menu.
- [ ] Choose at least one task and continue.
- [ ] Confirm the correct AI site opens with the full multiline prompt.
- [ ] Confirm AskIt does not click Send.

### Current page URL

For ChatGPT, Gemini, Claude, and Perplexity:

- [ ] Start “Ask about this page” from a normal HTTPS page.
- [ ] Confirm the prompt contains the exact page URL.
- [ ] Confirm no page HTML or title is added by AskIt.
- [ ] Confirm AskIt does not click Send.

### Screenshot

For ChatGPT, Gemini, Claude, and Perplexity:

- [ ] Capture a harmless visible tab from the popup or with `Alt+Shift+S`.
- [ ] Confirm the screenshot preview is correct.
- [ ] Continue and confirm both the instruction and image appear at the AI site.
- [ ] If attachment fails, confirm the popup keeps the copy/drag fallback.
- [ ] Confirm AskIt does not click Send.

### Task templates

Across the tests above, cover Summarize, Translate, Explain, Fact-check, Extract information, and Ask your own question. Verify the selected translation language and custom question appear correctly.

## 3. Create and inspect the package

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package.ps1
```

Expected output:

```text
dist/askit-<manifest-version>.zip
```

The ZIP root must contain only:

```text
manifest.json
icons/
src/
```

Do not add `ads/`, `docs/`, `store/`, repository documentation, or development scripts to the Chrome Web Store package.

## 4. Public pages and store form

- [ ] Create the dedicated `batuhanberk06/askit` GitHub repository and push this project as its root.
- [ ] In GitHub repository settings, enable Pages from the `main` branch and `/docs` folder.
- [ ] Confirm these public URLs return successfully:
  - `https://batuhanberk06.github.io/askit/`
  - `https://batuhanberk06.github.io/askit/privacy.html`
  - `https://batuhanberk06.github.io/askit/support.html`
- [ ] Use `store/listing.md` for descriptions, permission justifications, and privacy answers.
- [ ] Upload the store screenshots and promotional artwork already prepared by the owner.
- [ ] Upload `dist/askit-<manifest-version>.zip`.
- [ ] Complete the Chrome Web Store privacy questionnaire conservatively.
- [ ] Reconfirm that the uploaded draft shows the intended name, icon, version, homepage, support URL, and privacy URL.

## 5. Final release

- [ ] Install the exact ZIP submitted to the store in a clean Chrome profile and repeat one text, URL, and screenshot flow.
- [ ] Check the Chrome Web Store preview for clipped text or outdated screenshots.
- [ ] Tag the matching source revision only after the final package is accepted.
