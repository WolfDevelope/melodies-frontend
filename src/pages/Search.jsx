import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { Spin } from 'antd';
import MusicCard from '../components/common/MusicCard';
import songService from '../services/songService';
import albumService from '../services/albumService';
import artistService from '../services/artistService';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTrack, setCurrentTrack, sidebarCollapsed } = useOutletContext();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: [],
    artists: [],
  });
  
  // ✅ OPTIMIZATION: Refs for debouncing and caching
  const debounceTimerRef = useRef(null);
  const searchCacheRef = useRef(new Map());

  // Get search query from URL params
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  // ✅ OPTIMIZATION: Memoized search function with caching and parallel requests
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults({ songs: [], albums: [], artists: [] });
      return;
    }

    try {
      setLoading(true);
      
      // Check cache first (5 minutes TTL)
      const cacheKey = `search_${query.toLowerCase()}`;
      const cachedResult = searchCacheRef.current.get(cacheKey);
      const now = Date.now();
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
      
      if (cachedResult && (now - cachedResult.timestamp) < CACHE_TTL) {
        console.log('📦 Using cached search results for:', query);
        setSearchResults(cachedResult.data);
        setLoading(false);
        return;
      }
      
      // ✅ OPTIMIZATION: Parallel API calls with Promise.all
      console.log('🔍 Searching for:', query);
      const [songsResponse, albumsResponse, artistsResponse] = await Promise.all([
        songService.getAllSongs({
          search: query,
          limit: 50,
        }).catch(err => {
          console.error('Songs search error:', err);
          return { songs: [] };
        }),
        
        albumService.getAllAlbums({
          search: query,
          limit: 20,
        }).catch(err => {
          console.error('Albums search error:', err);
          return { data: [] };
        }),
        
        artistService.getAllArtists({
          search: query,
          limit: 20,
        }).catch(err => {
          console.error('Artists search error:', err);
          return { artists: [] };
        }),
      ]);
      
      const results = {
        songs: songsResponse.songs || [],
        albums: albumsResponse.data || [],
        artists: artistsResponse.artists || [],
      };
      
      // Cache the results
      searchCacheRef.current.set(cacheKey, {
        data: results,
        timestamp: now,
      });
      
      // Limit cache size to 50 entries
      if (searchCacheRef.current.size > 50) {
        const firstKey = searchCacheRef.current.keys().next().value;
        searchCacheRef.current.delete(firstKey);
      }
      
      setSearchResults(results);
      console.log('✅ Search completed:', results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ songs: [], albums: [], artists: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ OPTIMIZATION: Debounced search with useEffect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults({ songs: [], albums: [], artists: [] });
      return;
    }

    // Debounce search by 300ms
    debounceTimerRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const handlePlaySong = (song) => {
    setCurrentTrack({
      id: song._id,
      title: song.title,
      artist: song.artist?.name || 'Unknown',
      image: song.thumbnail,
      audioUrl: song.src,
    });
  };

  // ✅ OPTIMIZATION: Memoize filtered results to prevent recalculation
  const filteredResults = useMemo(() => {
    switch (activeTab) {
      case 'songs':
        return { songs: searchResults.songs, albums: [], artists: [] };
      case 'albums':
        return { songs: [], albums: searchResults.albums, artists: [] };
      case 'artists':
        return { songs: [], albums: [], artists: searchResults.artists };
      default:
        return searchResults;
    }
  }, [activeTab, searchResults]);

  const hasResults = useMemo(
    () => filteredResults.songs.length > 0 || 
          filteredResults.albums.length > 0 || 
          filteredResults.artists.length > 0,
    [filteredResults]
  );

  return (
    <>
      {!searchQuery ? (
          /* Browse Categories - Before Search */
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">Duyệt tìm tất cả</h1>
            
            {/* Category Tabs */}
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setActiveTab('songs')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'songs' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Bài hát
              </button>
              <button 
                onClick={() => setActiveTab('artists')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'artists' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Nghệ sĩ
              </button>
              <button 
                onClick={() => setActiveTab('albums')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'albums' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Album
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                Playlist
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                Podcast và chương trình
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                Hồ sơ
              </button>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">Tìm kiếm bài hát, nghệ sĩ, album...</h2>
              <p className="text-gray-400">Nhập từ khóa vào ô tìm kiếm để bắt đầu</p>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {/* Filter Tabs */}
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setActiveTab('songs')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'songs' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Bài hát
              </button>
              <button 
                onClick={() => setActiveTab('artists')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'artists' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Nghệ sĩ
              </button>
              <button 
                onClick={() => setActiveTab('albums')}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === 'albums' 
                    ? 'bg-white text-black font-semibold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Album
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                Playlist
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                Podcast và chương trình
              </button>
              <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                Hồ sơ
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spin size="large" />
              </div>
            ) : !hasResults ? (
              /* No Results */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Không tìm thấy kết quả cho "{searchQuery}"
                </h2>
                <p className="text-gray-400">Vui lòng thử lại bằng từ khóa khác</p>
              </div>
            ) : (
              /* Results - Two Column Layout */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Top Result, Artists, Albums */}
                <div className="lg:col-span-1 space-y-8">
                  {/* Top Result - First Song/Artist */}
                  {(activeTab === 'all' || activeTab === 'songs' || activeTab === 'artists') && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Kết quả hàng đầu</h2>
                      <div className="bg-[#181818] rounded-lg p-6 hover:bg-[#282828] transition-colors cursor-pointer">
                        {filteredResults.songs[0] ? (
                          <div 
                            className="flex items-center gap-4"
                            onClick={() => handlePlaySong(filteredResults.songs[0])}
                          >
                            <img
                              src={filteredResults.songs[0].thumbnail}
                              alt={filteredResults.songs[0].title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-1 truncate">
                                {filteredResults.songs[0].title}
                              </h3>
                              <p className="text-gray-400 text-sm truncate">
                                Bài hát • {filteredResults.songs[0].artist?.name || 'Unknown Artist'}
                              </p>
                            </div>
                          </div>
                        ) : filteredResults.artists[0] && (
                          <div 
                            className="flex items-center gap-4"
                            onClick={() => navigate(`/artists/${filteredResults.artists[0]._id}`)}
                          >
                            <img
                              src={filteredResults.artists[0].image}
                              alt={filteredResults.artists[0].name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-1 truncate">
                                {filteredResults.artists[0].name}
                              </h3>
                              <p className="text-gray-400 text-sm">Nghệ sĩ</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Artists */}
                  {filteredResults.artists.length > 0 && activeTab === 'all' && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">Nghệ sĩ</h2>
                      <div className="space-y-3">
                        {filteredResults.artists.slice(0, 4).map((artist) => (
                          <div
                            key={artist._id}
                            onClick={() => navigate(`/artists/${artist._id}`)}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
                          >
                            <img
                              src={artist.image}
                              alt={artist.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold truncate">{artist.name}</h3>
                              <p className="text-gray-400 text-sm">Nghệ sĩ</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Albums */}
                  {filteredResults.albums.length > 0 && activeTab === 'all' && (
                    <div>
                      <h2 className="text-xl font-bold text-white mb-4">Album</h2>
                      <div className="space-y-3">
                        {filteredResults.albums.slice(0, 4).map((album) => (
                          <div
                            key={album._id}
                            onClick={() => navigate(`/albums/${album._id}`)}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer"
                          >
                            <img
                              src={album.coverImage}
                              alt={album.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold truncate">{album.title}</h3>
                              <p className="text-gray-400 text-sm truncate">
                                {album.artist?.name || 'Various Artists'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Songs */}
                <div className="lg:col-span-2">
                  {filteredResults.songs.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Bài hát</h2>
                      <div className="space-y-2">
                        {filteredResults.songs.slice(0, activeTab === 'songs' ? 50 : 10).map((song, index) => (
                          <div
                            key={song._id}
                            onClick={() => handlePlaySong(song)}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-colors cursor-pointer group"
                          >
                            <span className="text-gray-400 text-sm w-8 text-center group-hover:hidden">
                              {index + 1}
                            </span>
                            <span className="text-white text-sm w-8 text-center hidden group-hover:block">
                              ▶
                            </span>
                            <img
                              src={song.thumbnail}
                              alt={song.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-medium truncate">{song.title}</h3>
                              <p className="text-gray-400 text-sm truncate">
                                {song.artist?.name || 'Unknown Artist'}
                              </p>
                            </div>
                            <span className="text-gray-400 text-sm">{song.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show full Artists list when tab is active */}
                  {filteredResults.artists.length > 0 && activeTab === 'artists' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Nghệ sĩ</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResults.artists.map((artist) => (
                          <MusicCard
                            key={artist._id}
                            image={artist.image}
                            title={artist.name}
                            description="Nghệ sĩ"
                            type="circle"
                            onClick={() => navigate(`/artists/${artist._id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show full Albums list when tab is active */}
                  {filteredResults.albums.length > 0 && activeTab === 'albums' && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Album</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResults.albums.map((album) => (
                          <MusicCard
                            key={album._id}
                            image={album.coverImage}
                            title={album.title}
                            description={album.artist?.name || 'Various Artists'}
                            onClick={() => navigate(`/albums/${album._id}`)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
      )}
    </>
  );
};

export default Search;
