import { execSync } from "child_process";

const navigator: any = {};
const document: any = {};

export const copyToClipboard = async (text: string) => {
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
    } else {
      const command =
        process.platform === "darwin"
          ? "pbcopy" // macOS
          : process.platform === "win32"
          ? "clip" // Windows
          : "xclip -selection clipboard"; // Linux

      execSync(`echo "${text}" | ${command}`, { encoding: "utf-8" });
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
