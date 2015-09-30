var app = angular.module('cb.controllers', []);

// Main app & menu controller
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

// News & announcements view
app.controller('newsCtrl', function ($scope) {


});

// View to set and view courses
app.controller('classCtrl', function ($scope, $localStorage) {
    $scope.$storage = $localStorage.$default({
        classes: {
            _1A: { subject: "None", room: "No Room" },
            _1B: { subject: "None", room: "No Room" },
            _1C: { subject: "None", room: "No Room" },
            _1D: { subject: "None", room: "No Room" },
            _2A: { subject: "None", room: "No Room" },
            _2B: { subject: "None", room: "No Room" },
            _2C: { subject: "None", room: "No Room" },
            _2D: { subject: "None", room: "No Room" },
        }
    });

    $scope.periods = {
        _1A: { name: "1A", day: 1, period: 1 },
        _1B: { name: "1B", day: 1, period: 2 },
        _1C: { name: "1C", day: 1, period: 3 },
        _1D: { name: "1D", day: 1, period: 4 },
        _2A: { name: "2A", day: 2, period: 1 },
        _2B: { name: "2B", day: 2, period: 2 },
        _2C: { name: "2C", day: 2, period: 3 },
        _2D: { name: "2D", day: 2, period: 4 },
    };


});


app.controller('newsItemCtrl', function ($scope, $stateParams) {
});
