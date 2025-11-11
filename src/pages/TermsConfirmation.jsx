import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button, Checkbox, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SignupHeader from '../components/SignupHeader';
import authService from '../services/authService';

const TermsConfirmation = () => {
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, name, birthday, gender } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate data
    if (!email || !password || !name || !birthday || !gender) {
      message.error('Thiếu thông tin đăng ký. Vui lòng thử lại!');
      return;
    }

    setLoading(true);

    try {
      // Prepare user data
      const userData = {
        email,
        password,
        name,
        birthday,
        gender,
        marketingConsent,
        dataSharing,
      };

      // Call API to register
      const response = await authService.register(userData);

      if (response.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        
        // Navigate to login page
        navigate('/login', { state: { email } });
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/signup/personal-info', { state: { email, password } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex flex-col items-center px-4 pb-8">
      <SignupHeader currentStep={3} />
      
      <div className="w-full max-w-md">
        {/* Back button and title */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-white hover:text-pink-400 mb-4 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            <div className="text-left">
              <div className="text-sm text-gray-400">Bước 3 của 3</div>
              <div className="font-semibold">Điều khoản & Điều kiện</div>
            </div>
          </button>
        </div>

        {/* Terms Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Marketing Consent */}
          <div 
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => setMarketingConsent(!marketingConsent)}
          >
            <Checkbox 
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="w-full"
            >
              <span className="text-white text-sm">
                Tôi không muốn nhận tin nhắn tiếp thị từ Melodies
              </span>
            </Checkbox>
          </div>

          {/* Data Sharing */}
          <div 
            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => setDataSharing(!dataSharing)}
          >
            <Checkbox 
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
              className="w-full"
            >
              <span className="text-white text-sm">
                Chia sẻ dữ liệu đăng ký của tôi với các nhà cung cấp nội dung của Melodies cho mục đích tiếp thị.
              </span>
            </Checkbox>
          </div>

          {/* Terms Text */}
          <div className="space-y-4 text-sm text-gray-300">
            <p>
              Melodies là một dịch vụ được cá nhân hóa.
            </p>
            <p>
              Bằng việc nhấp vào nút Đăng ký, bạn đồng ý với{' '}
              <Link to="/terms-of-service" className="text-pink-400 hover:text-pink-300 underline" target="_blank">
                Điều khoản và điều kiện sử dụng
              </Link>{' '}
              của Melodies.
            </p>
            <p>
              Bằng cách nhấp vào nút đăng ký, bạn xác nhận đã đọc thông tin về cách chúng tôi xử lý dữ liệu cá nhân của bạn trong{' '}
              <Link to="/privacy-policy" className="text-pink-400 hover:text-pink-300 underline" target="_blank">
                Chính sách quyền riêng tư
              </Link>{' '}
              của chúng tôi.
            </p>
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
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TermsConfirmation;
