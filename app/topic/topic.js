'use strict';

angular.module('myApp.topic', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/topic', {
        templateUrl: 'topic/topic.html',
        controller: 'TopicCtrl'
      });
    }])
    .controller('TopicCtrl', ["$scope", "$routeParams", "TopicService", function ($scope, $routeParams, TopicService) {
      $scope.displayTopTopics = true;
      $scope.displayNumberDistribution = false;
      $scope.displayTimeDistribution = false;

      $scope.showNumberDistribution = function () {
        $scope.displayTopTopics = false;
        $scope.displayNumberDistribution = true;
        $scope.displayTimeDistribution = false;
      };

      $scope.showTimeDistribution = function () {
        $scope.displayTopTopics = false;
        $scope.displayNumberDistribution = false;
        $scope.displayTimeDistribution = true;
      };

      $scope.showTopTopics = function () {
        $scope.displayTopTopics = true;
        $scope.displayNumberDistribution = false;
        $scope.displayTimeDistribution = false;
      };

      TopicService.sendQuery("ignore")
          .success(function(data, status) {
            console.log(data);
            $scope.topics = data.results;
          })
          .error(function(data, status) {
            console.log("Something is wrong...");
          });

    }])
    .factory('TopicService', ["$http", function ($http) {
      return {
        sendQuery: function(query) {
          var url = "http://localhost:25806/search/topics";

          var queryParams = {
            query: query,
            ranker: "COMPREHENSIVE",
            numdocs: 5,
            num: 3,
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