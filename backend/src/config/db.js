const { Pool } = require('pg');
require('dotenv').config();

function parseDatabaseUrl(url) {
  if (!url) return null;
  const match = url.match(/postgresql?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) return null;
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5].split('?')[0],
  };
}

const dbUrl = parseDatabaseUrl(process.env.DATABASE_URL);
const user = process.env.DB_USER || dbUrl?.user;
const host = process.env.DB_HOST || dbUrl?.host;
const database = process.env.DB_NAME || dbUrl?.database;
const password = process.env.DB_PASSWORD ?? dbUrl?.password;
const port = parseInt(process.env.DB_PORT, 10) || dbUrl?.port || 5432;
const requiresSsl = (process.env.DATABASE_URL || '').includes('sslmode=require');

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
  min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_MS, 10) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECT_MS, 10) || 10000,
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT_MS, 10) || 30000,
});

pool.on('error', (err) => {
  const logger = require('../utils/logger');
  logger.error({ err, msg: 'Unexpected PostgreSQL pool error' });
});

const SLOW_MS = parseInt(process.env.DB_SLOW_QUERY_MS, 10) || 500;

const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration >= SLOW_MS) {
      const logger = require('../utils/logger');
      logger.warn({
        msg: 'Slow query',
        durationMs: duration,
        query: text.slice(0, 200),
      });
    }
    return result;
  } catch (err) {
    const logger = require('../utils/logger');
    logger.error({
      msg: 'Query failed',
      durationMs: Date.now() - start,
      query: text.slice(0, 200),
      err: err.message,
    });
    throw err;
  }
};

module.exports = { query, pool };
