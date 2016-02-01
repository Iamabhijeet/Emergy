'use strict';

var controllerId = 'reportsController';

app.controller(controllerId,
    ['$scope', '$state', '$rootScope', 'authService', 'notificationService', 'reportsService', 'connectionStatusService', 'hub', 'signalR', reportsController]);

function reportsController($scope, $state, $rootScope, authService, notificationService, reportsService, connectionStatusService, hub, signalR) {
    $scope.reports = [];
    $scope.isLoading = true;
    $scope.connectionStatus = "";

    $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
        $scope.notificationAvailable = true;
        var promise = notificationService.getNotification(response);
        promise.then(function (notification) {
            if (notification.Type === "MessageArrived") {
                notificationService.displaySuccessWithActionPopup("You have received a new message!", "VIEW", function () { $state.go("tab.messages", { senderId: notification.SenderId }); });
            }
            else if (notification.Type === "ReportUpdated") {
                loadReports(); 
                notificationService.displaySuccessPopup("Report that you submitted had its status changed to " + notification.Content + "!", "OK");
            }
            else if (notification.Type === "AssignedForReport") {
                notificationService.displaySuccessWithActionPopup("Administrator has assigned you to resolve a report!", "VIEW", function () { $state.go("tab.assignments"); });
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

    var loadReports = function () {
        notificationService.displayLoading("Loading reports...");
        var promise = reportsService.getReports();
        promise.then(function(reports) {
            $scope.reports = reports;
        }, function() {
            notificationService.displayErrorPopup("There has been an error loading reports.", "OK");
        }).finally(function () {
            notificationService.hideLoading();
            $scope.isLoading = false;
        });
    };

    loadReports();
}