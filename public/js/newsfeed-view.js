(function(window, document, undefined) {
  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {

    PostModel.loadAll(function(error, entries) {

      if(error) {
        var $error = $(".error");
        $error.text()  = error;
      } else {

        for(var i = 0; i < entries.length; i++) {
        NewsfeedView.renderPost($newsfeed, entries[i], false); //for each post, render it
        $newsfeed.imagesLoaded(function() {
          $newsfeed.masonry({
            columnWidth: '.post',
            itemSelector: '.post'
          });
        });
      };
    }
  });
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {

    var postTemplate = $("#newsfeed-post-template").html();
    var renderThePost = Handlebars.compile(postTemplate);
    var $post = $(renderThePost(post));
    $newsfeed.prepend($post); //renders the post element into the $newsfeed element


    $post.find('.remove').click(function(event) { //when the delete button is clicked for a post
      event.preventDefault();
      PostModel.remove(post._id, function(error) {
        if(error) {
          var $error = $(".error");
          $error.text()  = error;
        } else {
          $newsfeed.masonry('remove', $post);
          $newsfeed.masonry();
        }
      });
    });

    $post.find('.upvote').click(function(event) { //when the upvote button is clicked for a post
      event.preventDefault();
      PostModel.upvote(post._id, function(error, post) {
        if(error) {
          var $error = $(".error");
          $error.text()  = error;
        } else {
          $post.find('.upvote-count').text(post.upvotes);
        }
      });
    });

    if(updateMasonry) { //updates the grid
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
      });
    }

  };

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
