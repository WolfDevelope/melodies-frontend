import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Modal, Form, Upload, Select, message, Avatar } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import artistService from '../../services/artistService';

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const ArtistsManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingArtist, setDeletingArtist] = useState(null);
  const [editingArtist, setEditingArtist] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch artists from API
  const fetchArtists = async (params = {}) => {
    try {
      setLoading(true);
      const response = await artistService.getAllArtists({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        ...params,
      });

      setArtists(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  // Load artists on component mount and when search/pagination changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArtists();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchArtists();
  }, [pagination.current, pagination.pageSize]);

  // Handlers
  const handleAdd = () => {
    setEditingArtist(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingArtist(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (artist) => {
    console.log('Delete clicked, artist data:', artist);
    setDeletingArtist(artist);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deletingArtist) return;
    
    try {
      const artistId = deletingArtist._id || deletingArtist.id;
      console.log('Deleting artist with ID:', artistId);
      
      setLoading(true);
      await artistService.deleteArtist(artistId);
      message.success('Đã xóa nghệ sĩ thành công');
      setIsDeleteModalVisible(false);
      setDeletingArtist(null);
      fetchArtists();
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.message || 'Không thể xóa nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingArtist(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingArtist) {
        // Update existing artist
        await artistService.updateArtist(editingArtist._id, values);
        message.success('Đã cập nhật nghệ sĩ thành công');
      } else {
        // Add new artist
        await artistService.createArtist(values);
        message.success('Đã thêm nghệ sĩ thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchArtists();
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 100,
      render: (avatar, record) => (
        <img
          src={avatar || record.image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100'}
          alt={record.name}
          className="w-16 h-16 object-cover rounded-full"
        />
      ),
    },
    {
      title: 'Nghệ sĩ',
      key: 'artist',
      render: (_, record) => (
        <div>
          <div className="text-white font-medium flex items-center gap-2">
            {record.name}
            {record.verified && (
              <span className="text-blue-500" title="Đã xác minh">✓</span>
            )}
          </div>
          <div className="text-gray-400 text-sm">{record.genre}</div>
        </div>
      ),
    },
    {
      title: 'Bài hát',
      dataIndex: 'songs',
      key: 'songs',
      render: (songs, record) => (
        <span className="text-white">
          {songs?.length || record.totalSongs || record.songCount || 0}
        </span>
      ),
    },
    {
      title: 'Albums',
      dataIndex: 'albums',
      key: 'albums',
      render: (albums, record) => (
        <span className="text-white">
          {albums?.length || record.totalAlbums || record.albumCount || 0}
        </span>
      ),
    },
    {
      title: 'Người theo dõi',
      dataIndex: 'followers',
      key: 'followers',
      render: (followers) => (
        <span className="text-white">{followers.toLocaleString()}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          style={{
            backgroundColor: status === 'active' ? '#166534' : '#991b1b',
            color: '#ffffff',
            border: 'none',
            fontWeight: '500',
          }}
        >
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500 hover:text-blue-400"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="text-red-500 hover:text-red-400"
          />
        </div>
      ),
    },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-lg">
            Tổng số: {pagination.total} nghệ sĩ
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
          size="large"
        >
          Thêm nghệ sĩ
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm theo tên nghệ sĩ, thể loại..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-md"
          size="large"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: 'white',
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-gradient-to-r from-[#653c51ff] to-[#311051ff] rounded-lg p-6">
        <Table
          columns={columns}
          dataSource={artists}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nghệ sĩ`,
          }}
          onChange={handleTableChange}
          className="admin-table"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-bold">
            {editingArtist ? 'Chỉnh sửa nghệ sĩ' : 'Thêm nghệ sĩ mới'}
          </span>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText={editingArtist ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên nghệ sĩ"
            rules={[{ required: true, message: 'Vui lòng nhập tên nghệ sĩ' }]}
          >
            <Input placeholder="Nhập tên nghệ sĩ" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="genre"
              label="Thể loại chính"
              rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
            >
              <Select placeholder="Chọn thể loại" size="large">
                <Option value="Pop">Pop</Option>
                <Option value="Ballad">Ballad</Option>
                <Option value="Rock">Rock</Option>
                <Option value="EDM">EDM</Option>
                <Option value="R&B">R&B</Option>
                <Option value="Rap">Rap</Option>
                <Option value="Jazz">Jazz</Option>
                <Option value="Classical">Classical</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="verified"
              label="Xác minh"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái xác minh' }]}
            >
              <Select placeholder="Chọn trạng thái" size="large">
                <Option value={true}>Đã xác minh</Option>
                <Option value={false}>Chưa xác minh</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="bio"
            label="Tiểu sử"
            rules={[{ required: true, message: 'Vui lòng nhập tiểu sử' }]}
          >
            <TextArea
              placeholder="Nhập tiểu sử nghệ sĩ"
              rows={4}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái" size="large">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Tạm dừng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="avatar"
            label="URL ảnh đại diện"
            rules={[
              {
                type: 'url',
                message: 'Vui lòng nhập URL hợp lệ',
              },
            ]}
          >
            <Input
              placeholder="Nhập URL ảnh từ Google Images hoặc nguồn khác"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Hoặc tải lên ảnh đại diện">
            <Dragger
              accept="image/*"
              maxCount={1}
              listType="picture"
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined style={{ color: '#ec4899' }} />
              </p>
              <p className="ant-upload-text" style={{ color: 'white' }}>
                Nhấp hoặc kéo ảnh vào đây để tải lên
              </p>
              <p className="ant-upload-hint" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Hỗ trợ định dạng: JPG, PNG, GIF
              </p>
            </Dragger>
          </Form.Item>
        </Form>
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
          className: 'bg-red-500 hover:bg-red-600',
        }}
      >
        <p className="text-white text-base">
          Bạn có chắc chắn muốn xóa nghệ sĩ{' '}
          <span className="font-bold text-pink-400">
            "{deletingArtist?.name}"
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

export default ArtistsManagement;
