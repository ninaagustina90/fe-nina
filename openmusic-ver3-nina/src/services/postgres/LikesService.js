const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class LikesService {
  constructor() {
    this._pool = new Pool();
  }

  async addLikeToAlbum(userId, albumId) {
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3)',
      values: [id, userId, albumId],
    };

    await this._pool.query(query);
    return id;
  }

  async checkAlreadyLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    return result.rowCount > 0;
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
  }

  async getLikesCount(albumId) {
    const query = {
      text: 'SELECT COUNT(*) AS count FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return {
      count: parseInt(result.rows[0].count),
      source: 'database', // bisa kamu ubah ke 'cache' jika pakai Redis
    };
  }
}

module.exports = LikesService;
