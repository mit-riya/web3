import { useState, useContext } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import styles from './../styles/navbar.module.css'; // Import the CSS file for styles
import { UserContext } from '@/pages/context/userContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { account, logout} = useContext(UserContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const logoutMetamask = () => {
    logout();
    console.log("Logged out successfully.");
  }

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
            {/* Use Link for routing */}
            <Link href="/myIdentities" className={styles.navLink}>My Information</Link>
            <Link href="/verify" className={styles.navLink}>Requests</Link>
            <Link href="/verifyData" className={styles.navLink}>Verify Data</Link>
            <Link href="/login" className={styles.navLink} onClick={logoutMetamask}>Log out</Link>
            </div>
        </div>
        </nav>
    </div>
  );
};

export default Navbar;
