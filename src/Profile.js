import React from 'react';
import firebase from 'firebase';
import { Textfield } from 'react-mdl';

class Profile extends React.Component {
  constructor(props){
		super(props);
		this.state = {};
	}

	//Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
		var profileRef = firebase.database().ref('users/' + this.props.params.profileID);
		profileRef.once("value")
			.then(snapshot => {
				//this.setState({displayName: snapshot.child("displayName").val()});
				//this.setState({avatar: snapshot.child("avatar").val()});
				//var userName = snapshot.child("displayName").val();
				this.setState({displayName: snapshot.child("displayName").val()});
				this.setState({avatar: snapshot.child("avatar").val()});
				this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
				console.log(snapshot.child("displayName").val())
				//console.log("A");
			});
  }

  //when component will be removed
  componentWillUnmount() {
  	//unregister listeners
  	firebase.database().ref('users/' + this.props.params.profileID).off();
  }

	componentWillReceiveProps(nextProps) {
		var profileRef = firebase.database().ref('users/' + nextProps.params.profileID);
		profileRef.once("value")
			.then(snapshot => {
				//this.setState({displayName: snapshot.child("displayName").val()});
				//this.setState({avatar: snapshot.child("avatar").val()});
				//var userName = snapshot.child("displayName").val();
				this.setState({displayName: snapshot.child("displayName").val()});
				this.setState({avatar: snapshot.child("avatar").val()});
				this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
				console.log(snapshot.child("displayName").val())
				//console.log("A");
			});
  }

	//edit display name if you're the respective owner of the profile
	editDisplay() {
		if(this.props.params.profileID === firebase.auth().currentUser.uid) {
			this.setState({displayEdit: true});
		} 

		if(this.state.displayEdit === true) {
			this.setState({displayEdit: false});
		}
		console.log(this.state);
	}

	//when the text in the form changes
	updateDisplay(event) {
		this.setState({displayName: event.target.value});
	}

	//post display name to the database
	postDisplay(event){
		if (event.key === 'Enter') {
			var user = firebase.auth().currentUser;
			event.preventDefault(); //don't submit

			/* Add a new message to the database */
			var userRef = firebase.database().ref('users/' + this.props.params.profileID); //the messages in the JOITC
			userRef.child('displayName').set(this.state.displayName);

			user.updateProfile({
				displayName: this.state.displayName
			});
			//console.log(channelRef);
			this.setState({displayEdit: false});
		}
	}

	//edit cover photo if you're the respective owner of the profile
	editCover() {
		if(this.props.params.profileID === firebase.auth().currentUser.uid) {
			this.setState({coverEdit: true});
		} 

		if(this.state.coverEdit === true) {
			this.setState({coverEdit: false});
		}
		console.log(this.state);
	}

	//when the text in the form changes
	updateCover(event) {
		this.setState({coverPhoto: event.target.value});
	}

	//post cover photo to the database
	postCover(event){
		if (event.key === 'Enter') {
			//var user = firebase.auth().currentUser;
			event.preventDefault(); //don't submit

			/* Add a new message to the database */
			var userRef = firebase.database().ref('users/' + this.props.params.profileID); //the messages in the JOITC
			userRef.child('coverPhoto').set(this.state.coverPhoto);

			//user.updateProfile({
				//coverPhoto: this.state.coverPhoto
//});
			//console.log(channelRef);
			this.setState({coverEdit: false});
		}
	}

	render() {
		var userName = null;
		var coverPhoto = '';
		var divStyle = {
 			backgroundImage: 'url(' + this.state.coverPhoto || ' )',
		};

		console.log(this.props.params);

		if(this.state.displayEdit === true) {
     userName =(<Textfield
                  onChange={(e) => this.updateDisplay(e)}
                  label="edit your name"
                  rows={1}
                  value={this.state.displayName}
                  onKeyPress={(e) => this.postDisplay(e)}
									floatingLabel
                />);
		} else {
			userName = this.state.displayName;
		}

		if(this.state.coverEdit === true) {
     coverPhoto =(<Textfield
                  onChange={(e) => this.updateCover(e)}
                  label="edit your cover photo"
                  rows={1}
                  value={this.state.coverPhoto || ''}
                  onKeyPress={(e) => this.postCover(e)}
									floatingLabel
                />);
		} 

		console.log(this.state);
		return (
			<div id="profile">
				<div className="profile-top" style={divStyle}>
					{coverPhoto}<p className="icon"><a href="/#/profileedit"><i className="fa fa-pencil edit-profile" aria-hidden="true"> <span className="edit-profile-text">edit</span></i></a></p>
				</div>
				<div className="profile-user">
					<div className="content-container">
						<img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />
						<h1 className="profile-heading">{userName}</h1>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;