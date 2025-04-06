import { chromium, type Browser, type Page } from "playwright";
import { replaceSpace, setMarkdown } from "./formatText";

const ERRORS = {
  FAILED_TO_LAUNCH_BROWSER: "⛔️ Failed to launch browser.",
  FAILED_TO_CONNECT_IMG_SHIELDS_IO: "⛔️ Failed to connect to img.shields.io.",
  FAILED_TO_GET_COLOR_TEXT: "⛔️ Failed to get color text.",
  FAILED_TO_LOAD_PAGE: "⛔️ Failed to load page.",
  LIB_NOT_FOUND_IN_IMG_SHIELDS_IO:
    '⛔️ lib "$lib" is not found in img.shields.io.',
  FAILED_TO_LOAD_IMAGE: "⛔️ Failed to load image.",
};

const getImgShieldsPlaywright = async (lib: string) => {
  const libName = replaceSpace(lib);
  const url = `https://simpleicons.org/?q=${libName}`;

  let browser: Browser;
  let page: Page;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-gpu", "--single-process"],
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
    const libNameElements = await page.getByRole("heading", { level: 2 });
    if (
      !colorElements ||
      !(await colorElements.count()) ||
      !libNameElements ||
      !(await libNameElements.count())
    ) {
      return {
        error: ERRORS.LIB_NOT_FOUND_IN_IMG_SHIELDS_IO.replace("$lib", lib),
      };
    }
    const firstColor = colorElements.first();
    const firstLibName = libNameElements.first();
    const colorText = await firstColor.textContent();
    const libName = await firstLibName.textContent();
    if (!colorText || !libName) {
      return {
        error: ERRORS.FAILED_TO_GET_COLOR_TEXT,
      };
    }

    const colorWithoutHash = colorText.split("#")[1];
    const markdown = setMarkdown(libName, colorWithoutHash);

    return { markdown };
  } catch (error) {
    return {
      error: ERRORS.FAILED_TO_LOAD_IMAGE + ": " + (error as Error).message,
    };
  } finally {
    await browser.close();
  }
};

export default getImgShieldsPlaywright;
