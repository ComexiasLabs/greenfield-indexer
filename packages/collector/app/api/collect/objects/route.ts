import { Environments } from "@/core/types/environments";
import { startInjest } from "@/services/injestionService";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(request: Request) {

  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      });
    }
  }

  const url = new URL(request.url);
  const env: Environments = url.searchParams.get('env') === 'mainnet' ? 'Mainnet' : 'Testnet';

  await startInjest(env, 'Object');

  return new Response(`Successfully triggered collection process.`);
}
