export type ApiSearchRequest = {
  keyword: string;
  searchMode: string;
  limit?: number;
  offset?: number;
};

export type ApiFindRequest = {
  tags: string;
  limit?: number;
  offset?: number;
};

export type ApiFindKeysRequest = {
  keys: string[];
};

export type ApiFindValuesRequest = {
  values: string[];
};

export interface StorageBucket {
  id: number;
  name: string;
  tags: Tag[];
}

export interface StorageObject {
  id: number;
  bucketName: string;
  name: string;
  contentType: string;
  tags: Tag[];
}

export interface Tag {
  key?: string;
  value?: string;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: {
    offset: number;
    limit: number;
    totalCount: number;
  };
}
