"use strict";

/******************************************************
* js module which describe the runsistant database model
* table event
* @author : mby
* @module : event
*/

module.exports = function (sequelize, DataTypes) {
    var Event = sequelize.define("event", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'event'
    });

    return Event;
};