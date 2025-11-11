import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input, Button, Radio, Select } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import SignupHeader from '../components/SignupHeader';

const { Option } = Select;

const PersonalInfo = () => {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const birthday = `${day}/${month}/${year}`;
    console.log('Personal info:', { name, birthday, gender, email });
    // Navigate to terms confirmation page
    navigate('/signup/terms', { state: { email, password, name, birthday, gender } });
  };

  const handleBack = () => {
    navigate('/signup/create-password', { state: { email } });
  };

  const isFormValid = name.trim() && day && month && year && gender;

  // Generate days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Generate years (1900 - current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const months = [
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] flex flex-col items-center px-4">
      <SignupHeader currentStep={2} />
      
      <div className="w-full max-w-md">

        {/* Back button and title */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-white hover:text-pink-400 mb-4 transition-colors"
          >
            <ArrowLeftOutlined className="mr-2" />
            <div className="text-left">
              <div className="text-sm text-gray-400">Bước 2 của 3</div>
              <div className="font-semibold">Giới thiệu thông tin về bản thân bạn</div>
            </div>
          </button>
        </div>

        {/* Personal Info Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-white font-semibold mb-2">
              Tên
            </label>
            <p className="text-sm text-gray-400 mb-2">Tên này sẽ xuất hiện trên hồ sơ của bạn</p>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 border-gray-700 hover:border-gray-600 focus:border-white rounded-md"
              style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
              }}
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Ngày sinh
            </label>
            <p className="text-sm text-pink-400 mb-2 underline cursor-pointer">
              Tại sao chúng tôi cần biết ngày sinh của bạn? Tìm hiểu thêm.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Input
                type="number"
                placeholder="dd"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                min="1"
                max="31"
                required
                className="h-12 border-gray-700 hover:border-gray-600 focus:border-white rounded-md"
                style={{
                  backgroundColor: '#1a1a2e',
                  color: 'white',
                }}
              />
              <Select
                placeholder="Tháng"
                value={month}
                onChange={(value) => setMonth(value)}
                className="custom-select"
                size="large"
                style={{
                  width: '100%',
                  height: '48px',
                }}
                dropdownStyle={{
                  backgroundColor: '#1a1a2e',
                }}
              >
                {months.map((m) => (
                  <Option key={m.value} value={m.value}>
                    {m.label}
                  </Option>
                ))}
              </Select>
              <Input
                type="number"
                placeholder="yyyy"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max={currentYear}
                required
                className="h-12 border-gray-700 hover:border-gray-600 focus:border-white rounded-md"
                style={{
                  backgroundColor: '#1a1a2e',
                  color: 'white',
                }}
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Giới tính
            </label>
            <p className="text-sm text-gray-400 mb-3">
              Giới tính của bạn giúp chúng tôi cung cấp nội dung đề xuất và quảng cáo phù hợp với bạn.
            </p>
            <Radio.Group 
              onChange={(e) => setGender(e.target.value)} 
              value={gender}
              className="w-full space-y-2"
            >
              <div className="flex items-center space-x-4">
                <Radio value="male" className="text-white">
                  <span className="text-white">Nam</span>
                </Radio>
                <Radio value="female" className="text-white">
                  <span className="text-white">Nữ</span>
                </Radio>
                <Radio value="non-binary" className="text-white">
                  <span className="text-white">Phi nhị giới</span>
                </Radio>
              </div>
              <div>
                <Radio value="other" className="text-white">
                  <span className="text-white">Giới tính khác</span>
                </Radio>
              </div>
              <div>
                <Radio value="prefer-not-to-say" className="text-white">
                  <span className="text-white">Không muốn nêu cụ thể</span>
                </Radio>
              </div>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            disabled={!isFormValid}
            className="w-full h-12 bg-pink-500 hover:bg-pink-600 border-none rounded-full font-semibold text-base disabled:bg-gray-600 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isFormValid ? '#ec4899' : '#4b5563',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              if (isFormValid) {
                e.currentTarget.style.backgroundColor = '#db2777';
              }
            }}
            onMouseLeave={(e) => {
              if (isFormValid) {
                e.currentTarget.style.backgroundColor = '#ec4899';
              }
            }}
          >
            Tiếp theo
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
