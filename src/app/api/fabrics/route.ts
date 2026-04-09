import { NextResponse } from "next/server";

import { fabricLogService } from "@/server/services/fabriclog-service";
import { fabricsResponseSchema } from "@/types/api";

export async function GET() {
  const payload = fabricsResponseSchema.parse({
    data: fabricLogService.getFabrics(),
  });

  return NextResponse.json(payload);
}
