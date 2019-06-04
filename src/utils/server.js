"use strict";
exports.__esModule = true;
var moment = require("moment-timezone");
moment.tz.setDefault('Asia/Seoul');
function currentTimeInSeconds() {
    var currentTime = moment().format('HH:mm:ss');
    return moment.duration(currentTime).asSeconds();
}
function currentTimeInYtoS() {
    var pad2 = function (n) {
        return (n < 10 ? '0' + n : n).toString();
    };
    var date = new Date();
    return date.getFullYear() + "_" + pad2(date.getMonth() + 1) + "_" + pad2(date.getDate()) + "_" + pad2(date.getHours()) + "_" + pad2(date.getMinutes()) + "_" + pad2(date.getSeconds());
}
exports["default"] = {
    currentTimeInSeconds: currentTimeInSeconds,
    currentTimeInYtoS: currentTimeInYtoS
};
