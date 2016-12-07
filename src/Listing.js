import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import {Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions} from 'react-mdl';

class Listing extends React.Component {
constructor(props){
    super(props);
    this.state = {
			'post':'',
			'showControls': 'hidden',
		}; 

		// bind functions
		this.postMessage = this.postMessage.bind(this);
		this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
  }

  componentDidMount() {
		var messagesRef = firebase.database().ref('posts/' + this.props.params.listingName);
		messagesRef.once('value', (snapshot) => {
			var listingContent = snapshot.val();
			this.setState({title: listingContent.title, summary: listingContent.summary, location: listingContent.location, instrument: listingContent.instrument, job: listingContent.job, image: listingContent.image, tags: listingContent.tags, post: listingContent.text, type: listingContent.type, listingUser: listingContent.userId})

			// only show edit controls on a user's own posts
			if(snapshot.child('userId').val() === firebase.auth().currentUser.uid) {
				this.setState({showControls: 'show'});
			}

			// update user's display name and avatar image
			var usersRef = firebase.database().ref('users/' + listingContent.userId);
			usersRef.on('value', (snapshot) => {
				this.setState({displayName: snapshot.child('displayName').val()});
				this.setState({avatar: snapshot.child('avatar').val()});
    	});
    });
	}

	//when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

	/* Dialog box open rendering. */
  handleOpenDialog() {
    this.setState({
      openDialog: true
    });
  }

	/* Dialog box close rendering. */
  handleCloseDialog() {
    this.setState({
      openDialog: false
    });
  }

	/* Resubmit the edited message to the database. */
  postMessage(event){
    var newMessage = this.state.post;
    if(event.key === 'Enter' && this.state.post.length !== 0) {
      event.preventDefault(); // don't submit like usual

      /* Add a new channel message to the database. */
      var messageRef = firebase.database().ref('posts/' + this.props.params.listingName);
      messageRef.child('text').set(newMessage);
      messageRef.child('timeEdited').set(firebase.database.ServerValue.TIMESTAMP);
    }
  }

	/* Redirects user to the edit your listing page. */
	editMessage() {
		const path = this.props.params.listingName + '/editpost';
    hashHistory.push(path);
	}

	/* Removes the specified message from the database. */
	deleteMessage() {
		var messageRef = firebase.database().ref('posts/' + this.props.params.listingName);
		messageRef.remove(); // removes listing from db

		// remove listing from user's recent listings
		var userRef = firebase.database().ref('users/' + this.state.listingUser + '/posts');
		var thisComponent = this;

		userRef.on('value', (snapshot) => {
      snapshot.forEach(function(child){
        var message = child.val();
				
				if(message.listingId === thisComponent.props.params.listingName) {
					firebase.database().ref('users/' + thisComponent.state.listingUser + '/posts/' + child.key).remove();
				}
      });
    });

		console.log(this.state);
		const path = '/board'; // prompts user to login to see content
    hashHistory.push(path);
	}

	/* Shows edit and delete buttons for each individual post. */
	showControls() {
		var thisComponent = this;
		var userRef = firebase.database().ref('messages/' + this.props.params.listingName);
		userRef.once("value")
			.then(function(snapshot) {
				var childKey = snapshot.child('userId').val();
				console.log(childKey);
				if(childKey === firebase.auth().currentUser.uid) { // only shows controls on a user's own posts'
					thisComponent.setState({showControls: 'show'});
				}
			});
	}

  render() {
		var listingImage = '';
    var lastEdited = '';

    if(this.state.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.state.image;
		} 

    return (
      <div className="content-container">
			  <div className="listing-img" style={{background: 'url(' + listingImage + ') center / cover'}}>
					<h1 className="listing-title">{this.state.title}</h1>
					<span className="listing-tags">{this.state.tags}</span>
				</div>

				<div className="listing">
					<span className="user-info">
						<img className="listing-avatar" src={this.state.avatar} alt="user avatar" />
						<p><strong>Name</strong>: {this.state.displayName}</p>
						<p><strong>Location</strong>: {this.state.location}</p>
						<Button colored>Contact</Button><Button colored>Profile</Button>
											
											
						<div className={this.state.showControls}>
						<h2 className="editing-heading">post controls</h2>
							<span className="edit" onClick={() => this.editMessage()}><Button colored><i className="fa fa-pencil" aria-hidden="true"></i> Edit</Button></span>
							<span className="edit" onClick={this.handleOpenDialog}><Button colored><i className="fa fa-trash-o" aria-hidden="true"></i> Delete</Button></span>
							<Dialog open={this.state.openDialog}>
								<DialogTitle>delete post?</DialogTitle>
								<DialogContent>
									<p>Are you sure you want to permanently delete this post?</p>
								</DialogContent>
								<DialogActions>
									<Button type='button' onClick={() => this.deleteMessage()}>Delete</Button>
									<Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
								</DialogActions>
							</Dialog>
						</div>
					</span>

					<span className="listing-text">
						<p className={this.state.type}>{this.state.type}</p>
						<span><strong>Job</strong>: {this.state.job}</span>
						<span><strong>Instruments/Skills</strong>: {this.state.instrument}</span>
						<div className="listing-desc">{this.state.post}</div>
					</span>
				</div>
      </div>
    );
  }
}

export default Listing;