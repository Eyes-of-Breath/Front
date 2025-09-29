import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/tokens.css';
import './styles/globals.css';
import { initGSAP } from './gsap/gsapApp';
import App from './App';
import reportWebVitals from './reportWebVitals';

initGSAP();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
