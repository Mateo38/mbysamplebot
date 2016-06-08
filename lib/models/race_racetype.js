"use strict";

/******************************************************	
/******************************************************	
* js module which describe the runsistant database model
* table race_racetype
* @author : mby
* @module : race_racetype
*/

module.exports = function (sequelize, DataTypes) {
    var Race_RaceType = sequelize.define("Race_RaceType", {
        raceid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        racetypeid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Race_RaceType'
    });
    return Race_RaceType;
};