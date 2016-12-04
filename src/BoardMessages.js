import React from 'react';
import Time from 'react-time';
import firebase from 'firebase';
import {Textfield, Button, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardTitle, CardText, CardActions, Tooltip} from 'react-mdl';

/* A form the user can use to post a channel message. */
export class MessageBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        "post":'',
        //"email": "hidden"
        "title": '',
        "summary": '',
        "location": '',
        "instrument": '',
        "job": '',
        "image": '',
        "tags": ''
    };
  }
	
  /* Tracks changes in message input field. */
  updatePost(event) {
    this.setState({post: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateTitle(event) {
    this.setState({title: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateSummary(event) {
    this.setState({summary: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateLocation(event) {
    this.setState({location: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateInstrument(event) {
    this.setState({instrument: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateJob(event) {
    this.setState({job: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateImage(event) {
    this.setState({image: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateTags(event) {
    this.setState({tags: event.target.value});
  }

  /* Posts a new channel message to the database. */
  postMessage(event){
    //&& this.state.email === "hidden"
    if(this.state.post.length !== 0) {
        event.preventDefault(); // don't submit like usual

        /* Add a new channel message to the database */
        var messagesRef = firebase.database().ref('posts');
        var newMessage = {
            text: this.state.post,
            title: this.state.title,
            summary: this.state.summary,
            location: this.state.location,
            instrument: this.state.instrument,
            job: this.state.job,
            image: this.state.image,
            tags: this.state.tags,
            userId: firebase.auth().currentUser.uid, 
            time: firebase.database.ServerValue.TIMESTAMP,
            timeEdited: ''
        };
        var listing = messagesRef.push(newMessage); // upload msg to database
        var listingId = listing.key;
        console.log(listingId);

        /* Add listing to user's id */
        var currUser = firebase.auth().currentUser.uid;
        var usersRef = firebase.database().ref('users/' + currUser + '/posts');
        usersRef.push(listingId);

        /* empty out post so that message field is blank. */
        this.setState({post:'', title:'', summary:'', location:'', instrument:'', job:'', image:'', tags:''});
    }
  }

  /* Lifecycle callback:
  executed when the component appears on the screen. */
	componentDidMount() {
		//var thisComponent = this;
		//firebase.auth().onAuthStateChanged(function(user) {
			//if(!user.emailVerified) { // displays an error message if email is not verified
				//thisComponent.setState({email:"show"});
			//}
		//})
	}

  render() {
    return (
			<div className="write-msg">
				{/*<div className={this.state.email}>Please verifiy email</div>*/}

				<form role="form">
          <Textfield
            onChange={(e) => this.updateTitle(e)}
            label="listing title"
            floatingLabel
            value={this.state.title}
            className="msg-input"
          />
          <Textfield
            onChange={(e) => this.updateSummary(e)}
            label="short summary (displayed on outside of listing)"
            floatingLabel
            value={this.state.summary}
            className="msg-input"
          />
          {this.state.summary.length > 100 &&
            <p className="help-block">100 character limit!</p>
          }
          <Textfield
            onChange={(e) => this.updateLocation(e)}
            label="zip code"
            floatingLabel
            value={this.state.location}
            className="msg-input-type"
            style={{width: '33%'}}
          />
          <Textfield
            onChange={(e) => this.updateInstrument(e)}
            label="instrument"
            floatingLabel
            value={this.state.instrument}
            className="msg-input-type"
            style={{width: '33%'}}
          />
          <Textfield
            onChange={(e) => this.updateJob(e)}
            label="job title"
            floatingLabel
            value={this.state.job}
            className="msg-input-type"
            style={{width: '33%'}}
          />
          <div className="post-img" style={ {backgroundImage: "url(" + this.state.image + ")"}} />
          <Textfield
            onChange={(e) => this.updateImage(e)}
            label="post image url"
            type="text"
            name="avatar"
            placeholder="http://www.test.com/picture.jpg"
            floatingLabel
            value={this.state.image}
            className="msg-input-type"
            style={{width:"50%"}}
          />
          <Textfield
            onChange={(e) => this.updateTags(e)}
            label="listing tags"
            floatingLabel
            value={this.state.tags}
            className="msg-input-type"
            style={{width: '50%'}}
          />
          <Textfield
						onChange={(e) => this.updatePost(e)}
						label="what would you like to say?"
						value={this.state.post}
						rows={6}
						className="msg-input"
					/>

          <Button ripple className="create-button" onClick={(e) => this.postMessage(e)}>Post Listing</Button>
          <Tooltip label={<span>Need Help?<br/><strong>Title</strong>: blah<br/><strong>Short Summary</strong>: blah</span>}>
            <i className="fa fa-question fa-2x" aria-hidden="true"></i>
          </Tooltip>
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
    var messagesRef = firebase.database().ref('posts');
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
    firebase.database().ref('posts').off();
  }

	/* Update component with new props. */
	componentWillReceiveProps(nextProps) {
    /* Add a listener for changes to the user details object, and save in the state */
    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
        this.setState({users:snapshot.val()});
        });

    /* Add a listener for changes to the chirps object, and save in the state */
    var messagesRef = firebase.database().ref('posts');
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
                     title={message.title}
                     summary={message.summary}
                     tags={message.tags}
                     image={message.image}
                     user={this.state.users[message.userId]} 
                     key={message.key}
                     />
			);
    })
    return (<div className="category-flex">{messageItems}</div>);
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
      var messageRef = firebase.database().ref('posts/' + this.props.message.key);
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
		var messageRef = firebase.database().ref('posts/' + this.props.message.key);
		messageRef.remove();
	}

	/* Shows edit and delete buttons for each individual post. */
	showControls() {
    var thisComponent = this;
    var userRef = firebase.database().ref('posts/' + this.props.message.key);
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
      var userName = (this.props.user.displayName);
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
			lastEdited = <span>(edited <Time value={this.props.message.timeEdited} relative/>)</span>;
		}

    return (
      <div className="card-column">
        <div className="item" onMouseEnter={() => this.showControls()} onMouseLeave={() => this.hideControls()}>
          <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
            <CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(' + this.props.image + ') center / cover'}}>{this.props.title}</CardTitle>
              <span className="time"><Time value={this.props.message.time} relative/> {lastEdited}</span>
            
            <CardText>
              <div className="message">{this.props.summary}</div>
            </CardText>

            <div className="posted-by">

              <span className="tags">
                {this.props.tags}
              </span>
              posted by: {/* This image's src should be the user's avatar */}
              <img className="avatar-post" src={avatar} role="presentation" /> <span className="handle">{this.props.user.displayName}</span>
          
            </div>

            <CardActions border>
              <Button colored>Read</Button><Button colored>Contact</Button>
            
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
                <span className="edit {edited}" onClick={() => this.editMessage()}><i className="fa fa-pencil" aria-hidden="true"></i></span>
              </div>
            </CardActions>
          </Card>
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