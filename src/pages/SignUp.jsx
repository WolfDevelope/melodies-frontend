import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import { GoogleOutlined, AppleOutlined } from '@ant-design/icons';
import NotificationModal from '../components/common/NotificationModal';
import authService from '../services/authService';
import usePageTitle from '../hooks/usePageTitle';

const SignUp = () => {
  usePageTitle('Đăng ký');

  const [email, setEmail] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLoginLink, setShowLoginLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setShowErrorAlert(false);
    setShowLoginLink(false);
    
    // Check if email is empty
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập địa chỉ email!');
      setShowErrorAlert(true);
      return;
    }
    
    // Check if email format is valid
    if (!validateEmail(email)) {
      setErrorMessage('Email không đúng định dạng. Vui lòng nhập email hợp lệ!');
      setShowErrorAlert(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if email already exists
      const response = await authService.checkEmail(email);
      
      if (response.exists) {
        // Email already exists
        setErrorMessage('Email đã tồn tại, vui lòng ');
        setShowLoginLink(true);
        setShowErrorAlert(true);
        setLoading(false);
      } else {
        // Email is available, send OTP
        try {
          await authService.sendOTP(email, 'bạn');
          
          // Navigate to email verification page
          navigate('/signup/verify-email', { 
            state: { 
              email,
              fromSignup: true // Flag để biết đến từ signup
            } 
          });
        } catch (otpError) {
          console.error('Send OTP error:', otpError);
          setErrorMessage('Không thể gửi mã xác thực. Vui lòng thử lại!');
          setShowErrorAlert(true);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Check email error:', error);
      setErrorMessage('Không thể kiểm tra email. Vui lòng thử lại!');
      setShowErrorAlert(true);
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup');
  };

  const handleAppleSignup = () => {
    console.log('Apple signup');
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            Melodies
          </h1>
        </div>

        {/* Title */}
        <h1 className="text-white text-4xl font-extrabold text-center mb-8">
          Đăng ký để<br />bắt đầu nghe
        </h1>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-white font-semibold mb-2">
              Địa chỉ email
            </label>
            <Input
              type="text"
              id="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
            onClose={() => {
              setShowErrorAlert(false);
              setShowLoginLink(false);
            }}
            type="error"
            message={errorMessage}
            closable={true}
            linkTo={showLoginLink ? '/login' : undefined}
            linkText="đăng nhập"
          />
          
          <Link to="/signup/phone" className="block text-pink-400 hover:text-pink-300 underline text-sm">
            Dùng số điện thoại.
          </Link>

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
            {loading ? 'Đang kiểm tra...' : 'Tiếp theo'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-white text-sm">hoặc</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGoogleSignup}
            className="w-full h-12 bg-transparent border border-gray-600 hover:border-white rounded-full font-semibold text-white flex items-center justify-center gap-3"
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              borderColor: '#6b7280',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#6b7280'}
          >
            <GoogleOutlined className="text-xl" />
            Đăng ký bằng Google
          </Button>

          <Button
            onClick={handleAppleSignup}
            className="w-full h-12 bg-transparent border border-gray-600 hover:border-white rounded-full font-semibold text-white flex items-center justify-center gap-3"
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              borderColor: '#6b7280',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#6b7280'}
          >
            <AppleOutlined className="text-xl" />
            Đăng ký bằng Apple
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Bạn đã có tài khoản?{' '}
            <Link to="/login" className="text-white hover:text-pink-500 underline font-semibold">
              Đăng nhập tại đây.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
