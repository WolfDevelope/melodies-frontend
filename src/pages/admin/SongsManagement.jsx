import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Modal, Form, Upload, Select, message } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import songService from '../../services/songService';
import albumService from '../../services/albumService';
import artistService from '../../services/artistService';

const { Option } = Select;
const { Dragger } = Upload;

const SongsManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isQuickAlbumModalVisible, setIsQuickAlbumModalVisible] = useState(false);
  const [isQuickArtistModalVisible, setIsQuickArtistModalVisible] = useState(false);
  const [deletingSong, setDeletingSong] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [form] = Form.useForm();
  const [quickAlbumForm] = Form.useForm();
  const [quickArtistForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Fetch songs from API
  const fetchSongs = async (params = {}) => {
    try {
      setLoading(true);
      const response = await songService.getAllSongs({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        ...params,
      });

      setSongs(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách bài hát');
    } finally {
      setLoading(false);
    }
  };

  // Fetch albums from API
  const fetchAlbums = async () => {
    try {
      setLoadingAlbums(true);
      const response = await albumService.getAllAlbums({
        limit: 100, // Get all albums
        status: 'active',
      });
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoadingAlbums(false);
    }
  };

  // Fetch artists from API
  const fetchArtists = async () => {
    try {
      setLoadingArtists(true);
      const response = await artistService.getAllArtists({
        limit: 100, // Get all artists
        status: 'active',
      });
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    } finally {
      setLoadingArtists(false);
    }
  };

  // Load songs on component mount and when search/pagination changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSongs();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchSongs();
  }, [pagination.current, pagination.pageSize]);

  // Load albums and artists on component mount
  useEffect(() => {
    fetchAlbums();
    fetchArtists();
  }, []);

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Bài hát',
      key: 'song',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.thumbnail}
            alt={record.title}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <div className="text-white font-medium">{record.title}</div>
            <div className="text-gray-400 text-sm">
              {record.artist?.name || record.artist}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Album',
      key: 'album',
      render: (_, record) => (
        <span className="text-gray-300">
          {record.album?.title || record.album || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Lượt nghe',
      dataIndex: 'plays',
      key: 'plays',
      render: (plays) => (
        <span className="flex items-center gap-1">
          <PlayCircleOutlined className="text-blue-500" />
          {plays.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Yêu thích',
      dataIndex: 'likes',
      key: 'likes',
      render: (likes) => (
        <span className="flex items-center gap-1">
          <HeartOutlined className="text-pink-500" />
          {likes.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
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
      key: 'action',
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-blue-400 hover:text-blue-300"
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-400 hover:text-red-300"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  // Handlers
  const handleEdit = (song) => {
    console.log('✏️ Editing song:', song);
    setEditingSong(song);
    const formData = {
      ...song,
      artist: song.artist?._id || song.artist,
      album: song.album?._id || song.album,
      releaseDate: song.releaseDate ? song.releaseDate.split('T')[0] : '',
    };
    console.log('✏️ Setting form values:', formData);
    form.setFieldsValue(formData);
    setIsModalVisible(true);
  };

  const handleDelete = (song) => {
    console.log('Delete clicked, song data:', song);
    setDeletingSong(song);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deletingSong) return;
    
    try {
      const songId = deletingSong._id || deletingSong.id;
      console.log('Deleting song with ID:', songId);
      
      setLoading(true);
      await songService.deleteSong(songId);
      message.success('Đã xóa bài hát thành công');
      setIsDeleteModalVisible(false);
      setDeletingSong(null);
      fetchSongs();
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.message || 'Không thể xóa bài hát');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingSong(null);
  };

  const handleAdd = () => {
    setEditingSong(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Quick Album Modal handlers
  const handleOpenQuickAlbumModal = () => {
    quickAlbumForm.resetFields();
    setIsQuickAlbumModalVisible(true);
  };

  const handleQuickAlbumOk = async () => {
    try {
      const values = await quickAlbumForm.validateFields();
      
      // Set default status if not provided
      if (!values.status) {
        values.status = 'active';
      }
      
      setLoading(true);
      await albumService.createAlbum(values);
      
      message.success(`Đã tạo album "${values.title}" thành công`);
      
      // Close modal
      setIsQuickAlbumModalVisible(false);
      quickAlbumForm.resetFields();
      
      // Refresh albums list
      await fetchAlbums();
      
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(error.message || 'Không thể tạo album');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAlbumCancel = () => {
    setIsQuickAlbumModalVisible(false);
    quickAlbumForm.resetFields();
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
      console.log('📝 Form values to submit:', values);
      
      if (editingSong) {
        // Update existing song
        console.log('📝 Updating song ID:', editingSong._id);
        console.log('📝 Update data:', values);
        await songService.updateSong(editingSong._id, values);
        message.success('Đã cập nhật bài hát thành công');
      } else {
        // Add new song
        console.log('📝 Creating new song:', values);
        await songService.createSong(values);
        message.success('Đã thêm bài hát thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingSong(null);
      fetchSongs();
    } catch (error) {
      console.error('❌ Error:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-lg">
            Tổng số: {pagination.total} bài hát
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
          size="large"
        >
          Thêm bài hát
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm bài hát, nghệ sĩ, album..."
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
      <div
        className="backdrop-blur-md border border-white/10 rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(to right, #653c51ff, #311051ff)',
        }}
      >
        <Table
          columns={columns}
          dataSource={songs}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài hát`,
          }}
          onChange={handleTableChange}
          className="admin-table"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-bold">
            {editingSong ? 'Chỉnh sửa bài hát' : 'Thêm bài hát mới'}
          </span>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText={editingSong ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tên bài hát"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài hát' }]}
          >
            <Input placeholder="Nhập tên bài hát" size="large" />
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
              >
                {artists.map((artist) => (
                  <Option 
                    key={artist._id} 
                    value={artist.name}
                    label={artist.name}
                  >
                    {artist.name}
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
            <div className="flex gap-2 items-start">
              <Form.Item
                name="album"
                label="Album"
                style={{ flex: 1, marginBottom: 0 }}
              >
                <Select
                  placeholder="Chọn album (tùy chọn)"
                  size="large"
                  allowClear
                  showSearch
                  loading={loadingAlbums}
                  optionFilterProp="label"
                >
                  {albums.map((album) => (
                    <Option 
                      key={album._id} 
                      value={album.title}
                      label={`${album.title} - ${album.artist}`}
                    >
                      {album.title} - {album.artist}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleOpenQuickAlbumModal}
                className="bg-gradient-to-r from-pink-500 to-purple-600 border-none flex-shrink-0"
                title="Tạo album mới"
                style={{ marginTop: 30 }}
              />
            </div>

            <Form.Item
              name="genre"
              label="Thể loại"
            >
              <Select placeholder="Chọn thể loại (tùy chọn)" size="large" allowClear>
                <Option value="Pop">Pop</Option>
                <Option value="Ballad">Ballad</Option>
                <Option value="Rock">Rock</Option>
                <Option value="EDM">EDM</Option>
                <Option value="R&B">R&B</Option>
                <Option value="Rap">Rap</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="duration"
              label="Thời lượng"
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
            >
              <Input placeholder="VD: 4:32" size="large" />
            </Form.Item>

            <Form.Item
              name="releaseDate"
              label="Ngày phát hành"
            >
              <Input type="date" size="large" placeholder="Tùy chọn" />
            </Form.Item>
          </div>

          <Form.Item
            name="status"
            label="Trạng thái"
          >
            <Select placeholder="Chọn trạng thái" size="large">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Tạm dừng</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tải lên file nhạc">
            <Dragger
              accept=".mp3,.wav,.flac"
              maxCount={1}
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#ec4899' }} />
              </p>
              <p className="ant-upload-text" style={{ color: 'white' }}>
                Nhấp hoặc kéo file vào đây để tải lên
              </p>
              <p className="ant-upload-hint" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Hỗ trợ định dạng: MP3, WAV, FLAC
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            name="thumbnail"
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

          <Form.Item label="Hoặc tải lên ảnh bìa">
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
          Bạn có chắc chắn muốn xóa bài hát{' '}
          <span className="font-bold text-pink-400">
            "{deletingSong?.title}"
          </span>
          ?
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Hành động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Quick Album Creation Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-white">
            Tạo album nhanh
          </span>
        }
        open={isQuickAlbumModalVisible}
        onOk={handleQuickAlbumOk}
        onCancel={handleQuickAlbumCancel}
        okText="Tạo album"
        cancelText="Hủy"
        confirmLoading={loading}
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <Form form={quickAlbumForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tên album"
            rules={[{ required: true, message: 'Vui lòng nhập tên album' }]}
          >
            <Input placeholder="Nhập tên album" size="large" />
          </Form.Item>

          <Form.Item
            name="artist"
            label="Nghệ sĩ"
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
              placeholder="Nhập URL ảnh từ Google Images (tùy chọn)"
              size="large"
            />
          </Form.Item>
        </Form>
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
            <Input.TextArea
              rows={3}
              placeholder="Nhập tiểu sử nghệ sĩ (tùy chọn)"
              size="large"
            />
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
              placeholder="Nhập URL ảnh từ Google Images (tùy chọn)"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SongsManagement;
