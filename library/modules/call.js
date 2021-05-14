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

    create: (options = new CallOptions()) => {
        const errors = [];
        const clientsRestApi = getClients();
        let response = null;

        return new Promise(async (resolve, reject) => {
            for (let i = 0, j = clientsRestApi.length; i < j; i++) {
                try {
                    response = await clientsRestApi[i].client.createCall(options);

                    if (response) {
                        resolve(new CallsMakerResult({
                            success: true,
                            serviceUse: clientsRestApi[i].service,
                            serviceResponse: response,
                            errors: errors
                        }));
                        break;
                    }
                } catch(error) {
                    errors.push(error);
                }
            }

            reject(new CallsMakerResult({
                success: false,
                errors: errors,
            }));
        });
    }
};