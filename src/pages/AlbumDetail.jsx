import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { PlayCircleOutlined, HeartOutlined, HeartFilled, PlusOutlined, DownloadOutlined, MoreOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import usePageTitle from '../hooks/usePageTitle';
import albumService from '../services/albumService';
import songService from '../services/songService';
import PlayButton from '../components/common/PlayButton';

const AlbumDetail = () => {
  const navigate = useNavigate();
  const { id: albumId } = useParams();
  const { setCurrentTrack } = useOutletContext();
  usePageTitle('Melodies - Album');
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [albumSongs, setAlbumSongs] = useState([]);
  const [relatedAlbums, setRelatedAlbums] = useState([]);

  useEffect(() => {
    if (albumId) {
      (async () => {
        setLoading(true);
        try {
          const response = await albumService.getAlbumById(albumId);
          const albumData = response.data;
          setAlbum(albumData);

          const rawSongRefs = albumData?.songs || [];
          const songIds = rawSongRefs
            .map((ref) => {
              if (!ref) return null;
              if (typeof ref === 'string') return ref;
              return ref?._id || ref?.id || null;
            })
            .map((id) => (id ? String(id) : null))
            .filter((id) => !!id && /^[a-fA-F0-9]{24}$/.test(id));

          if (songIds.length > 0) {
            const songResults = await Promise.all(
              songIds.map((id) =>
                songService
                  .getSongById(id)
                  .then((res) => res.data)
                  .catch(() => null)
              )
            );
            setAlbumSongs(songResults.filter(Boolean));
          } else {
            setAlbumSongs([]);
          }

          fetchRelatedAlbums();
        } catch (error) {
          console.error('Error fetching album:', error);
          message.error('Không thể tải thông tin album');
          setAlbum(null);
          setAlbumSongs([]);
        } finally {
          setLoading(false);
        }
      })();

      // Sync favorite state from DB
      (async () => {
        try {
          const res = await albumService.getFavoriteAlbums();
          const ids = (res.data || []).map((a) => String(a?._id));
          setIsLiked(ids.includes(String(albumId)));
        } catch {
          setIsLiked(false);
        }
      })();

    }
  }, [albumId]);

  const fetchRelatedAlbums = async () => {
    try {
      const response = await albumService.getAllAlbums();
      // Get random 5 albums as related
      const shuffled = response.data
        .filter(a => a._id !== albumId)
        .sort(() => 0.5 - Math.random());
      setRelatedAlbums(shuffled.slice(0, 5));
    } catch (error) {
      console.error('Error fetching related albums:', error);
    }
  };

  const handlePlayAlbum = () => {
    const firstSong = albumSongs.find((s) => s?.audioUrl);
    if (!firstSong) {
      message.warning('Album chưa có bài hát để phát');
      return;
    }
    setCurrentTrack({
      _id: firstSong._id,
      title: firstSong.title,
      artist: firstSong.artist,
      thumbnail: firstSong.thumbnail,
      audioUrl: firstSong.audioUrl,
      duration: firstSong.duration,
    });
  };

  const handleToggleLike = async () => {
    if (likeLoading) return;
    if (!albumId) return;

    const albumIdStr = String(albumId);
    const prevLiked = isLiked;
    const nextLiked = !prevLiked;

    // Optimistic update
    setIsLiked(nextLiked);

    setLikeLoading(true);
    try {
      if (nextLiked) {
        await albumService.favoriteAlbum(albumIdStr);
        message.success('Đã thêm album vào thư viện');
      } else {
        await albumService.unfavoriteAlbum(albumIdStr);
        message.success('Đã xóa album khỏi thư viện');
      }
    } catch (error) {
      console.error('Error toggling favorite album:', error);
      setIsLiked(prevLiked);
      message.error('Không thể cập nhật album yêu thích');
    } finally {
      setLikeLoading(false);
    }
  };

  const getArtistName = (artist) => {
    if (!artist) return 'Unknown Artist';
    if (typeof artist === 'string') return artist;
    if (artist.name) return artist.name;
    return 'Unknown Artist';
  };

  const getAlbumName = (album) => {
    if (!album) return '-';
    if (typeof album === 'string') return album;
    if (album.title) return album.title;
    if (album.name) return album.name;
    return '-';
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    if (typeof duration === 'string') return duration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - d);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} ngày trước`;
    }
  };

  const getTotalDuration = () => {
    const total = albumSongs.reduce((acc, song) => {
      const duration = typeof song.duration === 'string' 
        ? parseInt(song.duration.split(':')[0]) * 60 + parseInt(song.duration.split(':')[1])
        : song.duration;
      return acc + (duration || 0);
    }, 0);
    
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    
    if (hours > 0) {
      return `khoảng ${hours} giờ ${minutes} phút`;
    }
    return `khoảng ${minutes} phút`;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]">
        <Spin size="large" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]">
        <p className="text-white text-xl">Không tìm thấy album</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] overflow-y-auto">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#7c3a5e] to-[#1a1a2e] px-8 pt-20 pb-8">
        <div className="flex items-end gap-6">
          {/* Album Cover */}
          <div className="flex-shrink-0">
            <img
              src={album.coverImage || 'https://via.placeholder.com/232'}
              alt={album.title}
              className="w-58 h-58 rounded shadow-2xl"
            />
          </div>

          {/* Album Info */}
          <div className="flex-1 pb-2">
            <p className="text-white text-sm font-semibold mb-2">
              {album.genre || 'Danh sách phát công khai'}
            </p>
            <h1 className="text-white text-7xl font-bold mb-6 leading-tight">
              {album.title}
            </h1>
            <p className="text-white text-sm mb-4">
              {album.description || ''}
            </p>
            <div className="flex items-center gap-2 text-sm">
              
              
              <span className="text-white">•</span>
              <span className="text-white">{album.likes?.toLocaleString() || '28,325'} lượt thích</span>
              <span className="text-white">•</span>
              <span className="text-white">{albumSongs.length} bài hát, {getTotalDuration()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6 flex items-center gap-4 bg-gradient-to-b from-[#1a1a2e]/80 to-transparent">
        <PlayButton size={56} onClick={handlePlayAlbum} />

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

        <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
          <PlusOutlined style={{ fontSize: '32px', color: '#b3b3b3' }} />
        </button>

        <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
          <DownloadOutlined style={{ fontSize: '32px', color: '#b3b3b3' }} />
        </button>

        <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
          <MoreOutlined style={{ fontSize: '32px', color: '#b3b3b3' }} />
        </button>

        <div className="flex-1"></div>

        <button className="flex items-center gap-2 text-gray-400 hover:text-white">
          <span className="text-sm font-semibold">Rút gọn</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 2h5v2H4v3H2V2zm9 0h5v5h-2V4h-3V2zM2 11h2v3h3v2H2v-5zm12 0h2v5h-5v-2h3v-3z"/>
          </svg>
        </button>
      </div>

      {/* Songs Table */}
      <div className="px-8 py-4">
        <div className="mb-4">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-gray-700 text-gray-400 text-sm">
            <div className="w-8 text-center">#</div>
            <div>Tiêu đề</div>
            <div>Nghệ sĩ</div>
            <div>Album</div>
            <div className="w-16 text-center">
              <ClockCircleOutlined />
            </div>
          </div>

          {/* Table Body */}
          <div className="mt-2">
            {albumSongs.map((song, index) => (
              <div
                key={song._id}
                onClick={() => navigate(`/song/${song._id}`)}
                className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-3 rounded hover:bg-white/10 transition-colors cursor-pointer group items-center"
              >
                <div className="w-8 text-center text-gray-400 text-sm">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={
                      song.thumbnail ||
                      song.image ||
                      song.coverImage ||
                      'https://via.placeholder.com/40'
                    }
                    alt={song.title}
                    className="w-10 h-10 rounded"
                  />
                  <div>
                    <p className="text-white font-medium hover:underline">
                      {song.title}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 text-sm hover:text-white hover:underline">
                  {getArtistName(song.artist)}
                </div>
                <div className="text-gray-400 text-sm hover:text-white hover:underline">
                  {getAlbumName(song.album)}
                </div>
                <div className="w-16 text-center text-gray-400 text-sm">
                  {formatDuration(song.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Album Info Footer */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>{new Date(album.releaseDate || Date.now()).toLocaleDateString('vi-VN', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</p>
        </div>
      </div>

      {/* Related Albums Section */}
      {relatedAlbums.length > 0 && (
        <div className="px-8 py-8 pb-24">
          <h2 className="text-white text-2xl font-bold mb-6">Có thể bạn cũng thích</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {relatedAlbums.map((relatedAlbum) => (
              <div
                key={relatedAlbum._id}
                onClick={() => navigate(`/album/${relatedAlbum._id}`)}
                className="p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all cursor-pointer group"
              >
                <div className="relative mb-4">
                  <img
                    src={relatedAlbum.coverImage || 'https://via.placeholder.com/200'}
                    alt={relatedAlbum.title}
                    className="w-full aspect-square object-cover rounded shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl flex items-center justify-center">
                    <PlayCircleOutlined style={{ fontSize: '24px', color: 'black' }} />
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-1 truncate">
                  {relatedAlbum.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  Của Spotify
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDetail;
