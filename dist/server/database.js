"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const mysql_1 = require("mysql");
let config = {
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: `voice_car`
};
if (process.env.NODE_ENV == 'production') {
    config.user = 'rpf5573';
    config.password = 'thoumas138';
}
const pool = mysql_1.createPool(config);
pool.query = util.promisify(pool.query);
exports.default = pool;
//# sourceMappingURL=database.js.map