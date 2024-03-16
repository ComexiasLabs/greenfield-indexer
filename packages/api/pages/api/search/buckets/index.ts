import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiSearchRequest, PaginatedApiResponse, StorageBucket } from '@core/types/api';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, DEFAULT_SEARCH_MODE } from '@core/const/constant';
import { SearchModes } from '@core/types/searchModes';
import { apiSearchBuckets } from '@handlers/apiBucketServices';

export type RequestData = ApiSearchRequest;
type ResponseData = PaginatedApiResponse<StorageBucket>;
type ResponseError = { message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData | ResponseError>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const {
      keyword,
      searchMode = DEFAULT_SEARCH_MODE,
      limit = DEFAULT_LIMIT,
      offset = DEFAULT_OFFSET,
    }: RequestData = req.query as unknown as RequestData;

    const result = await apiSearchBuckets(String(keyword), searchMode as SearchModes, Number(limit), Number(offset));

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
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
}
