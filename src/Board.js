import React from 'react';
import {MessageList} from './BoardMessages';
import firebase from 'firebase';
import {hashHistory, Link} from 'react-router';
import {Button} from 'react-mdl';

class MessageBoard extends React.Component {
    constructor(props){
    super(props);
    this.state = {}; 
  }

  /* Lifecycle callback:
  executed when the component appears on the screen. */
  componentDidMount() {
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
    return (
      <div className="board-container">
				<h1>board</h1>
				<Link to="/createpost"><Button ripple className="create-button">Create Listing</Button></Link>
        <Link to="/recentlistings"><Button ripple className="create-button">Recent Listings</Button></Link>
        <div><MessageList/></div>
      </div>
    );
  }
}

export default MessageBoard;