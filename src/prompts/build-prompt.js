function instruction(input) {
  const language = (input.targetLanguage || "").trim() || "English";

  if (input.action === "custom") {
    return (input.customInstruction || "").trim();
  }

  if (input.kind === "url") {
    if (input.action === "summarize") {
      return "Summarize the content of this link. Use the page it points to, not the URL itself:";
    }
    if (input.action === "translate") {
      return `Translate the content of this link to ${language}. Use the page it points to, not the URL itself:`;
    }
    if (input.action === "explain") {
      return "Explain the content of this link. Use the page it points to, not the URL itself:";
    }
    if (input.action === "fact-check") {
      return "Fact-check the content of this link. Use the page it points to, not the URL itself:";
    }
    if (input.action === "extract") {
      return "Extract the important points from the content of this link. Use the page it points to, not the URL itself:";
    }
  }

  if (input.action === "summarize") return "Summarize this:";
  if (input.action === "translate") return `Translate this to ${language}:`;
  if (input.action === "explain") return "Explain this:";
  if (input.action === "fact-check") return "Fact-check this:";
  if (input.action === "extract") return "Extract the important points from this:";
  return "";
}

function body(input) {
  if (input.kind === "url") return (input.url || "").trim();
  if (input.kind === "screenshot") return "";
  return (input.text || "").trim();
}

export function buildPrompt(input) {
  const head = instruction(input);
  const content = body(input);
  if (!head) return content;
  if (!content) return head;
  return `${head}\n\n${content}`;
}
