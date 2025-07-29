module.exports = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    options: {
      handler: handler.postAlbumsCoversHandler,
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1000000, // 1MB
      },
      auth: 'openmusic_jwt',
    },
  },
];
