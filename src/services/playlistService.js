import api from './api';

const getUserId = () => {
  try {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

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
    const userId = getUserId();
    return api.post('/playlists', {
      ...playlistData,
      ...(userId ? { userId } : {}),
    });
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
    const userId = getUserId();
    return api.put(`/playlists/${id}`, {
      ...updateData,
      ...(userId ? { userId } : {}),
    });
  },

  /**
   * Add song to playlist
   * @param {string} playlistId - Playlist ID
   * @param {string} songId - Song ID
   * @returns {Promise}
   */
  addSongToPlaylist: (playlistId, songId) => {
    const userId = getUserId();
    return api.post(`/playlists/${playlistId}/songs`, {
      songId,
      ...(userId ? { userId } : {}),
    });
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
