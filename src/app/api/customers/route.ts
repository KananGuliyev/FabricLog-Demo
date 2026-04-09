import { NextResponse } from "next/server";

import { fabricLogService } from "@/server/services/fabriclog-service";
import { customersResponseSchema } from "@/types/api";

export async function GET() {
  const payload = customersResponseSchema.parse({
    data: fabricLogService.getCustomers(),
  });

  return NextResponse.json(payload);
}
