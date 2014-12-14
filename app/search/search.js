'use strict';

angular.module('myApp.search', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/search', {
        templateUrl: 'search/search.html',
        controller: 'SearchCtrl'
      });
    }])
    .controller('SearchCtrl', ["$scope", '$location', '$routeParams', '$http', 'SearchService', function ($scope, $location, $routeParams, $http, SearchService) {
      $scope.search = function () {
        console.log($("#homepage-container #search-form input[type=search]").val());
        $location.url("/result?query=" + $("#homepage-container #search-form input[type=search]").val());
      };

      ///*********************** Typeahead ***********************/
      var homepageSuggestionQueries = new Bloodhound({
        datumTokenizer: function (datum) {
          return Bloodhound.tokenizers.whitespace(datum.value);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
          rateLimitBy: "debounce",
          rateLimitWait: 400,
          url: 'http://localhost:25806/prf?query=%QUERY&ranker=comprehensive&numdocs=10&numterms=5&format=json',
          filter: function(suggestionQueries) {
            return $.map(suggestionQueries, function(query) {
              return {
                value: query
              };
            });
          }
        }
      });

      homepageSuggestionQueries.initialize();

      $('#homepage-container .typeahead').typeahead(null, {
        displayKey: 'value',
        source: homepageSuggestionQueries.ttAdapter()
      });
    }])
    .factory('SearchService', ['$http', function ($http) {
      return {
        getExtendQuery: function (query) {
          var url = "http://localhost:25806/prf";

          var queryParams = {
            query: query,
            ranker: "COMPREHENSIVE",
            numdocs: 20,
            numterms: 6,
            format: "json"
          };

          var config = {
            method: "GET",
            params: queryParams
          };

          return $http({
            method: 'GET',
            url: url,
            params: queryParams
          })
        }
      }
    }]);