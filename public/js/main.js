/*global $, _ */
'use strict';

// Simple page, so just store stuff in the global
// Setup some config.
var config = window.config = {
  baseUrl: 'http://www.reddit.com'
  , sub: getSubUrl() || '/r/GetMotivated'
  , sort: 'hot'
  , get url() {
    return this.baseUrl + this.sub +'/'+ this.sort +'.json';
  }
  , rotateSpeed: 300000 // 5 min
  , fetchSpeed: 1.44e+7 // 4 hours
};

//
// MAin
//
// Start with some listings (posts)
window.listings = [];
fetchNewListings()
  .done(function(listings) {
    window.listings = listings;
    setImageSize();
    render(randomItem(listings));
  });

// Allow clicks to pick a new image
$('body').on('click', function() {
  var listings = window.listings;

  render(randomItem(listings));
});

// Use the window size to make the images to display better
$(window).on('resize', function() {
  setImageSize();
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


// Returns the sub url from the query string.
function getSubUrl() {
  var query = window.location.search.substring(1);
  var pairs = query.split('&');
  var params = {};

  pairs.forEach(function(keyvalue) {
    var parts = keyvalue.split('=');

    params[parts[0]] = parts[1];
  });

  return params.sub || '';
}

// Sets the max height/width so images fit on the screen
function setImageSize() {
  var height = $(window).height();
  var width = $(window).width();

  $('#photo').css({
    maxWidth: width
    , maxHeight: height
  });
}

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
        var url = item.data.url;

        return (domain === 'imgur.com'
          || domain === 'i.imgur.com'
          ) && (
            !url.startsWith('http://imgur.com/a/')
          )
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

  // Make sure the page title shows the correct subreddit
  $(document).prop('title', config.sub);

  elm.attr('src', url);
}

// stupid simple imgur converter
function convertImgurUrl(url) {
  var orginal = url;
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