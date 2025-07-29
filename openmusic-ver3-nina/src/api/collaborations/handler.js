const CollaborationValidator = require('../../validator/collaborationValidator');
const autoBind = require('auto-bind').default;

class CollaborationsHandler {
  constructor( service ) {
    this._service = service,
      autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    CollaborationValidator.validateCollaborationPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._collaborationsService.verifyExistingUser(userId);
    await this._collaborationsService.verifyExistingPlaylist(playlistId);

    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: { collaborationId },
    }).code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: owner } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    }).code(200);
  }
}

module.exports = CollaborationsHandler;
