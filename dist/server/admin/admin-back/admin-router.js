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
require("../../types");
const template_1 = require("../admin-client/template");
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
        let document = template_1.default(initialSettings, srcPath, process.env.DCV);
        return res.set('Content-Type', 'text/html').end(document);
    }));
};
//# sourceMappingURL=admin-router.js.map