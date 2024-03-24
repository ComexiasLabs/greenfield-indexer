import { Environments } from '@/core/types/environments';
import { startInjest } from '@/services/injestionService';
import { fetchBucketMeta } from '@/services/storageBucketService';

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {
  const meta = await fetchBucketMeta('Testnet', 'public');

  console.log(JSON.stringify(meta));

  return new Response(`Completed.`);
}
