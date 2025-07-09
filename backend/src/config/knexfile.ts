import type { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Helper function to throw an error for missing environment variables
const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const config: { [key: string]: Knex.Config } = {
  development: {
    client: requireEnv('DB_CLIENT'), 
    connection: {
      host: requireEnv('DB_HOST'), 
      port: +(requireEnv('DB_PORT')), 
      database: requireEnv('DB_NAME'), 
      user: requireEnv('DB_USER'), 
      password: '', 
    },
    migrations: {
      directory: path.resolve(__dirname, '../infrastructure/db/migrations'), 
    },
    seeds: {
      directory: path.resolve(__dirname, '../infrastructure/db/seeds'),
    },
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, '../infrastructure/db/migrations'),
    },
  },
};

export default config;
