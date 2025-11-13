import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import authService from '../services/authService';
import NotificationModal from '../components/common/NotificationModal';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const name = location.state?.name || '';
  const fromSignup = location.state?.fromSignup || false; // Kiểm tra đến từ signup hay registration
  const fromEditProfile = location.state?.fromEditProfile || false; // Kiểm tra đến từ edit profile
  const fromChangePassword = location.state?.fromChangePassword || false; // Kiểm tra đến từ change password

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef([]);

  // Nếu không có email, redirect về signup
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Mask email: h******7@g*l.com
  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    
    const maskedLocal = localPart[0] + '*'.repeat(Math.max(localPart.length - 2, 0)) + localPart[localPart.length - 1];
    const [domainName, domainExt] = domain.split('.');
    const maskedDomain = domainName[0] + '*'.repeat(Math.max(domainName.length - 1, 0));
    
    return `${maskedLocal}@${maskedDomain}.${domainExt}`;
  };

  // Xử lý thay đổi input
  const handleChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Chỉ lấy ký tự cuối
    setOtp(newOtp);

    // Clear error khi user nhập
    if (showErrorAlert) {
      setShowErrorAlert(false);
    }

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý phím backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Xử lý paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus vào ô tiếp theo sau paste
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Mã OTP không chính xác');
      setShowErrorAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.verifyOTP(email, otpCode);
      
      if (response.success) {
        // Kiểm tra nguồn gốc
        if (fromChangePassword) {
          // Từ change password → đổi mật khẩu
          const pendingChange = localStorage.getItem('pendingPasswordChange');
          if (pendingChange) {
            try {
              const changeData = JSON.parse(pendingChange);
              await authService.changePassword(changeData.oldPassword, changeData.newPassword);
              
              // Xóa dữ liệu tạm
              localStorage.removeItem('pendingPasswordChange');
              
              // Chuyển về account với thông báo thành công
              navigate('/account', {
                state: {
                  message: 'Đổi mật khẩu thành công!',
                  showToast: true
                }
              });
            } catch (changeError) {
              setErrorMessage('Không thể đổi mật khẩu. Vui lòng thử lại!');
              setShowErrorAlert(true);
            }
          }
        } else if (fromEditProfile) {
          // Từ edit profile → cập nhật thông tin với email mới
          const pendingUpdate = localStorage.getItem('pendingProfileUpdate');
          if (pendingUpdate) {
            try {
              const updateData = JSON.parse(pendingUpdate);
              await authService.updateProfile(updateData);
              
              // Xóa dữ liệu tạm
              localStorage.removeItem('pendingProfileUpdate');
              
              // Chuyển về account với thông báo thành công
              navigate('/account', {
                state: {
                  message: 'Cập nhật email thành công!',
                  showToast: true
                }
              });
            } catch (updateError) {
              setErrorMessage('Không thể cập nhật thông tin. Vui lòng thử lại!');
              setShowErrorAlert(true);
            }
          }
        } else if (fromSignup) {
          // Từ signup → chuyển sang CreatePassword
          navigate('/signup/create-password', { state: { email } });
        } else {
          // Từ registration → chuyển sang Login
          navigate('/login', { 
            state: { 
              message: 'Xác thực email thành công! Vui lòng đăng nhập.',
              email: email 
            } 
          });
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'Mã xác thực không chính xác');
      setShowErrorAlert(true);
      // Clear OTP khi sai
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại mã
  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authService.resendOTP(email);
      setErrorMessage('Mã xác thực mới đã được gửi đến email của bạn');
      setShowErrorAlert(true);
      // Clear OTP hiện tại
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setErrorMessage(error.message || 'Không thể gửi lại mã');
      setShowErrorAlert(true);
    } finally {
      setResendLoading(false);
    }
  };

  // Đăng nhập bằng mật khẩu
  const handleLoginWithPassword = () => {
    navigate('/login', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          Nhập mã gồm 6 chữ số mà <br />
          bạn nhận được qua địa chỉ
        </h1>
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          {maskEmail(email)}.
        </h1>

        

        {/* OTP Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6 OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-white text-2xl font-bold bg-transparent border-2 border-gray-600 rounded-lg focus:border-white focus:outline-none transition-colors"
                style={{
                  caretColor: 'white',
                }}
              />
            ))}
          </div>
          {/* Error Alert */}
          <NotificationModal
            visible={showErrorAlert}
            onClose={() => setShowErrorAlert(false)}
            type="error"
            message={errorMessage}
            closable={true}
          />
          {/* Resend Button */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="text-white border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Đang gửi...' : 'Gửi lại mã'}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            className="w-full h-12 bg-pink-500 hover:bg-pink-600 border-none rounded-full font-semibold text-base"
            style={{
              backgroundColor: loading ? '#db2777' : '#ec4899',
              color: 'black',
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
            {loading ? 'Đang xác thực...' : 'Xác thực'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;