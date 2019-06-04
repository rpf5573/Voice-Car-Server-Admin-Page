"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const database_1 = require("./database");
const query_1 = require("./query");
const queryHub = new query_1.default(database_1.default);
queryHub.metas.get("map");
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));
//# sourceMappingURL=index.js.map