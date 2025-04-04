import puppeteer, { ElementHandle, type Browser } from "puppeteer";
import puppeteerCore, { type Browser as BrowserCore } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

const ERRORS = {
  FAILED_TO_LOAD_IMG_SHIELDS_IO: "⛔️ Failed to load img.shields.io.",
  FAILED_TO_GET_TEXT: "⛔️ Failed to get text.",
  FAILED_TO_COPY: "⚠️ Failed to copy:",
  FAILED_TO_LOAD_PAGE: "⛔️ Failed to load page.",
  LIB_NOT_FOUND_IN_IMG_SHIELDS_IO:
    '⛔️ lib "$lib" is not found in img.shields.io.',
};

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const getImgShields = async (lib: string) => {
  const libName = lib.replace(/ /g, "%20");
  const libNameLowercased = lib.toLowerCase().replace(/ /g, "");
  const url = `https://simpleicons.org/?q=${libName}`;

  let browser: Browser | BrowserCore;
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
    browser = await puppeteerCore.launch({
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: "networkidle0" });
  } catch (error) {
    await browser.close();
    return {
      error:
      ERRORS.FAILED_TO_LOAD_IMG_SHIELDS_IO + ": " + (error as Error).message,
    };
  }
  
  const html = await page.content();
  if (html.includes("Loading...")) {
    await browser.close();
    return {
      error: ERRORS.FAILED_TO_LOAD_PAGE,
    };
  }
  
  const button = (await page.$(
    "li:first-of-type div button"
  )) as ElementHandle<HTMLButtonElement>;

  if (!button) {
    await browser.close();
    return {
      error: ERRORS.LIB_NOT_FOUND_IN_IMG_SHIELDS_IO.replace("$lib", lib),
    };
  }

  const text = await button.evaluate((el) => el.textContent);
  if (!text) {
    await browser.close();
    return {
      error: ERRORS.FAILED_TO_GET_TEXT,
    };
  }

  const color = text.split("#")[1];
  const markdown = `![${lib}](https://img.shields.io/badge/${libName}-${color}?style=flat-square&logo=${libNameLowercased}&logoColor=white)`;

  await browser.close();
  return { markdown };
};
