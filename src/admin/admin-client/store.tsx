import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import '../../types';

let middleWare = [thunk];

export default function configureStore(initialSettings) {
  var initialState: Admin.InitialState = {
    teamSettings: {
      teamPasswords: initialSettings.teamPasswords,
      teamCount: initialSettings.teamCount
    },
    modalControl: {
      activeModalClassName: "",
      activeMenuBtnClassName: ""
    },
    uploads: {
      companyImage: initialSettings.companyImage,
    },
    adminPasswords: initialSettings.adminPasswords,
  };

  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(
      applyMiddleware(...middleWare)
    ),
  );
  return store
}