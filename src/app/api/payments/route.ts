import { NextResponse } from "next/server";

import { fabricLogService } from "@/server/services/fabriclog-service";
import { paymentsResponseSchema } from "@/types/api";

export async function GET() {
  const payload = paymentsResponseSchema.parse({
    data: fabricLogService.getPayments(),
  });

  return NextResponse.json(payload);
}
