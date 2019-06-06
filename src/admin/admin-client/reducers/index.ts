import { combineReducers } from 'redux';
import teamSettingReducer from './team-setting-reducer';
import modalControlReducer from './modal-control-reducer';
import uploadReducer from './upload-reducer';
import adminPasswordReducer from './admin-password-reducer';

export default combineReducers({
  teamSettings: teamSettingReducer,
  modalControl: modalControlReducer,
  uploads: uploadReducer,
  adminPasswords: adminPasswordReducer,
});