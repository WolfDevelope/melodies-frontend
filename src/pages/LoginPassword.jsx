import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import NotificationModal from '../components/common/NotificationModal';

const LoginPassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu!');
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    try {
      // Call API to login
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Save user info
        authService.saveUser(response.user);
        message.success('Đăng nhập thành công!');
        
        // Navigate to home page (will be created later)
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'Tên người dùng hoặc mật khẩu không chính xác.');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
    message.info('Tính năng đặt lại mật khẩu sẽ được cập nhật sau');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4 pt-16 pb-16">
      <div className="w-full max-w-md">
        {/* Back button and title */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-white hover:text-pink-400 mb-6 transition-colors"
          >
            <ArrowLeftOutlined className="text-xl" />
          </button>
          
          <h1 className="text-white text-3xl font-bold mb-0">
            Đăng nhập bằng mật khẩu
          </h1>
        </div>

        {/* Error Alert - Inline notification */}
        <NotificationModal
          visible={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          type="error"
          message={errorMessage}
          closable={true}
        />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Display */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Email hoặc tên người dùng
            </label>
            <Input
              type="text"
              value={email}
              disabled
              className="h-12 border-gray-700 rounded-md"
              style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Mật khẩu
            </label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 border-gray-700 hover:border-gray-600 focus:border-white rounded-md"
              style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
              }}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              }
            />
          </div>

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
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleForgotPassword}
            className="text-white font-semibold hover:text-pink-400 underline"
          >
            Đăng nhập không cần mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPassword;
