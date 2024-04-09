import { ObjectId } from 'mongodb';

export interface DBStorageObject {
  _id?: ObjectId;
  itemId: number;
  bucketName: string;
  objectName: string;
  owner: string;
  contentType: string;
  visibility: string;
  sourceType: string;
  objectStatus: string;
  createdAtBlock: number;
  tags: {
    key: string;
    value: string;
  }[];
  content?: string;
  indexDate: number;
  indexStatus: string;
}

/*
Raw API Data:
{
    "object_infos": [
        {
            "owner": "0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22",
            "creator": "",
            "bucket_name": "public",
            "object_name": "BNB Greenfield/ai-art.png",
            "id": "709206",
            "local_virtual_group_id": 1,
            "payload_size": "395155",
            "visibility": "VISIBILITY_TYPE_PUBLIC_READ",
            "content_type": "image/png",
            "create_at": "1707399647",
            "object_status": "OBJECT_STATUS_SEALED",
            "redundancy_type": "REDUNDANCY_EC_TYPE",
            "source_type": "SOURCE_TYPE_ORIGIN",
            "checksums": [
                "4dSfcQ49ohJa4ice4eQT1tELzVMjtXxjne5CsqmLvVg=",
                "rG5Ua1MS+olRz3FoVEfirjx6dsdwX4+AzjuSkltwfPE=",
                "AMQdZUz9RzaReEF5aZtWNZah5a04uFQP1wo0kYwLRNQ=",
                "6OJvRCbiHrJBhB2FGhSm783fVt6XGNqb8EwhV+u9jBA=",
                "7AlQKizbUvzOUhQCkbxHitI9OkHXsGysDP2DDd5E5Ac=",
                "0TGqJXbS8t8SSceIEbsSt7sEgh7kjgbjlbowK9GC55g=",
                "Tv/82eJ6sKQPiYz214k3OZ3eR5YuihQDUdcMwyH2MtU="
            ],
            "tags": null
        },
        {
            "owner": "0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22",
            "creator": "",
            "bucket_name": "public",
            "object_name": "BNB Greenfield/greenfield-readme.md",
            "id": "622286",
            "local_virtual_group_id": 1,
            "payload_size": "8925",
            "visibility": "VISIBILITY_TYPE_PUBLIC_READ",
            "content_type": "application/octet-stream",
            "create_at": "1706961059",
            "object_status": "OBJECT_STATUS_SEALED",
            "redundancy_type": "REDUNDANCY_EC_TYPE",
            "source_type": "SOURCE_TYPE_ORIGIN",
            "checksums": [
                "pPjDuD5Fai26kWC0NzztrsLgnMtNrUJtXekDt1bsI64=",
                "/7lqARsKg4jnaXZGb3R1bEpRSZzLHB+sXQXXTvv7BgQ=",
                "Kb729w7HQo38esPiWmmxFzSfGC91yMj2EHZbQqGP1MQ=",
                "EkVSXj7789AxWDLxrxm/UHhr9JbtivQGI9KnWJmN9nM=",
                "FzVmWUZ1Bnmk+XGXFBjLT1kZFQLLXDTVL8v20nwCy3c=",
                "odK192HAFYSPOWCigsN0dn0XNQMf7mLW23QyNnaJoq0=",
                "AQUFBH8t7Ximwtej2ABcQ23kUP8EZfOXk3TqlAE/RUU="
            ],
            "tags": {
                "tags": [
                    {
                        "key": "application",
                        "value": "greenfield"
                    },
                    {
                        "key": "owner",
                        "value": "jnlewis"
                    },
                    {
                        "key": "environment",
                        "value": "production"
                    },
                    {
                        "key": "region",
                        "value": "southeast-asia"
                    }
                ]
            }
        },
        {
            "owner": "0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22",
            "creator": "",
            "bucket_name": "public",
            "object_name": "BNB Greenfield/",
            "id": "622278",
            "local_virtual_group_id": 1,
            "payload_size": "0",
            "visibility": "VISIBILITY_TYPE_INHERIT",
            "content_type": "text/plain",
            "create_at": "1706960976",
            "object_status": "OBJECT_STATUS_SEALED",
            "redundancy_type": "REDUNDANCY_EC_TYPE",
            "source_type": "SOURCE_TYPE_ORIGIN",
            "checksums": [
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=",
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=",
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=",
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=",
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=",
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=",
                "Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY="
            ],
            "tags": {
                "tags": [
                    {
                        "key": "application",
                        "value": "greenfield"
                    },
                    {
                        "key": "owner",
                        "value": "jnlewis"
                    }
                ]
            }
        }
    ],
    "pagination": {
        "next_key": null,
        "total": "0"
    }
}
*/
