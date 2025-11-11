import React, { useEffect } from 'react';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

/**
 * ToastNotification Component
 * Success notification that appears at bottom right corner
 * 
 * @param {boolean} visible - Show/hide toast
 * @param {function} onClose - Callback when toast is closed
 * @param {string} message - Notification message
 * @param {number} duration - Auto close duration in ms (default: 3000)
 */
const ToastNotification = ({
  visible,
  onClose,
  message = 'Thành công!',
  duration = 3000,
}) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <>
      <div className="toast-notification">
        <div className="toast-content">
          <CheckCircleOutlined className="toast-icon" />
          <span className="toast-message">{message}</span>
          <button onClick={onClose} className="toast-close">
            <CloseOutlined />
          </button>
        </div>
      </div>

      <style jsx>{`
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          color: white;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(6, 182, 212, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2);
          min-width: 300px;
          max-width: 400px;
          backdrop-filter: blur(10px);
        }

        .toast-icon {
          font-size: 24px;
          color: white;
          flex-shrink: 0;
        }

        .toast-message {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.4;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .toast-close :global(.anticon) {
          font-size: 14px;
        }

        @media (max-width: 640px) {
          .toast-notification {
            bottom: 16px;
            right: 16px;
            left: 16px;
          }

          .toast-content {
            min-width: auto;
            max-width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default ToastNotification;
