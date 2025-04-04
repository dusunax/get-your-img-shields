import { Browser, chromium } from "playwright";
import { copyToClipboardOnClient } from "./copy-to-clipboard-on-client";

const ERRORS = {
  FAILED_TO_LOAD_IMG_SHIELDS_IO: "⛔️ Failed to load img.shields.io.",
  FAILED_TO_GET_TEXT: "⛔️ Failed to get text.",
  FAILED_TO_COPY: "⚠️ Failed to copy:",
  FAILED_TO_LOAD_PAGE: "⛔️ Failed to load page.",
  LIB_NOT_FOUND_IN_IMG_SHIELDS_IO:
    '⛔️ lib "$lib" is not found in img.shields.io.',
};

const endConnection = async (browser: Browser, interval: NodeJS.Timeout) => {
  clearInterval(interval);
  await browser.close();
};

interface GetImgShieldsProps {
  lib: string;
  copy?: boolean;
}

export const getImgShields = async ({
  lib,
  copy = true,
}: GetImgShieldsProps) => {
  const libName = lib.replace(/ /g, "%20");
  const libNameLowercased = lib.toLowerCase().replace(/ /g, "");
  const url = `https://simpleicons.org/?q=${libName}`;

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  let dots = "";
  const loadingInterval = setInterval(() => {
    dots = dots.length < 10 ? dots + "." : "";
    process.stdout.write(`\r🔍 Searching${dots}`);
  }, 500);

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
  } catch (error) {
    endConnection(browser, loadingInterval);
    return {
      error:
        ERRORS.FAILED_TO_LOAD_IMG_SHIELDS_IO +
        "\n  " +
        (error as Error).message,
    };
  }

  const html = await page.content();
  if (html.includes("Loading...")) {
    endConnection(browser, loadingInterval);
    return {
      error: ERRORS.FAILED_TO_LOAD_PAGE,
    };
  }
  const elements = await page.getByText("#");
  if (!elements || !(await elements.count())) {
    endConnection(browser, loadingInterval);
    return {
      error: ERRORS.LIB_NOT_FOUND_IN_IMG_SHIELDS_IO.replace("$lib", lib),
    };
  }

  clearInterval(loadingInterval);
  const target = elements.first();
  const text = await target.textContent();

  if (!text) {
    endConnection(browser, loadingInterval);
    return {
      error: ERRORS.FAILED_TO_GET_TEXT,
    };
  }

  const color = text.split("#")[1];
  const markdown = `![${lib}](https://img.shields.io/badge/${libName}-${color}?style=flat-square&logo=${libNameLowercased}&logoColor=white)`;

  if (copy) {
    copyToClipboardOnClient(markdown);
  }

  await endConnection(browser, loadingInterval);
  console.log("\n📋 Skill tag copied to clipboard.");
  return { markdown };
};
