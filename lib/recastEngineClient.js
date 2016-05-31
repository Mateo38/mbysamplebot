'use strict';

var _recastai = require('recastai');

var _recastai2 = _interopRequireDefault(_recastai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Recast token & const
var recastRequestToken = '9a1f7bb74659e58db1ae933fbba0d2ad'; /******************************************************
                                                             * js module used to send request to RecastAI egine
                                                             * @author : mby
                                                             * @module : recastEngineClient
                                                             */

//import

var recastClient = new _recastai2.default.Client(recastRequestToken);

var utilityModule = require("./utility.js");

var processUserInput = function processUserInput(userInput, recAns) {

    // Request Recast to process user input
    recastClient.textRequest(userInput, function (response, err) {
        if (response.intent() === 'find-race') {
            // Analyse the asked race type
            var entityRaceType = response.get('racetype');
            if (entityRaceType) {
                console.log("entityRaceType.value = " + entityRaceType.value); // DEBUG
                var raceType = utilityModule.lemmatizeRaceType(entityRaceType.value);
                if (!raceType) {
                    console.log('Tu as demandé une course de type non reconnu.');
                    recAns('Tu as demandé une course de type non reconnu.');
                } else {
                    console.log('Tu as demandé une course de type ' + raceType + '.');
                    recAns('Tu as demandé une course de type ' + raceType + '.');
                }
            } else {
                console.log('Je n\'ai pas compris s\'il y avait un type de course...');
                recAns('Je n\'ai pas compris s\'il y avait un type de course...');
            }

            // Analyse the race period or date
            var entityRaceDate = response.get('date');
            if (entityRaceDate) {
                console.log("entityRaceDate.value = " + entityRaceDate.value); // DEBUG
                var range = utilityModule.getRaceDateRange(entityRaceDate.value);
                if (range) {
                    console.log('Tu cherches une course en ' + range[0].toString() + ' et ' + range[1].toString() + ".");
                    recAns('Tu cherches une course en ' + range[0].toString() + ' et ' + range[1].toString() + ".");
                } else {
                    console.log('Je n\'ai pas compris pour quelle période tu recherches une course...');
                    recAns('Je n\'ai pas compris pour quelle période tu recherches une course...');
                }
            } else {
                console.log('Je n\'ai pas compris s\'il y avait une période pour la course recherchée...');
                recAns('Je n\'ai pas compris s\'il y avait une période pour la course recherchée...');
            }
        } else {
            console.log('Je n\'ai pas compris :-(');
            recAns('Je n\'ai pas compris :-(');
        }
    });
};

/*
 *Export module utility functions
 */
exports.processUserInput = processUserInput;