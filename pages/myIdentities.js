import { useEffect, useState } from 'react';
import web3 from '../contracts/web3';
import FileUploader from '../components/FileUploader';

const MyIdentities = () => {
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState([]);
  // const [generatedCID, setGeneratedCID ] = useState("");
  const [selectedIdentityIndex, setSelectedIdentityIndex] = useState(null);
  const [addFunction, setAddFunction] = useState(true);

  useEffect(() => {
    loadIdentities();
  }, []);

  const loadIdentities = async () => {
    setLoading(true);

    try {
      // Connect to the user's MetaMask provider
      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];
        console.log(userAddress);

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

        // Call the contract's function to get the list of identities
        const result = await contract.methods.getIdentitiesByAccount().call({ from: userAddress });
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

  const openFileUploader = (index, functionCalled) => {
    // setGeneratedCID(""); // Clear previous CID
    if (functionCalled === 0) {
      setAddFunction(false);
    } else {
      setAddFunction(true);
    }
    setIsUploaderOpen(true);
    setSelectedIdentityIndex(index);
  };

  const closeFileUploader = () => {
    setIsUploaderOpen(false);
    setSelectedIdentityIndex(null);
    // setAddFunction(true);

    // Reload identities after the FileUploader is closed
    // loadIdentities();
  };

  // const handleGeneratedCID = (cid) => {
  //   console.log("cid: ",cid);
  //   console.log("identity index: ",selectedIdentityIndex);
  // };

  const handleUpdate = async (index, cid) => {
    console.log("cid: ", cid);
    console.log("identity index: ", selectedIdentityIndex);
    if (cid && selectedIdentityIndex !== null) {
      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];

        await contract.methods.updateIdentity(index, cid, true).send({ from: userAddress });
        console.log(`Identity updated: ${index}`);
      } catch (error) {
        console.error('Error updating identity:', error.message);
      }
      loadIdentities();
    }
    else {
      console.error('Error updating identity: CID not generated');
    }
  };

  const handleDelete = async (index) => {
    // Display confirmation dialog before deleting
    const isConfirmedDelete = window.confirm("Are you sure you want to delete this identity?");

    if (isConfirmedDelete) {
      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];

        // Delete the identity if confirmed
        await contract.methods.deleteIdentity(index).send({ from: userAddress });
        console.log(`Identity deleted: ${index}`);
        loadIdentities();
      } catch (error) {
        console.error('Error deleting identity:', error.message);
      }
    } else {
      console.log("Deletion canceled by user.");
    }
  };

  const handleAdd = async (index, cid) => {
    console.log("cid: ", cid);
    console.log("identity index: ", selectedIdentityIndex);
    if (cid && selectedIdentityIndex !== null) {
      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];

        await contract.methods.addIdentity(index, cid, true).send({ from: userAddress });
        console.log(`Identity added: ${index}`);
        loadIdentities();
      } catch (error) {
        console.error('Error adding identity:', error.message);
      }
    } else {
      console.error('Error adding identity: CID not generated');
    }
  };

  return (
    <div>
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
                  <button disabled={isUploaderOpen} onClick={() => openFileUploader(index, 0)}>Update</button>
                  <button disabled={isUploaderOpen} onClick={() => handleDelete(index)}>Delete</button>
                </>
              ) : (
                <button disabled={isUploaderOpen} onClick={() => openFileUploader(index, 1)}>Add</button>
              )}
            </div>
          ))}
        </div>
      )}
      {isUploaderOpen && (
        <FileUploader
          identityType={selectedIdentityIndex}
          onClose={closeFileUploader}
          handleAddOrUpdate={addFunction ? handleAdd : handleUpdate}
        />
      )}
    </div>
  );
};

export default MyIdentities;
