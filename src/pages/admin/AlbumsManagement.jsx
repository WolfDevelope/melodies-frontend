import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Input, Tag, Modal, Form, Select, message, DatePicker } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import albumService from '../../services/albumService';
import artistService from '../../services/artistService';
import dayjs from 'dayjs';
import useAdminData from '../../hooks/useAdminData';
import useReferenceData from '../../hooks/useReferenceData';

const { Option } = Select;
const { TextArea } = Input;

const AlbumsManagement = () => {
  // ✅ OPTIMIZATION: Use custom hooks for data management
  const {
    data: albums,
    loading,
    searchText,
    pagination,
    setSearchText,
    handleTableChange,
    refresh: refreshAlbums,
  } = useAdminData(albumService.getAllAlbums, {
    cacheKey: 'admin_albums',
    cacheTTL: 3 * 60 * 1000, // 3 minutes
    debounceDelay: 500,
    errorMessage: 'Không thể tải danh sách albums',
  });

  // ✅ OPTIMIZATION: Use reference data hook with caching
  const {
    data: artists,
    loading: loadingArtists,
    fetchData: fetchArtists,
  } = useReferenceData(artistService.getAllArtists, {
    cacheKey: 'artists_reference',
    cacheTTL: 10 * 60 * 1000, // 10 minutes
    autoFetch: false,
  });

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isQuickArtistModalVisible, setIsQuickArtistModalVisible] = useState(false);
  const [deletingAlbum, setDeletingAlbum] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [form] = Form.useForm();
  const [quickArtistForm] = Form.useForm();

  // ✅ OPTIMIZATION: Lazy load artists only when modal opens
  const handleAdd = () => {
    setEditingAlbum(null);
    form.resetFields();
    setIsModalVisible(true);
    // Fetch artists only when needed
    if (artists.length === 0) fetchArtists();
  };

  const handleEdit = (record) => {
    setEditingAlbum(record);
    form.setFieldsValue({
      ...record,
      artist: record.artist?._id || record.artist,
      releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null,
    });
    setIsModalVisible(true);
    // Fetch artists only when needed
    if (artists.length === 0) fetchArtists();
  };

  const handleDelete = (album) => {
    console.log('Delete clicked, album data:', album);
    setDeletingAlbum(album);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deletingAlbum) return;
    
    try {
      const albumId = deletingAlbum._id || deletingAlbum.id;
      console.log('Deleting album with ID:', albumId);
      
      setLoading(true);
      await albumService.deleteAlbum(albumId);
      message.success('Đã xóa album thành công');
      setIsDeleteModalVisible(false);
      setDeletingAlbum(null);
      refreshAlbums();
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.message || 'Không thể xóa album');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingAlbum(null);
  };

  // Quick Artist Modal handlers
  const handleOpenQuickArtistModal = () => {
    quickArtistForm.resetFields();
    setIsQuickArtistModalVisible(true);
  };

  const handleQuickArtistOk = async () => {
    try {
      const values = await quickArtistForm.validateFields();
      
      // Set default status if not provided
      if (!values.status) {
        values.status = 'active';
      }
      
      setLoading(true);
      await artistService.createArtist(values);
      
      message.success(`Đã tạo nghệ sĩ "${values.name}" thành công`);
      
      // Close modal
      setIsQuickArtistModalVisible(false);
      quickArtistForm.resetFields();
      
      // Refresh artists list
      await fetchArtists();
      
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(error.message || 'Không thể tạo nghệ sĩ');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickArtistCancel = () => {
    setIsQuickArtistModalVisible(false);
    quickArtistForm.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Format date if exists
      if (values.releaseDate) {
        values.releaseDate = values.releaseDate.format('YYYY-MM-DD');
      }
      
      if (editingAlbum) {
        // Update existing album
        await albumService.updateAlbum(editingAlbum._id, values);
        message.success('Đã cập nhật album thành công');
      } else {
        // Add new album
        await albumService.createAlbum(values);
        message.success('Đã thêm album thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      refreshAlbums();
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

  // handleTableChange is provided by useAdminData hook

  // Table columns
  const columns = [
    {
      title: 'Ảnh bìa',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 100,
      render: (coverImage, record) => (
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'}
          alt={record.title}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: 'Tên album',
      dataIndex: 'title',
      key: 'title',
      render: (title) => <span className="text-white font-medium">{title}</span>,
    },
    {
      title: 'Nghệ sĩ',
      dataIndex: 'artist',
      key: 'artist',
      render: (artist) => (
        <span className="text-gray-300">
          {artist?.name || artist || 'Unknown'}
        </span>
      ),
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
      render: (genre) => (
        <Tag
          style={{
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            color: '#ec4899',
            border: '1px solid #ec4899',
          }}
        >
          {genre || 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Số bài hát',
      dataIndex: 'songs',
      key: 'songs',
      render: (songs, record) => (
        <span className="text-white">
          {songs?.length || record.totalTracks || record.songCount || 0} bài
        </span>
      ),
    },
    {
      title: 'Ngày phát hành',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (date) => (
        <span className="text-gray-300">
          {date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Lượt phát',
      dataIndex: 'plays',
      key: 'plays',
      render: (plays) => (
        <span className="text-white">{plays?.toLocaleString() || 0}</span>
      ),
    },
    {
      title: 'Lượt thích',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes) => (
        <span className="text-pink-400">{likes?.toLocaleString() || 0}</span>
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
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-400 hover:text-blue-300"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="text-red-400 hover:text-red-300"
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
            Tổng số: {pagination.total} albums
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
          size="large"
        >
          Thêm album
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div style={{ maxWidth: '400px' }}>
          <Input
            placeholder="Tìm kiếm theo tên album, nghệ sĩ..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-r from-[#653c51ff] to-[#311051ff] rounded-lg p-6">
        <Table
          columns={columns}
          dataSource={albums}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} albums`,
          }}
          onChange={handleTableChange}
          className="admin-table"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-white">
            {editingAlbum ? 'Chỉnh sửa album' : 'Thêm album mới'}
          </span>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={editingAlbum ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        width={600}
        className="admin-modal"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tên album"
            rules={[{ required: true, message: 'Vui lòng nhập tên album' }]}
          >
            <Input placeholder="Nhập tên album" size="large" />
          </Form.Item>

          <div className="flex gap-2 items-start">
            <Form.Item
              name="artist"
              label="Nghệ sĩ"
              rules={[{ required: true, message: 'Vui lòng chọn nghệ sĩ' }]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Select
                placeholder="Chọn nghệ sĩ"
                size="large"
                showSearch
                loading={loadingArtists}
                optionFilterProp="label"
                notFoundContent={loadingArtists ? 'Đang tải...' : 'Không tìm thấy'}
                style={{ width: '100%' }}
                popupMatchSelectWidth={false}
              >
                {artists?.map((artist) => (
                  <Option 
                    key={artist._id} 
                    value={artist._id}
                    label={artist.name}
                  >
                    <div style={{ 
                      maxWidth: '400px',
                      whiteSpace: 'normal',
                      wordWrap: 'break-word',
                      lineHeight: '1.5'
                    }}>
                      {artist.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleOpenQuickArtistModal}
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-none flex-shrink-0"
              title="Tạo nghệ sĩ mới"
              style={{ marginTop: 30 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="genre" label="Thể loại">
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

            <Form.Item name="totalTracks" label="Số bài hát">
              <Input type="number" placeholder="0" size="large" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="releaseDate" label="Ngày phát hành">
              <DatePicker
                placeholder="Chọn ngày"
                size="large"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
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
          </div>

          <Form.Item name="description" label="Mô tả">
            <TextArea
              rows={3}
              placeholder="Nhập mô tả về album"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="coverImage"
            label="URL ảnh bìa"
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
          Bạn có chắc chắn muốn xóa album{' '}
          <span className="font-bold text-pink-400">
            "{deletingAlbum?.title}"
          </span>
          ?
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Hành động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Quick Artist Creation Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-white">
            Tạo nghệ sĩ nhanh
          </span>
        }
        open={isQuickArtistModalVisible}
        onOk={handleQuickArtistOk}
        onCancel={handleQuickArtistCancel}
        okText="Tạo nghệ sĩ"
        cancelText="Hủy"
        confirmLoading={loading}
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <Form form={quickArtistForm} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên nghệ sĩ"
            rules={[{ required: true, message: 'Vui lòng nhập tên nghệ sĩ' }]}
          >
            <Input placeholder="Nhập tên nghệ sĩ" size="large" />
          </Form.Item>

          <Form.Item name="genre" label="Thể loại">
            <Select placeholder="Chọn thể loại (tùy chọn)" size="large" allowClear>
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

          <Form.Item name="bio" label="Tiểu sử">
            <TextArea
              rows={3}
              placeholder="Nhập tiểu sử nghệ sĩ (tùy chọn)"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlbumsManagement;
