import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Button, Radio } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import SignupHeader from '../components/SignupHeader';

const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password created for:', email);
    // Navigate to personal info page
    navigate('/signup/personal-info', { state: { email, password } });
  };

  const handleBack = () => {
    navigate('/signup');
  };

  // Check password requirements
  const hasMinLength = password.length >= 10;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex flex-col items-center px-4">
      <SignupHeader currentStep={1} />
      
      <div className="w-full max-w-md">

        {/* Back button and title */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-white hover:text-pink-400 mb-4 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            <div className="text-left">
              <div className="text-sm text-gray-400">Bước 1 của 3</div>
              <div className="font-semibold">Tạo mật khẩu</div>
            </div>
          </button>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-white font-semibold mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 border-gray-700 hover:border-gray-600 focus:border-white rounded-md pr-12"
                style={{
                  backgroundColor: '#1a1a2e',
                  color: 'white',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeInvisibleOutlined className="text-xl" /> : <EyeOutlined className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Password requirements */}
          <div>
            <p className="text-white font-semibold mb-3">Mật khẩu của bạn phải có ít nhất</p>
            <Radio.Group className="w-full space-y-2">
              <div className="flex items-center">
                <Radio checked={hasLetter} disabled className="text-white">
                  <span className="text-white">1 chữ cái</span>
                </Radio>
              </div>
              <div className="flex items-center">
                <Radio checked={hasNumberOrSpecial} disabled>
                  <span className="text-white">1 chữ số hoặc ký tự đặc biệt (ví dụ: # ? ! &)</span>
                </Radio>
              </div>
              <div className="flex items-center">
                <Radio checked={hasMinLength} disabled>
                  <span className="text-white">10 ký tự</span>
                </Radio>
              </div>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            disabled={!hasMinLength || !hasLetter || !hasNumberOrSpecial}
            className="w-full h-12 bg-pink-500 hover:bg-pink-600 border-none rounded-full font-semibold text-base disabled:bg-gray-600 disabled:cursor-not-allowed"
            style={{
              backgroundColor: (hasMinLength && hasLetter && hasNumberOrSpecial) ? '#ec4899' : '#4b5563',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (hasMinLength && hasLetter && hasNumberOrSpecial) {
                e.currentTarget.style.backgroundColor = '#db2777';
              }
            }}
            onMouseLeave={(e) => {
              if (hasMinLength && hasLetter && hasNumberOrSpecial) {
                e.currentTarget.style.backgroundColor = '#ec4899';
              }
            }}
          >
            Tiếp theo
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="#" className="underline hover:text-white">Privacy Policy</a> and{' '}
            <a href="#" className="underline hover:text-white">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
