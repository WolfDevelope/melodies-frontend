import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import { GoogleOutlined, AppleOutlined, FacebookOutlined, MobileOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import NotificationModal from '../components/common/NotificationModal';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setShowErrorAlert(false);
    
    if (!emailOrUsername.trim()) {
      setErrorMessage('Vui lòng nhập email hoặc tên người dùng!');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);

    try {
      // Check if email exists via API
      const response = await authService.checkEmail(emailOrUsername);
      
      if (response.exists) {
        // Navigate to password page with email
        navigate('/login/password', { state: { email: emailOrUsername } });
      } else {
        setErrorMessage('Email hoặc tên người dùng không tồn tại!');
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error('Check email error:', error);
      setErrorMessage('Không thể kiểm tra email. Vui lòng thử lại!');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    console.log('Phone login');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login');
  };

  const handleAppleLogin = () => {
    console.log('Apple login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4 pt-16 pb-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Melodies
          </h1>
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl font-extrabold text-center mb-8">
          Chào<br />mừng bạn<br />quay trở lại
        </h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="emailOrUsername" className="block text-white font-semibold mb-2">
              Email hoặc tên người dùng
            </label>
            <Input
              type="text"
              id="emailOrUsername"
              placeholder="Email hoặc tên người dùng"
              value={emailOrUsername}
              onChange={(e) => {
                setEmailOrUsername(e.target.value);
                // Clear error when user types
                if (showErrorAlert) {
                  setShowErrorAlert(false);
                }
              }}
              className="h-12 border-gray-700 hover:border-gray-600 focus:border-white rounded-md"
              style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
              }}
            />
          </div>

          {/* Error Alert - Inline notification */}
          <NotificationModal
            visible={showErrorAlert}
            onClose={() => setShowErrorAlert(false)}
            type="error"
            message={errorMessage}
            closable={true}
          />

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            className="w-full h-12 bg-pink-500 hover:bg-pink-600 border-none rounded-full font-semibold text-base"
            style={{
              backgroundColor: loading ? '#db2777' : '#ec4899',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#db2777';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#ec4899';
              }
            }}
          >
            {loading ? 'Đang kiểm tra...' : 'Tiếp tục'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm">hoặc</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={handlePhoneLogin}
            className="w-full h-12 bg-transparent border-gray-600 hover:border-gray-400 rounded-full font-semibold text-white flex items-center justify-center"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#4b5563',
              color: 'white',
            }}
          >
            <MobileOutlined className="mr-2 text-lg" />
            Tiếp tục bằng số điện thoại
          </Button>

          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 bg-transparent border-gray-600 hover:border-gray-400 rounded-full font-semibold text-white flex items-center justify-center"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#4b5563',
              color: 'white',
            }}
          >
            <GoogleOutlined className="mr-2 text-lg" />
            Tiếp tục bằng Google
          </Button>

          <Button
            onClick={handleFacebookLogin}
            className="w-full h-12 bg-transparent border-gray-600 hover:border-gray-400 rounded-full font-semibold text-white flex items-center justify-center"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#4b5563',
              color: 'white',
            }}
          >
            <FacebookOutlined className="mr-2 text-lg" />
            Tiếp tục bằng Facebook
          </Button>

          <Button
            onClick={handleAppleLogin}
            className="w-full h-12 bg-transparent border-gray-600 hover:border-gray-400 rounded-full font-semibold text-white flex items-center justify-center"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#4b5563',
              color: 'white',
            }}
          >
            <AppleOutlined className="mr-2 text-lg" />
            Tiếp tục bằng Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">Bạn chưa có tài khoản?</p>
          <Link
            to="/signup"
            className="text-white font-semibold hover:text-pink-400 underline text-base"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
