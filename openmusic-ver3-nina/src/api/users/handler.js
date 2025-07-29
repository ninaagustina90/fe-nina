const UsersValidator = require('../../validator/usersValidator');

const autoBind = require('auto-bind').default;

class UsersHandler {
  constructor(service) {
    this._service = service;

    autoBind(this); 
  }

  async postUserHandler(request, h) {
    UsersValidator.validateUserPayload(request.payload);

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
