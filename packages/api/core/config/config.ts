export interface AppConfig {
  environment: string;
  databaseConnection: string;
  databaseName: string;
}

export const Config: AppConfig = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'testnet',
  databaseConnection: process.env.DB_CONN_STRING || '',
  databaseName: process.env.DB_NAME || '',
};
