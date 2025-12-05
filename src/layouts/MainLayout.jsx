import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import MusicPlayer from '../components/common/MusicPlayer';
import Sidebar from '../components/common/Sidebar';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Current playing track state (shared across pages)
  const [currentTrack, setCurrentTrack] = useState({
    id: 1,
    title: 'greedy',
    artist: 'Tate McRae',
    image: 'https://i.scdn.co/image/ab67616d00001e0221d586ad830dd93b2703b139',
    audioUrl: './assets/music/Tate McRae - greedy (Official Video).mp3',
  });

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
          title="Thư viện"
          menuItems={[
            {
              icon: <PlusOutlined />,
              label: 'Tạo danh sách phát',
              onClick: () => console.log('Create playlist'),
            },
          ]}
          expandedContent={
            <div>
              <h3 className="text-gray-400 text-sm font-semibold mb-4 px-4">
                Tạo danh sách phát đầu tiên của bạn
              </h3>
              <p className="text-white text-sm px-4 mb-4">
                Chúng tôi sẽ giúp bạn tạo danh sách phát
              </p>
              <button className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
                Tạo danh sách phát
              </button>
            </div>
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
    </div>
  );
};

export default MainLayout;
