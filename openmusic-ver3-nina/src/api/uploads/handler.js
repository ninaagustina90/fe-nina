const autoBind = require('auto-bind').default;


const UploadsValidator = require('../../validator/uploadValidator');

class UploadsHandler {
  constructor(service, albumsService) {
    this._service = service;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumsCoversHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    UploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    console.log(`ini ${coverUrl}`);

    await this._albumsService.addCoverAlbumById(id, coverUrl);

    return h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    }).code(201);
  }
}

module.exports = UploadsHandler;
