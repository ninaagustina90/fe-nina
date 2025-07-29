require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Error Handling
const ClientError = require('./exceptions/ClientError');

// Services
const CacheService = require('./services/redis/CacheService');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const StorageService = require('./services/storage/StorageService');
const AlbumsLikesService = require('./services/postgres/AlbumsLikesService');

// Token Manager
const TokenManager = require('./utils/tokenize');

// Plugins
const albumsPlugin = require('./api/albums');
const songsPlugin = require('./api/songs');
const usersPlugin = require('./api/users');
const authenticationsPlugin = require('./api/authentications');
const playlistsPlugin = require('./api/playlists');
const collaborationsPlugin = require('./api/collaborations');
const exportsPlugin = require('./api/exports');
const uploadsPlugin = require('./api/uploads');
const albumsLikesPlugin = require('./api/albumsLike');

const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService);
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'uploads'));
  const albumsLikesService = new AlbumsLikesService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register external plugins
  await server.register([Jwt, Inert]);

  // JWT Auth Strategy
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  // Register custom plugins
  await server.register([
    {
      plugin: albumsPlugin,
      options: { service: albumsService },
    },
    {
      plugin: songsPlugin,
      options: { service: songsService },
    },
    {
      plugin: usersPlugin,
      options: { service: usersService },
    },
    {
      plugin: authenticationsPlugin,
      options: {
        usersService,
        authenticationsService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: playlistsPlugin,
      options: { service: playlistsService, songsService },
    },
    {
      plugin: collaborationsPlugin,
      options: { collaborationsService, playlistsService },
    },
    {
      plugin: exportsPlugin,
      options: { playlistsService },
    },
    {
      plugin: uploadsPlugin,
      options: { storageService, albumsService },
    },
    {
      plugin: albumsLikesPlugin,
      options: { service: albumsLikesService, albumsService },
    },
  ]);

  // Global Error Handler
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      return h
        .response({
          status: 'fail',
          message: response.message,
        })
        .code(response.statusCode);
    }

    if (!response.isBoom) return h.continue;

    console.error('🔴 Server error:', response.message, response.stack);
    return h
      .response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan di server kami.',
      })
      .code(response.output.statusCode);
  });

  await server.start();
  console.log(`🚀 Server OpenMusic V3 aktif di ${server.info.uri}`);
};

init();
