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

// mysql
import pool from './database';
import QueryHub from './query';

const queryHub = new QueryHub(pool);
queryHub.metas.get("map");

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));