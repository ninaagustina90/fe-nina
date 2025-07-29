const autoBind = require('auto-bind').default;

class ExportsHandler {
  constructor(service, playlistService, producerService, validator) {
    this._service = service;
    this._playlistsService = playlistService;
    this._producerService = producerService; // ✅ Inject explicitly
    this._validator = validator;

    
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
      JSON.stringify(message)
    );

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    }).code(201);
  }
}

module.exports = ExportsHandler;
