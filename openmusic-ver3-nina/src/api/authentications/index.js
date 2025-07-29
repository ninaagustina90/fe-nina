const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  version: "1.0.0",
  register: async (
    server,
    // ketika ditangkap di index dijadikan usersService, authenticationsService, tokenManager
    { usersService, authenticationsService, tokenManager }
  ) => {
    // dan dikirim di handler
    const authenticationsHandler = new AuthenticationsHandler(
      usersService,
      authenticationsService,
      tokenManager
    );

    server.route(routes(authenticationsHandler));
  },
};
