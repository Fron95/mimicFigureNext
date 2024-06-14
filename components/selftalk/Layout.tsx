// components/Layout.js
import styles from './Layout.module.css';

export default function Layout({ leftContent, rightContent }) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>{leftContent}</div>      
      <div className={styles.right}>{rightContent}</div>
    </div>
  );
}
