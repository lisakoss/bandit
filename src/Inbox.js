import React from 'react';
import { Button } from 'react-mdl';
import firebase from 'firebase';
import { MessageBox, RecentConvoList } from './InboxController';
import { hashHistory } from 'react-router';
import { InboxController } from './InboxController'

class Inbox extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('Auth state changed: logged in as', user.email);
                this.setState({ userId: user.uid });
            } else {
                console.log('Auth state changed: logged out');
                this.setState({ userId: null }); //null out the saved state
                const path = '/login';
                hashHistory.push(path);
            }
        })
    }

    render() {
        return (
            <div>
                <div className="content-container"><h1>inbox</h1></div>
                <div>
                    <InboxController />
                </div>

                <div>

                </div>
            </div>
        );
    }
}

export default Inbox;