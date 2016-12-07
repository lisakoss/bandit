import React from 'react';
import firebase from 'firebase';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions, Spinner } from 'react-mdl';
import { hashHistory } from 'react-router';

class EditProfile extends React.Component {
  constructor(props){
		super(props);
		this.state = {cancelAlert: false, confirmAlert: false, displayError: false, hidden: 'hidden', disable: false};
		this.confirmProfile = this.confirmProfile.bind(this);
		this.discardProfile = this.discardProfile.bind(this);
  }

	//Lifecycle callback executed when the component appears on the screen.
	//Sets the initial state of the logged in user so they can edit their profile information
	componentDidMount() {
    // Add a listener and callback for authentication events 
    this.unregister = firebase.auth().onAuthStateChanged(user => {
		if(user) {
			this.setState({userId: user.uid});
				this.setState({displayName: firebase.auth().currentUser.displayName});
				var profileRef = firebase.database().ref('users/' + this.state.userId);
				profileRef.once("value")
					.then(snapshot => {
						this.setState({avatar: snapshot.child("avatar").val()});
						this.setState({jobTitle: snapshot.child("jobTitle").val()});
						this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
						this.setState({instruments: snapshot.child("instruments").val()});
						this.setState({genre: snapshot.child("genre").val()});
						this.setState({location: snapshot.child("location").val()});
						this.setState({about: snapshot.child("about").val()});
						this.setState({experience: snapshot.child("experience").val()});
					});
		} else {
			const path = '/login'; //redirect to login page if user is not logged in
			hashHistory.push(path);
			this.setState({userId: null}); //null out the saved state
			this.setState({displayName: null}); //null out the saved state
			this.setState({avatar: null}); //null out the saved state
			this.setState({jobTitle: null}); //null out the saved state
			this.setState({coverPhoto: null}); //null out the saved state
			this.setState({instruments: null}); //null out the saved state
			this.setState({genre: null}); //null out the saved state
			this.setState({location: null}); //null out the saved state
			this.setState({about: null}); //null out the saved state
			this.setState({experience: null}); //null out the saved state
      	}
    });
  }

	//when component will be removed
	componentWillUnmount() {
		//unregister listeners
		firebase.database().ref('users/' + this.state.userId).off();
		firebase.database().ref('users/' + this.props.params.profileID + '/posts').off();
		if(this.unregister){ //if have a function to unregister with
			this.unregister(); //call that function!
		}
	}

	//when you click update profile, a dialog box is opened
	updateProfile(event) {
		event.preventDefault();
		this.setState({
			openDialog: true,
		});
	}

	//you can discard profile changes by clicking cancel
	discardProfile() {
		this.setState({
			openDialog: false,
			cancelAlert: true,
			confirmAlert: false,
			hidden: 'profile-alert red-discard'
		});
	}

	// you can confirm profile changes by clicking confirm, which will reset the state and redirect you back to your profile
	confirmProfile() {
		this.setState({
			openDialog: false,
			cancelAlert: false,
			confirmAlert: true,
			hidden: 'profile-alert green-confirm'
		});

		var user = firebase.auth().currentUser; //grabs the logged in user's' info

		var userRef = firebase.database().ref('users/' + user.uid); //finds the logged in user in the database
		userRef.child('displayName').set(this.state.displayName); //sets their display name
		userRef.child('jobTitle').set(this.state.jobTitle); //sets their job title
		userRef.child('coverPhoto').set(this.state.coverPhoto); //sets their cover photo
		userRef.child('avatar').set(this.state.avatar); //sets their avatar
		userRef.child('instruments').set(this.state.instruments); //sets their avatar
		userRef.child('genre').set(this.state.genre); //sets their avatar
		userRef.child('location').set(this.state.location); //sets their avatar
		userRef.child('about').set(this.state.about); //sets their about
		userRef.child('experience').set(this.state.experience); //sets their experience


		user.updateProfile({
			displayName: this.state.displayName, //sets display name
		});

		//removes the editing controls when you click submit so you can read the confirmation alert
		var profile = document.getElementById("profile-edit");
		profile.style.display = "none";

		//redirects after 2 seconds back to profile so you have time to read the confirmation alert
		setTimeout(function() {
			const path = '/profile/' + firebase.auth().currentUser.uid;
			hashHistory.push(path);
			window.location.reload();
		}, 2000);
	}

	//when the text in the display name field changes, updates state
	updateDisplay(event) {
		if(event.target.value.length === 0) {
			this.setState({
				disable: true,
				displayError: true,
				hidden: 'profile-alert red-discard'
			});
		} else {
			this.setState({
				disable: false,
				displayError: false,
				hidden: 'hidden'
			});
		}
		this.setState({displayName: event.target.value});
	}

	//when the text in the job title field changes, updates state
	updateJob(event) {
		this.setState({jobTitle: event.target.value});
	}

	//when the text in the cover photo field changes, updates state
	updateCover(event) {
		this.setState({coverPhoto: event.target.value});
	}

	//when the text in the avatar field changes, updates state
	updateAvatar(event) {
		this.setState({avatar: event.target.value});
	}

	//when the text in the instruments field changes, updates state
	updateInstruments(event) {
		this.setState({instruments: event.target.value});
	}

	//when the text in the genre field changes, updates state
	updateGenre(event) {
		this.setState({genre: event.target.value});
	}

	//when the text in the location field changes, updates state
	updateLocation(event) {
		this.setState({location: event.target.value});
	}

	//when the text in the location field changes, updates state
	updateAbout(event) {
		this.setState({about: event.target.value});
	}

	//when the text in the location field changes, updates state
	updateExperience(event) {
		this.setState({experience: event.target.value});
	}

	render() {
		var disableEnabled = this.state.disable;
		var alert = null;
		var divStyle = {
 			backgroundImage: 'url(' + this.state.coverPhoto || ' )'
		};

		if(this.state.cancelAlert === true) {
			alert = (<div><p>You did not submit your changes.</p></div>);
		} else if (this.state.confirmAlert === true) {
			alert = (<div><p>You have submitted your changes. Redirecting...</p>
						 <Spinner className="profile-spinner" singleColor />
					 </div>);
		} else if(this.state.displayError === true) {
			alert = (<div><p>Display name must be at least one character long.</p></div>);
		}

		return(
			<div className="content-container" role="article">
				<h1>edit your profile</h1>
				<div role="region" id="alert" className={this.state.hidden}>
					{alert}
				</div>
				<form role="region" id="profile-edit" className="profile-content">

					<Textfield
						onChange={(e) => this.updateDisplay(e)}
						label="Display Name"
						value={this.state.displayName || ''}
						floatingLabel
						className="profile-display-name"
					/>

					<Textfield
						onChange={(e) => this.updateJob(e)}
						label="Job Title"
						value={this.state.jobTitle || ''}
						floatingLabel
						className="profile-job-title"
					/>
					
					<div className="cover-photo" style={divStyle}>
						<div className="cover-preview">
							<p>cover photo preview</p>
						</div>
					</div>

					<Textfield
						onChange={(e) => this.updateCover(e)}
						label="Cover Photo"
						value={this.state.coverPhoto || ''}
						floatingLabel
						className="profile-cover"
					/>

					<div>
						<div className="profile-avatar"> 
							<img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />
						</div>

						<Textfield
							onChange={(e) => this.updateAvatar(e)}
							label="Avatar"
							value={this.state.avatar || ''}
							floatingLabel
							className="profile-avatar-text"
						/>
					</div>

					<Textfield
						onChange={(e) => this.updateInstruments(e)}
						label="Instrument(s) and/or skills"
						value={this.state.instruments || ''}
						floatingLabel
						className="profile-instruments"
					/>

					<Textfield
						onChange={(e) => this.updateGenre(e)}
						label="Genre"
						value={this.state.genre || ''}
						floatingLabel
						className="profile-genre"
					/>

					<Textfield
						onChange={(e) => this.updateLocation(e)}
						label="Location (city, state/providence, and/or zip code)"
						value={this.state.location || ''}
						floatingLabel
						className="profile-location"
					/>

					<Textfield
						rows={8}
						onChange={(e) => this.updateAbout(e)}
						label="About"
						value={this.state.about || ''}
						floatingLabel
						className="profile-about"
					/>
					
					<Textfield
						rows={8}
						onChange={(e) => this.updateExperience(e)}
						label="Experience"
						value={this.state.experience || ''}
						floatingLabel
						className="profile-experience"
					/>

					<div className="profile-submit">
						<Button disabled={disableEnabled} raised accent ripple onClick={(e)=>this.updateProfile(e)}>Update Profile</Button>
					</div>
					<Dialog role="region" open={this.state.openDialog}>
						<DialogTitle>Are you sure?</DialogTitle>
						<DialogContent>
							<p>Click <strong>confirm</strong> to submit all changes to your profile. If you want to cancel any changes you've made, click <strong>cancel</strong>.</p>
						</DialogContent>
						<DialogActions>
							<Button type='button' onClick={()=>this.confirmProfile()}>Confirm</Button>
							<Button type='button' onClick={()=>this.discardProfile()}>Cancel</Button>
						</DialogActions>
					</Dialog>
				</form>
			</div>
    	);
	}
}

export default EditProfile;