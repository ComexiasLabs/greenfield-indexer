import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@core/const/constant';
import { ApiFindRequest, PaginatedApiResponse, StorageObject } from '@core/types/api';
import { apiFetchObjectsByTags } from '@handlers/apiObjectServices';
import type { NextApiRequest, NextApiResponse } from 'next';

export type RequestData = ApiFindRequest;

type ResponseData = PaginatedApiResponse<StorageObject>;

type ResponseError = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  if (req.method !== 'GET') {
    return res.status(400).json({ message: 'HTTP status not supported.' });
  }

  try {
    const { tags, limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET }: RequestData = req.query as unknown as RequestData;

    // const validKey = verifyApiKey(req.headers['x-api-key']);
    // if (!validKey) {
    //   return res.status(403).json({ message: 'Invalid API Key.' });
    // }

    let tagsObject;
    try {
      tagsObject = JSON.parse(req.query.tags as string);
    } catch (e) {
      return res.status(400).json({ message: 'The tags JSON format is incorrectly formed.' });
    }

    const result = await apiFetchObjectsByTags(tagsObject, Number(limit), Number(offset));

    const data: ResponseData = {
      data: result.data,
      pagination: {
        offset,
        limit,
        totalCount: result.totalCount,
      },
    };

    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'An error has occured on the server.' });
  }
}
