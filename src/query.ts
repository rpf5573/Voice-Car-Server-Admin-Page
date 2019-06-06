import utils from './utils/server';
import constants from './utils/constants';
import { Pool, Query } from 'mysql';
import './types';

class QueryHub {
  public metas: Metas
  public teamPasswords: TeamPasswords
  constructor(private pool: Pool) {
    const prefix = `${constants.PREFIX}_`;
    this.metas = new Metas(constants.DB_TABLES.metas, pool);
    this.teamPasswords = new TeamPasswords(constants.DB_TABLES.teamPasswords, pool);
  }
  async getInitialState() {
    var teamCount = await this.teamPasswords.getTeamCount();
    var teamPasswords = await this.teamPasswords.getAll();
    var metas = <{companyImage: string, adminPasswords: string}> await this.metas.get(['companyImage', 'adminPasswords']);
    return {
      teamPasswords,
      teamCount,
      companyImage: metas.companyImage,
      adminPasswords: JSON.parse(metas.adminPasswords),
    };
  }
}

class Metas {
  constructor(private table: string, private pool: Pool) {}
  async get(key: string|string[]): Promise<string|{[key: string]: string}> {
    // get single value
    if ( ! Array.isArray(key) ) {
      const sql = `SELECT metaValue FROM ${this.table} WHERE metaKey = '${key}'`;
      let rows = await this.pool.query(sql);
      let result = (rows as any) as Array<{metaValue: string}>
      return result[0].metaValue
    } 
    // get multi value
    else {
      const keys = key.reduce(
        function (cl, a, currIndex, arr) {
          return cl + (currIndex == 0 ? "" : ",") + "'" + a + "'";
        },
        ""
      );
      const sql = `SELECT metaKey,metaValue FROM ${this.table} WHERE metaKey IN (${keys})`;
      const rows = (await this.pool.query(sql) as any) as Array<{metaKey: string, metaValue: string}>;
      console.log(`LOG: Metas -> get -> rows`, rows);
      let results = {};
      rows.forEach((obj) => {
        Object.assign(results, {[obj.metaKey]: obj.metaValue});
      });

      return results;
    }
  }
}

class TeamPasswords {
  constructor(private table: string, private mysql: Pool) {
    this.table = table;
    this.mysql = mysql;
  }
  async getAll(until: number = 0) {
    let sql = `SELECT * FROM ${this.table} ORDER BY team`;
    if ( until ) {
      sql = `SELECT * FROM ${this.table} WHERE team <= ${until} ORDER BY team`;
    }
    const rows = (await this.mysql.query(sql) as any) as Array<Admin.TeamPassword>;
    console.log(`getAll ${rows}`);
    return rows;
  }
  async update(teamPasswords: Admin.TeamPassword[]) {
    var values = "";
    let last = teamPasswords.length - 1;
    for ( var i = 0; i < last; i++ ) {
      values += `('${teamPasswords[i].team}', '${teamPasswords[i].password}'), `;
    }
    values += `('${teamPasswords[last].team}', '${teamPasswords[last].password}')`; // except ','
    const sql = `INSERT INTO ${this.table} (team, password) VALUES ${values} ON DUPLICATE KEY UPDATE password=VALUES(password)`;
    const result = await this.mysql.query(sql);
    return result;
  }
  async getTeamCount(): Promise<number> {
    const sql = `SELECT COUNT(password) as team_count FROM ${this.table} WHERE password IS NOT NULL and password != 0`;
    const rows = await this.mysql.query(sql);
    console.log(`getTeamCount : ${rows}`);
    return 0;
  }
  async reset() {
    let sql = `UPDATE ${this.table} SET password = 0`;
    let result = await this.mysql.query(sql);
    return result;
  }
}


export default QueryHub;