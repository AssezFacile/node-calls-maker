const { ServicesOptions } = require('../models/services-options');
const { ClientService } = require('../models/client-service');
const clientsRestApi = [];

module.exports = {
    getClient: (clientService) => {
        const service = clientsRestApi.find(api => api.service === clientService);
        return service.client;
    },
    getClients: () => {
        return clientsRestApi;
    },
    serviceIsInitialize: (clientService) => {
        return clientsRestApi.findIndex(api => api.service === clientService) > -1;
    },
    initialize: (options = new ServicesOptions()) => {
        if (options.signalwire.accountSid) {
            const client = require('./provider/signalwire');
            client.initialize(options);

            clientsRestApi.push({
                service: ClientService.SIGNALWIRE,
                client: client,
            });
        }
        if (options.twilio.accountSid) {
            const client = require('./provider/twilio');
            client.initialize(options);

            clientsRestApi.push({
                service: ClientService.TWILIO,
                client: client,
            });
        }

        if (!clientsRestApi.length) {
            throw new Error('You need to config at least one service');
        }
    },
};