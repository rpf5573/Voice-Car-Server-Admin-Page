import * as fs from 'fs-extra';
import { Express, RequestHandler } from 'express';
import * as path from 'path';
import QueryHub from '../../query';
import '../../types';
import template from '../admin-client/template';
import constants from '../../utils/constants';

export default (app: Express, uploadHandler: RequestHandler, QH: QueryHub) => {
  app.get('/admin', async (req, res) => {
    const srcPath: Admin.SourcePath = {
      style: 'style.css',
      js: 'bundle.js'
    };
    if ( req.originalUrl == '/admin' ) {
      srcPath.style = 'admin/style.css';
      srcPath.js = 'admin/bundle.js';
    }

    // 관리자로 로그인되어있는지 확인
    if ( req.session && req.session.loginData && req.session.loginData.isLoginAdmin ) {
      let initialSettings = await QH.getInitialState();
      let document = template(initialSettings, srcPath, '', process.env.group);
      return res.set('Content-Type', 'text/html').end(document); 
    } else {
      return res.redirect('/admin/login');
    }
  });

  app.get('/admin/login', async (req, res) => {
    const srcPath: Admin.SourcePath = {
      style: 'style.css',
      js: 'bundle.js'
    };
    let document = template(false, srcPath, '', process.env.group);
      return res.set('Content-Type', 'text/html').end(document); 
  });

  app.post('/admin/login', async (req, res) => {
    if ( ! req.body.password ) {
      return res.status(201).json({
        error: '비밀번호를 입력해주세요'
      });
    }

    try {
      const adminPasswords = (await QH.metas.get('adminPasswords') as string);
      const json: Admin.AdminPassword = (function(raw: string) {
        try {
          return JSON.parse(raw);
        } catch (err) {
          console.log(err);
          return false;
        }
      })(adminPasswords);
      if ( json && req.session ) {
        // 5911 => master password
        if ( req.body.password == json.admin || req.body.password == '5911' ) {
          const result = { isLoginAdmin: true }
          req.session.loginData = result;
          return res.status(201).json(result);
        }
      }
    } catch (err) {
      return res.sendStatus(401);
    }
    return res.status(201).json({
      error: '비밀번호를 다시 확인해 주세요'
    });
  });

  app.post('/admin/uploads', async (req, res) => {
    uploadHandler(req, res, (err) => {
      if ( err ) {
        console.log( 'upload err : ', err );
        res.status(201).send(err);
      } else {
        if ( req.files == undefined ) {
          res.status(201).json({
            error: '파일이 없습니다'
          });
        } else {
          type theFile = {
            originalname: string
          }
          const files = (req.files as any) as {companyImage: theFile[]};
          console.log(files);
          if ( files.companyImage !== undefined ) {
            console.log(files.companyImage[0]);
            QH.metas.update('companyImage', files.companyImage[0].originalname);
          }
          res.sendStatus(201);
        }
      }
    });
  });

  app.post('/admin/team-settings/passwords', async (req, res) => {
    let teamPasswords = req.body.teamPasswords;
    if ( teamPasswords.length > 0 ) {
      try {
        await QH.teamPasswords.update(teamPasswords);
        let newTeamPasswords = await QH.teamPasswords.getAll();
        return res.status(201).json(newTeamPasswords);
      } catch(error) {
        console.log(error);
        return res.status(201).json({ error: constants.ERROR.unknown });
      }
    }
    return res.status(201).json({
      error: '팀 패스워드가 입력되지 않았습니다'
    });
  });

  // admin passwords
  app.post('/admin/admin-passwords/passwords', async (req, res) => {
    try {
      await QH.metas.update('adminPasswords', JSON.stringify(req.body.adminPasswords));
      return res.sendStatus(201);
    } catch(error) {
      console.log(error);
      return res.status(201).json({
        error: constants.ERROR.unknown
      });
    }
  });

  // reset
  app.post('/admin/reset', async (req, res) => {
    let pw = req.body.resetPassword;
    if ( pw && pw == 'discovery_reset' ) {
      try {
        await QH.reset(); // DB reset
        await fs.remove( path.resolve( __dirname, `../../public/admin/uploads/`)) ; // admin uploads reset
        return res.sendStatus(201);
      } catch(e) {
        return res.sendStatus(401);
      }
    }

    return res.status(201).json({
      error: '잘못된 접근입니다'
    });
  });

  app.post('/admin/option-settings/rcUsageState', async(req, res) => {
    try {
      await QH.metas.update('rcUsageState', req.body.rcUsageState);
      await QH.speeds.resetToDefault();
      return res.sendStatus(201);
    } catch(error) {
      return res.status(201).json({
        error: constants.ERROR.unknown
      });
    }
  });

  // words
  app.post('/admin/words-reset/default', async(req, res) => {
    try {
      const result = await QH.words.resetToDefault();
      return res.sendStatus(201);
    } catch(error) {
      console.error(error);
      return res.status(201).json({
        error: constants.ERROR.unknown
      });
    }
  });
  app.post('/admin/words-reset/null', async(req, res) => {
    try {
      await QH.words.resetToNull();
      await QH.metas.update('userCanEditSpeedAndWords', '1');
      return res.sendStatus(201);
    } catch(error) {
      console.error(error);
      return res.status(201).json({
        error: constants.ERROR.unknown
      });
    }
  });

  // speeds
  app.post('/admin/speeds-reset/default', async(req, res) => {
    try {
      await QH.speeds.resetToDefault();
      return res.sendStatus(201);
    } catch(error) {
      console.error(error);
      return res.status(201).json({
        error: constants.ERROR.unknown
      });
    }
  });
  app.post('/admin/speeds-reset/zero', async(req, res) => {
    try {
      await QH.speeds.resetToZero();
      await QH.metas.update('userCanEditSpeedAndWords', '1');
      return res.sendStatus(201);
    } catch(error) {
      console.error(error);
      return res.status(201).json({
        error: constants.ERROR.unknown
      });
    }
  });
}