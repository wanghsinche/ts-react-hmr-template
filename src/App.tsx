import * as React from 'react';
import { hot } from 'react-hot-loader';
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route
} from 'react-router-dom';
import Index from './containers/index';
import Inner from './containers/inner';

import './App.css';

import logo from './logo.svg';

class App extends React.Component {
  public redirectRoute(){
    return (<Redirect to="/index" />);
  }
  public render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
          <div className="App-nav">
            <Link to="/index">Index</Link>
            <Link to="/inner">Inner</Link>
          </div>
          <div className="App-view">
            <Route path="/" extact="true" render={this.redirectRoute} />
            <Route path="/index" component={Index} extact="true" />
            <Route path="/inner" component={Inner} extact="true" />
          </div>
        </div>
      </Router>
    );
  }
}

// export default App;
export default hot(module)(App);