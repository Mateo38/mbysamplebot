/******************************************************
* js module with utility features
* @author : mby
* @module : utility
*/

/*
 * Return true if value is present in values of the array.
 */
var inArray2 = function(value, array) {
    if(!value || !array) {
        return false;
    }
    for(var i=0; i<array.length; i++) {
        if(value.indexOf(array[i]) >= 0)
            return true;
    } 
    return false;
};

/*
 * Return true if exact value is present in the array.
 */
var inArray = function(value, array) {	
    if(!value || !array) {
        return false;
    }
    for(var i=0; i<array.length; i++) {
        if(value === array[i])
            return true;
    } 
    return false;
};

/*
 * Function used to match a race type based on a race code
 */
var lemmatizeRaceType = function(raceTypeRawValue) {
    // Brutal analysis of entity values
    const kmv = ['kmv', 'kilometre vertical', 'kilomètre vertical', 'kilomètres verticaux', 'kilometres verticaux'];
    const trail = ['trail', 'trails'];
    const ultratrail = ['ultratrail', 'ultratrails', 'ultra-trail', 'ultra-trails'];
    const whitetrail = ['trail blanc', 'trails blancs'];
    const marathon = ['marathon', 'marathons'];
    const halfmarathon = ['semi-marathon', 'semi-marathons', 'semi', 'semis'];
    
    if(inArray(raceTypeRawValue, kmv)) return 'kmv';
    if(inArray(raceTypeRawValue, ultratrail)) return 'ultratrail';
    if(inArray(raceTypeRawValue, whitetrail)) return 'whitetrail';
    if(inArray(raceTypeRawValue, trail)) return 'trail';
    if(inArray(raceTypeRawValue, halfmarathon)) return 'halfmarathon';
    if(inArray(raceTypeRawValue, marathon)) return 'marathon';
    
    return null;
};

/*
 * Function used to compute a date range based on a reference date
 */
var getRaceDateRange = function(raceDateRawValue) {

    let today = new Date();
    
    /*
     * Year analysis
     */
    
    const lastYearPatterns = ["année dernière", "annee derniere"];
    const nextYearPatterns = ["année prochaine", "annee prochaine", "année à venir", "annee a venir"];
    const thisYearPatterns = ["de l'année", "année", "dans l'année", "l'année"];

    if(inArray2(raceDateRawValue, lastYearPatterns)) {
        let day1 = new Date(today.getFullYear()-1, 0, 1); // January, 1st of the previous year
        let day2 = new Date(today.getFullYear()-1, 11, 31) // December, 31st of the previous year
        return [day1, day2];
    }

    if(inArray2(raceDateRawValue, nextYearPatterns)) {
        let day1 = new Date(today.getFullYear()+1, 0, 1); // January, 1st of the next year
        let day2 = new Date(today.getFullYear()+1, 11, 31) // December, 31st of the next year
        return [day1, day2];
    }
    
    if(inArray2(raceDateRawValue, thisYearPatterns)) {
        let day1 = new Date(today.getFullYear(), 0, 1); // January, 1st of the this year
        let day2 = new Date(today.getFullYear(), 11, 31) // December, 31st of the this year
        return [day1, day2];
    }

    /*
     * Month analysis
     */
    
    const nextMonthPatterns = ["mois prochain", "prochain mois"];
    const thisMonthPatterns = ["ce mois-ci", "ce mois", "mois"];

    if(inArray2(raceDateRawValue, nextMonthPatterns)) {
        var year = today.getFullYear();
        var month = today.getMonth();
        if(month === 11) {
            // December
            month = 0;
            year++;
        } else {
            month++;
        }
        let daysInMonth = new Date(year, month, 0).getDate(); // TODO: à debugger !!!
        let day1 = new Date(year, month, 1); // 1st of the next month
        let day2 = new Date(year, month, daysInMonth) // Last day of the next month
        return [day1, day2];
    }
    
    if(inArray2(raceDateRawValue, thisMonthPatterns)) {
        let daysInMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // TODO: à debugger !!!
        let day1 = new Date(today.getFullYear(), today.getMonth(), 1); // 1st of the month
        let day2 = new Date(today.getFullYear(), today.getMonth(), daysInMonth) // Last day of the month
        return [day1, day2];
    }
    
    const monthPatterns = ["janvier", "février", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "août", "septembre", "octobre", "novembre", "décembre", "decembre"];
    
    // TODO: improve this brutal code with hashmap searching
    if(inArray2(raceDateRawValue, monthPatterns)) {
        var month = 0;
        if(raceDateRawValue.indexOf("février") >= 0 || raceDateRawValue.indexOf("fevrier") >= 0) {
            month = 1;
        } else if(raceDateRawValue.indexOf("mars") >= 0) {
            month = 2;
        } else if(raceDateRawValue.indexOf("avril") >= 0) {
            month = 3;
        } else if(raceDateRawValue.indexOf("mai") >= 0) {
            month = 4;
        } else if(raceDateRawValue.indexOf("juin") >= 0) {
            month = 5;
        } else if(raceDateRawValue.indexOf("juillet") >= 0) {
            month = 6;
        } else if(raceDateRawValue.indexOf("août") >= 0 || raceDateRawValue.indexOf("aout") >= 0) {
            month = 7;
        } else if(raceDateRawValue.indexOf("septembre") >= 0) {
            month = 8;
        } else if(raceDateRawValue.indexOf("octobre") >= 0) {
            month = 9;
        } else if(raceDateRawValue.indexOf("novembre") >= 0) {
            month = 10;
        } else if(raceDateRawValue.indexOf("décembre") >= 0 || raceDateRawValue.indexOf("decembre") >= 0) {
            month = 11;
        }
        
        let daysInMonth = new Date(today.getFullYear(), month, 0).getDate(); // TODO: à debugger !!!
        let day1 = new Date(today.getFullYear(), month, 1); // 1st of the month
        let day2 = new Date(today.getFullYear(), month, daysInMonth) // Last day of the month
        return [day1, day2];
    }
    
    return null;
};

/*
 *Export module utility functions
 */
 exports.lemmatizeRaceType=lemmatizeRaceType;
 exports.getRaceDateRange=getRaceDateRange;
