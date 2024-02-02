import { useEffect, useState } from 'react';
import web3 from '../contracts/web3';
import FileUploader from '../components/FileUploader';

// const fixedIdentities = [
//   "Aadhar",
//   "Pan Card",
//   "Voter ID",
//   "Driving License",
//   "Passport",
//   "Birth Certificate",
//   "10th Certificate",
//   "12th Certificate"
// ];

const MyIdentities = () => {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState([]);

  useEffect(() => {
    loadIdentities();
    // setIdentities(loadIdentities());
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

        const AllIdentities = await contract.methods.getAllIdentities().call({ from: userAddress });
        console.log(AllIdentities);

        const VerificationStatus = await contract.methods.getVerificationStatus().call({ from: userAddress });
        console.log(VerificationStatus);

        // const identityTypeToId = await contract.methods.identityTypeToId().call({ from: userAddress });

        // Update the state with the fetched identities
        setIdentities(AllIdentities || []);
        setVerificationStatus(VerificationStatus || []);
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

  const handleUpdate = async (index) => {
    // Placeholder for handling the update of the identity
    try {
      // Assuming there is a function in the contract for updating an identity
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );

      // Replace the following line with your actual update logic
      // Load the user's Ethereum address
      const userAddress = (await web3.eth.getAccounts())[0];
      
      await contract.methods.updateIdentity(index, cid, true).send({ from: userAddress });

      console.log(`Identity updated: ${index}`);
    } catch (error) {
      console.error('Error updating identity:', error.message);
    }
    console.log(`Identity updated: ${index}`);
  };

  const handleDelete = async (index) => {
    // Placeholder for handling the deletion of the identity
    try {
      // Assuming there is a function in the contract for deleting an identity
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );

      // Load the user's Ethereum address
      const userAddress = (await web3.eth.getAccounts())[0];

      // Replace the following line with your actual deletion logic
      await contract.methods.deleteIdentity(index).send({ from: userAddress });

      console.log(`Identity deleted: ${index}`);
    } catch (error) {
      console.error('Error deleting identity:', error.message);
    }
    console.log(`Identity deleted: ${index}`);
  };

  const handleAdd = async (index) => {
    // Placeholder for handling the addition of the identity
    try {
      // Assuming there is a function in the contract for adding an identity
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );

      // const cid = "";
      // Load the user's Ethereum address
      const userAddress = (await web3.eth.getAccounts())[0];

      // Replace the following line with your actual addition logic
      await contract.methods.addIdentity(index, cid, true).send({ from: userAddress });

      console.log(`Identity added: ${index}`);
    } catch (error) {
      console.error('Error adding identity:', error.message);
    }
    console.log(`Identity added: ${index}`);
  };

  return (
    <div>
      {/* <FileUploader /> */}
      <h1>My Identities</h1>
      {loading && <p>Loading...</p>}
      {!loading && identities.length === 0 && <p>No identities found.</p>}
      {!loading && identities.length > 0 && (
        <div>
          {identities.map((identity, index) => (
            <div key={index} style={{ border: '1px solid', padding: '10px', margin: '10px', display: 'inline-block' }}>
              <p>{`${identity}`}</p>
              {verificationStatus[index] ? (
                <>
                  <button onClick={() => handleUpdate(index)}>Update</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </>
              ) : (
                <button onClick={() => handleAdd(index)}>Add</button>
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
