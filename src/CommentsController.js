import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import Time from 'react-time';

//complete list of comments for a post
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
                key={message.key}
                messageId={message.key}
                postId={this.props.post} />
        });
        return (<div>{commentItems}</div>)
    }
}

//single instance of a comment
class CommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
    }

    handleOpenDialog() { //when delete is pressed
        this.setState({ openDialog: true });
    }

    handleCloseDialog() { //when close is pressed
        this.setState({ openDialog: false });
    }
    
    //only able to delete if user is author of the post
    handleDelete(event) {
        var currentUser = firebase.auth().currentUser.uid;
        if (this.props.userId === currentUser) {
            var messageId = this.props.messageId;
            var postRef = firebase.database().ref('posts/' + this.props.postId + '/messages/' + messageId);
            postRef.remove()
                .then(function () {
                    console.log("Deleted message");
                });
            this.setState({ openDialog: false });
        } else {
            alert('You can\'t delete someone elses posts');
            this.setState({ openDialog: false });
        }
    }

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
                <Button className="delete" onClick={(e) => this.handleOpenDialog(e)}><i className="fa fa-trash-o" aria-hidden="true"></i></Button>
                <div>
                    <Dialog open={this.state.openDialog}>
                        <DialogTitle>Delete message?</DialogTitle>
                        <DialogContent>
                            <p>Deleting messages can't be undone, so think carefully before doing so!</p>
                        </DialogContent>
                        <DialogActions>
                            <Button type='button' onClick={(e) => this.handleDelete(e)}>Agree</Button>
                            <Button type='button' onClick={this.handleCloseDialog}>Disagree</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}

export default CommentList;