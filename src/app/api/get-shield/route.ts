import { NextRequest, NextResponse } from "next/server";
import { getImgShields } from "@/utils/get-img-shields";

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
    const result = await getImgShields({ lib });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
