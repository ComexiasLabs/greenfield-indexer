import { ApiFindRequest } from '@core/types/api';
import { apiFetchSyncStatus } from '@handlers/apiStatusServices';
import type { NextApiRequest, NextApiResponse } from 'next';

interface FetchSyncStatusResponse {
  status: string;
  lastIndexBlockHeight: number;
  lastRefresh: string;
}

export type RequestData = ApiFindRequest;

type ResponseData = FetchSyncStatusResponse;

type ResponseError = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'HTTP status not supported.' });
  }

  try {
    // const validKey = verifyApiKey(req.headers['x-api-key']);
    // if (!validKey) {
    //   return res.status(403).json({ message: 'Invalid API Key.' });
    // }

    const result = await apiFetchSyncStatus();
    if (!result) {
      return res.status(400).json({ message: 'Unable to get sync status.' });
    }

    const data: ResponseData = {
      status: 'Online',
      lastIndexBlockHeight: result.lastIndexBlockHeight,
      lastRefresh: result.timestampDisplay,
    };

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'An error has occured on the server.' });
  }
}
