const { ServicesOptions } = require('../models/services-options');
const { ClientService } = require('../models/client-service');
const clientsRestApi = [];
let serviceOptions = null;

module.exports = {
    getClient: (clientService) => {
        const service = clientsRestApi.find(api => api.service === clientService);
        return service ? service.client : null;
    },
    getClients: () => {
        return clientsRestApi;
    },
    getHost: () => {
        return `${serviceOptions.externalHost}${serviceOptions.basicUrl}`;
    },
    serviceIsInitialize: (clientService) => {
        return clientsRestApi.findIndex(api => api.service === clientService) > -1;
    },
    initialize: (options = new ServicesOptions()) => {
        serviceOptions = options;

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