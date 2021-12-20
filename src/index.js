import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './components/App';
import { ThemeProvider } from './components/ThemeContext';
import Background from './components/Background';
import Toggle from './components/ThemeToggle';

ReactDOM.render(
  <React.StrictMode>
        <ThemeProvider>
      <Background>
         <div className="absolute right-0 top-0 mr-4 mt-4 md:mr-6 md:mt-6">
            <Toggle />
          </div>
       
        <App />
          </Background>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
