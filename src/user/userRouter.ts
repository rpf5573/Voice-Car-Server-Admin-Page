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
    const team = req.body.team;
    const col = req.body.col;
    const similarWord = req.body.similarWord;
  
    try {
      // 중복 체크후 입력
      let hasSimilarWord = false;
      let colWords: Array<string> = [];
      let words = ((await QH.words.getPartWords(team, [col]) as any) as Array<any>)[0];
      if ( words[col] ) {
        words = JSON.parse(JSON.stringify(words));
        colWords = JSON.parse(words[col] as string) as Array<string>;
        colWords.forEach((el: string) => {
          if ( el == similarWord ) {
            hasSimilarWord = true;
          }
        });
        // 이미 해당 단어가 있다면
        if ( hasSimilarWord ) { return res.status(201).json({error: "이미 해당 단어가 있습니다"}); }
      }
      colWords.push(similarWord);
      await QH.words.updatePartWords(team, col, JSON.stringify(colWords));
      return res.sendStatus(201);
    } catch (err) {
      console.error(err);
      return res.status(201).json({error: constants.ERROR});
    }
  });
}