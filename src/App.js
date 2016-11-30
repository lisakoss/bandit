import React from 'react';
import './index.css';
import { Layout, Header, Navigation, Drawer, Content } from 'react-mdl';

class App extends React.Component {
  render() {
    return (
      <div style={{height: '100%'}}>
          <Layout fixedHeader>
              <Header transparent title={<span><a href="/" className="header-link">BANDIT</a></span>}>
                  <Navigation>
                      <a href="/#/board">Board</a>
                      <a href="/#/search">Search</a>
                      <a href="/#/inbox">Inbox</a>
                      <a href="/#/profile">Profile</a>
                  </Navigation>
              </Header>
              <Drawer title="Title">
                  <Navigation>
                      <a href="">Link</a>
                      <a href="">Link</a>
                      <a href="">Link</a>
                      <a href="">Link</a>
                  </Navigation>
              </Drawer>
              <Content role="main">
                {this.props.children}
              </Content>
          </Layout>
      </div>
    );
  }
}

export default App;