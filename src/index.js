import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import firebase from 'firebase';

/* import material design lite */
import 'react-mdl/extra/css/material.blue_grey-red.min.css';
import 'react-mdl/extra/material.js';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAjXzzUAJNU4V8_Ai26jPUfRZmapk0R2kk",
  authDomain: "bandit-ef070.firebaseapp.com",
  databaseURL: "https://bandit-ef070.firebaseio.com",
  storageBucket: "bandit-ef070.appspot.com",
  messagingSenderId: "235231515763"
};
firebase.initializeApp(config);


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
