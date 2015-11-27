app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: function () {
              if (ionic.Platform.isAndroid()) {
                  return "templates/tabs-android.html";
              }
              return "templates/tabs-ios.html";
          }
      })
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/home/home.html',
                    controller: 'homeController'
                }
            }
        })
        .state('tab.reports', {
            url: '/report/reports',
            views: {
                'tab-reports': {
                    templateUrl: 'templates/reports/reports.html',
                    controller: 'reportsController'
                }
            }
        })
        .state('tab.report-detail', {
            url: '/reports/:reportId',
            views: {
                'tab-report': {
                    templateUrl: 'templates/reports/report.html',
                    controller: 'reportController'
                }
            }
        })

    .state('account', {
        url: '/account/:userId',
        views: {
            'tab-account': {
                templateUrl: 'templates/account/account.html',
                controller: 'accountController'
            }
        }
    })
    .state('account.login', {
        url: '/account/login',
        views: {
            'tab-account-login': {
                templateUrl: 'templates/account/login.html',
                controller: 'loginController'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/home');
});