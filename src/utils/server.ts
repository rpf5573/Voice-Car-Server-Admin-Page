import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Seoul');

function currentTimeInSeconds():number {
  const currentTime = moment().format('HH:mm:ss');
  return moment.duration(currentTime).asSeconds();
}

function currentTimeInYtoS():string {
  const pad2 = (n:number):string => {
    return (n < 10 ? '0' + n : n).toString();
  }
  const date = new Date();
  return `${date.getFullYear()}_${pad2(date.getMonth()+1)}_${pad2(date.getDate())}_${pad2(date.getHours())}_${pad2(date.getMinutes())}_${pad2(date.getSeconds())}`;
}

export default {
  currentTimeInSeconds,
  currentTimeInYtoS,
}