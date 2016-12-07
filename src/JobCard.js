import React, { Component } from 'react';
import Time from 'react-time';
import firebase from 'firebase';
import {Textfield, Button, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardTitle, CardText, CardActions, CardMenu, IconButton, Tooltip, Radio, RadioGroup} from 'react-mdl';

class JobCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return(
      <div className="card-column">
        <div className="item">
          <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
            <CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(' + this.props.image + ') center / cover'}}>{this.props.title}</CardTitle>
            <CardText>
              <div className="message">{this.props.summary}</div>
            </CardText>
            <div className="posted-by">

              <span className="tags">
                {this.props.tags}
              </span>
            </div>

            <CardActions border>
              <Button colored>Read</Button><Button colored>Contact</Button><Button colored>Bookmark</Button>
            </CardActions>
          </Card>
        </div>
      </div>
    )
  }
}

export default JobCard;
