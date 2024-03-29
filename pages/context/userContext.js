import React, { createContext, Component } from "react";
import web3 from './../../contracts/web3';

export const UserContext = createContext();

class UserContextProvider extends Component {
    state = { 
        account: null,
        email: null,
        AllIdentities: [], 
        loadingAccount: true,
    } 

    componentDidMount() {
        const account = localStorage.getItem('account');
        const email = localStorage.getItem('email');
        if (account && email) {
            // fetch account and email again on page refresh
            this.setState({ account, email });
        }
        this.loadAllIdentities().then(() => {
            this.setState({ loadingAccount: false }); // Set loading to false once everything is loaded
        }).catch(error => {
            console.error("Failed to load identities or user data", error);
            this.setState({ loadingAccount: false }); // Ensure loading is set to false even if there's an error
        });
    }
    
    
    loadAllIdentities = async () => {
        if (window.ethereum) {
            try {
                // Load the DigitalIdentity contract using the ABI and contract address
                const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

                // Call the contract's function to get all identities
                const AllIdentities = await contract.methods.getAllIdentities().call({ from: this.state.account });

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
        if (window.ethereum) {
            try {
                // Load MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Load the user's Ethereum address
                const connectedAccount = (await web3.eth.getAccounts())[0];
    
                // Save account and email to state and localStorage
                this.setState({ account: connectedAccount, email });
                localStorage.setItem('account', connectedAccount);
                localStorage.setItem('email', email);

                // Load the DigitalIdentity contract using the ABI and contract address
                const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
                await contract.methods.addEmail(email).send({ from: connectedAccount });
                
            } catch (error) {
                console.error('Error connecting to MetaMask:', error.message);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    }
    
    logout = () => {
        // Clear account and email from state and localStorage
        this.setState({ account: null, email: null });
        localStorage.removeItem('account');
        localStorage.removeItem('email');
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
