import React, { Component } from 'react';
import Time from 'react-time';
import firebase from 'firebase';
import {Button, Card, CardTitle, CardText, CardActions} from 'react-mdl';
import {hashHistory} from 'react-router';

class JobCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /* Set displayname and avatar of user. */
  componentDidMount() {
    var usersRef = firebase.database().ref('users/' + this.props.userId);
    usersRef.on('value', (snapshot) => {
      this.setState({displayName: snapshot.child('displayName').val(), avatar: snapshot.child('avatar').val()});
    });
  }

  /* Unregister listerns. */
  componentWillUnmount() {
    if(this.unregister) {
      firebase.database().ref('users/' + this.props.userId).off();
    }
  }

  // Gets display name and avatar of next user
  componentWillReceiveProps(nextProps) {
    var usersRef = firebase.database().ref('users/' + nextProps.userId);
    usersRef.on('value', (snapshot) => {
      this.setState({displayName: snapshot.child('displayName').val(), avatar: snapshot.child('avatar').val()});
    });
  }

  /* Redirect user to the comments section of a particular post. */
  handleContact(event) {
    const path = '/comments/' + this.props.postId;
    hashHistory.push(path);
  }

  render() {
    var avatar = (this.state.avatar);
    var lastEdited = '';
    var listingImage = '';
    var id = "/posts/" + this.props.postId;
    var listingUserId = "/profile/" + this.props.userId;
    var tagsArray = this.props.tags.split(" ");
    var tagsString = '';

    // Add #'s to each word given as a tag.
    tagsArray.forEach(function(word) {
      word = '#' + word;
      tagsString += word + ' ';
    });

    // Set the HTML so that the links work properly.
    var hashtagContent  = (<span className="tags" dangerouslySetInnerHTML={{__html:tagsString}}></span>);

    // Display the given listing image. If none given, display the default.
    if(this.props.image === '') {
      listingImage = './img/defaultboardimage.jpg';
    } else {
      listingImage = this.props.image;
    }

    // Show last edit time.
    if(this.props.timeEdited !== '') {
      lastEdited = <span>(edited <Time value={this.props.timeEdited} relative/>)</span>;
    }
    return(
      <div className="card-column" role="article">
        <div className="item" role="region">
          <Card shadow={0} style={{width: '320px', height: '320px', margin: 'auto'}}>
            <CardTitle  expand style={{height: '100px', color: '#fff', background: 'url(' + listingImage + ') center / cover'}}>{this.props.title}</CardTitle>
            <span className="time"><span className={this.props.type}>{this.props.type}</span><Time value={this.props.time} relative/> {lastEdited}</span>
          
            <CardText>
              <div className="message">{this.props.summary}</div>
            </CardText>

            <div className="posted-by">
              {hashtagContent}
              posted by: {/* This image's src should be the user's avatar */}
              <img className="avatar-post" src={avatar} role="presentation" /> <span className="handle"><a href={listingUserId}>{this.state.displayName}</a></span>
            </div>

            <CardActions border>
              <a href={id}><Button colored>Read</Button></a><Button colored onClick={(e)=> this.handleContact(e)}>Comments</Button>
            </CardActions>
          </Card>
        </div>
      </div>     
    )
  }
}

export default JobCard;
