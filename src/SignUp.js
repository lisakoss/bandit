import React from 'react';
import SignUpForm from './SignUpForm';
import firebase from 'firebase';
import { Snackbar, Spinner } from 'react-mdl';
import './index.css';
import { hashHistory } from 'react-router';

//A form that allows the user to join the website
class SignUp extends React.Component {
  constructor(props){
    super(props);
    this.state = {error: null, isSnackbarActive: false, spinnerDisplay: false};
    this.signUp = this.signUp.bind(this);
    this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
  }

  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    // Add a listener and callback for authentication events
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) { //redirect to board once user is signed up
        this.setState({userId:user.uid});
        const path = '/board';
        hashHistory.push(path);
      }
      else{
        this.setState({userId: null}); //null out the saved state
      }
    })
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

  //A callback function for registering new users
  signUp(email, password, displayName, avatar) {
    // Create a new user and save their information
    var thisComponent = this;
    thisComponent.setState({spinnerDisplay: true}); //show loading spinner while user is being signed up
    thisComponent.setState({isSnackbarActive: true}); //show snackbar, where spinner is located, while user is being signed up
    firebase.auth().createUserWithEmailAndPassword(email, password) //sign up user with email, password, and then display name and avatar
      .then(function(firebaseUser) {
        //include information (for app-level content)
        thisComponent.setState({spinnerDisplay: 'hidden'}) //do not show spinner once this is completed
        firebaseUser.updateProfile({
          displayName: displayName,
          photoURL: avatar,
          email: email
        });

    //create new entry in the Cloud DB (for others to reference)
		var userRef = firebase.database().ref('users/'+firebaseUser.uid);
        var userData = {
          displayName: displayName,
          avatar: avatar,
          email: email
        }
        userRef.set(userData); //update entry in JOITC, return promise for chaining
      })
      .catch(function(error) { //show error if there is a mistake signing up, with error in snackbar
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          thisComponent.setState({error: 'The email address is already in use.'});
          thisComponent.setState({ isSnackbarActive: true });
          thisComponent.setState({spinnerDisplay: false})
        } else if (errorCode === 'auth/invalid-email') {
          thisComponent.setState({error: 'The email address is invalid'});
          thisComponent.setState({ isSnackbarActive: true });
          thisComponent.setState({spinnerDisplay: false})
        } else if (errorCode === 'auth/operation-not-allowed') {
          thisComponent.setState({error: 'Unable to create an account at this time, try again later.'});
          thisComponent.setState({ isSnackbarActive: true });
          thisComponent.setState({spinnerDisplay: false})
        } else if(errorCode === 'auth/weak-password') {
          thisComponent.setState({error: 'Password is not long enough'});
          thisComponent.setState({ isSnackbarActive: true });
          thisComponent.setState({spinnerDisplay: false})
        } else {
          thisComponent.setState({error: errorMessage});
          thisComponent.setState({ isSnackbarActive: true });
          thisComponent.setState({spinnerDisplay: false})
        }
      });
  }

  //when an error snackbar appears, it will eventually time out and disppear
  handleTimeoutSnackbar() {
    this.setState({ isSnackbarActive: false });
  }

  render() {
    var content = null; //what main content to show
    var snackbarContent = null; //what snackbar content to show

    if(!this.state.userId) { //if logged out, show signup form
      content = (<div><SignUpForm signUpCallback={this.signUp} /></div>);
    }

    if(this.state.spinnerDisplay) { //show spinner when loading
      snackbarContent = <Spinner singleColor />;
    } else if(this.state.error !== undefined) { //otherwise show error message
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

export default SignUp;
