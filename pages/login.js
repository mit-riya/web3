// pages/login.js
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './context/userContext';
import SetUser from './context/setUser';
import styles from './../styles/login.module.css'
const Login = () => {
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
            <h1 className={styles.heading1}>LOGIN PAGE</h1>
            {account ? (
                <div>
                    <p className={styles.text}>Connected Account: {account}</p>
                    <p className={styles.text}>Account Number: {account}</p>
                    <button className={styles.buttonType1} onClick={goToMyIdentities}>My Identities</button>
                    <button className={styles.buttonType1} onClick={goToOthersIdentities}>Others' Identities</button>
                    <button className={styles.buttonType1} onClick={logoutMetamask}>Logout</button>
                </div>
            ) : (
                <div>
                    <SetUser/>
                    
                </div>
            )}
        </div>
    );
};

export default Login;
