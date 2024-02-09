// pages/login.js
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './context/userContext';
import SetUser from './context/setUser';
import styles from './../styles/login.module.css'
import Image from 'next/image';
import Chat from './../public/chatbot-icon.svg'
import Chatbot from './chat';
import { useState } from 'react';
const Login = () => {
    const [vis, setVis] = useState(false);
    const { account, logout } = useContext(UserContext);
    const router = useRouter();
    
    const logoutMetamask = () => {
        logout();
    };

    const goToMyIdentities = () => {
        router.push('/myIdentities');
    };

    const goToOthersIdentities = () => {
        router.push('/othersIdentities');
    };
    return (
        <div class={styles.container}>
            
            {account ? (
                <div>
                    <h1 className={styles.heading1}>USER CREDENTIALS</h1>
                    <div>
                        <p className={styles.text}>Connected Account: {account}</p>
                        <p className={styles.text}>Account Number: {account}</p>
                        <button className={styles.buttonType1} onClick={goToMyIdentities}>My Identities</button>
                        <button className={styles.buttonType1} onClick={goToOthersIdentities}>Others' Identities</button>
                        <button className={styles.buttonType1} onClick={logoutMetamask}>Logout</button>
                    </div>
                    
                    
                </div>
                
            ) : (
                <div>
                    <SetUser/>
                    
                </div>
            )}
            <div className={styles.chatBot}>
            {vis?(
                <div>
                    <Chatbot/>
                </div>
            ):(
                <div></div>
            )}
            <button onClick={()=>{setVis(!vis)}}>
                    <img src={Chat.src} className={styles.svgImage}  />
                </button>
            
            </div>
        </div>
    );
};

export default Login;
