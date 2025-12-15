import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Spin, message } from 'antd';
import ContentSection from '../components/common/ContentSection';
import MusicCard from '../components/common/MusicCard';
import PlaylistCard from '../components/common/PlaylistCard';
import homeService from '../services/homeService';
import usePageTitle from '../hooks/usePageTitle';

const Home = () => {
  usePageTitle('Trang chủ');
  const navigate = useNavigate();
  const { currentTrack, setCurrentTrack, sidebarCollapsed } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  const handlePlaySong = (song) => {
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

  // Fetch homepage data with caching
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Check cache first (5 minutes TTL)
      const cacheKey = 'homepage_data';
      const cachedData = sessionStorage.getItem(cacheKey);
      const cacheTimestamp = sessionStorage.getItem(`${cacheKey}_timestamp`);
      const now = Date.now();
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
      
      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < CACHE_TTL) {
        console.log('📦 Using cached homepage data');
        setHomeData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
      
      // Fetch fresh data
      console.log('🔄 Fetching fresh homepage data...');
      const response = await homeService.getHomePageData();
      
      if (response.success) {
        console.log('✅ Homepage Data loaded');
        setHomeData(response.data);
        
        // Cache the data
        sessionStorage.setItem(cacheKey, JSON.stringify(response.data));
        sessionStorage.setItem(`${cacheKey}_timestamp`, now.toString());
      }
    } catch (error) {
      console.error('Error loading homepage:', error);
      message.error('Không thể tải dữ liệu trang chủ');
    } finally {
      setLoading(false);
    }
  };

  // Fetch homepage data on mount
  useEffect(() => {
    fetchHomeData();
  }, []);


  // Helper function to convert category to card format
  const categoryToCard = (category) => ({
    id: category._id,
    image: category.coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
    title: category.name,
    description: category.description || `${category.songs?.length || 0} bài hát`,
  });

  // ✅ OPTIMIZATION: Memoize helper functions to prevent recreation on every render
  const songToCard = useMemo(() => (song) => ({
    id: song._id,
    image:
      song.thumbnail ||
      song.image ||
      song.coverImage ||
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
    title: song.title,
    description: song.artist?.name || song.artist || 'Unknown Artist',
  }), []);

  const albumToCard = useMemo(() => (album) => ({
    id: album._id,
    image: album.coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
    title: album.title,
    description: `${album.artist?.name || 'Various Artists'} • ${album.songs?.length || album.songCount || 0} bài hát`,
  }), []);

  const artistToCard = useMemo(() => (artist) => ({
    id: artist._id,
    image: artist.image || artist.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300',
    title: artist.name,
    description: `${artist.songs?.length || artist.songCount || 0} bài hát`,
  }), []);

  const categoryToPlaylistCard = useMemo(() => (category) => ({
    id: category._id,
    title: category.name,
    description: category.description || `${category.songs?.length || 0} bài hát`,
    gradient: category.metadata?.color 
      ? `linear-gradient(135deg, ${category.metadata.color} 0%, ${category.metadata.color}80 100%)`
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: category.icon || '🎵',
  }), []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
        {/* Tabs */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => {
              setContentTypeFilter('all');
              setExpandedCategoryId(null);
            }}
            className={`px-6 py-2 rounded-full transition-colors ${
              contentTypeFilter === 'all' 
                ? 'bg-white text-black font-semibold' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => {
              setContentTypeFilter('songs');
              setExpandedCategoryId(null);
            }}
            className={`px-6 py-2 rounded-full transition-colors ${
              contentTypeFilter === 'songs' 
                ? 'bg-white text-black font-semibold' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Nhạc
          </button>
          <button 
            onClick={() => {
              setContentTypeFilter('albums');
              setExpandedCategoryId(null);
            }}
            className={`px-6 py-2 rounded-full transition-colors ${
              contentTypeFilter === 'albums' 
                ? 'bg-white text-black font-semibold' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Album
          </button>
          <button 
            onClick={() => {
              setContentTypeFilter('artists');
              setExpandedCategoryId(null);
            }}
            className={`px-6 py-2 rounded-full transition-colors ${
              contentTypeFilter === 'artists' 
                ? 'bg-white text-black font-semibold' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Nghệ sĩ
          </button>
        </div> 

        

        {/* Back to All Categories Button */}
        {expandedCategoryId && (
          <button
            onClick={() => setExpandedCategoryId(null)}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Quay lại tất cả danh mục</span>
          </button>
        )}

        {/* Custom Homepage Sections - Configured by Admin */}
        {homeData?.homepageSections && homeData.homepageSections.length > 0 ? (
          (() => {
            const filteredCategories = homeData.homepageSections.filter(category => {
              // Filter by content type
              if (contentTypeFilter === 'all') return true;
              return category.contentType === contentTypeFilter;
            });

            // Show empty state if no categories match filter
            if (filteredCategories.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy nội dung</h2>
                  <p className="text-gray-400 text-center max-w-md">
                    Không có danh mục nào chứa {
                      contentTypeFilter === 'songs' ? 'bài hát' :
                      contentTypeFilter === 'albums' ? 'album' :
                      contentTypeFilter === 'artists' ? 'nghệ sĩ' : 'nội dung'
                    } được hiển thị trên trang chủ.
                  </p>
                </div>
              );
            }

            return (
              <>
                {filteredCategories.map((category) => {
                // If a category is expanded, only show that category
                if (expandedCategoryId && category._id !== expandedCategoryId) {
                  return null;
                }

                const sectionTitle = category.homepageTitle || category.name;
                const contentItems = category.contentType === 'songs' 
                  ? category.songs 
                  : category.contentType === 'albums' 
                  ? category.albums 
                  : category.artists;

                if (!contentItems || contentItems.length === 0) return null;

              // Show all items if expanded, otherwise show only 5
              const itemsToShow = expandedCategoryId === category._id 
                ? contentItems 
                : contentItems.slice(0, 5);

              return (
                <ContentSection 
                  key={category._id} 
                  title={sectionTitle}
                  onShowAll={expandedCategoryId === category._id ? null : () => setExpandedCategoryId(category._id)}
                >
                  {itemsToShow.map((item) => {
                    if (category.contentType === 'songs') {
                      const card = songToCard(item);
                      return (
                        <MusicCard
                          key={card.id}
                          image={card.image}
                          title={card.title}
                          description={card.description}
                          onClick={() => navigate(`/song/${item._id}`)}
                          onPlay={() => handlePlaySong(item)}
                        />
                      );
                    } else if (category.contentType === 'albums') {
                      const card = albumToCard(item);
                      return (
                        <MusicCard
                          key={card.id}
                          image={card.image}
                          title={card.title}
                          description={card.description}
                          onClick={() => navigate(`/album/${item._id}`)}
                        />
                      );
                    } else if (category.contentType === 'artists') {
                      const card = artistToCard(item);
                      return (
                        <MusicCard
                          key={card.id}
                          image={card.image}
                          title={card.title}
                          description={card.description}
                          type="circle"
                          onClick={() => navigate(`/artist/${item._id}`)}
                        />
                      );
                    }
                    return null;
                  })}
                </ContentSection>
              );
            })}
          </>
            );
          })()
        ) : (
          /* Empty State - No Homepage Sections */
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-bold text-white mb-2">Chưa có nội dung</h2>
            <p className="text-gray-400 text-center max-w-md">
              Admin chưa cấu hình danh mục nào để hiển thị trên trang chủ.
              Vui lòng quay lại sau!
            </p>
          </div>
        )}
    </>
  );
};

export default Home;