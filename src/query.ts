import utils from './utils/server';
import constants from './utils/constants';
import { Pool, Query } from 'mysql';
import './types';

class QueryHub {
  public metas: Metas
  public teamPasswords: TeamPasswords
  public words: Words
  public speeds: Speeds
  constructor(private pool: Pool) {
    this.metas = new Metas(constants.DB_TABLES.metas, pool);
    this.teamPasswords = new TeamPasswords(constants.DB_TABLES.teamPasswords, pool);
    this.words = new Words(constants.DB_TABLES.words, pool);
    this.speeds = new Speeds(constants.DB_TABLES.speeds, pool);
  }
  async getInitialState() {
    var teamCount = await this.teamPasswords.getTeamCount();
    var teamPasswords = await this.teamPasswords.getAll();
    var metas = <{companyImage: string, adminPasswords: string, rcUsageState: string, userCanEditSpeedAndWords: string}> await this.metas.get(['companyImage', 'adminPasswords', 'rcUsageState', 'userCanEditSpeedAndWords']);
    return {
      teamPasswords,
      teamCount,
      companyImage: metas.companyImage,
      adminPasswords: JSON.parse(metas.adminPasswords),
      rcUsageState: parseInt(metas.rcUsageState),
      userCanEditSpeedAndWords: parseInt(metas.userCanEditSpeedAndWords),
    };
  }
  async reset() {
    await this.metas.reset();
    await this.teamPasswords.reset();
    await this.words.resetToDefault();
    await this.speeds.resetToDefault();
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
      return result[0].metaValue;
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
      let results = {};
      rows.forEach((obj) => {
        Object.assign(results, {[obj.metaKey]: obj.metaValue});
      });

      return results;
    }
  }
  async update(key: string, value: string) {
    let sql = `UPDATE ${this.table} SET metaValue = '${value}' WHERE metaKey = '${key}'`;
    if ( value == null ) {
      sql = `UPDATE ${this.table} SET metaValue = NULL WHERE metaKey = '${key}'`;
    }
    const result = await this.pool.query(sql);
    return result;
  }
  async reset() {
    let sql = `UPDATE ${this.table} SET metaValue = 'https://via.placeholder.com/150' WHERE metaKey IN ('companyImage')`;
    let result = await this.pool.query(sql);

    // admin passwords
    const adminPasswords = {
      admin: '1234',
    }
    sql = `UPDATE ${this.table} SET metaValue='${JSON.stringify(adminPasswords)}' WHERE metaKey='adminPasswords'`;
    result = await this.pool.query(sql);

    // remotecontroller & voice setting
    sql = `UPDATE ${this.table} SET metaValue='0' WHERE metaKey='rcUsageState'`;
    result = await this.pool.query(sql);

    sql = `UPDATE ${this.table} SET metaValue='0' WHERE metaKey='userCanEditSpeedAndWords'`;
    result = await this.pool.query(sql);

    return result;
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
    return 0;
  }
  async reset() {
    let sql = `UPDATE ${this.table} SET password = 0`;
    let result = await this.mysql.query(sql);
    return result;
  }
}

class Words {
  private defaultWords: Admin.defaultWords = {
    hand_open: ['손펴', '손표', '손피라고', '손벽', '손효', '성표', '송평', '손뼉', '송파', '송표', '손뼈', '송편'],
    hand_close: ['잡아', '자바', '저봐', '자봐', '차바','잡아라', '자바라', '자막', '참아', '쳐바', '전화', '쳐바', '쳐봐', '봐봐'],
    elbow_open: ['팔펴','팔표', '팔피라고', '팔표', '팔벽', '팔효', '팔벼', '발표', '발펴'],
    elbow_close: ['접어', '저붜', '자보', '저봐', '줘봐', '줘바', '접포', '초밥', '여보', '초보', '터보', '초봉', '서버', '더워', '전화'],
    shoulder_open: ['들어', '틀어', '드론', '트럭', '불어', '그럼', '뚫어'],
    shoulder_close: ['내려', '내려와', '매력', '노력', '매려', '노려', '느려', '재료', '의료'],
    waist_left: ['왼쪽', '외쪽'],
    waist_right: ['오른쪽', '어른쪽', '어느쪽'],
    bottom_go: ['앞으로', '아프로', '아브로', '어그로', '바보'],
    bottom_back: ['뒤로', '기록', '귀로', '1호', '위로'],
    bottom_left: ['왼쪽'],
    bottom_right: ['오른쪽', '어른쪽', '어느쪽'],
    bottom_go_fast: ['빠르게', '빠르개', '바르게', '바르개', '파르게', '파르개'],
  };
  constructor(private table: string, private mysql: Pool) {
    this.table = table;
    this.mysql = mysql;
  }
  async getAllWords(team: number) {
    const sql = `SELECT * FROM ${this.table} WHERE team = ${team}`;
    const rows = await this.mysql.query(sql);
    return rows;
  }
  async getPartWords(team: number, partCols: Array<string>) {
    const sql = `SELECT ${partCols.join(',')} FROM ${this.table} WHERE team = ${team}`;
    const words = await this.mysql.query(sql);
    return words;
  }
  async resetToDefault() {
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
    bottom_back = '${JSON.stringify(this.defaultWords.bottom_back)}',
    bottom_left = '${JSON.stringify(this.defaultWords.bottom_left)}', 
    bottom_right = '${JSON.stringify(this.defaultWords.bottom_right)}',
    bottom_go_fast = '${JSON.stringify(this.defaultWords.bottom_go_fast)}' WHERE 1=1;`;
    const results = await this.mysql.query(sql);
    return results;
  }
  async resetToNull() {
    const sql = `UPDATE ${this.table} SET hand_open = NULL, hand_close = NULL, elbow_open = NULL, elbow_close = NULL, shoulder_open = NULL, shoulder_close = NULL, waist_left = NULL, waist_right = NULL, bottom_go = NULL, bottom_go_fast = NULL, bottom_left = NULL, bottom_right = NULL, bottom_back = NULL WHERE 1=1;`;
    const results = await this.mysql.query(sql);
    return results;
  }
  async updatePartWords(team: number, partCol: string, word: string) {
    const sql = `UPDATE ${this.table} SET ${partCol} = '${word}' WHERE team = ${team}`;
    const result = await this.mysql.query(sql);
    return result;
  }

}

class Speeds {
  private defaultSpeeds: Admin.defaultSpeeds = {
    hand_open: 60,
    hand_close: 60,
    elbow_open: 90,
    elbow_close: 60,
    shoulder_open: 100,
    shoulder_close: 60,
    waist_left: 40,
    waist_right: 40,
    bottom_go: 60,
    bottom_back: 60,
    bottom_left: 40,
    bottom_right: 40,
    bottom_go_fast: 100,
  };
  constructor(private table: string, private mysql: Pool) {
    this.table = table;
    this.mysql = mysql;
  }
  async getAllSpeeds(team: number) {
    const sql = `SELECT * FROM ${this.table} WHERE team = ${team}`;
    const rows = await this.mysql.query(sql);
    return rows;
  }
  async getPartSpeeds(team: number, partCols: Array<string>) {
    const sql = `SELECT ${partCols.join(',')} FROM ${this.table} WHERE team = ${team}`;
    const words = await this.mysql.query(sql);
    return words;
  }
  async resetToDefault() {
    const sql = `UPDATE ${this.table} SET
      hand_open = '${JSON.stringify(this.defaultSpeeds.hand_open)}',
      hand_close = '${JSON.stringify(this.defaultSpeeds.hand_close)}', 
      elbow_open = '${JSON.stringify(this.defaultSpeeds.elbow_open)}', 
      elbow_close = '${JSON.stringify(this.defaultSpeeds.elbow_close)}', 
      shoulder_open = '${JSON.stringify(this.defaultSpeeds.shoulder_open)}', 
      shoulder_close = '${JSON.stringify(this.defaultSpeeds.shoulder_close)}', 
      waist_left = '${JSON.stringify(this.defaultSpeeds.waist_left)}', 
      waist_right = '${JSON.stringify(this.defaultSpeeds.waist_right)}', 
      bottom_go = '${JSON.stringify(this.defaultSpeeds.bottom_go)}', 
      bottom_go_fast = '${JSON.stringify(this.defaultSpeeds.bottom_go_fast)}', 
      bottom_left = '${JSON.stringify(this.defaultSpeeds.bottom_left)}', 
      bottom_right = '${JSON.stringify(this.defaultSpeeds.bottom_right)}', 
      bottom_back = '${JSON.stringify(this.defaultSpeeds.bottom_back)}' WHERE 1=1;`;
    const results = await this.mysql.query(sql);
    return results;
  }
  async resetToZero() {
    const sql = `UPDATE ${this.table} SET hand_open = 0, hand_close = 0, elbow_open = 0, elbow_close = 0, shoulder_open = 0, shoulder_close = 0, waist_left = 0, waist_right = 0, bottom_go = 0, bottom_go_fast = 0, bottom_left = 0, bottom_right = 0, bottom_back = 0 WHERE 1=1;`;
    const results = await this.mysql.query(sql);
    return results;
  }
  async updatePartSpeeds(team: number, partCol: string, speed: number) {
    const sql = `UPDATE ${this.table} SET ${partCol} = ${speed} WHERE team = ${team}`;
    const result = await this.mysql.query(sql);
    return result;
  }

}

export default QueryHub;