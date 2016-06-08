/******************************************************
* js module which describe the runsistant database 
* connection & load the model
* @author : mby
* @module : model
*/

const pghost = 'ec2-54-247-185-241.eu-west-1.compute.amazonaws.com';
const pgschema = 'd12a0lei8efjsk';
const pguser = 'jjlczatoofuxzq';
const pgpwd = 'HpADToPxgbSdYywQapwepcBUY3';
const pgport= '5432';

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize('postgres://'+pguser+':'+pgpwd+'@'+pghost+':'+pgport+'/'+pgschema,{
    dialect: 'postgres',
    protocol: 'postgres',
	define: {
        timestamps: false
    },
    dialectOptions: {
        ssl: true
    }
});

var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
