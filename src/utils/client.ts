import constants from './constants';
import fileExtensions from './file-extensions';

function getCurrentTimeInSeconds() {
  let date = new Date();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return(h*60*60 + m*60 + s);
}

function secondToMinute(second) {
  if ( second >= 0) {
    let m = parseInt(second/60);
    let s = parseInt(second%60);
    return `${m}분 ${s}초`;
  } else {
    let m = parseInt(-second/60);
    let s = parseInt(-second%60);
    return `-${m}분 ${s}초`;
  }
}

function getFileExtension(filename){
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function mediaTypeCheck(filename){
  // file 확장자명 체크
  const extension = getFileExtension(filename).toLowerCase();
  for ( var i = 0; i < fileExtensions.image.length; i++ ) {
    if ( extension == fileExtensions.image[i] ) {
      return constants.IMAGE;
    }
  }

  for ( var i = 0; i < fileExtensions.video.length; i++ ) {
    if ( extension == fileExtensions.video[i] ) {
      return constants.VIDEO;
    }
  }

  return null;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function simpleAxios(axios, config) {
  return new Promise(async function(resolve, reject) {
    try {
      let response = await axios(config);
      if ( response.status == 201 ) {
        if (response.data.error) {
          alert(response.data.error);
          reject(response.data.error);
        }
        resolve(response);
      } else {
        alert(constants.ERROR.unknown);
        console.error( constants.ERROR.unknown );
        reject( constants.ERROR.unknown );
      }
    } catch(e) {
      console.error(e);
      reject(e);
    }
  });
}

export default {
  getCurrentTimeInSeconds,
  secondToMinute,
  getFileExtension,
  mediaTypeCheck,
  getRandomInteger,
  simpleAxios,
}