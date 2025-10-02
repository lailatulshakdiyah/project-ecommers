'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, message } from 'antd';
import { UserOutlined, WalletOutlined, ShoppingCartOutlined, CalendarOutlined } from '@ant-design/icons';
import { customerAPI, transactionAPI, packageAPI } from '../../lib/api';
import { Customer, Transaction, Package } from '../../types';
import DashboardLayout from '../../components/DashboardLayout';
import { useRoleProtection } from '../../hooks/useRoleProtection';

const MyProfilePage = () => {
  const { hasAccess, user, isAuthenticated } = useRoleProtection(['customer']);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'customer') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [customersData, packagesData] = await Promise.all([
        customerAPI.getAll(),
        packageAPI.getAll(),
      ]);
      
      // Find current customer data
      const currentCustomer = customersData.find(c => c.name === user?.name);
      if (currentCustomer) {
        setCustomer(currentCustomer);
        
        // Get customer transactions
        const customerTransactions = await transactionAPI.getByCustomerId(currentCustomer.id);
        setTransactions(customerTransactions);
      }
      
      setPackages(packagesData);
    } catch (error) {
      message.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getPackageName = (packageId: number) => {
    const pkg = packages.find(p => p.id === packageId);
    return pkg ? pkg.name : 'Unknown Package';
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Package',
      dataIndex: 'packageId',
      key: 'packageId',
      render: (packageId: number) => getPackageName(packageId),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `Rp ${amount.toLocaleString('id-ID')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => method.replace('_', ' ').toUpperCase(),
    },
  ];

  if (!isAuthenticated || !hasAccess) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        {customer && (
          <>
            {/* Profile Information */}
            <Card title="Profile Information" className="mb-6">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Name"
                    value={customer.name}
                    prefix={<UserOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Email"
                    value={customer.email}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Phone"
                    value={customer.phone}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Current Balance"
                    value={customer.balance}
                    prefix={<WalletOutlined />}
                    formatter={(value) => `Rp ${value?.toLocaleString('id-ID')}`}
                  />
                </Col>
              </Row>
              
              <div className="mt-4">
                <p><strong>Address:</strong> {customer.address}</p>
                <p><strong>Member Since:</strong> {new Date(customer.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
            </Card>

            {/* Statistics */}
            <Row gutter={16} className="mb-6">
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Transactions"
                    value={transactions.length}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Spent"
                    value={transactions.reduce((sum, t) => sum + t.amount, 0)}
                    prefix={<WalletOutlined />}
                    formatter={(value) => `Rp ${value?.toLocaleString('id-ID')}`}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Last Transaction"
                    value={transactions.length > 0 ? new Date(transactions[0].createdAt).toLocaleDateString('id-ID') : 'None'}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            {/* Transaction History */}
            <Card title="My Transaction History">
              <Table
                columns={transactionColumns}
                dataSource={transactions}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                }}
              />
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyProfilePage;