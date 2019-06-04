// utils
import fs from 'fs';
import path from 'path';

// error log
import morgan from 'morgan';
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// server
import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import multer from 'multer';

// mysql
import pool from './database';
import QueryHub from './query';

const queryHub = new QueryHub(pool);
queryHub.metas.get("map");

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));