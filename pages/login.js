// pages/login.js
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from './context/userContext';
import SetUser from './context/setUser';

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
        <div>
            <h1>Login Page</h1>
            {account ? (
                <div>
                    <p>Connected Account: {account}</p>
                    <p>Account Number: {account}</p>
                    <button onClick={goToMyIdentities}>My Identities</button>
                    <button onClick={goToOthersIdentities}>Others' Identities</button>
                    <button onClick={logoutMetamask}>Logout</button>
                </div>
            ) : (
                <SetUser/>
            )}
        </div>
    );
};

export default Login;
