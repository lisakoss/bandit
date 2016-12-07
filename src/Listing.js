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
			'edit': false
		}; 

		// bind functions
		this.postMessage = this.postMessage.bind(this);
    this.updatePost = this.updatePost.bind(this);
		this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
		this.handleComments = this.handleComments.bind(this);
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

	/* Determines the current message typed in the edit box. */
  updatePost(event) {
    this.setState({post: event.target.value});
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
      this.setState({edit:false});
    }
  }

	/* Determines if the user is the creator of the original post and allows
	them to edit it if true. */
	editMessage() {
		var thisComponent = this;
    var userId = firebase.auth().currentUser.uid;
    if(userId === this.state.listingUser) {
        thisComponent.setState({edit: true});
    }	
	}

	/* Removes the specified message from the database. */
	deleteMessage() {
		var messageRef = firebase.database().ref('posts/' + this.props.params.listingName);
		messageRef.remove();
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

	handleComments() {
		const path = '/comments/' + this.props.params.listingName;
    hashHistory.push(path);
	}

  render() {
		console.log(this.state);
		var listingImage = '';
    var editContent = null;
    var lastEdited = '';

    if(this.state.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.state.image;
    } 

		if(!this.state.edit) { // show regular msg if not being edited
    	editContent = this.state.post;
    } else if(this.state.edit) { // if being edited, show new text submit area 
				editContent = (<form role="form">
					<Textfield
					onChange={(e) => this.updatePost(e)}
					label='edit message'
					value={this.state.post}
					rows={1}
					onKeyPress={(e) => this.postMessage(e)}
					/>
				</form>);
		} 

    return (
      <div className="content-container">
			  <div className="listing-img" style={{background: 'url(' + listingImage + ') center / cover'}}>
					<div className={this.state.showControls}>
						<span className="edit {edited}" onClick={this.handleOpenDialog}><i className="fa fa-trash-o" aria-hidden="true"></i></span>
						<Dialog open={this.state.openDialog}>
							<DialogTitle>Delete Post?</DialogTitle>
							<DialogContent>
								<p>Are you sure you want to permanently delete this post?</p>
							</DialogContent>
							<DialogActions>
								<Button type='button' onClick={() => this.deleteMessage()}>Delete</Button>
								<Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
							</DialogActions>
						</Dialog>
						<span className="edit {edited}" onClick={() => this.editMessage()}>editing controls: <i className="fa fa-pencil" aria-hidden="true"></i></span>
					</div>
					<h1 className="listing-title">{this.state.title}</h1>
					<span className="listing-tags">{this.state.tags}</span>
				</div>

				<div className="listing">
					<span className="user-info">
						<img className="listing-avatar" src={this.state.avatar} alt="user avatar" />
						<p><strong>Name</strong>: {this.state.displayName}</p>
						<p><strong>Location</strong>: {this.state.location}</p>
						<Button type='button' colored onClick={this.handleComments}>Contact</Button><Button colored>Profile</Button>
					</span>

					<span className="listing-text">
						<p className={this.state.type}>{this.state.type}</p>
						<span><strong>Job</strong>: {this.state.job}</span>
						<span><strong>Instruments/Skills</strong>: {this.state.instrument}</span>
						<div className="listing-desc">{editContent}</div>
					</span>
				</div>
      </div>
    );
  }
}

export default Listing;