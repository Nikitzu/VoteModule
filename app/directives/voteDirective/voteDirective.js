var app = angular.module('myApp');

app.directive("voteDirective", ['dataService', 'localStorageService', function (dataService, localStorageService) {
    var logError = function (err) {
        console.error(err)
    };

    function createResultObject() {
        var properiesArray = Object.getOwnPropertyNames(this.checkboxModel);
        properiesArray.forEach(function (item) {
            if (this.checkboxModel[item]) {
                this.checked = true;
                this.result[item] = !isNaN(this.result[item]) ? this.result[item] += 1 : 1;
            } else {
                this.result[item] = !isNaN(this.result[item]) ? this.result[item] : 0;
            }
        }, this);
    }

    function uncheckAllOtherCheckboxes(entities, itemKey) {
        var properiesArray = Object.getOwnPropertyNames(entities);
        properiesArray.forEach(function (item) {
            if (itemKey != item) entities[item] = false
        });
    }

    function mapResponseData(res) {
        if (res.data.question) {
            this.question = res.data.question;
        } else {
            logError("Question is not given")
        }
        if (res.data.answers) {
            this.checkboxModel = res.data.answers.reduce(function (prevValue, currentValue) {
                prevValue[currentValue] = false;
                return prevValue;
            }, {});
        } else {
            logError("Answers is not given")
        }

        this.isSingleSelect = res.data.singleSelect || false;
        this.isMultipleTimesVoting = res.data.multipleTimesVoting || false;
        this.canSelectNothing = res.data.selectNothing || false;
        this.voteButtonText = res.data.selectNothing ? "Vote or see results" : "Vote";

        if (res.data.rightAnswers) {
            this.rightAnswersIndexes = res.data.rightAnswers.map(function (item) {
                return item - 1;
            });
            this.rightAnswersExist = true;
        } else {
            this.rightAnswersIndexes = -1;
            this.rightAnswersExist = false;
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
            dataService.getData(scope.source)
                .then(function (res) {
                    mapResponseData.call(scope, res);
                })
                .catch(logError);

            scope.vote = function () {
                scope.result = dataService.getDataFromLocalStorage(scope.question) || {};
                createResultObject.call(scope);
                if (scope.canSelectNothing || scope.checked) {
                    scope.showErrorMessage = false;
                    dataService.saveData(scope.question, scope.result);
                    scope.isVoting = false;
                    scope.checked = false;
                } else {
                    scope.showErrorMessage = true;
                }
            };

            scope.voteAgain = function () {
                scope.isVoting = true;
                scope.updateSelection(scope.checkboxModel)
            };

            scope.updateSelection = uncheckAllOtherCheckboxes;

            scope.checkRightAnswer = function (index) {
                return scope.rightAnswersExist && scope.rightAnswersIndexes.some(function (elem) {
                    return elem == index
                })
            }
        }
    }
}]);

