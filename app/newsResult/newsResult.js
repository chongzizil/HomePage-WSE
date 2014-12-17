'use strict';

angular.module('myApp.newsResult', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/result/news', {
            templateUrl: 'newsResult/newsResult.html',
            controller: 'NewsResultCtrl'
        });
    }])
    .controller('NewsResultCtrl', ["$scope", "NewsResultService", "$routeParams", "$route", function ($scope, NewsResultService, $routeParams, $route) {
        $scope.refresh = function() {
            $route.reload();
        };

        $scope.search = function () {
            $scope.showCorrectedQuery = false;

            var startTimeStamp = Date.now();
            var query = "";

            if (!angular.isUndefined($('.typeahead').typeahead('val'))) {
                query = $('.typeahead').typeahead('val');
            } else if (!angular.isUndefined($routeParams.query)) {
                query = $routeParams.query;
            } else if (!angular.isUndefined($("#result-search-form input[type=search]").val())) {
                query = $("#result-search-form input[type=search]").val();
            } else {
                return;
            }

            if (query.length == 0) {
                return;
            }

            $scope.query = query;
            $routeParams.query = query;
            $('.typeahead').typeahead('close');

            NewsResultService.sendQuery(query)
                .success(function (data, status) {
                    $scope.timeUsed = (Date.now() - startTimeStamp) / 1000;
                    $scope.documents = data.results;

                    if (!data.correctedQuery.isCorrect) {
                        $scope.correctedQuery = data.correctedQuery.query;
                        $scope.showCorrectedQuery = true;
                    }

                    console.log(data);
                })
                .error(function (data, status) {
                    console.log("Something is wrong...");
                });
        };


        $("#result-search-form input[type=search]").val($routeParams.query);
        $scope.search();


        ///*********************** Typeahead ***********************/
        var resultPageSuggestionQueries = new Bloodhound({
            datumTokenizer: function (datum) {
                return Bloodhound.tokenizers.whitespace(datum.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                rateLimitBy: "debounce",
                rateLimitWait: 400,
                url: 'http://localhost:25806/prf/news?query=%QUERY&ranker=comprehensive&numdocs=10&numterms=5&format=json',
                filter: function(suggestionQueries) {
                    return $.map(suggestionQueries, function(query) {
                        return {
                            value: query
                        };
                    });
                }
            }
        });

        resultPageSuggestionQueries.initialize();

        $('#result-search-form .typeahead').typeahead(null, {
            displayKey: 'value',
            source: resultPageSuggestionQueries.ttAdapter()
        });
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
    }])
    .filter('truncate', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });