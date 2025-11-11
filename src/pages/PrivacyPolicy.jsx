import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Melodies
            </h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <a href="#" className="hover:text-pink-400 transition-colors">Premium</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Hỗ trợ</a>
            <a href="#" className="hover:text-pink-400 transition-colors">Tải xuống</a>
            <span className="text-gray-500">|</span>
            <Link to="/signup" className="hover:text-pink-400 transition-colors">Đăng ký</Link>
            <Link to="/login" className="hover:text-pink-400 transition-colors">Đăng nhập</Link>
          </nav>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-100 border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
              Pháp lý
            </a>
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
              Điều khoản và điều kiện sử dụng
            </a>
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
              Chính sách về tài sản trí tuệ
            </a>
            <a href="#" className="py-4 text-sm font-semibold text-black border-b-2 border-pink-500 whitespace-nowrap">
              Chính sách quyền riêng tư
            </a>
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
              Nguyên tắc sử dụng
            </a>
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
              Điều khoản ưu đãi của gói Premium
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          Chính sách quyền riêng tư của Melodies
        </h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Có hiệu lực kể từ ngày 27 tháng 8 năm 2025
        </p>

        {/* Table of Contents */}
        <div className="mb-12 space-y-2">
          <a href="#intro" className="block text-pink-700 hover:text-pink-600 hover:underline">
            1. Giới thiệu về Chính sách này
          </a>
          <a href="#rights" className="block text-pink-700 hover:text-pink-600 hover:underline">
            2. Quyền và khả năng kiểm soát dữ liệu cá nhân của bạn
          </a>
          <a href="#data-collection" className="block text-pink-700 hover:text-pink-600 hover:underline">
            3. Dữ liệu cá nhân chúng tôi thu thập về bạn
          </a>
          <a href="#purpose" className="block text-pink-700 hover:text-pink-600 hover:underline">
            4. Mục đích của chúng tôi khi sử dụng dữ liệu cá nhân của bạn
          </a>
          <a href="#sharing" className="block text-pink-700 hover:text-pink-600 hover:underline">
            5. Chia sẻ dữ liệu cá nhân của bạn
          </a>
          <a href="#retention" className="block text-pink-700 hover:text-pink-600 hover:underline">
            6. Lưu giữ dữ liệu
          </a>
          <a href="#transfer" className="block text-pink-700 hover:text-pink-600 hover:underline">
            7. Chuyển dữ liệu sang các quốc gia khác
          </a>
          <a href="#security" className="block text-pink-700 hover:text-pink-600 hover:underline">
            8. Giữ an toàn cho dữ liệu cá nhân của bạn
          </a>
          <a href="#children" className="block text-pink-700 hover:text-pink-600 hover:underline">
            9. Trẻ em
          </a>
          <a href="#changes" className="block text-pink-700 hover:text-pink-600 hover:underline">
            10. Các thay đổi đối với Chính sách này
          </a>
          <a href="#contact" className="block text-pink-700 hover:text-pink-600 hover:underline">
            11. Cách liên hệ với chúng tôi
          </a>
        </div>

        {/* Section 1 */}
        <section id="intro" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">1. Giới thiệu về Chính sách này</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chính sách quyền riêng tư này mô tả cách Melodies Technology xử lý dữ liệu cá nhân của bạn liên quan đến:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Dịch vụ phát trực tuyến âm nhạc và podcast Melodies</li>
              <li>Tất cả các trang web và ứng dụng Melodies khác liên kết đến Chính sách này</li>
              <li>Các sản phẩm và dịch vụ khác của Melodies</li>
            </ul>
            <p>
              Từ giờ trở đi, chúng tôi sẽ gọi tất cả những điều trên là "<strong>Dịch vụ Melodies</strong>".
            </p>
            <p>
              Chính sách này cũng giải thích các quyền của bạn liên quan đến dữ liệu cá nhân của bạn. Điều quan trọng là bạn phải đọc Chính sách này cùng với bất kỳ thông báo nào khác mà chúng tôi cung cấp trong những trường hợp cụ thể khi chúng tôi thu thập hoặc xử lý dữ liệu cá nhân về bạn.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="rights" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">2. Quyền và khả năng kiểm soát dữ liệu cá nhân của bạn</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
            </p>
            
            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Quyền truy cập và di chuyển</h3>
            <p>
              Bạn có quyền yêu cầu bản sao dữ liệu cá nhân của mình. Bạn cũng có thể yêu cầu chúng tôi chuyển dữ liệu cá nhân của bạn cho bên thứ ba trong một số trường hợp nhất định.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Quyền chỉnh sửa</h3>
            <p>
              Bạn có quyền yêu cầu chúng tôi chỉnh sửa dữ liệu cá nhân của bạn nếu dữ liệu đó không chính xác hoặc không đầy đủ.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Quyền xóa</h3>
            <p>
              Bạn có thể yêu cầu chúng tôi xóa dữ liệu cá nhân của bạn trong một số trường hợp nhất định. Tuy nhiên, điều này không phải lúc nào cũng có thể thực hiện được do các nghĩa vụ pháp lý hoặc hợp đồng của chúng tôi.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Quyền hạn chế xử lý</h3>
            <p>
              Bạn có quyền yêu cầu chúng tôi hạn chế xử lý dữ liệu cá nhân của bạn trong một số trường hợp nhất định.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Quyền phản đối</h3>
            <p>
              Bạn có quyền phản đối việc xử lý dữ liệu cá nhân của bạn trong một số trường hợp nhất định, bao gồm cả việc chúng tôi xử lý dữ liệu của bạn cho mục đích tiếp thị trực tiếp.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="data-collection" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">3. Dữ liệu cá nhân chúng tôi thu thập về bạn</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi thu thập dữ liệu cá nhân của bạn theo các cách sau:
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Dữ liệu bạn cung cấp cho chúng tôi</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Thông tin tài khoản:</strong> Tên người dùng, địa chỉ email, mật khẩu, ngày sinh, giới tính</li>
              <li><strong>Thông tin thanh toán:</strong> Thông tin thẻ tín dụng hoặc phương thức thanh toán khác</li>
              <li><strong>Thông tin hồ sơ:</strong> Ảnh hồ sơ, sở thích âm nhạc, danh sách phát</li>
              <li><strong>Nội dung người dùng:</strong> Bình luận, đánh giá, bài đăng trên mạng xã hội</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Dữ liệu được thu thập tự động</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Dữ liệu sử dụng:</strong> Cách bạn tương tác với Dịch vụ Melodies, bài hát bạn nghe, thời gian nghe</li>
              <li><strong>Dữ liệu kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành, thiết bị di động</li>
              <li><strong>Dữ liệu vị trí:</strong> Vị trí gần đúng dựa trên địa chỉ IP của bạn</li>
              <li><strong>Cookie và công nghệ tương tự:</strong> Thông tin được lưu trữ trên thiết bị của bạn</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Dữ liệu từ bên thứ ba</h3>
            <p>
              Chúng tôi có thể nhận dữ liệu về bạn từ các bên thứ ba như đối tác quảng cáo, nhà cung cấp dịch vụ phân tích, và các nền tảng mạng xã hội nếu bạn kết nối tài khoản của mình.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section id="purpose" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">4. Mục đích của chúng tôi khi sử dụng dữ liệu cá nhân của bạn</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi sử dụng dữ liệu cá nhân của bạn cho các mục đích sau:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Cung cấp Dịch vụ Melodies:</strong> Để cung cấp, duy trì và cải thiện Dịch vụ Melodies</li>
              <li><strong>Cá nhân hóa trải nghiệm:</strong> Để đề xuất nội dung, tạo danh sách phát tùy chỉnh</li>
              <li><strong>Giao tiếp:</strong> Để gửi thông báo về dịch vụ, cập nhật, ưu đãi đặc biệt</li>
              <li><strong>Quảng cáo:</strong> Để hiển thị quảng cáo có liên quan đến bạn</li>
              <li><strong>Phân tích:</strong> Để hiểu cách người dùng sử dụng dịch vụ của chúng tôi</li>
              <li><strong>An ninh:</strong> Để bảo vệ tài khoản của bạn và ngăn chặn gian lận</li>
              <li><strong>Tuân thủ pháp luật:</strong> Để tuân thủ các nghĩa vụ pháp lý của chúng tôi</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section id="sharing" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">5. Chia sẻ dữ liệu cá nhân của bạn</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi có thể chia sẻ dữ liệu cá nhân của bạn với:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Nhà cung cấp dịch vụ:</strong> Các công ty cung cấp dịch vụ thay mặt chúng tôi (lưu trữ, phân tích, thanh toán)</li>
              <li><strong>Đối tác kinh doanh:</strong> Nghệ sĩ, hãng thu âm, nhà phát hành nội dung</li>
              <li><strong>Đối tác quảng cáo:</strong> Để hiển thị quảng cáo có liên quan</li>
              <li><strong>Người dùng khác:</strong> Nếu bạn chọn chia sẻ nội dung công khai</li>
              <li><strong>Cơ quan pháp luật:</strong> Khi được yêu cầu bởi pháp luật hoặc để bảo vệ quyền của chúng tôi</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section id="retention" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">6. Lưu giữ dữ liệu</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi lưu giữ dữ liệu cá nhân của bạn miễn là cần thiết để cung cấp Dịch vụ Melodies và thực hiện các mục đích được mô tả trong Chính sách này. Khi bạn đóng tài khoản của mình, chúng tôi sẽ xóa hoặc ẩn danh hóa dữ liệu cá nhân của bạn, trừ khi chúng tôi cần lưu giữ dữ liệu đó để tuân thủ nghĩa vụ pháp lý.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="transfer" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">7. Chuyển dữ liệu sang các quốc gia khác</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Melodies là một dịch vụ toàn cầu. Dữ liệu cá nhân của bạn có thể được chuyển đến và xử lý ở các quốc gia khác ngoài quốc gia bạn cư trú. Các quốc gia này có thể có luật bảo vệ dữ liệu khác với luật của quốc gia bạn. Chúng tôi thực hiện các biện pháp bảo vệ thích hợp để đảm bảo dữ liệu của bạn được bảo vệ.
            </p>
          </div>
        </section>

        {/* Section 8 */}
        <section id="security" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">8. Giữ an toàn cho dữ liệu cá nhân của bạn</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn. Chúng tôi sử dụng các biện pháp kỹ thuật và tổ chức thích hợp để bảo vệ dữ liệu của bạn khỏi truy cập trái phép, mất mát, hoặc tiết lộ. Tuy nhiên, không có phương pháp truyền tải qua Internet hoặc lưu trữ điện tử nào là an toàn 100%.
            </p>
          </div>
        </section>

        {/* Section 9 */}
        <section id="children" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">9. Trẻ em</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Dịch vụ Melodies không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập dữ liệu cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn là cha mẹ hoặc người giám hộ và bạn biết rằng con bạn đã cung cấp cho chúng tôi dữ liệu cá nhân, vui lòng liên hệ với chúng tôi.
            </p>
          </div>
        </section>

        {/* Section 10 */}
        <section id="changes" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">10. Các thay đổi đối với Chính sách này</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi có thể cập nhật Chính sách quyền riêng tư này theo thời gian. Khi chúng tôi thực hiện các thay đổi, chúng tôi sẽ đăng Chính sách cập nhật trên trang này và cập nhật ngày "Có hiệu lực kể từ ngày" ở đầu Chính sách. Chúng tôi khuyến khích bạn xem lại Chính sách này thường xuyên để được thông tin về cách chúng tôi bảo vệ dữ liệu của bạn.
            </p>
          </div>
        </section>

        {/* Section 11 */}
        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">11. Cách liên hệ với chúng tôi</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về Chính sách quyền riêng tư này hoặc cách chúng tôi xử lý dữ liệu cá nhân của bạn, vui lòng liên hệ với chúng tôi tại:
            </p>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="font-semibold text-black">Melodies Technology</p>
              <p>Email: privacy@melodies.com</p>
              <p>Điện thoại: 1900-xxxx</p>
              <p>Địa chỉ: Tầng 10, Tòa nhà ABC, Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </section>
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

export default PrivacyPolicy;
