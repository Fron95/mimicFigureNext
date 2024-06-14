// components/Layout.js
import styles from './Layout.module.css';

interface LayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

export default function Layout({ leftContent, rightContent }: LayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.left}>{leftContent}</div>      
      <div className={styles.right}>{rightContent}</div>
    </div>
  );
}
