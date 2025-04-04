import { NextRequest, NextResponse } from "next/server";
import { getImgShields } from "@/utils/get-img-shields";
import { getImgShieldsOnLocal } from "@/utils/get-img-shields-backup";

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
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      const result = await getImgShieldsOnLocal({ lib });
      return NextResponse.json(result);
    } else {
      const result = await getImgShields({ lib });
      return NextResponse.json(result);
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
