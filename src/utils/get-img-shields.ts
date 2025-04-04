import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright";

const ERRORS = {
  FAILED_TO_LOAD_IMG_SHIELDS_IO: "⛔️ Failed to load img.shields.io.",
  FAILED_TO_GET_TEXT: "⛔️ Failed to get text.",
  FAILED_TO_COPY: "⚠️ Failed to copy:",
  FAILED_TO_LOAD_PAGE: "⛔️ Failed to load page.",
  LIB_NOT_FOUND_IN_IMG_SHIELDS_IO:
    '⛔️ lib "$lib" is not found in img.shields.io.',
};

interface GetImgShieldsProps {
  lib: string;
}

export const getImgShields = async ({ lib }: GetImgShieldsProps) => {
  const libName = lib.replace(/ /g, "%20");
  const libNameLowercased = lib.toLowerCase().replace(/ /g, "");
  const url = `https://simpleicons.org/?q=${libName}`;

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url);
  } catch (error) {
    await page.close();
    await browser.close();
    return {
      error: ERRORS.FAILED_TO_LOAD_IMG_SHIELDS_IO,
    };
  }

  const html = await page.content();
  if (html.includes("Loading...")) {
    await page.close();
    await browser.close();
    return {
      error: ERRORS.FAILED_TO_LOAD_PAGE,
    };
  }
  const elements = await page.getByText("#");
  if (!elements || !(await elements.count())) {
    await page.close();
    await browser.close();
    return {
      error: ERRORS.LIB_NOT_FOUND_IN_IMG_SHIELDS_IO.replace("$lib", lib),
    };
  }

  const target = elements.first();
  const text = await target.textContent();

  if (!text) {
    await page.close();
    await browser.close();
    return {
      error: ERRORS.FAILED_TO_GET_TEXT,
    };
  }

  const color = text.split("#")[1];
  const markdown = `![${lib}](https://img.shields.io/badge/${libName}-${color}?style=flat-square&logo=${libNameLowercased}&logoColor=white)`;
  
  await page.close();
  await browser.close();
  return { markdown };
};
