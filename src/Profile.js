import React from 'react';
import firebase from 'firebase';

class Profile extends React.Component {
  constructor(props){
		super(props);
		this.state = {};
	}


	//Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
	this.unregister = firebase.auth().onAuthStateChanged(user => {
		if(user) {
			this.setState({userId: user.uid});
			this.setState({displayName: firebase.auth().currentUser.displayName});
			this.setState({avatar: firebase.auth().currentUser.photoURL});
			var profileRef = firebase.database().ref('users/' + this.props.params.profileID);
			profileRef.once("value")
				.then(snapshot => {
					//this.setState({displayName: snapshot.child("displayName").val()});
					//this.setState({avatar: snapshot.child("avatar").val()});
					this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
					this.setState({jobTitle: snapshot.child("jobTitle").val()});
				});
		}
      else{
        this.setState({userId: null}); //null out the saved state
				this.setState({displayName: null}); //null out the saved state
				this.setState({avatar: null}); //null out the saved state
				this.setState({jobTitle: null}); //null out the saved state
      }
    })
  }

  //when component will be removed
  componentWillUnmount() {
  	//unregister listeners
  	firebase.database().ref('users/' + this.props.params.profileID).off();
		if(this.unregister){ //if have a function to unregister with
      this.unregister(); //call that function!
    }
  }

	componentWillReceiveProps(nextProps) {
		var profileRef = firebase.database().ref('users/' + nextProps.params.profileID);
		profileRef.once("value")
			.then(snapshot => {
				this.setState({displayName: snapshot.child("displayName").val()});
				this.setState({avatar: snapshot.child("avatar").val()});
				this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
				this.setState({jobTitle: snapshot.child("jobTitle").val()});
			});
  }

	render() {
		var divStyle = {
 			backgroundImage: 'url(' + this.state.coverPhoto || ' )'
		};
		var edit = null;

		if(this.props.params.profileID === this.state.userId) {
			edit = "icon";
		} else {
			edit = "icon hidden"
		}

		return (
			<div id="profile">
				<div className="profile-top" style={divStyle}>
					<p className={edit}><a href="/#/profileedit"><i className="fa fa-pencil edit-profile" aria-hidden="true"> <span className="edit-profile-text">edit</span></i></a></p>
				</div>
				<div className="profile-user">
					<div className="content-container">
						<img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />
						<h1 className="profile-heading">{this.state.displayName}</h1>
						<p className="job-title">{this.state.jobTitle}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;