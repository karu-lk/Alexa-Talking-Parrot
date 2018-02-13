'use strict';

const ALEXA = require('alexa-sdk');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

var states = {
  ENDMODE: '_ENDMODE',
  STARTMODE: '_STARTMODE'
};

module.exports.talkingParrot = (event, context, callback) => {
  var alexa = ALEXA.handler(event, context);
  alexa.APP_ID = "amzn1.ask.skill.2337ac6d-0616-4764-8bd8-b8775c0dc8b9";
  alexa.registerHandlers(newSessionHandler, startTalkingParrotHandler);
  alexa.execute();
};

var newSessionHandler = {
  'NewSession': function () {
    this.handler.state = states.STARTMODE;

    var cardTitle = 'New Session Card - Talking Parrot App';
    var voiceOutput = 'Hi, I am the talking parrot for you today'
    var repromptSpeech = 'Sorry I think I missed the context. How can I help you?';

    this.emit(':askWithCard', voiceOutput, repromptSpeech, cardTitle, voiceOutput)
  }
}

var startTalkingParrotHandler = ALEXA.CreateStateHandler(states.STARTMODE, {
  'NewSession': function () {
    this.emit('NewSession'); // Uses the handler in newSessionHandlers
  },
  'RandomQuoteIntent': function () {
    var cardTitle = 'Random Quote Intent Card - Talking Parrot App';
    var voiceOutput = 'Testing 123'
    var repromptSpeech = 'Sorry I did not get it correctly. Could I please get your name?';

    this.emit(':askWithCard', voiceOutput, repromptSpeech, cardTitle, voiceOutput);
  },

  'Unhandled': function () {
    console.log("UNHANDLED");

    var cardTitle = 'Unhandled Intent Card - Visitor App';

    var voiceOutput = 'Sorry, the content I received is not defined in my system. Please contact the office manager.';
    this.emit(':tellWithCard', voiceOutput, cardTitle, voiceOutput);
  }
});