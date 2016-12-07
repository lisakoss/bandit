import React, { Component } from 'react';
import firebase from 'firebase';
import JobCard from './JobCard';

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Don't show if there are no search results
    if (this.props.results == null || !this.props.results) {
      return null;
    }

    if (this.props.results.length === 0) {
      return (<h2>No results found</h2>);
    }

    var resultItems = this.props.results.map((result, key) => {
      return (
        <JobCard key={key}
                 image={result.image}
                 instrument={result.instrument}
                 job={result.job}
                 location={result.location}
                 summary={result.summary}
                 tags={result.tags}
                 text={result.text}
                 time={result.time}
                 timeEdited={result.timeEdited}
                 title={result.title}
                 type={result.wanted}
                 userId={result.userId}
                 message={result.message} />
      )
    });

    return (
      <div className="category-flex">
        {
          resultItems
        }
      </div>
    );
  }
}

export default SearchResults;
