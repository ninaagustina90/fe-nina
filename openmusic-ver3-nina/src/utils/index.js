const mapSongDBToModel = ({
  id,  title, year, performer, genre, duration, album_id,
}) => ({
  id, title, year, performer, genre, duration, albumId: album_id,
});

const mapAlbumDBToModel = ({
  id, name, year, coverUrl,
}) => ({
  id, name, year, coverUrl,
});

const mapUserDBToModel = ({
  id, username, fullname,
}) => ({
  id, username, fullname,
});

const mapGetPlaylistDBToModel = ({
id, name, username,
}) => ({
  id, name, username,
});

const mapGetPlaylistActivitiesDBToModel = ({
  username, title, action, time,
}) => ({
  username, title, action, time,
});

module.exports = {
  mapAlbumDBToModel, mapSongDBToModel, mapUserDBToModel, mapGetPlaylistDBToModel, mapGetPlaylistActivitiesDBToModel,
};