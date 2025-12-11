import api from './api';

/**
 * Playlist API Service
 */
const playlistService = {
  /**
   * Create new playlist
   * @param {Object} playlistData - { name, description, image, isPublic }
   * @returns {Promise}
   */
  createPlaylist: (playlistData) => {
    return api.post('/playlists', playlistData);
  },

  /**
   * Get user's playlists
   * @returns {Promise}
   */
  getUserPlaylists: () => {
    return api.get('/playlists');
  },

  /**
   * Get playlist by ID
   * @param {string} id - Playlist ID
   * @returns {Promise}
   */
  getPlaylistById: (id) => {
    return api.get(`/playlists/${id}`);
  },

  /**
   * Update playlist info
   * @param {string} id - Playlist ID
   * @param {Object} updateData - { name, description, image, isPublic }
   * @returns {Promise}
   */
  updatePlaylistInfo: (id, updateData) => {
    return api.put(`/playlists/${id}`, updateData);
  },

  /**
   * Add song to playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} songId - Song ID
   * @returns {Promise}
   */
  addSongToPlaylist: (playlistId, songId) => {
    return api.post(`/playlists/${playlistId}/songs`, { songId });
  },

  /**
   * Remove song from playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} songId - Song ID
   * @returns {Promise}
   */
  removeSongFromPlaylist: (playlistId, songId) => {
    return api.delete(`/playlists/${playlistId}/songs/${songId}`);
  },

  /**
   * Delete playlist
   * @param {string} id - Playlist ID
   * @returns {Promise}
   */
  deletePlaylist: (id) => {
    return api.delete(`/playlists/${id}`);
  },
};

export default playlistService;
