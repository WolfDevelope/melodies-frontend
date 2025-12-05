import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, SearchOutlined, UserOutlined, ExportOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';

/**
 * Header - Reusable header component with navigation
 * @param {boolean} showNav - Show navigation buttons (default: true)
 * @param {boolean} showPremium - Show premium button (default: true)
 * @param {string} pageTitle - Custom page title to display instead of nav (optional)
 * @param {ReactNode} pageTitleIcon - Icon for page title (optional)
 * @param {string} searchQuery - Search query from parent (optional)
 * @param {function} onSearchChange - Callback when search changes (optional)
 */
const Header = ({ 
  showNav = true, 
  showPremium = true, 
  pageTitle = '', 
  pageTitleIcon = null,
  searchQuery = '',
  onSearchChange = null 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Check if current page is home or search
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isSearchPage = location.pathname === '/search';
  
  // Use controlled or uncontrolled search
  const currentSearchQuery = onSearchChange ? searchQuery : localSearchQuery;

  // Auto-focus search input on search page
  useEffect(() => {
    if (isSearchPage && searchInputRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchPage]);
  

  // Controlled Component - State management with debouncing
  const handleSearchChange = (value) => {
    if (onSearchChange) {
      // Controlled mode - parent handles navigation
      onSearchChange(value);
    } else {
      // Uncontrolled mode
      setLocalSearchQuery(value);
    }

    // Debouncing - Show loading state briefly
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.trim()) {
      setSearchLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        setSearchLoading(false);
      }, 300);
    } else {
      setSearchLoading(false);
    }
  };
  
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };
  
  const handleClearSearch = () => {
    handleSearchChange('');
    setSearchLoading(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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

            
            
            {/* Navigation - Always show if showNav is true */}
            {showNav && (
              <nav className="flex items-center space-x-4 flex-1 max-w-3xl">
                <button 
                  onClick={() => navigate('/home')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                    isHomePage 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </button>
                
                {/* Search Input with Suggestions */}
                <div className="flex-1 max-w-xl relative">
                  <div className="relative flex items-center">
                    {/* Loading State - Better UX */}
                    {searchLoading ? (
                      <LoadingOutlined 
                        className="absolute left-4 text-gray-400 z-10" 
                        style={{ fontSize: '20px' }}
                        spin
                      />
                    ) : (
                      <SearchOutlined 
                        className="absolute left-4 text-gray-400 z-10" 
                        style={{ fontSize: '20px' }}
                      />
                    )}
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={currentSearchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={handleSearchFocus}
                      placeholder="Bạn muốn phát nội dung gì?"
                      className="w-full pl-12 pr-12 py-3 rounded-full bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 hover:bg-[#2a2a2a] transition-colors"
                    />
                    {currentSearchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-4 text-gray-400 hover:text-white transition-colors z-10"
                      >
                        <CloseOutlined style={{ fontSize: '16px' }} />
                      </button>
                    )}
                  </div>
                </div>
              </nav>
            )}

            {/* Page Title (if provided) */}
            {pageTitle && (
              <h2 className="text-white text-2xl font-bold flex items-center gap-3">
                {pageTitleIcon && <span className="text-2xl">{pageTitleIcon}</span>}
                {pageTitle}
              </h2>
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