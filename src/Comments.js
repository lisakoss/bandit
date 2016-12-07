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

    componentDidMount() {
        var titleRef = firebase.database().ref('posts/' + this.props.params.listingName);
        titleRef.once('value', (snapshot) => {
            var title = snapshot.child('title').val();
            var summary = snapshot.child('summary').val();
            this.setState({
                title: title,
                summary: summary
            });
        });
    }

    handleButton(event) {
        const path = '/posts/' + this.props.params.listingName;
        hashHistory.push(path);
    }

    render() {
        return (
            <div className="board-container">
                <Button raised onClick={(e) => { this.handleButton(e) } }>Back to post</Button>
                <div>
                    <h1>{this.state.title}</h1>
                    <p className="comment-desc">{this.state.summary}</p>
                </div>
                <div>
                    <div><CommentBox post={this.props.params.listingName} /></div>
                    <div><CommentList post={this.props.params.listingName} /></div>
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
        document.getElementById('comment').value='';
        
    }

    render() {

        return (
            <div>
                <div className="board-container comment-box">
                    <Textfield
                        id="comment"
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