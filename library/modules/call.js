const { CallOptions } = require('../models/call-options');
const { CallsMakerResult, CallInformation } = require('../models/calls-maker-result');
const { ClientService } = require('../models/client-service');
const { getClient, getClients } = require('./client');

module.exports = {
    getInfo: async(id) => {
        if (id.split('-').length === 5) {
            const client = getClient(ClientService.SIGNALWIRE);
            return await client.getCallInformation(id);
        } else if (id.indexOf('CA') === 0) {
            const client = getClient(ClientService.TWILIO);
            return await client.getCallInformation(id);
        }

        return new CallInformation();
    },

    create: (callOptions = new CallOptions()) => {
        const result = new CallsMakerResult();
        const clientsRestApi = getClients();

        return new Promise(async (resolve, reject) => {
            for (let i = 0, j = clientsRestApi.length; i < j; i++) {
                try {
                    const numberOptions = await clientsRestApi[i].client.getNumberOptions();

                    if (numberOptions.outgoingVoice) {
                        result.serviceUse = clientsRestApi[i].service;
                        result.responses[clientsRestApi[i].service] = await clientsRestApi[i].client.createCall(callOptions);
                        break;
                    } else {
                        result.errors.push(new Error(`The voice is not available for "${clientsRestApi[i].service}"`));
                    }
                } catch (error) {
                    result.errors.push(error);
                };
            }

            resolve(result);
        });
    },

    getServiceOptions: () => {
        const result = new CallsMakerResult({
            success: true,
        });
        const clientsRestApi = getClients();

        return new Promise(async (resolve, reject) => {
            for (let i = 0, j = clientsRestApi.length; i < j; i++) {
                try {
                    result.responses[clientsRestApi[i].service] = await clientsRestApi[i].client.getNumberOptions();
                } catch (error) {
                    result.errors.push(error);
                }
            }

            resolve(result);
        });
    }
};