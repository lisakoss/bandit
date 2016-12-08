import React from 'react';
import firebase from 'firebase';

//returns list of people recently messaged
export class RecentConvoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
    }

    componentDidMount() {
        var user = firebase.auth().currentUser;
        if(user) {
            this.setState({user: user});
        }

        var inboxRef = firebase.database().ref('users/' + user.uid + '/inbox');
        inboxRef.once('value', (snapshot) => {
            var messagesArray = [];
            snapshot.forEach((child) => {
                messagesArray.push(child);
            });
            this.setState({messages: messagesArray});
            console.log(this.state);
        });
    }

    componentWillUnmount() {

    }

    render() {

        if (!this.state.people) {
            return null;
        }
        console.log(this.state);

        var peopleItems = this.state.messages.map((message) => {
            return <RecentConvoItem text={message.text}
                />
        });

        return (
            <div role="article">{peopleItems}</div>
        );
    }
}

class RecentConvoItem extends React.Component {
    render() {
        return (
            <div role="region"><span>{this.props.text}</span></div>
        )
    }
}

export default RecentConvoList;