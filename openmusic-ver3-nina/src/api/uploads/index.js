const UploadsHandler = require('./handler');
const routes = require('./routes');
const UploadsValidator = require('../../validator/uploadValidator');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { uploadsService, albumsService, validator = UploadsValidator }) => {
    const handler = new UploadsHandler({ uploadsService, albumsService, validator });
    server.route(routes(handler));
  },
};
