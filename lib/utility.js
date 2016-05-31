'use strict';

/******************************************************
* js module with utility features
* @author : mby
* @module : utility
*/

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
 * Function used to match a race type based on a race code
 */
var lemmatizeRaceType = function lemmatizeRaceType(raceTypeRawValue) {
    // Brutal analysis of entity values
    var kmv = ['kmv', 'kilometre vertical', 'kilomètre vertical', 'kilomètres verticaux', 'kilometres verticaux'];
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
 * Function used to compute a date range based on a reference date
 */
var getRaceDateRange = function getRaceDateRange(raceDateRawValue) {

    var today = new Date();

    /*
     * Year analysis
     */

    var lastYearPatterns = ["année dernière", "annee derniere"];
    var nextYearPatterns = ["année prochaine", "annee prochaine", "année à venir", "annee a venir"];
    var thisYearPatterns = ["de l'année", "année", "dans l'année", "l'année"];

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
        var daysInMonth = new Date(year, month, 0).getDate(); // TODO: à debugger !!!
        var _day5 = new Date(year, month, 1); // 1st of the next month
        var _day6 = new Date(year, month, daysInMonth); // Last day of the next month
        return [_day5, _day6];
    }

    if (inArray2(raceDateRawValue, thisMonthPatterns)) {
        var _daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // TODO: à debugger !!!
        var _day7 = new Date(today.getFullYear(), today.getMonth(), 1); // 1st of the month
        var _day8 = new Date(today.getFullYear(), today.getMonth(), _daysInMonth); // Last day of the month
        return [_day7, _day8];
    }

    var monthPatterns = ["janvier", "février", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "août", "septembre", "octobre", "novembre", "décembre", "decembre"];

    // TODO: improve this brutal code with hashmap searching
    if (inArray2(raceDateRawValue, monthPatterns)) {
        var month = 0;
        if (raceDateRawValue.indexOf("février") >= 0 || raceDateRawValue.indexOf("fevrier") >= 0) {
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
        } else if (raceDateRawValue.indexOf("août") >= 0 || raceDateRawValue.indexOf("aout") >= 0) {
            month = 7;
        } else if (raceDateRawValue.indexOf("septembre") >= 0) {
            month = 8;
        } else if (raceDateRawValue.indexOf("octobre") >= 0) {
            month = 9;
        } else if (raceDateRawValue.indexOf("novembre") >= 0) {
            month = 10;
        } else if (raceDateRawValue.indexOf("décembre") >= 0 || raceDateRawValue.indexOf("decembre") >= 0) {
            month = 11;
        }

        var _daysInMonth2 = new Date(today.getFullYear(), month, 0).getDate(); // TODO: à debugger !!!
        var _day9 = new Date(today.getFullYear(), month, 1); // 1st of the month
        var _day10 = new Date(today.getFullYear(), month, _daysInMonth2); // Last day of the month
        return [_day9, _day10];
    }

    return null;
};

/*
 *Export module utility functions
 */
exports.lemmatizeRaceType = lemmatizeRaceType;
exports.getRaceDateRange = getRaceDateRange;