// Import necessary modules and components
import { useRouter } from 'next/router'; // Import router from Next.js
import { useContext } from 'react'; // Import useContext hook from React
import { UserContext } from './context/userContext'; // Import UserContext from custom context
import SetUser from './context/setUser'; // Import SetUser component from custom context
import styles from './../styles/login.module.css'; // Import CSS styles
import Image from 'next/image'; // Import Image component from Next.js
import Chat from './../public/chatbot-icon.svg'; // Import Chatbot icon SVG
import Chatbot from './chat'; // Import Chatbot component
import { useState } from 'react'; // Import useState hook from React
import Navbar from '@/components/navbar'; // Import Navbar component

// Define Login component
const Login = () => {
    // Define state variables and functions using React hooks
    const [vis, setVis] = useState(false); // State variable to manage visibility of chatbot
    const { account, logout } = useContext(UserContext); // Access account and logout function from context
    const router = useRouter(); // Initialize router

    // Function to log out from MetaMask
    const logoutMetamask = () => {
        logout();
    };

    // Function to navigate to My Identities page
    const goToMyIdentities = () => {
        router.push('/myIdentities');
    };

    // Function to navigate to Others' Identities page
    const goToOthersIdentities = () => {
        router.push('/verifyData');
    };

    return (
        <div className={styles.container}>
            {/* Check if user is logged in */}
            {account ? (
                <div>
                     <Navbar/> {/* Render Navbar component */}
                    <h1 className={styles.heading1}>USER CREDENTIALS</h1>
                    <div>
                        <p className={styles.text}>Account Number: {account}</p> {/* Display user account number */}
                        {/* Buttons to navigate to different pages and log out */}
                        <button className={styles.buttonType1} onClick={goToMyIdentities}>My Identities</button>
                        <button className={styles.buttonType1} onClick={goToOthersIdentities}>Others' Identities</button>
                        <button className={styles.buttonType1} onClick={logoutMetamask}>Logout</button>
                    </div>
                </div>
            ) : (
                <div>
                    <SetUser/> {/* Render SetUser component to prompt user to log in */}
                </div>
            )}
            {/* Chatbot section */}
            <div className={styles.chatBot}>
            {/* Conditionally render Chatbot component based on visibility state */}
            {vis ? (
                <div>
                    <Chatbot/> {/* Render Chatbot component */}
                </div>
            ) : (
                <div></div>
            )}
            {/* Button to toggle visibility of chatbot */}
            <button onClick={() => {setVis(!vis)}}>
                    <img src={Chat.src} className={styles.svgImage}  /> {/* Render Chatbot icon */}
                </button>
            </div>
        </div>
    );
};

export default Login; // Export Login component
