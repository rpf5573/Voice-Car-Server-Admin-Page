"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
require("../../types");
const template_1 = require("../admin-client/template");
const constants_1 = require("../../utils/constants");
exports.default = (app, uploadHandler, QH) => {
    app.get('/admin', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const srcPath = {
            style: 'style.css',
            js: 'bundle.js'
        };
        if (req.originalUrl == '/admin') {
            srcPath.style = 'admin/style.css';
            srcPath.js = 'admin/bundle.js';
        }
        let initialSettings = yield QH.getInitialState();
        let document = template_1.default(initialSettings, srcPath, '', process.env.__group__);
        return res.set('Content-Type', 'text/html').end(document);
    }));
    app.post('/admin/uploads', (req, res) => __awaiter(this, void 0, void 0, function* () {
        uploadHandler(req, res, (err) => {
            if (err) {
                console.log('upload err : ', err);
                res.status(201).send(err);
            }
            else {
                if (req.files == undefined) {
                    res.status(201).json({
                        error: '파일이 없습니다'
                    });
                }
                else {
                    const files = req.files;
                    console.log(files);
                    if (files.companyImage !== undefined) {
                        console.log(files.companyImage[0]);
                        QH.metas.update('companyImage', files.companyImage[0].originalname);
                    }
                    res.sendStatus(201);
                }
            }
        });
    }));
    app.post('/admin/team-settings/passwords', (req, res) => __awaiter(this, void 0, void 0, function* () {
        let teamPasswords = req.body.teamPasswords;
        if (teamPasswords.length > 0) {
            try {
                yield QH.teamPasswords.update(teamPasswords);
                let newTeamPasswords = yield QH.teamPasswords.getAll();
                return res.status(201).json(newTeamPasswords);
            }
            catch (error) {
                console.log(error);
                return res.status(201).json({ error: constants_1.default.ERROR.unknown });
            }
        }
        return res.status(201).json({
            error: '팀 패스워드가 입력되지 않았습니다'
        });
    }));
    app.post('/admin/admin-passwords/passwords', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield QH.metas.update('adminPasswords', JSON.stringify(req.body.adminPasswords));
            return res.sendStatus(201);
        }
        catch (error) {
            console.log(error);
            return res.status(201).json({
                error: constants_1.default.ERROR.unknown
            });
        }
    }));
    app.post('/admin/reset', (req, res) => __awaiter(this, void 0, void 0, function* () {
        let pw = req.body.resetPassword;
        if (pw && pw == 'discovery_reset') {
            try {
                yield QH.reset();
                yield fs.remove(path.resolve(__dirname, `../../public/admin/uploads/`));
                return res.sendStatus(201);
            }
            catch (e) {
                return res.sendStatus(401);
            }
        }
        return res.status(201).json({
            error: '잘못된 접근입니다'
        });
    }));
    app.post('/admin/option-settings/rcUsageState', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body.rcUsageState);
            yield QH.metas.update('rcUsageState', req.body.rcUsageState);
            yield QH.speeds.resetToDefault();
            return res.sendStatus(201);
        }
        catch (error) {
            return res.status(201).json({
                error: constants_1.default.ERROR.unknown
            });
        }
    }));
    app.post('/admin/words-reset/default', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield QH.words.resetToDefault();
            return res.sendStatus(201);
        }
        catch (error) {
            console.error(error);
            return res.status(201).json({
                error: constants_1.default.ERROR.unknown
            });
        }
    }));
    app.post('/admin/words-reset/null', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield QH.words.resetToNull();
            return res.sendStatus(201);
        }
        catch (error) {
            console.error(error);
            return res.status(201).json({
                error: constants_1.default.ERROR.unknown
            });
        }
    }));
    app.post('/admin/speeds-reset/default', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield QH.speeds.resetToDefault();
            return res.sendStatus(201);
        }
        catch (error) {
            console.error(error);
            return res.status(201).json({
                error: constants_1.default.ERROR.unknown
            });
        }
    }));
    app.post('/admin/speeds-reset/zero', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield QH.speeds.resetToZero();
            return res.sendStatus(201);
        }
        catch (error) {
            console.error(error);
            return res.status(201).json({
                error: constants_1.default.ERROR.unknown
            });
        }
    }));
};
//# sourceMappingURL=admin-router.js.map