import { chatgptProvider } from "./chatgpt/chatgpt-provider.js";
import { geminiProvider } from "./gemini/gemini-provider.js";
import { claudeProvider } from "./claude/claude-provider.js";
import { perplexityProvider } from "./perplexity/perplexity-provider.js";

export const providers = [
  chatgptProvider,
  geminiProvider,
  claudeProvider,
  perplexityProvider,
];

export function getProvider(id) {
  const found = providers.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown provider: ${id}`);
  return found;
}
