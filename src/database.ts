import * as util from 'util';
import { createPool, Pool, MysqlError, Connection, QueryFunction } from 'mysql';

let config = {
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: `voice_car_${process.env.group}`
}

if ( process.env.NODE_ENV == 'production' ) {
  config.user = 'rpf5573';
  config.password = 'thoumas138';
}

const pool: Pool = createPool(config);
pool.query = util.promisify(pool.query) as any;

export default pool;