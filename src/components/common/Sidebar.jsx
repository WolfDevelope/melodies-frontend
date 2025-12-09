import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, ArrowsAltOutlined } from '@ant-design/icons';

/**
 * Sidebar Component - Collapsible sidebar for library/navigation
 * @param {boolean} collapsed - Sidebar collapsed state
 * @param {function} onCollapse - Callback when collapse state changes
 * @param {function} onExpandLibrary - Callback when expand library button is clicked
 * @param {string} title - Sidebar title (default: "Thư viện")
 * @param {array} menuItems - Array of menu items to display
 * @param {ReactNode} expandedContent - Content to show when sidebar is expanded
 * @param {string} className - Additional CSS classes
 * @param {boolean} showLogo - Show Melodies logo at top (for admin)
 * @param {string} variant - Sidebar variant: 'default' or 'admin'
 */
const Sidebar = ({
  collapsed = false,
  onCollapse,
  onExpandLibrary,
  title = 'Thư viện',
  menuItems = [],
  expandedContent,
  className = '',
  showLogo = false,
  variant = 'default',
}) => {
  const isAdmin = variant === 'admin';
  
  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 ${
        isAdmin ? 'bg-gradient-to-b from-[#22172b] to-[#1a1a2e]' : 'bg-black/40 backdrop-blur-md'
      } border-none ${isAdmin ? 'p-0' : 'p-4'} hidden lg:block transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      


      <div className={`space-y-4 ${isAdmin ? 'mt-8 px-4' : ''}`}>
        {/* Title/Library Button with Collapse Icon (only for non-admin) */}
        {!isAdmin && (
          <div className="relative group">
            {collapsed ? (
              /* Expand Button - Shows when collapsed */
              <button
                onClick={() => onCollapse && onCollapse(false)}
                className="w-full flex items-center justify-center px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white hover:scale-110"
                title="Mở rộng"
              >
                <MenuUnfoldOutlined style={{ fontSize: '20px', color: '#ffffff' }} />
              </button>
            ) : (
              <>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
                  <span className="font-semibold">{title}</span>
                </button>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {/* Expand Library Button */}
                  <button
                    onClick={() => onExpandLibrary && onExpandLibrary()}
                    className="hover:scale-110 transition-all p-1 hover:bg-white/10 rounded-full w-10 h-10"
                    style={{ color: '#ffffff' }}
                    title="Mở rộng thư viện"
                  >
                    <ArrowsAltOutlined style={{ fontSize: '18px', color: '#ffffff' }} />
                  </button>
                  {/* Collapse Toggle Icon */}
                  <button
                    onClick={() => onCollapse && onCollapse(true)}
                    className="hover:scale-110 transition-all p-1 hover:bg-white/10 rounded-full w-10 h-10"
                    style={{ color: '#ffffff' }}
                    title="Thu gọn"
                  >
                    <MenuFoldOutlined style={{ fontSize: '18px', color: '#ffffff' }} />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center' : 'space-x-3'
            } px-4 py-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={item.label}
          >
            {item.icon && <span className="text-xl">{item.icon}</span>}
            {!collapsed && item.label && (
              <span className="font-semibold">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      {/* Expanded Content */}
      {!collapsed && expandedContent && (
        <div className={`mt-8 ${isAdmin ? 'px-4' : ''}`}>{expandedContent}</div>
      )}
    </aside>
  );
};

export default Sidebar;
