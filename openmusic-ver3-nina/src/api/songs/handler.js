const autoBind = require('auto-bind').default;
const  {SongsValidator} = require("../../validator/songValidator"); 


class SongsHandler {
  constructor(service) {
    this._service = service;
  
    autoBind(this);
  }


  async postSongHandler(request, h) {
    SongsValidator.validateSongPayload(request.payload);

    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: { songId },
    }).code(201);
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs(title, performer);

    return h.response({
      status: 'success',
      data: {
        songs: songs.map(({ id, title, performer }) => ({
          id,
          title,
          performer,
        })),
      },
    }).code(200);
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: { song },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;
    const {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    } = request.payload;

    await this._service.editSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
