import { UPDATE_TEAM_PASSWORDS, UPDATE_TEAM_COUNT } from '../actions/types';
import '../../../types';

export default function(state: Admin.TeamSettings = null, action) {
  switch( action.type ) {
    case UPDATE_TEAM_PASSWORDS :
      return Object.assign({}, state, {
        teamPasswords: action.payload
      });
    case UPDATE_TEAM_COUNT :
      return Object.assign({}, state, {
        teamCount: action.payload
      });
    default:
      return state;
  }
}