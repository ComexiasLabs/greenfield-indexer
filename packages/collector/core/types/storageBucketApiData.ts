export interface StorageBucketApiData {
  owner: string;
  bucket_name: string;
  visibility: string;
  id: string;
  source_type: string;
  create_at: string;
  payment_address: string;
  global_virtual_group_family_id: number;
  charged_read_quota: string;
  bucket_status: string;
  tags?: {
    tags:
      | {
          key: string;
          value: string;
        }[]
      | null;
  };
}

export interface FetchBucketsResponse {
  bucket_infos: StorageBucketApiData[];
  pagination: {
    next_key: string;
    total: string;
  };
}
