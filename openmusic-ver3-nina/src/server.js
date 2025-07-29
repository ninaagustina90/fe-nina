require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Error Handling
const ClientError = require('./exceptions/ClientError');

// Services
const AlbumsService = require('./services/postgres/AlbumsService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/redis/CacheService');

// Token Manager
const TokenManager = require('./utils/tokenize');

// Validators
// const AlbumsValidator = require('./validator/albums');
// const SongsValidator = require('./validator/songs');
// const UsersValidator = require('./validator/users');
// const AuthenticationsValidator = require('./validator/authentications');
// const PlaylistsValidator = require('./validator/playlists');
// const CollaborationsValidator = require('./validator/collaborations');
// const ExportsValidator = require('./validator/exports');
// const UploadsValidator = require('./validator/uploads');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');
const exportsPlugin = require('./api/exports');
const uploads = require('./api/uploads');

const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService);
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService(path.resolve(__dirname, 'uploads'));

  const albumsLikes = require('./api/albumsLike');
  const AlbumsLikesService = require('./services/postgres/AlbumsLikesService');

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

  // Register plugins
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // Auth Strategy
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
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register your custom plugins
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        songsService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService,
        albumsService,
      },
    },
    {
      plugin: albumsLikes,
      options: {
        service: albumsLikesService,
        albumsService,
      },
    },
  ]);

  // Global error handler
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (!response.isBoom) return h.continue;

    const newResponse = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan di server kami.',
    });
    newResponse.code(response.output.statusCode);
    console.error('Server error:', response.message, response.stack);
    return newResponse;
  });

  // Start server
  await server.start();
  console.log(`🚀 Server OpenMusic V3 aktif di ${server.info.uri}`);
};

init();
