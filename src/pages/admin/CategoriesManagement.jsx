import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, Select, Tag, message, Switch, Checkbox, Avatar } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  UnorderedListOutlined,
} from '@ant-design/icons';
import categoryService from '../../services/categoryService';
import songService from '../../services/songService';
import albumService from '../../services/albumService';
import artistService from '../../services/artistService';
import { clearCache, CACHE_KEYS } from '../../utils/cache';

const { Option } = Select;
const { TextArea } = Input;

// Predefined icons for categories
const CATEGORY_ICONS = [
  { icon: '🎵', label: 'Nốt nhạc' },
  { icon: '🎶', label: 'Nhạc' },
  { icon: '🎧', label: 'Tai nghe' },
  { icon: '🎤', label: 'Micro' },
  { icon: '🎸', label: 'Guitar' },
  { icon: '🎹', label: 'Piano' },
  { icon: '🥁', label: 'Trống' },
  { icon: '🎺', label: 'Kèn' },
  { icon: '💿', label: 'Album' },
  { icon: '📀', label: 'CD' },
  { icon: '📻', label: 'Radio' },
  { icon: '🎼', label: 'Bản nhạc' },
  { icon: '👤', label: 'Nghệ sĩ' },
  { icon: '👥', label: 'Nhóm' },
  { icon: '⭐', label: 'Ngôi sao' },
  { icon: '🔥', label: 'Hot' },
  { icon: '💖', label: 'Yêu thích' },
  { icon: '🎉', label: 'Lễ hội' },
  { icon: '🌟', label: 'Nổi bật' },
  { icon: '🆕', label: 'Mới' },
  { icon: '📈', label: 'Trending' },
  { icon: '🏆', label: 'Top' },
  { icon: '💎', label: 'Premium' },
  { icon: '🎭', label: 'Nghệ thuật' },
];

const CategoriesManagement = () => {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    type: '',
    isActive: '',
    isFeatured: '',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState('🎵');
  
  // Content management states
  const [isContentModalVisible, setIsContentModalVisible] = useState(false);
  const [managingCategory, setManagingCategory] = useState(null);
  const [contentType, setContentType] = useState('songs'); // 'songs', 'albums', 'artists'
  
  // Songs
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongIds, setSelectedSongIds] = useState([]);
  
  // Albums
  const [allAlbums, setAllAlbums] = useState([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState([]);
  
  // Artists
  const [allArtists, setAllArtists] = useState([]);
  const [selectedArtistIds, setSelectedArtistIds] = useState([]);
  
  const [contentSearchText, setContentSearchText] = useState('');
  const [contentLoading, setContentLoading] = useState(false);

  // Fetch categories from API
  const fetchCategories = async (params = {}) => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        type: filters.type,
        isActive: filters.isActive,
        isFeatured: filters.isFeatured,
        sortBy: 'order',
        sortOrder: 'asc',
        ...params,
      });

      setCategories(response.data);
      setPagination({
        ...pagination,
        total: response.pagination.total,
      });
    } catch (error) {
      message.error(error.message || 'Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount and when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 300); // Debounce search
    
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    fetchCategories();
  }, [pagination.current, pagination.pageSize, filters.type, filters.isActive, filters.isFeatured]);

  // Table columns
  const columns = [
    {
      title: 'Danh mục',
      key: 'category',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
            style={{ 
              background: `linear-gradient(135deg, ${record.metadata?.color || '#FF1493'}, ${record.metadata?.color || '#FF1493'}80)`,
            }}
          >
            {record.icon}
          </div>
          <div>
            <div className="font-semibold text-white flex items-center gap-2">
              {record.name}
              {record.isFeatured && (
                <StarFilled className="text-yellow-400" />
              )}
            </div>
            <div className="text-gray-400 text-sm">{record.description}</div>
            <div className="text-gray-500 text-xs mt-1">
              {record.contentType === 'songs' && `${record.songs?.length || 0} bài hát`}
              {record.contentType === 'albums' && `${record.albums?.length || 0} albums`}
              {record.contentType === 'artists' && `${record.artists?.length || 0} nghệ sĩ`}
              {record.contentType === 'mixed' && `${(record.songs?.length || 0) + (record.albums?.length || 0) + (record.artists?.length || 0)} items`}
              {!record.contentType && `${record.songCount || 0} bài hát`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          playlist: { text: 'Playlist', bg: '#1e40af' },        // Blue-800
          chart: { text: 'Bảng xếp hạng', bg: '#dc2626' },      // Red-600
          genre: { text: 'Thể loại', bg: '#16a34a' },           // Green-600
          mood: { text: 'Tâm trạng', bg: '#9333ea' },           // Purple-600
          activity: { text: 'Hoạt động', bg: '#ea580c' },       // Orange-600
          custom: { text: 'Tùy chỉnh', bg: '#6b7280' },         // Gray-500
        };
        const typeInfo = typeMap[type] || typeMap.custom;
        return (
          <Tag
            style={{
              backgroundColor: typeInfo.bg,
              color: '#ffffff',
              border: 'none',
              fontWeight: '500',
            }}
          >
            {typeInfo.text}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag
          style={{
            backgroundColor: isActive ? '#166534' : '#991b1b',
            color: '#ffffff',
            border: 'none',
            fontWeight: '500',
          }}
        >
          {isActive ? 'Hoạt động' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      render: (count) => (
        <div className="flex items-center gap-1 text-gray-300">
          <EyeOutlined />
          <span>{count?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order) => <span className="text-gray-300">{order}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<UnorderedListOutlined />}
            className="text-green-400 hover:text-green-300"
            onClick={() => handleManageContent(record)}
            title="Quản lý nội dung"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            className="text-blue-400 hover:text-blue-300"
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-400 hover:text-red-300"
            onClick={() => handleOpenDeleteModal(record)}
            title="Xóa"
          />
        </div>
      ),
    },
  ];

  // Handlers
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setSelectedIcon('🎵');
    setIsModalVisible(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setSelectedIcon(category.icon || '🎵');
    form.setFieldsValue({
      ...category,
      color: category.metadata?.color || '#FF1493',
      autoUpdate: category.metadata?.autoUpdate || false,
      updateFrequency: category.metadata?.updateFrequency || 'manual',
      showOnHomepage: category.showOnHomepage || false,
      homepageTitle: category.homepageTitle || '',
      homepageOrder: category.homepageOrder || 0,
    });
    setIsModalVisible(true);
  };

  const handleOpenDeleteModal = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      setLoading(true);
      await categoryService.deleteCategory(deletingCategory._id);
      message.success('Đã xóa danh mục thành công');
      
      // Clear home page cache to force refresh
      clearCache(CACHE_KEYS.HOME_PAGE_DATA);
      
      setIsDeleteModalVisible(false);
      setDeletingCategory(null);
      fetchCategories();
    } catch (error) {
      message.error(error.message || 'Không thể xóa danh mục');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setDeletingCategory(null);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Prepare metadata
      const categoryData = {
        ...values,
        metadata: {
          color: values.color || '#FF1493',
          autoUpdate: values.autoUpdate || false,
          updateFrequency: values.updateFrequency || 'manual',
          tags: values.tags || [],
        },
      };

      // Remove fields that are now in metadata
      delete categoryData.color;
      delete categoryData.autoUpdate;
      delete categoryData.updateFrequency;
      delete categoryData.tags;

      if (editingCategory) {
        // Update existing category
        await categoryService.updateCategory(editingCategory._id, categoryData);
        message.success('Đã cập nhật danh mục thành công');
      } else {
        // Add new category
        await categoryService.createCategory(categoryData);
        message.success('Đã thêm danh mục thành công');
      }
      
      // Clear home page cache to force refresh
      clearCache(CACHE_KEYS.HOME_PAGE_DATA);
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
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
    setEditingCategory(null);
    setSelectedIcon('🎵');
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  // Content Management Handlers
  const handleManageContent = async (category) => {
    setManagingCategory(category);
    setContentType(category.contentType || 'songs');
    setContentLoading(true);
    setIsContentModalVisible(true);
    
    try {
      const type = category.contentType || 'songs';
      
      if (type === 'songs' || type === 'mixed') {
        const songsResponse = await songService.getAllSongs({ limit: 1000 });
        setAllSongs(songsResponse.data || []);
        const currentSongIds = category.songs?.map(song => 
          typeof song === 'string' ? song : song._id
        ) || [];
        setSelectedSongIds(currentSongIds);
      }
      
      if (type === 'albums' || type === 'mixed') {
        const albumsResponse = await albumService.getAllAlbums({ limit: 1000 });
        setAllAlbums(albumsResponse.data || []);
        const currentAlbumIds = category.albums?.map(album => 
          typeof album === 'string' ? album : album._id
        ) || [];
        setSelectedAlbumIds(currentAlbumIds);
      }
      
      if (type === 'artists' || type === 'mixed') {
        const artistsResponse = await artistService.getAllArtists({ limit: 1000 });
        setAllArtists(artistsResponse.data || []);
        const currentArtistIds = category.artists?.map(artist => 
          typeof artist === 'string' ? artist : artist._id
        ) || [];
        setSelectedArtistIds(currentArtistIds);
      }
    } catch (error) {
      message.error('Không thể tải danh sách nội dung');
    } finally {
      setContentLoading(false);
    }
  };

  const handleItemToggle = (itemId, type) => {
    if (type === 'songs') {
      setSelectedSongIds(prev => 
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    } else if (type === 'albums') {
      setSelectedAlbumIds(prev => 
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    } else if (type === 'artists') {
      setSelectedArtistIds(prev => 
        prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
    }
  };

  const handleSaveContent = async () => {
    if (!managingCategory) return;

    try {
      setContentLoading(true);
      const type = managingCategory.contentType || 'songs';
      
      // Handle songs
      if (type === 'songs' || type === 'mixed') {
        const currentSongIds = managingCategory.songs?.map(song => 
          typeof song === 'string' ? song : song._id
        ) || [];
        const songsToAdd = selectedSongIds.filter(id => !currentSongIds.includes(id));
        const songsToRemove = currentSongIds.filter(id => !selectedSongIds.includes(id));
        
        if (songsToAdd.length > 0) {
          await categoryService.addSongsToCategory(managingCategory._id, songsToAdd);
        }
        if (songsToRemove.length > 0) {
          await categoryService.removeSongsFromCategory(managingCategory._id, songsToRemove);
        }
      }
      
      // Handle albums
      if (type === 'albums' || type === 'mixed') {
        const currentAlbumIds = managingCategory.albums?.map(album => 
          typeof album === 'string' ? album : album._id
        ) || [];
        const albumsToAdd = selectedAlbumIds.filter(id => !currentAlbumIds.includes(id));
        const albumsToRemove = currentAlbumIds.filter(id => !selectedAlbumIds.includes(id));
        
        if (albumsToAdd.length > 0) {
          await categoryService.addAlbumsToCategory(managingCategory._id, albumsToAdd);
        }
        if (albumsToRemove.length > 0) {
          await categoryService.removeAlbumsFromCategory(managingCategory._id, albumsToRemove);
        }
      }
      
      // Handle artists
      if (type === 'artists' || type === 'mixed') {
        const currentArtistIds = managingCategory.artists?.map(artist => 
          typeof artist === 'string' ? artist : artist._id
        ) || [];
        const artistsToAdd = selectedArtistIds.filter(id => !currentArtistIds.includes(id));
        const artistsToRemove = currentArtistIds.filter(id => !selectedArtistIds.includes(id));
        
        if (artistsToAdd.length > 0) {
          await categoryService.addArtistsToCategory(managingCategory._id, artistsToAdd);
        }
        if (artistsToRemove.length > 0) {
          await categoryService.removeArtistsFromCategory(managingCategory._id, artistsToRemove);
        }
      }
      
      message.success('Đã cập nhật nội dung cho danh mục');
      setIsContentModalVisible(false);
      setManagingCategory(null);
      setSelectedSongIds([]);
      setSelectedAlbumIds([]);
      setSelectedArtistIds([]);
      setContentSearchText('');
      fetchCategories();
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật nội dung');
    } finally {
      setContentLoading(false);
    }
  };

  const handleCancelContentModal = () => {
    setIsContentModalVisible(false);
    setManagingCategory(null);
    setSelectedSongIds([]);
    setSelectedAlbumIds([]);
    setSelectedArtistIds([]);
    setContentSearchText('');
  };

  // Filter content based on search
  const filteredSongs = allSongs.filter(song => {
    if (!contentSearchText) return true;
    const searchLower = contentSearchText.toLowerCase();
    return (
      song.title?.toLowerCase().includes(searchLower) ||
      song.artist?.name?.toLowerCase().includes(searchLower) ||
      song.artist?.toLowerCase().includes(searchLower)
    );
  });
  
  const filteredAlbums = allAlbums.filter(album => {
    if (!contentSearchText) return true;
    const searchLower = contentSearchText.toLowerCase();
    return album.title?.toLowerCase().includes(searchLower);
  });
  
  const filteredArtists = allArtists.filter(artist => {
    if (!contentSearchText) return true;
    const searchLower = contentSearchText.toLowerCase();
    return artist.name?.toLowerCase().includes(searchLower);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-lg">
            Tổng số: {pagination.total} danh mục
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="bg-gradient-to-r from-pink-500 to-purple-600 border-none"
          size="large"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Tìm kiếm danh mục..."
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
          placeholder="Loại danh mục"
          value={filters.type || undefined}
          onChange={(value) => setFilters({ ...filters, type: value })}
          allowClear
          size="large"
          style={{ width: 180 }}
        >
          <Option value="playlist">Playlist</Option>
          <Option value="chart">Bảng xếp hạng</Option>
          <Option value="genre">Thể loại</Option>
          <Option value="mood">Tâm trạng</Option>
          <Option value="activity">Hoạt động</Option>
          <Option value="custom">Tùy chỉnh</Option>
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
          <Option value="false">Ẩn</Option>
        </Select>

        <Select
          placeholder="Nổi bật"
          value={filters.isFeatured || undefined}
          onChange={(value) => setFilters({ ...filters, isFeatured: value })}
          allowClear
          size="large"
          style={{ width: 150 }}
        >
          <Option value="true">Nổi bật</Option>
          <Option value="false">Thường</Option>
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
          dataSource={categories}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} danh mục`,
          }}
          onChange={handleTableChange}
          className="admin-table"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="text-xl font-bold text-white">
            {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </span>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText={editingCategory ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input placeholder="VD: Bài Hát Mới Phát Hành" size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea
              rows={3}
              placeholder="Mô tả ngắn về danh mục..."
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Loại danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
            >
              <Select placeholder="Chọn loại danh mục" size="large">
                <Option value="playlist">Playlist</Option>
                <Option value="chart">Bảng xếp hạng</Option>
                <Option value="genre">Thể loại</Option>
                <Option value="mood">Tâm trạng</Option>
                <Option value="activity">Hoạt động</Option>
                <Option value="custom">Tùy chỉnh</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="contentType"
              label="Loại nội dung"
              rules={[{ required: true, message: 'Vui lòng chọn loại nội dung' }]}
              initialValue="songs"
            >
              <Select placeholder="Chọn loại nội dung" size="large">
                <Option value="songs">🎵 Bài hát</Option>
                <Option value="albums">💿 Albums</Option>
                <Option value="artists">👤 Nghệ sĩ</Option>
                <Option value="mixed">🎭 Hỗn hợp</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="color"
              label="Màu chủ đạo"
            >
              <Input type="color" size="large" />
            </Form.Item>

            <Form.Item
              name="icon"
              label="Icon"
              initialValue="🎵"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="text-4xl flex items-center justify-center w-16 h-16 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {selectedIcon}
                  </div>
                  <Input 
                    value={selectedIcon}
                    onChange={(e) => {
                      setSelectedIcon(e.target.value);
                      form.setFieldValue('icon', e.target.value);
                    }}
                    placeholder="🎵" 
                    size="large" 
                    maxLength={2}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-8 gap-2 p-3 rounded-lg max-h-48 overflow-y-auto"
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {CATEGORY_ICONS.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(item.icon);
                        form.setFieldValue('icon', item.icon);
                      }}
                      className={`text-2xl p-2 rounded-lg transition-all hover:scale-110 flex items-center justify-center ${
                        selectedIcon === item.icon
                          ? 'bg-pink-500/30 ring-2 ring-pink-500'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>
              </div>
            </Form.Item>
          </div>

          <Form.Item
            name="coverImage"
            label="URL ảnh bìa"
          >
            <Input
              placeholder="https://example.com/image.jpg"
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="order"
              label="Thứ tự hiển thị"
              initialValue={0}
            >
              <Input type="number" size="large" min={0} />
            </Form.Item>

            <Form.Item
              name="isFeatured"
              label="Nổi bật"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </div>

          {/* Hidden field - isActive syncs with showOnHomepage */}
          <Form.Item name="isActive" hidden valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          {/* Status Info Display */}
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.showOnHomepage !== currentValues.showOnHomepage}>
            {({ getFieldValue }) => {
              const showOnHomepage = getFieldValue('showOnHomepage');
              return (
                <div className="mb-4 p-3 rounded-lg border" style={{
                  background: showOnHomepage ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: showOnHomepage ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                }}>
                  <p className="text-sm flex items-center gap-2" style={{
                    color: showOnHomepage ? '#22c55e' : '#ef4444'
                  }}>
                    <span>{showOnHomepage ? '✅' : '⚠️'}</span>
                    <strong>Trạng thái:</strong> {showOnHomepage ? 'Hoạt động' : 'Ẩn'}
                    <span className="text-gray-400 ml-2">
                      (Tự động đồng bộ với hiển thị trang chủ)
                    </span>
                  </p>
                </div>
              );
            }}
          </Form.Item>

          {/* Homepage Display Settings */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span>🏠</span> Hiển thị trên Trang chủ
            </h3>
            
            <Form.Item
              name="showOnHomepage"
              label="Hiển thị trên trang chủ"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch 
                checkedChildren="Có" 
                unCheckedChildren="Không"
                onChange={(checked) => {
                  // Đồng bộ isActive với showOnHomepage
                  form.setFieldsValue({ isActive: checked });
                }}
              />
            </Form.Item>

            <Form.Item
              name="homepageTitle"
              label="Tiêu đề trên trang chủ"
              tooltip="Để trống sẽ dùng tên danh mục"
            >
              <Input 
                placeholder="VD: Đề xuất cho bạn, Bảng xếp hạng nổi bật..." 
                size="large" 
              />
            </Form.Item>

            <Form.Item
              name="homepageOrder"
              label="Thứ tự trên trang chủ"
              initialValue={0}
              tooltip="Số càng nhỏ càng hiển thị trước"
            >
              <Input type="number" size="large" min={0} />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="autoUpdate"
              label="Tự động cập nhật"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>

            <Form.Item
              name="updateFrequency"
              label="Tần suất cập nhật"
              initialValue="manual"
            >
              <Select size="large">
                <Option value="manual">Thủ công</Option>
                <Option value="daily">Hàng ngày</Option>
                <Option value="weekly">Hàng tuần</Option>
                <Option value="monthly">Hàng tháng</Option>
              </Select>
            </Form.Item>
          </div>
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
        }}
      >
        <p className="text-gray-300">
          Bạn có chắc chắn muốn xóa danh mục{' '}
          <span className="font-bold text-pink-400">
            "{deletingCategory?.name}"
          </span>
          ?
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Hành động này không thể hoàn tác.
        </p>
      </Modal>

      {/* Content Management Modal */}
      <Modal
        title={
          <div className="text-xl font-bold text-white">
            <UnorderedListOutlined className="mr-2" />
            Quản lý nội dung - {managingCategory?.name}
          </div>
        }
        open={isContentModalVisible}
        onOk={handleSaveContent}
        onCancel={handleCancelContentModal}
        width={900}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={contentLoading}
        className="admin-modal"
        okButtonProps={{
          className: 'bg-gradient-to-r from-pink-500 to-purple-600 border-none',
        }}
      >
        <div className="mt-4 space-y-4">
          {/* Search and Stats */}
          <div className="flex items-center justify-between">
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={contentSearchText}
              onChange={(e) => setContentSearchText(e.target.value)}
              className="max-w-md"
              size="large"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
              }}
            />
            <div className="text-gray-300">
              {contentType === 'songs' && `Đã chọn: ${selectedSongIds.length} / ${filteredSongs.length} bài hát`}
              {contentType === 'albums' && `Đã chọn: ${selectedAlbumIds.length} / ${filteredAlbums.length} albums`}
              {contentType === 'artists' && `Đã chọn: ${selectedArtistIds.length} / ${filteredArtists.length} nghệ sĩ`}
              {contentType === 'mixed' && `Đã chọn: ${selectedSongIds.length + selectedAlbumIds.length + selectedArtistIds.length} items`}
            </div>
          </div>

          {/* Tabs for content type */}
          {contentType === 'mixed' && (
            <div className="flex gap-2 mb-4">
              <Button onClick={() => setContentType('songs')} type={contentType === 'songs' ? 'primary' : 'default'}>
                🎵 Bài hát ({selectedSongIds.length})
              </Button>
              <Button onClick={() => setContentType('albums')} type={contentType === 'albums' ? 'primary' : 'default'}>
                💿 Albums ({selectedAlbumIds.length})
              </Button>
              <Button onClick={() => setContentType('artists')} type={contentType === 'artists' ? 'primary' : 'default'}>
                👤 Nghệ sĩ ({selectedArtistIds.length})
              </Button>
            </div>
          )}

          {/* Select All / Deselect All */}
          <div className="flex gap-2">
            <Button
              size="small"
              onClick={() => {
                if (contentType === 'songs') setSelectedSongIds(filteredSongs.map(s => s._id));
                else if (contentType === 'albums') setSelectedAlbumIds(filteredAlbums.map(a => a._id));
                else if (contentType === 'artists') setSelectedArtistIds(filteredArtists.map(a => a._id));
              }}
              className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
            >
              Chọn tất cả
            </Button>
            <Button
              size="small"
              onClick={() => {
                if (contentType === 'songs') setSelectedSongIds([]);
                else if (contentType === 'albums') setSelectedAlbumIds([]);
                else if (contentType === 'artists') setSelectedArtistIds([]);
              }}
              className="text-orange-400 border-orange-400 hover:bg-orange-400/10"
            >
              Bỏ chọn tất cả
            </Button>
          </div>

          {/* Content List */}
          <div 
            className="max-h-96 overflow-y-auto space-y-2 p-2 rounded-lg"
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {contentLoading ? (
              <div className="text-center py-8 text-gray-400">Đang tải...</div>
            ) : (
              <>
                {/* Songs */}
                {(contentType === 'songs' || contentType === 'mixed') && filteredSongs.map((song) => (
                  <div
                    key={song._id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedSongIds.includes(song._id)
                        ? 'bg-pink-500/20 border border-pink-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => handleItemToggle(song._id, 'songs')}
                  >
                    <Checkbox
                      checked={selectedSongIds.includes(song._id)}
                      onChange={() => handleItemToggle(song._id, 'songs')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar src={song.thumbnail} size={48} shape="square" className="border-2 border-pink-500/30" />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{song.title}</div>
                      <div className="text-gray-400 text-sm">{song.artist?.name || 'Unknown'}</div>
                    </div>
                    <div className="text-gray-500 text-sm">{song.duration || '0:00'}</div>
                  </div>
                ))}

                {/* Albums */}
                {(contentType === 'albums' || contentType === 'mixed') && filteredAlbums.map((album) => (
                  <div
                    key={album._id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedAlbumIds.includes(album._id)
                        ? 'bg-pink-500/20 border border-pink-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => handleItemToggle(album._id, 'albums')}
                  >
                    <Checkbox
                      checked={selectedAlbumIds.includes(album._id)}
                      onChange={() => handleItemToggle(album._id, 'albums')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar src={album.coverImage} size={48} shape="square" className="border-2 border-pink-500/30" />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{album.title}</div>
                      <div className="text-gray-400 text-sm">{album.genre || 'Album'}</div>
                    </div>
                  </div>
                ))}

                {/* Artists */}
                {(contentType === 'artists' || contentType === 'mixed') && filteredArtists.map((artist) => (
                  <div
                    key={artist._id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedArtistIds.includes(artist._id)
                        ? 'bg-pink-500/20 border border-pink-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => handleItemToggle(artist._id, 'artists')}
                  >
                    <Checkbox
                      checked={selectedArtistIds.includes(artist._id)}
                      onChange={() => handleItemToggle(artist._id, 'artists')}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Avatar src={artist.avatar} size={48} className="border-2 border-pink-500/30" />
                    <div className="flex-1">
                      <div className="font-semibold text-white">{artist.name}</div>
                      <div className="text-gray-400 text-sm">{artist.genre || 'Artist'}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesManagement;
