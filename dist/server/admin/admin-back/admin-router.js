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
        yield QH.test();
    }));
};
//# sourceMappingURL=admin-router.js.map