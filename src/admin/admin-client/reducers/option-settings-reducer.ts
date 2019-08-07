import { UPDATE_RCUSAGE } from '../actions/types';
import '../../../types';

export default function(state: Admin.OptionSettings = null, action) {
  switch( action.type ) {
    case UPDATE_RCUSAGE :
      let payload: Admin.OptionSettings = {
        rcUsageState: action.payload
      }
      return Object.assign({}, state, payload);
    default: 
      return state;
  }
}