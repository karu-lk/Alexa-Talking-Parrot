'use strict';

const AlexaSDK = require('alexa-sdk');
const AwsSDK = require('aws-sdk');
const promisify = require('es6-promisify');

const appId = "amzn1.ask.skill.2337ac6d-0616-4764-8bd8-b8775c0dc8b9";

const instructions = `Welcome to Talking Parrot<break strength="medium" /> 
                      Have a nice day`;

const ddb = new AwsSDK.DynamoDB.DocumentClient();
const quotesTable = 'quotes-db';

// convert callback style functions to promises
const dbScan = promisify(ddb.scan, ddb);
const dbGet = promisify(ddb.get, ddb);
const dbPut = promisify(ddb.put, ddb);
const dbDelete = promisify(ddb.delete, ddb);

AwsSDK.config.update({ region: 'us-east-1' });

const handlers = {

    /**
     * Triggered when the user says "Alexa, open Recipe Organizer.
     */
    'LaunchRequest'() {
        this.emit(':ask', instructions);
    },

    'RandomQuoteIntent'() {
        const { slots } = this.event.request.intent;
        const id = 1;
        const dynamoParams = {
            TableName: quotesTable,
            Limit: 10
        };

        // query DynamoDB to see if the item exists first
        dbScan(dynamoParams)
            .then(data => {
                console.log('Get item succeeded', JSON.stringify(data));

                this.emit(':tell', data.Items[0].quote);

            })
            .catch(err => {
                console.error(err);
            });
    },
    'QuoteOfTheDayIntent'() {
        const { slots } = this.event.request.intent;
        const id = slots.QuoteID.value;

        console.log(`Slot value for ID is ${id}`);

        const checkIfRecipeExistsParams = {
            TableName: quotesTable,
            Key: {
                id: Number(id)
            }
        };

        // query DynamoDB to see if the item exists first
        dbGet(checkIfRecipeExistsParams)
            .then(data => {
                console.log('Get item succeeded', data);

                this.emit(':tell', `Quote of the day is ${data.Item.quote}`);
            })
            .catch(err => {
                console.error(err);
            });
    }
};

exports.talkingParrot = function handler(event, context) {
    const alexa = AlexaSDK.handler(event, context);
    alexa.appID = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};