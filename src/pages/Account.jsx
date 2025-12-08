import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Button } from 'antd';
import { SearchOutlined, UserOutlined, EditOutlined, SafetyOutlined, CreditCardOutlined, RightOutlined, CrownOutlined, LockOutlined, AppstoreOutlined, BellOutlined, EyeOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import ToastNotification from '../components/common/ToastNotification';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

const Account = () => {
  usePageTitle('Tài khoản');
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Lấy thông tin user từ localStorage hoặc API
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }

    // Hiển thị toast nếu có message từ navigation state
    if (location.state?.showToast && location.state?.message) {
      setToastMessage(location.state.message);
      setShowSuccessToast(true);
      // Clear state để không hiển thị lại khi refresh
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const accountSections = [
    {
      title: 'Tài khoản',
      items: [
        {
          icon: <UserOutlined className="text-xl" />,
          label: 'Quản lý gói đăng ký',
          onClick: () => console.log('Manage subscription'),
        },
        {
          icon: <EditOutlined className="text-xl" />,
          label: 'Chỉnh sửa thông tin cá nhân',
          onClick: () => navigate('/account/edit-profile'),
        },
        {
          icon: <SafetyOutlined className="text-xl" />,
          label: 'Khôi phục danh sách phát',
          onClick: () => console.log('Recover playlist'),
        },
      ],
    },
    {
      title: 'Thanh toán',
      items: [
        {
          icon: <CreditCardOutlined className="text-xl" />,
          label: 'Quản lý phương thức thanh toán',
          onClick: () => console.log('Payment methods'),
        },
        {
          icon: <CreditCardOutlined className="text-xl" />,
          label: 'Lịch sử giao dịch',
          onClick: () => console.log('Transaction history'),
        },
      ],
    },
    {
      title: 'Bảo mật và quyền riêng tư',
      items: [
        {
          icon: <LockOutlined className="text-xl" />,
          label: 'Đổi mật khẩu',
          onClick: () => navigate('/account/change-password'),
        },
        {
          icon: <AppstoreOutlined className="text-xl" />,
          label: 'Quản lý ứng dụng',
          onClick: () => console.log('Manage apps'),
        },
        {
          icon: <BellOutlined className="text-xl" />,
          label: 'Cài đặt thông báo',
          onClick: () => console.log('Notification settings'),
        },
        {
          icon: <EyeOutlined className="text-xl" />,
          label: 'Quyền riêng tư của tài khoản',
          onClick: () => console.log('Account privacy'),
        },
        {
          icon: <LoginOutlined className="text-xl" />,
          label: 'Chỉnh sửa phương thức đăng nhập',
          onClick: () => console.log('Edit login methods'),
        },
        {
          icon: <LogoutOutlined className="text-xl" />,
          label: 'Đăng xuất ở mọi nơi',
          onClick: () => {
            authService.logout();
            navigate('/login');
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-none sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Melodies
            </h1>
          </Link>

          {/* Navigation & User Menu */}
          <div className="flex items-center gap-8">
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-gray-300 hover:text-white transition-colors font-medium">
                Premium
              </button>
              <button className="text-gray-300 hover:text-white transition-colors font-medium">
                Hỗ trợ
              </button>
              <button className="text-gray-300 hover:text-white transition-colors font-medium">
                Tải xuống
              </button>
            </nav>

            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-white/20"></div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer">
                <UserOutlined className="text-white text-lg" />
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            size="large"
            placeholder="Tìm kiếm tài khoản hoặc bài viết trợ giúp"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#2a2a3e] border-none rounded-lg text-white placeholder-gray-400"
            style={{
              backgroundColor: '#2a2a3e',
              color: 'white',
            }}
          />
        </div>

        {/* Premium Card */}
        <div className="mb-8 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <h2 className="text-white text-3xl font-bold mb-2">Melodies Free</h2>
            <button className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all border border-white/20">
              Tìm hiểu các gói
            </button>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center min-w-[180px]">
            <CrownOutlined className="text-white text-4xl mb-3" />
            <span className="text-white font-bold text-lg">Dùng Premium</span>
          </div>
        </div>

        {/* Account Sections */}
        {accountSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-8">
            <h3 className="text-white text-2xl font-bold mb-4">{section.title}</h3>
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/5 transition-all border-b border-white/5 last:border-b-0 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-white font-medium text-lg">{item.label}</span>
                  </div>
                  <div className="text-white group-hover:scale-110 transition-transform">
                    <RightOutlined style={{ fontSize: '16px', color: 'white' }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* User Info Section */}
        {user && (
          <div className="mb-8">
            <h3 className="text-white text-2xl font-bold mb-4">Thông tin cá nhân</h3>
            <div className="bg-[#1a1a2e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white text-lg font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Tên hiển thị</label>
                  <p className="text-white text-lg font-medium">{user.name || 'Chưa cập nhật'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Ngày sinh</label>
                  <p className="text-white text-lg font-medium">{user.birthday || 'Chưa cập nhật'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

       
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Success Toast Notification */}
      <ToastNotification
        visible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message={toastMessage}
        duration={3000}
      />
    </div>
  );
};

export default Account;
