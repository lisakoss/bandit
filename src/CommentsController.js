import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import Time from 'react-time';

export class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comments: [] };
    }

    componentDidMount() {
        var usersRef = firebase.database().ref('users');
        usersRef.on('value', (snapshot) => {
            this.setState({ users: snapshot.val() });
        });
        var postID = this.props.post;
        var commentRef = firebase.database().ref('posts/' + postID + '/messages');
        commentRef.on('value', (snapshot) => {
            var commentArray = [];
            snapshot.forEach(function (child) {
                var comment = child.val();
                comment.key = child.key;
                commentArray.push(comment);
            });
            commentArray.sort((a, b) => b.time - a.time);
            this.setState({ comments: commentArray });
        })
    }

    componentWillUnmount() {
        firebase.database().ref('users').off();
        firebase.database().ref('messages').off();
    }

    render() {
        if (!this.state.users) {
            return null;
        }
        var commentItems = this.state.comments.map((message) => {
            return <CommentItem message={message}
                user={this.state.users[message.userId]}
                key={message.key} />
        });
        console.log(commentItems);
        return (<div>{commentItems}</div>)
    }
}

class CommentItem extends React.Component {
    render() {

        var avatar = this.props.user.avatar;

        return (
            <div className="message-item board-container">
                <img className="user-image" src={avatar} alt="user picture" />
                <div className="message-info">
                    <span className="user-display"><strong>{this.props.user.displayName}</strong></span>
                    <span><Time value={this.props.message.time} relative /></span>
                </div>
                <span className="message-text">{this.props.message.text}</span>
            </div>
        );
    }
}

export default CommentList;