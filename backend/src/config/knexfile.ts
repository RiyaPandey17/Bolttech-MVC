import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: +(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || 'bolttech_mvp',
      user: process.env.DB_USER || 'riyapandey',
      password: process.env.DB_PASSWORD || ''
    },
    migrations: {
      directory: path.resolve(__dirname, '../infrastructure/db/migrations'),  // ✅ correct absolute path
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
  }
};

export default config;
