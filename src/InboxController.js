import React from 'react';
import { Button, List, ListItem, ListItemContent, ListItemAction, Icon } from 'react-mdl';
import firebase from 'firebase';

//form for writing a message to send
export class MessageBox extends React.Component {
    constuctor(props) {
        super(props);
        this.state = {message:''};
    }
}

export class MessageList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {messages:[]};
    }
}

//returns one message
class MessageItem extends React.Component {


}

class RecentConvoItem extends React.Component {

}

export class RecentConvoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {people:[]};
    }
}