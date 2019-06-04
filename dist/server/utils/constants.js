"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const teamColors = [
    '#1B378A',
    '#B6171E',
    '#41B33B',
    '#e162dc',
    '#f76904',
    '#a8f908',
    '#479eef',
    '#F4297D',
    '#1C1A25',
    '#f3f3fd',
    '#9C27B0',
    '#607D8B',
    '#795548',
    '#9E9E9E',
    '#00BCD4'
];
const ERROR = {
    unknown: 'ERROR : 알수없는 에러가 발생했습니다'
};
const PREFIX = 'vc';
const DB_TABLES = {
    metas: `${PREFIX}_metas`,
    teamPasswords: `${PREFIX}_teamPasswords`,
    points: `${PREFIX}_points`,
    postInfos: `${PREFIX}_postInfos`,
    uploads: `${PREFIX}_uploads`,
};
exports.default = {
    teamColors,
    ERROR,
    PREFIX,
    DB_TABLES
};
//# sourceMappingURL=constants.js.map