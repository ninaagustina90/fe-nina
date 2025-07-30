const autoBind = require('auto-bind').default;
const ExportsValidator = require('../../validator/exportValidator');

class ExportsHandler {
  constructor({ exportsService, playlistsService, producerService, validator = ExportsValidator }) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._producerService = producerService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
