"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { customerAPI, transactionAPI, packageAPI } from "../../lib/api";
import { Customer, Transaction, Package } from "../../types";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    totalPackages: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [customersData, transactions, packagesData] = await Promise.all([
        customerAPI.getAll(),
        transactionAPI.getAll(),
        packageAPI.getAll(),
      ]);

      const totalRevenue = transactions
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        totalCustomers: customersData.length,
        totalTransactions: transactions.length,
        totalRevenue,
        totalPackages: packagesData.length,
      });

      // Sort transactions by ID (ascending order) and get recent 5
      const sortedTransactions = transactions.sort((a, b) => {
        const idA = typeof a.id === "string" ? parseInt(a.id) : a.id;
        const idB = typeof b.id === "string" ? parseInt(b.id) : b.id;
        return idB - idA; // Descending for recent transactions (newest first by ID)
      });

      setRecentTransactions(sortedTransactions.slice(0, 5));
      setCustomers(customersData);
      setPackages(packagesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: number | string) => {
    const customer = customers.find((c) => c.id == customerId);
    return customer ? customer.name : `Customer ${customerId}`;
  };

  const getPackageName = (packageId: number | string) => {
    const pkg = packages.find((p) => p.id == packageId);
    return pkg ? pkg.name : `Package ${packageId}`;
  };

  const transactionColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Transaction, b: Transaction) => {
        const idA = typeof a.id === "string" ? parseInt(a.id) : a.id;
        const idB = typeof b.id === "string" ? parseInt(b.id) : b.id;
        return idA - idB;
      },
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      key: "customerId",
      render: (customerId: number | string) => getCustomerName(customerId),
    },
    {
      title: "Package",
      dataIndex: "packageId",
      key: "packageId",
      render: (packageId: number | string) => getPackageName(packageId),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "completed"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("id-ID"),
    },
  ];

  // Customer Dashboard
  if (user?.role === "customer") {
    return (
      <DashboardLayout>
        <div>
          <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>

          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} md={12}>
              <Card
                title="Buy Data Package"
                actions={[
                  <Link key="buy" href="/buy-package">
                    <Button type="primary" size="large" block>
                      Browse Packages
                    </Button>
                  </Link>,
                ]}
              >
                <p>
                  Purchase internet data packages with your available balance.
                </p>
                <p>
                  Choose from our variety of packages suitable for your needs.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                title="My Profile"
                actions={[
                  <Link key="profile" href="/my-profile">
                    <Button type="default" size="large" block>
                      View Profile
                    </Button>
                  </Link>,
                ]}
              >
                <p>
                  View your profile information, balance, and transaction
                  history.
                </p>
                <p>Keep track of your purchases and account details.</p>
              </Card>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    );
  }

  // Admin Dashboard
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={stats.totalCustomers}
                prefix={<UserOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Transactions"
                value={stats.totalTransactions}
                prefix={<ShoppingCartOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix={<DollarCircleOutlined />}
                formatter={(value) =>
                  `Rp ${Number(value).toLocaleString("id-ID")}`
                }
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Available Packages"
                value={stats.totalPackages}
                prefix={<WifiOutlined />}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Recent Transactions" className="mb-6">
          <Table
            columns={transactionColumns}
            dataSource={recentTransactions}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
