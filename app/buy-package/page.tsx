'use client';

import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, message, Tag, Statistic } from 'antd';
import { ShoppingCartOutlined, WifiOutlined, WalletOutlined } from '@ant-design/icons';
import { packageAPI, customerAPI, transactionAPI } from '../../lib/api';
import { Package, Customer } from '../../types';
import DashboardLayout from '../../components/DashboardLayout';
import { useRoleProtection } from '../../hooks/useRoleProtection';

const BuyPackagePage = () => {
  const { hasAccess, user, isAuthenticated } = useRoleProtection(['customer']);
  const [packages, setPackages] = useState<Package[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [buyingPackage, setBuyingPackage] = useState<Package | null>(null);

  useEffect(() => {
    if (user?.role === 'customer') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [packagesData, customersData] = await Promise.all([
        packageAPI.getAll(),
        customerAPI.getAll(),
      ]);
      
      setPackages(packagesData);
      
      // Find current customer data
      const currentCustomer = customersData.find(c => c.name === user?.name);
      if (currentCustomer) {
        setCustomer(currentCustomer);
      }
    } catch (error) {
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPackage = (pkg: Package) => {
    setBuyingPackage(pkg);
    
    Modal.confirm({
      title: 'Confirm Purchase',
      content: (
        <div>
          <p><strong>Package:</strong> {pkg.name}</p>
          <p><strong>Data:</strong> {pkg.data}</p>
          <p><strong>Price:</strong> Rp {pkg.price.toLocaleString('id-ID')}</p>
          <p><strong>Your Balance:</strong> Rp {customer?.balance.toLocaleString('id-ID')}</p>
          <p>Are you sure you want to purchase this package?</p>
        </div>
      ),
      onOk: () => processPurchase(pkg),
      onCancel: () => setBuyingPackage(null),
    });
  };

  const processPurchase = async (pkg: Package) => {
    if (!customer) {
      message.error('Customer data not found');
      return;
    }

    if (customer.balance < pkg.price) {
      message.error('Insufficient balance');
      return;
    }

    try {
      // Create transaction
      const newTransaction = {
        customerId: customer.id,
        packageId: pkg.id,
        amount: pkg.price,
        status: 'completed' as const,
        paymentMethod: 'balance' as const,
        createdAt: new Date().toISOString(),
      };

      await transactionAPI.create(newTransaction);

      // Update customer balance
      const newBalance = customer.balance - pkg.price;
      await customerAPI.update(customer.id, { balance: newBalance });

      message.success(`Successfully purchased ${pkg.name}!`);
      setBuyingPackage(null);
      loadData(); // Reload to get updated balance
    } catch (error) {
      message.error('Failed to complete purchase');
    }
  };

  if (!isAuthenticated || !hasAccess) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Buy Data Package</h1>
          
          {customer && (
            <Card className="mb-6">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Your Balance"
                    value={customer.balance}
                    prefix={<WalletOutlined />}
                    formatter={(value) => `Rp ${value?.toLocaleString('id-ID')}`}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Customer Name"
                    value={customer.name}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Phone"
                    value={customer.phone}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>

        <Card title="Available Packages">
          <Row gutter={[16, 16]}>
            {packages.map((pkg) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={pkg.id}>
                <Card
                  size="small"
                  className="border-2 hover:border-blue-400 transition-colors h-full"
                  actions={[
                    <Button
                      key="buy"
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleBuyPackage(pkg)}
                      disabled={!customer || customer.balance < pkg.price}
                    >
                      {!customer || customer.balance < pkg.price ? 'Insufficient Balance' : 'Buy Now'}
                    </Button>
                  ]}
                >
                  <div className="text-center">
                    <WifiOutlined className="text-4xl text-blue-500 mb-3" />
                    <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-2">{pkg.description}</p>
                    <div className="mb-3">
                      <p className="text-2xl font-bold text-blue-600">
                        {pkg.data}
                      </p>
                      <p className="text-sm text-gray-500">{pkg.validity}</p>
                    </div>
                    <p className="text-xl font-bold text-green-600 mb-3">
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
      </div>
    </DashboardLayout>
  );
};

export default BuyPackagePage;