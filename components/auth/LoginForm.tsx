'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Login berhasil!');
      router.push('/dashboard');
    } catch (error) {
      message.error('Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card 
        className="w-full max-w-md shadow-xl"
        title={
          <div className="text-center px-4 pt-6 pb-2">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              DataPak Store
            </h1>
            <p className="text-gray-600">Masuk ke akun Anda</p>
          </div>
        }
      >
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Username tidak boleh kosong!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password tidak boleh kosong!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 text-lg"
            >
              Masuk
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-800">Demo Credentials:</h3>
          <div className="space-y-1">
            <p className="text-sm text-blue-700">
              <strong>Admin:</strong> <span className="font-mono bg-white px-2 py-1 rounded">admin / admin123</span>
            </p>
            <p className="text-sm text-blue-700">
              <strong>Customer:</strong> <span className="font-mono bg-white px-2 py-1 rounded">customer1 / password</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;