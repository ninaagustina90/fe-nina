const autoBind = require('auto-bind').default;

class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

    
    }

    async postAlbumHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;

            const albumId = await this._service.addAlbum({ name, year });

            const response = h.response({
                status: 'success',
                message: 'Album successfully added',
                data: { albumId },
            });
            response.code(201);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;

        const [album, songs] = await Promise.all([
            this._service.getAlbumById(id),
            this._service.getSongsByAlbumId(id),
        ]);

        return {
            status: 'success',
            data: {
                album: {
                    ...album,
                    songs,
                },
            },
        };
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;
        const { name, year } = request.payload;

        await this._service.editAlbumById(id, { name, year });

        return {
            status: 'success',
            message: 'Album successfully updated',
        };
    }

    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;

        await this._service.deleteAlbumById(id);

        return {
            status: 'success',
            message: 'Album successfully deleted',
        };
    }
}

module.exports = AlbumsHandler;
