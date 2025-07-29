const UsersHandler = require('./handler');
const routes = require('./routes');
const UsersValidator = require('../../validator/usersValidator');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { usersService, validator = UsersValidator }) => {
    const handler = new UsersHandler({ usersService, validator });
    server.route(routes(handler));
  },
};
