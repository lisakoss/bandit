import React from 'react';
import firebase from 'firebase';
import { Tooltip, Tabs, Tab } from 'react-mdl';
import RecentListings from './RecentListings.js';
import { hashHistory } from 'react-router';

class Profile extends React.Component {
  constructor(props){
		super(props);
		this.state = {activeTab: 0};
	}

	//Lifecycle callback executed when the component appears on the screen.
	//Grabs information to display on a user's profile'
	componentDidMount() {
		this.unregister = firebase.auth().onAuthStateChanged(user => {
			if(user) {
				this.setState({userId: user.uid}); //grabs user id
				var profileRef = firebase.database().ref('users/' + this.props.params.profileID);
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

				if(this.state.instruments === "") {
					this.setState({instrumentShow: 'hidden'}); //hides instruments if not filled out
				}
				if(this.state.genre === "") {
					this.setState({genreShow: 'hidden'}); //hides genre if not filled out
				}
				if(this.state.location === "") {
					this.setState({locationShow: 'hidden'}); //hides location if not filled out
				}
			} else { //redirects user if logged out and sets state to null
				const path = '/login';
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

	//Grabs the next user's information'
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
		var divStyle = {
 			backgroundImage: 'url(' + this.state.coverPhoto || ' )'
		};
		var edit = null;
		var tabContent = null;
		var htmlTabContent = null;
		var locationHide = 'hidden';
		var genreHide = 'hidden';
		var instrumentsHide = 'hidden';

		//if you are on your own profile, you have access to the profile edit tool via your profile
		if(this.props.params.profileID === this.state.userId) {
			edit = "icon";
		} else {
			edit = "icon hidden"
		}

		//determines tab content for about, experience, and recent listings
		if(this.state.activeTab === 0) {
			htmlTabContent = this.state.about || "No information to show.";
			tabContent = (<div className="tab-content" dangerouslySetInnerHTML={{__html:htmlTabContent}}></div>);
		} else if(this.state.activeTab === 1) {
			htmlTabContent = this.state.experience || 'No experience to show.';
			tabContent = (<div className="tab-content" dangerouslySetInnerHTML={{__html:htmlTabContent}}></div>);
		} else {
			tabContent = (<div className="tab-content"><RecentListings profileID={this.props.params.profileID} /></div>);
		}

		//show location if filled out
		if(this.state.location !== null && this.state.location !== "") {
			locationHide = '';
		}

		//show instruments if filled out
		if(this.state.instruments !== null && this.state.instruments !== "") {
			instrumentsHide = '';
		}

		//show genre if filled out
		if(this.state.genre !== null && this.state.genre !== "") {
			genreHide = '';
		}

		return (
			<div role="article">
				<div role="region" className="profile-top" style={divStyle}>
					<p className={edit}><a href="/#/profileedit"><i className="fa fa-pencil edit-profile" aria-hidden="true"> <span className="edit-profile-text">edit</span></i></a></p>
				</div>
				<div role="region" className="profile-user">
					<div className="content-container">
						<div className="profile-image">
							<img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />
						</div>
						<h1 className="profile-heading">{this.state.displayName}</h1>
						<p className="job-title">{this.state.jobTitle}</p>

						<div className="profile-stats">
							<span className={instrumentsHide}><Tooltip label="Instruments and Skills" position="top"><i className="fa fa-music display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> {this.state.instruments}</p></span>
							<span className={genreHide}><Tooltip label="Genre" position="top"><i className="fa fa-headphones display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> {this.state.genre}</p></span>
							<span className={locationHide}><Tooltip label="Location" position="top"><i className="fa fa-map-marker display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> {this.state.location}</p></span>
							<span><Tooltip label="Contact" position="top"><i className="fa fa-comments display-icon" aria-hidden="true"></i></Tooltip><p className="quick-info"> <a href="mailto:my.pencil.info@gmail.com">Contact {this.state.displayName}</a></p></span>
						</div>
					</div>
					<div role="region" className="profile-tabs">
						<div className="content-container">
							<Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
								<Tab>About</Tab>
								<Tab>Experience</Tab>
								<Tab>Recent Listings</Tab>
             				</Tabs>
							<section>
								{tabContent}
							</section>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default Profile;
