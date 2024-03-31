export enum BucketIndexStatuses {
  PendingBucketSync = 'PendingBucketSync',
  PendingObjectsSync = 'PendingObjectsSync',
  SyncComplete = 'SyncComplete',
  BucketFetchFailed = 'BucketFetchFailed',
  ObjectsFetchFailed = 'ObjectsFetchFailed',
}

export enum ObjectIndexStatuses {
  PendingContentSync = 'PendingContentSync',
  SyncComplete = 'SyncComplete',
  ContentFetchFailed = 'ContentFailedFetch',
}
