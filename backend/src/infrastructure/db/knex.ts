import knex, { Knex } from 'knex';
import config from '../../config/knexfile';

const env = process.env.NODE_ENV || 'development';
export const db: Knex = knex(config[env]);
