'use strict';

/******************************************************
* js module used to handle messages with facebook messenger
* @author : mby
* @module : fbMessengerApi.js
*/

var request = require('request');

//Facebook token
var facebookmessengerToken = 'EAACxmRTT0A4BAGMHUTu2vCC8pgpnrWan6mB3FYcNZArv4265ZCdkWAJ15AcmgzvGszMxZBSXBvI9R2xYchsM27ZCCrYbmgwtiKC4P0gjn9145gVV7wZCylkB3f2xalMntb6T6Sco2qOQ6jjdEDPchSSzODDPgHKC0SQS4R2l1LwZDZD';
var facebookmessengerURL = 'https://graph.facebook.com/v2.6/me/messages';

// generic function sending messages
var sendMessage = function sendMessage(recipientId, messageToSend) {
    //console.log('RecipientId :'+recipientId);
    //console.log('Enter in send message function with message :'+messageToSend);
    request({
        url: facebookmessengerURL,
        qs: { access_token: facebookmessengerToken },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: { text: messageToSend }
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

/*
 *Export module fbMessengerApi functions
 */
exports.sendMessage = sendMessage;