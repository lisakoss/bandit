import React from 'react';
import Time from 'react-time';
import firebase from 'firebase';
import {Textfield, Button, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardTitle, CardText, CardActions, Tooltip, Radio, RadioGroup} from 'react-mdl';

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
        "tags": '',
        "type": 'wanted'
    };

    // bind functions 
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

  listingType(event) {
    this.setState({type: event.target.value});
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
            type: this.state.type,
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
        var newListing = {
          listingId: listingId
        }
        usersRef.push(newListing);

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
    var listingImage = '';

    if(this.state.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.state.image;
    }    

    console.log(this.state);

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
            label="short summary"
            floatingLabel
            value={this.state.summary}
            className="msg-input"
          />
          {this.state.summary.length > 100 &&
            <p className="help-block">100 character limit!</p>
          }
          <Textfield
            onChange={(e) => this.updateLocation(e)}
            label="location (city, state, &amp; zip code)"
            floatingLabel
            value={this.state.location}
            className="msg-input-type"
            style={{width: '33%'}}
          />
          <Textfield
            onChange={(e) => this.updateInstrument(e)}
            label="instrument(s) and/or skills"
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
          <div className="post-img" style={{background: 'url(' + listingImage + ') center / cover'}} />
          <Textfield
            onChange={(e) => this.updateImage(e)}
            label="listing image url"
            type="text"
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
						label="description"
						value={this.state.post}
						rows={6}
						className="msg-input"
					/>

          <p className="form-para">choose listing type:</p>
          <RadioGroup name="demo" value="wanted">
            <Radio value="wanted" onClick={(e) => this.listingType(e)}>wanted</Radio>
            <Radio value="offering" onClick={(e) => this.listingType(e)}>offering</Radio>
          </RadioGroup>

          <Button ripple className="create-button" onClick={(e) => this.postMessage(e)}>Post Listing</Button>
          <i onClick={this.handleOpenDialog} className="fa fa-question fa-2x" aria-hidden="true"></i>
          <Dialog open={this.state.openDialog}>
            <DialogTitle>Need Help?</DialogTitle>
            <DialogContent>
              <div className="help">
                <p><strong>Listing Title</strong>: a few words advertising what you're offering or looking for.</p>
                <p><strong>Short Summary</strong>: a small blurb that gives a few details about your listing. <em>Displayed on outside of listing on board.</em></p>
                <p><strong>Zip Code</strong>: 5 digits only; your location.</p>
                <p><strong>Instrument/Skills</strong>: the instrument or skills required for your listing.</p>
                <p><strong>Job Title</strong>: the title of the job with skills you're offering or looking for.</p>
                <p><strong>Listing Image</strong>: image displayed on the outside of your listing; <em>optional</em>.</p>
                <p><strong>Tags</strong>: tag your listing with relevant words to make it easier for others to find your listing via searching.</p>
                <p><strong>Description</strong>: describe in detail what you can offer or what you're looking for from someone else.</p>
              </div>
            </DialogContent>
            <DialogActions fullWidth>
              <Button type='button' onClick={this.handleCloseDialog}>Close</Button>
            </DialogActions>
          </Dialog>
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
                     type={message.type}
                     key={message.key}
                     id={message.key}
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
    };
  }
    
    render() {
      var avatar = (this.props.user.avatar);
      var userName = (this.props.user.displayName);
      var lastEdited = '';
      var listingImage = '';
      var id = "/#/posts/" + this.props.id;

      if(this.props.image === '') {
        console.log(this.props.image);
        listingImage = './img/defaultboardimage.jpg';
      } else {
        console.log(this.props.image);
        listingImage = this.props.image;
      }

		/* Show last edit time. */
		if(this.props.message.timeEdited !== '') {
			lastEdited = <span>(edited <Time value={this.props.message.timeEdited} relative/>)</span>;
		}

    return (
      <div className="card-column">
        <div className="item">
          <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
            <CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(' + listingImage + ') center / cover'}}>{this.props.title}</CardTitle>
            <span className="time"><span className={this.props.type}>{this.props.type}</span><Time value={this.props.message.time} relative/> {lastEdited}</span>
          
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
              <a href={id}><Button colored>Read</Button></a><Button colored>Contact</Button><Button colored>Bookmark</Button>
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