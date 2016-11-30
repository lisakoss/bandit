import React from 'react';
import {Layout, Header, Navigation, Textfield} from 'react-mdl';

class App extends React.Component {
  render() {
    return (
      <div>{this.props.children}</div>
    );
  }
}

export default App;
