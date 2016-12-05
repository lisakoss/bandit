import React from 'react';
import firebase from 'firebase';
import { Textfield, Button } from 'react-mdl';

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
      return (
        <div className="content-container">
          <h1>search</h1>
          <form role="form" className="search-form">
            <Textfield
              onChange={this.handleSearch}
              label="Search for a musician, gig or collaboration"
              id="search-field"
              type="text"
              name="search-field"
              className="search-field"
            />
          </form>
        </div>
      );
  }
}

export default Search;
