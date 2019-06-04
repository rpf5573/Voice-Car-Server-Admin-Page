import * as fs from 'fs-extra';
import { Express } from 'express';
import * as path from 'path';
import * as multer from 'multer';
import QueryHub from '../../query';
import adminRouter from './admin-router';

export default (app: Express, QH: QueryHub) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = `public/admin/uploads/`;
      fs.ensureDirSync(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = fileTypes.test(file.mimetype);
      if ( mimetype && extname ) {
        return cb(null, true);
      } else {
        cb(new Error('Error : this file is not image'), false);
      }
    }
  }).fields([{name: 'companyImage', maxCount: 1}]);
  adminRouter(app, upload, QH);
}