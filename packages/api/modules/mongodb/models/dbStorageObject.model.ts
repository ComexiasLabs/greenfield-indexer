import { ObjectId } from 'mongodb';

export interface DBStorageObject {
  _id?: ObjectId;
  itemId: number;
  bucketName: string;
  objectName: string;
  visibility: string;
  contentType: string;
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
Raw API Data:

<GfSpListObjectsByBucketNameResponse>
    <Objects>
        <ObjectInfo>
            <Owner>0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22</Owner>
            <Creator>0x3DA7E2F900985b8880A9ACB3ca916F6031E6FF22</Creator>
            <BucketName>public</BucketName>
            <ObjectName>BNB Greenfield/</ObjectName>
            <Id>622278</Id>
            <LocalVirtualGroupId>0</LocalVirtualGroupId>
            <PayloadSize>0</PayloadSize>
            <Visibility>3</Visibility>
            <ContentType>text/plain</ContentType>
            <CreateAt>1706960976</CreateAt>
            <ObjectStatus>1</ObjectStatus>
            <RedundancyType>0</RedundancyType>
            <SourceType>0</SourceType>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Checksums>Xfbg4nYTWdMKgnUFjimfzAOBU0VF9Vz0PkGYP11MlFY=</Checksums>
            <Tags>
                <Tags>
                    <Key>application</Key>
                    <Value>greenfield</Value>
                </Tags>
                <Tags>
                    <Key>owner</Key>
                    <Value>jnlewis</Value>
                </Tags>
            </Tags>
        </ObjectInfo>
        <LockedBalance>0x0000000000000000000000000000000000000000000000000000000000000000</LockedBalance>
        <Removed>false</Removed>
        <UpdateAt>4914478</UpdateAt>
        <DeleteAt>0</DeleteAt>
        <DeleteReason></DeleteReason>
        <Operator>0x0000000000000000000000000000000000000000</Operator>
        <CreateTxHash>0x121803ab52fa02aa5156942b0368070db69199a91eb7f1fe27ca567ae606b8e5</CreateTxHash>
        <UpdateTxHash>0x121803ab52fa02aa5156942b0368070db69199a91eb7f1fe27ca567ae606b8e5</UpdateTxHash>
        <SealTxHash>0x0000000000000000000000000000000000000000000000000000000000000000</SealTxHash>
    </Objects>
    <KeyCount>3</KeyCount>
    <MaxKeys>50</MaxKeys>
    <IsTruncated>false</IsTruncated>
    <NextContinuationToken></NextContinuationToken>
    <Name>public</Name>
    <Prefix></Prefix>
    <Delimiter></Delimiter>
    <ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
*/
