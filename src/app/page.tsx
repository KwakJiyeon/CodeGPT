import React from 'react';
import FileUpload from './components/FileUpload';
import styles from './page.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>CodeGPT</h1>
      <FileUpload />
    </div>
  );
};

export default Home;