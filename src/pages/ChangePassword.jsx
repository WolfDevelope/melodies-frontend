import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, Radio, message } from 'antd';
import { LeftOutlined, EyeOutlined, EyeInvisibleOutlined, UserOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import ActionButtons from '../components/common/ActionButtons';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Validate password requirements
  const validatePassword = (password) => {
    const hasMinLength = password.length >= 10;
    const hasLetterOrNumber = /[a-zA-Z0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasMinLength,
      hasLetterOrNumber,
      hasSpecialChar,
      isValid: hasMinLength && (hasLetterOrNumber || hasSpecialChar),
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      message.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (!passwordValidation.isValid) {
      message.error('Mật khẩu mới không đáp ứng yêu cầu!');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      message.error('Mật khẩu mới không khớp!');
      return;
    }

    setLoading(true);
    try {
      // Bước 1: Xác thực mật khẩu cũ và gửi OTP
      const response = await authService.verifyPasswordAndSendOTP(formData.currentPassword);
      
      // Lưu thông tin đổi mật khẩu vào localStorage để sử dụng sau khi verify OTP
      localStorage.setItem('pendingPasswordChange', JSON.stringify({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }));

      // Bước 2: Chuyển đến trang xác thực OTP
      navigate('/signup/verify-email', {
        state: {
          email: response.email,
          name: response.name,
          fromChangePassword: true,
        }
      });
    } catch (error) {
      message.error(error.message || 'Không thể xác thực mật khẩu. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

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

          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <Link to="/premium" className="text-white hover:text-pink-400 transition-colors">
                Premium
              </Link>
              <Link to="/support" className="text-white hover:text-pink-400 transition-colors">
                Hỗ trợ
              </Link>
              <Link to="/download" className="text-white hover:text-pink-400 transition-colors">
                Tải xuống
              </Link>
            </nav>

            <div className="border-l border-white/20 h-6"></div>
            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer">
                <UserOutlined className="text-white text-lg" />
              </div>
             <Link to="/account" className="text-white hover:text-pink-400 transition-colors">
              Hồ sơ
             </Link> 
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/account')}
          className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-8"
        >
          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors">
            <LeftOutlined style={{ fontSize: '16px' }} />
          </div>
        </button>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-12">
          Đổi mật khẩu của bạn
        </h1>

        {/* Form */}
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <Input.Password
                size="large"
                value={formData.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                visibilityToggle={{
                  visible: showCurrentPassword,
                  onVisibleChange: setShowCurrentPassword,
                }}
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined style={{ color: 'white', fontSize: '18px' }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: 'white', fontSize: '18px' }} />
                  )
                }
                style={{
                  backgroundColor: '#2a2a3e',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '16px',
                  padding: '12px 16px',
                }}
                className="hover:border-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Input.Password
                size="large"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                placeholder="Nhập mật khẩu mới"
                visibilityToggle={{
                  visible: showNewPassword,
                  onVisibleChange: setShowNewPassword,
                }}
                iconRender={(visible) =>
                  visible ? (
                    <EyeOutlined style={{ color: 'white', fontSize: '18px' }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: 'white', fontSize: '18px' }} />
                  )
                }
                style={{
                  backgroundColor: '#2a2a3e',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '16px',
                  padding: '12px 16px',
                }}
                className="hover:border-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="space-y-3 mt-4">
            <p className="text-white font-semibold text-sm">
              Mật khẩu của bạn phải có ít nhất
            </p>
            <Radio.Group value={null} className="flex flex-col space-y-2">
              <Radio
                value="length"
                checked={passwordValidation.hasMinLength}
                style={{
                  color: passwordValidation.hasMinLength ? '#10b981' : 'white',
                }}
              >
                <span style={{ color: passwordValidation.hasMinLength ? '#10b981' : 'white' }}>
                  10 ký tự
                </span>
              </Radio>
              <Radio
                value="letterOrNumber"
                checked={passwordValidation.hasLetterOrNumber}
                style={{
                  color: passwordValidation.hasLetterOrNumber ? '#10b981' : 'white',
                }}
              >
                <span style={{ color: passwordValidation.hasLetterOrNumber ? '#10b981' : 'white' }}>
                  1 chữ số hoặc ký tự đặc biệt (ví dụ: # ? ! &)
                </span>
              </Radio>
            </Radio.Group>
          </div>

          {/* Confirm New Password */}
          <div className="mt-6">
            <label className="block text-white font-semibold mb-2">
              Lặp lại mật khẩu mới
            </label>
            <Input.Password
              size="large"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              iconRender={(visible) =>
                visible ? (
                  <EyeOutlined style={{ color: 'white', fontSize: '18px' }} />
                ) : (
                  <EyeInvisibleOutlined style={{ color: 'white', fontSize: '18px' }} />
                )
              }
              style={{
                backgroundColor: '#2a2a3e',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '16px',
                padding: '12px 16px',
              }}
              className="hover:border-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Action Buttons */}
          <ActionButtons
          onCancel={() => navigate('/account')}
          onSubmit={handleSubmit}
          loading={loading}
          disabled={!passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
          submitText="Cài đặt mật khẩu mới"
          cancelText="Hủy"
          />
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="flex justify-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Melodies
              </h1>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Công ty</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white">Việc làm</a></li>
                <li><a href="#" className="hover:text-white">For the Record</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Cộng đồng</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Dành cho nghệ sĩ</a></li>
                <li><a href="#" className="hover:text-white">Nhà phát triển</a></li>
                <li><a href="#" className="hover:text-white">Quảng cáo</a></li>
                <li><a href="#" className="hover:text-white">Nhà đầu tư</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liên kết hữu ích</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Hỗ trợ</a></li>
                <li><a href="#" className="hover:text-white">Ứng dụng di động miễn phí</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Pháp lý</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-white">Chính sách quyền riêng tư</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-400">
            <p>&copy; 2025 Melodies Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChangePassword;
