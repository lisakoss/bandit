import React from 'react';
import SignInForm from './SignIn';
import firebase from 'firebase';
import { Snackbar, Spinner } from 'react-mdl';
import './index.css';
import { hashHistory } from 'react-router';

//A form that allows the user to log in to the website
class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {error: null, isSnackbarActive: false, spinnerDisplay: false};
    this.signIn = this.signIn.bind(this);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
  }

  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    // Add a listener and callback for authentication events 
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) { //if logged in, redirects to message board
        this.setState({userId:user.uid});
        const path = '/board';
        hashHistory.push(path);
      }
      else{
        this.setState({userId: null}); //null out the saved state
      }
    });
  }

//when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  //when an error snackbar pops up, it will eventually time out and disappear
  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false });
  }

  //A callback function for logging in existing users
  signIn(email, password) {
    // Sign in the user 
    var thisComponent = this;
    thisComponent.setState({spinnerDisplay: true}); //show spinner while user is logging in
    thisComponent.setState({isSnackbarActive: true}); //show snackbar that contains spinner while user is logging in
    firebase.auth().signInWithEmailAndPassword(email, password) //logs in user with email and password
       .catch(function(error) { //displays an error if there is a mistake with logging a user in
        var errorMessage = error.message;
        thisComponent.setState({spinnerDisplay: false}); //don't show spinner with error message
        thisComponent.setState({error: errorMessage}); //put error message in state
        thisComponent.setState({ isSnackbarActive: true }); //pop up snackbar to contain error message
       });
  }

  render() {
    var content = null; //what main content to show
    var snackbarContent = null; //what snackbar content to show

    if(!this.state.userId) { //if logged out, show signup form
      content = (<div><SignInForm signInCallback={this.signIn} /></div>);
    }
    
    if(this.state.spinnerDisplay) { // show spinner when loading
      snackbarContent = <Spinner singleColor />;
    } else if(this.state.error !== undefined) { // otherwise show error msg
      snackbarContent = this.state.error;
    }   

    return (
      <div>      
        <main role="article" className="content-container">   
          {content}
        </main>
        <div role="region">
          <Snackbar
            active={this.state.isSnackbarActive}
            onTimeout={this.handleTimeoutSnackbar}>{snackbarContent}</Snackbar> 
        </div>
      </div>      
    );
  }
}

export default Login;