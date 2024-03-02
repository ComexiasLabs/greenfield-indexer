export interface StorageObjectApiData {
  owner: string;
  creator: string;
  bucket_name: string;
  object_name: string;
  id: string;
  local_virtual_group_id: number;
  payload_size: string;
  visibility: string;
  content_type: string;
  create_at: string;
  object_status: string;
  redundancy_type: string;
  source_type: string;
  checksums: string[];
  tags?: {
    tags:
      | {
          key: string;
          value: string;
        }[]
      | null;
  };
}

export interface FetchObjectsResponse {
  object_infos: StorageObjectApiData[];
  pagination: {
    next_key: string;
    total: string;
  };
}
