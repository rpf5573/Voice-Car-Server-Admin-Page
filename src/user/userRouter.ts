import { Express, RequestHandler } from 'express';
import QueryHub from '../query';
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
    return res.status(201).json({ willUseVoice: false });
  });
}