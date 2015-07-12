(function(window, document, undefined) {
  var SearchModel = {};
  var SEARCH_URL = '/search';
  var STATUS_OK = 200;

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
   SearchModel.search = function(query, callback) {
    var params = encodeURIComponent(query);
    var request = new XMLHttpRequest();

    request.addEventListener('load', function(event) {
      if(request.status === STATUS_OK) {
        var theJSON = request.responseText;
        var parsedJSON = JSON.parse(theJSON);
        callback(null, parsedJSON);
      } else {
        callback(error);
      }
    });

    request.open('GET', SEARCH_URL + '?query=' + params);
    request.send();
  };

  window.SearchModel = SearchModel;
})(this, this.document);
