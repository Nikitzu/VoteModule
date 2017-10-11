var app = angular.module('myApp');

app.service("dataService", ['$http', "localStorageService", function ($http, localStorageService) {
    this.getData = function (source) {
        return $http({method: 'GET', url: source});
    };

    this.saveData = function (key, value) {
        return localStorageService.set(key, value)
    };

    this.getDataFromLocalStorage = function (key) {
        return localStorageService.get(key)
    };
}]);