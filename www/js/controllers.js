var app = angular.module('cb.controllers', []);

// Main app & menu controller
app.controller('menuCtrl', function ($scope, $ionicHistory, $interval, $localStorage, calendarService, classService) {

    $scope.views = [
        { name: "News", ref: "news", icon: "ion-android-notifications" },
        { name: "Classes", ref: "classes", icon: "ion-university" },
        { name: "CougarVision", ref: "cougarvision", icon: "ion-ios-videocam" },
        { name: "Calendar", ref: "calendar", icon: "ion-android-calendar" },
    ];

    // Display current day in cycle as menu header
    $scope.cycleDay = "";

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

    // Class periods
    $scope.currentPeriod = "Period -";
    $scope.currentClass = "N/A";

    $interval(function () {
        if ($scope.cycleDay !== "" && $scope.cycleDay !== "No school") {
            var period = classService.getPeriod(moment());
            console.log(period)
            if (period == 0) {
                $scope.currentPeriod = "Lunch";
                $scope.currentClass = "N/A";
            } else if (period == 5) {
                $scope.currentPeriod = "After school";
            } else {
                if ($scope.cycleDay == "Day 1" || $scope.cycleDay == "Day 3") {
                    $scope.currentPeriod = "Period " + period;
                    $scope.currentClass = $localStorage.classes[period - 1].subject;
                } else {
                    $scope.currentPeriod = "Period " + period;
                    $scope.currentClass = $localStorage.classes[period + 3].subject;
                }
            }
            classService.getPeriod(moment())
        }
        
    }, 1000);

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
app.controller('classCtrl', function ($scope, $localStorage, $ionicModal) {

    $scope.$storage = $localStorage.$default({
        classes: [
            { name: "1A", day: 1, period: 1, subject: "None", code: "No class", room: "" },
            { name: "1B", day: 1, period: 2, subject: "None", code: "No class", room: "" },
            { name: "1C", day: 1, period: 3, subject: "None", code: "No class", room: "" },
            { name: "1D", day: 1, period: 4, subject: "None", code: "No class", room: "" },
            { name: "2A", day: 2, period: 1, subject: "None", code: "No class", room: "" },
            { name: "2B", day: 2, period: 2, subject: "None", code: "No class", room: "" },
            { name: "2C", day: 2, period: 3, subject: "None", code: "No class", room: "" },
            { name: "2D", day: 2, period: 4, subject: "None", code: "No class", room: "" },
        ]
    });

    // Class edit modal
    $ionicModal.fromTemplateUrl('classModal.html', function (modal) {
        $scope.modalCtrl = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up',
        focusFirstInput: true
    });

    $scope.classModal = function (obj) {
        $scope.modalCtrl.class = obj;
        $scope.modalCtrl.show();
    };

});

// Modal to edit class list
app.controller('classModalCtrl', function ($scope) {

    $scope.hideModal = function (selected) {
        $scope.modalCtrl.hide();
    };

    $scope.hideModalAction = function (selected) {
        $scope.modalCtrl.hide();
        $scope.modalCtrl.class.subject = $scope.modalCtrl.temp.subject
        $scope.modalCtrl.class.code = $scope.modalCtrl.temp.code
        $scope.modalCtrl.class.room = $scope.modalCtrl.temp.room
        $scope.modalCtrl.temp = {};
    };

});


app.controller('newsItemCtrl', function ($scope, $stateParams) {
});
    