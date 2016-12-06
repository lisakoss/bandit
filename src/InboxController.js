import React from 'react';
import { Button, List, ListItem, ListItemContent, ListItemAction, Icon, TextField } from 'react-mdl';
import firebase from 'firebase';

//form for writing a message to send
export class MessageBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { message: '' };
    }

    updateMessage(event) {
        this.setState({ message: event.target.value });
    }

    postMessage(event) {
        event.preventDefault(); //don't submit

        //var messageRef = firebase.database().ref
    }

    render() {
        return (
            <div>
                <TextField
                    onChange={() => { } }
                    label="Type your message here..."
                    floatingLabel
                    style={{ width: '50%' }}
                    />
            </div>
        );
    }
}

//returns the whole conversation
export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }
}

//returns one message
class MessageItem extends React.Component {


}

class RecentConvoItem extends React.Component {
    render() {
        return (
            <div>
                <ListItem>
                    <ListItemContent>{this.props.people}</ListItemContent>
                    <ListItemAction>
                        <a href="#"><Icon name="star" /></a>
                    </ListItemAction>
                </ListItem>
            </div>
        );
    }
}

//returns list of people recently messaged
export class RecentConvoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { people: [] };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('Auth state changed: logged in as', user.email);
                this.setState({ userId: user.uid });
            } else {
                console.log('Auth state changed: logged out');
                this.setState({ userId: null }); //null out the saved state
            }
        })

        //set arrays to capture information
        var nameArray = [];
        var avatarArray = [];
        var userIDArray = [];
        var that = this;
        //reference to user/(userID)/inbox
        var userRef = firebase.database().ref('users/' + this.state.userId + '/inbox');
        console.log(this.state.userId);
        //pulls data, the userIDs of other people recently conversed with
        userRef.once('value', (snapshot) => {
            snapshot.forEach(function (child) {
                var otherID = child.key; //grab the other persons user ID
                var otherRef = firebase.database().ref('users/' + otherID);
                otherRef.once('value', (snap) => {
                    var name = snap.child('displayName').val();
                    var avatar = snap.child('avatar').val();
                    nameArray.push(name);
                    avatarArray.push(avatar);
                });
            });
            that.setState({ people: nameArray, avatar: avatarArray });
            console.log(that.state);
        });

    }

    componentWillUnmount() {
        var currentUser = firebase.auth().currentUser.uid;
        firebase.database().ref('user/' + currentUser + '/inbox').off();
    }

    render() {

        if (!this.state.people) {
            console.log("does this happen");
            return null;
        }

        console.log(this.state.people.length);
        if (this.state.people.length > 0) {
            console.log(this.state.people)
        }
        var peopleItems = this.state.people.map((person) => {
            return <RecentConvoItem person={person}
                />
        });

        return (
            <div>{peopleItems}</div>
        );
    }
}

export default RecentConvoList;