import React from 'react';
import firebase from 'firebase';
import Time from 'react-time'

export class RecentListings extends React.Component {
  constructor(props){
    super(props);
    this.state = {listings:[]};
  }

			
	componentDidMount() {
		var listingsRef = firebase.database().ref('users/' + this.props.profileID + '/posts');
		//var thisComponent = this;
		console.log(this.props.profileID);
		listingsRef.on('value', (snapshot) => {
			var userListingsArray = []; 
			snapshot.forEach(function(child){
				var listing = child.val();
				userListingsArray.push(listing);
				console.log(listing.title);
				console.log(listing.summary);
				console.log(listing.image);
	      	});
			userListingsArray.sort((a,b) => b.time - a.time); //reverse order
			this.setState({listings: userListingsArray});
    	});
	}

	componentWillUnmount() {
  		//unregister listeners
		firebase.database().ref('users/' + this.props.profileID + '/posts').off();
	}

    componentWillReceiveProps(nextProps) {
		var listingsRef = firebase.database().ref('users/' + nextProps.profileID + '/posts');
		//var thisComponent = this;
		console.log(nextProps.profileID);
		listingsRef.on('value', (snapshot) => {
			var userListingsArray = []; 
			snapshot.forEach(function(child){
				var listing = child.val();
				userListingsArray.push(listing);
				console.log(listing.title);
				console.log(listing.summary);
				console.log(listing.image);
	      	});
			userListingsArray.sort((a,b) => b.time - a.time); //reverse order
			this.setState({listings: userListingsArray});
    	});
    }

	render() {
    /* Create a list of <ListingItem /> objects */
    var listingItems = this.state.listings.map((listing) => {
      return <ListingItem listing={listing} 
                        key={listing.listingId} />
    })

    return (<div className="all-listings">{listingItems}</div>);
  }
}

//A single user listing
class ListingItem extends React.Component {
	render() {
        var listingType = null;
        if(this.props.listing.type === 'offering') {
            listingType = 'listing-type listing-offer';
        } else {
            listingType = 'listing-type listing-wanted';
        }
		return (
		<div className="listing">
            <div className="listing-container">
                <div className="listing-image">
                    <img src={this.props.listing.image || 'http://www.thesnipenews.com/wp-content/gallery/lights-at-the-commodore-ballroom-vancouver-nov-7-2009/valsmile.jpg'} alt="avatar" />
                </div>
                <div className="listing-info">
                    <h1>{this.props.listing.title}</h1><span className={listingType}>{this.props.listing.type}</span> <span className="listing-time"><Time value={this.props.listing.time} relative/></span>
                    <p className="listing-summary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et maximus ex. Suspendisse vestibulum enim eu ante sagittis, vel faucibus enim sodales. Proin ultrices et metus vitae pretium. Praesent efficitur augue rutrum eleifend auctor. Aliquam posuere luctus elit, non eleifend ante molestie ut. Ut quis ornare ipsum. Quisque tincidunt tellus sed pharetra vulputate. Nullam ligula libero, scelerisque sit amet pulvinar at, scelerisque eget ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec eu fermentum dolor.</p>
                </div>
            </div>

		</div>      
		);
	}
}

export default RecentListings;