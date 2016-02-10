(function () {
    'use strict';

    app.controller('statsController', stats);
    stats.$inject = ['vm', 'statsService', '$rootScope', 'notificationService', 'signalR', 'reportsService', 'ngDialog'];

    function stats($scope, statsService, $rootScope, notificationService, signalR, reportsService, ngDialog) {
        var vm = this;
        $rootScope.title = 'Statistics | Emergy';

        $rootScope.$on(signalR.events.client.pushNotification, function (event, response) {
            vm.notificationAvailable = true;
            var promise = notificationService.getNotification(response);
            promise.then(function (notification) {
                if (notification.Type === "ReportCreated") {
                    var promise = reportsService.getReport(notification.ParameterId);
                    promise.then(function (report) {
                        activate();
                        $scope.arrivedReport = {};
                        $scope.arrivedReport = report;
                        $scope.reportMarker = {
                            latitude: report.Location.Latitude,
                            longitude: report.Location.Longitude
                        }
                        $scope.map = {
                            control: {},
                            options: { draggable: false, scrollwheel: false },
                            center: { latitude: report.Location.Latitude, longitude: report.Location.Longitude },
                            zoom: 12,
                            styles: [{ 'featureType': 'landscape.natural', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'on' }, { 'color': '#e0efef' }] }, { 'featureType': 'poi', 'elementType': 'geometry.fill', 'stylers': [{ 'visibility': 'off' }, { 'hue': '#1900ff' }, { 'color': '#c0e8e8' }] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [{ 'lightness': 100 }, { 'visibility': 'simplified' }] }, { 'featureType': 'road', 'elementType': 'labels', 'stylers': [{ 'visibility': 'on' }] }, { 'featureType': 'transit.line', 'elementType': 'geometry', 'stylers': [{ 'visibility': 'on' }, { 'lightness': 700 }] }, { 'featureType': 'water', 'elementType': 'all', 'stylers': [{ 'color': '#00ACC1' }] }]
                        };
                        ngDialog.close();
                        document.getElementById("notificationSound").play();
                        ngDialog.open({
                            template: "reportCreatedModal",
                            disableAnimation: true,
                            scope: $scope
                        });
                    }, function (error) {
                        notificationService.pushError("Error has happened while loading notification.");
                    });
                }
                else if (notification.Type === "MessageArrived") {
                    document.getElementById("notificationSound").play();
                    notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has sent you a message!</p> <a href="/messages/' + String(notification.SenderId) + '">View</a>');
                }
                else if (notification.Type === "ReportUpdated" && notification.Content.length > 11) {
                    activate(); 
                    document.getElementById("notificationSound").play();
                    notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has updated current location!</p> <a href="/report/' + String(notification.ParameterId) + '">View</a>');
                }
                else if (notification.Type === "ReportUpdated" && notification.Content.length < 11) {
                    activate();
                    document.getElementById("notificationSound").play();
                    notificationService.pushSuccess('<p><span>' + String(notification.Sender.UserName) + '</span> has changed a report status to ' + String(notification.Content) + '!</p> <a href="/report/' + String(notification.ParameterId) + '">View</a>');
                }
            });
        });


        function buildChart() {
            var chartModel = vm.stats.ReportsChart;
            vm.chartSeries = ['Reports Count', 'Reports Completed'];
            vm.chartLabels = [];
            vm.chartData = [
              [],
              []
            ];
            for (var i = 3; i > -1; i--) {
                vm.chartLabels.push(chartModel[i].Month);
                vm.chartData[0].push(chartModel[i].ReportsCount);
                vm.chartData[1].push(chartModel[i].CompletedReportsCount);
            }
        }
        function activate() {
            statsService.getStats().then(function (stats) {
                vm.stats = stats;
                buildChart();
            });
        }

        activate();
    }
})();
