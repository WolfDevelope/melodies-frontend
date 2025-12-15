import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { PlayCircleOutlined, CheckCircleOutlined, MoreOutlined, SwapOutlined } from '@ant-design/icons';
import { message, Spin } from 'antd';
import usePageTitle from '../hooks/usePageTitle';
import artistService from '../services/artistService';
import songService from '../services/songService';
import albumService from '../services/albumService';
import PlayButton from '../components/common/PlayButton';

const ArtistDetail = () => {
  const navigate = useNavigate();
  const { id: artistId } = useParams();
  const { setCurrentTrack } = useOutletContext();
  usePageTitle('Melodies - Artist');
  
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popularSongs, setPopularSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [showAllSongs, setShowAllSongs] = useState(false);

  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (artistId) {
      fetchArtistDetails();
      fetchArtistSongs();
      fetchArtistAlbums();

      // Sync follow state from DB
      (async () => {
        try {
          const res = await artistService.getFollowedArtists();
          const ids = (res.data || []).map((a) => String(a?._id));
          setIsFollowed(ids.includes(String(artistId)));
        } catch {
          setIsFollowed(false);
        }
      })();
    }
  }, [artistId]);

  const handleToggleFollow = async () => {
    if (followLoading) return;
    if (!artistId) return;

    const artistIdStr = String(artistId);
    const prevFollowed = isFollowed;
    const nextFollowed = !prevFollowed;

    // Optimistic update
    setIsFollowed(nextFollowed);

    setFollowLoading(true);
    try {
      if (nextFollowed) {
        await artistService.followArtist(artistIdStr);
        message.success('Đã theo dõi nghệ sĩ');
      } else {
        await artistService.unfollowArtist(artistIdStr);
        message.success('Đã hủy theo dõi');
      }
    } catch (error) {
      console.error('Error toggling follow artist:', error);
      setIsFollowed(prevFollowed);
      message.error('Không thể cập nhật theo dõi nghệ sĩ');
    } finally {
      setFollowLoading(false);
    }
  };

  const fetchArtistDetails = async () => {
    setLoading(true);
    try {
      const response = await artistService.getArtistById(artistId);
      setArtist(response.data);
    } catch (error) {
      console.error('Error fetching artist:', error);
      message.error('Không thể tải thông tin nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistSongs = async () => {
    try {
      const response = await songService.getAllSongs();
      const allSongs = response.data || response.songs || [];
      // Filter songs by artist and sort by plays
      const artistSongs = allSongs
        .filter(song => song.artist?._id === artistId || song.artist === artistId)
        .sort((a, b) => (b.plays || 0) - (a.plays || 0));
      setPopularSongs(artistSongs);
    } catch (error) {
      console.error('Error fetching artist songs:', error);
    }
  };

  const handlePlayArtist = () => {
    const firstSong = popularSongs.find((s) => s?.audioUrl);
    if (!firstSong) {
      message.warning('Nghệ sĩ chưa có bài hát để phát');
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

  const fetchArtistAlbums = async () => {
    try {
      const response = await albumService.getAllAlbums();
      // Filter albums by artist
      const artistAlbums = response.data.filter(album => 
        album.artist?._id === artistId || album.artist === artistId
      );
      setAlbums(artistAlbums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const formatPlays = (plays) => {
    if (!plays) return '0';
    if (plays >= 1000000000) return (plays / 1000000000).toFixed(1) + 'B';
    if (plays >= 1000000) return (plays / 1000000).toFixed(1) + 'M';
    if (plays >= 1000) return (plays / 1000).toFixed(1) + 'K';
    return plays.toString();
  };

  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    if (typeof duration === 'string') return duration;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatMonthlyListeners = (count) => {
    if (!count) return '0';
    return count.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]">
        <Spin size="large" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e]">
        <p className="text-white text-xl">Không tìm thấy nghệ sĩ</p>
      </div>
    );
  }

  const songsToShow = showAllSongs ? popularSongs : popularSongs.slice(0, 5);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] overflow-y-auto">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(26,26,46,1)), url(${artist.image || 'https://via.placeholder.com/1200x400'})`,
        }}
      >
        <div className="absolute bottom-8 left-8">
          {/* Verified Badge */}
          <div className="flex items-center gap-2 mb-4">
            <CheckCircleOutlined style={{ fontSize: '20px', color: '#3b82f6' }} />
            <span className="text-white text-sm font-medium">Nghệ sĩ được xác minh</span>
          </div>

          {/* Artist Name */}
          <h1 className="text-white text-8xl font-black mb-6">
            {artist.name}
          </h1>

          {/* Monthly Listeners */}
          <p className="text-white text-base">
            {formatMonthlyListeners(artist.monthlyListeners || 56790645)} người nghe hàng tháng
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6 flex items-center gap-4 bg-gradient-to-b from-[#1a1a2e]/80 to-transparent">
        <PlayButton size={56} onClick={handlePlayArtist} />

        <button
          onClick={handleToggleFollow}
          className={`px-6 py-2 rounded-full border text-white transition-all ${
            followLoading ? 'opacity-60' : 'hover:scale-105'
          } ${
            isFollowed ? 'border-pink-500 text-pink-300' : 'border-gray-400 hover:border-white'
          }`}
        >
          {isFollowed ? 'Đã theo dõi' : 'Theo dõi'}
        </button>

        <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
          <SwapOutlined style={{ fontSize: '28px', color: '#b3b3b3' }} />
        </button>

        <button className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
          <MoreOutlined style={{ fontSize: '28px', color: '#b3b3b3' }} />
        </button>
      </div>

      {/* Popular Songs Section */}
      <div className="px-8 py-8">
        <h2 className="text-white text-2xl font-bold mb-6">Phổ biến</h2>
        <div className="space-y-2">
          {songsToShow.map((song, index) => (
            <div
              key={song._id}
              onClick={() => navigate(`/song/${song._id}`)}
              className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 rounded hover:bg-white/10 transition-colors cursor-pointer items-center group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-base w-4">{index + 1}</span>
                <img
                  src={song.image || 'https://via.placeholder.com/48'}
                  alt={song.title}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="text-white font-medium hover:underline">
                    {song.title}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatPlays(song.plays)}
                  </p>
                </div>
              </div>
              <div></div>
              <div className="text-gray-400 text-sm">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))}
        </div>
        
        {popularSongs.length > 5 && (
          <button
            onClick={() => setShowAllSongs(!showAllSongs)}
            className="mt-4 text-gray-400 hover:text-white font-semibold text-sm"
          >
            {showAllSongs ? 'Ẩn bớt' : 'Xem thêm'}
          </button>
        )}
      </div>

      {/* Albums Section */}
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">Album</h2>
          <button className="text-gray-400 hover:text-white font-semibold text-sm">
            Hiện tất cả
          </button>
        </div>

        {/* Albums Grid */}
        {albums.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albums.map((album) => (
              <div
                key={album._id}
                onClick={() => navigate(`/album/${album._id}`)}
                className="p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all cursor-pointer group"
              >
                <div className="relative mb-4">
                  <img
                    src={album.coverImage || 'https://via.placeholder.com/200'}
                    alt={album.title}
                    className="w-full aspect-square object-cover rounded shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl flex items-center justify-center">
                    <PlayCircleOutlined style={{ fontSize: '24px', color: 'black' }} />
                  </button>
                </div>
                <h3 className="text-white font-semibold mb-1 truncate">
                  {album.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {album.releaseDate ? new Date(album.releaseDate).getFullYear() : '2024'} • Album
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-12">
            Chưa có album nào
          </div>
        )}
      </div>

      {/* Artist Bio Section */}
      <div className="px-8 py-8 pb-24">
        <h2 className="text-white text-2xl font-bold mb-6">Giới thiệu</h2>
        <div className="relative">
          <div 
            className="h-96 bg-cover bg-center rounded-lg overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${artist.image || 'https://via.placeholder.com/800x400'})`,
            }}
          >
            <div className="absolute bottom-6 right-6 bg-blue-500 rounded-full w-20 h-20 flex flex-col items-center justify-center">
              <span className="text-white text-2xl font-bold">#37</span>
              <span className="text-white text-xs">trên thế giới</span>
            </div>
          </div>
          
          {artist.bio && (
            <div className="mt-6">
              <p className="text-white text-base leading-relaxed">
                {artist.bio}
              </p>
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Người nghe hàng tháng</p>
              <p className="text-white text-2xl font-bold">
                {formatMonthlyListeners(artist.monthlyListeners || 56790645)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Số bài hát</p>
              <p className="text-white text-2xl font-bold">
                {popularSongs.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
