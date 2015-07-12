var request = require('request');

var FLICKR_URL = 'https://api.flickr.com/services/rest/';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';
var STATUS_OK = 200;

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
 exports.search = function(query, callback) {
  var params = { //the parameters for Flickr request
    api_key: FLICKR_API_KEY,
    text: query,
    method: 'flickr.photos.search',
    format: 'json',
    media: 'photos',
    sort: 'relevance',
    nojsoncallback: 1
  };

  request.get({url: FLICKR_URL, qs: params}, function(error, response, body) {

    if(error) {
      callback(error);
    } else if(response.statusCode !== 200) {
      callback(new Exception('Received bad status code: ' + response.statusCode));
    } else {

     var photosArray = [];
     var parsedBody = JSON.parse(response.body);
     var photos = parsedBody.photos.photo;

     for(var i = 0; i < photos.length; i++) {
       var photoObject = {
        title: photos[i].title,
        source: 'http://farm' + photos[i].farm + '.staticflickr.com/' + photos[i].server + 
        '/' + photos[i].id + '_' + photos[i].secret + '_z.jpg'};
        photosArray.push(photoObject);
      }

      callback(null, photosArray);

    }
  });
};
