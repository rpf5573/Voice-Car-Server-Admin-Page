const teamColors = [
  '#1B378A', // 1
  '#B6171E', // 2
  '#41B33B', // 3
  '#e162dc', // 4
  '#f76904', // 5
  '#a8f908', // 6
  '#479eef', // 7
  '#F4297D', // 8
  '#1C1A25', // 9
  '#f3f3fd', // 10
  '#9C27B0', // 11
  '#607D8B', // 12
  '#795548', // 13
  '#9E9E9E', // 14
  '#00BCD4'  // 15
];
const ERROR = {
  unknown: 'ERROR : 알수없는 에러가 발생했습니다'
}
const PREFIX = 'vc';
const DB_TABLES = {
  metas: `${PREFIX}_metas`,
  teamPasswords: `${PREFIX}_teamPasswords`,
  points: `${PREFIX}_points`,
  postInfos: `${PREFIX}_postInfos`,
  uploads: `${PREFIX}_uploads`,
  words: `${PREFIX}_words`,
  speeds: `${PREFIX}_speeds`
}
const IMAGE = 'image';
const VIDEO = 'video';
const OFF = 0;
const ON = 1;
export default {
  teamColors,
  ERROR,
  PREFIX,
  DB_TABLES,
  IMAGE,
  VIDEO,
  ON,
  OFF
}