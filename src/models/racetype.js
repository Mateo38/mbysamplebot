/******************************************************
* js module which describe the runsistant database model
* table racetype
* @author : mby
* @module : racetype
*/

module.exports = function(sequelize, DataTypes) {
    var RaceType = sequelize.define("RaceType", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
			primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
	}, 
	{
       tableName: 'racetype'
    });

    return RaceType;
}