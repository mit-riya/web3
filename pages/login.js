// pages/login.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Login = () => {
    const [account, setAccount] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Load MetaMask
        loadMetaMask();
    }, []);

    const loadMetaMask = async () => {
        if (window.ethereum) {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Get the first account from the array
                const connectedAccount = accounts[0];

                setAccount(connectedAccount);
                console.log('MetaMask is connected!', connectedAccount);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error.message);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    const logout = () => {
        setAccount(null);
        console.log('Logged out');
    };

    const goToMyIdentities = () => {
        router.push('/myIdentities');
    };

    const goToOthersIdentities = () => {
        router.push('/othersIdentities');
    };

    return (
        <div>
            <h1>Login Page</h1>
            {account ? (
                <div>
                    <p>Connected Account: {account}</p>
                    <p>Account Number: {account}</p>
                    <button onClick={goToMyIdentities}>My Identities</button>
                    <button onClick={goToOthersIdentities}>Others' Identities</button>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <button onClick={loadMetaMask}>Connect with MetaMask</button>
            )}
        </div>
    );
    // return <div>hello</div>
};

export default Login;
