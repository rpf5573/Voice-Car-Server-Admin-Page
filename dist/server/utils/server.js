"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment-timezone");
moment.tz.setDefault('Asia/Seoul');
function currentTimeInSeconds() {
    const currentTime = moment().format('HH:mm:ss');
    return moment.duration(currentTime).asSeconds();
}
function currentTimeInYtoS() {
    const pad2 = (n) => {
        return (n < 10 ? '0' + n : n).toString();
    };
    const date = new Date();
    return `${date.getFullYear()}_${pad2(date.getMonth() + 1)}_${pad2(date.getDate())}_${pad2(date.getHours())}_${pad2(date.getMinutes())}_${pad2(date.getSeconds())}`;
}
exports.default = {
    currentTimeInSeconds,
    currentTimeInYtoS,
};
//# sourceMappingURL=server.js.map