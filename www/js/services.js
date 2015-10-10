var app = angular.module('cb.services', []);

//Google API get public calendar
var gapiCalendarMain = "https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9dul7c0nu4poqkgbhsfu0qe2t0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw";

// Service for calendar and events
app.factory('calendarService', function ($http) {
    return {

        //Parses event data to find the school cycle day
        getCycleDay: function (events) {
            for (var event in events) {
                if (events[event].summary.substring(0, 3) == "Day") {
                    return events[event].summary;
                }
            }
            return "No school"
        },

        //Sends GET request to google calendar to fetch events happening on specific day
        getDayEvents: function (time) {
            return $http.get(gapiCalendarMain, {
                params: {
                    timeMin: time.startOf('day').format(),
                    timeMax: time.endOf('day').format(),
                }
            })
        },

        //Gets events for days after certain start date
        getEvents: function (start, end) {
            return $http.get(gapiCalendarMain, {
                params: {
                    timeMin: start.startOf('day').format(),
                    timeMax: end.startOf('day').format(),
                    orderBy: "startTime",
                    singleEvents: true
                }
            })
        },

        //Get array of event objects from $http response
        parseEvents: function (data) {
            return angular.fromJson(data).data.items
        }
    }

});

// Service for class schedules
app.factory('classService', function () {

    return {
        getPeriod: function (time) {

            // times for each period
            var p1, p2, lunch, p3, p4;
            p1 = time.clone().hour(10).minute(31);
            p2 = time.clone().hour(11).minute(51);
            lunch = time.clone().hour(12).minute(36);
            p3 = time.clone().hour(13).minute(56);
            p4 = time.clone().hour(15).minute(16);

            //check if time is before the end of each period
            if (time.isBefore(p1, 'minute')) {
                return 1
            } else if (time.isBefore(p2, 'minute')) {
                return 2
            } else if (time.isBefore(lunch, 'minute')) {
                return 0
            } else if (time.isBefore(p3, 'minute')) {
                return 3
            } else if (time.isBefore(p4, 'minute')) {
                return 4
            } else {
                return 5
            }
        },
    }

})