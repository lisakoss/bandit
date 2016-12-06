import React from 'react';
import { Button, List, ListItem, ListItemContent, ListItemAction, Icon, TextField } from 'react-mdl';
import firebase from 'firebase';
import {MessageBox, RecentConvoList} from './InboxController';

class Inbox extends React.Component {
    render() {
        return (
            <div>
                <div className="content-container"><h1>inbox</h1><Button raised colored>Compose</Button></div>
                <div>
                    <RecentConvoList />
                </div>

                <div>
                    
                </div>
            </div>
        );
    }
}

export default Inbox;