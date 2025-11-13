import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Select, DatePicker, Button, message, Modal } from 'antd';
import { UserOutlined, LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import authService from '../services/authService';
import ToastNotification from '../components/common/ToastNotification';
import dayjs from 'dayjs';
import ActionButtons from '../components/common/ActionButtons';

const { Option } = Select;

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    gender: '',
    birthday: null,
    country: '',
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage hoặc API
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      setFormData({
        username: currentUser.name || '',
        email: currentUser.email || '',
        gender: currentUser.gender || '',
        birthday: currentUser.birthday ? dayjs(currentUser.birthday) : null,
        country: currentUser.country || '',
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate dữ liệu
      if (!formData.username || !formData.email) {
        message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
        setLoading(false);
        return;
      }

      // Kiểm tra xem email có thay đổi không
      const currentUser = authService.getCurrentUser();
      const emailChanged = formData.email !== currentUser?.email;

      if (emailChanged) {
        // Nếu email thay đổi, gửi OTP và chuyển sang trang xác thực
        try {
          await authService.sendOTP(formData.email, formData.username);
          
          // Lưu thông tin tạm vào localStorage để dùng sau khi verify
          // Bao gồm cả email cũ để tìm user
          localStorage.setItem('pendingProfileUpdate', JSON.stringify({
            oldEmail: currentUser.email, // Email cũ để tìm user
            name: formData.username,
            email: formData.email, // Email mới
            gender: formData.gender,
            birthday: formData.birthday ? formData.birthday.format('YYYY-MM-DD') : null,
            country: formData.country,
          }));
          
          // Chuyển sang trang xác thực email
          navigate('/signup/verify-email', {
            state: {
              email: formData.email,
              fromEditProfile: true, // Flag để biết đến từ edit profile
            }
          });
        } catch (otpError) {
          message.error('Không thể gửi mã xác thực. Vui lòng thử lại!');
          setLoading(false);
        }
      } else {
        // Nếu email không thay đổi, cập nhật bình thường
        await authService.updateProfile({
          name: formData.username,
          email: formData.email,
          gender: formData.gender,
          birthday: formData.birthday ? formData.birthday.format('YYYY-MM-DD') : null,
          country: formData.country,
        });
        
        // Show success toast
        setShowSuccessToast(true);
        setTimeout(() => {
          navigate('/account');
        }, 1500);
      }
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật thông tin. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/account');
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      message.error('Vui lòng nhập mật khẩu để xác nhận!');
      return;
    }

    setDeleteLoading(true);
    try {
      await authService.deleteAccount(deletePassword);
      message.success('Tài khoản đã được xóa thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      message.error(error.message || 'Không thể xóa tài khoản. Vui lòng thử lại!');
    } finally {
      setDeleteLoading(false);
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
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/account')}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
        >
          <LeftOutlined />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Title */}
        <h1 className="text-white text-4xl font-bold mb-12">Chỉnh sửa thông tin cá nhân</h1>

        {/* Form */}
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Tên người dùng
            </label>
            <Input
              size="large"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Nhập tên người dùng"
              className="bg-[#2a2a3e] border-white/20 rounded-lg text-white"
              style={{
                backgroundColor: '#2a2a3e',
                color: 'white',
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Email
            </label>
            <Input
              size="large"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Nhập email"
              className="bg-[#2a2a3e] border-white/20 rounded-lg text-white"
              style={{
                backgroundColor: '#2a2a3e',
                color: 'white',
              }}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Giới tính
            </label>
            <Select
              size="large"
              value={formData.gender}
              onChange={(value) => handleInputChange('gender', value)}
              placeholder="Chọn giới tính"
              className="w-full"
              style={{
                backgroundColor: '#2a2a3e',
              }}
              dropdownStyle={{
                backgroundColor: '#2a2a3e',
              }}
            >
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
              <Option value="Khác">Khác</Option>
              <Option value="Không muốn tiết lộ">Không muốn tiết lộ</Option>
            </Select>
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Ngày sinh
            </label>
            <DatePicker
              size="large"
              value={formData.birthday}
              onChange={(date) => handleInputChange('birthday', date)}
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              className="w-full bg-[#2a2a3e] border-white/20 rounded-lg"
              style={{
                backgroundColor: '#2a2a3e',
                color: 'white',
              }}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Quốc gia/Khu vực
            </label>
            <Select
              size="large"
              value={formData.country}
              onChange={(value) => handleInputChange('country', value)}
              placeholder="Chọn quốc gia/khu vực"
              className="w-full"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{
                backgroundColor: '#2a2a3e',
              }}
              dropdownStyle={{
                backgroundColor: '#2a2a3e',
              }}
            >
              <Option value="Việt Nam">Việt Nam</Option>
              <Option value="Hoa Kỳ">Hoa Kỳ</Option>
              <Option value="Nhật Bản">Nhật Bản</Option>
              <Option value="Hàn Quốc">Hàn Quốc</Option>
              <Option value="Trung Quốc">Trung Quốc</Option>
              <Option value="Thái Lan">Thái Lan</Option>
              <Option value="Singapore">Singapore</Option>
              <Option value="Malaysia">Malaysia</Option>
              <Option value="Indonesia">Indonesia</Option>
              <Option value="Philippines">Philippines</Option>
            </Select>
          </div>

          <ActionButtons
          onCancel={handleCancel}
          onSubmit={handleSave}
          loading={loading}
          submitText="Lưu thông tin"
          alignment="space-between"
          leftContent={
            <Button 
              danger 
              size="large"
              icon={<DeleteOutlined />} 
              onClick={() => setDeleteModalVisible(true)}
              className="px-6 py-2 rounded-full font-semibold"
              style={{
                backgroundColor: '#dc2626',
                borderColor: '#dc2626',
                color: 'white',
              }}
            >
              Xóa tài khoản
            </Button>
          }
/>

          {/* Delete Account Modal */}
          <Modal
            title={
              <span style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>
                Xác nhận xóa tài khoản
              </span>
            }
            open={deleteModalVisible}
            onCancel={() => {
              setDeleteModalVisible(false);
              setDeletePassword('');
            }}
            closeIcon={
              <span style={{ 
                color: 'white', 
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              >
                ✕
              </span>
            }
            footer={[
              <Button
                key="cancel"
                onClick={() => {
                  setDeleteModalVisible(false);
                  setDeletePassword('');
                }}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(220, 201, 201, 0.94)',
                  color: 'white',
                }}
                className="hover:bg-white/10"
              >
                Hủy
              </Button>,
              <Button
                key="delete"
                type="primary"
                danger
                loading={deleteLoading}
                onClick={handleDeleteAccount}
                style={{
                  backgroundColor: '#dc2626',
                  borderColor: '#dc2626',
                }}
              >
                Xóa tài khoản
              </Button>,
            ]}
            styles={{
              header: {
                backgroundColor: '#16213e',
                borderBottom: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '20px 24px',
              },
              body: {
                backgroundColor: '#16213e',
                padding: '24px',
              },
              footer: {
                backgroundColor: '#16213e',
                borderTop: '1px solid rgba(236, 72, 153, 0.3)',
                padding: '16px 24px',
              },
              content: {
                backgroundColor: '#16213e',
                borderRadius: '12px',
                overflow: 'hidden',
              },
              mask: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
              },
            }}
          >
            <div className="space-y-4">
              <p className="font-semibold" style={{ color: '#f87171', fontSize: '15px' }}>
                ⚠️ Cảnh báo: Hành động này không thể hoàn tác!
              </p>
              <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6' }}>
                Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn. Vui lòng nhập mật khẩu để xác nhận.
              </p>
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu của bạn"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                style={{
                  backgroundColor: '#2a2a3e',
                  borderColor: 'rgba(236, 72, 153, 0.3)',
                  color: 'white',
                }}
                className="hover:border-pink-500 focus:border-pink-500"
              />
            </div>
          </Modal>
        </div>

        {/* Success Toast Notification */}
        <ToastNotification
          visible={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
          message="Cập nhật thông tin thành công!"
          duration={3000}
        />
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

export default EditProfile;
