-r-getmotivated
===============

Run this fullscreen on a TV or monitor like a digital picture frame.

Gets the hotest Imgur images from a subreddit and displays a random image every 30 minutes. It fetches a new list from Reddit every 4 hours.

By default it uses images from [/r/GetMotivated](http://www.reddit.com/r/GetMotivated/) but you can specify any subreddit and even multireddits with the ?sub query parameter.

##NodeJS

    npm install
    node server.js

##Python

    cd public
    python -m SimpleHTTPServer


##Config

    config.r = 'GetMotivated'; // the Subreddit to use
    config.sort: 'hot'; 'hot', 'new', 'random'
    
    
##Dynamic subreddit

    http://localhost:3000/?sub=/r/pics