/*global $, _ */
'use strict';

// Simple page, so just store stuff in the global
// Setup some config.
var config = window.config = {
  baseUrl: 'http://www.reddit.com'
  , r: 'GetMotivated'
  , sort: 'hot'
  , get url() {
    return this.baseUrl +'/r/'+ this.r +'/'+ this.sort +'.json';
  }
  , rotateSpeed: 1.8e+6 // 30 min
	, fetchSpeed: 1.44e+7 // 4 hours
};

// Start with some listings (posts)
window.listings = [];
fetchNewListings()
  .done(function(listings) {
    window.listings = listings;
    render(randomItem(listings));
  });

// Allow clicks to pick a new image
$('body').on('click', function() {
	var listings = window.listings;

	render(randomItem(listings));
});

// Loop to rotate the image
setInterval(function() {
	var listings = window.listings;

	render(randomItem(listings));
}, config.rotateSpeed);

// Loop fetch new listings
setInterval(function() {
	fetchNewListings()
		.done(function(listings) {
			window.listings = listings;
    });
}, config.fetchSpeed);



// Fetch the new listings from Reddit
// returns a $.Deferred
function fetchNewListings() {
	var dfd = new $.Deferred();

  $.getJSON(config.url)
    .fail(function() {
      console.warn('Failed to fetch new listings: ');
      console.warn(arguments);
    	dfd.reject();
    })
    .done(function(resp, status) {
      var listings = resp.data.children;
      var imgurListings = _.filter(listings, function(item) {
        var domain = item.data.domain;

        return domain === 'imgur.com'
        	|| domain === 'i.imgur.com'
      });

    	dfd.resolve(imgurListings);
    });

	return dfd.promise();
}

// Render the listing
function render(listing) {
  if (!listing) { return; }
	var elm = $('#photo');
  var url = listing.data.url;

  // change to the full image url
  url = convertImgurUrl(url);

	elm.attr('src', url);
}

// stupid simple imgur converter
function convertImgurUrl(url) {

  // get the image link
	if (!url.startsWith('http://i.')) {
    url = url.replace('http://', 'http://i.');
	}

  url = url.replace('gallery/', '');
	url = url + '.png';
  return url;
}

// Return a random item from the array
function randomItem(list) {
	var length = list.length - 1;
	var rindex = _.random(0, length);
	return list[rindex];
}