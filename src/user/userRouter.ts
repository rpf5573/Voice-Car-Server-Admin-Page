import { Express, RequestHandler } from 'express';
import QueryHub from '../query';
import constants from '../utils/constants';
export default (app:Express, QH: QueryHub) => {
  app.post('/user/login', async (req, res) => {
    const pw = req.body.password;
    let team = null;
    try {
      let teamPasswords = await QH.teamPasswords.getAll();
      for(let i = 0; i < teamPasswords.length; i++) {
        if (pw == teamPasswords[i].password) {
          team = teamPasswords[i].team;
          return res.status(201).json({team});
        }
      }
    } catch(err) {
      console.log(err);
      return res.sendStatus(401);
    }
    return res.status(201).json({error: "비밀번호를 다시 확인해주세요"});
  });
  app.get('/user/initialState', async (req, res) => {
    try {
      let rcUsageState = await QH.metas.get('rcUsageState');
      return res.status(201).json({ rcUsageState });
    } catch(err) {
      return res.sendStatus(401);
    }
  });
  app.get('/command/*', async (req, res) => {
    console.log( 'command did come' );
    return res.sendStatus(201);
  });
  app.post('/words/getPartWords', async (req, res) => {
    const partCols = req.body.partCols as Array<string>;
    const team = req.body.team;
    try {
      let result = ((await QH.words.getPartWords(team, partCols) as any) as Array<any>)[0];
      result = JSON.parse(JSON.stringify(result));
      for ( const [key, val] of Object.entries(result)) {
        if (val) { result[key] = JSON.parse(val as string); }
      }
      return res.status(201).json({words: result});
    } catch (err) {
      console.error(err);
      return res.status(201).json({error: constants.ERROR});
    }
  });
  // PartCol = hand_close, hand_open ...
  // Part = hand, arm ...
  app.post('/words/insertPartColWords', async (req, res) => {
    const col = req.body.col;
    const team = req.body.team;
  });
}