import React, { useState } from 'react';
import { SearchOutlined, ShrinkOutlined, PlusOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import MusicCard from './MusicCard';

/**
 * LibraryModal - Full-screen library view
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Callback to close modal
 */
const LibraryModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('playlists');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');

  // Create gradient image for liked songs
  const likedSongsImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="300" height="300" fill="url(%23grad)"/%3E%3Cpath d="M150 220l-45-41C82 158 65 142 65 122c0-20 15-35 35-35 11 0 22 5 30 14 8-9 19-14 30-14 20 0 35 15 35 35 0 20-17 36-40 57l-45 41z" fill="white"/%3E%3C/svg%3E';

  // Mock data - Replace with real data from API
  const libraryItems = {
    playlists: [
      {
        id: 1,
        title: 'Bài hát đã thích',
        type: 'Danh sách phát • Ẩn',
        image: likedSongsImage,
        isLiked: true,
      },
      {
        id: 2,
        title: 'Danh sách phát của tôi',
        type: 'Danh sách phát • Ẩn',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
      },
      {
        id: 3,
        title: 'Sabrina Carpenter',
        type: 'Nghệ sĩ',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        isArtist: true,
      },
      {
        id: 4,
        title: 'Adele',
        type: 'Nghệ sĩ',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
        isArtist: true,
      },
      {
        id: 5,
        title: 'Danh sách phát của tôi #2',
        type: 'Danh sách phát • Ẩn',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300',
      },
    ],
    artists: [
      {
        id: 3,
        title: 'Sabrina Carpenter',
        type: 'Nghệ sĩ',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        isArtist: true,
      },
      {
        id: 4,
        title: 'Adele',
        type: 'Nghệ sĩ',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
        isArtist: true,
      },
    ],
  };

  const filteredItems = libraryItems[activeTab].filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className={`fixed bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] z-50 transition-all duration-500 flex flex-col ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
      }`}
      style={{ 
        top: '80px',      // Below header with margin (header = 64px + 16px margin)
        left: 0, 
        right: 0, 
        bottom: 0         // Full height to bottom, music player will overlay on top
      }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-b from-[#1a1a2e]/95 to-transparent backdrop-blur-md z-10 px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            
            <h1 className="text-white text-3xl font-bold">Thư viện</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 flex items-center gap-2">
              <PlusOutlined />
              <span className="font-semibold">Tạo</span>
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
              title={viewMode === 'grid' ? 'Chế độ danh sách' : 'Chế độ lưới'}
            >
              {viewMode === 'grid' ? (
                <UnorderedListOutlined className="text-white" />
              ) : (
                <AppstoreOutlined className="text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="hover:scale-110 transition-all p-1 hover:bg-white/10 rounded-full w-10 h-10"
              title="Thu gọn thư viện"
            >
              <ShrinkOutlined style={{ fontSize: '18px', color: '#ffffff' }}/>
            </button>
          </div>
        </div>

        {/* Tabs and Search Row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Tabs - Left */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'playlists'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Danh sách phát
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'artists'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Nghệ sĩ
            </button>
          </div>

          {/* Search - Right */}
          <div className="relative w-64">
            <SearchOutlined className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" style={{ fontSize: '16px' }} />
            <Input
              placeholder="Tìm kiếm trong Thư viện"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-4 py-2 rounded-lg bg-white/10 border-none text-white placeholder-gray-400 focus:bg-white/20 text-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                paddingLeft: '35px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-28 overflow-y-auto">
        {viewMode === 'grid' ? (
          /* Grid View */
          <div className=" grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MusicCard
                key={item.id}
                image={item.image}
                title={item.title}
                description={item.type}
                type={item.isArtist ? 'circle' : 'square'}
                onClick={() => console.log('Clicked:', item.title)}
              />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  {item.isLiked ? (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full object-cover ${
                        item.isArtist ? 'rounded-full' : 'rounded'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">{item.type}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 w-12 h-12 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-xl transform hover:scale-110 transition-all">
                  <svg
                    className="w-5 h-5 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Không tìm thấy kết quả
            </h2>
            <p className="text-gray-400">
              Thử tìm kiếm với từ khóa khác
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryModal;
