'use strict';

angular.module('myApp.result', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/result', {
            templateUrl: 'result/result.html',
            controller: 'ResultCtrl'
        });
    }])
    .controller('ResultCtrl', ["$scope", "ResultService", "$routeParams", function ($scope, ResultService, $routeParams) {
        $scope.search = function() {
            var startTimeStamp = Date.now();
            var query = $("#result-search-nav-container #search-form input[type=search]").val();

            ResultService.sendQuery(query)
                .success(function(data, status) {
                    $scope.timeUsed = (Date.now() - startTimeStamp) / 1000;
                    $scope.documents = data.Results;
                    console.log(data);
                })
                .error(function(data, status) {
                    console.log("Something is wrong...");
                });
        };

        $("#result-search-nav-container #search-form input[type=search]").val($routeParams.query);
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

        $('#result-search-nav-container .typeahead').typeahead(null, {
            displayKey: 'value',
            source: resultPageSuggestionQueries.ttAdapter()
        });
    }])
    .factory('ResultService', ["$http", function ($http) {
        return {
            sendQuery: function(query) {
                var url = "http://localhost:25806/search";

                var queryParams = {
                    query: query,
                    ranker: "COMPREHENSIVE",
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