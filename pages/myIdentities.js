// pages/myIdentities.jsx
import { useEffect, useState } from 'react';
// import Web3 from 'web3';
import web3 from '../contracts/web3';
import FileUploader from '../components/FileUploader';
// import DigitalIdentityABI from '../contracts/DigitalIdentityABI.json';
// import ContractAddress from '../contracts/ContractAddress.json';

const fixedIdentities = [
  "Aadhar",
  "Pan Card",
  "Voter ID",
  "Driving License",
  "Passport",
  "Birth Certificate",
  "10th Certificate",
  "12th Certificate"
];

const MyIdentities = () => {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  useEffect(() => {
    // loadIdentities();
    setIdentities(["Aadhar", "Pan Card", "Voter ID", "Driving License", "10th Certificate", "12th Certificate"]);
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

        console.log("hiiii");

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

        console.log("hoooo");
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

  const openFileUploader = () => {
    setIsUploaderOpen(true);
  };

  const handleUpdate = async (identity) => {
    // Placeholder for handling the update of the identity
    // try {
    //   // Assuming there is a function in the contract for updating an identity
    //   const contract = new web3.eth.Contract(
    //     process.env.CONTRACT_ABI,
    //     process.env.CONTRACT_ADDRESS
    //   );

    //   // Replace the following line with your actual update logic
    //   await contract.methods.updateIdentity(identity).send({ from: userAddress });
      
    //   console.log(`Identity updated: ${identity}`);
    // } catch (error) {
    //   console.error('Error updating identity:', error.message);
    // }
    console.log(`Identity updated: ${identity}`);
  };

  const handleDelete = async (identity) => {
    // Placeholder for handling the deletion of the identity
    // try {
    //   // Assuming there is a function in the contract for deleting an identity
    //   const contract = new web3.eth.Contract(
    //     process.env.CONTRACT_ABI,
    //     process.env.CONTRACT_ADDRESS
    //   );

    //   // Replace the following line with your actual deletion logic
    //   await contract.methods.deleteIdentity(identity).send({ from: userAddress });

    //   console.log(`Identity deleted: ${identity}`);
    // } catch (error) {
    //   console.error('Error deleting identity:', error.message);
    // }
    console.log(`Identity deleted: ${identity}`);
  };

  const handleAdd = async (identity) => {
    // Placeholder for handling the addition of the identity
    // try {
    //   // Assuming there is a function in the contract for adding an identity
    //   const contract = new web3.eth.Contract(
    //     process.env.CONTRACT_ABI,
    //     process.env.CONTRACT_ADDRESS
    //   );

    //   // Replace the following line with your actual addition logic
    //   await contract.methods.addIdentity(identity).send({ from: userAddress });

    //   console.log(`Identity added: ${identity}`);
    // } catch (error) {
    //   console.error('Error adding identity:', error.message);
    // }
    console.log(`Identity added: ${identity}`);
  };

  const isIdentityAdded = (identity) => {
    // Placeholder for checking whether the identity is added
    // Replace this logic with your actual check
    return identities.includes(identity);
  };

  return (
    <div>
      {/* <FileUploader /> */}
      <h1>My Identities</h1>
      {loading && <p>Loading...</p>}
      {!loading && identities.length === 0 && <p>No identities found.</p>}
      {!loading && identities.length > 0 && (
        <div>
          {fixedIdentities.map((fixedIdentity, index) => (
            <div key={index} style={{ border: '1px solid', padding: '10px', margin: '10px', display: 'inline-block' }}>
              <p>{`Identity: ${fixedIdentity}`}</p>
              {isIdentityAdded(fixedIdentity) ? (
                <>
                  <button onClick={() => handleUpdate(fixedIdentity)}>Update</button>
                  <button onClick={() => handleDelete(fixedIdentity)}>Delete</button>
                </>
              ) : (
                <button onClick={() => handleAdd(fixedIdentity)}>Add</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* <button onClick={openFileUploader}>Add More Identities</button> */}
      {isUploaderOpen && <FileUploader />}
    </div>
  );
};

export default MyIdentities;
