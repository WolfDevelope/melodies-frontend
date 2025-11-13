import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, SearchOutlined, UserOutlined, PlusOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ContentSection from '../components/common/ContentSection';
import MusicCard from '../components/common/MusicCard';
import PlaylistCard from '../components/common/PlaylistCard';

const Home = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Nav */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link to="/" className=" pl-20 flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Melodies
                </h1>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-colors">
                  <SearchOutlined />
                  <span>Tìm kiếm</span>
                </button>
              </nav>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-4">
              <button className="px-6 py-1.5 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
                Khám phá Premium
              </button>
              <button
                onClick={() => navigate('/account')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <UserOutlined className="text-white text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

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

      {/* Sidebar - Thư viện */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-black/40 backdrop-blur-md border-r border-white/5 p-4 hidden lg:block transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="space-y-4">
          {/* Thư viện Button with Collapse Icon */}
          <div className="relative group">
            {sidebarCollapsed ? (
              /* Expand Button - Shows when collapsed */
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white hover:scale-110"
                title="Mở rộng"
              >
                <MenuUnfoldOutlined style={{ fontSize: '20px', color: '#ffffff' }} />
              </button>
            ) : (
              <>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <span className="font-semibold">Thư viện</span>
                </button>
                {/* Collapse Toggle Icon - Always visible */}
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hover:scale-110 transition-all"
                  style={{ color: '#ffffff' }}
                  title="Thu gọn"
                >
                  <MenuFoldOutlined style={{ fontSize: '20px', color: '#ffffff' }} />
                </button>
              </>
            )}
          </div>

          {/* Tạo danh sách phát Button */}
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
            <PlusOutlined className="text-xl" />
            {!sidebarCollapsed && <span className="font-semibold">Tạo danh sách phát</span>}
          </button>
        </div>

        {/* Expanded Content */}
        {!sidebarCollapsed && (
          <div className="mt-8">
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
        )}
      </aside>
    </div>
  );
};

export default Home;