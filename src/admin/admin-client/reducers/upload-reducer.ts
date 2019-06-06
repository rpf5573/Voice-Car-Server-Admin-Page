import { UPLOAD_IMAGE_FILE } from '../actions/types';
import '../../../types';

export default function(state: Admin.Uploads, action) {
  switch( action.type ) {
    case UPLOAD_IMAGE_FILE :
      return Object.assign({}, state, <Admin.Uploads>action.payload);
    default:
      return state;
  }
}