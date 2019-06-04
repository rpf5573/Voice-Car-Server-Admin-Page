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
  async test() {
    this.metas.get('map');
  }
  async getInitialState() {
    var teamCount = await this.teamPasswords.getTeamCount();
    var teamPasswords = await this.teamPasswords.getAll();
    var metas = await this.metas.get(['companyImage', 'map', 'adminPasswords']);
    return {
      teamPasswords,
      teamCount,
    };
  }
}

class Metas {
  constructor(private table: string, private pool: Pool) {}
  async get(key: string|string[]): Promise<string> {
    try {
      // get single value
      if ( ! Array.isArray(key) ) {
        const sql = `SELECT metaValue FROM ${this.table} WHERE metaKey = '${key}'`;
        let rows = await this.pool.query(sql);
        if ( Array.isArray(rows) ) {
          return rows[0].metaValue
        }
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
        const rows = await this.pool.query(sql);
        console.log(`LOG: Metas -> get -> rows`, rows);
        if (Array.isArray(rows)) {
          let results = {};
          rows.forEach((obj) => {
            Object.assign(results, {[obj.metaKey]: obj.metaValue});
          });
        }

        return '';
      }
    } catch (error) {
      console.log(error);
      return '';
    }
    return '';
  }

}

class TeamPasswords {
  constructor(private table: string, private mysql: Pool) {
    this.table = table;
    this.mysql = mysql;
  }
  async getAll(until = false) {
    let sql = `SELECT * FROM ${this.table} ORDER BY team`;
    if ( until ) {
      sql = `SELECT * FROM ${this.table} WHERE team <= ${until} ORDER BY team`;
    }
    const result = await this.mysql.query(sql);
    return result;
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
    const result: Query = await this.mysql.query(sql);
    if ( result.values && result.values.length > 0 ) {
      return parseInt(result.values[0]);
    }
    return 0;
  }
  async reset() {
    let sql = `UPDATE ${this.table} SET password = 0`;
    let result = await this.mysql.query(sql);
    return result;
  }
}

// class Points {

// }

export default QueryHub;