'use strict';

angular.module('myApp.newsResult', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/result/news', {
            templateUrl: 'newsResult/newsResult.html',
            controller: 'NewsResultCtrl'
        });
    }])
    .controller('NewsResultCtrl', ["$scope", "NewsResultService", "$routeParams", function ($scope, NewsResultService, $routeParams) {
        $scope.search = function () {
            var startTimeStamp = Date.now();
            var query = $('.typeahead').typeahead('val');

            NewsResultService.sendQuery(query)
                .success(function (data, status) {
                    $scope.timeUsed = (Date.now() - startTimeStamp) / 1000;
                    $scope.documents = data.Results;
                    console.log(data);
                })
                .error(function (data, status) {
                    console.log("Something is wrong...");
                });
        };

        $("#result-search-form input[type=search]").val($routeParams.query);
        $scope.search();


        /////*********************** Typeahead ***********************/
        //var resultPageSuggestionQueries = new Bloodhound({
        //    datumTokenizer: function (datum) {
        //        return Bloodhound.tokenizers.whitespace(datum.value);
        //    },
        //    queryTokenizer: Bloodhound.tokenizers.whitespace,
        //    remote: {
        //        rateLimitBy: "debounce",
        //        rateLimitWait: 400,
        //        url: 'http://localhost:25806/prf?query=%QUERY&ranker=comprehensive&numdocs=10&numterms=5&format=json',
        //        filter: function(suggestionQueries) {
        //            return $.map(suggestionQueries, function(query) {
        //                return {
        //                    value: query
        //                };
        //            });
        //        }
        //    }
        //});
        //
        //resultPageSuggestionQueries.initialize();
        //
        //$('#result-search-form .typeahead').typeahead(null, {
        //    displayKey: 'value',
        //    source: resultPageSuggestionQueries.ttAdapter()
        //});
    }])
    .factory('NewsResultService', ["$http", function ($http) {
        return {
            sendQuery: function (query) {
                var url = "http://localhost:25806/search/news";

                var queryParams = {
                    query: query,
                    ranker: "news",
                    numdocs: 20,
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
                });
            }
        }
    }]);