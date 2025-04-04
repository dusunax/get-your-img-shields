import { NextRequest, NextResponse } from "next/server";
import { getImgShields } from "@/utils/get-img-shields";
import { getImgShieldsCore } from "@/utils/get-img-shields-core";

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
      result = await getImgShields(lib);
    } else {
      result = await getImgShieldsCore(lib);
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
