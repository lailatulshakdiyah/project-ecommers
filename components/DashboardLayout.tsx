'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    // Only show admin menus for admin users
    ...(user?.role === 'admin' ? [
      {
        key: '/customers',
        icon: <UserOutlined />,
        label: <Link href="/customers">Customers</Link>,
      },
      {
        key: '/transactions',
        icon: <ShoppingCartOutlined />,
        label: <Link href="/transactions">Transactions</Link>,
      },
    ] : []),
    // Customer-specific menus
    ...(user?.role === 'customer' ? [
      {
        key: '/my-profile',
        icon: <UserOutlined />,
        label: <Link href="/my-profile">My Profile</Link>,
      },
      {
        key: '/buy-package',
        icon: <ShoppingCartOutlined />,
        label: <Link href="/buy-package">Buy Package</Link>,
      },
    ] : []),
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="h-16 flex items-center justify-center bg-blue-600 text-white text-lg font-bold">
          {collapsed ? 'DsL' : "Data'S Limit"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-blue-600 text-white px-4 flex justify-between items-center shadow-sm">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ color: 'white' }} /> : <MenuFoldOutlined style={{ color: 'white' }} />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg text-white hover:text-blue-200 hover:bg-blue-700"
            style={{ color: 'white' }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span className='text-white'>{user?.name}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;