import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield } from 'react-mdl';
import Time from 'react-time';

export class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comments: [] };
    }

    componentDidMount() {
        var usersRef = firebase.database().ref('users'); //grabs users
        usersRef.on('value', (snapshot) => {
            this.setState({ users: snapshot.val() });
        });
        var postID = this.props.post;
        var commentRef = firebase.database().ref('posts/' + postID + '/messages'); //comment reference
        commentRef.on('value', (snapshot) => {
            var commentArray = [];
            snapshot.forEach(function (child) { //goes through each comment
                var comment = child.val(); 
                comment.key = child.key;
                commentArray.push(comment);
            });
            commentArray.sort((a, b) => b.time - a.time); //sorts by most recent on top
            this.setState({ comments: commentArray });
        })
    }
    
    //turn off listeners when unmounting
    componentWillUnmount() {
        firebase.database().ref('users').off();
        firebase.database().ref('messages').off();
    }

    render() {
        if (!this.state.users) {
            return null;
        }
        var commentItems = this.state.comments.map((message) => { //mapping array for one instance of comment
            return <CommentItem message={message}
                user={this.state.users[message.userId]}
                userId={message.userId}
                key={message.key} />
        });
        return (<div>{commentItems}</div>)
    }
}

class CommentItem extends React.Component {
    render() {

        var avatar = this.props.user.avatar;
        var profileUrl = "/#/profile/" + this.props.userId;

        return (
            <div className="message-item board-container">
                <img className="user-image" src={avatar} alt="avatar" />
                <div className="message-info">
                    <a href={profileUrl}><span className="user-display"><strong>{this.props.user.displayName}</strong></span></a>
                    <span><Time value={this.props.message.time} relative /></span>
                </div>
                <span className="message-text">{this.props.message.text}</span>
            </div>
        );
    }
}

export default CommentList;