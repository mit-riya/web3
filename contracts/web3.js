/*web3.js is a utility file that configures the web3 instance based on the environment. */

// Importing the Web3 library
import Web3 from 'web3';

// Declare the web3 variable
let web3;

// Check if the code is running in the browser and MetaMask is available
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Use MetaMask or other injected Web3 provider
    web3 = new Web3(window.ethereum);
} else {
    // Use local Ganache or other provider
    const provider = new Web3.providers.HttpProvider('http://localhost:7545'); // Update with your local blockchain URL
    web3 = new Web3(provider);
}

// Export the configured web3 instance for use in other modules
export default web3;
