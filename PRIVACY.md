# AskIt Privacy Policy

Effective date: August 30, 2026

AskIt is a browser extension that prepares content for third-party AI web applications. This policy describes what the extension processes, where that data goes, and how long it remains in the browser.

## Data AskIt processes

AskIt processes content only after a user starts an action:

- text the user selected on a web page;
- the URL of the current page;
- a JPEG screenshot of the visible part of the current tab;
- the AI provider, task, target language, and custom question selected in the AskIt popup; and
- the user's default AI provider and last target language.

AskIt does not read or upload the HTML content of a page when the user chooses the URL action. It sends only the URL together with the prepared instruction.

## How data is used

Pending text, URLs, and screenshots are used to build the request shown in the chosen AI provider's composer. AskIt does not automatically submit the conversation. The user reviews the prepared content and clicks Send on the AI website.

When the user continues from the AskIt wizard, the prepared text and optional screenshot are transferred into the selected AI website. Image attachment may cause that website to begin uploading the screenshot before the user clicks Send.

## Storage and retention

- Pending text, URLs, screenshots, and their creation time are stored in `chrome.storage.session`.
- Successfully prepared pending content is removed unless AskIt needs to keep a screenshot for manual copy or drag-and-drop.
- Pending content older than 10 minutes is treated as expired and removed the next time AskIt initializes the popup.
- Session storage is also cleared when the browser session ends.
- The default AI provider and last target language are stored in `chrome.storage.local` until the user clears the extension's data or uninstalls AskIt.

AskIt does not use cookies for its own purposes.

## Data received by the developer

AskIt has no developer-operated backend, database, analytics, telemetry, advertising, or API-key service. The developer does not receive the text, URLs, screenshots, prompts, or settings processed by the extension.

## Third-party AI services

The user chooses which third-party service receives prepared content. The selected service processes that data under its own terms and privacy policy:

- [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy/)
- [Google Privacy Policy](https://policies.google.com/privacy)
- [Anthropic Privacy Policy](https://www.anthropic.com/legal/privacy)
- [Perplexity Privacy Policy](https://www.perplexity.ai/hub/legal/privacy-policy)

AskIt is an independent project and is not affiliated with or endorsed by these providers.

## Browser permissions

AskIt uses:

- `activeTab` to read the active page URL after a user action and to capture the visible tab;
- `contextMenus` to offer the selected-text action;
- `storage` for session content and local preferences;
- `scripting` to fill the selected AI site's composer; and
- host access limited to the supported ChatGPT, Gemini, Claude, and Perplexity domains.

AskIt does not request access to all websites.

## Security

The extension ships its runtime code locally and does not load remote executable code. Users should still avoid sending information they do not want the selected AI provider to process.

## Changes to this policy

Material changes will be published in this repository and on the hosted policy page with an updated effective date.

## Contact

For privacy questions, open an issue in the [AskIt GitHub repository](https://github.com/batuhanberk06/askit/issues). GitHub issues are public; do not include confidential or personal content.
