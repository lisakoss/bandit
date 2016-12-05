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
		setTimeout(function() {
			const path = '/profile/' + firebase.auth().currentUser.uid;
			hashHistory.push(path);
			window.location.reload();
		}, 3000);
	}

	render() {
		var alert = null;

		if(this.state.cancelAlert === true) {
			alert = (<div><p>You have discarded your changes.</p></div>);
		} else if (this.state.confirmAlert === true) {
			alert = (<div><p>You have submitted your changes. Redirecting...</p>
							 <Spinner singleColor />
							 </div>);
		}

		return(
			<div className="content-container">
					<h1>edit your profile</h1>
					<div className={this.state.hidden}>
						{alert}
					</div>
					<form>
						




						
						<Button raised accent ripple onClick={(e)=>this.updateProfile(e)}>Update Profile</Button>
						<Dialog open={this.state.openDialog}>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogContent>
								<p>Click <strong>confirm</strong> to submit all changes to your profile. If you want to discard any changes you've made, click <strong>cancel</strong>.</p>
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