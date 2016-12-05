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
				this.setState({displayName: firebase.auth().currentUser.displayName});
				//this.setState({avatar: firebase.auth().currentUser.photoURL});
				//console.log(firebase.auth().currentUser);
				var profileRef = firebase.database().ref('users/' + this.state.userId);
				profileRef.once("value")
					.then(snapshot => {
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

		//console.log(this.state);
		
		if(this.state.userId !== null) {
			
			profileImg = <img src={this.state.avatar} alt="avatar" />;
			drawerContent = (
												<div>
													<div className="nav-container">
														<p className="profile-drawer">
															{profileImg}
														</p>
														<p className="links">Quick Links</p>
													</div>
													<Navigation>
														<a href="/#/profileedit">Edit profile</a>
														<a href="/#/createpost">Create a post</a>
														<a href="">Manage posts</a>
														<a href="">Saved bookmarks</a>
														<div className="nav-container">
															<SignOut/>
														</div>
													</Navigation>
												</div>
											);
			drawerTitle = (<div className="drawer-title">
											{this.state.displayName}
										 	<Tooltip label="go to profile" position="right">
    										<a href={"/#/profile/" + this.state.userId}><Icon name="arrow_forward" /></a>
											</Tooltip>
										 </div>);
		} else {
			drawerContent = (<Navigation><span>You must <a href="/#/login">login</a> or <a href="/#/signup">sign up</a> to view this content.</span></Navigation>);
		}

    return (
      <div style={{height: '100%'}}>
        <Layout fixedHeader>
          <Header transparent title={<span><a href="/" className="header-link">BANDIT</a></span>}>
            <Navigation>
							<a href="/#/board">Board</a>
							<a href="/#/search">Search</a>
							<a href="/#/inbox">Inbox</a>
							<a href={this.state.userId !== null ? "/#/profile/" + this.state.userId : "/#/login"}>{this.state.userId !== null ? this.state.displayName : 'Login'} <p className="profile-nav">{profileImg}</p></a> 
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