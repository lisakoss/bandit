import React from 'react';
import Time from 'react-time';
import firebase from 'firebase';
import {Textfield, Button, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardTitle, CardText, CardActions, Radio, RadioGroup} from 'react-mdl';
import {hashHistory} from 'react-router';

/* A form the user can use to post a listing message. */
export class MessageBox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        "post":'',
        "postTyped": false,
        "title": '',
        "titleTyped": false,
        "summary": '',
        "summaryTyped": false,
        "location": '',
        "locationTyped": false,
        "instrument": '',
        "instrumentTyped": false,
        "job": '',
        "jobTyped": false,
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
    this.setState({post: event.target.value, postTyped: true});
  }

  /* Tracks changes in message input field. */
  updateTitle(event) {
    this.setState({title: event.target.value, titleTyped: true});
  }

  /* Tracks changes in message input field. */
  updateSummary(event) {
    this.setState({summary: event.target.value, summaryTyped: true});
  }

  /* Tracks changes in message input field. */
  updateLocation(event) {
    this.setState({location: event.target.value, locationTyped: true});
  }

  /* Tracks changes in message input field. */
  updateInstrument(event) {
    this.setState({instrument: event.target.value, instrumentTyped: true});
  }

  /* Tracks changes in message input field. */
  updateJob(event) {
    this.setState({job: event.target.value, jobTyped: true});
  }

  /* Tracks changes in message input field. */
  updateImage(event) {
    this.setState({image: event.target.value});
  }

  /* Tracks changes in message input field. */
  updateTags(event) {
    this.setState({tags: event.target.value});
  }

  /* Tracks changes in the listing type field. */
  listingType(event) {
    this.setState({type: event.target.value});
  }

  /* Posts a new listing message to the database. */
  postMessage(event){
    event.preventDefault(); // don't submit like usual
    if(this.state.post.length !== 0 && this.state.title.length !== 0 && this.state.summary.length !== 0 
      && this.state.summary.length < 100 && this.state.location.length !== 0 && this.state.instrument.length !== 0
      && this.state.job.length !== 0) {

      /* Add a new listing message to the database */
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

      /* Add listing to user's id */
      var currUser = firebase.auth().currentUser.uid;
      var usersRef = firebase.database().ref('users/' + currUser + '/posts');
      var newListing = {
        listingId: listingId,
        title: this.state.title,
        summary: this.state.summary,
        image: this.state.image,
        type: this.state.type,
        userId: firebase.auth().currentUser.uid, 
        time: firebase.database.ServerValue.TIMESTAMP,
      }
      usersRef.push(newListing);

      /* empty out post so that message field is blank. */
      this.setState({post:'', title:'', summary:'', location:'', instrument:'', job:'', image:'', tags:''});

      const path = '/board'; // redirects user back to board after posting
			hashHistory.push(path);
    } else { // determines if field has been left blank
      if(this.state.post.length === 0) {
        this.setState({postTyped: true});
      } if(this.state.title.length === 0) {
        this.setState({titleTyped: true});
      } 
      if(this.state.summary.length === 0) {
        this.setState({summaryTyped: true});
      }
      if(this.state.location.length === 0) {
        this.setState({locationTyped: true});
      }
      if(this.state.instrument.length === 0) {
        this.setState({instrumentTyped: true});
      }
      if(this.state.job.length === 0) {
        this.setState({jobTyped: true});
      }
    }
  }

  render() {
    var listingImage = '';

    // show default listing img if none is given.
    if(this.state.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.state.image;
    }    

    return (
			<div className="write-msg" role="article">
				<form role="form">
          <Textfield
            onChange={(e) => this.updateTitle(e)}
            label="listing title"
            floatingLabel
            value={this.state.title}
            className="msg-input"
          />
          {this.state.title.length === 0 && this.state.titleTyped === true &&
            <p className="help-block">Title cannot be left blank.</p>
          }
          <Textfield
            onChange={(e) => this.updateSummary(e)}
            label="short summary"
            floatingLabel
            value={this.state.summary}
            className="msg-input"
          />
          {this.state.summary.length > 100 &&
            <p className="help-block">100 character limit.</p>
          }
          {this.state.summary.length === 0 && this.state.summaryTyped === true &&
            <p className="help-block">Summary cannot be left blank.</p>
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
          {this.state.location.length === 0 && this.state.locationTyped === true &&
            <p className="help-block">Location cannot be left blank.</p>
          }
          {this.state.instrument.length === 0 && this.state.instrumentTyped === true &&
            <p className="help-block">Instrument(s) and/or skills cannot be left blank.</p>
          }
          {this.state.job.length === 0 && this.state.jobTyped === true &&
            <p className="help-block">Job cannot be left blank.</p>
          }
          <div role="region" className="post-img" style={{background: 'url(' + listingImage + ') center / cover'}} />
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
						label="listing description"
						value={this.state.post}
						rows={6}
						className="msg-input"
					/>
          {this.state.post.length === 0 && this.state.postTyped === true &&
            <p className="help-block">Listing description cannot be left blank.</p>
          }

          <p className="form-para">choose listing type:</p>
          <RadioGroup name="demo" value="wanted">
            <Radio value="wanted" onClick={(e) => this.listingType(e)}>wanted</Radio>
            <Radio value="offering" onClick={(e) => this.listingType(e)}>offering</Radio>
          </RadioGroup>

          <Button ripple className="create-button" onClick={(e) => this.postMessage(e)}>Post Listing</Button>
          <i onClick={this.handleOpenDialog} className="fa fa-question fa-2x" aria-hidden="true"></i>
          <Dialog open={this.state.openDialog} role="region" aria-live="polite">
            <DialogTitle>Need Help?</DialogTitle>
            <DialogContent>
              <div className="help">
                <p><strong>Listing Title</strong>: a few words advertising what you're offering or looking for.</p>
                <p><strong>Short Summary</strong>: a small blurb that gives a few details about your listing. <em>Displayed on outside of listing on board.</em></p>
                <p><strong>Zip Code</strong>: the city, state, and zip code where the listing will take place.</p>
                <p><strong>Instrument/Skills</strong>: the instrument or skills required for your listing.</p>
                <p><strong>Job Title</strong>: the title of the job with skills you're offering or looking for.</p>
                <p><strong>Listing Image</strong>: image displayed on the outside of your listing; <em>optional</em>.</p>
                <p><strong>Tags</strong>: tag your listing with relevant words to make it easier for others to find your listing via searching; <em>optional</em>.</p>
                <p><strong>Listing Description</strong>: describe in detail what you can offer or what you're looking for from someone else.</p>
                <p><strong>Listing Type</strong>: choose if you're looking for someone to fill a position (wanted) or if you're looking for a position (offering); <em>cannot be edited later</em>.</p>
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

/* A list of listing messages that have been posted. */
export class MessageList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        "messages":[]
    };
  }
	
  //Lifecycle callback executed when the component appears on the screen.
  componentDidMount() {
    /* Add a listener for changes to the user details object, and save in the state */
    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
      this.setState({users:snapshot.val()});
    });

    /* Add a listener for changes to the listings object, and save in the state. */
    var messagesRef = firebase.database().ref('posts');
    messagesRef.on('value', (snapshot) => {
      var messageArray = []; 
      snapshot.forEach(function(child){
        var message = child.val();
				message.key = child.key; 
				messageArray.push(message); 
      });
      messageArray.sort((a,b) => b.time - a.time); //reverse order
      this.setState({messages: messageArray});
    });
  }

  /* When component will be removed. */
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users').off();
    firebase.database().ref('posts').off();
  }

  render() {
    // don't show if don't have user data yet
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
                     listingUserId={message.userId}
                     type={message.type}
                     key={message.key}
                     id={message.key}
                     />
			);
    })
    return (<div className="category-flex">{messageItems}</div>);
  }
}

/* A single listing. */
class MessageItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        'post':'',
    };
  }
    
  render() {
    var avatar = (this.props.user.avatar);
    var lastEdited = '';
    var listingImage = '';
    var id = "/#/posts/" + this.props.id;
    var listingUserId = "/#/profile/" + this.props.listingUserId;
    var tagsArray = this.props.tags.split(" ");
    var tagsString = '';

    // Add #'s to each word given as a tag.
    tagsArray.forEach(function(word) {
      var noHashtagWord = word;
      word = '#' + word;
      tagsString += '<a href="#/search/' + noHashtagWord + '">' + word + '</a>' + ' ';
    });

    // Set the HTML so that the links work properly.
    var hashtagContent  = (<span className="tags" dangerouslySetInnerHTML={{__html:tagsString}}></span>);

    // Display the given listing image. If none given, display the default.
    if(this.props.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.props.image;
    }

    // Show last edit time.
    if(this.props.message.timeEdited !== '') {
      lastEdited = <span>(edited <Time value={this.props.message.timeEdited} relative/>)</span>;
    }

    return (
      <div className="card-column" role="article">
        <div className="item" role="region">
          <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
            <CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(' + listingImage + ') center / cover'}}>{this.props.title}</CardTitle>
            <span className="time"><span className={this.props.type}>{this.props.type}</span><Time value={this.props.message.time} relative/> {lastEdited}</span>
          
            <CardText>
              <div className="message">{this.props.summary}</div>
            </CardText>

            <div className="posted-by">

              {hashtagContent}
              posted by: {/* This image's src should be the user's avatar */}
              <img className="avatar-post" src={avatar} role="presentation" /> <span className="handle"><a href={listingUserId}>{this.props.user.displayName}</a></span>
            </div>

            <CardActions border>
              <a href={id}><Button colored>Read</Button></a><Button colored>Contact</Button>
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