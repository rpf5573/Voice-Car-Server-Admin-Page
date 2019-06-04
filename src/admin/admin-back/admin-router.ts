import * as fs from 'fs-extra';
import { Express, RequestHandler } from 'express';
import * as path from 'path';
import QueryHub from '../../query';
import '../../@types/index';
import template from '../admin-client/template';

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
    let initialSettings = await QH.getInitialState('admin');
    let document = template(initialSettings, srcPath, process.env.DCV);
    return res.set('Content-Type', 'text/html').end(document);
  });
}