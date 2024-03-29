import { ObjectId } from 'mongodb';

export interface DBStorageBucket {
  _id?: ObjectId;
  itemId: number;
  bucketName: string;
  visibility: string;
  createTxHash: string;
  updateTxHash: string;
  createdDate: number;
  updatedDate: number;
  tags: {
    key: string;
    value: string;
  }[];
  indexDate: number;
  indexStatus: string;
}

/**
Raw API data
{
    "owner": "0x84A0d38d64498414B14cD979159D57557345Cd8B",
    "bucket_name": "hek10",
    "visibility": "VISIBILITY_TYPE_PRIVATE",
    "id": "1",
    "source_type": "SOURCE_TYPE_ORIGIN",
    "create_at": "1693474466",
    "payment_address": "0x84A0d38d64498414B14cD979159D57557345Cd8B",
    "global_virtual_group_family_id": 1,
    "charged_read_quota": "0",
    "bucket_status": "BUCKET_STATUS_CREATED",
    "tags": null
}
*/
