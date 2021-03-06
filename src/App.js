import React from 'react';
import './index.css';
import { Layout, Header, Navigation, Drawer, Content, Tooltip, Icon } from 'react-mdl';
import SignOut from './SignOut';
import firebase from 'firebase';

class App extends React.Component {
	constructor(props){
			super(props);
			this.state = {};
	}
	//Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId: user.uid});
				var profileRef = firebase.database().ref('users/' + this.state.userId);
				profileRef.once("value")
					.then(snapshot => {
						this.setState({displayName: snapshot.child("displayName").val()});
						this.setState({avatar: snapshot.child("avatar").val()});
					});
      }
      else{
        this.setState({userId: null}); //null out the saved state
				this.setState({displayName: null}); //null out the saved state
				this.setState({avatar: null}); //null out the saved state
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
		var profileImg = null;
		var drawerContent = null;
		var drawerTitle = null;


		if(this.state.userId !== null) {

			profileImg = <img src={this.state.avatar || './img/blank-user.jpg'} alt="avatar" />;
			drawerContent = (
												<div>
													<div className="nav-container">
														<p className="profile-drawer">
															{profileImg}
														</p>
														<p className="links">Quick Links</p>
													</div>
													<Navigation role="navigation">
														<a href="/profileedit">Edit profile</a>
														<a href="/createpost">Create a listing</a>
														<a href="/recentlistings">Recent listings</a>
														<div className="nav-container">
															<SignOut/>
														</div>
													</Navigation>
												</div>
											);
			drawerTitle = (<div className="drawer-title">
											{this.state.displayName}
										 	<Tooltip label="go to profile" position="right">
    										<a href={"/profile/" + this.state.userId}><Icon name="arrow_forward" /></a>
											</Tooltip>
										 </div>);
		} else {
			drawerContent = (<Navigation role="navigation"><span>You must <a href="/login">login</a> or <a href="/signup">sign up</a> to view this content.</span></Navigation>);
		}

    return (
      <div style={{height: '100%'}} role="main">
        <Layout fixedHeader>
          <Header role="banner" transparent title={<span><a href="/" className="header-link">BANDIT</a></span>}>
            <Navigation role="navigation">
							<a href="/board">Board</a>
							<a href="/search">Search</a>
							<a href={this.state.userId !== null ? "/profile/" + this.state.userId : "/login"}>{this.state.userId !== null ? this.state.displayName : 'Login'} <p className="profile-nav">{profileImg}</p></a>
						</Navigation>
          </Header>
					<Drawer title={drawerTitle}>
						{drawerContent}
					</Drawer>
					<Content role="main">
						{this.props.children}
					</Content>
				</Layout>
			</div>
    );
  }
}

export default App;
