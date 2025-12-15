import React, { useState, useEffect, useMemo } from 'react';
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
import useAdminData from '../../hooks/useAdminData';
import useReferenceData from '../../hooks/useReferenceData';

const { Option } = Select;
const { Dragger } = Upload;

const SongsManagement = () => {
  // ✅ OPTIMIZATION: Use custom hooks for data management
  const {
    data: songs,
    loading,
    searchText,
    pagination,
    setSearchText,
    handleTableChange,
    refresh: refreshSongs,
  } = useAdminData(songService.getAllSongs, {
    cacheKey: 'admin_songs',
    cacheTTL: 3 * 60 * 1000, // 3 minutes
    debounceDelay: 500,
    errorMessage: 'Không thể tải danh sách bài hát',
  });

  // ✅ OPTIMIZATION: Use reference data hooks with caching
  const {
    data: albums,
    loading: loadingAlbums,
    fetchData: fetchAlbums,
  } = useReferenceData(albumService.getAllAlbums, {
    cacheKey: 'albums_reference',
    cacheTTL: 10 * 60 * 1000, // 10 minutes
    autoFetch: false,
  });

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
  const [isQuickAlbumModalVisible, setIsQuickAlbumModalVisible] = useState(false);
  const [isQuickArtistModalVisible, setIsQuickArtistModalVisible] = useState(false);
  const [deletingSong, setDeletingSong] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [audioFileList, setAudioFileList] = useState([]);
  const [form] = Form.useForm();
  const [quickAlbumForm] = Form.useForm();
  const [quickArtistForm] = Form.useForm();

  // ✅ OPTIMIZATION: Lazy load reference data only when modal opens
  const handleAdd = () => {
    setEditingSong(null);
    form.resetFields();
    setAudioFileList([]);
    setIsModalVisible(true);
    // Fetch albums and artists only when needed
    if (albums.length === 0) fetchAlbums();
    if (artists.length === 0) fetchArtists();
  };

  const handleEdit = (record) => {
    setEditingSong(record);
    form.setFieldsValue({
      ...record,
      artist: record.artist?._id || record.artist,
      album: record.album?._id || record.album,
    });
    if (record?.audioUrl) {
      setAudioFileList([
        {
          uid: '-1',
          name: 'audio',
          status: 'done',
          url: record.audioUrl,
        },
      ]);
    } else {
      setAudioFileList([]);
    }
    setIsModalVisible(true);
    // Fetch albums and artists only when needed
    if (albums.length === 0) fetchAlbums();
    if (artists.length === 0) fetchArtists();
  };

  // Table columns
  const columns = [
    {
      title: 'Ảnh bìa',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (thumbnail, record) => (
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100'}
          alt={record.title}
          className="w-16 h-16 object-cover rounded"
        />
      ),
    },
    {
      title: 'Bài hát',
      key: 'song',
      width: 250,
      render: (_, record) => (
        <div>
          <div className="text-white font-medium">{record.title}</div>
          <div className="text-gray-400 text-sm">
            {record.artist?.name || record.artist}
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

  // Handlers - handleEdit is defined above with lazy loading

  const handleDelete = (song) => {
    console.log('Delete clicked, song data:', song);
    setDeletingSong(song);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSong) return;

    try {
      const songId = deletingSong._id || deletingSong.id;
      console.log('Deleting song with ID:', songId);

      setActionLoading(true);
      await songService.deleteSong(songId);
      message.success('Đã xóa bài hát thành công');
      setIsDeleteModalVisible(false);
      setDeletingSong(null);
      refreshSongs();
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.message || 'Không thể xóa bài hát');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingSong(null);
  };

  // handleAdd is defined above with lazy loading

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
      
      setActionLoading(true);
      await albumService.createAlbum(values);
      
      message.success(`Đã tạo album "${values.title}" thành công`);
      
      // Close modal
      setIsQuickAlbumModalVisible(false);
      quickAlbumForm.resetFields();
      
      // Refresh albums list
      await fetchAlbums(true);
      
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(error.message || 'Không thể tạo album');
    } finally {
      setActionLoading(false);
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
      
      setActionLoading(true);
      await artistService.createArtist(values);
      
      message.success(`Đã tạo nghệ sĩ "${values.name}" thành công`);
      
      // Close modal
      setIsQuickArtistModalVisible(false);
      quickArtistForm.resetFields();
      
      // Refresh artists list
      await fetchArtists(true);
      
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        return;
      }
      message.error(error.message || 'Không thể tạo nghệ sĩ');
    } finally {
      setActionLoading(false);
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
      refreshSongs();
    } catch (error) {
      console.error('❌ Error:', error);
      if (error.errorFields) {
        // Form validation error
        message.error('Vui lòng kiểm tra lại thông tin');
        return;
      }
      // Display detailed error messages
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => message.error(err));
      } else {
        message.error(error.message || 'Có lỗi xảy ra');
      }
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setAudioFileList([]);
  };

  const handleAudioUploadRequest = async ({ file, onSuccess, onError }) => {
    setActionLoading(true);
    try {
      const res = await songService.uploadAudio(file);
      const audioUrl = res?.data?.audioUrl;
      form.setFieldsValue({ audioUrl });
      onSuccess(res, file);
      message.success('Upload file nhạc thành công');
    } catch (error) {
      console.error('Audio upload error:', error);
      onError(error);
      message.error(error.message || 'Không thể upload file nhạc');
    } finally {
      setActionLoading(false);
    }
  };

  // Table change handler is now provided by useAdminData hook

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
                style={{ width: '100%' }}
                popupMatchSelectWidth={false}
              >
                {artists.map((artist) => (
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
                  style={{ width: '100%' }}
                  popupMatchSelectWidth={false}
                >
                  {albums.map((album) => (
                    <Option 
                      key={album._id} 
                      value={album._id}
                      label={`${album.title} - ${album.artist?.name || album.artist}`}
                    >
                      <div style={{ 
                        maxWidth: '400px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5'
                      }}>
                        {album.title} - {album.artist?.name || album.artist}
                      </div>
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

          <Form.Item name="audioUrl" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Tải lên file nhạc">
            <Dragger
              accept=".mp3,.wav,.flac"
              maxCount={1}
              customRequest={handleAudioUploadRequest}
              fileList={audioFileList}
              onChange={({ fileList }) => setAudioFileList(fileList.slice(-1))}
              onRemove={() => {
                form.setFieldsValue({ audioUrl: undefined });
                setAudioFileList([]);
              }}
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

          <Form.Item shouldUpdate noStyle>
            {() => {
              const audioUrl = form.getFieldValue('audioUrl');
              if (!audioUrl) return null;
              return (
                <div className="mb-4">
                  <a
                    href={audioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-300"
                  >
                    Mở file nhạc đã upload
                  </a>
                </div>
              );
            }}
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
        onOk={handleDeleteConfirm}
        onCancel={cancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        confirmLoading={actionLoading}
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
        confirmLoading={actionLoading}
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
                {artists.map((artist) => (
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
        confirmLoading={actionLoading}
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
