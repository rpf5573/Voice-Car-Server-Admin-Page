// defaults
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/app';
import LoginPage from './components/login-page';
import configureStore from './store';
import { Provider } from 'react-redux';

let initialSettings = window.__PRELOADED_STATE__;
if ( initialSettings ) {
  let store = configureStore(initialSettings);
  ReactDOM.render(
    <Provider store={store}>
      <App></App>
    </Provider>,
    document.getElementById('app'),
  );
} else {
  ReactDOM.render(
    <LoginPage></LoginPage>,
    document.getElementById('app')
  );
}