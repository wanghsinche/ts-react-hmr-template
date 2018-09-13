import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import {appReducer} from './business';
import {AppState, AppAction} from './business/type';

import {login} from './business/service'

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}

const appStore = createStore<AppState, AppAction, {}, {}>(
  appReducer, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

login().then(user=>{
  ReactDOM.render(
    <Provider store={appStore}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
})
.catch(alert)

registerServiceWorker();
