import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';

export class CommentBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comment: '' };
    }

    updateComment(event) {
        this.setState({ comment: event.target.value });
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
        return (
            <div><h1>HELLO</h1></div>
        )
    }
}

export class CommentList extends React.Component {

}

class CommentItem extends React.Component {

}

export default CommentBox;