import { UPDATE_ADMIN_PASSWORDS } from '../actions/types';
import '../../../types';

export default function(state: Admin.AdminPassword, action) {
  switch( action.type ) {
    case UPDATE_ADMIN_PASSWORDS :
      return Object.assign({}, state, <Admin.AdminPassword>action.payload);
    default: 
      return state;
  }
}