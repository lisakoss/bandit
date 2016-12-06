import React from 'react';
import firebase from 'firebase';
import { Textfield } from 'react-mdl';

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

  // Checks if post contains searchTerm
  hasSearchTerm(post, searchTerm) {
    // Iterate through each key of the post
    for (const key of Object.keys(post)) {
      // Get value contained in key
      var value = post[key];
      // Only compare valid keys
      if (key !== "time" &&
          key !== "timeEdited" &&
          key !== "wanted" &&
          key !== "userId") {
        if (value.includes(searchTerm)) {
          return true;
        }
      }
    }
    return false;
  }

  // Update state for specific field
  handleSearch(event) {
    console.log("=================");
    var field = event.target.name; // search-field
    var searchTerm = event.target.value; // whatever is typed
    var posts = this.state.posts;

    // Iterate through posts
    for (const key of Object.keys(posts)) {
      const post = posts[key];
      // Does this post have a value containing the search term?
      var postHasTerm = this.hasSearchTerm(post, searchTerm);
      if (postHasTerm) {
        // Render this post... Or update state?
        console.log(post);
      }
    }

  }

  render() {
      return (
        <div className="content-container">
          <h1>search</h1>
          <form role="form" className="search-form">
            <Textfield
              onChange={this.handleSearch}
              label="Search for your next gig or collaboration"
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
