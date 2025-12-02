import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import { Spin, message } from 'antd';
import Header from '../components/common/Header';
import ContentSection from '../components/common/ContentSection';
import MusicCard from '../components/common/MusicCard';
import PlaylistCard from '../components/common/PlaylistCard';
import Footer from '../components/common/Footer';
import MusicPlayer from '../components/common/MusicPlayer';
import Sidebar from '../components/common/Sidebar';
import homeService from '../services/homeService';

const Home = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState(null);
  
  // Current playing track state
  const [currentTrack, setCurrentTrack] = useState({
    id: 1,
    title: 'greedy',
    artist: 'Tale McRae',
    image: 'https://i.scdn.co/image/ab67616d00001e0221d586ad830dd93b2703b139',
    audioUrl: './assets/music/Tate McRae - greedy (Official Video).mp3', // Demo audio URL
  });

  // Mock data - Đề xuất cho bạn
  const recommendations = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      title: 'Ký Ức Thập Niên 80',
      description: 'Những khúc hát nhiều ký ức cuối thập niên 70 và...',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      title: 'Mega Hit Mix',
      description: 'A mega mix of 75 favorites from the last...',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300',
      title: 'Dòng Nhạc Hải Ngoại',
      description: 'Những ca khúc hay nhất từ cộng đồng nghệ sĩ...',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      title: 'Soft Pop Hits',
      description: 'Warm familiar pop you know and love.',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300',
      title: 'Bolero Tuyển Phẩm',
      description: 'Những ca khúc đế đời của dòng nhạc vàng. Ấn...',
    },
  ];

  // Mock data - Bảng xếp hạng
  const charts = [
    {
      id: 1,
      title: 'Top Bài Hát Việt Nam',
      description: 'Cập nhật hàng ngày',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🇻🇳',
    },
    {
      id: 2,
      title: 'Viral 50',
      description: 'Trending now',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '🔥',
    },
    {
      id: 3,
      title: 'Top Bài Hát Toàn Cầu',
      description: 'Global hits',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '🌍',
    },
    {
      id: 4,
      title: 'Viral 50',
      description: 'Top trending',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: '⚡',
    },
  ];

  // Mock data - Mới phát hành
  const newReleases = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      title: 'Nơi Này Có Anh',
      description: 'Sơn Tùng M-TP',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300',
      title: 'Lạc Trôi',
      description: 'Sơn Tùng M-TP',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      title: 'Chúng Ta Của Hiện Tại',
      description: 'Sơn Tùng M-TP',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300',
      title: 'Hãy Trao Cho Anh',
      description: 'Sơn Tùng M-TP ft. Snoop Dogg',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      title: 'Making My Way',
      description: 'Sơn Tùng M-TP',
    },
  ];

  // Mock data - Nghệ sĩ tiêu biểu
  const artists = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
      title: 'Sơn Tùng M-TP',
      description: 'Nghệ sĩ',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      title: 'Đen Vâu',
      description: 'Nghệ sĩ',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      title: 'Hoàng Thùy Linh',
      description: 'Nghệ sĩ',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      title: 'Mỹ Tâm',
      description: 'Nghệ sĩ',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
      title: 'Noo Phước Thịnh',
      description: 'Nghệ sĩ',
    },
  ];

  // Mock data - Albums
  const albums = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
      title: 'Sky Tour',
      description: 'Sơn Tùng M-TP',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300',
      title: 'Chạy Ngay Đi',
      description: 'Sơn Tùng M-TP',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
      title: 'Đi Để Trở Về',
      description: 'Soobin Hoàng Sơn',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300',
      title: 'Hoàng',
      description: 'Hoàng Thùy Linh',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      title: 'Tâm 9',
      description: 'Mỹ Tâm',
    },
  ];

  // Fetch homepage data
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await homeService.getHomePageData();
        console.log('📊 Homepage API Response:', response);
        if (response.success) {
          console.log('✅ Homepage Data:', response.data);
          setHomeData(response.data);
        }
      } catch (error) {
        console.error('Error loading homepage:', error);
        message.error('Không thể tải dữ liệu trang chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Helper function to convert category to card format
  const categoryToCard = (category) => ({
    id: category._id,
    image: category.coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
    title: category.name,
    description: category.description || `${category.songs?.length || 0} bài hát`,
  });

  // Helper function to convert song to card format
  const songToCard = (song) => ({
    id: song._id,
    image: song.thumbnail || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
    title: song.title,
    description: song.artist?.name || song.artist || 'Unknown Artist',
  });

  // Helper function to convert category to playlist card
  const categoryToPlaylistCard = (category) => ({
    id: category._id,
    title: category.name,
    description: category.description || `${category.songs?.length || 0} bài hát`,
    gradient: category.metadata?.color 
      ? `linear-gradient(135deg, ${category.metadata.color} 0%, ${category.metadata.color}80 100%)`
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: category.icon || '🎵',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f] pb-24">
      {/* Header/Navigation */}
      <Header />

      {/* Main Content */}
      <main className={`max-w-[1920px] mx-auto px-6 py-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Tabs */}
        <div className="flex items-center space-x-4 mb-8">
          <button className="px-6 py-2 rounded-full bg-white text-black font-semibold">
            Tất cả
          </button>
          <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            Nhạc
          </button>
          <button className="px-6 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            Podcasts
          </button>
        </div>

        

        {/* Custom Homepage Sections - Configured by Admin */}
        {homeData?.homepageSections && homeData.homepageSections.length > 0 && (
          <>
            {homeData.homepageSections.map((category) => {
              const sectionTitle = category.homepageTitle || category.name;
              const contentItems = category.contentType === 'songs' 
                ? category.songs 
                : category.contentType === 'albums' 
                ? category.albums 
                : category.artists;

              if (!contentItems || contentItems.length === 0) return null;

              return (
                <ContentSection 
                  key={category._id} 
                  title={sectionTitle} 
                  showAllLink={`/category/${category._id}`}
                >
                  {contentItems.slice(0, 5).map((item) => {
                    if (category.contentType === 'songs') {
                      const card = songToCard(item);
                      return (
                        <MusicCard
                          key={card.id}
                          image={card.image}
                          title={card.title}
                          description={card.description}
                          onClick={() => setCurrentTrack({
                            id: item._id,
                            title: item.title,
                            artist: item.artist?.name || 'Unknown',
                            image: item.thumbnail,
                            audioUrl: item.src,
                          })}
                        />
                      );
                    } else {
                      const card = categoryToCard({ ...item, _id: item._id, name: item.title || item.name });
                      return (
                        <MusicCard
                          key={card.id}
                          image={card.image}
                          title={card.title}
                          description={card.description}
                          type={category.contentType === 'artists' ? 'circle' : 'default'}
                          onClick={() => navigate(`/${category.contentType}/${item._id}`)}
                        />
                      );
                    }
                  })}
                </ContentSection>
              );
            })}
          </>
        )}

        {/* Đề xuất cho bạn - Featured Categories (Fallback) */}
        {(!homeData?.homepageSections || homeData.homepageSections.length === 0) && homeData?.featured && homeData.featured.length > 0 && (
          <ContentSection title="Đề xuất cho bạn" showAllLink="/recommendations">
            {homeData.featured.slice(0, 5).map((category) => {
              const card = categoryToCard(category);
              return (
                <MusicCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  onClick={() => navigate(`/category/${card.id}`)}
                />
              );
            })}
          </ContentSection>
        )}

        {/* Bảng xếp hạng nổi bật */}
        {homeData?.categories?.charts && homeData.categories.charts.length > 0 && (
          <ContentSection title="Bảng xếp hạng Nổi bật" showAllLink="/charts">
            {homeData.categories.charts.slice(0, 4).map((category) => {
              const card = categoryToPlaylistCard(category);
              return (
                <PlaylistCard
                  key={card.id}
                  title={card.title}
                  description={card.description}
                  gradient={card.gradient}
                  icon={card.icon}
                  onClick={() => navigate(`/category/${card.id}`)}
                />
              );
            })}
          </ContentSection>
        )}

        {/* Mới phát hành dành cho bạn */}
        {homeData?.newReleases && homeData.newReleases.length > 0 && (
          <ContentSection title="Mới phát hành dành cho bạn" showAllLink="/new-releases">
            {homeData.newReleases.slice(0, 5).map((song) => {
              const card = songToCard(song);
              return (
                <MusicCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  onClick={() => setCurrentTrack({
                    id: song._id,
                    title: song.title,
                    artist: song.artist?.name || 'Unknown',
                    image: song.thumbnail,
                    audioUrl: song.src,
                  })}
                />
              );
            })}
          </ContentSection>
        )}

        {/* Playlist dành cho bạn */}
        {homeData?.categories?.playlists && homeData.categories.playlists.length > 0 && (
          <ContentSection title="Playlist dành cho bạn" showAllLink="/playlists">
            {homeData.categories.playlists.slice(0, 5).map((category) => {
              const card = categoryToCard(category);
              return (
                <MusicCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  onClick={() => navigate(`/category/${card.id}`)}
                />
              );
            })}
          </ContentSection>
        )}

        {/* Trending - Most Played */}
        {homeData?.trending && homeData.trending.length > 0 && (
          <ContentSection title="Đang thịnh hành" showAllLink="/trending">
            {homeData.trending.slice(0, 5).map((song) => {
              const card = songToCard(song);
              return (
                <MusicCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  onClick={() => setCurrentTrack({
                    id: song._id,
                    title: song.title,
                    artist: song.artist?.name || 'Unknown',
                    image: song.thumbnail,
                    audioUrl: song.src,
                  })}
                />
              );
            })}
          </ContentSection>
        )}

        {/* Album Categories */}
        {homeData?.categories?.albums && homeData.categories.albums.length > 0 && (
          <ContentSection title="Album mà bạn có thể thích" showAllLink="/albums">
            {homeData.categories.albums.slice(0, 5).map((category) => {
              const card = categoryToCard(category);
              return (
                <MusicCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  onClick={() => navigate(`/category/${card.id}`)}
                />
              );
            })}
          </ContentSection>
        )}

        {/* Artist Categories */}
        {homeData?.categories?.artists && homeData.categories.artists.length > 0 && (
          <ContentSection title="Nghệ sĩ tiêu biểu" showAllLink="/artists">
            {homeData.categories.artists.slice(0, 5).map((category) => {
              const card = categoryToCard(category);
              return (
                <MusicCard
                  key={card.id}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                  type="circle"
                  onClick={() => navigate(`/category/${card.id}`)}
                />
              );
            })}
          </ContentSection>
        )}
      </main>

      {/* Footer */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <Footer />
      </div>

      {/* Sidebar - Thư viện */}
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

      {/* Music Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        onNext={() => console.log('Next track')}
        onPrevious={() => console.log('Previous track')}
      />
    </div>
  );
};

export default Home;