import { ApiFindRequest } from '@core/types/api';
import type { NextApiRequest, NextApiResponse } from 'next';

interface FetchInfoResponse {
  apiVersion: string;
  github: string;
  docs: string;
  mainnetRestApiUrl: string;
  mainnetGraphQLApiUrl: string;
  testnetRestApiUrl: string;
  testnetGraphQLApiUrl: string;
}

export type RequestData = ApiFindRequest;

type ResponseData = FetchInfoResponse;

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

    const data: ResponseData = {
      apiVersion: '1.0',
      mainnetRestApiUrl: 'https://www.greenfieldindexer.com/api',
      github: 'https://github.com/ComexiasLabs/greenfield-indexer',
      docs: 'https://github.com/ComexiasLabs/greenfield-indexer/blob/main/docs/api-documentation.md',
      mainnetGraphQLApiUrl: 'https://www.greenfieldindexer.com/api/graphql',
      testnetRestApiUrl: 'https://testnet.greenfieldindexer.com/api',
      testnetGraphQLApiUrl: 'https://testnet.greenfieldindexer.com/api/graphql',
    };

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'An error has occured on the server.' });
  }
}
