import React from 'react';
import { Button, List, ListItem, ListItemContent, ListItemAction, Icon } from 'react-mdl';
import firebase from 'firebase';

class Inbox extends React.Component {
    render() {
        return (
            <div>
                <div className="content-container"><h1>inbox</h1><Button raised colored>Compose</Button></div>
                <div>
                    <List style={{ width: '30%' }}>
                        <ListItem threeLine>
                            <ListItemContent avatar="person" subtitle="Bryan Cranston played the role of Walter in Breaking Bad. He is also known for playing Hal in Malcom in the Middle.">Bryan Cranston</ListItemContent>
                            <ListItemAction>
                                <a href="#"><Icon name="star" /></a>
                            </ListItemAction>
                        </ListItem>
                        <ListItem threeLine>
                            <ListItemContent avatar="person" subtitle="Aaron Paul played the role of Jesse in Breaking Bad. He also featured in the Need For Speed Movie.">Aaron Paul</ListItemContent>
                            <ListItemAction>
                                <a href="#"><Icon name="star" /></a>
                            </ListItemAction>
                        </ListItem>
                        <ListItem threeLine>
                            <ListItemContent avatar="person" subtitle="Bob Odinkrik played the role of Saul in Breaking Bad. Due to public fondness for the character, Bob stars in his own show now, called Better Call Saul.">Bob Odenkirk</ListItemContent>
                            <ListItemAction>
                                <a href="#"><Icon name="star" /></a>
                            </ListItemAction>
                        </ListItem>
                    </List>
                </div>
            </div>
        );
    }
}

export default Inbox;