'use client';

import { Spin } from 'antd';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'large', 
  text = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Spin size={size} />
      {text && (
        <p className="mt-4 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;