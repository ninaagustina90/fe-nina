const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const CollaborationValidatorSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const CollaborationValidator = {
  validateCollaborationPayload: (payload) => {
    const result = CollaborationValidatorSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = CollaborationValidator;
