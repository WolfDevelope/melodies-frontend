import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { Spin } from 'antd';
import MusicCard from '../components/common/MusicCard';
import songService from '../services/songService';
import albumService from '../services/albumService';
import artistService from '../services/artistService';
import usePageTitle from '../hooks/usePageTitle';

const Search = () => {
  usePageTitle('Tìm kiếm');
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
          return { data: [] };
        }),
      ]);
      
      const results = {
        songs: songsResponse.songs || [],
        albums: albumsResponse.data || [],
        artists: artistsResponse.data || artistsResponse.artists || [],
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
      _id: song._id,
      title: song.title,
      artist: song.artist,
      thumbnail: song.thumbnail,
      audioUrl: song.audioUrl,
      duration: song.duration,
    });
  };

  // Helper function to calculate relevance score
  const calculateRelevance = useCallback((item, query, type) => {
    const searchLower = query.toLowerCase().trim();
    let score = 0;
    
    // Get the name/title to compare
    const itemName = (item.name || item.title || '').toLowerCase();
    const artistName = (item.artist?.name || item.artist || '').toLowerCase();
    
    // Base scoring for name/title match
    if (itemName === searchLower) {
      // Exact match
      score += 100;
    } else if (itemName.startsWith(searchLower)) {
      // Starts with query
      score += 50;
    } else if (itemName.includes(searchLower)) {
      // Contains query
      score += 25;
    }
    
    // Type-specific bonuses (prioritize artists when name matches)
    if (type === 'artist') {
      // Artists get higher priority when their name matches
      if (itemName === searchLower) {
        score += 200; // Exact artist name match gets highest priority
      } else if (itemName.includes(searchLower)) {
        score += 100; // Partial artist name match
      }
    } else if (type === 'album') {
      // Albums get moderate priority
      if (itemName === searchLower) {
        score += 50; // Exact album match
      } else if (artistName.includes(searchLower)) {
        score += 30; // Album by matching artist
      }
    } else if (type === 'song') {
      // Songs get lower priority for artist name matches
      if (artistName === searchLower) {
        score += 40; // Song by exact artist match
      } else if (artistName.includes(searchLower)) {
        score += 15; // Song by partial artist match
      }
    }
    
    return score;
  }, []);

  // Get the best matching result for "Top Result"
  const topResult = useMemo(() => {
    if (!searchQuery) return null;
    
    const candidates = [];
    
    // Score all items
    searchResults.songs.forEach(song => {
      const score = calculateRelevance(song, searchQuery, 'song');
      if (score > 0) {
        candidates.push({ item: song, type: 'song', score });
      }
    });
    
    searchResults.artists.forEach(artist => {
      const score = calculateRelevance(artist, searchQuery, 'artist');
      if (score > 0) {
        candidates.push({ item: artist, type: 'artist', score });
      }
    });
    
    searchResults.albums.forEach(album => {
      const score = calculateRelevance(album, searchQuery, 'album');
      if (score > 0) {
        candidates.push({ item: album, type: 'album', score });
      }
    });
    
    // Sort by score and return the best match
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0] || null;
  }, [searchResults, searchQuery, calculateRelevance]);

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
                  {/* Top Result - Best Match Based on Relevance */}
                  {(activeTab === 'all' || activeTab === 'songs' || activeTab === 'artists' || activeTab === 'albums') && topResult && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Kết quả hàng đầu</h2>
                      <div className="bg-[#181818] rounded-lg p-6 hover:bg-[#282828] transition-colors cursor-pointer">
                        {topResult.type === 'song' ? (
                          <div 
                            className="flex items-center gap-4"
                            onClick={() => handlePlaySong(topResult.item)}
                          >
                            <img
                              src={topResult.item.thumbnail}
                              alt={topResult.item.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-1 truncate">
                                {topResult.item.title}
                              </h3>
                              <p className="text-gray-400 text-sm truncate">
                                Bài hát • {topResult.item.artist?.name || 'Unknown Artist'}
                              </p>
                            </div>
                          </div>
                        ) : topResult.type === 'artist' ? (
                          <div 
                            className="flex items-center gap-4"
                            onClick={() => navigate(`/artists/${topResult.item._id}`)}
                          >
                            <img
                              src={topResult.item.image || topResult.item.avatar}
                              alt={topResult.item.name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-1 truncate">
                                {topResult.item.name}
                              </h3>
                              <p className="text-gray-400 text-sm">Nghệ sĩ</p>
                            </div>
                          </div>
                        ) : topResult.type === 'album' && (
                          <div 
                            className="flex items-center gap-4"
                            onClick={() => navigate(`/albums/${topResult.item._id}`)}
                          >
                            <img
                              src={topResult.item.coverImage}
                              alt={topResult.item.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-1 truncate">
                                {topResult.item.title}
                              </h3>
                              <p className="text-gray-400 text-sm truncate">
                                Album • {topResult.item.artist?.name || topResult.item.artist || 'Unknown Artist'}
                              </p>
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
                            <span className="text-gray-400 text-sm w-8 text-center">
                              {index + 1}
                            </span>
                            <div className="relative w-12 h-12">
                              <img
                                src={song.thumbnail}
                                alt={song.title}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg 
                                  className="w-6 h-6 text-white" 
                                  fill="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
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
