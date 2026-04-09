import { NextResponse } from "next/server";

import { fabricLogService } from "@/server/services/fabriclog-service";
import { dashboardResponseSchema } from "@/types/api";

export async function GET() {
  const payload = dashboardResponseSchema.parse({
    data: fabricLogService.getDashboardSummary(),
  });

  return NextResponse.json(payload);
}
