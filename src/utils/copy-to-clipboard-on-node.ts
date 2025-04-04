import { execSync } from "child_process";

export const copyToClipboardOnNode = async (text: string) => {
  try {
    const command =
      process.platform === "darwin"
        ? "pbcopy" // macOS
        : process.platform === "win32"
        ? "clip" // Windows
        : "xclip -selection clipboard"; // Linux

    execSync(`echo "${text}" | ${command}`, { encoding: "utf-8" });
    console.log("\n📋 Skill tag copied to clipboard.");
  } catch (error) {
    console.error("\n⚠️ Failed to copy:", error);
  }
};
