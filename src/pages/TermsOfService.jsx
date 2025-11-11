import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
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
            <a href="#" className="py-4 text-sm font-semibold text-black border-b-2 border-pink-500 whitespace-nowrap">
              Điều khoản và điều kiện sử dụng
            </a>
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
              Chính sách về tài sản trí tuệ
            </a>
            <a href="#" className="py-4 text-sm text-gray-600 hover:text-black whitespace-nowrap">
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
          Điều khoản sử dụng Melodies
        </h1>
        
        <p className="text-sm text-gray-600 mb-8">
          Cập nhật mới nhất: 26 tháng 8 năm 2025
        </p>

        {/* Table of Contents */}
        <div className="mb-12 space-y-2">
          <a href="#intro" className="block text-pink-700 hover:text-pink-600 hover:underline">
            1. Giới thiệu
          </a>
          <a href="#services" className="block text-pink-700 hover:text-pink-600 hover:underline">
            2. Dịch vụ Melodies do chúng tôi cung cấp
          </a>
          <a href="#usage" className="block text-pink-700 hover:text-pink-600 hover:underline">
            3. Việc bạn sử dụng dịch vụ Melodies
          </a>
          <a href="#content" className="block text-pink-700 hover:text-pink-600 hover:underline">
            4. Nội dung và quyền sở hữu trí tuệ
          </a>
          <a href="#support" className="block text-pink-700 hover:text-pink-600 hover:underline">
            5. Hỗ trợ khách hàng, thông tin, câu hỏi và khiếu nại
          </a>
          <a href="#disputes" className="block text-pink-700 hover:text-pink-600 hover:underline">
            6. Vấn đề và tranh chấp
          </a>
          <a href="#about" className="block text-pink-700 hover:text-pink-600 hover:underline">
            7. Giới thiệu về các Điều khoản này
          </a>
        </div>

        {/* Section 1 */}
        <section id="intro" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">1. Giới thiệu</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Vui lòng đọc kỹ các Điều khoản sử dụng này (các "<strong>Điều khoản</strong>") này vì các Điều khoản này quản lý việc bạn sử dụng (bao gồm truy cập vào) dịch vụ cá nhân hóa của Melodies để phát trực tuyến nhạc và nội dung khác tất cả các trang web và ứng dụng phần mềm của chúng tôi kết hợp các tính năng này (gọi chung là "<strong>Dịch vụ Melodies</strong>") và bất kỳ bản nhạc, video, podcast, hoặc tài liệu nào khác được cung cấp thông qua Dịch vụ Melodies ("<strong>Nội dung</strong>").
            </p>
            <p>
              Việc sử dụng Dịch vụ Melodies có thể bao gồm việc sử dụng các tính năng, chức năng hoặc dịch vụ bổ sung mà chúng tôi cung cấp liên quan đến Dịch vụ Melodies.
            </p>
            <p>
              Các Điều khoản này áp dụng cho tất cả người dùng Dịch vụ Melodies, bao gồm cả người dùng đóng góp Nội dung vào Dịch vụ. "<strong>Nội dung</strong>" có nghĩa là tất cả nội dung được tạo ra, tải lên, đăng tải, phân phối hoặc cung cấp bằng cách khác trên Dịch vụ Melodies bởi bất kỳ người dùng nào.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="services" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">2. Dịch vụ Melodies do chúng tôi cung cấp</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Melodies cung cấp nhiều tùy chọn Dịch vụ. Một số tùy chọn Dịch vụ được cung cấp miễn phí, trong khi các tùy chọn khác yêu cầu thanh toán trước khi bạn có thể truy cập chúng (các "<strong>Dịch vụ trả phí</strong>"). Chúng tôi cũng có thể cung cấp các chương trình khuyến mãi, tư cách thành viên hoặc dịch vụ đặc biệt, bao gồm các dịch vụ được cung cấp cho một khoảng thời gian giới hạn mà không cần thanh toán hoặc với mức phí đặc biệt (gọi chung là "<strong>Bản dùng thử</strong>").
            </p>
            <p>
              Dịch vụ Melodies bao gồm các tính năng xã hội và tương tác cho phép bạn tương tác với người dùng Melodies khác và tạo, đăng tải và chia sẻ Nội dung công khai trên Melodies.
            </p>
            <p>
              Chúng tôi có thể thay đổi hoặc ngừng cung cấp tất cả hoặc bất kỳ phần nào của Dịch vụ Melodies bất cứ lúc nào, bao gồm cả các tính năng, sản phẩm hoặc nội dung cụ thể. Chúng tôi cũng có thể áp đặt các giới hạn đối với một số tính năng hoặc hạn chế quyền truy cập của bạn vào một phần hoặc toàn bộ Dịch vụ Melodies mà không cần thông báo hoặc chịu trách nhiệm pháp lý.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="usage" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">3. Việc bạn sử dụng dịch vụ Melodies</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Tạo tài khoản Melodies</h3>
            <p>
              Bạn có thể cần phải tạo tài khoản Melodies để sử dụng tất cả hoặc một phần của Dịch vụ Melodies. Tên người dùng và mật khẩu của bạn chỉ dành cho việc sử dụng cá nhân của bạn và phải được giữ bí mật. Bạn hiểu rằng bạn chịu trách nhiệm về tất cả việc sử dụng (bao gồm cả bất kỳ giao dịch trái phép nào) tên người dùng và mật khẩu của bạn.
            </p>
            
            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Quyền chúng tôi cấp cho bạn</h3>
            <p>
              Dịch vụ Melodies và Nội dung là tài sản của Melodies hoặc người cấp phép của Melodies. Chúng tôi cấp cho bạn quyền sử dụng giới hạn, không độc quyền, có thể thu hồi để sử dụng Dịch vụ Melodies và Nội dung (gọi chung là "<strong>Quyền truy cập</strong>"). Quyền truy cập này sẽ vẫn có hiệu lực cho đến khi bạn hoặc Melodies chấm dứt các Điều khoản này.
            </p>

            <h3 className="text-xl font-semibold text-black mt-6 mb-3">Các hành vi bị cấm của người dùng</h3>
            <p>
              Bạn cam kết tuân thủ các Điều khoản này và tất cả các luật, quy tắc và quy định hiện hành khi sử dụng Dịch vụ Melodies. Các hành vi sau đây bị nghiêm cấm:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Sao chép, phân phối hoặc tiết lộ bất kỳ phần nào của Dịch vụ Melodies</li>
              <li>Sử dụng bất kỳ robot, spider, scraper hoặc phương tiện tự động khác để truy cập Dịch vụ</li>
              <li>Bỏ qua bất kỳ biện pháp nào mà chúng tôi có thể sử dụng để ngăn chặn hoặc hạn chế quyền truy cập</li>
              <li>Bán, cho thuê, cho mượn hoặc chuyển nhượng quyền truy cập của bạn</li>
              <li>Tải lên virus hoặc mã độc hại khác</li>
              <li>Thu thập hoặc lưu trữ thông tin cá nhân về người dùng khác</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section id="content" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">4. Nội dung và quyền sở hữu trí tuệ</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Nội dung người dùng: Người dùng Melodies có thể đăng, tải lên và chia sẻ Nội dung trên Dịch vụ Melodies. Bạn giữ quyền sở hữu đối với bất kỳ Nội dung nào bạn đăng tải. Tuy nhiên, bằng cách đăng Nội dung lên Melodies, bạn cấp cho chúng tôi quyền không độc quyền, có thể chuyển nhượng, có thể cấp phép lại, miễn phí bản quyền, trên toàn thế giới để sử dụng, sao chép, phân phối, chuẩn bị các tác phẩm phái sinh, hiển thị và thực hiện Nội dung đó.
            </p>
            <p>
              Quyền sở hữu trí tuệ: Dịch vụ Melodies và tất cả Nội dung (ngoại trừ Nội dung người dùng) được bảo vệ bởi bản quyền, nhãn hiệu và các luật khác. Melodies và người cấp phép của chúng tôi sở hữu tất cả các quyền, quyền sở hữu và lợi ích đối với Dịch vụ Melodies và Nội dung.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section id="support" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">5. Hỗ trợ khách hàng, thông tin, câu hỏi và khiếu nại</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Để biết thông tin về Dịch vụ Melodies và hỗ trợ khách hàng, vui lòng truy cập trang Trung tâm hỗ trợ Melodies của chúng tôi tại{' '}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">
                melodies.com/support
              </a>
              . Nếu bạn có bất kỳ câu hỏi nào về Dịch vụ Melodies hoặc các Điều khoản này, vui lòng liên hệ với Bộ phận Hỗ trợ khách hàng của Melodies qua trang Trung tâm hỗ trợ.
            </p>
          </div>
        </section>

        {/* Section 6 */}
        <section id="disputes" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">6. Vấn đề và tranh chấp</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Các Điều khoản này và bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các Điều khoản này hoặc Dịch vụ Melodies sẽ được điều chỉnh bởi luật pháp Việt Nam mà không xét đến các quy định xung đột pháp luật của nó.
            </p>
            <p>
              Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các Điều khoản này hoặc Dịch vụ Melodies sẽ được giải quyết thông qua trọng tài ràng buộc, ngoại trừ trường hợp bạn có thể khẳng định các khiếu nại tại tòa án khiếu nại nhỏ nếu khiếu nại của bạn đủ điều kiện.
            </p>
          </div>
        </section>

        {/* Section 7 */}
        <section id="about" className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">7. Giới thiệu về các Điều khoản này</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Chúng tôi có thể thay đổi các Điều khoản này (bao gồm cả bất kỳ chính sách bổ sung nào) theo thời gian. Khi chúng tôi thực hiện các thay đổi, chúng tôi sẽ cung cấp cho bạn thông báo về các thay đổi đó bằng cách đăng các Điều khoản sửa đổi lên Dịch vụ Melodies và cập nhật ngày "Cập nhật mới nhất" ở đầu các Điều khoản này.
            </p>
            <p>
              Nếu bạn không đồng ý với các Điều khoản sửa đổi, bạn phải ngừng sử dụng Dịch vụ Melodies trước khi các thay đổi có hiệu lực. Nếu bạn không ngừng sử dụng Dịch vụ Melodies trước khi các thay đổi có hiệu lực, việc bạn tiếp tục sử dụng sẽ cấu thành sự chấp nhận của bạn đối với các Điều khoản sửa đổi.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mt-16 pt-8 border-t border-gray-300">
          <h3 className="text-xl font-semibold text-black mb-4">Liên hệ với chúng tôi</h3>
          <p className="text-gray-700 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này, vui lòng liên hệ với chúng tôi tại:
          </p>
          <div className="text-gray-700">
            <p>Melodies Technology</p>
            <p>Email: legal@melodies.com</p>
            <p>Điện thoại: 1900-xxxx</p>
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

export default TermsOfService;
