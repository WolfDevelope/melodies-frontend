import React from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const AuthGateModal = ({ open, onClose, title = 'Đăng nhập để tiếp tục' }) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
    >
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">
          Bạn cần đăng nhập để phát nhạc và sử dụng đầy đủ tính năng.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            type="primary"
            className="w-full"
            onClick={() => {
              onClose?.();
              navigate('/login');
            }}
          >
            Đăng nhập
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              onClose?.();
              navigate('/signup');
            }}
          >
            Đăng ký
          </Button>

          <Button className="w-full" onClick={onClose}>
            Để sau
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthGateModal;
