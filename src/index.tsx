import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import {ThemeContextProvider, ThemeGlobalStyle} from './Contexts/ThemeGlobalAndProvider'
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
    <Provider store={store}>
      <ThemeContextProvider>
        <ThemeGlobalStyle />
          <Router>
            <App />
          </Router>
      </ThemeContextProvider>
    </Provider>,
  document.getElementById('root')
);

