import React from 'react';
import firebase from 'firebase';
import { hashHistory } from 'react-router';
import { Button, Textfield, Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import {CommentBox, CommentList} from './CommentsController';


export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <div><CommentList /></div>
            </div>
        );
    }
}

export default Comments;