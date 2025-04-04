import { NextRequest, NextResponse } from "next/server";
import getImgShieldsPlaywrightCore from "@/utils/get-img-shields-playwright-core";
import getImgShieldsPlaywright from "@/utils/get-img-shields-playwright";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lib = searchParams.get("lib");

  if (!lib) {
    return NextResponse.json(
      { error: "Missing 'lib' parameter" },
      { status: 400 }
    );
  }

  try {
    let result;
    if (process.env.NODE_ENV === "development") {
      result = await getImgShieldsPlaywright(lib);
    } else {
      result = await getImgShieldsPlaywrightCore(lib);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
