import React from 'react';
import {Textfield, Button, Dialog, DialogTitle, DialogContent, DialogActions} from 'react-mdl';
import firebase from 'firebase';
import {hashHistory} from 'react-router';

class EditListing extends React.Component {
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

	componentDidMount() {
		var messagesRef = firebase.database().ref('posts/' + this.props.params.listingName);
		messagesRef.once('value', (snapshot) => {
			var listingContent = snapshot.val();
			this.setState({title: listingContent.title, summary: listingContent.summary, location: listingContent.location, instrument: listingContent.instrument, job: listingContent.job, image: listingContent.image, tags: listingContent.tags, post: listingContent.text, type: listingContent.type, listingUser: listingContent.userId});

			var currUser = firebase.auth().currentUser.uid;
      if (listingContent.userId !== currUser) {
        const path = '/board'; // redirects user to board if not their post
        hashHistory.push(path);
      }
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

  listingType(event) {
    this.setState({type: event.target.value});
  }

	/* Resubmit the edited message to the database. */
  postMessage(event){
    var newMessage = this.state.post;
		var newTitle = this.state.title;
		var newSummary = this.state.summary;
		var newLocation = this.state.location;
		var newInstrument = this.state.instrument;
		var newJob = this.state.job;
		var newImage = this.state.image;
		var newTags = this.state.tags;

		event.preventDefault(); // don't submit like usual
    if(this.state.post.length !== 0 && this.state.title.length !== 0 && this.state.summary.length !== 0 
      && this.state.summary.length < 100 && this.state.location.length !== 0 && this.state.instrument.length !== 0
      && this.state.job.length !== 0) {

      /* Add a new channel message to the database. */
      var messageRef = firebase.database().ref('posts/' + this.props.params.listingName);
      messageRef.child('text').set(newMessage);
      messageRef.child('timeEdited').set(firebase.database.ServerValue.TIMESTAMP);
			messageRef.child('title').set(newTitle);
			messageRef.child('summary').set(newSummary);
			messageRef.child('location').set(newLocation);
			messageRef.child('instrument').set(newInstrument);
			messageRef.child('job').set(newJob);
			messageRef.child('image').set(newImage);
			messageRef.child('tags').set(newTags);

			const path = '/posts/' + this.props.params.listingName; // redirects user back to listing after editing
			hashHistory.push(path);
    } else {
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

    if(this.state.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.state.image;
    }   

		return (
			<div className="board-container">
				<h1>edit your listing</h1>
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
						{this.state.post.length === 0 && this.state.postTyped === true &&
            	<p className="help-block">Listing description cannot be left blank.</p>
          	}

						<Button ripple className="create-button" onClick={(e) => this.postMessage(e)}>Edit Listing</Button>

						<i onClick={this.handleOpenDialog} className="fa fa-question fa-2x" aria-hidden="true"></i>
						<Dialog open={this.state.openDialog}>
							<DialogTitle>Need Help?</DialogTitle>
							<DialogContent>
								<div className="help">
									<p><strong>Listing Title</strong>: a few words advertising what you're offering or looking for.</p>
									<p><strong>Short Summary</strong>: a small blurb that gives a few details about your listing. <em>Displayed on outside of listing on board.</em></p>
									<p><strong>Zip Code</strong>: the city, state, and zip code where the listing will take place.</p>
									<p><strong>Instrument/Skills</strong>: the instrument or skills required for your listing.</p>
									<p><strong>Job Title</strong>: the title of the job with skills you're offering or looking for.</p>
									<p><strong>Listing Image</strong>: image displayed on the outside of your listing; <em>optional</em>.</p>
									<p><strong>Tags</strong>: tag your listing with relevant words to make it easier for others to find your listing via searching; <em>optional</em></p>
									<p><strong>Listing Description</strong>: describe in detail what you can offer or what you're looking for from someone else.</p>
								</div>
							</DialogContent>
							<DialogActions fullWidth>
								<Button type='button' onClick={this.handleCloseDialog}>Close</Button>
							</DialogActions>
						</Dialog>
					</form>
				</div>
			</div>
		);
	}
}

export default EditListing;