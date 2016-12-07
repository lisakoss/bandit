import React from 'react';
import firebase from 'firebase';
import UserRecentListings from './UserRecentListings.js';
import {hashHistory} from 'react-router';

class MyRecentListings extends React.Component {
  constructor(props){
		super(props);
		this.state = {};
	}

    /* Lifecycle callback:
    executed when the component appears on the screen. */
    componentWillMount() {
        /* Add a listener and callback for authentication events */
        this.unregister = firebase.auth().onAuthStateChanged(user => {
        if(user) {
            this.setState({userId:user.uid});
        } else { // redircts user to login page if not logged in
            this.setState({userId: null}); //null out the saved state
            const path = '/login'; // prompts user to login to see content
            hashHistory.push(path);
        }
        })
    }

    /* Unregister listerns. */
    componentWillUnmount() {
        if(this.unregister) {
            this.unregister();
        }
    }

    render() {
        if(!this.state.userId){
            return null;
        }
        return (
            <div>
                <div className="content-container">
                    <h1>My Recent Listings</h1>
                    <p>Your <strong>ten</strong> most recent listings are shown here.</p>
                    <UserRecentListings profileID={this.state.userId} />
                </div>
            </div>
        );
    }
}

export default MyRecentListings;