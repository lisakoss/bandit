import React from 'react';
import firebase from 'firebase';
import { Tooltip, Tabs, Tab } from 'react-mdl';

class Profile extends React.Component {
  constructor(props){
		super(props);
		this.state = {activeTab: 0};
	}


	//Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
	this.unregister = firebase.auth().onAuthStateChanged(user => {
		if(user) {
			this.setState({userId: user.uid});
			this.setState({displayName: firebase.auth().currentUser.displayName});
			//this.setState({avatar: firebase.auth().currentUser.photoURL});
			var profileRef = firebase.database().ref('users/' + this.props.params.profileID);
			profileRef.once("value")
				.then(snapshot => {
					//this.setState({displayName: snapshot.child("displayName").val()});
					this.setState({avatar: snapshot.child("avatar").val()});
					this.setState({coverPhoto: snapshot.child("coverPhoto").val()});
					this.setState({jobTitle: snapshot.child("jobTitle").val()});
					this.setState({instruments: snapshot.child("instruments").val()});
					this.setState({genre: snapshot.child("genre").val()});
					this.setState({location: snapshot.child("location").val()});
					this.setState({about: snapshot.child("about").val()});
					this.setState({experience: snapshot.child("experience").val()});
				});
		}
      else{
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
				this.setState({instruments: snapshot.child("instruments").val()});
				this.setState({genre: snapshot.child("genre").val()});
				this.setState({location: snapshot.child("location").val()});
				this.setState({about: snapshot.child("about").val()});
				this.setState({experience: snapshot.child("experience").val()});
			});
  }

	render() {
		console.log(this.state);
		var divStyle = {
 			backgroundImage: 'url(' + this.state.coverPhoto || ' )'
		};
		var edit = null;
		var tabContent = null;

		if(this.props.params.profileID === this.state.userId) {
			edit = "icon";
		} else {
			edit = "icon hidden"
		}

		if(this.state.activeTab === 0) {
			tabContent = this.state.about;
		} else if(this.state.activeTab === 1) {
			tabContent = this.state.experience;
		} else {
			tabContent = "No recent listings to show.";
		}

		return (
			<div id="profile">
				<div className="profile-top" style={divStyle}>
					<p className={edit}><a href="/#/profileedit"><i className="fa fa-pencil edit-profile" aria-hidden="true"> <span className="edit-profile-text">edit</span></i></a></p>
				</div>
				<div className="profile-user">
					<div className="content-container">
						<div className="profile-image">
							<img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />
						</div>
						<h1 className="profile-heading">{this.state.displayName}</h1>
						<p className="job-title">{this.state.jobTitle}</p>

						<div className="profile-stats">
							<span><Tooltip label="Instruments and Skills" position="top"><i className="fa fa-music display-icon" aria-hidden="true"></i></Tooltip><p> {this.state.instruments}</p></span>
							<span><Tooltip label="Genre" position="top"><i className="fa fa-headphones display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> {this.state.genre}</p></span>
							<span><Tooltip label="Location" position="top"><i className="fa fa-map-marker display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> {this.state.location}</p></span>
							<span><Tooltip label="Contact" position="top"><i className="fa fa-comments display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> <a href="/#/inbox">Contact {this.state.displayName}</a></p></span>
						</div>
					</div>
					<div className="profile-tabs">
						<div className="content-container">
							<Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
								<Tab>About</Tab>
								<Tab>Experience</Tab>
								<Tab>Recent Listings</Tab>
              </Tabs>
							<section>
								<div className="tab-content">{tabContent}</div>
							</section>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;