import React, { useState, useEffect } from 'react';
import { Card, Statistic, Table, Button, Tag, Avatar, Input, Spin, message } from 'antd';
import {
  DashboardOutlined,
  CustomerServiceOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  BarChartOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import SongsManagement from './admin/SongsManagement';
import ArtistsManagement from './admin/ArtistsManagement';
import AlbumsManagement from './admin/AlbumsManagement';
import UsersManagement from './admin/UsersManagement';
import CategoriesManagement from './admin/CategoriesManagement';
import usePageTitle from '../hooks/usePageTitle';
import songService from '../services/songService';
import albumService from '../services/albumService';
import artistService from '../services/artistService';
import userService from '../services/userService';
import categoryService from '../services/categoryService';

const Admin = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  
  // Dynamic title based on selected menu
  const menuTitles = {
    dashboard: 'Quản trị - Tổng quan',
    songs: 'Quản trị - Bài hát',
    albums: 'Quản trị - Albums',
    artists: 'Quản trị - Nghệ sĩ',
    categories: 'Quản trị - Danh mục',
    users: 'Quản trị - Người dùng',
  };
  
  usePageTitle(menuTitles[selectedMenu] || 'Quản trị');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalSongs: 0,
      totalArtists: 0,
      totalAlbums: 0,
      totalUsers: 0,
      totalCategories: 0,
    },
    recentItems: [],
  });

  // Fetch dashboard data
  useEffect(() => {
    if (selectedMenu === 'dashboard') {
      fetchDashboardData();
    }
  }, [selectedMenu]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all statistics in parallel
      const [songsRes, artistsRes, albumsRes, usersRes, categoriesRes] = await Promise.all([
        songService.getAllSongs({ limit: 1 }),
        artistService.getAllArtists({ limit: 1 }),
        albumService.getAllAlbums({ limit: 1 }),
        userService.getAllUsers({ limit: 1 }),
        categoryService.getAllCategories({ limit: 1 }),
      ]);

      // Fetch recent items (songs, albums, artists, categories)
      const [recentSongsRes, recentAlbumsRes, recentArtistsRes, recentCategoriesRes] = await Promise.all([
        songService.getAllSongs({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        albumService.getAllAlbums({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        artistService.getAllArtists({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        categoryService.getAllCategories({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
      ]);

      // Combine all recent items and sort by creation date
      const allRecentItems = [
        ...(recentSongsRes.songs || []).map(item => ({ ...item, type: 'song', key: `song-${item._id}` })),
        ...(recentAlbumsRes.data || []).map(item => ({ ...item, type: 'album', key: `album-${item._id}` })),
        ...(recentArtistsRes.artists || recentArtistsRes.data || []).map(item => ({ ...item, type: 'artist', key: `artist-${item._id}` })),
        ...(recentCategoriesRes.data || []).map(item => ({ ...item, type: 'category', key: `category-${item._id}` })),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

      setDashboardData({
        stats: {
          totalSongs: songsRes.pagination?.total || 0,
          totalArtists: artistsRes.pagination?.total || 0,
          totalAlbums: albumsRes.pagination?.total || 0,
          totalUsers: usersRes.pagination?.total || 0,
          totalCategories: categoriesRes.pagination?.total || 0,
        },
        recentItems: allRecentItems,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Statistics cards data
  const stats = [
    {
      title: 'Tổng bài hát',
      value: dashboardData.stats.totalSongs,
      icon: <CustomerServiceOutlined />,
      color: '#ec4899',
    },
    {
      title: 'Nghệ sĩ',
      value: dashboardData.stats.totalArtists,
      icon: <TeamOutlined />,
      color: '#8b5cf6',
    },
    {
      title: 'Albums',
      value: dashboardData.stats.totalAlbums,
      icon: <AppstoreOutlined />,
      color: '#3b82f6',
    },
    {
      title: 'Người dùng',
      value: dashboardData.stats.totalUsers,
      icon: <UserOutlined />,
      color: '#10b981',
    },
  ];

  // Helper function to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper function to get type label
  const getTypeLabel = (type) => {
    const labels = {
      song: 'Bài hát',
      album: 'Album',
      artist: 'Nghệ sĩ',
      category: 'Danh mục',
    };
    return labels[type] || type;
  };

  // Helper function to get type color
  const getTypeColor = (type) => {
    const colors = {
      song: '#ec4899',
      album: '#3b82f6',
      artist: '#8b5cf6',
      category: '#10b981',
    };
    return colors[type] || '#6b7280';
  };

  // Table columns for recent items
  const columns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag 
          style={{
            backgroundColor: getTypeColor(type),
            color: '#ffffff',
            border: 'none',
            fontWeight: '500'
          }}
        >
          {getTypeLabel(type)}
        </Tag>
      ),
    },
    {
      title: 'Thông tin',
      key: 'info',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={record.image || record.coverImage || record.avatar || record.icon} 
            size={48} 
            shape="square"
            style={{ backgroundColor: getTypeColor(record.type) }}
          >
            {record.type === 'category' && record.icon}
          </Avatar>
          <div>
            <div className="text-white font-medium">{record.title || record.name}</div>
            <div className="text-gray-400 text-sm">
              {record.type === 'song' && (record.artist?.name || record.artist)}
              {record.type === 'album' && (record.artist?.name || record.artist)}
              {record.type === 'artist' && `${record.songs?.length || 0} bài hát`}
              {record.type === 'category' && record.contentType}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => (
        <span className="text-gray-300">
          {new Date(date).toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => {
        const isActive = record.status === 'active' || record.isActive !== false;
        return (
          <Tag 
            style={{
              backgroundColor: isActive ? '#166534' : '#991b1b',
              color: '#ffffff',
              border: 'none',
              fontWeight: '500'
            }}
          >
            {isActive ? 'Hoạt động' : 'Tạm dừng'}
          </Tag>
        );
      },
    },
  ];

  // Sidebar menu items
  const sidebarMenuItems = [
    {
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      active: selectedMenu === 'dashboard',
      onClick: () => setSelectedMenu('dashboard'),
    },
    {
      icon: <CustomerServiceOutlined />,
      label: 'Bài hát',
      active: selectedMenu === 'songs',
      onClick: () => setSelectedMenu('songs'),
    },
    {
      icon: <TeamOutlined />,
      label: 'Nghệ sĩ',
      active: selectedMenu === 'artists',
      onClick: () => setSelectedMenu('artists'),
    },
    {
      icon: <AppstoreOutlined />,
      label: 'Albums',
      active: selectedMenu === 'albums',
      onClick: () => setSelectedMenu('albums'),
    },
    {
      icon: <FolderOutlined />,
      label: 'Danh mục',
      active: selectedMenu === 'categories',
      onClick: () => setSelectedMenu('categories'),
    },
    {
      icon: <UserOutlined />,
      label: 'Người dùng',
      active: selectedMenu === 'users',
      onClick: () => setSelectedMenu('users'),
    },
    
    {
      icon: <BarChartOutlined />,
      label: 'Thống kê',
      active: selectedMenu === 'analytics',
      onClick: () => setSelectedMenu('analytics'),
    },
    {
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      active: selectedMenu === 'settings',
      onClick: () => setSelectedMenu('settings'),
    },
  ];

  // Get page title and icon based on selected menu
  const getPageInfo = () => {
    switch (selectedMenu) {
      case 'songs':
        return { title: 'Quản lý bài hát', icon: <CustomerServiceOutlined /> };
      case 'artists':
        return { title: 'Quản lý nghệ sĩ', icon: <TeamOutlined /> };
      case 'albums':
        return { title: 'Quản lý Albums', icon: <AppstoreOutlined /> };
      case 'categories':
        return { title: 'Quản lý danh mục', icon: <FolderOutlined /> };
      case 'users':
        return { title: 'Quản lý người dùng', icon: <UserOutlined /> };
      case 'analytics':
        return { title: 'Thống kê', icon: <BarChartOutlined /> };
      case 'settings':
        return { title: 'Cài đặt', icon: <SettingOutlined /> };
      default:
        return { title: 'Admin Dashboard', icon: <DashboardOutlined /> };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f]">
      {/* Header */}
      <Header 
        showNav={true}
      />

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onCollapse={setCollapsed}
        variant="admin"
        menuItems={sidebarMenuItems}
      />

      {/* Main Content */}
      <main
        className={`p-6 min-h-screen transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Render content based on selected menu */}
        {selectedMenu === 'songs' ? (
          <SongsManagement />
        ) : selectedMenu === 'artists' ? (
          <ArtistsManagement />
        ) : selectedMenu === 'albums' ? (
          <AlbumsManagement />
        ) : selectedMenu === 'categories' ? (
          <CategoriesManagement />
        ) : selectedMenu === 'users' ? (
          <UsersManagement />
        ) : (
          <Spin spinning={loading} tip="Đang tải dữ liệu...">
          <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="backdrop-blur-md border-white/10 hover:border-pink-500/50 transition-all hover:scale-105"
                bodyStyle={{ padding: '24px' }}
                style={{
                  background: 'linear-gradient(to right, #653c51ff, #311051ff)',
                  border: 'none'
                }}
              >
                <Statistic
                  title={
                    <span className="text-white text-sm">{stat.title}</span>
                  }
                  value={stat.value}
                  valueStyle={{
                    color: stat.color,
                    fontSize: '28px',
                    fontWeight: 'bold',
                  }}
                  prefix={
                    <span style={{ color: stat.color, fontSize: '24px' }}>
                      {stat.icon}
                    </span>
                  }
                />
              </Card>
            ))}
          </div>

          {/* Recent Songs Table */}
          <Card
            className="backdrop-blur-md border-white/10"
            style={{
              background: 'linear-gradient(to right, #653c51ff, #311051ff)',
              border: 'none'
            }}
            title={
              <div className="flex items-center justify-between">
                <span className="text-white text-lg font-semibold">
                  Đã thêm gần đây
                </span>
                
              </div>
            }
            bodyStyle={{ padding: '0' }}
          >
            <Table
              columns={columns}
              dataSource={dashboardData.recentItems}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} mục`,
              }}
              className="admin-table"
            />
          </Card>
          </>
          </Spin>
        )}
      </main>
    </div>
  );
};

export default Admin;
