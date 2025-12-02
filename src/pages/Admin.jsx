import React, { useState } from 'react';
import { Card, Statistic, Table, Button, Tag, Avatar, Input } from 'antd';
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

const Admin = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  // Mock data - Statistics
  const stats = [
    {
      title: 'Tổng bài hát',
      value: 1234,
      icon: <CustomerServiceOutlined />,
      color: '#ec4899',
    },
    {
      title: 'Nghệ sĩ',
      value: 567,
      icon: <TeamOutlined />,
      color: '#8b5cf6',
    },
    {
      title: 'Albums',
      value: 890,
      icon: <AppstoreOutlined />,
      color: '#3b82f6',
    },
    {
      title: 'Người dùng',
      value: 12345,
      icon: <UserOutlined />,
      color: '#10b981',
    },
  ];

  // Mock data - Recent Songs
  const recentSongs = [
    {
      key: '1',
      id: 'S001',
      title: 'Nơi này có anh',
      artist: 'Sơn Tùng M-TP',
      album: 'Sky Tour',
      plays: 1234567,
      likes: 45678,
      duration: '4:32',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100',
    },
    {
      key: '2',
      id: 'S002',
      title: 'Lạc trôi',
      artist: 'Sơn Tùng M-TP',
      album: 'M-TP Ambition',
      plays: 987654,
      likes: 34567,
      duration: '3:45',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100',
    },
    {
      key: '3',
      id: 'S003',
      title: 'Chúng ta của hiện tại',
      artist: 'Sơn Tùng M-TP',
      album: 'Single',
      plays: 876543,
      likes: 23456,
      duration: '5:12',
      status: 'active',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100',
    },
  ];

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
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.image} size={48} shape="square" />
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
      title: 'Lượt nghe',
      dataIndex: 'plays',
      key: 'plays',
      render: (plays) => (
        <span className="flex items-center gap-1">
          <PlayCircleOutlined className="text-pink-500" />
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
            fontWeight: '500'
          }}
        >
          {status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
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
        pageTitle={pageInfo.title} 
        pageTitleIcon={pageInfo.icon}
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
              dataSource={recentSongs}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Tổng ${total} bài hát`,
              }}
              className="admin-table"
            />
          </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
