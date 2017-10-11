var app = angular.module('myApp');

app.directive("voteDirective", ['getDataService', 'localStorageService', function (getDataService, localStorageService) {
    var logError = function (err) {
        console.error(err)
    };

    function createResultObject (){
        for(var key in this.checkboxModel){
            if(this.checkboxModel[key]){
                this.checked = true;
                this.result[key] = !isNaN(this.result[key]) ? this.result[key]+= 1 : 1;
            }else{
                this.result[key] = !isNaN(this.result[key]) ?this.result[key] : 0;
            }
        }
    }

    function uncheckAllOtherCheckboxes(entities, itemKey) {
        for(var key in entities){
            if(itemKey != key) entities[key] = false
        }
    }

    function mapResponseData(res){
        if(res.data.question){
            this.question = res.data.question;
        }else{
            logError("Question is not given")
        }
        if(res.data.answers){
            this.checkboxModel = res.data.answers.reduce(function (prevValue, currentValue) {
                prevValue[currentValue] = false;
                return prevValue;
            }, {});
        }else{
            logError("Answers is not given")
        }

        this.isSingleSelect = res.data.singleSelect || false;
        this.isMultipleTimesVoting = res.data.multipleTimesVoting || false;
        this.canSelectNothing = res.data.selectNothing || false;
        this.voteButtonText = res.data.selectNothing ? "Vote or see results" : "Vote";

        if(res.data.rightAnswers){
            this.rightAnswersIndexes = res.data.rightAnswers.map(function(item){
                return item - 1;
            })
        }else{
            this.rightAnswersIndexes = -1;
        }
    }

    return {
        scope: {
            source: "@",
        },
        templateUrl: 'directives/voteDirective/voteDirective.html',
        restrict: 'E',
        link: function (scope, element, attrs) {
            scope.isVoting = true;
            scope.errorMessage = "You need to chose something";
            scope.checked = false;
            scope.showErrorMessage = false;
            getDataService.getData(scope.source)
                .then(function (res) {
                    mapResponseData.call(scope, res);
                })
                .catch(logError);
            
            scope.vote = function () {
                scope.result = localStorageService.get(scope.question);
                createResultObject.call(scope);
                if(scope.canSelectNothing || scope.checked){
                    scope.showErrorMessage = false;
                    localStorageService.set(scope.question, scope.result);
                    scope.isVoting = false;
                    scope.checked = false;
                }else{
                    scope.showErrorMessage = true;
                }
            };

            scope.voteAgain = function () {
                scope.isVoting = true;
                scope.updateSelection(scope.checkboxModel)
            };

            scope.updateSelection = uncheckAllOtherCheckboxes;

            scope.checkRightAnswer = function (index) {
                return scope.rightAnswersIndexes != -1 && scope.rightAnswersIndexes.some(function (elem) {
                    return elem == index
                })
            }
        }
    }
}]);

