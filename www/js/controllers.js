var app = angular.module('cb.controllers', []);

// Cougarvision view
app.controller('cvCtrl', function ($scope, $rootScope, $ionicPopover, $ionicModal) {

    $scope.days = [
    { name: "Monday" },
    { name: "Tuesday" },
    { name: "Wednesday" },
    { name: "Thursday" },
    { name: "Friday" },
    ];

    $scope.filterDays = [
    { name: "All episodes", filter: "", selected: true },
    { name: "Monday show", filter: "Monday", selected: false },
    { name: "Tuesday show", filter: "Tuesday", selected: false },
    { name: "Wednesday show", filter: "Wednesday", selected: false },
    { name: "Thursday show", filter: "Thursday", selected: false },
    { name: "Friday show", filter: "Friday", selected: false },
    ];

    $scope.filter = {
        selected: $scope.filterDays[0]
    };

    $scope.episodes = [
        { day: "Monday", date: "Sep 15", views: 420 },
        { day: "Tuesday", date: "Sep 16", views: 312 },
        { day: "Wednesday", date: "Sep 17", views: 629 },
        { day: "Thursday", date: "Sep 18", views: 711 },
        { day: "Friday", date: "Sep 19", views: 251 },
    ];

    $ionicModal.fromTemplateUrl('cvFilterModal.html', function (modal) {
        $scope.modalCtrl = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.filterModal = function () {
        $scope.modalCtrl.show();
    };

});

// Cougarvision view modal to filter episodes by day
app.controller('filterModalCtrl', function ($scope) {

    $scope.hideModal = function (selected) {
        $scope.modalCtrl.hide();
    };

    $scope.hideModalAction = function (selected) {
        $scope.modalCtrl.hide();
        $scope.filter.selected = selected
    };

});

app.controller('newsCtrl', function ($scope) {


});

app.controller('menuCtrl', function ($scope, $ionicHistory, calendarService) {

    $scope.views = [
        { name: "News", ref: "news", icon: "ion-android-notifications" },
        { name: "Classes", ref: "classes", icon: "ion-university" },
        { name: "CougarVision", ref: "cougarvision", icon: "ion-ios-videocam" },
        { name: "Calendar", ref: "calendar", icon: "ion-android-calendar" },
    ];

    // Display current day in cycle as menu header
    $scope.cycleDay = {};

    calendarService.getDayEvents(moment().add(0, "days")).then(function (response) {
        var events = calendarService.parseEvents(response);
        $scope.cycleDay = calendarService.getCycleDay(events);
    });

    // Highlight current view in menu
    $scope.isViewSelected = function (name) {
        if ($ionicHistory.currentStateName() == 'app.' + name) {
            return true
        } else {
            return false
        }
    };

});

app.controller('newsItemCtrl', function ($scope, $stateParams) {
});
