import React from 'react';
import firebase from 'firebase';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions, Spinner } from 'react-mdl';
import { hashHistory } from 'react-router';

class EditProfile extends React.Component {
  constructor(props){
		super(props);
		this.state = {cancelAlert: false, confirmAlert: false, hidden: 'hidden'};
		this.confirmProfile = this.confirmProfile.bind(this);
    this.discardProfile = this.discardProfile.bind(this);

	}


	//Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
	componentDidMount() {
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId: user.uid});
				this.setState({displayName: firebase.auth().currentUser.displayName});
				this.setState({avatar: firebase.auth().currentUser.photoURL});
				var profileRef = firebase.database().ref('users/' + this.state.userId);
				profileRef.once("value")
					.then(snapshot => {
						this.setState({jobTitle: snapshot.child("jobTitle").val()});
						this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
					});
      }
      else{
        this.setState({userId: null}); //null out the saved state
				this.setState({displayName: null}); //null out the saved state
				this.setState({avatar: null}); //null out the saved state
				this.setState({jobTitle: null}); //null out the saved state
				this.setState({coverPhoto: null}); //null out the saved state
      }
    })
  }

  //when component will be removed
  componentWillUnmount() {
  	//unregister listeners
    if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

	updateProfile(event) {
		event.preventDefault();
    this.setState({
      openDialog: true,
    });
  }

	discardProfile() {
    this.setState({
      openDialog: false,
			cancelAlert: true,
			confirmAlert: false,
			hidden: 'profile-alert red-discard'
    });
  }

	confirmProfile() {
		//const path = '/profile/' + firebase.auth().currentUser.uid;
		//hashHistory.push(path);
		this.setState({
			openDialog: false,
			cancelAlert: false,
			confirmAlert: true,
			hidden: 'profile-alert green-confirm'
		});


		var user = firebase.auth().currentUser; //grabs the logged in user's' info, updates app.js

		var userRef = firebase.database().ref('users/' + user.uid); //finds the logged in user in the database; updates profile.js
		userRef.child('displayName').set(this.state.displayName); //sets their displayname
		userRef.child('jobTitle').set(this.state.jobTitle); //sets their job title
		userRef.child('coverPhoto').set(this.state.coverPhoto); //sets their cover photo
		userRef.child('avatar').set(this.state.avatar); //sets their avatar


		user.updateProfile({
			displayName: this.state.displayName, //sets display name
			jobTitle: this.state.jobTitle, //sets job title
			coverPhoto: this.state.coverPhoto, //sets cover photo
			avatar: this.state.avatar //sets avatar
		});


		setTimeout(function() {
			const path = '/profile/' + firebase.auth().currentUser.uid;
			hashHistory.push(path);
			window.location.reload();
		}, 2000);
	}

	//when the text in the display name field changes
	updateDisplay(event) {
		this.setState({displayName: event.target.value});
	}

	//when the text in the job title field changes
	updateJob(event) {
		this.setState({jobTitle: event.target.value});
	}

	//when the text in the cover photo field changes
	updateCover(event) {
		this.setState({coverPhoto: event.target.value});
	}

	//when the text in the avatar field changes
	updateAvatar(event) {
		this.setState({avatar: event.target.value});
	}

	render() {
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
		}

		console.log(this.state);
		console.log(this.state.jobTitle);

		return(
			<div className="content-container">
					<h1>edit your profile</h1>
					<div className={this.state.hidden}>
						{alert}
					</div>
					<form className="profile-content">

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

						<div className="profile-avatar"> 
							<img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />

							<Textfield
								onChange={(e) => this.updateAvatar(e)}
								label="Avatar"
								value={this.state.avatar || ''}
								floatingLabel
								className="profile-avatar-text"
							/>
						</div>

						<div className="profile-submit">
							<Button raised accent ripple onClick={(e)=>this.updateProfile(e)}>Update Profile</Button>
						</div>
						<Dialog open={this.state.openDialog}>
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