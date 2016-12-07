import React from 'react';
import firebase from 'firebase';
import './index.css';
import { Button } from 'react-mdl';
import { hashHistory } from 'react-router';

//A component that will sign the user out of the website
class SignOut extends React.Component {
	constructor(props){
		super(props);
		this.state = {};
	}

	//Lifecycle callback executed when the component appears on the screen.
	componentDidMount() {
		// Add a listener and callback for authentication events 
		this.unregister = firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.setState({userId:user.uid}); //grabs user id
			} else { //redirects to home page once logged out
				this.setState({userId: null}); //null out the saved state
				const path = '/';
				hashHistory.push(path);
			}
		});
  }

	//when component will be removed
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }
  
  //A callback function for logging out the current user
  signOut(){
    // Sign out the user
    firebase.auth().signOut();
  }

  render() {
  	return(
      <div>
				{this.state.userId &&  /*inline conditional rendering*/
          <div className="container-drawer">
            <Button raised accent ripple onClick={()=>this.signOut()}><i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out</Button>
          </div>
        }
			</div>
    );
  }
}

export default SignOut;