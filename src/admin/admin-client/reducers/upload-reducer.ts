import { UPLOAD_IMAGE_FILE } from '../actions/types';

export default function(state, action) {
  switch( action.type ) {
    case UPLOAD_IMAGE_FILE :
      return Object.assign({}, state, action.payload); // payload안에 companyImage: ~~, map: ~~ 이렇게 들어있음
    default:
      return state;
  }
}