import React from 'react';
import {MessageBox} from './BoardMessages';

class CreatePost extends React.Component {
    render() {
        return (
            <div className="board-container"><h1>create a listing</h1>
            <MessageBox/></div>
        );
    }
}

export default CreatePost;