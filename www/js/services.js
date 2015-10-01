var app = angular.module('cb.services', []);

//Google API get public calendar
var gapiCalendarGET = "https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9dul7c0nu4poqkgbhsfu0qe2t0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw";

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
            return $http.get(gapiCalendarGET, {
                params: {
                    timeMin: time.startOf('day').format(),
                    timeMax: time.endOf('day').format(),
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
            return
        },
        getClass: function (period) {
            return
        },
    }

})