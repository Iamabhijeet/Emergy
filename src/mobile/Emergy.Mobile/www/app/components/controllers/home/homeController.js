'use strict';

var controllerId = 'homeController';

app.controller(controllerId,
    ['$scope', '$cordovaGeolocation', '$cordovaCamera', '$ionicModal', 'notificationService', 'unitsService', 'reportsService', 'authData', homeController]);

function homeController($scope, $cordovaGeolocation, $cordovaCamera, $ionicModal, notificationService, unitsService, reportsService, authData) {
    $scope.isBusy = false;
    $scope.report = {};
    $scope.customPropertyValues = [];
    $scope.reportDetails = {};
	
    var posOptions = { timeout: 10000, enableHighAccuracy: false };

    var loadUnits = function () {
        notificationService.displayLoading("Loading reporting information...");
        $scope.isBusy = true;
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            $scope.units = units;
            $scope.selectedUnitId = units[0].Id;
            $scope.loadBasicProperties($scope.selectedUnitId);
        }, function (error) {
            notificationService.displayErrorPopup("There has been an error fetching unit information.", "Ok");
        })
            .finally(function () {
                notificationService.hideLoading();
                $scope.isBusy = false;
            });
    };

    $scope.loadBasicProperties = function (unitId) {
        notificationService.displayLoading("Loading reporting information...");
        $scope.isBusy = true;
        $scope.selectedUnitId = unitId;
        var promise = unitsService.getLocations(unitId);
        promise.then(function (locations) {
            $scope.locations = locations;
            $scope.report.LocationId = $scope.locations[0].Id;
        }, function (error) {
            notificationService.displayErrorPopup("There has been an error fetching location information.", "Ok");
        });

        promise = unitsService.getCategories(unitId);
        promise.then(function (categories) {
            $scope.categories = categories;
            $scope.report.CategoryId = $scope.categories[0].Id;
        }, function (error) {
            notificationService.displayErrorPopup("There has been an error fetching category information.", "Ok");
        })
            .finally(function () {
                notificationService.hideLoading();
                $scope.isBusy = false;
            });
    };

    var submitReportWithBasicInformation = function () {
        if ($scope.reportDetails.useCurrentLocation) {
            notificationService.displayLoading("Submitting report...");
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;

                var location = {
                    Latitude: $scope.latitude,
                    Longitude: $scope.longitude,
                    Name: "Captured location",
                    Type: "Captured"
                }

                var promise = unitsService.createLocation(location);
                promise.then(function (locationId) {
                    $scope.report.LocationId = locationId;

                    var promise = reportsService.createReport($scope.report);
                    promise.then(function (reportId) {
						$scope.reportId = reportId;
						var promise = unitsService.getUnit($scope.selectedUnitId); 
						promise.then(function(unit) {
							var notification = {
								Content: "has submitted a report", 
								TargetId: unit.AdministratorId, 
								Type: "ReportCreated", 
								ParameterId: $scope.reportId
							}
							console.log(notification);
							var promise = notificationService.pushNotification(notification);
							promise.then(function(response) {
								$scope.report.LocationId = $scope.locations[0].Id;
								notificationService.hideLoading();
								notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
							}, function(error) {
								notificationService.hideLoading();
								notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
							});
						}, function(error) {
							notificationService.hideLoading();
							notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
						});
						
                    }, function (error) {
                        notificationService.hideLoading();
                        notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
                    });
                }, function (error) {
                    notificationService.hideLoading();
                    notificationService.displayErrorPopup("There has been an error creating your location!", "Ok");
                });
            }, function (err) {
                notificationService.hideLoading();
                notificationService.displayErrorPopup("There has been an error acquiring your location!", "Ok");
            });
        }
        else {
            notificationService.displayLoading("Submitting report...");
            var promise = reportsService.createReport($scope.report);
            promise.then(function (reportId) {
				$scope.reportId = reportId; 
				var promise = unitsService.getUnit($scope.selectedUnitId); 
				promise.then(function(unit){
					var notification = {
						Content: "has submitted a report", 
						TargetId: unit.AdministratorId, 
						Type: "ReportCreated", 
						ParameterId: $scope.reportId
					}
					console.log(notification);
					var promise = notificationService.pushNotification(notification); 
					promise.then(function(response) {
						notificationService.hideLoading();
						notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
					}, function(error) {
						notificationService.hideLoading();
						notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
					});
				}, function(error) {
					notificationService.hideLoading();
					notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
				});
            }, function (error) {
                notificationService.hideLoading();
                notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
            });
        }
    };

    $scope.takePicture = function() {
        $cordovaCamera.getPicture().then(function (imageData) {
            $scope.reportPicture = "data:image/jpeg;base64," + imageData;
        }, function (err) {
            // An error occured. Show a message to the user
        });
    };

    $scope.submitReportWithAdditionalInformation = function() {
        var promise = reportsService.createReport($scope.report);
        promise.then(function (reportId) {
			$scope.reportId = reportId; 
			var promise = unitsService.getUnit($scope.selectedUnitId); 
			promise.then(function(unit) {
				var notification = {
					Content: "has submitted a report", 
					TargetId: unit.AdministratorId, 
					Type: "ReportCreated", 
					ParameterId: $scope.reportId
				}
				var promise = notificationService.pushNotification(notification); 
				promise.then(function(response) {
					$scope.modal.hide();
					notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
				}, function(error) {
					$scope.modal.hide();
					notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
				});
			});
			
            if ($scope.customPropertyValues.length > 0) {
                angular.forEach($scope.customPropertyValues, function (customPropertyValue, customPropertyId) {
                    var promise = reportsService.addCustomPropertyValue(customPropertyValue, customPropertyId);
                    promise.then(function (response) {
                    }, function(error) {
						$scope.modal.hide();
                        notificationService.displayErrorPopup("There has been an error creating additional details!", "Ok");
                    });
                });
                if ($scope.reportPicture) {
                    
                } else {
                    $scope.modal.hide();
                    notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
                }
            } else {
				$scope.modal.hide();
                notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
            }
        }, function (error) {
            $scope.modal.hide();
            notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
        });
    };

    var loadCustomProperties = function (unitId) {
        notificationService.displayLoading("Loading reporting information...");
        var promise = unitsService.getCustomProperties(unitId);
        promise.then(function (customProperties) {
            $scope.customProperties = customProperties;
        }, function (error) {
            notificationService.displayErrorPopup("There has been an error fetching details!", "Ok");
        })
            .finally(function () {
                notificationService.hideLoading();
            });
    };

    var openSubmitWithAdditionalInformationDialog = function() {
        $ionicModal.fromTemplateUrl('submitReportWithAdditionalInformationModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
            loadCustomProperties($scope.report.UnitId);
        });
    };

    $scope.openSubmitDialog = function () {
        notificationService.displayChoicePopup("Do you want to fill additional information before submitting?", "No, submit", "Cancel", "Yes", openSubmitWithAdditionalInformationDialog, submitReportWithBasicInformation);
    };
    
    loadUnits();
}