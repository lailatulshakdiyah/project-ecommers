'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Select, message, Table, Tag, Space, Alert } from 'antd';
import { ShoppingCartOutlined, WifiOutlined } from '@ant-design/icons';
import { customerAPI, packageAPI, transactionAPI } from '../../lib/api';
import { Customer, Package, Transaction } from '../../types';
import DashboardLayout from '../../components/DashboardLayout';
import { useRoleProtection } from '../../hooks/useRoleProtection';

const TransactionsPage = () => {
  const { hasAccess, isAuthenticated } = useRoleProtection(['admin']);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [transactionsData, customersData, packagesData] = await Promise.all([
        transactionAPI.getAll(),
        customerAPI.getAll(),
        packageAPI.getAll(),
      ]);
      
      // Sort transactions by ID (ascending order)
      const sortedTransactions = transactionsData.sort((a, b) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
        const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
        return idA - idB;
      });
      
      setTransactions(sortedTransactions);
      setCustomers(customersData);
      setPackages(packagesData);
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (values: any) => {
    try {
      const customer = customers.find(c => c.id === values.customerId);
      const selectedPackage = packages.find(p => p.id === values.packageId);
      
      if (!customer || !selectedPackage) {
        message.error('Invalid customer or package selected');
        return;
      }

      if (customer.balance < selectedPackage.price) {
        message.error('Insufficient balance');
        return;
      }

      // Create transaction
      const newTransaction = {
        customerId: values.customerId,
        packageId: values.packageId,
        amount: selectedPackage.price,
        status: 'completed' as const,
        paymentMethod: 'balance' as const,
        createdAt: new Date().toISOString(),
      };

      await transactionAPI.create(newTransaction);

      // Update customer balance
      const newBalance = customer.balance - selectedPackage.price;
      await customerAPI.update(customer.id, { balance: newBalance });

      message.success('Transaction created successfully');
      setModalVisible(false);
      form.resetFields();
      await loadData(); // Ensure data is reloaded and sorted
    } catch (error) {
      message.error('Failed to create transaction');
    }
  };

  const getCustomerName = (customerId: number | string) => {
    const customer = customers.find(c => c.id == customerId); // Using == for loose comparison
    return customer ? customer.name : 'Unknown';
  };

  const getPackageName = (packageId: number | string) => {
    const pkg = packages.find(p => p.id == packageId); // Using == for loose comparison
    return pkg ? pkg.name : 'Unknown';
  };

  const transactionColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Transaction, b: Transaction) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id) : a.id;
        const idB = typeof b.id === 'string' ? parseInt(b.id) : b.id;
        return idA - idB;
      },
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: 'Customer',
      dataIndex: 'customerId',
      key: 'customerId',
      render: (customerId: number | string) => getCustomerName(customerId),
    },
    {
      title: 'Package',
      dataIndex: 'packageId',
      key: 'packageId',
      render: (packageId: number | string) => getPackageName(packageId),
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
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('id-ID'),
    },
  ];

  if (!isAuthenticated || !hasAccess) {
    return (
      <DashboardLayout>
        <Card>
          <Alert
            message="Access Denied"
            description="You don't have permission to access this page. Only administrators can manage transactions."
            type="error"
            showIcon
          />
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Transaction Management</h1>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => setModalVisible(true)}
            size="large"
          >
            Create Transaction
          </Button>
        </div>

        {/* Package Cards */}
        <Card title="Available Packages" className="mb-6">
          <Row gutter={[16, 16]}>
            {packages.map((pkg) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={pkg.id}>
                <Card
                  size="small"
                  className="border-2 hover:border-blue-400 transition-colors"
                >
                  <div className="text-center">
                    <WifiOutlined className="text-2xl text-blue-500 mb-2" />
                    <h3 className="font-bold text-lg">{pkg.name}</h3>
                    <p className="text-gray-600 mb-2">{pkg.data}</p>
                    <p className="text-sm text-gray-500 mb-2">{pkg.validity}</p>
                    <p className="text-xl font-bold text-blue-600">
                      Rp {pkg.price.toLocaleString('id-ID')}
                    </p>
                    <Tag color={
                      pkg.category === 'basic' ? 'blue' :
                      pkg.category === 'standard' ? 'green' :
                      pkg.category === 'premium' ? 'gold' : 'purple'
                    }>
                      {pkg.category.toUpperCase()}
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Transactions Table */}
        <Card title="Transaction History">
          <Table
            columns={transactionColumns}
            dataSource={transactions}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Card>

        <Modal
          title="Create New Transaction"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateTransaction}
          >
            <Form.Item
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <Select
                placeholder="Select customer"
                showSearch
                optionFilterProp="children"
              >
                {customers.map(customer => (
                  <Select.Option key={customer.id} value={customer.id}>
                    {customer.name} (Balance: Rp {customer.balance.toLocaleString('id-ID')})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="packageId"
              label="Package"
              rules={[{ required: true, message: 'Please select a package' }]}
            >
              <Select placeholder="Select package">
                {packages.map(pkg => (
                  <Select.Option key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.data} (Rp {pkg.price.toLocaleString('id-ID')})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Create Transaction
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;