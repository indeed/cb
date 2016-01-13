//Google API get public calendar
var gapiCalendarMain = "https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_9dul7c0nu4poqkgbhsfu0qe2t0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw";
var gapiCalendarAthletics = "https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_cmipkc2crgaprhaj683kll566k@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw";
var gapiCalendarStudco = "https://www.googleapis.com/calendar/v3/calendars/ocdsb.ca_lavjjef25v724l1l932e1rk2o0@group.calendar.google.com/events?key=AIzaSyB4JbJ8B3jPBr-uwqLkF6p-qD7lzBIadgw";

angular.module('cb.services', [])

// Service for calendar and events
.factory('calendarService', function ($http) {

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
        getEvents: function (start, end, type) {

            var gapi;

            switch(type) {
                case 1:
                    gapi = gapiCalendarMain;
                    break;
                case 2:
                    gapi = gapiCalendarAthletics;
                    break;
                case 3:
                    gapi = gapiCalendarStudco;
                    break;
            }

            return $http.get(gapi, {
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

})

// Service for class schedules
.factory('classService', function () {

    return {
        getPeriod: function (time, day) {

            // times for each period
            var p1, p2, lunch, p3, p4;
            p1 = time.clone().hour(10).minute(31);
            p2 = time.clone().hour(11).minute(51);
            lunch = time.clone().hour(12).minute(36);
            p3 = time.clone().hour(13).minute(56);
            p4 = time.clone().hour(15).minute(16);

            //check if time is before the end of each period
            if (day == "Day 1" || day == "Day 2") {
                if (time.isBefore(p1, 'minute')) {
                    return {p: 1, c: 1}
                } else if (time.isBefore(p2, 'minute')) {
                    return { p: 2, c: 2}
                } else if (time.isBefore(lunch, 'minute')) {
                    return { p: 0, c: 0 }
                } else if (time.isBefore(p3, 'minute')) {
                    return { p: 3, c: 3 }
                } else if (time.isBefore(p4, 'minute')) {
                    return { p: 4, c: 4 }
                } else {
                    return { p: 5, c: 0 }
                }
            } else {
                if (time.isBefore(p1, 'minute')) {
                    return { p: 1, c: 2 }
                } else if (time.isBefore(p2, 'minute')) {
                    return { p: 2, c: 1 }
                } else if (time.isBefore(lunch, 'minute')) {
                    return { p: 0, c: 0 }
                } else if (time.isBefore(p3, 'minute')) {
                    return { p: 3, c: 4 }
                } else if (time.isBefore(p4, 'minute')) {
                    return { p: 4, c: 3 }
                } else {
                    return { p: 5, c: 0 }
                }
            }
        },
    }
})


.factory('Base64', function(){
    var self = this;
    self.encode = function (input) {
        // Converts each character in the input to its Unicode number, then writes
        // out the Unicode numbers in binary, one after another, into a string.
        // This string is then split up at every 6th character, these substrings
        // are then converted back into binary integers and are used to subscript
        // the "swaps" array.
        // Since this would create HUGE strings of 1s and 0s, the distinct steps
        // above are actually interleaved in the code below (ie. the long binary
        // string, called "input_binary", gets processed while it is still being
        // created, so that it never gets too big (in fact, it stays under 13
        // characters long no matter what).

        // The indices of this array provide the map from numbers to base 64
        var swaps = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
        var input_binary = "";      // The input string, converted to Unicode numbers and written out in binary
        var output = "";        // The base 64 output
        var temp_binary;        // Used to ensure the binary numbers have 8 bits
        var index;      // Loop variable, for looping through input
        for (index=0; index < input.length; index++){
            // Turn the next character of input into astring of 8-bit binary
            temp_binary = input.charCodeAt(index).toString(2);
            while (temp_binary.length < 8){
                temp_binary = "0"+temp_binary;
            }
            // Stick this string on the end of the previous 8-bit binary strings to
            // get one big concatenated binary representation
            input_binary = input_binary + temp_binary;
            // Remove all 6-bit sequences from the start of the concatenated binary
            // string, convert them to a base 64 character and append to output.
            // Doing this here prevents input_binary from getting massive
            while (input_binary.length >= 6){
                output = output + swaps[parseInt(input_binary.substring(0,6),2)];
                input_binary = input_binary.substring(6);
            }
        }
        // Handle any necessary padding
        if (input_binary.length == 4){
            temp_binary = input_binary + "00";
            output = output + swaps[parseInt(temp_binary,2)];
            output = output + "=";
        }
        if (input_binary.length == 2){
            temp_binary = input_binary + "0000";
            output = output + swaps[parseInt(temp_binary,2)];
            output = output + "==";
        }
        // Output now contains the input in base 64
        return output;
    };

    self.decode = function (input) {
        // Takes a base 64 encoded string "input", strips any "=" or "==" padding
        // off it and converts its base 64 numerals into regular integers (using a
        // string as a lookup table). These are then written out as 6-bit binary
        // numbers and concatenated together. The result is split into 8-bit
        // sequences and these are converted to string characters, which are
        // concatenated and output.
        input = input.replace("=","");      // Padding characters are redundant
        // The index/character relationship in the following string acts as a
        // lookup table to convert from base 64 numerals to Javascript integers
        var swaps = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output_binary = "";
        var output = "";
        var temp_bin = "";
        var index;
        for (index=0; index < input.length; index++) {
            temp_bin = swaps.indexOf(input.charAt(index)).toString(2);
            while (temp_bin.length < 6) {
                // Add significant zeroes
                temp_bin = "0"+temp_bin;
            }
            while (temp_bin.length > 6) {
                // Remove significant bits
                temp_bin = temp_bin.substring(1);
            }
            output_binary = output_binary + temp_bin;
            while (output_binary.length >= 8) {
                output = output + String.fromCharCode(parseInt(output_binary.substring(0,8),2));
                output_binary = output_binary.substring(8);
            }
        }
        return output;
    };
    
    return self;
})

.factory('TwitterREST', function($http, $q, Base64){

    var self = this;
    var authorization = null;
    var consumerKey = "v6DRudTlT3eu5lM04MgBhNHQz";
    var consumerSecret = "2KtzC1kY4EkFsmypfQ5h8SW5ov67L1V4LOVnMVWJv3N5d1pprs";
    var twitterTokenURL = "https://api.twitter.com/oauth2/token";
    var twitterStreamURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?user_id="; //url query, this one is for hash tags
    var qValue = "1905057553"; //hash tag %23 is for #
    var numberOfTweets = "";

    self.sync = function () {
        var def = $q.defer();
        //get authorization token
        self.getAuthorization().then(function () {
            var req1 = {
                method: 'GET',
                url: twitterStreamURL + qValue + numberOfTweets,
                headers: {
                    'Authorization': 'Bearer ' + authorization.access_token,
                    'Content-Type': 'application/json'
                },
                cache: true
            };
            // make request with the token
            $http(req1).
                success(function (data, status, headers, config) {
                    def.resolve(data);
                }).
                error(function (data, status, headers, config) {

                    def.resolve(false);
                });
        });
        return def.promise;
    };

    self.getAuthorization = function () {
        var def = $q.defer();
        var base64Encoded;

        var combined = encodeURIComponent(consumerKey) + ":" + encodeURIComponent(consumerSecret);

        base64Encoded = Base64.encode(combined);
        // Get the token
        $http.post(twitterTokenURL,"grant_type=client_credentials", {headers: {'Authorization': 'Basic ' + base64Encoded, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}).
            success(function(data, status, headers, config) {
                authorization = data;
                if (data && data.token_type && data.token_type === "bearer") {
                    def.resolve(true);
                }
            }).
            error(function (data, status, headers, config) {
                def.resolve(false);
            });
        return def.promise;
    };

    return self;
})