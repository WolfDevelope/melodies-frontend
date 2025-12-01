import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Modal, Select, Avatar, message, Space } from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
} from '@ant-design/icons';
import userService from '../../services/userService';

const { Option } = Select;

const UsersManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Fetch users from API
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        role: filters.role,
        isActive: filters.isActive,
        ...params,
      });

      setUsers(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, filters.role, filters.isActive]);

  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            size={48} 
            src={record.avatar} 
            icon={<UserOutlined />}
            className="border-2 border-pink-500/30"
          />
          <div>
            <div className="font-semibold text-white">{record.name}</div>
            <div className="text-gray-400 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => (
        <Tag
          icon={role === 'admin' ? <CrownOutlined /> : <UserOutlined />}
          color={role === 'admin' ? 'gold' : 'blue'}
          className="border-none"
        >
          {role === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive) => (
        <Tag
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'error'}
          className="border-none"
        >
          {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Tag>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender) => {
        const genderMap = {
          'male': 'Nam',
          'female': 'Nữ',
          'Nam': 'Nam',
          'Nữ': 'Nữ',
          'Khác': 'Khác',
          'non-binary': 'Khác',
          'prefer-not-to-say': 'Không tiết lộ',
          'Không muốn tiết lộ': 'Không tiết lộ',
        };
        return <span className="text-gray-300">{genderMap[gender] || gender}</span>;
      },
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <span className="text-gray-300">
          {new Date(date).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<CrownOutlined />}
            className="text-yellow-400 hover:text-yellow-300"
            onClick={() => handleOpenRoleModal(record)}
            title="Phân quyền"
          />
          <Button
            type="text"
            icon={record.isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
            className={record.isActive ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}
            onClick={() => handleToggleStatus(record)}
            title={record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-400 hover:text-red-300"
            onClick={() => handleOpenDeleteModal(record)}
            title="Xóa"
          />
        </Space>
      ),
    },
  ];

  // Handlers
  const handleOpenRoleModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setIsRoleModalVisible(true);
  };

  const handleRoleChange = async () => {
    if (!editingUser || !selectedRole) return;

    try {
      setLoading(true);
      await userService.updateUserRole(editingUser._id, selectedRole);
      message.success('Đã cập nhật vai trò thành công');
      setIsRoleModalVisible(false);
      setEditingUser(null);
      setSelectedRole('');
      fetchUsers();
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setLoading(true);
      await userService.updateUserStatus(user._id, !user.isActive);
      message.success(`Đã ${!user.isActive ? 'kích hoạt' : 'vô hiệu hóa'} người dùng thành công`);
      fetchUsers();
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (user) => {
    setDeletingUser(user);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;

    try {
      setLoading(true);
      await userService.deleteUser(deletingUser._id);
      message.success('Đã xóa người dùng thành công');
      setIsDeleteModalVisible(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      message.error(error.message || 'Không thể xóa người dùng');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingUser(null);
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-lg">
            Tổng số: {pagination.total} người dùng
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Tìm kiếm theo tên hoặc email..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
          size="large"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
        />
        
        <Select
          placeholder="Vai trò"
          value={filters.role || undefined}
          onChange={(value) => setFilters({ ...filters, role: value })}
          allowClear
          size="large"
          style={{ width: 150 }}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
        </Select>

        <Select
          placeholder="Trạng thái"
          value={filters.isActive || undefined}
          onChange={(value) => setFilters({ ...filters, isActive: value })}
          allowClear
          size="large"
          style={{ width: 150 }}
        >
          <Option value="true">Hoạt động</Option>
          <Option value="false">Vô hiệu hóa</Option>
        </Select>
      </div>

      {/* Table */}
      <div
        className="backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #653c51ff, #311051ff)',
        }}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
          onChange={handleTableChange}
          className="admin-table"
        />
      </div>

      {/* Role Change Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-white">
            Phân quyền người dùng
          </span>
        }
        open={isRoleModalVisible}
        onOk={handleRoleChange}
        onCancel={() => {
          setIsRoleModalVisible(false);
          setEditingUser(null);
          setSelectedRole('');
        }}
        okText="Cập nhật"
        cancelText="Hủy"
        confirmLoading={loading}
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <div className="mt-4">
          <p className="text-gray-300 mb-4">
            Chọn vai trò cho người dùng:{' '}
            <span className="font-bold text-white">{editingUser?.name}</span>
          </p>
          <Select
            value={selectedRole}
            onChange={setSelectedRole}
            size="large"
            style={{ width: '100%' }}
          >
            <Option value="user">
              <UserOutlined /> User
            </Option>
            <Option value="admin">
              <CrownOutlined /> Admin
            </Option>
          </Select>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-white">
            Xác nhận xóa
          </span>
        }
        open={isDeleteModalVisible}
        onOk={confirmDelete}
        onCancel={cancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        confirmLoading={loading}
        className="admin-modal"
        okButtonProps={{
          danger: true,
        }}
      >
        <p className="text-gray-300">
          Bạn có chắc chắn muốn xóa người dùng{' '}
          <span className="font-bold text-pink-400">
            "{deletingUser?.name}"
          </span>
          ?
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
};

export default UsersManagement;
