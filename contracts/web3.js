// web3.js
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Use MetaMask or other injected Web3 provider
    web3 = new Web3(window.ethereum);
} else {
    // Use local Ganache or other provider
    const provider = new Web3.providers.HttpProvider('http://localhost:7545'); // Update with your local blockchain URL
    web3 = new Web3(provider);
}

export default web3;
