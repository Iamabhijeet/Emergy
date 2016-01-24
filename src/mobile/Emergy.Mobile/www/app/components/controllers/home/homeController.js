﻿'use strict';

var controllerId = 'homeController';

app.controller(controllerId,
    ['$scope', '$state', '$q', '$rootScope', '$cordovaGeolocation', '$ionicModal', '$ionicActionSheet', 'notificationService', 'unitsService',
     'cameraService', 'reportsService', 'resourceService', 'authData', 'hub', 'signalR', 'connectionStatusService', homeController]);

function homeController($scope, $state, $q, $rootScope, $cordovaGeolocation, $ionicModal, $ionicActionSheet, notificationService, unitsService, cameraService, reportsService, resourceService, authData, hub, signalR, connectionStatusService) {
    $scope.isBusy = false;
    $scope.report = {};
    $scope.customPropertyValues = [];
    $scope.customPropertyValueIds = [];
    $scope.reportPicturesData = [];
    $scope.connectionStatus = "";
    $scope.reportDetails = {};
    $scope.report = {};

    $scope.unitAccess = {};
    $scope.unitAccess.Checkbox = "";
    $scope.publicUnitName = "";
    $scope.publicUnits = [];
    $scope.publicUnitId = "";
    $scope.publicUnitInformationReady = false;

    var posOptions = { timeout: 10000, enableHighAccuracy: false };
    $scope.changeAccess = function () {
        if ($scope.unitAccess.Checkbox === true) {
            $ionicModal.fromTemplateUrl('searchPublicUnits.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.publicUnits = [];
                $scope.publicUnitId = "";
                $scope.locations = [];
                $scope.categories = [];
                $scope.modalPublic = modal;
                $scope.modalPublic.show();
            });
        } else {
            $scope.publicUnitInformationReady = false;
            $scope.loadUnits();
        }
    }

    $scope.queryPublicUnits = function (queryString) {
        var promise = unitsService.queryPublicUnits(queryString);
        promise.then(function (publicUnits) {
            console.log("Test");
            $scope.publicUnits = publicUnits;
        });
    };

    $scope.selectPublicUnit = function (unitId) {
        notificationService.displayLoading("Loading unit information...");
        $scope.publicUnitId = unitId;
        $scope.selectedUnitId = unitId;
        var promise = unitsService.getUnit(unitId);
        promise.then(function (unit) {
            $scope.publicUnitName = unit.Name;
            var promise = unitsService.getLocations(unitId);
            promise.then(function (locations) {
                if (locations.length) {
                    $scope.locations = locations;
                    $scope.report.LocationId = $scope.locations[0].Id;
                } else {
                    $scope.reportDetails.useCurrentLocation = true;
                }
                var promise = unitsService.getCategories(unitId);
                promise.then(function (categories) {
                    if (categories.length) {
                        categories.reverse();
                        $scope.categories = categories;
                        $scope.report.CategoryId = $scope.categories[0].Id;
                    }
                    $scope.modalPublic.hide();
                    notificationService.hideLoading();
                    $scope.publicUnitInformationReady = true;
                }, function () {
                    notificationService.hideLoading();
                    modalPublic.hide();
                    unitAccess.Checkbox = false;
                    notificationService.displayErrorPopup("There has been an error fetching category information.", "Ok");
                });
            }, function () {
                notificationService.hideLoading();
                modalPublic.hide();
                unitAccess.Checkbox = false;
                notificationService.displayErrorPopup("There has been an error fetching location information.", "Ok");
            });
        }, function () {
            notificationService.hideLoading();
            modalPublic.hide();
            unitAccess.Checkbox = false;
            notificationService.displayErrorPopup("There has been an error selecting public unit.", "Ok");
        });
    };


    $scope.openQueryUnitsDialog = function () {
        $ionicModal.fromTemplateUrl('searchPublicUnits.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.publicUnitInformationReady = false;
            $scope.publicUnits = [];
            $scope.publicUnitId = '';
            $scope.locations = [];
            $scope.categories = [];
            $scope.modalPublic = modal;
            $scope.modalPublic.show();
        });
    }

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessWithActionPopup("You have received a new message!", "VIEW", function () { $state.go("tab.messages", { senderId: notification.SenderId }); });
            }
            else if (notification.Type === "ReportUpdated") {
                notificationService.displaySuccessWithActionPopup("Report that you submitted had its status changed to " + notification.Content + "!", "VIEW", function () { $state.go("tab.reports"); });
            }
            else if (notification.Type === "AssignedForReport") {
                notificationService.displaySuccessWithActionPopup("Administrator has assigned you to resolve a report!", "View", function () { $state.go("tab.assignments"); });
            }
        });
    });

    if (signalR.isConnecting) {
        $scope.connectionStatus = "connecting";
    }

    if (signalR.isConnected) {
        $scope.connectionStatus = "connected";
    }

    $rootScope.$on(signalR.events.realTimeConnected, function () {
        $scope.connectionStatus = "connected";
    });

    $rootScope.$on(signalR.events.connectionStateChanged, function (event, state) {
        $scope.connectionStatus = state;
    });

    $scope.openSettings = function () {
        connectionStatusService.displayConnectionStatusMenu($scope.connectionStatus);
    };

    $scope.openAssignments = function () {
        $state.go("tab.assignments");
    };

    $scope.takePicture = function () {
        cameraService.takePhotoFromCamera()
            .then(function (base64) { $scope.reportPicturesData.push("data:image/jpeg;base64," + base64); },
                function () {
                    notificationService.displayErrorPopup("There has been an error while processing the image!", "Ok");
                });
    };

    $scope.loadUnits = function () {
        notificationService.displayLoading("Loading reporting information...");
        $scope.isBusy = true;
        var promise = unitsService.getUnits();
        promise.then(function (units) {
            $scope.units = units;
            if (units.length > 0) {
                $scope.selectedUnitId = units[0].Id;
                $scope.loadBasicProperties($scope.selectedUnitId);
            }
        }, function () {
            notificationService.displayErrorPopup("There has been an error fetching unit information.", "Ok");
        });
    };
    $scope.loadBasicProperties = function (unitId) {
        notificationService.displayLoading("Loading reporting information...");
        $scope.isBusy = true;
        $scope.selectedUnitId = unitId;
        var promise = unitsService.getLocations(unitId);
        promise.then(function (locations) {
            if (locations.length) {
                $scope.locations = locations;
                $scope.report.LocationId = $scope.locations[0].Id;
            } else {
                $scope.reportDetails.useCurrentLocation = true;
            }
        }, function () {
            notificationService.displayErrorPopup("There has been an error fetching location information.", "Ok");
        });

        promise = unitsService.getCategories(unitId);
        promise.then(function (categories) {
            if (categories.length) {
                categories.reverse();
                $scope.categories = categories;
                $scope.report.CategoryId = $scope.categories[0].Id;
            }
        }, function () {
            notificationService.displayErrorPopup("There has been an error fetching category information.", "Ok");
        })
            .finally(function () {
                notificationService.hideLoading();
                $scope.isBusy = false;
            });
    };

    var submitReportWithBasicInformation = function () {
        console.log($scope.report);
        if ($scope.reportDetails.useCurrentLocation) {
            notificationService.displayLoading("Submitting report...");
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
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
                        if ($scope.locations.length) {
                            $scope.report.LocationId = $scope.locations[0].Id;
                        } 
                        var promise = unitsService.getUnit($scope.selectedUnitId);
                        promise.then(function (unit) {
                            var notification = {
                                Content: "has submitted a report",
                                TargetId: unit.AdministratorId,
                                Type: "ReportCreated",
                                ParameterId: $scope.reportId
                            }
                            var promise = notificationService.pushNotification(notification);
                            promise.then(function (notificationId) {
                                notificationService.hideLoading();
                                notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
                                try {
                                    hub.server.sendNotification(notificationId);
                                }
                                catch (err) {
                                    notificationService.displayErrorPopup("There has been an error pushing a notification!" + err, "Ok");
                                }

                            }, function () {
                                notificationService.hideLoading();
                                notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
                            });
                        }, function () {
                            notificationService.hideLoading();
                            notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
                        });

                    }, function () {
                        notificationService.hideLoading();
                        notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
                    });
                }, function () {
                    notificationService.hideLoading();
                    notificationService.displayErrorPopup("There has been an error creating your location!", "Ok");
                });
            }, function () {
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
                promise.then(function (unit) {
                    var notification = {
                        Content: "has submitted a report",
                        TargetId: unit.AdministratorId,
                        Type: "ReportCreated",
                        ParameterId: $scope.reportId
                    }
                    console.log(notification);
                    var promise = notificationService.pushNotification(notification);
                    promise.then(function (notificationId) {
                        notificationService.hideLoading();
                        notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
                        try {
                            hub.server.sendNotification(notificationId);
                        }
                        catch (err) {
                            notificationService.displayErrorPopup("There has been an error pushing a notification!" + err, "Ok");
                        }
                    }, function () {
                        notificationService.hideLoading();
                        notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
                    });
                }, function () {
                    notificationService.hideLoading();
                    notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
                });
            }, function () {
                notificationService.hideLoading();
                notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
            });
        }
    };
    $scope.submitReportWithAdditionalInformation = function () {
        if ($scope.reportDetails.useCurrentLocation) {
            notificationService.displayLoading("Submitting report...");
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;

                var location = {
                    Latitude: $scope.latitude,
                    Longitude: $scope.longitude,
                    Name: "Captured location",
                    Type: "Captured"
                };

                var promise = unitsService.createLocation(location);
                promise.then(function (locationId) {
                    $scope.report.LocationId = locationId;

                    var promise = reportsService.createReport($scope.report);
                    promise.then(function (reportId) {
                        $scope.reportId = reportId;
                        if ($scope.locations.length) {
                            $scope.report.LocationId = $scope.locations[0].Id;
                        }
                        
                        var promise = unitsService.getUnit($scope.selectedUnitId);
                        promise.then(function (unit) {
                            var notification = {
                                Content: "has submitted a report",
                                TargetId: unit.AdministratorId,
                                Type: "ReportCreated",
                                ParameterId: $scope.reportId
                            }
                            var promise = notificationService.pushNotification(notification);
                            promise.then(function (notificationId) {
                                $q.when(signalR.events.realTimeConnected, function () {
                                    hub.server.sendNotification(notificationId);
                                });
                                notificationService.hideLoading();
                                $scope.modal.hide();
                                notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
                            }, function () {
                                notificationService.hideLoading();
                                $scope.modal.hide();
                                $scope.report.LocationId = $scope.locations[0].Id;
                                notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
                            });
                        });

                        if ($scope.customPropertyValues.length > 0) {
                            angular.forEach($scope.customPropertyValues, function (customPropertyValue, customPropertyId) {
                                var promise = reportsService.addCustomPropertyValue(customPropertyValue, customPropertyId);
                                promise.then(function (customPropertyId) {
                                    var promise = reportsService.setCustomProperties($scope.reportId, [customPropertyId]);
                                    promise.then(function () {
                                    }, function (eror) {

                                    });
                                }, function () {
                                });
                            });

                        }

                        if ($scope.reportPicturesData) {
                            angular.forEach($scope.reportPicturesData, function (reportPictureData, key) {
                                var imageModel = {
                                    Name: $scope.reportId + "_" + key,
                                    Base64: reportPictureData,
                                    ContentType: "image/jpeg"
                                }

                                var promise = resourceService.uploadBlob(imageModel);
                                promise.then(function (resourceId) {
                                    var promise = reportsService.setResources($scope.reportId, [resourceId]);
                                    promise.then(function (response) {
                                        
                                    }, function (error) {

                                    });
                                }, function (error) {

                                });
                            });
                        }
                    }, function (error) {
                        notificationService.hideLoading();
                        $scope.modal.hide();
                        notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
                    });
                }, function (error) {
                    notificationService.hideLoading();
                    $scope.modal.hide();
                    notificationService.displayErrorPopup("There has been an error creating your location!", "Ok");
                });
            }, function (error) {
                notificationService.hideLoading();
                $scope.modal.hide();
                notificationService.displayErrorPopup("There has been an error acquiring your location!", "Ok");
            });
        } else {
            notificationService.displayLoading("Submitting report...");
            var promise = reportsService.createReport($scope.report);
            promise.then(function (reportId) {
                $scope.reportId = reportId;

                var promise = unitsService.getUnit($scope.selectedUnitId);
                promise.then(function (unit) {
                    var notification = {
                        Content: "has submitted a report",
                        TargetId: unit.AdministratorId,
                        Type: "ReportCreated",
                        ParameterId: $scope.reportId
                    };

                    var promise = notificationService.pushNotification(notification);
                    promise.then(function (notificationId) {
                        try {
                            hub.server.sendNotification(notificationId);
                        }
                        catch (err) {
                            notificationService.displayErrorPopup("There has been an error pushing a notification!" + err, "Ok");
                        }
                        notificationService.hideLoading();
                        $scope.modal.hide();
                        notificationService.displaySuccessPopup("Report has been successfully submitted!", "Ok");
                    }, function () {
                        notificationService.hideLoading();
                        $scope.modal.hide();
                        notificationService.displayErrorPopup("There has been an error notifying administrator!", "Ok");
                    });

                    if ($scope.customPropertyValues.length > 0) {
                        angular.forEach($scope.customPropertyValues, function (customPropertyValue, customPropertyId) {
                            var promise = reportsService.addCustomPropertyValue(customPropertyValue, customPropertyId);
                            promise.then(function (customPropertyId) {
                                var promise = reportsService.setCustomProperties($scope.reportId, [customPropertyId]);
                                promise.then(function (response) {

                                }, function (error) {

                                });
                            }, function (error) {
                            });
                        });
                    }

                    if ($scope.reportPicturesData) {
                        angular.forEach($scope.reportPicturesData, function (reportPictureData, key) {
                            var imageModel = {
                                Name: $scope.reportId + "_" + key,
                                Base64: reportPictureData,
                                ContentType: "image/jpeg"
                            }

                            var promise = resourceService.uploadBlob(imageModel);
                            promise.then(function (resourceId) {
                                var promise = reportsService.setResources($scope.reportId, [resourceId]);
                                promise.then(function (response) {

                                }, function (error) {

                                });
                            }, function (error) {

                            });
                        });
                    }
                }, function (error) {
                    notificationService.hideLoading();
                    $scope.modal.hide();
                    notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
                });
            }, function (error) {
                notificationService.hideLoading();
                $scope.modal.hide();
                notificationService.displayErrorPopup("There has been an error submitting a report!", "Ok");
            });
        }
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
    var openSubmitWithAdditionalInformationDialog = function () {
        $ionicModal.fromTemplateUrl('submitReportWithAdditionalInformationModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.report.Description = "";
            $scope.reportPicturesData = [];
            $scope.customProperties = [];
            $scope.customPropertyValues = [];
            $scope.modal = modal;
            $scope.modal.show();
            loadCustomProperties($scope.selectedUnitId);
        });
    };
    $scope.openSubmitDialog = function () {
        notificationService.displayChoicePopup("Do you want to fill additional information before submitting?", "No, submit", "Cancel", "Yes", openSubmitWithAdditionalInformationDialog, submitReportWithBasicInformation);
    };

    $scope.loadUnits();
}