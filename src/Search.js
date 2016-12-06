import React from 'react';
import firebase from 'firebase';
import { Textfield, Button } from 'react-mdl';

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {};

    // Function binding
    this.hasSearchTerm = this.hasSearchTerm.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    // Create new database reference 'postsRef' and 'usersRef'
    var postsRef = firebase.database().ref('posts');
    var usersRef = firebase.database().ref('users');

    // Obtain database objects
    postsRef.once('value').then(snapshot => {
      this.setState({posts: snapshot.val()});
    });
    usersRef.once('value').then(snapshot => {
      this.setState({users: snapshot.val()});
    });
  }

  // Returns a boolean; Does post have searchTerm?
  hasSearchTerm(post, searchTerm) {
    return true;
  }

  // Update state for specific field
  handleSearch(event) {
    var field = event.target.name; // search-field
    var searchTerm = event.target.value; // whatever is typed

    var posts = this.state.posts;

    // Iterate through posts
    Object.keys(posts).forEach(function(key, index) {
      var post = posts[key];
      // Does this post have a value that contains the search term?

    });
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
