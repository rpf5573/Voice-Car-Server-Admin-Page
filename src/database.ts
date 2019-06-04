import * as util from 'util';
import { createPool, Pool, MysqlError, Connection, QueryFunction } from 'mysql';

let config = {
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: `voice_car`
}

const pool: Pool = createPool(config);
pool.query = util.promisify(pool.query) as any;

export default pool;