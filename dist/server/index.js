"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const index_1 = require("./admin/admin-back/index");
const database_1 = require("./database");
const query_1 = require("./query");
const queryHub = new query_1.default(database_1.default);
queryHub.metas.get("companyImage");
const app = express();
app.use(bodyParser.json());
app.use(morgan('combined', { stream: accessLogStream }));
index_1.default(app, queryHub);
app.use(express.static('public'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map