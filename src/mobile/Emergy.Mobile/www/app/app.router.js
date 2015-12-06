app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: function () {
              if (ionic.Platform.isAndroid()) {
                  return "app/views/tabsAndroid/tabsAndroid.html";
              }
              return "app/views/tabsIos/tabsIos.html";
          }
      })
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'app/views/home/home.html',
                    controller: 'homeController'
                }
            }
        })
        .state('tab.reports', {
            url: '/reports',
            views: {
                'tab-reports': {
                    templateUrl: 'app/views/reports/reports.html',
                    controller: 'reportsController'
                }
            }
        })
        .state('tab.report-details', {
            url: '/report/:reportId',
            views: {
                'tab-report-details': {
                    templateUrl: 'app/views/reportDetails/reportDetails.html',
                    controller: 'reportController'
                }
            }
        })

    .state('profile', {
        url: '/profile/:userId',
        views: {
            'tab-profile': {
                templateUrl: 'app/views/profile/profile.html',
                controller: 'profileController'
            }
        }
    })
    .state('tab.login', {
        url: '/login',
        views: {
            'tab-login': {
                templateUrl: 'app/views/login/login.html',
                controller: 'loginController'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/home');
});