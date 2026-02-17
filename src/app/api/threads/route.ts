import { NextResponse } from "next/server";
import { mastra } from "@/mastra";

const RESOURCE_ID = "default-user";

export async function GET() {
  try {
    const agent = mastra.getAgent("cofactsWriter");
    const memory = await agent.getMemory();

    if (!memory) {
      return NextResponse.json({ threads: [] });
    }

    const result = await memory.listThreads({
      filter: { resourceId: RESOURCE_ID },
      orderBy: { field: "updatedAt", direction: "DESC" },
    });

    return NextResponse.json({ threads: result.threads });
  } catch (error) {
    console.error("Failed to list threads:", error);
    return NextResponse.json({ threads: [] }, { status: 500 });
  }
}
