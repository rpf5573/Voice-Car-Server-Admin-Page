import { Express, RequestHandler } from 'express';
import QueryHub from '../query';
export default (app:Express, QH: QueryHub) => {
  app.post('/user/login', async (req, res) => {
    const pw = req.body.password;
    try {
      let teamPasswords = await QH.teamPasswords.getAll();
      for(let i = 0; i < teamPasswords.length; i++) {
        if (pw == teamPasswords[i].password) {
          return res.status(201);
        }
      }
    } catch(err) {
      return res.sendStatus(401);
    }
  });
}