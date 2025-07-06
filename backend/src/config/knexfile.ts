import type { Knex } from 'knex';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      database: 'bolttech_mvp',
      user: 'riyapandey',  // adjust if different
      password: ''
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
