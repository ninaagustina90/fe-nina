const SongsHandler = require('./handler');
const routes = require('./routes');
const { SongsValidator } = require('../../validator/songValidator');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { songsService, validator = SongsValidator }) => {
    const handler = new SongsHandler({ songsService, validator });
    server.route(routes(handler));
  },
};
