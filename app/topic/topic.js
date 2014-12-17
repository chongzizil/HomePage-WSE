'use strict';

angular.module('myApp.topic', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/topic', {
        templateUrl: 'topic/topic.html',
        controller: 'TopicCtrl'
      });
    }])
    .controller('TopicCtrl', ["$scope", "$routeParams", function ($scope, $routeParams) {
      $scope.displayNumberDistribution = true;
      $scope.displayTimeDistribution = false;

      $scope.showNumberDistribution = function () {
        $scope.displayNumberDistribution = true;
        $scope.displayTimeDistribution = false;
      };

      $scope.showTimeDistribution = function () {
        $scope.displayNumberDistribution = false;
        $scope.displayTimeDistribution = true;
      };


    }]);