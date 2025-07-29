const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const result = PlaylistSongPayloadSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
