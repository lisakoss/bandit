import React from 'react';
import './index.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';
import SignOut from './SignOut';
import firebase from 'firebase';

class App extends React.Component {
	constructor(props){
			super(props);
			this.state = {}
		}
	//Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener and callback for authentication events */
    this.unregister = firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.setState({userId:user.uid});
				this.setState({displayName:firebase.auth().currentUser.displayName});
				this.setState({avatar:firebase.auth().currentUser.photoURL});
				console.log(this.state.avatar);
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

		if(this.state.userId !== null) {
			profileImg = <img src={this.state.avatar} alt="avatar" className="profile-img" />;
		}
    return (
      <div style={{height: '100%'}}>
        <Layout fixedHeader>
          <Header transparent title={<span><a href="/" className="header-link">BANDIT</a></span>}>
            <Navigation>
							<a href="/#/board">Board</a>
							<a href="/#/search">Search</a>
							<a href="/#/inbox">Inbox</a>
							<a href={this.state.userId !== null ? "/#/profile" : "/#/login"}>{this.state.userId !== null ? this.state.displayName : 'Login'} {profileImg}</a> 
						</Navigation>
          </Header>
          <Drawer title="Title">
						<Navigation >
							<a href="">Link</a>
							<a href="">Link</a>
							<a href="">Link</a>
							<a href="">Link</a>
							<div className="content-container">
								<SignOut/>
							</div>
						</Navigation>
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