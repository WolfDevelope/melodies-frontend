import React, { useState } from 'react';
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

const { Option } = Select;
const { Dragger } = Upload;

const SongsManagement = () => {
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [form] = Form.useForm();

  // Mock data - Danh sách bài hát
  const [songs, setSongs] = useState([
    {
      id: 'S001',
      title: 'Nơi này có anh',
      artist: 'Sơn Tùng M-TP',
      album: 'Sky Tour',
      genre: 'Pop',
      duration: '4:32',
      plays: 1234567,
      likes: 45678,
      status: 'active',
      releaseDate: '2018-05-01',
      thumbnail: 'https://via.placeholder.com/50',
    },
    {
      id: 'S002',
      title: 'Lạc trôi',
      artist: 'Sơn Tùng M-TP',
      album: 'Single',
      genre: 'Pop',
      duration: '4:12',
      plays: 876543,
      likes: 23456,
      status: 'active',
      releaseDate: '2017-01-01',
      thumbnail: 'https://via.placeholder.com/50',
    },
    {
      id: 'S003',
      title: 'Chúng ta của hiện tại',
      artist: 'Sơn Tùng M-TP',
      album: 'Single',
      genre: 'Ballad',
      duration: '5:12',
      plays: 876543,
      likes: 23456,
      status: 'active',
      releaseDate: '2018-11-01',
      thumbnail: 'https://via.placeholder.com/50',
    },
  ]);

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
            <div className="text-gray-400 text-sm">{record.artist}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Album',
      dataIndex: 'album',
      key: 'album',
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
    setEditingSong(song);
    form.setFieldsValue(song);
    setIsModalVisible(true);
  };

  const handleDelete = (song) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa bài hát "${song.title}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setSongs(songs.filter((s) => s.id !== song.id));
        message.success('Đã xóa bài hát thành công');
      },
    });
  };

  const handleAdd = () => {
    setEditingSong(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingSong) {
        // Update existing song
        setSongs(
          songs.map((song) =>
            song.id === editingSong.id ? { ...song, ...values } : song
          )
        );
        message.success('Đã cập nhật bài hát thành công');
      } else {
        // Add new song
        const newSong = {
          id: `S${String(songs.length + 1).padStart(3, '0')}`,
          ...values,
          plays: 0,
          likes: 0,
          thumbnail: 'https://via.placeholder.com/50',
        };
        setSongs([...songs, newSong]);
        message.success('Đã thêm bài hát thành công');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Filter songs based on search
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchText.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchText.toLowerCase()) ||
      song.album.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-lg">
            Tổng số: {songs.length} bài hát
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
          dataSource={filteredSongs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} bài hát`,
          }}
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

          <Form.Item
            name="artist"
            label="Nghệ sĩ"
            rules={[{ required: true, message: 'Vui lòng nhập tên nghệ sĩ' }]}
          >
            <Input placeholder="Nhập tên nghệ sĩ" size="large" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="album"
              label="Album"
              rules={[{ required: true, message: 'Vui lòng nhập album' }]}
            >
              <Input placeholder="Nhập tên album" size="large" />
            </Form.Item>

            <Form.Item
              name="genre"
              label="Thể loại"
              rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
            >
              <Select placeholder="Chọn thể loại" size="large">
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
              rules={[
                { required: true, message: 'Vui lòng chọn ngày phát hành' },
              ]}
            >
              <Input type="date" size="large" />
            </Form.Item>
          </div>

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

          <Form.Item label="Tải lên ảnh bìa">
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
    </div>
  );
};

export default SongsManagement;
