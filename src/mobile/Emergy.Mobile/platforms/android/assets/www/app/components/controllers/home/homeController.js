'use strict';

var controllerId = 'homeController';

app.controller(controllerId,
    ['$scope', '$ionicPopup', 'unitsService', 'reportsService', 'authData', homeController]);

function homeController($scope, $ionicPopup, unitsService, reportsService, authData) {
    $scope.isBusy = false;
    $scope.report = {};

    var loadUnits = function () {
        $scope.isBusy = true;
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            $scope.units = units;
            $scope.selectedUnitId = units[0].Id;
            $scope.loadBasicProperties($scope.selectedUnitId);
            }, function (error) {
        })
            .finally(function () {
                $scope.isBusy = false;
            });
    };

    $scope.loadBasicProperties = function (unitId) {
        $scope.isBusy = true;
        $scope.selectedUnitId = unitId;
        var promise = unitsService.getLocations(unitId);
        promise.then(function (locations) {
            $scope.locations = locations;
            $scope.report.LocationId = locations[0].Id;
        }, function (error) {
        });

        promise = unitsService.getCategories(unitId);
        promise.then(function (categories) {
            $scope.categories = categories;
            $scope.report.CategoryId = categories[0].Id;
        }, function (error) {
        })
            .finally(function () {
                $scope.isBusy = false;
            });
    };

    var submitReportWithBasicInformation = function () {
        var promise = reportsService.createReport($scope.report);
        promise.then(function (response) {
            var successPopup = $ionicPopup.show({
                subTitle: 'Report has been successfully submitted!',
                scope: $scope,
                buttons: [
                {
                    text: 'Ok'
                }
                ]
            });
        }, function (error) {

        });
    };

    var submitReportWithAdditionalInformation = function () {
    };

    $scope.openSubmitPopup = function () {
        var submitPopup = $ionicPopup.show({
            subTitle: 'Do you want to fill additional information before submitting?',
            scope: $scope,
            buttons: [
            {
                text: 'No, submit',
                onTap: function (e) {
                    submitReportWithBasicInformation();
                }
            },
              {
                  text: 'Yes',
                  type: 'button-positive',
                  onTap: function (e) {
                      submitReportWithAdditionalInformation();
                  }
              }
            ]
        });
    };
    
    loadUnits();
}