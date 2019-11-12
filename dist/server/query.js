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
        this.metas = new Metas(constants_1.default.DB_TABLES.metas, pool);
        this.teamPasswords = new TeamPasswords(constants_1.default.DB_TABLES.teamPasswords, pool);
        this.words = new Words(constants_1.default.DB_TABLES.words, pool);
    }
    getInitialState() {
        return __awaiter(this, void 0, void 0, function* () {
            var teamCount = yield this.teamPasswords.getTeamCount();
            var teamPasswords = yield this.teamPasswords.getAll();
            var metas = yield this.metas.get(['companyImage', 'adminPasswords', 'rcUsageState']);
            return {
                teamPasswords,
                teamCount,
                companyImage: metas.companyImage,
                adminPasswords: JSON.parse(metas.adminPasswords),
                rcUsageState: parseInt(metas.rcUsageState)
            };
        });
    }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            this.metas.reset();
            this.teamPasswords.reset();
            this.words.resetToDefault();
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
class Words {
    constructor(table, mysql) {
        this.table = table;
        this.mysql = mysql;
        this.defaultWords = {
            hand_open: ['손펴', '손표', '손피라고', '손벽', '손효', '성표', '송평', '손뼉', '송파', '송표', '손뼈', '송편'],
            hand_close: ['잡아', '자바', '저봐', '자봐', '차바', '잡아라', '자바라', '자막', '참아', '쳐바', '전화', '쳐바', '쳐봐', '봐봐'],
            elbow_open: ['팔펴', '팔표', '팔피라고', '팔표', '팔벽', '팔효', '팔벼', '발표', '발펴'],
            elbow_close: ['접어', '저붜', '자보', '저봐', '줘봐', '줘바', '접포', '초밥', '여보', '초보', '터보', '초봉', '서버', '더워', '전화'],
            shoulder_open: ['들어', '틀어', '드론', '트럭', '불어', '그럼', '뚫어'],
            shoulder_close: ['내려', '내려와', '매력', '노력', '매려', '노려', '느려', '재료', '의료'],
            waist_left: ['왼쪽', '외쪽'],
            waist_right: ['오른쪽', '어른쪽', '어느쪽'],
            bottom_go: ['앞으로', '아프로', '아브로', '어그로', '바보'],
            bottom_go_fast: ['뒤로', '기록', '귀로', '1호', '위로'],
            bottom_left: ['왼쪽'],
            bottom_right: ['오른쪽', '어른쪽', '어느쪽'],
            bottom_back: ['빠르게', '빠르개', '바르게', '바르개', '파르게', '파르개'],
        };
        this.table = table;
        this.mysql = mysql;
    }
    getAllWords(team) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${this.table} WHERE team = ${team}`;
            const rows = yield this.mysql.query(sql);
            console.log(rows);
            return rows;
        });
    }
    getPartWords(team, partCols) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT ${partCols.join(',')} FROM ${this.table} WHERE team = ${team}`;
            const words = yield this.mysql.query(sql);
            return words;
        });
    }
    resetToDefault() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE ${this.table} SET
    hand_open = '${JSON.stringify(this.defaultWords.hand_open)}',
    hand_close = '${JSON.stringify(this.defaultWords.hand_close)}', 
    elbow_open = '${JSON.stringify(this.defaultWords.elbow_open)}', 
    elbow_close = '${JSON.stringify(this.defaultWords.elbow_close)}', 
    shoulder_open = '${JSON.stringify(this.defaultWords.shoulder_open)}', 
    shoulder_close = '${JSON.stringify(this.defaultWords.shoulder_close)}', 
    waist_left = '${JSON.stringify(this.defaultWords.waist_left)}', 
    waist_right = '${JSON.stringify(this.defaultWords.waist_right)}', 
    bottom_go = '${JSON.stringify(this.defaultWords.bottom_go)}', 
    bottom_go_fast = '${JSON.stringify(this.defaultWords.bottom_go_fast)}', 
    bottom_left = '${JSON.stringify(this.defaultWords.bottom_left)}', 
    bottom_right = '${JSON.stringify(this.defaultWords.bottom_right)}', 
    bottom_back = '${JSON.stringify(this.defaultWords.bottom_back)}' WHERE 1=1;`;
            console.log('sql : ', sql);
            const results = yield this.mysql.query(sql);
            return results;
        });
    }
    resetToNull() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE ${this.table} SET hand_open = NULL, hand_close = NULL, elbow_open = NULL, elbow_close = NULL, shoulder_open = NULL, shoulder_close = NULL, waist_left = NULL, waist_right = NULL, bottom_go = NULL, bottom_go_fast = NULL, bottom_left = NULL, bottom_right = NULL, bottom_back = NULL WHERE 1=1;`;
            const results = yield this.mysql.query(sql);
            return results;
        });
    }
}
exports.default = QueryHub;
//# sourceMappingURL=query.js.map