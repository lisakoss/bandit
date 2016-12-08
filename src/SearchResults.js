import React, { Component } from 'react';
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
                 type={result.type}
                 userId={result.userId}
                 postId={result.postId}
                 message={result.message} />
      )
    });

    return (
      <div className="category-flex" role="region">{resultItems}</div>
    );
  }
}

export default SearchResults;
