import { startInjest } from "@/services/injestionService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(request: Request) {
  await startInjest('Object');
  return new Response(`Successfully triggered collection process.`);
}
