"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./utils/constants");
require("./types");
class QueryHub {
    constructor(pool) {
        this.pool = pool;
        const prefix = `${constants_1.default.PREFIX}_`;
        this.metas = new Metas(constants_1.default.DB_TABLES.metas, pool);
        this.teamPasswords = new TeamPasswords(constants_1.default.DB_TABLES.teamPasswords, pool);
    }
    getInitialState() {
        return __awaiter(this, void 0, void 0, function* () {
            var teamCount = yield this.teamPasswords.getTeamCount();
            var teamPasswords = yield this.teamPasswords.getAll();
            var metas = yield this.metas.get(['companyImage', 'adminPasswords']);
            return {
                teamPasswords,
                teamCount,
                companyImage: metas.companyImage,
                adminPasswords: JSON.parse(metas.adminPasswords),
            };
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            this.metas.reset();
            this.teamPasswords.reset();
        });
    }
}
class Metas {
    constructor(table, pool) {
        this.table = table;
        this.pool = pool;
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(key)) {
                const sql = `SELECT metaValue FROM ${this.table} WHERE metaKey = '${key}'`;
                let rows = yield this.pool.query(sql);
                let result = rows;
                return result[0].metaValue;
            }
            else {
                const keys = key.reduce(function (cl, a, currIndex, arr) {
                    return cl + (currIndex == 0 ? "" : ",") + "'" + a + "'";
                }, "");
                const sql = `SELECT metaKey,metaValue FROM ${this.table} WHERE metaKey IN (${keys})`;
                const rows = yield this.pool.query(sql);
                console.log(`LOG: Metas -> get -> rows`, rows);
                let results = {};
                rows.forEach((obj) => {
                    Object.assign(results, { [obj.metaKey]: obj.metaValue });
                });
                return results;
            }
        });
    }
    update(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `UPDATE ${this.table} SET metaValue = '${value}' WHERE metaKey = '${key}'`;
            if (value == null) {
                sql = `UPDATE ${this.table} SET metaValue = NULL WHERE metaKey = '${key}'`;
            }
            const result = yield this.pool.query(sql);
            return result;
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `UPDATE ${this.table} SET metaValue = 'https://via.placeholder.com/150' WHERE metaKey IN ('companyImage')`;
            let result = yield this.pool.query(sql);
            const adminPasswords = {
                admin: '1234',
                assist: '4321'
            };
            sql = `UPDATE ${this.table} SET metaValue='${JSON.stringify(adminPasswords)}' WHERE metaKey='adminPasswords'`;
            result = yield this.pool.query(sql);
            return result;
        });
    }
}
class TeamPasswords {
    constructor(table, mysql) {
        this.table = table;
        this.mysql = mysql;
        this.table = table;
        this.mysql = mysql;
    }
    getAll(until = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT * FROM ${this.table} ORDER BY team`;
            if (until) {
                sql = `SELECT * FROM ${this.table} WHERE team <= ${until} ORDER BY team`;
            }
            const rows = yield this.mysql.query(sql);
            console.log(`getAll ${rows}`);
            return rows;
        });
    }
    update(teamPasswords) {
        return __awaiter(this, void 0, void 0, function* () {
            var values = "";
            let last = teamPasswords.length - 1;
            for (var i = 0; i < last; i++) {
                values += `('${teamPasswords[i].team}', '${teamPasswords[i].password}'), `;
            }
            values += `('${teamPasswords[last].team}', '${teamPasswords[last].password}')`;
            const sql = `INSERT INTO ${this.table} (team, password) VALUES ${values} ON DUPLICATE KEY UPDATE password=VALUES(password)`;
            const result = yield this.mysql.query(sql);
            return result;
        });
    }
    getTeamCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(password) as team_count FROM ${this.table} WHERE password IS NOT NULL and password != 0`;
            const rows = yield this.mysql.query(sql);
            console.log(`getTeamCount : ${rows}`);
            return 0;
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `UPDATE ${this.table} SET password = 0`;
            let result = yield this.mysql.query(sql);
            return result;
        });
    }
}
exports.default = QueryHub;
//# sourceMappingURL=query.js.map