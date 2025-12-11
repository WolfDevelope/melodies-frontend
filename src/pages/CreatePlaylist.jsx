import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusOutlined, CloseOutlined, SearchOutlined, MinusCircleOutlined, PlusCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Input, message, Spin } from 'antd';
import usePageTitle from '../hooks/usePageTitle';
import songService from '../services/songService';
import playlistService from '../services/playlistService';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { id: playlistId } = useParams(); // For edit mode
  usePageTitle('Melodies - Tạo danh sách phát');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlistImage, setPlaylistImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allSongs, setAllSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(playlistId || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlaylistImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get playlist ID from URL params or location state
  useEffect(() => {
    if (playlistId) {
      setCurrentPlaylistId(playlistId);
    }
  }, [playlistId]);

  // Auto-update playlist info when name/description/image changes
  useEffect(() => {
    if (!currentPlaylistId) return;

    const timer = setTimeout(async () => {
      try {
        await playlistService.updatePlaylistInfo(currentPlaylistId, {
          name: playlistName || 'Danh sách phát của tôi',
          description: playlistDescription,
          image: playlistImage,
        });
        console.log('Auto-saved playlist info');
      } catch (error) {
        console.error('Error updating playlist:', error);
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [playlistName, playlistDescription, playlistImage, currentPlaylistId]);

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) {
      message.error('Vui lòng nhập tên danh sách phát');
      return;
    }

    message.success('Đã tạo danh sách phát thành công!');
    navigate('/home');
  };

  const handleCancel = () => {
    navigate('/home', { replace: true });
  };

  // Fetch all songs on component mount
  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const response = await songService.getAllSongs();
        const songs = response.data || [];
        
        // Debug: Check song structure
        if (songs.length > 0) {
          console.log('First song structure:', songs[0]);
          console.log('Song ID field:', songs[0].id, songs[0]._id);
        }
        
        // Normalize songs: ensure each song has an 'id' field
        // MongoDB uses _id, but we want to use 'id' consistently
        const normalizedSongs = songs.map(song => ({
          ...song,
          id: song._id || song.id || song.songId // MongoDB _id first
        }));
        
        setAllSongs(normalizedSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
        message.error('Không thể tải danh sách bài hát');
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  // Search songs when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      const filtered = allSongs.filter(song => {
        const searchLower = searchQuery.toLowerCase();
        
        // Handle artist field (could be string, object, or array)
        let artistName = '';
        if (typeof song.artist === 'string') {
          artistName = song.artist;
        } else if (song.artist?.name) {
          artistName = song.artist.name;
        } else if (Array.isArray(song.artist) && song.artist.length > 0) {
          artistName = song.artist[0]?.name || song.artist[0] || '';
        }
        
        // Handle album field (could be string or object)
        let albumName = '';
        if (typeof song.album === 'string') {
          albumName = song.album;
        } else if (song.album?.name) {
          albumName = song.album.name;
        }
        
        return (
          song.title?.toLowerCase().includes(searchLower) ||
          artistName.toLowerCase().includes(searchLower) ||
          albumName.toLowerCase().includes(searchLower)
        );
      });
      setSearchResults(filtered);
      setSearching(false);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, allSongs]);

  // Add song to playlist
  const handleAddSong = async (song) => {
    console.log('Adding song:', song.id, song.title);
    console.log('Current playlist:', playlistSongs.map(s => s.id));
    console.log('Current playlist ID:', currentPlaylistId);
    console.log('Song ID to add:', song.id || song._id);
    
    // Use string comparison to avoid type mismatch
    if (playlistSongs.find(s => String(s.id) === String(song.id))) {
      message.warning('Bài hát đã có trong danh sách phát');
      return;
    }

    if (!currentPlaylistId) {
      message.error('Chưa tạo playlist. Vui lòng đợi...');
      return;
    }

    try {
      setIsSaving(true);
      
      console.log('Calling API: addSongToPlaylist', currentPlaylistId, song.id || song._id);
      
      // Add to DB first
      const response = await playlistService.addSongToPlaylist(currentPlaylistId, song.id || song._id);
      console.log('API Response:', response);
      
      // Then update local state
      const newPlaylist = [...playlistSongs, song];
      console.log('New playlist:', newPlaylist.map(s => s.id));
      setPlaylistSongs(newPlaylist);
      message.success(`Đã thêm "${song.title}"`);
    } catch (error) {
      console.error('Error adding song:', error);
      message.error('Không thể thêm bài hát');
    } finally {
      setIsSaving(false);
    }
  };

  // Remove song from playlist
  const handleRemoveSong = async (songId) => {
    console.log('Removing song:', songId);

    if (!currentPlaylistId) {
      message.error('Chưa tạo playlist');
      return;
    }

    try {
      setIsSaving(true);
      
      // Remove from DB first
      await playlistService.removeSongFromPlaylist(currentPlaylistId, songId);
      
      // Then update local state
      // Use string comparison to avoid type mismatch
      setPlaylistSongs(playlistSongs.filter(s => String(s.id) !== String(songId)));
      message.success('Đã xóa bài hát khỏi danh sách phát');
    } catch (error) {
      console.error('Error removing song:', error);
      message.error('Không thể xóa bài hát');
    } finally {
      setIsSaving(false);
    }
  };

  // Check if song is in playlist
  const isSongInPlaylist = (songId) => {
    // Ensure both IDs are compared as strings to avoid type mismatch
    const songIdStr = String(songId);
    const isIn = playlistSongs.some(s => String(s.id) === songIdStr);
    console.log(`Checking song ${songId} (${typeof songId}):`, isIn, 'Playlist IDs:', playlistSongs.map(s => `${s.id} (${typeof s.id})`));
    return isIn;
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get artist name from various formats
  const getArtistName = (artist) => {
    if (!artist) return 'Unknown';
    if (typeof artist === 'string') return artist;
    if (artist.name) return artist.name;
    if (Array.isArray(artist) && artist.length > 0) {
      return artist[0]?.name || artist[0] || 'Unknown';
    }
    return 'Unknown';
  };

  // Get album name from various formats
  const getAlbumName = (album) => {
    if (!album) return '-';
    if (typeof album === 'string') return album;
    if (album.name) return album.name;
    return '-';
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] overflow-y-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#2a2a3e] to-[#1a1a2e] px-6 py-8 relative">
        {/* Close Button - Top Right */}
        <button
          onClick={handleCancel}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
          title="Đóng"
        >
          <CloseOutlined style={{ fontSize: '20px', color: 'white' }} />
        </button>

        <div className="flex items-start gap-6">
          {/* Playlist Cover Image */}
          <div className="relative group">
            <div className="w-56 h-56 bg-[#282828] rounded shadow-2xl flex items-center justify-center overflow-hidden">
              {playlistImage ? (
                <img
                  src={playlistImage}
                  alt="Playlist cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>
            <label
              htmlFor="playlist-image-upload"
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center rounded"
            >
              <div className="text-center">
                <PlusOutlined className="text-white text-3xl mb-2" />
                <p className="text-white text-sm font-semibold">Chọn ảnh</p>
              </div>
            </label>
            <input
              id="playlist-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Playlist Info */}
          <div className="flex-1 flex flex-col justify-end">
            <p className="text-sm text-white font-semibold mb-2">
              Danh sách phát công khai
            </p>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Danh sách phát của tôi #3"
              className="text-6xl font-bold text-white bg-transparent border-none outline-none mb-4 placeholder-gray-400"
              style={{
                caretColor: 'white',
              }}
            />
            <div className="text-sm text-gray-300">
              <input
                type="text"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Ấn"
                className="bg-transparent border-none outline-none placeholder-gray-500 text-gray-300"
                style={{
                  caretColor: 'white',
                }}
              />
              {playlistSongs.length > 0 && (
                <span className="ml-2">
                  • {playlistSongs.length} bài hát, {Math.floor(playlistSongs.reduce((acc, song) => acc + (song.duration || 0), 0) / 60)} phút {playlistSongs.reduce((acc, song) => acc + (song.duration || 0), 0) % 60} giây
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-6 flex items-center gap-4">
        <button
          onClick={handleCreatePlaylist}
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-all hover:scale-105"
        >
          <svg
            className="w-6 h-6 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg
            className="w-6 h-6 text-gray-400 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        <div className="ml-auto flex items-center gap-4">
          <span className="text-gray-400 text-sm">Danh sách</span>
          <button className="p-2 hover:bg-white/10 rounded transition-colors">
            <svg
              className="w-5 h-5 text-gray-400 hover:text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Playlist Songs Table */}
      {playlistSongs.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white/5 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_3fr_2fr_2fr_auto_auto] gap-4 px-4 py-3 border-b border-white/10 text-gray-400 text-sm">
              <div className="text-center">#</div>
              <div>Tiêu đề</div>
              <div>Nghệ sĩ</div>
              <div>Album</div>
              <div className="text-center"><ClockCircleOutlined /></div>
              <div className="w-10"></div>
            </div>

            {/* Table Body */}
            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-[auto_3fr_2fr_2fr_auto_auto] gap-4 px-4 py-3 hover:bg-white/10 transition-colors group items-center"
              >
                <div className="text-gray-400 text-center text-sm">{index + 1}</div>
                <div className="flex items-center gap-3">
                  <img
                    src={song.image || 'https://via.placeholder.com/40'}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <span className="text-white font-medium truncate">{song.title}</span>
                </div>
                <div className="text-gray-400 text-sm truncate">{getArtistName(song.artist)}</div>
                <div className="text-gray-400 text-sm truncate">{getAlbumName(song.album)}</div>
                <div className="text-gray-400 text-sm text-center">{formatDuration(song.duration)}</div>
                <button
                  onClick={() => handleRemoveSong(song.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full"
                  title="Xóa khỏi danh sách phát"
                >
                  <MinusCircleOutlined style={{ fontSize: '18px', color: '#ef4444' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="px-6 pb-6">
        <h2 className="text-white text-2xl font-bold mb-4">
          Hãy cùng tìm nội dung cho danh sách phát của bạn
        </h2>
        <div className="relative max-w-md">
          <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" style={{ fontSize: '18px' }} />
          <Input
            placeholder="Tìm bài hát và tập podcast"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-4 py-3 rounded bg-[#242424] text-white placeholder-gray-400 border-none hover:bg-[#2a2a2a] transition-colors"
            style={{
              backgroundColor: '#242424',
              color: 'white',
              paddingLeft: '44px',
              boxShadow: 'none',
              outline: 'none',
              border: 'none',
            }}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="px-6 pb-20">
          {searching ? (
            <div className="text-center py-8">
              <Spin size="large" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="bg-white/5 rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[auto_3fr_2fr_2fr_auto_auto] gap-4 px-4 py-3 border-b border-white/10 text-gray-400 text-sm">
                <div className="text-center">#</div>
                <div>Tiêu đề</div>
                <div>Nghệ sĩ</div>
                <div>Album</div>
                <div className="text-center"><ClockCircleOutlined /></div>
                <div className="w-10"></div>
              </div>

              {/* Table Body */}
              {searchResults.map((song, index) => {
                const isInPlaylist = isSongInPlaylist(song.id);
                return (
                  <div
                    key={song.id}
                    className="grid grid-cols-[auto_3fr_2fr_2fr_auto_auto] gap-4 px-4 py-3 hover:bg-white/10 transition-colors group items-center"
                  >
                    <div className="text-gray-400 text-center text-sm">{index + 1}</div>
                    <div className="flex items-center gap-3">
                      <img
                        src={song.image || 'https://via.placeholder.com/40'}
                        alt={song.title}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="text-white font-medium truncate">{song.title}</span>
                    </div>
                    <div className="text-gray-400 text-sm truncate">{getArtistName(song.artist)}</div>
                    <div className="text-gray-400 text-sm truncate">{getAlbumName(song.album)}</div>
                    <div className="text-gray-400 text-sm text-center">{formatDuration(song.duration)}</div>
                    <button
                      onClick={() => isInPlaylist ? handleRemoveSong(song.id) : handleAddSong(song)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full"
                      title={isInPlaylist ? 'Xóa khỏi danh sách phát' : 'Thêm vào danh sách phát'}
                    >
                      {isInPlaylist ? (
                        <MinusCircleOutlined style={{ fontSize: '18px', color: '#ef4444' }} />
                      ) : (
                        <PlusCircleOutlined style={{ fontSize: '18px', color: '#22c55e' }} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Không tìm thấy kết quả nào</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchQuery && playlistSongs.length === 0 && (
        <div className="px-6 pb-20 text-center">
          <p className="text-gray-400 text-sm">
            Tìm kiếm bài hát hoặc podcast để thêm vào danh sách phát
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePlaylist;
