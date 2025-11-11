import api from './api';

/**
 * Authentication Service
 */
const authService = {
  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Thông tin người dùng
   * @returns {Promise<Object>} - Response data
   */
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đăng nhập
   * @param {string} email - Email
   * @param {string} password - Mật khẩu
   * @returns {Promise<Object>} - Response data
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Kiểm tra email đã tồn tại chưa
   * @param {string} email - Email cần kiểm tra
   * @returns {Promise<Object>} - Response data
   */
  checkEmail: async (email) => {
    try {
      const response = await api.post('/auth/check-email', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lấy thông tin user hiện tại
   * @returns {Promise<Object>} - Response data
   */
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Lưu user vào localStorage
   * @param {Object} user - User data
   */
  saveUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  /**
   * Lấy user từ localStorage
   * @returns {Object|null} - User data hoặc null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Xóa user khỏi localStorage (logout)
   */
  logout: () => {
    localStorage.removeItem('currentUser');
  },

  /**
   * Gửi mã OTP xác thực email
   * @param {string} email - Email
   * @param {string} name - Tên người dùng
   * @returns {Promise<Object>} - Response data
   */
  sendOTP: async (email, name) => {
    try {
      const response = await api.post('/auth/send-otp', { email, name });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xác thực mã OTP
   * @param {string} email - Email
   * @param {string} otp - Mã OTP 6 số
   * @returns {Promise<Object>} - Response data
   */
  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gửi lại mã OTP
   * @param {string} email - Email
   * @returns {Promise<Object>} - Response data
   */
  resendOTP: async (email) => {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cập nhật thông tin người dùng
   * @param {Object} userData - Thông tin cần cập nhật
   * @returns {Promise<Object>} - Response data
   */
  updateProfile: async (userData) => {
    try {
      // Lấy email từ localStorage để xác định user
      const currentUser = authService.getCurrentUser();
      
      // Nếu có oldEmail (từ edit profile với email mới), dùng oldEmail để tìm user
      // Nếu không, dùng email hiện tại
      const emailToFind = userData.oldEmail || currentUser?.email;
      
      const dataToSend = {
        ...userData,
        email: emailToFind, // Email để tìm user (email cũ)
        newEmail: userData.email, // Email mới (nếu có thay đổi)
      };
      
      // Xóa oldEmail khỏi payload vì backend không cần
      delete dataToSend.oldEmail;
      
      const response = await api.put('/auth/profile', dataToSend);
      // Cập nhật localStorage
      if (response.success && response.user) {
        authService.saveUser(response.user);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Xóa tài khoản người dùng
   * @param {string} password - Mật khẩu xác nhận
   * @returns {Promise<Object>} - Response data
   */
  deleteAccount: async (password) => {
    try {
      // Lấy email từ localStorage để xác định user
      const currentUser = authService.getCurrentUser();
      const response = await api.delete('/auth/account', { 
        data: { 
          email: currentUser?.email,
          password 
        } 
      });
      // Xóa user khỏi localStorage
      if (response.success) {
        authService.logout();
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Đổi mật khẩu
   * @param {string} oldPassword - Mật khẩu cũ
   * @param {string} newPassword - Mật khẩu mới
   * @returns {Promise<Object>} - Response data
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', { oldPassword, newPassword });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
