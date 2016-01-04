var app = angular.module('cb.controllers', []);

var fireRef = new Firebase("https://cbapp.firebaseio.com");

// Main app & menu controller
app.controller('menuCtrl', function ($scope, $ionicHistory, $interval, $localStorage, $ionicModal, calendarService, classService) {

    $scope.views = [
        { name: "News", ref: "news", icon: "ion-android-notifications" },
        { name: "Classes", ref: "classes", icon: "ion-university" },
        { name: "CougarVision", ref: "cougarvision", icon: "ion-ios-videocam" },
        { name: "Calendar", ref: "calendar", icon: "ion-android-calendar" },
    ];

    $scope.$storage = $localStorage;
    // Display current day in cycle as menu header

    calendarService.getDayEvents(moment().add(0, "days")).then(function (response) {
        var events = calendarService.parseEvents(response);
        $scope.$storage.cycleDay = calendarService.getCycleDay(events);
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
        if ($scope.$storage.cycleDay) {
            if ($scope.$storage.cycleDay !== "" && $scope.$storage.cycleDay !== "No school") {
                var period = classService.getPeriod(moment(), $scope.$storage.cycleDay);
                if (period.p == 0) {
                    $scope.currentPeriod = "Lunch";
                    $scope.currentClass = "N/A";
                } else if (period.p == 5) {
                    $scope.currentPeriod = "After school";
                } else {
                    //Get current period and class
                    if ($scope.$storage.cycleDay == "Day 1" || $scope.$storage.cycleDay == "Day 3") {
                        $scope.currentPeriod = "Period " + period.p;
                        $scope.currentClass = $scope.$storage.classes[period.c - 1].subject;
                    } else {
                        $scope.currentPeriod = "Period " + period.p;
                        $scope.currentClass = $scope.$storage.classes[period.c + 3].subject;
                    }
                }
            }
        }
    }, 4200);

    // Settings opens a modal
    $ionicModal.fromTemplateUrl('settingsModal.html', function (modal) {
        $scope.modalCtrl = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-right',
        focusFirstInput: true
    });

    $scope.settingsModal = function () {
        $scope.modalCtrl.show();
    };

});

// Settings view
app.controller('settingsModalCtrl', function ($scope) {

    $scope.hideModal = function () {
        $scope.modalCtrl.hide();
    };

});

// Cougarvision view
app.controller('cvCtrl', function ($scope, $rootScope, $ionicPopover, $ionicModal) {

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
        { day: "Monday", date: "Sep 15", views: 420, ref: "http://colonelby.com/mon.mov", bg: "bg-mon" },
        { day: "Tuesday", date: "Sep 16", views: 312, ref: "http://colonelby.com/sportsdesk.mov", bg: "bg-tue" },
        { day: "Wednesday", date: "Sep 17", views: 629, ref: "http://colonelby.com/wed.mov", bg: "bg-wed" },
        { day: "Thursday", date: "Sep 18", views: 711, ref: "http://colonelby.com/thurs.mov", bg: "bg-thu" },
        { day: "Friday", date: "Sep 19", views: 251, ref: "http://colonelby.com/fri.mov", bg: "bg-fri" },
    ];

    $scope.playVideo = function (videoUrl) {

        // Play a video with callbacks
        var options = {
            successCallback: function () {
                console.log("Video was closed without error.");
            },
            errorCallback: function (errMsg) {
                console.log("Error! " + errMsg);
            }
        };
        window.plugins.streamingMedia.playVideo(videoUrl, options);
    }

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
app.controller('newsCtrl', function ($scope, $http, $sce, $firebaseObject, $ionicNavBarDelegate) {

    // Change title based on tab
    $scope.title = "Announcements";

    $ionicNavBarDelegate.align();

    $scope.changeTitle = function (title) {
        $scope.title = title;
        $ionicNavBarDelegate.align();
    }

    $scope.announcements = $firebaseObject(fireRef.child('announcements'));

    $scope.moment = {
        parseWeekday: function (stamp) {
            //return moment(stamp, 'x').format('dddd')
            return moment(stamp, 'x').calendar(null, {
                sameDay: '[Today]',
                nextDay: '[Tomorrow]',
                nextWeek: 'dddd',
                lastDay: '[Yesterday]',
                lastWeek: '[Last] dddd',
                sameElse: 'DD/MM/YYYY'
            });
        },
        parseDate: function (stamp) {
            return moment(stamp, 'x').format('MMM Do YYYY')
        }
    }

    // TWITTER 

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

// Calendar and events control
app.controller('calendarCtrl', function ($scope, $localStorage, $ionicPopover, calendarService) {

    $scope.$storage = $localStorage;

    $scope.parseMoment = function (time, format) {
        return moment(time).format(format)
    }

    // Main method to generate calendar object
    var parseCalendar = function (response) {
        $scope.$storage.calendar = {};

        var events = calendarService.parseEvents(response);

        for (i in events) {
            if (events[i].start.date) {
                if (!$scope.$storage.calendar[events[i].start.date]) {
                    var obj = {};
                    obj[events[i].start.date] = [];
                    $scope.$storage.calendar[events[i].start.date] = obj;
                }
                $scope.$storage.calendar[events[i].start.date][events[i].start.date].push({ wholeDay: true, summary: events[i].summary });
            } else if (events[i].start.dateTime) {
                var date = moment(events[i].start.dateTime).format("YYYY-MM-DD");
                if (!$scope.$storage.calendar[date]) {
                    var obj = {};
                    obj[date] = [];
                    $scope.$storage.calendar[date] = obj;
                }
                $scope.$storage.calendar[date][date].push({ wholeDay: false, summary: events[i].summary, time: moment(events[i].start.dateTime).format("h:mm a") });
            }
        }
    }

    calendarService.getEvents(moment(), moment().add(1, 'month'), 1).then(parseCalendar);

    // Manage menu for switching school calendars
    $ionicPopover.fromTemplateUrl('templates/calendarmenu.html', {
        scope: $scope,
    }).then(function (calendarmenu) {
        $scope.calendarmenu = calendarmenu;
    });

    $scope.setCalendar = function (type) {
        calendarService.getEvents(moment(), moment().add(1, 'month'), type).then(parseCalendar);
        $scope.calendarmenu.hide();
    }

});

app.controller('newsItemCtrl', function ($scope, $stateParams) {
});
