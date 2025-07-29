const { createClient } = require('redis');

class CacheService {
  constructor() {
    this._client = createClient({
      socket: {
        host: process.env.REDIS_SERVER,
        port: Number(process.env.REDIS_PORT),
      },
    });

    this._client.on('error', (err) => {
      // Optional: Integrasi dengan sistem logging di sini
    });

    this._connect();
  }

  async _connect() {
    try {
      await this._client.connect();
    } catch (err) {
      // Optional: Tangani error dengan sistem logging
    }
  }

  async set(key, value, expiration = 1800) {
    return this._client.set(key, value, { EX: expiration });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (!result) throw new Error('Cache tidak ditemukan');
    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
