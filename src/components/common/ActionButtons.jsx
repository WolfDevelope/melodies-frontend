import React from 'react';
import { Button } from 'antd';

/**
 * ActionButtons - Reusable action buttons component
 * Ensures consistent button styling across the project
 */
const ActionButtons = ({
  onCancel,
  onSubmit,
  loading = false,
  disabled = false,
  submitText = 'Lưu thông tin',
  cancelText = 'Hủy',
  alignment = 'right', // 'left', 'center', 'right', 'space-between'
  leftContent = null, // For delete button or other left-side content
}) => {
  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  }[alignment] || 'justify-end';

  return (
    <div className={`pt-8 flex items-center gap-4 ${alignmentClass}`}>
      {leftContent && <div className="mr-auto">{leftContent}</div>}
      
      <div className="flex gap-4">
        <Button
          size="large"
          onClick={onCancel}
          className="px-8 py-2 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full font-semibold"
        >
          {cancelText}
        </Button>
        
        <Button
          type="primary"
          size="large"
          loading={loading}
          onClick={onSubmit}
          disabled={disabled}
          className="px-8 py-2 bg-gradient-to-r from-pink-500 to-purple-600 border-none rounded-full font-semibold hover:from-pink-600 hover:to-purple-700"
          style={{
            background: 'linear-gradient(to right, #ec4899, #9333ea)',
            color: '#ffffff',
          }}
        >
          {submitText}
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;