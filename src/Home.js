import React from 'react';
import {Layout, Button} from 'react-mdl';
import firebase from 'firebase';

class Home extends React.Component {
  constructor(props){
		super(props);
		this.state = {};
	}
	
	//Lifecycle callback executed when the component appears on the screen.
	//Grabs basic user data 
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId: user.uid});
				this.setState({displayName: firebase.auth().currentUser.displayName});
				this.setState({avatar: firebase.auth().currentUser.photoURL});
      }
      else {
        this.setState({userId: null}); //null out the saved state
				this.setState({displayName: null}); //null out the saved state
				this.setState({avatar: null}); //null out the saved state
      }
    });
  }

  //when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

	render() {
		var signUpMessage = null;

		if(this.state.userId === null) {
			signUpMessage =(<div className="bottom-sign-up" role="region">
												<p>Don't have an account? <a href="/signup">Sign up</a> today!</p>
										  </div>);
		}

		return (
			<div className="container" role="region">
				<Layout style={{background: 'url(./img/IMG_7962.png) center / cover'}}>
					<div className="welcome-msg">
						<p className="welcome-title">band together</p>
						<p className="welcome-msg-text">find your next gig, band, or collaboration</p>
						<p className="welcome-msg-text">breakthrough locally or worldwide</p>
						<a href="/search"><Button raised accent ripple className="search-button"><i className="fa fa-search" aria-hidden="true"></i> Start your search here</Button></a>
					</div>
					{signUpMessage}
				</Layout>
			</div>
		);
	}
}

export default Home;
