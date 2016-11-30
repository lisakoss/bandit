import React from 'react';
import {Layout, Header, Navigation} from 'react-mdl';

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Layout style={{background: 'url(./img/IMG_7962.png) center / cover'}}>
          <Header transparent title="BANDIT" style={{color: 'white'}}>
            <Navigation>
              <a href="">Board</a>
              <a href="">Manage</a>
              <a href="">Inbox</a>
              <a href="">Profile</a>
            </Navigation>
          </Header>
        </Layout>
      </div>
    );
  }
}

export default App;
