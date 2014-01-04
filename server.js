/*global require __dirname */
var express = require('express');
var app = express();

// Simple static server for now.
app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('Listening on port 3000');