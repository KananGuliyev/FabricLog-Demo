import { NextResponse } from "next/server";

import { fabricLogService } from "@/server/services/fabriclog-service";
import { ordersResponseSchema } from "@/types/api";

export async function GET() {
  const payload = ordersResponseSchema.parse({
    data: fabricLogService.getOrders(),
  });

  return NextResponse.json(payload);
}
