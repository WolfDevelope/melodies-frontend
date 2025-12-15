import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';

const PlayButton = ({
  size = 48,
  className = '',
  iconClassName = '',
  style,
  onClick,
  tabIndex,
  title = 'Play',
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      tabIndex={tabIndex}
      className={`rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <CaretRightOutlined
        className={`text-black ml-0.5 ${iconClassName}`}
        style={{ fontSize: Math.round(size * 0.5) }}
      />
    </button>
  );
};

export default PlayButton;
