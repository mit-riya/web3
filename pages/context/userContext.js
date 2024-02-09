import React, { createContext, Component } from "react";
import web3 from './../../contracts/web3';

export const UserContext = createContext();

class UserContextProvider extends Component {
    state = { 
        account: "",
        email: "",
        AllIdentities: [], // Initialize AllIdentities as an empty array
    } 

    componentDidMount() {
        this.loadAllIdentities(); // Load AllIdentities when the component mounts
    }

    loadAllIdentities = async () => {
        if (window.ethereum) {
            try {
                // Load MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Load the user's Ethereum address
                const userAddress = (await web3.eth.getAccounts())[0];

                // Load the DigitalIdentity contract using the ABI and contract address
                const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

                // Call the contract's function to get all identities
                const AllIdentities = await contract.methods.getAllIdentities().call({ from: userAddress });
                console.log('All Identities:', AllIdentities);

                // Update the state with the fetched identities
                this.setState({ AllIdentities });
            } catch (error) {
                console.error('Error loading identities:', error.message);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    setAccount = async (email) => {
        let connectedAccount = this.state.account;
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Load the user's Ethereum address
                const connectedAccount = (await web3.eth.getAccounts())[0];
                // Request account access
                // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                // // Get the first account from the array
                // connectedAccount = accounts[0];

                this.setState({ account: connectedAccount, email });
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
            <UserContext.Provider value={{ ...this.state, setAccount: this.setAccount, logout: this.logout }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}
 
export default UserContextProvider;
