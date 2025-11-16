import React from 'react';

/**
 * Footer - Reusable footer component
 */
const Footer = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-md text-white py-12 mt-16">
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
              <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Việc làm</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For the Record</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Cộng đồng</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Dành cho nghệ sĩ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nhà phát triển</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quảng cáo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liên kết hữu ích</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hỗ trợ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ứng dụng di động miễn phí</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Pháp lý</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách quyền riêng tư</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-gray-400">
          <p>&copy; 2025 Melodies Technology</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
