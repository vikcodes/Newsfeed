var request = require('request');
var https = require('https');
var soundcloud = require('../lib/soundcloud.js');
var youtube = require('../lib/youtube.js');
var flickr = require('../lib/flickr.js');
var Post = require('../models/post.js');

module.exports = function(app) {
	/* Renders the newsfeed landing page. */
	app.get('/', function(request, response) {
		response.render('index.html');

	});

	/*Queries each API simultaneously. */
	app.get('/search', function(request, response) {
		var query = request.query.query;
		var results = [];
		var count = 0;

		if(!query) {
			response.send('You must specify a non-blank query.', 422);
		} else {

			soundcloud.search(query, function(error, songs) { 
				if(error) {
					throw error;
				} else {
					var song = songs[0]; 
					if(song) {
						song.api = 'soundcloud'; 
						results.push(song);
					}
					count++;
					if(count === 3) { 
						response.json(200, results);
					}
				}
			});

			youtube.search(query, function(error, videos) { 
				if(error) {
					throw error;
				} else {
					var video = videos[0]; 
					if(video) {
						video.api = 'youtube'; 
						results.push(video);
					}
					count++; 
					if(count === 3) { 
						response.json(200, results);
					}
				}
			});

			flickr.search(query, function(error, photos) { 
				if(error) {
					throw error;
				} else {
					var photo = photos[0]; 
					if(photo) {
						photo.api = 'flickr'; 
						results.push(photo);
					}
					count++;
					if(count === 3) { 
						response.json(200, results);
					}
				}
			});

		}
	});

	/* Retrieves all posts. */
	app.get('/posts', function(request, response) {
		Post.find(function(error, posts) {
			if(error) {
				throw error;
			}
			response.json(posts);
		});
	});

	/* Adds a post. */
	app.post('/posts', function(request, response) {
		if(!request.body.api || !request.body.source || !request.body.title) {
			response.send('You must specify an api, source, and title.', 422);
		} else {
			var thePost = new Post({
				api: request.body.api,
				source: request.body.source,
				title: request.body.title,
				upvotes: 0
			});

			thePost.save(function(error) {
				if(error) {
					throw error;
				}
			});

			response.json(thePost);
		}
	});

	/* Removes a post. */
	app.post('/posts/remove', function(request, response) {
		var id = request.body.id;

		Post.findByIdAndRemove(id, function(error) {
			if(error) {
				throw error;
			}
		});

		response.send();
	});

	/* Upvotes a post. */
	app.post('/posts/upvote', function(request, response) {
		var id = request.body.id;

		Post.findById(id, function(error, post) {
			if(error) {
				throw error;
			}

			post.upvotes++;

			post.save(function(error) {
				if(error) {
					throw error;
				}
			});
			
			response.json(post);
		});
	});

};
