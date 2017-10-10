var app = angular.module('myApp');

//TODO: 1.work with bool flags in data.json 2.css-styles

app.directive("voteDirective", ['getDataService', 'localStorageService', function (getDataService, localStorageService) {
    var logError = function (err) {
        console.log(err)
    };

    function createResultObject (){
        //TODO: refactoring
        for(var key in this.checkboxModel){
            if(this.checkboxModel[key]){
                this.result[key] = !isNaN(this.result[key]) ? this.result[key]+= 1 : 1;
            }else{
                this.result[key] = !isNaN(this.result[key]) ? this.result[key] : 0;
            }
        }
    }

    function uncheckAllOtherCheckboxes(key, entities) {
        //TODO: refactoring
        for(var i in entities){
            if(i != key){
                entities[i] = false
            }
        }
    }

    return {
        scope: {
            source: "@",
        },
        templateUrl: 'directives/voteDirective/voteDirective.html',
        restrict: 'E',
        link: function (scope, element, attr) {
            scope.isVoting = true;
            getDataService.getData(scope.source)
                .then(function (res) {
                    scope.question = res.data.question;
                    scope.answers = res.data.answers;
                    scope.checkboxModel = res.data.answers.reduce(function (prevValue, currentValue) {
                        prevValue[currentValue] = false;
                        return prevValue;
                    }, {});
                    scope.result = localStorageService.get(scope.question) || {};
                })
                .catch(logError);
            
            scope.vote = function () {
                debugger;
                createResultObject.call(scope);
                localStorageService.set(scope.question, scope.result);
                scope.isVoting = false;
            };

            scope.voteAgain = function () {
                scope.isVoting = true;

            };
            scope.updateSelection = uncheckAllOtherCheckboxes;
        }
    }
}]);

