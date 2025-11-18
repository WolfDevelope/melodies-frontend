import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Header from '../components/common/Header';
import ContentSection from '../components/common/ContentSection';
import MusicCard from '../components/common/MusicCard';
import PlaylistCard from '../components/common/PlaylistCard';
import Footer from '../components/common/Footer';
import MusicPlayer from '../components/common/MusicPlayer';
import Sidebar from '../components/common/Sidebar';

const Home = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
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

        {/* Đề xuất cho bạn */}
        <ContentSection title="Đề xuất cho bạn" showAllLink="/recommendations">
          {recommendations.map((item) => (
            <MusicCard
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              onClick={() => console.log('Clicked:', item.title)}
            />
          ))}
        </ContentSection>

        {/* Bảng xếp hạng nổi bật */}
        <ContentSection title="Bảng xếp hạng Nổi bật" showAllLink="/charts">
          {charts.map((chart) => (
            <PlaylistCard
              key={chart.id}
              title={chart.title}
              description={chart.description}
              gradient={chart.gradient}
              icon={chart.icon}
              onClick={() => console.log('Clicked:', chart.title)}
            />
          ))}
        </ContentSection>

        {/* Mới phát hành dành cho bạn */}
        <ContentSection title="Mới phát hành dành cho bạn" showAllLink="/new-releases">
          {newReleases.map((item) => (
            <MusicCard
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              onClick={() => console.log('Clicked:', item.title)}
            />
          ))}
        </ContentSection>

        {/* Nghệ sĩ tiêu biểu */}
        <ContentSection title="Nghệ sĩ tiêu biểu" showAllLink="/artists">
          {artists.map((artist) => (
            <MusicCard
              key={artist.id}
              image={artist.image}
              title={artist.title}
              description={artist.description}
              type="circle"
              onClick={() => console.log('Clicked:', artist.title)}
            />
          ))}
        </ContentSection>

        {/* Album mà bạn có thể thích */}
        <ContentSection title="Album mà bạn có thể thích" showAllLink="/albums">
          {albums.map((album) => (
            <MusicCard
              key={album.id}
              image={album.image}
              title={album.title}
              description={album.description}
              onClick={() => console.log('Clicked:', album.title)}
            />
          ))}
        </ContentSection>
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