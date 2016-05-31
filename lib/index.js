'use strict';

var _recastai = require('recastai');

var _recastai2 = _interopRequireDefault(_recastai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

// Recasst token & const
var recastRequestToken = '9a1f7bb74659e58db1ae933fbba0d2ad';
var recastClient = new _recastai2.default.Client(recastRequestToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000);

console.log('Server start');

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            //sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
            processUserInput(event.sender.id, event.message.text);
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

var lemmatizeRaceType = function lemmatizeRaceType(raceTypeRawValue) {
    // Brutal analysis of entity values
    var kmv = ['kmv', 'kilometre vertical', 'kilom�tre vertical', 'kilom�tres verticaux', 'kilometres verticaux'];
    var trail = ['trail', 'trails'];
    var ultratrail = ['ultratrail', 'ultratrails', 'ultra-trail', 'ultra-trails'];
    var whitetrail = ['trail blanc', 'trails blancs'];
    var marathon = ['marathon', 'marathons'];
    var halfmarathon = ['semi-marathon', 'semi-marathons', 'semi', 'semis'];

    if (inArray(raceTypeRawValue, kmv)) return 'kmv';
    if (inArray(raceTypeRawValue, ultratrail)) return 'ultratrail';
    if (inArray(raceTypeRawValue, whitetrail)) return 'whitetrail';
    if (inArray(raceTypeRawValue, trail)) return 'trail';
    if (inArray(raceTypeRawValue, halfmarathon)) return 'halfmarathon';
    if (inArray(raceTypeRawValue, marathon)) return 'marathon';

    return null;
};

/*
 * Return true if exact value is present in the array.
 */
var inArray = function inArray(value, array) {
    if (!value || !array) {
        return false;
    }
    for (var i = 0; i < array.length; i++) {
        if (value === array[i]) return true;
    }
    return false;
};

/*
 * Return true if value is present in values of the array.
 */
var inArray2 = function inArray2(value, array) {
    if (!value || !array) {
        return false;
    }
    for (var i = 0; i < array.length; i++) {
        if (value.indexOf(array[i]) >= 0) return true;
    }
    return false;
};

var getRaceDateRange = function getRaceDateRange(raceDateRawValue) {

    var today = new Date();

    /*
     * Year analysis
     */

    var lastYearPatterns = ["ann�e derni�re", "annee derniere"];
    var nextYearPatterns = ["ann�e prochaine", "annee prochaine", "ann�e � venir", "annee a venir"];
    var thisYearPatterns = ["de l'ann�e", "ann�e", "dans l'ann�e", "l'ann�e"];

    if (inArray2(raceDateRawValue, lastYearPatterns)) {
        var day1 = new Date(today.getFullYear() - 1, 0, 1); // January, 1st of the previous year
        var day2 = new Date(today.getFullYear() - 1, 11, 31); // December, 31st of the previous year
        return [day1, day2];
    }

    if (inArray2(raceDateRawValue, nextYearPatterns)) {
        var _day = new Date(today.getFullYear() + 1, 0, 1); // January, 1st of the next year
        var _day2 = new Date(today.getFullYear() + 1, 11, 31); // December, 31st of the next year
        return [_day, _day2];
    }

    if (inArray2(raceDateRawValue, thisYearPatterns)) {
        var _day3 = new Date(today.getFullYear(), 0, 1); // January, 1st of the this year
        var _day4 = new Date(today.getFullYear(), 11, 31); // December, 31st of the this year
        return [_day3, _day4];
    }

    /*
     * Month analysis
     */

    var nextMonthPatterns = ["mois prochain", "prochain mois"];
    var thisMonthPatterns = ["ce mois-ci", "ce mois", "mois"];

    if (inArray2(raceDateRawValue, nextMonthPatterns)) {
        var year = today.getFullYear();
        var month = today.getMonth();
        if (month === 11) {
            // December
            month = 0;
            year++;
        } else {
            month++;
        }
        var daysInMonth = new Date(year, month, 0).getDate(); // TODO: � debugger !!!
        var _day5 = new Date(year, month, 1); // 1st of the next month
        var _day6 = new Date(year, month, daysInMonth); // Last day of the next month
        return [_day5, _day6];
    }

    if (inArray2(raceDateRawValue, thisMonthPatterns)) {
        var _daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // TODO: � debugger !!!
        var _day7 = new Date(today.getFullYear(), today.getMonth(), 1); // 1st of the month
        var _day8 = new Date(today.getFullYear(), today.getMonth(), _daysInMonth); // Last day of the month
        return [_day7, _day8];
    }

    var monthPatterns = ["janvier", "f�vrier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "ao�t", "septembre", "octobre", "novembre", "d�cembre", "d�cembre"];

    // TODO: improve this brutal code with hashmap searching
    if (inArray2(raceDateRawValue, monthPatterns)) {
        var month = 0;
        if (raceDateRawValue.indexOf("f�vrier") >= 0 || raceDateRawValue.indexOf("fevrier") >= 0) {
            month = 1;
        } else if (raceDateRawValue.indexOf("mars") >= 0) {
            month = 2;
        } else if (raceDateRawValue.indexOf("avril") >= 0) {
            month = 3;
        } else if (raceDateRawValue.indexOf("mai") >= 0) {
            month = 4;
        } else if (raceDateRawValue.indexOf("juin") >= 0) {
            month = 5;
        } else if (raceDateRawValue.indexOf("juillet") >= 0) {
            month = 6;
        } else if (raceDateRawValue.indexOf("ao�t") >= 0 || raceDateRawValue.indexOf("aout") >= 0) {
            month = 7;
        } else if (raceDateRawValue.indexOf("septembre") >= 0) {
            month = 8;
        } else if (raceDateRawValue.indexOf("octobre") >= 0) {
            month = 9;
        } else if (raceDateRawValue.indexOf("novembre") >= 0) {
            month = 10;
        } else if (raceDateRawValue.indexOf("d�cembre") >= 0 || raceDateRawValue.indexOf("decembre") >= 0) {
            month = 11;
        }

        var _daysInMonth2 = new Date(today.getFullYear(), month, 0).getDate(); // TODO: � debugger !!!
        var _day9 = new Date(today.getFullYear(), month, 1); // 1st of the month
        var _day10 = new Date(today.getFullYear(), month, _daysInMonth2); // Last day of the month
        return [_day9, _day10];
    }

    return null;

    // TODO: valeurs � analyser pour extraire les intervalles de date
    // "cet �t�", "ce printemps", "cet automne", "cet hiver"
    // "mmm 2016"
    // "week-end du jj/mm/aaaa", "week-end du jj mmm"
    // "week-end prochain", "prochain week-end",
    // "jj mmm"
    // "jj mmm aaaa"
    // "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"
    // "lundi prochain", "mardi prochain", "mercredi prochain", "jeudi prochain", "vendredi prochain", "samedi prochain", "dimanche prochain"
    // "lundi dernier", "mardi dernier", "mercredi dernier", "jeudi dernier", "vendredi dernier", "samedi dernier", "dimanche dernier"
};

var processUserInput = function processUserInput(userId, userInput) {

    // Request Recast to process user input
    recastClient.textRequest(userInput, function (response, err) {
        if (response.intent() === 'find-race') {

            // Analyse the asked race type
            var entityRaceType = response.get('racetype');
            if (entityRaceType) {
                console.log("entityRaceType.value = " + entityRaceType.value); // DEBUG
                var raceType = lemmatizeRaceType(entityRaceType.value);
                if (!raceType) {
                    console.log('Tu as demand� une course de type non reconnu.');
                    sendMessage(userId, 'Tu as demand� une course de type non reconnu.');
                } else {
                    console.log('Tu as demand� une course de type ' + raceType + '.');
                    sendMessage(userId, 'Tu as demand� une course de type ' + raceType + '.');
                }
            } else {
                console.log('Je n\'ai pas compris s\'il y avait un type de course...');
                sendMessage(userId, 'Je n\'ai pas compris s\'il y avait un type de course...');
            }

            // Analyse the race period or date
            var entityRaceDate = response.get('date');
            if (entityRaceDate) {
                console.log("entityRaceDate.value = " + entityRaceDate.value); // DEBUG
                var range = getRaceDateRange(entityRaceDate.value);
                if (range) {
                    console.log('Tu cherches une course en ' + range[0].toString() + ' et ' + range[1].toString() + ".");
                    sendMessage(userId, 'Tu cherches une course en ' + range[0].toString() + ' et ' + range[1].toString() + ".");
                } else {
                    console.log('Je n\'ai pas compris pour quelle p�riode tu recherches une course...');
                    sendMessage(userId, 'Je n\'ai pas compris pour quelle p�riode tu recherches une course...');
                }
            } else {
                console.log('Je n\'ai pas compris s\'il y avait une p�riode pour la course recherch�e...');
                sendMessage(userId, 'Je n\'ai pas compris s\'il y avait une p�riode pour la course recherch�e...');
            }
        } else {
            console.log('Je n\'ai pas compris :-(');
            sendMessage(userId, 'Je n\'ai pas compris :-(');
        }
    });

    /*
                
                let entityRaceDistance = response.get('distance');
                let entityRaceLocation = response.get('location');
                let entityRaceElevation = response.get('location');
    */
};