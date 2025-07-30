const autoBind = require('auto-bind').default;
const UsersValidator = require('../../validator/usersValidator');

class UsersHandler {
  constructor({ usersService, validator = UsersValidator }) {
    this._service = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this._service.addUser({ username, password, fullname });

    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId },
    }).code(201);
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: { user },
    };
  }
}

module.exports = UsersHandler;
