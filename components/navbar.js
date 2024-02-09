import { useState } from 'react';
import styles from './../styles/navbar.module.css'; // Import the CSS file for styles

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
        <div className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.srOnly}>Open main menu</span>
          <div className={`${styles.hamburgerIcon} ${isOpen ? styles.active : ''}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
        <nav className={`${styles.navbar} ${isOpen ? styles.showMenu : ''}`}>
        <div className={styles.hamburger2} onClick={toggleMenu}>
          <span className={styles.srOnly}>Open main menu</span>
          <div className={`${styles.hamburgerIcon} ${isOpen ? styles.active : ''}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
        <div className={styles.navbarContainer}>
            <div className={styles.navLinks}>
            <a href="#myIdentities" className={styles.navLink}>My Information</a>
          <a href="#" className={styles.navLink}>Requests</a>
          <a href="#" className={styles.navLink}>Verify Data</a>
          <a href="#" className={styles.navLink}>Log out</a>
            </div>
        </div>
        </nav>
    </div>
  );
};

export default Navbar;
