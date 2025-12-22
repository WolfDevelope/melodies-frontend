import React from 'react';

const GuestCtaBanner = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className="fixed left-0 right-0 bottom-0 z-40">
      <div className="mx-3 mb-3 rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-fuchsia-600 to-indigo-500 px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold uppercase tracking-wide">
              Xem trước Melodies
            </p>
            <p className="text-white text-sm truncate">
              Đăng ký để nghe không giới hạn bài hát và podcast với quảng cáo không thường xuyên.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={onSignupClick}
              className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Đăng ký miễn phí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCtaBanner;
