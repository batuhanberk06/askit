# AskIt

**See something. Ask anything.**

AskIt is a Chrome extension that prepares selected text, the current page URL, or a visible-tab screenshot for ChatGPT, Gemini, Claude, or Perplexity.

It has no model, backend, analytics, API keys, or AskIt account system. AskIt opens the AI web app you choose and fills its composer. It never clicks Send; you review and send the message yourself.

## Features

- Send selected text from the page context menu.
- Capture the visible tab with `Alt+Shift+S` or the popup.
- Ask about the current page by sharing its URL. AskIt does not read or upload the page HTML.
- Choose from Summarize, Translate, Explain, Fact-check, Extract information, or a custom question.
- Use ChatGPT, Gemini, Claude, or Perplexity.
- Keep a default AI and translation language locally.

Screenshot attachment depends on the current AI website. If automatic attachment is unavailable, AskIt keeps a preview so you can copy or drag the image manually. An account or sign-in may be required by the AI provider.

## Install locally

AskIt requires Chrome 127 or newer.

1. Download or clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose the folder containing `manifest.json`.

There is no Node/npm build step.

## Use

1. Start with one of these:
   - select text, right-click, and choose **Ask selected text with AskIt**;
   - press `Alt+Shift+S` or choose **Capture screenshot**; or
   - open the toolbar popup and choose **Ask about this page**.
2. Choose an AI and a task.
3. Continue to open the chosen AI website with the prepared content.
4. Review the result in the AI composer and click Send yourself.

## Privacy

Pending text, URLs, and screenshots are kept in `chrome.storage.session`. The default AI and translation language are kept in `chrome.storage.local`. AskIt has no developer-operated server and does not receive this data.

When you continue from the wizard, the prepared content is transferred to the AI website you selected. A screenshot may begin uploading to that provider before you click Send. See the [Privacy Policy](PRIVACY.md) for retention details and third-party services.

Published policy: <https://batuhanberk06.github.io/askit/privacy.html>

## Support

Read [Support](SUPPORT.md) or [open a GitHub issue](https://github.com/batuhanberk06/askit/issues/new). Do not include private text, screenshots, credentials, or personal information in a public issue.

## Release

Release packaging and the manual provider test matrix are documented in [RELEASE.md](RELEASE.md). The Chrome Web Store ZIP contains only `manifest.json`, `icons/`, and `src/`.

## License

No open-source license is granted for AskIt. All rights are reserved. Third-party components remain under their respective licenses; see [Third-Party Notices](THIRD_PARTY_NOTICES.md).
