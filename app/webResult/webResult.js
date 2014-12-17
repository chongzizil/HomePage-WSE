'use strict';

angular.module('myApp.webResult', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/result/web', {
            templateUrl: 'webResult/webResult.html',
            controller: 'WebResultCtrl'
        });
    }])
    .controller('WebResultCtrl', ["$scope", "WebResultService", "$routeParams", '$route', function ($scope, WebResultService, $routeParams, $route) {
        $scope.refresh = function() {
            $route.reload();
        };

        $scope.search = function() {
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

            $routeParams.query = query;
            $scope.query = query;
            $('.typeahead').typeahead('close');

            WebResultService.sendQuery(query)
                .success(function(data, status) {
                    $scope.timeUsed = (Date.now() - startTimeStamp) / 1000;
                    $scope.documents = data.results;

                    if (!data.correctedQuery.isCorrect) {
                        $scope.correctedQuery = data.correctedQuery.query;
                        $scope.showCorrectedQuery = true;
                    }

                    console.log(data);
                })
                .error(function(data, status) {
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

        resultPageSuggestionQueries.initialize();

        $('#result-search-form .typeahead').typeahead(null, {
            displayKey: 'value',
            source: resultPageSuggestionQueries.ttAdapter()
        });
    }])
    .factory('WebResultService', ["$http", function ($http) {
        return {
            sendQuery: function(query) {
                var url = "http://localhost:25806/search";

                var queryParams = {
                    query: query,
                    ranker: "COMPREHENSIVE",
                    numdocs: 20,
                    format: "json"
                    //checker: "ngram"
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