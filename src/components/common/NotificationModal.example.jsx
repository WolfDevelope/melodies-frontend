import React, { useState } from 'react';
import NotificationModal from './NotificationModal';
import { Button } from 'antd';

/**
 * Example usage of NotificationModal component
 */
const NotificationModalExample = () => {
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [infoModal, setInfoModal] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <h2>NotificationModal Examples</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button danger onClick={() => setErrorModal(true)}>
          Show Error Modal
        </Button>
        
        <Button type="primary" onClick={() => setSuccessModal(true)}>
          Show Success Modal
        </Button>
        
        <Button onClick={() => setInfoModal(true)}>
          Show Info Modal
        </Button>
      </div>

      {/* Error Modal */}
      <NotificationModal
        visible={errorModal}
        onClose={() => setErrorModal(false)}
        type="error"
        title="Đăng nhập bằng mật khẩu"
        message="Tên người dùng hoặc mật khẩu không chính xác."
        okText="Thử lại"
      />

      {/* Success Modal */}
      <NotificationModal
        visible={successModal}
        onClose={() => setSuccessModal(false)}
        type="success"
        title="Thành công"
        message="Đăng ký tài khoản thành công!"
        okText="Tiếp tục"
      />

      {/* Info Modal */}
      <NotificationModal
        visible={infoModal}
        onClose={() => setInfoModal(false)}
        type="info"
        title="Thông báo"
        message="Vui lòng kiểm tra email để xác thực tài khoản."
        okText="Đã hiểu"
      />
    </div>
  );
};

export default NotificationModalExample;

/**
 * USAGE IN YOUR COMPONENTS:
 * 
 * 1. Import the component:
 *    import NotificationModal from '../components/common/NotificationModal';
 * 
 * 2. Add state to control modal:
 *    const [showModal, setShowModal] = useState(false);
 * 
 * 3. Use in your JSX:
 *    <NotificationModal
 *      visible={showModal}
 *      onClose={() => setShowModal(false)}
 *      type="error"
 *      title="Đăng nhập bằng mật khẩu"
 *      message="Tên người dùng hoặc mật khẩu không chính xác."
 *      okText="Thử lại"
 *    />
 * 
 * 4. Show modal when needed:
 *    setShowModal(true);
 * 
 * PROPS:
 * - visible: boolean - Show/hide modal
 * - onClose: function - Called when modal is closed
 * - type: 'error' | 'success' | 'info' - Type of notification
 * - title: string - Modal title
 * - message: string - Notification message
 * - okText: string (optional) - OK button text, default: 'OK'
 * - onOk: function (optional) - Called when OK button is clicked
 */
