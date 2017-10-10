var app = angular.module('myApp');

app.service("getDataService", ['$http', function ($http) {
    this.getData = function(source){
        return $http({method: 'GET', url: source});
    }
}]);