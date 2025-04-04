import puppeteerCore, {
  type Browser as BrowserCore,
  type Page as PageCore,
  ElementHandle,
} from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const ERRORS = {
  FAILED_TO_LAUNCH_BROWSER: "⛔️ Failed to launch browser.",
  FAILED_TO_CONNECT_IMG_SHIELDS_IO: "⛔️ Failed to connect to img.shields.io.",
  FAILED_TO_GET_COLOR_TEXT: "⛔️ Failed to get color text.",
  FAILED_TO_LOAD_PAGE: "⛔️ Failed to load page.",
  LIB_NOT_FOUND_IN_IMG_SHIELDS_IO:
    '⛔️ lib "$lib" is not found in img.shields.io.',
  FAILED_TO_LOAD_IMAGE: "⛔️ Failed to load image.",
};

export const dynamic = "force-dynamic";

export const getImgShieldsCore = async (lib: string) => {
  const libName = lib.replace(/ /g, "%20");
  const url = `https://simpleicons.org/?q=${libName}`;

  chromium.setGraphicsMode = false;
  let browser: BrowserCore;
  let page: PageCore;

  try {
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar"
    );
    if (!executablePath) {
      return {
        error: "Failed to get executable path",
        executablePath,
      };
    }
    browser = await puppeteerCore.launch({
      executablePath,
      args: chromium.args,
      headless: chromium.headless as boolean | "shell" | undefined,
      defaultViewport: chromium.defaultViewport,
    });
  } catch (error) {
    return {
      error: ERRORS.FAILED_TO_LAUNCH_BROWSER + ": " + (error as Error).message,
    };
  }

  try {
    page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });
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

    const button = (await page.$(
      "li:first-of-type div button"
    )) as ElementHandle<HTMLButtonElement>;
    const h2 = (await page.$(
      "li:first-of-type h2"
    )) as ElementHandle<HTMLHeadingElement>;

    if (!button || !h2) {
      return {
        error: ERRORS.LIB_NOT_FOUND_IN_IMG_SHIELDS_IO.replace("$lib", lib),
      };
    }

    const colorText = await button.evaluate((el) => el.textContent);
    const skillText = await h2.evaluate((el) => el.textContent);

    if (!colorText || !skillText) {
      return {
        error: ERRORS.FAILED_TO_GET_COLOR_TEXT,
      };
    }

    const color = colorText.split("#")[1];
    const markdown = `![${skillText}](https://img.shields.io/badge/${skillText}-${color}?style=flat-square&logo=${skillText}&logoColor=white)`;

    return { markdown };
  } catch (error) {
    return {
      error: ERRORS.FAILED_TO_LOAD_IMAGE + ": " + (error as Error).message,
    };
  } finally {
    await browser.close();
  }
};
