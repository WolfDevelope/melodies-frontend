import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MusicPlayer from '../components/common/MusicPlayer';
import Sidebar from '../components/common/Sidebar';
import LibraryModal from '../components/common/LibraryModal';
import playlistService from '../services/playlistService';
import albumService from '../services/albumService';
import artistService from '../services/artistService';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [favoriteAlbums, setFavoriteAlbums] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  
  // Current playing track state (shared across pages)
  const [currentTrack, setCurrentTrack] = useState(null);

  // Check if current page should hide sidebar and player
  const isAccountPage = location.pathname.startsWith('/account');

  // Handle search query change with navigation
  const handleSearchQueryChange = (value) => {
    setSearchQuery(value);
    
    // Navigate to search page with query param when user types (without full page reload)
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
    } else {
      // Navigate back to home when search is cleared
      if (location.pathname === '/search') {
        navigate('/home', { replace: true });
      }
    }
  };

  // Get search query from URL
  const searchParams = new URLSearchParams(location.search);
  const urlSearchQuery = searchParams.get('q') || '';
  
  // Sync URL query with state
  React.useEffect(() => {
    if (urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  // Fetch playlists from API
  const fetchPlaylists = async () => {
    try {
      const response = await playlistService.getUserPlaylists();
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const fetchFavoriteAlbums = async () => {
    try {
      const response = await albumService.getFavoriteAlbums();
      setFavoriteAlbums(response.data || []);
    } catch (error) {
      console.error('Error fetching favorite albums:', error);
    }
  };

  const fetchFollowedArtists = async () => {
    try {
      const response = await artistService.getFollowedArtists();
      setFollowedArtists(response.data || []);
    } catch (error) {
      console.error('Error fetching followed artists:', error);
    }
  };

  // Fetch playlists on mount and when navigating away from create page
  useEffect(() => {
    // Only fetch if not on create playlist page
    if (location.pathname !== '/playlist/create') {
      fetchPlaylists();
      fetchFavoriteAlbums();
      fetchFollowedArtists();
    }
  }, [location.pathname]);

  // Close library modal when navigating to create playlist page
  React.useEffect(() => {
    if (location.pathname === '/playlist/create') {
      setIsLibraryOpen(false);
    }
  }, [location.pathname]);

  // Handle create playlist navigation
  const handleCreatePlaylist = async () => {
    try {
      // Create empty playlist first
      const response = await playlistService.createPlaylist({
        name: 'Danh sách phát của tôi',
        description: '',
        image: null,
        isPublic: true,
      });

      const newPlaylistId = response.data._id;
      console.log('Created playlist:', newPlaylistId);

      // Close modal and navigate to edit the new playlist
      setIsLibraryOpen(false);
      navigate(`/playlist/${newPlaylistId}`);
    } catch (error) {
      console.error('Error creating playlist:', error);
      // Fallback: navigate to create page without ID
      setIsLibraryOpen(false);
      navigate('/playlist/create');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f] ${!isAccountPage ? 'pb-24' : ''}`}>
      {/* Header - Fixed across all pages */}
      {!isAccountPage && (
        <Header 
          searchQuery={searchQuery}
          onSearchChange={handleSearchQueryChange}
        />
      )}

      {/* Main Content - Changes based on route */}
      <main className={`max-w-[1920px] mx-auto transition-all duration-300 ${!isAccountPage ? 'px-6 py-8' : ''} ${!isAccountPage && (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')}`}>
        <Outlet context={{ currentTrack, setCurrentTrack, sidebarCollapsed }} />
      </main>

      {/* Footer - Only show on non-account pages */}
      {!isAccountPage && (
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <Footer />
        </div>
      )}

      {/* Sidebar - Hide on account pages */}
      {!isAccountPage && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          onExpandLibrary={() => setIsLibraryOpen(true)}
          title="Thư viện"
          menuItems={[
            {
              icon: <PlusOutlined />,
              label: 'Tạo danh sách phát',
              onClick: handleCreatePlaylist,
            },
          ]}
          expandedContent={
            playlists.length === 0 && favoriteAlbums.length === 0 && followedArtists.length === 0 ? (
              // Empty state - Show when no playlists
              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-4 px-4">
                  Tạo danh sách phát đầu tiên của bạn
                </h3>
                <p className="text-white text-sm px-4 mb-4">
                  Chúng tôi sẽ giúp bạn tạo danh sách phát
                </p>
                <button 
                  onClick={handleCreatePlaylist}
                  className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
                >
                  Tạo danh sách phát
                </button>
              </div>
            ) : (
              // Playlists list - Show when playlists exist
              <div className="space-y-4">
                <div className="space-y-1">
                  {playlists.map((playlist) => (
                    <div
                      key={playlist._id}
                      onClick={() => navigate(`/playlist/${playlist._id}`)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 cursor-pointer transition-all group"
                    >
                      {/* Playlist Image */}
                      <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                        {playlist.image ? (
                          <img 
                            src={playlist.image} 
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Playlist Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {playlist.name}
                        </p>
                        <p className="text-gray-400 text-xs truncate">
                          Danh sách phát • {playlist.songs?.length || 0} bài hát
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {favoriteAlbums.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-xs font-semibold mb-2 px-3">
                      Album yêu thích
                    </h3>
                    <div className="space-y-1">
                      {favoriteAlbums.map((album) => (
                        <div
                          key={album._id}
                          onClick={() => navigate(`/album/${album._id}`)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                            {album.coverImage ? (
                              <img
                                src={album.coverImage}
                                alt={album.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-600 to-purple-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {album.title}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              Album
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {followedArtists.length > 0 && (
                  <div>
                    <h3 className="text-gray-400 text-xs font-semibold mb-2 px-3">
                      Nghệ sĩ yêu thích
                    </h3>
                    <div className="space-y-1">
                      {followedArtists.map((artist) => (
                        <div
                          key={artist._id}
                          onClick={() => navigate(`/artist/${artist._id}`)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 cursor-pointer transition-all group"
                        >
                          <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-800">
                            {artist.image ? (
                              <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">
                              {artist.name}
                            </p>
                            <p className="text-gray-400 text-xs truncate">
                              Nghệ sĩ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          }
        />
      )}

      {/* Music Player - Hide on account pages */}
      {!isAccountPage && (
        <MusicPlayer
          currentTrack={currentTrack}
          onNext={() => console.log('Next track')}
          onPrevious={() => console.log('Previous track')}
        />
      )}

      {/* Library Modal - Render at top level */}
      <LibraryModal 
        isOpen={isLibraryOpen} 
        onClose={() => setIsLibraryOpen(false)}
        onCreatePlaylist={handleCreatePlaylist}
      />
    </div>
  );
};

export default MainLayout;
