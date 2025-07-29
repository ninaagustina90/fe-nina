const SongsHandler = require('./handler'); // ← ini yang hilang
const routes = require('./routes');
const { SongsValidator } = require('../../validator/songValidator');


module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service }) => {
    const songsHandler = new SongsHandler(service, SongsValidator); // ← validator wajib dimasukkan di sini
    server.route(routes(songsHandler)); // ← pastikan ini dipanggil
  },
};
