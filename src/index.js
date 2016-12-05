import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import firebase from 'firebase';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import Home from './Home';
import Board from './Board';
import Search from './Search';
import Inbox from './Inbox';
import Profile from './Profile';
import SignUp from './SignUp';
import Login from './Login';
import CreatePost from './CreatePost';
import Listing from './Listing';


/* import material design lite */
import 'react-mdl/extra/css/material.grey-red.min.css';
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


//render the Application view
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/board" component={Board}/>
      <Route path="/posts">
        <Route path="/posts/:listingName" component={Listing} />
      </Route>
      <Route path="/createpost" component={CreatePost}/>
      <Route path="/search" component={Search}/>
      <Route path="/inbox" component={Inbox}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/login" component={Login}/>
      <Route path="/signup" component={SignUp}/>
    </Route>
  </Router>, 

  document.getElementById('root')
);
