import { chromium, type Browser, type Page } from "playwright-core";

const ERRORS = {
  FAILED_TO_LAUNCH_BROWSER: "⛔️ Failed to launch browser.",
  FAILED_TO_CONNECT_IMG_SHIELDS_IO: "⛔️ Failed to connect to img.shields.io.",
  FAILED_TO_GET_COLOR_TEXT: "⛔️ Failed to get color text.",
  FAILED_TO_LOAD_PAGE: "⛔️ Failed to load page.",
  LIB_NOT_FOUND_IN_IMG_SHIELDS_IO:
    '⛔️ lib "$lib" is not found in img.shields.io.',
  FAILED_TO_LOAD_IMAGE: "⛔️ Failed to load image.",
};

const getImgShieldsPlaywrightCore = async (lib: string) => {
  const libName = lib.replace(/ /g, "%20");
  const url = `https://simpleicons.org/?q=${libName}`;

  let browser: Browser;
  let page: Page;

  try {
    const executablePath =
      "https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar";
    browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-gpu", "--single-process"],
      executablePath,
      headless: true,
    });
  } catch (error) {
    return {
      error:
        ERRORS.FAILED_TO_LAUNCH_BROWSER + "\n  " + (error as Error).message,
    };
  }

  try {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
  } catch (error) {
    await browser.close();
    return {
      error:
        ERRORS.FAILED_TO_CONNECT_IMG_SHIELDS_IO +
        ": " +
        (error as Error).message,
    };
  }

  try {
    const html = await page.content();
    if (html.includes("Loading...")) {
      return {
        error: ERRORS.FAILED_TO_LOAD_PAGE,
      };
    }
    const colorElements = await page.getByText("#");
    const skillElements = await page.getByRole("heading", { level: 2 });
    if (
      !colorElements ||
      !(await colorElements.count()) ||
      !skillElements ||
      !(await skillElements.count())
    ) {
      return {
        error: ERRORS.LIB_NOT_FOUND_IN_IMG_SHIELDS_IO.replace("$lib", lib),
      };
    }
    const firstColor = colorElements.first();
    const firstSkill = skillElements.first();
    const colorText = await firstColor.textContent();
    const skillText = await firstSkill.textContent();
    if (!colorText || !skillText) {
      return {
        error: ERRORS.FAILED_TO_GET_COLOR_TEXT,
      };
    }

    const withoutHash = colorText.split("#")[1];
    const markdown = `![${skillText}](https://img.shields.io/badge/${skillText}-${withoutHash}?style=flat-square&logo=${skillText}&logoColor=white)`;

    return { markdown };
  } catch (error) {
    return {
      error: ERRORS.FAILED_TO_LOAD_IMAGE + ": " + (error as Error).message,
    };
  } finally {
    await browser.close();
  }
};

export default getImgShieldsPlaywrightCore;
