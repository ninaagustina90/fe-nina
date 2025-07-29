const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { service }) => {
    const authenticationsHandler = new AuthenticationsHandler(service);
    
    server.route(routes(authenticationsHandler));
  },
};
