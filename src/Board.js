import React from 'react';
import './index.css';
import {Card, CardTitle, CardText, CardActions, Button} from 'react-mdl';

class Board extends React.Component {
	render() {
		return (
			<div className="content-container">
				<h1>board</h1>
				<div className="category-flex">
					<div className="card-column">
						<div className="item">
						<Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
							<CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Post Title</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</CardText>
							<CardActions border>
								<Button colored>Read</Button><Button colored>Contact</Button>
							</CardActions>
						</Card>
						</div>
					</div>
					<div className="card-column">
						<div className="item">
						<Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
							<CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Post Title</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</CardText>
							<CardActions border>
								<Button colored>Read</Button><Button colored>Contact</Button>
							</CardActions>
						</Card>
						</div>
					</div>
					<div className="card-column">
						<div className="item">
						<Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
							<CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Post Title</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</CardText>
							<CardActions border>
								<Button colored>Read</Button><Button colored>Contact</Button>
							</CardActions>
						</Card>
						</div>
					</div>
					<div className="card-column">
						<div className="item">
						<Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
							<CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(http://www.getmdl.io/assets/demos/welcome_card.jpg) center / cover'}}>Post Title</CardTitle>
							<CardText>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Aenan convallis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							</CardText>
							<CardActions border>
								<Button colored>Read</Button><Button colored>Contact</Button>
							</CardActions>
						</Card>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Board;