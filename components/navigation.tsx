

// style
import styles from "@/styles/home.module.css";
// 다국어 지원

import React from "react";
import Link from "next/link";
import DarkModeToogle from "./darkmodeToggle";

export default function Navigation() {
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <DarkModeToogle />
        </li>
        <li>
          <Link href="/">HOME</Link>
        </li>
        <li>
          <Link href="/about-us">ABOUT US</Link>
        </li>
        <li>
          <Link href="/donation">DONATION</Link>
        </li>
      </ul>
    </div>
  );
}
