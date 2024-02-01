// pages/myIdentities.jsx
import { useEffect, useState } from 'react';
// import Web3 from 'web3';
import web3 from '../contracts/web3';
// import DigitalIdentityABI from '../contracts/DigitalIdentityABI.json';
// import ContractAddress from '../contracts/ContractAddress.json';

const MyIdentities = () => {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIdentities();
  }, []);

  const loadIdentities = async () => {
    setLoading(true);

    try {
      // Connect to the user's MetaMask provider
      if (window.ethereum) {
        // const web3 = new Web3(window.ethereum);

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];
        console.log(userAddress);

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

        // Call the contract's function to get the list of identities
        const result = await contract.methods.getIdentitiesByAccount().call({ from: userAddress });
        console.log(result);

        // Update the state with the fetched identities
        setIdentities(result || []);
      } else {
        console.error('MetaMask is not installed');
      }
    } catch (error) {
      console.error('Error loading identities:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Identities</h1>
      {loading && <p>Loading...</p>}
      {!loading && identities.length === 0 && <p>No identities found.</p>}
      {!loading && identities.length > 0 && (
        <p>{identities}</p>
        // <ul>
        //   {identities.map((identity, index) => (
        //     <li key={index}>
        //       {`ID: ${identity._id}, CID: ${identity._cid}, Verified: ${identity._isVerified}`}
        //       </li>
        //   ))}
        // </ul>
      )}
    </div>
  );
};

export default MyIdentities;
