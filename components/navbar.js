import { useState, useContext } from 'react';
import Link from 'next/link'; 
import styles from './../styles/navbar.module.css';
import { UserContext } from '@/pages/context/userContext';

const Navbar = () => {
  // State to manage the visibility of the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  // Accessing account and logout function from UserContext
  const { account, logout } = useContext(UserContext);

  // Function to toggle the visibility of the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle logout
  const logoutMetamask = () => {
    logout();
  }

  return (
    <div>
      {/* Hamburger menu for small screens */}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.srOnly}>Open main menu</span>
        <div className={`${styles.hamburgerIcon} ${isOpen ? styles.active : ''}`}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className={`${styles.navbar} ${isOpen ? styles.showMenu : ''}`}>
        {/* Hamburger icon (visible on larger screens) */}
        <div className={styles.hamburger2} onClick={toggleMenu}>
          <span className={styles.srOnly}>Open main menu</span>
          <div className={`${styles.hamburgerIcon} ${isOpen ? styles.active : ''}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>

        {/* Navbar container with navigation links */}
        <div className={styles.navbarContainer}>
          <div className={styles.navLinks}>
            {/* Navigation links using Next.js Link */}
            <Link href="/login" className={styles.navLink}>Home Page</Link>
            <Link href="/myIdentities" className={styles.navLink}>My Information</Link>
            <Link href="/verify" className={styles.navLink}>Requests</Link>
            <Link href="/verifyData" className={styles.navLink}>Verify Data</Link>
            {/* Logout link with the onClick event */}
            <Link href="/login" className={styles.navLink} onClick={logoutMetamask}>Log out</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
