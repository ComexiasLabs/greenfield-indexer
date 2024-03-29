export interface AppConfig {
  environment: string;
  databaseConnection: string;
  databaseNameMainnet: string;
  greenfieldBlockchainRPCMainnet: string;
  greenfieldStorageProviderMainnet: string;
  databaseNameTestnet: string;
  greenfieldBlockchainRPCTestnet: string;
  greenfieldStorageProviderTestnet: string;
}

export const Config: AppConfig = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'local',
  databaseConnection: process.env.DB_CONN_STRING || '',
  databaseNameMainnet: process.env.DB_NAME_MAINNET || '',
  greenfieldBlockchainRPCMainnet: process.env.GREENFIELD_RPC_MAINNET || '',
  greenfieldStorageProviderMainnet: process.env.GREENFIELD_SP_MAINNET || '',
  databaseNameTestnet: process.env.DB_NAME_TESTNET || '',
  greenfieldBlockchainRPCTestnet: process.env.GREENFIELD_RPC_TESTNET || '',
  greenfieldStorageProviderTestnet: process.env.GREENFIELD_SP_TESTNET || '',
};
