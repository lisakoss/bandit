import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import { CommentList } from './CommentsController';


export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleButton(event) {
        const path = '/posts/' + this.props.params.listingName;
        hashHistory.push(path);
    }

    render() {
        return (
            <div>
            <Button raised onClick={(e) => {this.handleButton(e)}}>Back to post</Button>
                <div>
                    <div><CommentList post={this.props.params.listingName} /></div>
                    <div><CommentBox post={this.props.params.listingName} /></div>
                </div>
            </div>
        );
    }
}

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
    }

    postComment(event) {
        event.preventDefault();

        var postId = this.props.post;
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
        var postId = this.props.post;

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

export default Comments;