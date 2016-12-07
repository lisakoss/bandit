import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import {CommentList} from './CommentsController';


export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div><CommentList post={this.props.params.listingName} /></div>
                <div><CommentBox post={this.props.params.listingName}/></div>
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
        console.log(this.state);
    }

    postComment(event) {
        event.preventDefault();

        var postId = this.props.post;
        console.log(this.props.post);
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
        // var currentUser = this.getUserID();
        // console.log(currentUser);
        var postId = this.props.post;
        console.log(postId);

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