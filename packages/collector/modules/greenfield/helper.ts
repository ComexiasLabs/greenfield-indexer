import { Config } from '@/core/config/config';
import { Environments } from '@/core/types/environments';

export const getContentUrl = (env: Environments, bucketName: string, objectName: string) => {
  const storageProvider =
    env === 'Mainnet' ? Config.greenfieldStorageProviderMainnet : Config.greenfieldStorageProviderTestnet;
  const contentUrl = `https://${bucketName}.${storageProvider}/${objectName}`;

  return contentUrl;
};
