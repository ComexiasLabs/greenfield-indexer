import { startInjest } from "@/services/injestionService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export function GET(request: Request) {
  return new Response(`Hello from region: ${process.env.VERCEL_REGION}`);
}

export async function POST(request: Request) {
  await startInjest();
  return new Response(`Successfully triggered collection process.`);
}
