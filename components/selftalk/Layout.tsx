// components/Layout.js
import styles from "./Layout.module.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface LayoutProps {
  isLeftVisible: boolean;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  toggleLeftVisibility: () => void; // 추가된 prop
}

export default function Layout({
  isLeftVisible,
  leftContent,
  rightContent,
  toggleLeftVisibility,
}: LayoutProps) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.left} ${
          isLeftVisible ? styles.visible : styles.hidden
        }`}
      >
        {leftContent}
        <Button className={styles.toggleButton} onClick={toggleLeftVisibility}>
          {isLeftVisible ? ">" : "MENU"}
        </Button>
      </div>
      <div
        className={`${styles.right} ${
          isLeftVisible ? styles.hidden : styles.visible
        }`}
      >
        {rightContent}

        <Button className={styles.toggleButton} onClick={toggleLeftVisibility}>
          {isLeftVisible ? ">" : "MENU"}
        </Button>
      </div>
    </div>
  );
}
