const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().integer().optional(),
  albumId: Joi.string().optional(),
});

const SongsValidator = {
  validateSongPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

module.exports = SongsValidator;
