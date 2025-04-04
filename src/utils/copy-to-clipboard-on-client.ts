const navigator: any = {};
const document: any = {};

export const copyToClipboardOnClient = async (text: string) => {
  try {
    if (navigator && "clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
    } else if (document && document.body) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    console.log("\n📋 Skill tag copied to clipboard.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("\n⚠️ Failed to copy:", error.message);
    } else {
      console.error("\n⚠️ Failed to copy:", error);
    }
  }
};
