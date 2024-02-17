export interface AppConfig {
  environment: string;
  databaseConnection: string;
  databaseName: string;
  greenfieldBlockchainRPC: string;
}

export const Config: AppConfig = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'testnet',
  databaseConnection: process.env.DB_CONN_STRING || '',
  databaseName: process.env.DB_NAME || 'greenfield_indexer_testnet',
  greenfieldBlockchainRPC: process.env.GREENFIELD_RPC || 'https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org',
};
