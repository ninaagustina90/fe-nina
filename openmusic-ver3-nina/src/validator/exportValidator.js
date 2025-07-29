const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({tlds: true}).required(),
});

const ExportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ExportsValidator;
