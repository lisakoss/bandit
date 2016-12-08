import React from 'react';
import firebase from 'firebase';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions,Textfield } from 'react-mdl';
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
        this.state = { comment: '',
                        openDialog: false,
                        openEditDialog: false };

        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
        this.handleOpenEditDialog = this.handleOpenEditDialog.bind(this);
    }

    updateEdit(event) { 
        this.setState({ comment: event.target.value });
    }

    handleOpenDialog() { //when delete is pressed
        this.setState({ openDialog: true });
    }

    handleOpenEditDialog() { //opens edit dialog
        this.setState({ openEditDialog: true });
    }

    handleCloseDialog() { //when close is pressed
        this.setState({ openDialog: false });
    }

    handleCloseEditDialog() { //closes edit dialog
        this.setState({ openEditDialog: false });
    }

    postEdit(event) { //posts edit
        event.preventDefault();

        var postId = this.props.postId;
        var commentRef = firebase.database().ref('posts/' + postId + '/messages/' + this.props.messageId);
        var text = this.state.comment;
        var editTime = firebase.database.ServerValue.TIMESTAMP;
        commentRef.child('text').set(text);
        commentRef.child('edit').set(editTime);
        this.setState({comment: '',
                        openEditDialog: false,
                        editTime: editTime});

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
        var ComponentToRender = null;
        var currentUser = firebase.auth().currentUser.uid;

        if (this.props.userId === currentUser) { //only shows button if current user posted it
            ComponentToRender =
                <div>
                    <Button className="delete" onClick={(e) => this.handleOpenDialog(e)}><i className="fa fa-trash-o" aria-hidden="true"></i></Button>
                    <Button className="delete" onClick={(e) => this.handleOpenEditDialog(e)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></Button>
                <div>
                    <Dialog open={this.state.openDialog}>
                        <DialogTitle>Delete comment?</DialogTitle>
                        <DialogContent>
                            <p>Deleting comments can't be undone, so think carefully before doing so!</p>
                        </DialogContent>
                        <DialogActions>
                            <Button type='button' onClick={(e) => this.handleDelete(e)}>Delete</Button>
                            <Button type='button' onClick={this.handleCloseDialog}>Cancel</Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.openEditDialog}>
                        <DialogTitle>Edit your comment?</DialogTitle>
                        <DialogContent>
                            <Textfield onChange={(e) => this.updateEdit(e)}
                                label="Write your edit here"
                                />
                        </DialogContent>
                        <DialogActions>
                            <Button type='button' onClick={(e) => this.postEdit(e)}>Post</Button>
                            <Button type='button' onClick={this.handleCloseEditDialog}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                </div >;
        }
        
        //checking if message was edited
        var editedTime = '';
        var editTimeRef = firebase.database().ref('posts/' + this.props.postId + '/messages/' + this.props.messageId + '/edit');
        editTimeRef.once('value', (snapshot) => {
            editedTime = snapshot.val();
        });
        var showEdited = null;
        if (firebase.database().ref('posts/' + this.props.postId + '/messages/' + this.props.messageId + '/edit') !== null) {
            showEdited = <span>(edited at: <Time value={editedTime} relative /> )</span>
        }

        return (
            <div className="message-item board-container">
                <img className="user-image" src={avatar} alt="avatar" />
                <div className="message-info">
                    <a href={profileUrl}><span className="user-display"><strong>{this.props.user.displayName}</strong></span></a>
                    <span><Time value={this.props.message.time} relative /> </span>
                    {showEdited}
                </div>
                <span className="message-text">{this.props.message.text}</span>
                {ComponentToRender}
            </div>
        );
    }
}

export default CommentList;