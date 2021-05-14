const { CallOptions } = require('../models/call-options');
const { CallsMakerResult } = require('../models/calls-maker-result');
const { getClients } = require('./client');

module.exports = {
    create: (options = new CallOptions()) => {
        const errors = [];
        const clientsRestApi = getClients();
        let response = null;

        return new Promise(async (resolve, reject) => {
            for (let i = 0, j = clientsRestApi.length; i < j; i++) {
                try {
                    response = await clientsRestApi[i].client.call(options);

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