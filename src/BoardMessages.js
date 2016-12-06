import React from 'react';
import Time from 'react-time';
import firebase from 'firebase';
import {Textfield, Button, Dialog, DialogTitle, DialogContent, DialogActions} from 'react-mdl';

/* A form the user can use to post a channel message. */
export class MessageBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        "post":'',
        "email": "hidden"
    };
  }
	
  /* Tracks changes in message input field. */
  updatePost(event) {
    this.setState({post: event.target.value});
  }

  /* Posts a new channel message to the database. */
  postMessage(event){
    if(event.key === 'Enter' && this.state.post.length !== 0 && this.state.email === "hidden") {
        event.preventDefault(); // don't submit like usual

        /* Add a new channel message to the database */
        var messagesRef = firebase.database().ref('messages/' + this.props.channel);
        var newMessage = {
            text: this.state.post,
            userId: firebase.auth().currentUser.uid, 
            time: firebase.database.ServerValue.TIMESTAMP,
            timeEdited: ''
        };
        messagesRef.push(newMessage); // upload msg to database

        this.setState({post:''}); // empty out post so that message field is blank
    }
  }

  /* Lifecycle callback:
  executed when the component appears on the screen. */
	componentDidMount() {
		var thisComponent = this;
		firebase.auth().onAuthStateChanged(function(user) {
			if(!user.emailVerified) { // displays an error message if email is not verified
				thisComponent.setState({email:"show"});
			}
		})
	}

  render() {
    return (
			<div className="write-msg">
				<div className={this.state.email}>Please verifiy email</div>

				<form role="form">
					<Textfield
						onChange={(e) => this.updatePost(e)}
						label="what would you like to say?"
						value={this.state.post}
						rows={1}
						className="msg-input"
						onKeyPress={(e) => this.postMessage(e)}
					/>
				</form>
			</div>
    );
  }
}

/* A list of channel messages that have been posted. */
export class MessageList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        "messages":[]
    };
  }
	
  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener for changes to the user details object, and save in the state */
    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
      this.setState({users:snapshot.val()});
    });

    /* Add a listener for changes to the chirps object, and save in the state.
		Limit displayed messages to 100 in each channel. */
    var messagesRef = firebase.database().ref('messages/' + this.props.channel).limitToLast(100);
    messagesRef.on('value', (snapshot) => {
      var messageArray = []; 
      snapshot.forEach(function(child){
        var message = child.val();
				message.key = child.key; 
				messageArray.push(message); 
      });
      this.setState({messages:messageArray});
    });
  }

  /* When component will be removed. */
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users').off();
    firebase.database().ref('messages').off();
  }

	/* Update component with new props. */
	componentWillReceiveProps(nextProps) {
        /* Add a listener for changes to the user details object, and save in the state */
        var usersRef = firebase.database().ref('users');
        usersRef.on('value', (snapshot) => {
            this.setState({users:snapshot.val()});
            });

        /* Add a listener for changes to the chirps object, and save in the state */
        var messagesRef = firebase.database().ref('messages/' + nextProps.channel).limitToLast(100);
        messagesRef.on('value', (snapshot) => {
            var messageArray = []; 
            snapshot.forEach(function(child){
                var message = child.val();
                message.key = child.key;
                messageArray.push(message);
            });
            this.setState({messages:messageArray});
        });
	}

  render() {
    // don't show if don't have user data yet (to avoid partial loads)
    if(!this.state.users){
      return null;
    }

    /* Create a list of <MessageItem /> objects. */
    var messageItems = this.state.messages.map((message) => {
			return (
				<MessageItem message={message} 
                    user={this.state.users[message.userId]} 
                    key={message.key}
                    channel={this.props.channel} />
			);
    })

    return (<div>{messageItems}</div>);
  }
}

/* A single message. */
class MessageItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        'post':'',
        'showControls': 'hidden'
    };

    // bind functions
    this.postMessage = this.postMessage.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
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
        var messageRef = firebase.database().ref('messages/' + this.props.channel + '/' + this.props.message.key);
        messageRef.child('text').set(newMessage);
        messageRef.child('timeEdited').set(firebase.database.ServerValue.TIMESTAMP);
        this.setState({edit:false});
        this.setState({post:''}); // empty out post (controlled input)
    }
  }

	/* Determines if the user is the creator of the original post and allows
	them to edit it if true. */
	editMessage() {
        var userId = firebase.auth().currentUser.uid
        if(userId === this.props.message.userId) {
            this.setState({edit:true});
        }	
	}

	/* Removes the specified message from the database. */
	deleteMessage() {
		var messageRef = firebase.database().ref('messages/' + this.props.channel + '/' + this.props.message.key);
		messageRef.remove();
	}

	/* Shows edit and delete buttons for each individual post. */
	showControls() {
        var thisComponent = this;
        var userRef = firebase.database().ref('messages/' + this.props.channel + '/' + this.props.message.key);
        userRef.once("value")
            .then(function(snapshot) {
                var childKey = snapshot.child('userId').val();
                if(childKey === firebase.auth().currentUser.uid) { // only shows controls on a user's own posts'
                    thisComponent.setState({showControls: 'show'});
                }
            });
	}

	/* Hides edit and delete buttons for each individual post. */
	hideControls() {
		this.setState({showControls: 'hidden'});
	}
    
    render() {
        var avatar = (this.props.user.avatar);
		var editContent = null;
		var lastEdited = '';

		if(!this.state.edit) { // show regular msg if not being edited
			editContent = this.props.message.text;
		} else if(this.state.edit) { // if being edited, show new text submit area 
			editContent =       (
        <form role="form">
					<Textfield
							onChange={(e) => this.updatePost(e)}
							label='edit message'
							value={this.state.post}
							rows={1}
							onKeyPress={(e) => this.postMessage(e)}
					/>
        </form>);
		} 

		/* Show last edit time. */
		if(this.props.message.timeEdited !== '') {
			lastEdited = <span className="time">(edited <Time value={this.props.message.timeEdited} relative/>)</span>;
		}

    return (
        <div>
            <div className="message-box" onMouseEnter={() => this.showControls()} onMouseLeave={() => this.hideControls()}>
                <div>
                    {/* This image's src should be the user's avatar */}
                    <img className="image" src={avatar} role="presentation" />
                    
                    {/* Show the user's handle */}
                    <span className="handle">{this.props.user.handle} {/*space*/}</span>

                    {/* Show the time of the message */}
                    <span className="time"><Time value={this.props.message.time} relative/> </span>
                    {lastEdited}

                    <div className={this.state.showControls}>
                        <span className="edit {edited}" onClick={this.handleOpenDialog}><i className="fa fa-trash-o" aria-hidden="true"></i></span>
                        <Dialog open={this.state.openDialog}>
                            <DialogTitle>Delete Message?</DialogTitle>
                            <DialogContent>
                                <p>Are you sure you want to permanently delete this message?</p>
                            </DialogContent>
                            <DialogActions>
                                <Button type='button' onClick={() => this.deleteMessage()}>Delete</Button>
                                <Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
                            </DialogActions>
                        </Dialog>
                        <span className="edit {edited}" onClick={() => this.editMessage()}><i className="fa fa-pencil" aria-hidden="true"></i></span>
                    </div>
                </div>

                {/* Show the text of the message */}
                <div className="message">{editContent}</div>
            </div>  
        </div>    
    );
  }
}

MessageItem.propTypes = {
  message: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default MessageList;