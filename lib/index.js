'use strict';

/******************************************************
* js server root file
* @author : mby
* @module : index.js
*/

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var recastCli = require("./recastEngineClient.js");
var fbMesApi = require("./fbMessengerApi.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(process.env.PORT || 3000);

console.log('Server start');

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    console.log('Enter in post');
    var events = req.body.entry[0].messaging;
    console.log('Enter in post check body content');
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            console.log('Received from FB Messenger :' + event.message.text);
            //sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
            recastCli.processUserInput(event.message.text, function (recastAnswer) {
                console.log('Response from recast engine :' + recastAnswer);
                fbMesApi.sendMessage(event.sender.id, recastAnswer);
            });
        }
    }
    res.sendStatus(200);
});