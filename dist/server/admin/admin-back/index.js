"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");
const admin_router_1 = require("./admin-router");
exports.default = (app, QH) => {
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
            const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);
            if (mimetype && extname) {
                return cb(null, true);
            }
            else {
                cb(new Error('Error : this file is not image'), false);
            }
        }
    }).fields([{ name: 'companyImage', maxCount: 1 }]);
    admin_router_1.default(app, upload, QH);
};
//# sourceMappingURL=index.js.map