/******************************************************
* js module to handle queries to the postgres sql db 
* @author : mby
* @module : dao
*/

var models = require("./models");

/**
 * Select all the race type
 * @return output : the list of all race types 
 */
var getAllRaceType = function(output)
{
	console.log('Enter in getAllRaceType');
	models.RaceType.findAll({}).then(function(racetypeLst) {
					output(racetypeLst);         
            });

};

/**
 * Select all the events between two dates
 * @param startDate : start date of the search - timestamp 
 * @param endDate : end date of the search - timestamp
 * @return result : array of events founded
 */
 var getAllEventsBetweenSdEd = function(sDate,eDate,result)
 {
	models.Event.findAll({
		where: {
			 startDate: {
			 $between: [sDate,eDate]
			}
		}	
	}).then(function(eventLst) {
					result(eventLst);         
            });
 }
 
	
/*
 *Export module utility functions
 */
 exports.getAllRaceType=getAllRaceType;
 exports.getAllEventsBetweenSdEd=getAllEventsBetweenSdEd;