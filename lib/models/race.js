"use strict";

/******************************************************
* js module which describe the runsistant database model
* table race
* @author : mby
* @module : race
*/

module.exports = function (sequelize, DataTypes) {
    var Race = sequelize.define("Race", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        racedate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        distance: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        exercicetype: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eventid: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'Race'
    });

    return Race;
};