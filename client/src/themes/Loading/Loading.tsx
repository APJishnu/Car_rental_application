// app/components/Loading.tsx

import React from 'react';
import { Spin } from 'antd';
import styles from './Loading.module.css'; // Create a CSS module for styling

const Loading: React.FC = () => {
  return (
    <div className={styles.loadingOverlay}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;
