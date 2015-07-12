var request = require('request');

var YT_URL = 'https://www.googleapis.com/youtube/v3/search';
var YT_API_KEY = 'AIzaSyDDP01Gnj3-wfoqM59xQz6pryJQhmYWCt8';
var YT_EMBED_URL = 'http://www.youtube.com/embed/';

/**
 * Queries YouTube for tracks that match the given query
 * 
 * @param query - the search query to send to YouTube
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
 exports.search = function(query, callback) {
  var params = { //parameters for a Youtube request
  	key: YT_API_KEY,
    q: query,
    part: 'snippet',
    type: 'video'
  };

  request.get({url: YT_URL, qs: params}, function(error, response, body) {

  	if(error) {
  		callback(error);
  	} else if(response.statusCode !== 200) {
  		callback(new Exception('Received bad status code: ' + response.statusCode));
  	} else {

  		var body = JSON.parse(response.body);
  		var videos = body.items;
  		var videosArray = [];

      for(var i = 0; i < videos.length; i++) {
        var videoObject = {
          title: videos[i].snippet.title,
          source: YT_EMBED_URL + videos[i].id.videoId,
        };
        videosArray.push(videoObject);
      }
      
      callback(null, videosArray);
    }
  });
};
