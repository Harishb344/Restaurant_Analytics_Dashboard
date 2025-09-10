import React from "react";
import { logo_url } from "../Assets/Icons";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
     
      <div className={styles.logo}>
        <img src={logo_url} alt="logo" className={styles.logoImg}></img>
      </div>


      <ul className={styles.navLinks}>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Restaurants</a></li>
        <li><a href="#">Analytics</a></li>
        <li><a href="#">Settings</a></li>
      </ul>


      <div className={styles.rightSection}>
        <input
          type="text"
          placeholder="Search restaurant..."
          className={styles.search}
        />
        <button className={styles.profileBtn}>👤</button>
      </div>
    </nav>
  );
}
