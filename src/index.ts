// utils
import * as fs from 'fs';
import * as path from 'path';

// error log
import * as morgan from 'morgan';
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// server
import * as express from 'express';
const router = express.Router();
import * as bodyParser from 'body-parser';
import multer from 'multer';
import adminBackend from './admin/admin-back/index';

// mysql
import pool from './database';
import QueryHub from './query';

const queryHub = new QueryHub(pool);
queryHub.metas.get("companyImage");

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));
adminBackend(app, queryHub);

app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
});