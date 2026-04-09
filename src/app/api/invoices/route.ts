import { NextResponse } from "next/server";

import { fabricLogService } from "@/server/services/fabriclog-service";
import { invoicesResponseSchema } from "@/types/api";

export async function GET() {
  const payload = invoicesResponseSchema.parse({
    data: fabricLogService.getInvoices(),
  });

  return NextResponse.json(payload);
}
