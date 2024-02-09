import { useEffect, useState } from 'react';
import { useContext } from 'react';
import web3 from '../contracts/web3';
import FileUploader from '../components/FileUploader';
import styles from './../styles/myIdentities.module.css';
import { UserContext } from './context/userContext';

const MyIdentities = () => {
  const { account } = useContext(UserContext);
  const { AllIdentities } = useContext(UserContext);
  const [identities, setIdentities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState([]);
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
        console.log('account : ', account);
        console.log('All Identities : ', AllIdentities);

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
        const VerificationStatus = await contract.methods.getVerificationStatus().call({ from: account });
        console.log(VerificationStatus);

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
    // Reload identities after the FileUploader is closed
    loadIdentities();
  };

  const handleUpdate = async (index, cid) => {
    console.log("cid: ", cid);
    console.log("identity index: ", selectedIdentityIndex);
    if (cid && selectedIdentityIndex !== null) {
      try {
        const contract = new web3.eth.Contract(
          process.env.CONTRACT_ABI,
          process.env.CONTRACT_ADDRESS
        );

        await contract.methods.updateIdentity(index, cid, true).send({ from: account });
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

        // Delete the identity if confirmed
        await contract.methods.deleteIdentity(index).send({ from: account });
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

        console.log('index : ', index);
        await contract.methods.addIdentity(index, cid, true).send({ from: account });
        console.log(`Identity added: ${index}`);
        loadIdentities();
      } catch (error) {
        console.error('Error adding identity:', error.message);
      }
    } else {
      console.error('Error adding identity: CID not generated');
    }
  };

  // Group identities based on their category
  const groupedIdentities = identities.reduce((groups, identity) => {
    const category = identity.split(' - ')[0]; // identities are categorized with ' - '
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(identity);
    return groups;
  }, {});

  // Toggle visibility of identities under each category
  const [expandedCategory, setExpandedCategory] = useState(null);

  const [originalIdentities, setOriginalIdentities] = useState([]);

  useEffect(() => {
    // Populate original identities list when loading identities
    setOriginalIdentities(identities);
  }, [identities]);

  const getOriginalIndex = (identity, index) => {
    // Find the original index of the identity based on the current index
    console.log(identity);
    console.log(index);
    console.log(identities.findIndex((x) => x === identity));

    return identities.findIndex((_identity) => _identity === identity);
  };

  async function handleClick(index, isVerified) {
    try {
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );
      if (isVerified) {
        const cid = await contract.methods.getCID(index).call({ from: account });
        const target_url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${process.env.PINATA_URL_SECOND}`;
        window.open(target_url, '_blank');
      } else {
        // no action
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Info</h1>
      {loading && <p>Loading...</p>}
      {!loading && Object.keys(groupedIdentities).length === 0 && <p>No identities found.</p>}
      {!loading && Object.keys(groupedIdentities).length > 0 && (
        <div className={styles.tileWrapper}>
          {Object.entries(groupedIdentities).map(([category, identities]) => (
            <div key={category} className={styles.tileWrapper}>
              <h2 className={styles.categoryHeader} onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}>
                {category}
              </h2>
              {expandedCategory === category && (
                <div>
                  {identities.map((identity, index) => (
                    <div key={index} className={styles.identitiesList}>
                      <p className={styles.aligntext} onClick={() => handleClick(getOriginalIndex(identity, index), verificationStatus[getOriginalIndex(identity, index)])}>{identity.includes(' - ') ? identity.split(' - ')[1] : identity}</p>
                      <div className={styles.buttonGroup}>
                        {verificationStatus[getOriginalIndex(identity, index)] ? (
                          <>
                            <button className={styles.buttonAdd} disabled={isUploaderOpen} onClick={() => openFileUploader(getOriginalIndex(identity, index), 0)}>Update</button>
                            <button className={styles.buttonAdd} disabled={isUploaderOpen} onClick={() => handleDelete(getOriginalIndex(identity, index))}>Delete</button>
                          </>
                        ) : (
                          <button className={styles.buttonAdd} disabled={isUploaderOpen} onClick={() => openFileUploader(getOriginalIndex(identity, index), 1)}>Add</button>
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
