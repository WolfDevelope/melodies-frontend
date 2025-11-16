import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined, SearchOutlined, UserOutlined, ExportOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

/**
 * Header - Reusable header component with navigation
 * @param {boolean} showNav - Show navigation buttons (default: true)
 * @param {boolean} showPremium - Show premium button (default: true)
 */
const Header = ({ showNav = true, showPremium = true }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // User menu items
  const menuItems = [
    {
      key: 'account',
      label: (
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Tài khoản</span>
          <ExportOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
        </div>
      ),
      onClick: () => {
        navigate('/account');
        setDropdownOpen(false);
      },
    },
    {
      key: 'profile',
      label: (
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Hồ sơ</span>
          <ExportOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
        </div>
      ),
      onClick: () => {
        // Navigate to profile
        setDropdownOpen(false);
      },
    },
    {
      key: 'premium',
      label: (
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Nâng cấp lên Premium</span>
          <ExportOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
        </div>
      ),
      onClick: () => {
        // Navigate to premium
        setDropdownOpen(false);
      },
    },
    {
      key: 'support',
      label: (
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Hỗ trợ</span>
          <ExportOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
        </div>
      ),
      onClick: () => {
        // Navigate to support
        setDropdownOpen(false);
      },
    },
    {
      key: 'download',
      label: (
        <div className="flex items-center justify-between px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Tải xuống</span>
          <ExportOutlined style={{ color: '#ffffff', fontSize: '14px' }} />
        </div>
      ),
      onClick: () => {
        // Navigate to download
        setDropdownOpen(false);
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: (
        <div className="px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Cài đặt</span>
        </div>
      ),
      onClick: () => {
        // Navigate to settings
        setDropdownOpen(false);
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div className="px-2 py-2 hover:bg-white/5 rounded">
          <span className="text-white font-medium">Đăng xuất</span>
        </div>
      ),
      onClick: () => {
        // Handle logout
        localStorage.removeItem('user');
        navigate('/login');
        setDropdownOpen(false);
      },
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-md ">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="pl-20 flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Melodies
              </h1>
            </Link>

            {/* Navigation */}
            {showNav && (
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
            )}
          </div>

          {/* Right: User Menu */}
          <div className="flex items-center space-x-4">
            {showPremium && (
              <button className="px-6 py-1.5 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
                Khám phá Premium
              </button>
            )}
            <Dropdown
              menu={{ items: menuItems }}
              trigger={['click']}
              open={dropdownOpen}
              onOpenChange={setDropdownOpen}
              placement="bottomRight"
              overlayClassName="user-menu-dropdown"
              dropdownRender={(menu) => (
                <div className="bg-[#22172b] rounded-lg shadow-2xl min-w-[240px] py-2">
                  {menu}
                </div>
              )}
            >
              <button
                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              >
                <UserOutlined className="text-white text-lg" />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;