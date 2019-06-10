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
      return res.sendStatus(401);
    }
    return res.status(201).json({error: "일치하는 비밀번호가 없습니다"});
  });
}