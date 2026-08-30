# AskIt — Chrome Web Store Listing

Use this document as the source of truth when completing the Chrome Web Store form.

## Product details

- Name: `AskIt`
- Version: `0.5.0`
- Primary language: English
- Category: Productivity
- Homepage: <https://batuhanberk06.github.io/askit/>
- Support: <https://batuhanberk06.github.io/askit/support.html>
- Privacy policy: <https://batuhanberk06.github.io/askit/privacy.html>

## Short description

See something. Ask anything. Prepare selected text, screenshots, or page URLs for ChatGPT, Gemini, Claude, or Perplexity.

## Detailed description

AskIt helps you prepare content for the AI web apps you already use.

Start from selected text, a visible-tab screenshot, or the current page URL. Choose ChatGPT, Gemini, Claude, or Perplexity, then pick a task:

- Summarize
- Translate
- Explain
- Fact-check
- Extract information
- Ask your own question

AskIt opens the chosen AI website and fills its composer. It never clicks Send. You review the prepared content and send the message yourself.

For page actions, AskIt shares only the URL; it does not read or upload the page HTML. Screenshot attachment depends on the current AI website. If automatic attachment is unavailable, AskIt can keep a preview for manual copy or drag-and-drop.

AskIt has no developer-operated backend, analytics, advertising, API keys, or separate account system. Pending content is held in browser session storage. Your default AI and translation language are stored locally.

The selected AI service may require sign-in and processes content under its own terms and privacy policy.

## Single purpose

AskIt prepares user-selected text, a visible-tab screenshot, or the current page URL and places the resulting request into a user-chosen AI web app for the user to review and send.

## Permission justifications

### `activeTab`

Used only after a user action to read the active tab's URL for “Ask about this page” or capture the visible tab for the screenshot action. AskIt does not request access to all sites.

### `contextMenus`

Adds “Ask selected text with AskIt” to the selection context menu. The menu label does not display the selected content.

### `storage`

Stores pending text, URL, or screenshot data in `chrome.storage.session`. Stores the default provider and last translation language in `chrome.storage.local`.

### `scripting`

Injects the bundled provider-specific script when needed so AskIt can fill the chosen AI website's composer. All executable code is included in the extension package.

### Host permissions

Access is limited to supported ChatGPT, Gemini, Claude, and Perplexity domains. It is used to communicate with the provider-specific content script and fill the composer after the user completes the AskIt wizard.

The manifest also registers idle content scripts on these provider domains. They wait for an internal AskIt `POPULATE` message and do not alter the composer until the user initiates delivery.

## Privacy practices

Answer the store questionnaire conservatively and consistently with the published policy:

- Website content processed: user-selected text, page URLs, and visible-tab screenshots.
- User-provided prompt choices: task, target language, and optional custom question.
- Local preferences: default AI provider and last target language.
- Data use: provide AskIt's single purpose only.
- Developer collection: no developer server receives this data.
- Third-party transfer: prepared content is transferred to the AI provider chosen by the user.
- Selling data: no.
- Advertising, creditworthiness, or unrelated personalization: no.
- Analytics or telemetry: no.
- Remote executable code: no.

Do not state that data stays entirely on-device: it stays in the browser while pending, then is transferred to the chosen AI website when the user continues. A screenshot may begin uploading before the user clicks Send.

## Store assets

- 128×128 icon: `icons/icon-128.png`
- Use the owner-prepared store screenshots and promotional images.
- Confirm each uploaded screenshot is 1280×800 or 640×400 and contains only current AskIt behavior.

## Reviewer notes

1. AskIt does not auto-submit messages.
2. URL mode sends the URL string only, not page HTML.
3. No AskIt backend, analytics, advertising, or API key is used.
4. Provider scripts use bundled code and run only on the AI domains declared in the manifest.
5. Chrome 127+ is required for `chrome.action.openPopup()`.

## Before submission

- Confirm the public homepage, privacy, and support URLs return HTTP 200.
- Upload the ZIP produced by `scripts/package.ps1`.
- Upload at least one 1280×800 screenshot.
- Complete the privacy questionnaire using the disclosures above.
- Test the uploaded package in Chrome before submitting for review.
