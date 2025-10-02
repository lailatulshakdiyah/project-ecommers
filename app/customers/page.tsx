'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Card, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { customerAPI } from '../../lib/api';
import { Customer } from '../../types';
import DashboardLayout from '../../components/DashboardLayout';
import { useRoleProtection } from '../../hooks/useRoleProtection';
import LoadingSpinner from '../../components/LoadingSpinner';

const CustomersPage = () => {
  const { hasAccess, isAuthenticated } = useRoleProtection(['admin']);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (hasAccess && isAuthenticated) {
      loadCustomers();
    }
  }, [hasAccess, isAuthenticated]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      console.log('Loading customers...');
      const data = await customerAPI.getAll();
      console.log('Customers loaded:', data);
      setCustomers(data);
    } catch (error) {
      console.error('Error loading customers:', error);
      message.error('Failed to load customers: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCustomer(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setModalVisible(true);
    form.setFieldsValue(customer);
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting customer:', id);
      await customerAPI.delete(id);
      message.success('Customer deleted successfully');
      await loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      message.error('Failed to delete customer: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Convert balance to number
      const processedValues = {
        ...values,
        balance: Number(values.balance) || 0,
      };
      
      if (editingCustomer) {
        console.log('Updating customer:', editingCustomer.id, processedValues);
        await customerAPI.update(editingCustomer.id, processedValues);
        message.success('Customer updated successfully');
      } else {
        const newCustomer = {
          ...processedValues,
          createdAt: new Date().toISOString(),
        };
        console.log('Creating customer:', newCustomer);
        await customerAPI.create(newCustomer);
        message.success('Customer created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      await loadCustomers(); // Add await to ensure reload completes
    } catch (error) {
      console.error('Error saving customer:', error);
      message.error('Failed to save customer: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => `Rp ${balance.toLocaleString('id-ID')}`,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('id-ID'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Customer) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!isAuthenticated || !hasAccess) {
    return (
      <DashboardLayout>
        <Card>
          <Alert
            message="Access Denied"
            description="You don't have permission to access this page. Only administrators can manage customers."
            type="error"
            showIcon
          />
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            Add Customer
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />

        <Modal
          title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Phone is required' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Address is required' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="balance"
              label="Balance"
              rules={[{ required: true, message: 'Balance is required' }]}
            >
              <Input type="number" placeholder="0" />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingCustomer ? 'Update' : 'Create'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </DashboardLayout>
  );
};

export default CustomersPage;