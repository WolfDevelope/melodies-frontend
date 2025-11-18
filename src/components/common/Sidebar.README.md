# Sidebar Component

Component Sidebar có thể tái sử dụng cho các trang khác trong ứng dụng Melodies.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `collapsed` | boolean | `false` | Trạng thái thu gọn của sidebar |
| `onCollapse` | function | - | Callback khi thay đổi trạng thái collapse |
| `title` | string | `"Thư viện"` | Tiêu đề sidebar |
| `menuItems` | array | `[]` | Danh sách menu items |
| `expandedContent` | ReactNode | - | Nội dung hiển thị khi sidebar mở rộng |
| `className` | string | `""` | CSS classes bổ sung |

## Menu Item Structure

```javascript
{
  icon: <IconComponent />,  // Icon component (optional)
  label: 'Menu Label',      // Label text (optional)
  onClick: () => {}         // Click handler (optional)
}
```

## Usage Examples

### 1. Basic Usage (Home Page)

```jsx
import Sidebar from '../components/common/Sidebar';
import { PlusOutlined } from '@ant-design/icons';

const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

<Sidebar
  collapsed={sidebarCollapsed}
  onCollapse={setSidebarCollapsed}
  title="Thư viện"
  menuItems={[
    {
      icon: <PlusOutlined />,
      label: 'Tạo danh sách phát',
      onClick: () => console.log('Create playlist'),
    },
  ]}
  expandedContent={
    <div>
      <h3 className="text-gray-400 text-sm font-semibold mb-4 px-4">
        Tạo danh sách phát đầu tiên của bạn
      </h3>
      <p className="text-white text-sm px-4 mb-4">
        Chúng tôi sẽ giúp bạn tạo danh sách phát
      </p>
      <button className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform">
        Tạo danh sách phát
      </button>
    </div>
  }
/>
```

### 2. Multiple Menu Items

```jsx
import { PlusOutlined, HeartOutlined, ClockCircleOutlined } from '@ant-design/icons';

<Sidebar
  collapsed={collapsed}
  onCollapse={setCollapsed}
  title="Thư viện"
  menuItems={[
    {
      icon: <PlusOutlined />,
      label: 'Tạo danh sách phát',
      onClick: () => navigate('/create-playlist'),
    },
    {
      icon: <HeartOutlined />,
      label: 'Bài hát yêu thích',
      onClick: () => navigate('/liked-songs'),
    },
    {
      icon: <ClockCircleOutlined />,
      label: 'Nghe gần đây',
      onClick: () => navigate('/recent'),
    },
  ]}
/>
```

### 3. Custom Styling

```jsx
<Sidebar
  collapsed={collapsed}
  onCollapse={setCollapsed}
  title="Menu"
  className="z-50 shadow-lg"
  menuItems={menuItems}
/>
```

### 4. Without Expanded Content

```jsx
<Sidebar
  collapsed={collapsed}
  onCollapse={setCollapsed}
  title="Navigation"
  menuItems={[
    { icon: <HomeOutlined />, label: 'Home', onClick: () => navigate('/') },
    { icon: <SearchOutlined />, label: 'Search', onClick: () => navigate('/search') },
  ]}
/>
```

### 5. Admin Dashboard Example

```jsx
import { DashboardOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

<Sidebar
  collapsed={adminSidebarCollapsed}
  onCollapse={setAdminSidebarCollapsed}
  title="Admin Menu"
  menuItems={[
    {
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => setActiveTab('dashboard'),
    },
    {
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => setActiveTab('users'),
    },
    {
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => setActiveTab('settings'),
    },
  ]}
  expandedContent={
    <div className="px-4">
      <p className="text-gray-400 text-xs">Admin Panel v1.0</p>
    </div>
  }
/>
```

## Features

- ✅ Collapsible with smooth animation
- ✅ Fixed position (left side, below header)
- ✅ Responsive (hidden on mobile, visible on lg+)
- ✅ Glass morphism design
- ✅ Hover effects
- ✅ Icon-only mode when collapsed
- ✅ Customizable menu items
- ✅ Optional expanded content area
- ✅ Melodies color scheme

## Styling

The component uses:
- Fixed positioning: `fixed left-0 top-16 bottom-0`
- Width: `w-64` (expanded) / `w-20` (collapsed)
- Background: `bg-black/40 backdrop-blur-md`
- Transitions: `transition-all duration-300`
- Hidden on mobile: `hidden lg:block`

## Notes

- Sidebar is positioned below the header (`top-16` = 64px)
- Remember to add responsive margin to main content when using sidebar
- Icon and label are both optional in menu items
- Collapsed state shows only icons with tooltips
