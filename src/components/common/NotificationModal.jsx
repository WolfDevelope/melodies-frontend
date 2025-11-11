import React from 'react';
import { Alert } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

/**
 * NotificationAlert Component
 * Compact inline alert for displaying notifications (success, error, info)
 * 
 * @param {boolean} visible - Show/hide alert
 * @param {function} onClose - Callback when alert is closed
 * @param {string} type - Type of notification: 'success', 'error', 'info'
 * @param {string|ReactNode} message - Notification message (can be string or React element)
 * @param {boolean} closable - Show close button (default: true)
 * @param {string} linkTo - Optional link path for clickable text
 * @param {string} linkText - Optional link text to display
 */
const NotificationModal = ({
  visible,
  onClose,
  type = 'error',
  message,
  closable = true,
  linkTo,
  linkText = 'đăng nhập',
}) => {
  if (!visible) return null;

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          borderColor: '#10b981',
          color: 'white',
          icon: <CheckCircleOutlined style={{ fontSize: '20px', color: 'white' }} />,
        };
      case 'error':
        return {
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          color: 'white',
          icon: <ExclamationCircleOutlined style={{ fontSize: '20px', color: 'white' }} />,
        };
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          borderColor: '#3b82f6',
          color: 'white',
          icon: <InfoCircleOutlined style={{ fontSize: '20px', color: 'white' }} />,
        };
      default:
        return {
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          color: 'white',
          icon: <ExclamationCircleOutlined style={{ fontSize: '20px', color: 'white' }} />,
        };
    }
  };

  const styles = getStyles();

  // Build message content with optional link
  const messageContent = linkTo ? (
    <span>
      {message}
      <Link 
        to={linkTo} 
        style={{ 
          color: 'white', 
          textDecoration: 'underline',
          fontWeight: 'bold',
          marginLeft: '2px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        {linkText}
      </Link>
      .
    </span>
  ) : message;

  return (
    <div className="mb-6 animate-slideDown">
      <Alert
        message={messageContent}
        type={type}
        icon={styles.icon}
        closable={closable}
        onClose={onClose}
        closeIcon={<CloseOutlined style={{ color: 'white', fontSize: '14px' }} />}
        style={{
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
          color: styles.color,
          borderRadius: '4px',
          padding: '12px 16px',
          border: 'none',
        }}
        className="custom-alert"
      />
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .custom-alert :global(.ant-alert-message) {
          color: white !important;
          font-size: 14px;
          font-weight: 500;
        }
        
        .custom-alert :global(.ant-alert-icon) {
          margin-right: 12px;
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;
