import React from 'react';
import './index.css';
import { Layout, Header, Navigation, Drawer, Content, Tooltip, Icon } from 'react-mdl';
import SignOut from './SignOut';
import firebase from 'firebase';
import {Link} from 'react-router';

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
														<Link to="/profileedit">Edit profile</Link>
														<Link to="/createpost">Create a listing</Link>
														<Link to="/recentlistings">Recent listings</Link>
														<div className="nav-container">
															<SignOut/>
														</div>
													</Navigation>
												</div>
											);
			drawerTitle = (<div className="drawer-title">
											{this.state.displayName}
										 	<Tooltip label="go to profile" position="right">
    										<Link to={"/profile/" + this.state.userId}><Icon name="arrow_forward" /></Link>
											</Tooltip>
										 </div>);
		} else {
			drawerContent = (<Navigation role="navigation"><span>You must <Link to="/login">login</Link> or <Link to="/signup">sign up</Link> to view this content.</span></Navigation>);
		}

    return (
      <div style={{height: '100%'}} role="main">
        <Layout fixedHeader>
          <Header role="banner" transparent title={<span><Link to="/" className="header-link">BANDIT</Link></span>}>
            <Navigation role="navigation">
							<Link to="/board">Board</Link>
							<Link to="/search">Search</Link>
							<Link to={this.state.userId !== null ? "/profile/" + this.state.userId : "/login"}>{this.state.userId !== null ? this.state.displayName : 'Login'} <p className="profile-nav">{profileImg}</p></Link>
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
