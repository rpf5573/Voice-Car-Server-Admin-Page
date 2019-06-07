// react & redux
import * as React from 'react';

// components
import MainMenu from './main-menu';
import Modals from './modals';

// css
import 'bootstrap/dist/css/bootstrap.css';
import '../scss/style.scss';

class App extends React.Component {
  render() {
    return (
      <div className="page">
        <div className="sidebar">
          <MainMenu></MainMenu>
        </div>
        <div className="main">
        </div>
        <Modals></Modals>
      </div>
    );
  }
}

export default App;