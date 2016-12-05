import React from 'react';
import firebase from 'firebase';
import {hashHistory} from 'react-router';
import {Button} from 'react-mdl';

class Listing extends React.Component {
constructor(props){
    super(props);
    this.state = {}; 
  }

  componentDidMount() {
		var messagesRef = firebase.database().ref('posts/' + this.props.params.listingName);
		messagesRef.once("value")
		.then(snapshot => {
      console.log(snapshot.val());
			var listingContent = snapshot.val();
			this.setState({title: listingContent.title, summary: listingContent.summary, location: listingContent.location, instrument: listingContent.instrument, job: listingContent.job, image: listingContent.image, tags: listingContent.tags, post: listingContent.text, type: listingContent.type})
    });

		/* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId: user.uid});
				this.setState({displayName: firebase.auth().currentUser.displayName});
				this.setState({avatar: firebase.auth().currentUser.photoURL});
      }
    })
	}

	//when the component is unmounted, unregister using the saved function
  componentWillUnmount() {
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
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
      <div className="content-container">
			  <div className="listing-img" style={{background: 'url(' + listingImage + ') center / cover'}}>
					<h1 className="listing-title">{this.state.title}</h1>
					<span className="listing-tags">{this.state.tags}</span>
				</div>
				<div className="listing">
					<span className="user-info">
						<img src={this.state.avatar} alt="user avatar" />
						<p><strong>Name</strong>: {this.state.displayName}</p>
						<p><strong>Location</strong>: {this.state.location}</p>
						<Button colored>Contact</Button><Button colored>Profile</Button>
					</span>
					<span className="listing-text">
						<p className={this.state.type}>{this.state.type}</p>
						<span><strong>Job</strong>: {this.state.job}</span>
						<span><strong>Instruments/Skills Required</strong>: {this.state.instrument}</span>
						<div className="listing-desc">
							{this.state.post}
						</div>
					</span>
				</div>
      </div>
    );
  }
}

export default Listing;