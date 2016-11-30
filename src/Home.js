import React from 'react';
import {Layout, Header, Navigation, Textfield} from 'react-mdl';

class Home extends React.Component {
	render() {
		return (
			<div className="container">
				<Layout style={{background: 'url(./img/IMG_7962.png) center / cover'}}>
					<Header transparent title="BANDIT" style={{color: 'white'}}>
						<Navigation>
							<a href="">Board</a>
							<a href="">Search</a>
							<a href="">Inbox</a>
							<a href="">Profile</a>
						</Navigation>
					</Header>
					<div className="welcome-msg">
						<p className="welcome-title">band together</p>
						<p>find your next gig, band, or collaboration</p>
						<p>breakthrough locally or worldwide</p>
						<i className="fa fa-search" aria-hidden="true"></i>
						<Textfield
						onChange={() => {}}
						label="search"
						style={{width: '200px'}}
						/>
					</div>
				</Layout>
			</div>
		);
	}
}

export default Home;