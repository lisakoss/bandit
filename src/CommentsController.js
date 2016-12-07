import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';

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

        return (<div>{commentItems}</div>)
    }
}

class CommentItem extends React.Component {
    render() {
        return (
            <div className="message-item board-container">
                <span className="message-text">{this.props.message.text}</span>
                <span>{this.props.message.time}</span>
            </div>
        );
    }
}

export default CommentList;