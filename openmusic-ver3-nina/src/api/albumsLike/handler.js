const autoBind = require('auto-bind').default;
const ClientError = require('../../exceptions/ClientError');

class AlbumsLikeHandler {
  constructor(service, albumsService, validator) {
    this._service = service;
    this._albumsService = albumsService; // Make sure this service is injected
    this._validator = validator;

    autoBind(this); // Binds all methods automatically
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    // Confirm album exists
    await this._albumsService.getAlbumById(albumId);

    const alreadyLiked = await this._service.checkAlreadyLike(credentialId, albumId);

    if (!alreadyLiked) {
      const likeId = await this._service.addLikeToAlbum(credentialId, albumId);

      return h.response({
        status: 'success',
        message: 'Successfully liked the album',
        data: { likeId },
      }).code(201);
    }

    return h.response({
      status: 'fail',
      message: 'You have already liked this album',
    }).code(400);
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const data = await this._service.getLikesCount(albumId);

    return h.response({
      status: 'success',
      data: { likes: data.count },
    })
    .header('X-Data-Source', data.source || 'cache') // Reflects actual source (cache/database)
    .code(200);
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteAlbumLike(credentialId, albumId);

    return h.response({
      status: 'success',
      message: 'Berhasil melakukan unlike',
    }).code(200);
  }
}

module.exports = AlbumsLikeHandler;
