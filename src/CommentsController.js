import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';



export class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comment: '' };

        this.postComment = this.postComment.bind(this);
        this.getUserID = this.getUserID.bind(this);
    }

    getUserID() {
        return firebase.auth().currentUser;
    }

    updateComment(event) {
        this.setState({ comment: event.target.value });
        console.log(this.state);
    }

    postComment(event) {
        event.preventDefault();

        var postId = this.props.params.listingName;
        var commentRef = firebase.database().ref('posts/' + postId + '/messages');
        var newComment = {
            text: this.state.comment,
            userId: firebase.auth().currentUser.uid,
            time: firebase.database.ServerValue.TIMESTAMP
        };
        commentRef.push(newComment);

        this.setState({ comment: '' });
    }

    render() {
        var currentUser = this.getUserID();
        console.log(currentUser);
        var postId = this.props.params.listingName;

        var titleRef = firebase.database().ref('posts/' + postId + '/title');
        var title = '';
        titleRef.once('value', (snapshot) => {
            title = snapshot.val();
        });

        return (
            <div>
                <h1>{title}</h1>
                <div className="board-container comment-box">
                    <Textfield
                        onChange={(e) => { this.updateComment(e) } }
                        label="Write your message here..."
                        style={{ width: '80%' }}
                        />
                    <Button raised colored onClick={this.postComment}>Send</Button>
                </div>
            </div>
        )
    }
}

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

        var commentRef = firebase.database().ref('messages');
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
        if(!this.state.users) {
            return null;
        }

        var commentItems = this.state.messages.map((message) => {
            return <CommentItem message={message}
                                user={this.state.users[message.userId]}
                                key={message.key} />
        })

        return (<div>{commentItems}</div>)
    }
}

class CommentItem extends React.Component {
    render() {
        <div>
            <span>{this.props.message.text}</span>
        </div>
    }
}

export default CommentList;