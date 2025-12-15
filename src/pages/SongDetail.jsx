import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { PlusOutlined, HeartOutlined, HeartFilled, MoreOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import usePageTitle from '../hooks/usePageTitle';
import songService from '../services/songService';
import playlistService from '../services/playlistService';
import PlayButton from '../components/common/PlayButton';

const SongDetail = () => {
  const navigate = useNavigate();
  const { id: songId } = useParams();
  const { setCurrentTrack } = useOutletContext();
  usePageTitle('Melodies - Song');
  
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likedPlaylistId, setLikedPlaylistId] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [relatedSongs, setRelatedSongs] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);

  const LIKED_PLAYLIST_ID_KEY = 'melodies_liked_playlist_id';
  const LIKED_SONG_IDS_KEY = 'melodies_liked_song_ids';

  const readLikedSongIdsCache = () => {
    try {
      const raw = localStorage.getItem(LIKED_SONG_IDS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  };

  const writeLikedSongIdsCache = (ids) => {
    try {
      localStorage.setItem(LIKED_SONG_IDS_KEY, JSON.stringify(ids.map(String)));
    } catch {
      // ignore
    }
  };

  const readLikedPlaylistIdCache = () => {
    try {
      return localStorage.getItem(LIKED_PLAYLIST_ID_KEY);
    } catch {
      return null;
    }
  };

  const writeLikedPlaylistIdCache = (id) => {
    try {
      if (id) localStorage.setItem(LIKED_PLAYLIST_ID_KEY, String(id));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (songId) {
      fetchSongDetails();
      fetchRelatedSongs();

      // Fast path: optimistic render from cache (no network)
      const cachedIds = readLikedSongIdsCache();
      setIsLiked(cachedIds.includes(String(songId)));

      // Background sync with server
      syncLikedStatus();
    }
  }, [songId]);

  const fetchSongDetails = async () => {
    setLoading(true);
    try {
      const response = await songService.getSongById(songId);
      setSong(response.data);
      
      // Fetch artist's other songs
      if (response.data.artist?._id) {
        fetchArtistSongs(response.data.artist._id);
      }
    } catch (error) {
      console.error('Error fetching song:', error);
      message.error('Không thể tải thông tin bài hát');
    } finally {
      setLoading(false);
    }
  };

  const isLikedPlaylistName = (name) => {
    const n = (name || '').toLowerCase().trim();
    return n === 'bài hát yêu thích' || n === 'bài hát đã thích' || n === 'liked songs';
  };

  const extractPlaylistSongIds = (playlist) => {
    const songs = playlist?.songs || [];
    return songs
      .map((s) => {
        if (!s) return null;
        if (typeof s === 'string') return s;
        return s._id || s.id || null;
      })
      .filter(Boolean)
      .map(String);
  };

  const getOrCreateLikedPlaylistId = async ({ createIfMissing }) => {
    const cachedId = likedPlaylistId || readLikedPlaylistIdCache();
    if (cachedId) {
      setLikedPlaylistId(cachedId);
      return cachedId;
    }

    const playlistsRes = await playlistService.getUserPlaylists();
    const playlists = playlistsRes.data || [];
    const likedPlaylist = playlists.find((p) => isLikedPlaylistName(p?.name));

    if (likedPlaylist?._id) {
      setLikedPlaylistId(likedPlaylist._id);
      writeLikedPlaylistIdCache(likedPlaylist._id);
      return likedPlaylist._id;
    }

    if (!createIfMissing) return null;

    const createRes = await playlistService.createPlaylist({
      name: 'Bài hát yêu thích',
      description: '',
      image: null,
      isPublic: false,
    });

    const newId = createRes.data?._id;
    if (newId) {
      setLikedPlaylistId(newId);
      writeLikedPlaylistIdCache(newId);
    }
    return newId;
  };

  const syncLikedStatus = async () => {
    try {
      const playlistId = await getOrCreateLikedPlaylistId({ createIfMissing: false });
      if (!playlistId) {
        setIsLiked(false);
        return;
      }

      const playlistRes = await playlistService.getPlaylistById(playlistId);
      const songIds = extractPlaylistSongIds(playlistRes.data);

      // Update cache + UI based on server truth
      writeLikedSongIdsCache(songIds);
      setIsLiked(songIds.includes(String(songId)));
    } catch (error) {
      // Keep cached UI state on sync failure
    }
  };

  const fetchRelatedSongs = async () => {
    try {
      const response = await songService.getAllSongs();
      const allSongs = response.data || response.songs || [];
      // Get random 5 songs as related
      const shuffled = allSongs.sort(() => 0.5 - Math.random());
      setRelatedSongs(shuffled.slice(0, 5));
    } catch (error) {
      console.error('Error fetching related songs:', error);
    }
  };

  const fetchArtistSongs = async (artistId) => {
    try {
      const response = await songService.getAllSongs();
      const allSongs = response.data || response.songs || [];
      // Filter songs by artist
      const filtered = allSongs.filter(s => 
        s.artist?._id === artistId && s._id !== songId
      );
      setArtistSongs(filtered.slice(0, 5));
    } catch (error) {
      console.error('Error fetching artist songs:', error);
    }
  };

  const handlePlaySong = () => {
    if (!song) return;
    setCurrentTrack({
      _id: song._id,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      audioUrl: song.audioUrl,
      duration: song.duration,
    });
  };

  const handleToggleLike = async () => {
    if (likeLoading) return;
    if (!songId) return;

    const songIdStr = String(songId);
    const prevLiked = isLiked;

    // Optimistic UI + cache update first
    const prevIds = readLikedSongIdsCache();
    const nextLiked = !prevLiked;
    const nextIds = nextLiked
      ? Array.from(new Set([...prevIds, songIdStr]))
      : prevIds.filter((id) => String(id) !== songIdStr);
    writeLikedSongIdsCache(nextIds);
    setIsLiked(nextLiked);

    setLikeLoading(true);
    try {
      const playlistId = await getOrCreateLikedPlaylistId({ createIfMissing: nextLiked });
      if (!playlistId) {
        throw new Error('Missing liked playlist id');
      }

      if (nextLiked) {
        await playlistService.addSongToPlaylist(playlistId, songIdStr);
        message.success('Đã thêm vào Bài hát yêu thích');
      } else {
        await playlistService.removeSongFromPlaylist(playlistId, songIdStr);
        message.success('Đã xóa khỏi Bài hát yêu thích');
      }
    } catch (error) {
      console.error('Error toggling like:', error);

      // Rollback optimistic update on failure
      writeLikedSongIdsCache(prevIds);
      setIsLiked(prevLiked);

      message.error('Không thể cập nhật Bài hát yêu thích');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddToPlaylist = () => {
    message.info('Thêm vào danh sách phát');
  };

  const getArtistName = (artist) => {
    if (!artist) return 'Unknown Artist';
    if (typeof artist === 'string') return artist;
    if (artist.name) return artist.name;
    return 'Unknown Artist';
  };

  const getAlbumName = (album) => {
    if (!album) return null;
    if (typeof album === 'string') return album;
    if (album.title) return album.title;
    if (album.name) return album.name;
    return null;
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    if (typeof duration === 'string') return duration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays) => {
    if (!plays) return '0';
    if (plays >= 1000000000) return (plays / 1000000000).toFixed(1) + 'B';
    if (plays >= 1000000) return (plays / 1000000).toFixed(1) + 'M';
    if (plays >= 1000) return (plays / 1000).toFixed(1) + 'K';
    return plays.toString();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]">
        <Spin size="large" />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]">
        <p className="text-white text-xl">Không tìm thấy bài hát</p>
      </div>
    );
  }

  const albumName = getAlbumName(song.album);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] overflow-y-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#2d5a7b] to-[#1a1a2e] px-8 pt-20 pb-8">
        <div className="flex items-end gap-6">
          {/* Album Cover */}
          <div className="flex-shrink-0">
            <img
              src={
                song.thumbnail ||
                song.image ||
                song.coverImage ||
                'https://via.placeholder.com/232'
              }
              alt={song.title}
              className="w-58 h-58 rounded shadow-2xl"
            />
          </div>

          {/* Song Info */}
          <div className="flex-1 pb-2">
            <p className="text-white text-sm font-semibold mb-2">Bài hát</p>
            <h1 className="text-white text-7xl font-bold mb-6 leading-tight">
              {song.title}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              {song.artist?.image && (
                <img
                  src={song.artist.image}
                  alt={getArtistName(song.artist)}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-white font-semibold hover:underline cursor-pointer">
                {getArtistName(song.artist)}
              </span>
              {albumName && (
                <>
                  <span className="text-white">•</span>
                  <span className="text-white">{albumName}</span>
                </>
              )}
              <span className="text-white">•</span>
              <span className="text-white">{song.releaseYear || '2024'}</span>
              <span className="text-white">•</span>
              <span className="text-white">{formatDuration(song.duration)}</span>
              <span className="text-white">•</span>
              <span className="text-white">{formatPlays(song.plays)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6 flex items-center gap-6 bg-gradient-to-b from-[#1a1a2e]/80 to-transparent">
        <PlayButton size={56} onClick={handlePlaySong} />

        <button
          onClick={handleToggleLike}
          className={`w-10 h-10 flex items-center justify-center transition-transform ${
            likeLoading ? 'opacity-60' : 'hover:scale-110'
          }`}
        >
          {isLiked ? (
            <HeartFilled style={{ fontSize: '32px', color: '#ec4899' }} />
          ) : (
            <HeartOutlined style={{ fontSize: '32px', color: '#f472b6' }} />
          )}
        </button>

        <button
          onClick={handleAddToPlaylist}
          className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <PlusOutlined style={{ fontSize: '32px', color: '#b3b3b3' }} />
        </button>

        <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
          <MoreOutlined style={{ fontSize: '32px', color: '#b3b3b3' }} />
        </button>
      </div>

      {/* Lyrics Section */}
      <div className="px-8 py-8">
        <h2 className="text-white text-2xl font-bold mb-6">Lời bài hát</h2>
        {song.lyrics ? (
          <>
            <div className="text-white text-base leading-relaxed whitespace-pre-line max-w-3xl">
              {song.lyrics}
            </div>
            <button className="mt-4 text-white font-semibold hover:underline">
              ...Xem thêm
            </button>
          </>
        ) : (
          <div className="text-gray-400 text-base">
            Chưa có lời cho bài hát này
          </div>
        )}
      </div>

      {/* Artist Info Section */}
      {song.artist && (
        <div className="px-8 py-8">
          <h2 className="text-white text-2xl font-bold mb-6">Nghệ sĩ</h2>
          <div 
            className="flex items-center gap-4 p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors cursor-pointer max-w-md"
            onClick={() => navigate(`/artist/${song.artist._id}`)}
          >
            <img
              src={
                song.artist.image ||
                song.artist.avatar ||
                song.artist.thumbnail ||
                song.artist.coverImage ||
                'https://via.placeholder.com/80'
              }
              alt={getArtistName(song.artist)}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="text-white font-semibold text-lg hover:underline">
                {getArtistName(song.artist)}
              </p>
              <p className="text-gray-400 text-sm">Nghệ sĩ</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Songs Section */}
      {relatedSongs.length > 0 && (
        <div className="px-8 py-8">
          <h2 className="text-white text-2xl font-bold mb-6">Đề xuất</h2>
          <p className="text-gray-400 text-sm mb-4">Dựa trên bài hát này</p>
          <div className="space-y-2">
            {relatedSongs.map((relatedSong, index) => (
              <div
                key={relatedSong._id}
                onClick={() => navigate(`/song/${relatedSong._id}`)}
                className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 rounded hover:bg-white/10 transition-colors cursor-pointer items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm w-4">{index + 1}</span>
                  <img
                    src={
                      relatedSong.thumbnail ||
                      relatedSong.image ||
                      relatedSong.coverImage ||
                      'https://via.placeholder.com/40'
                    }
                    alt={relatedSong.title}
                    className="w-10 h-10 rounded"
                  />
                  <div>
                    <p className="text-white font-medium hover:underline">
                      {relatedSong.title}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {getArtistName(relatedSong.artist)}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm text-right">
                  {formatPlays(relatedSong.plays)}
                </div>
                <div className="text-gray-400 text-sm">
                  {formatDuration(relatedSong.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Artist's Other Songs */}
      {artistSongs.length > 0 && (
        <div className="px-8 py-8 pb-24">
          <h2 className="text-white text-2xl font-bold mb-6">
            Các bài hát khác của {getArtistName(song.artist)}
          </h2>
          <div className="space-y-2">
            {artistSongs.map((artistSong, index) => (
              <div
                key={artistSong._id}
                onClick={() => navigate(`/song/${artistSong._id}`)}
                className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 rounded hover:bg-white/10 transition-colors cursor-pointer items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm w-4">{index + 1}</span>
                  <img
                    src={
                      artistSong.thumbnail ||
                      artistSong.image ||
                      artistSong.coverImage ||
                      'https://via.placeholder.com/40'
                    }
                    alt={artistSong.title}
                    className="w-10 h-10 rounded"
                  />
                  <div>
                    <p className="text-white font-medium hover:underline">
                      {artistSong.title}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {getArtistName(artistSong.artist)}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm text-right">
                  {formatPlays(artistSong.plays)}
                </div>
                <div className="text-gray-400 text-sm">
                  {formatDuration(artistSong.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetail;
