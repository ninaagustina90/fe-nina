const autoBind = require('auto-bind').default;
const UploadsValidator = require('../../validator/uploadValidator');

class UploadsHandler {
  constructor({ uploadsService, albumsService, validator = UploadsValidator }) {
    this._service = uploadsService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);

  }

  async postAlbumsCoversHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.addCoverAlbumById(albumId, coverUrl);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = UploadsHandler;
