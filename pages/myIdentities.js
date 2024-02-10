/* myIdentities.js - Page for managing user's identities */

// Import libraries
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import web3 from '../contracts/web3';
import FileUploader from '../components/FileUploader';
import styles from './../styles/myIdentities.module.css';
import { UserContext } from './context/userContext';
import Navbar from '@/components/navbar';

// Define the MyIdentities component
const MyIdentities = () => {
  const { account, loadingAccount } = useContext(UserContext);  // Get the account and loadingAccount from the UserContext
  const { AllIdentities } = useContext(UserContext); // Get the AllIdentities from the UserContext
  const [identities, setIdentities] = useState([]); // Initialize the identities state variable
  const [loading, setLoading] = useState(false); // Initialize the loading state variable
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);  // Initialize the isUploaderOpen state variable
  const [verificationStatus, setVerificationStatus] = useState([]); // Initialize the verificationStatus state variable
  const [selectedIdentityIndex, setSelectedIdentityIndex] = useState(null); // Initialize the selectedIdentityIndex state variable
  const [addFunction, setAddFunction] = useState(true); // Initialize the addFunction state variable
  const [expandedCategory, setExpandedCategory] = useState(null); // Toggle visibility of identities under each category

  // Load the user's identities when the component mounts
  useEffect(() => {
    loadIdentities();
  }, [loadingAccount]);

  // Function to load the user's identities
  const loadIdentities = async () => {
    setLoading(true); // Set loading to true

    try {
      // Connect to the user's MetaMask provider
      if (window.ethereum) {

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
        const VerificationStatus = await contract.methods.getVerificationStatus().call({ from: account });  // Get the verification status of the user's identities

        // Update the state with the fetched identities
        setIdentities(AllIdentities || []); // Set the identities state variable to the fetched identities
        setVerificationStatus(VerificationStatus || []);  // Set the verificationStatus state variable to the fetched verification status
      } else {
        // Log an error if MetaMask is not installed
        console.error('MetaMask is not installed');
      }
    } catch (error) {
      // Log an error if there is an error loading the identities
      console.error('Error loading identities:', error.message);
    } finally {
      // Set loading to false
      setLoading(false);
    }
  };

  // Function to open the file uploader
  const openFileUploader = (index, functionCalled) => {
    // Set addFunction to true if the functionCalled is 0, otherwise set it to false
    if (functionCalled === 0) {
      setAddFunction(false);  // Set addFunction to false
    } else {
      setAddFunction(true); // Set addFunction to true
    }
    setIsUploaderOpen(true);  // Set isUploaderOpen to true
    setSelectedIdentityIndex(index);  // Set the selectedIdentityIndex to the index of document
  };

  // Function to close the file uploader
  const closeFileUploader = () => {
    setIsUploaderOpen(false); // Set isUploaderOpen to false
    setSelectedIdentityIndex(null); // Set the selectedIdentityIndex to null
    loadIdentities(); // Reload identities after the FileUploader is closed
  };

  // Function to handle updating an identity
  const handleUpdate = async (index, cid) => {
    // Check if the CID is generated and the selectedIdentityIndex is not null
    if (cid && selectedIdentityIndex !== null) {

      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        // Update the identity in contract
        await contract.methods.updateIdentity(index, cid, true).send({ from: account });
        console.log(`Identity updated`);  // Log a message if the identity is updated
      } catch (error) {
        console.error('Error updating identity:', error.message); // Log an error if there is an error updating the identity
      }
      loadIdentities(); // Reload identities after the identity is updated
    }
    else {
      console.error('Error updating identity: CID not generated');  // Log an error if the CID is not generated
    }
  };

  // Function to handle deleting an identity
  const handleDelete = async (index) => {
    // Display confirmation dialog before deleting
    const isConfirmedDelete = window.confirm("Are you sure you want to delete this identity?");

    // Check if the user confirmed the deletion
    if (isConfirmedDelete) {
      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        // Delete the identity if confirmed
        await contract.methods.deleteIdentity(index).send({ from: account });
        console.log(`Identity deleted`);  // Log a message if the identity is deleted
        loadIdentities();
      } catch (error) {
        console.error('Error deleting identity:', error.message); // Log an error if there is an error deleting the identity
      }
    } else {
      console.log("Deletion canceled by user.");  // Log a message if the deletion is canceled by the user
    }
  };

  // Function to handle adding an identity
  const handleAdd = async (index, cid) => {
    // Check if the CID is generated and the selectedIdentityIndex is not null
    if (cid && selectedIdentityIndex !== null) {
      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        // Add the identity to the contract
        await contract.methods.addIdentity(index, cid, true).send({ from: account });
        console.log(`Identity added`);  // Log a message if the identity is added
        loadIdentities(); // Reload identities after the identity is added
      } catch (error) {
        console.error('Error adding identity:', error.message); // Log an error if there is an error adding the identity
      }
    } else {
      console.error('Error adding identity: CID not generated');  // Log an error if the CID is not generated
    }
  };

  // Group identities based on their category
  const groupedIdentities = identities.reduce((groups, identity) => {
    const category = identity.split(' - ')[0]; // identities are categorized with ' - '
    if (!groups[category]) {
      groups[category] = [];  // Create a new category if it doesn't exist
    }
    groups[category].push(identity);  // Add the identity to the category
    return groups;  // Return the updated groups
  }, {});

  // Function to get the original index of the identity
  const getOriginalIndex = (identity) => {
    // Find the original index of the identity based on the current index
    return identities.findIndex((_identity) => _identity === identity);
  };

  // Function to handle the click event
  async function handleClick(index, isVerified) {
    try {
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );
      // Open the file in a new tab if verified
      if (isVerified) {
        const cid = await contract.methods.getCID(index).call({ from: account });
        const target_url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${process.env.PINATA_URL_SECOND}`;
        window.open(target_url, '_blank');
      } else {
        // no action
      }
    } catch (error) {
      console.error('Error:', error.message); // Log an error if there is an error
    }
  }

  // Return the MyIdentities component
  return (
    <div className={styles.container}>
      <Navbar/>
      <h1 className={styles.heading}>My Info</h1> {/* Heading for the page */}

      {loading && <p>Loading...</p>}  {/* Display a loading message if the identities are loading */}
      {!account && <p>No identities found.</p>} {/* Display a message if no identities are found */}

      {/* Display the identities if they are found */}
      {account && !loading && Object.keys(groupedIdentities).length > 0 && (
        <div className={styles.tileWrapper}>
          {/* Map through the grouped identities and display them */}
          {Object.entries(groupedIdentities).map(([category, identities]) => (
            <div key={category} className={styles.tileWrapper}>
              <h2 className={styles.categoryHeader} onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}>
                {category}
              </h2>
              {expandedCategory === category && (
                <div>
                  {identities.map((identity, index) => (
                    <div key={index} className={styles.identitiesList}>
                      <p className={styles.aligntext} onClick={() => handleClick(getOriginalIndex(identity), verificationStatus[getOriginalIndex(identity)])}>{identity.includes(' - ') ? identity.split(' - ')[1] : identity}</p>
                      <div className={styles.buttonGroup}>
                        {verificationStatus[getOriginalIndex(identity)] ? (
                          <>
                            <button className={styles.buttonAdd} disabled={isUploaderOpen} onClick={() => openFileUploader(getOriginalIndex(identity), 0)}>Update</button>
                            <button className={styles.buttonAdd} disabled={isUploaderOpen} onClick={() => handleDelete(getOriginalIndex(identity))}>Delete</button>
                          </>
                        ) : (
                          <button className={styles.buttonAdd} disabled={isUploaderOpen} onClick={() => openFileUploader(getOriginalIndex(identity), 1)}>Add</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Display the file uploader if the user is logged in and the identities are found */}
      {isUploaderOpen && (
        <div style={{ position: 'absolute', top: '0px', width: 'fit-content', height: 'fit-content', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <FileUploader
            identityType={selectedIdentityIndex}
            onClose={closeFileUploader}
            handleAddOrUpdate={addFunction ? handleAdd : handleUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default MyIdentities;
