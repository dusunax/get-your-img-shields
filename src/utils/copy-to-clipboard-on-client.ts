declare const navigator: Navigator;
declare const document: Document;

export const copyToClipboardOnClient = async (text: string) => {
  try {
    if (typeof navigator !== "undefined" && "clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else if (typeof document !== "undefined" && document.body) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    console.log("\n📋 Skill tag copied to clipboard.");
  } catch (error) {
    console.error("\n⚠️ Failed to copy:", error);
  }
};
