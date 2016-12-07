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

	componentDidMount() {
		/* Add a listener and callback for authentication events */
		this.unregister = firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.setState({userId:user.uid});
        var profileRef = firebase.database().ref('users/' + this.state.userId);
				profileRef.once("value")
					.then(snapshot => {
						this.setState({displayName: snapshot.child("displayName").val()});
					});
			}
			else{
				this.setState({userId: null}); //null out the saved state
        this.setState({displayName: null}); //null out the saved state
				const path = '/';
				hashHistory.push(path);
			}
		})
  }

  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }
  
  //A callback function for logging out the current user
  signOut(){
    /* Sign out the user, and update the state */
    firebase.auth().signOut();
  }

  render() {
  	return(
      <div>
				{this.state.userId &&  /*inline conditional rendering*/
          <div className="container-drawer">
            <Button raised accent ripple onClick={()=>this.signOut()}><i className="fa fa-sign-out" aria-hidden="true"></i> Sign Out {this.state.displayName}</Button>
          </div>
        }
		</div>
    );
  }
}

export default SignOut;