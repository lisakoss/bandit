import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { InboxController } from './InboxController'

class Inbox extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({ userId: user.uid });
            } else {
                this.setState({ userId: null }); //null out the saved state
                const path = '/login';
                hashHistory.push(path);
            }
        })
    }

    render() {
        return (
            <div className="content-container" role="article">
                <h1>inbox</h1>
                <div role="region">
                    <InboxController />
                </div>
            </div>
        );
    }
}

export default Inbox;