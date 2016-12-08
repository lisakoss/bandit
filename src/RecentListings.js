import React from 'react';
import firebase from 'firebase';
import Time from 'react-time';
import { Button } from 'react-mdl';
import {Link} from 'react-router';

export class RecentListings extends React.Component {
	constructor(props){
    	super(props);
    	this.state = {listings:[]};
  	}

	//Lifecycle callback executed when the component appears on the screen.
	//Grabs list of posts for the particular user profile.
	componentDidMount() {
		var listingsRef = firebase.database().ref('users/' + this.props.profileID + '/posts').limitToLast(3); //only shows the 3 most recent posts
		listingsRef.on('value', (snapshot) => {
			var userListingsArray = [];
			snapshot.forEach(function(child){
				var listing = child.val();
				userListingsArray.push(listing);
	      	});
			userListingsArray.sort((a,b) => b.time - a.time); //reverse order, to show most recently posted first
			this.setState({listings: userListingsArray}); //push each listing onto array of listings associated with a user
    	});
	}

 	//when the component is unmounted,
	componentWillUnmount() {
  		//unregister listeners
		firebase.database().ref('users/' + this.props.profileID + '/posts').off();
	}

	//Grabs user and listing data for the next profile
    componentWillReceiveProps(nextProps) {
		var listingsRef = firebase.database().ref('users/' + nextProps.profileID + '/posts').limitToLast(3); //only shows the last 3 posts
		listingsRef.on('value', (snapshot) => {
			var userListingsArray = [];
			snapshot.forEach(function(child){
				var listing = child.val();
				userListingsArray.push(listing);
	      	});
			userListingsArray.sort((a,b) => b.time - a.time); //reverse order
			this.setState({listings: userListingsArray});
    	});
    }

	render() {
    // Create a list of <ListingItem /> objects so each listing can be displayed
    var listingItems = this.state.listings.map((listing) => {
      return <ListingItem listing={listing}
                        key={listing.listingId} />
    })

    var listings = null;
    if(listingItems.length > 0) {
        listings = (<div className="all-listings">{listingItems}</div>); //grabs all recent listings for a user
    } else {
        listings = (<div><p>No recent listings to show.</p></div>); //if no listings exist for a user
    }
    return listings;
  }
}

//A single user listing
class ListingItem extends React.Component {
	render() {
        var listingType = null; //determines listing type
        if(this.props.listing.type === 'offering') {
            listingType = 'listing-type listing-offer';
        } else {
            listingType = 'listing-type listing-wanted';
        }
		return (
			<div role="article" className="recent-listing">
				<div className="recent-listing-container">
					<div role="region" className="listing-image">
						<img src={this.props.listing.image || './img/defaultboardimage.jpg'} alt="listing" />
					</div>
					<div role="region" className="listing-info">
						<h1>{this.props.listing.title}</h1><span className={listingType}>{this.props.listing.type}</span> <span className="listing-time"><Time value={this.props.listing.time} relative/></span>
						<p className="listing-summary">{this.props.listing.summary}</p>
					</div>
					<div role="region" className="listing-controls">
						<Button><Link to={"/posts/" + this.props.listing.listingId}>Read</Link></Button>
						<Button><Link to={"/comments/" + this.props.listing.listingId}>Comments</Link></Button>
					</div>
				</div>
			</div>
		);
	}
}

export default RecentListings;
