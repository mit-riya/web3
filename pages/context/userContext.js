import React, {createContext, Component} from "react";
import web3 from './../../contracts/web3';
export const UserContext = createContext();

class UserContextProvider extends Component {
    state = { 
        account : "",
        email : "",
    } 
    setAccount = async (email) => {
        let connectedAccount = this.state.account;
        if (window.ethereum) {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Get the first account from the array
                connectedAccount = accounts[0];

                this.setState({ account: connectedAccount, email: email });
                const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

                await contract.methods.addEmail(email).send({ from: connectedAccount });

                console.log('MetaMask is connected!', connectedAccount);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error.message);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    }
    logout = () => {
        this.setState({ account: null, email: null });
        console.log('Logged out');
    }
    render() { 
        return (
            <UserContext.Provider value={{...this.state, setAccount :this.setAccount, logout: this.logout}}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}
 
export default UserContextProvider;