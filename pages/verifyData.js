/* verifyData.js */

// Import the necessary libraries and components
import useSWR, { mutate } from 'swr'; // Import SWR for data fetching
import { useEffect, useState, useRef } from 'react'; // Import React hooks
import MultiSelectDropdown from '../components/dropdown'; // Import custom MultiSelectDropdown component
import Modal from 'react-modal'; // Import Modal component
import web3 from '../contracts/web3'; // Import web3 library
import ContractDataModal from '../components/VerificationStatus'; // Import ContractDataModal component
import { useContext } from 'react'; // Import useContext hook
import { UserContext } from './context/userContext'; // Import UserContext from context/userContext
import styles from './../styles/verifyData.module.css'; // Import styles for VerifyDataPage
import Navbar from '@/components/navbar'; // Import Navbar component
import { sendNotification } from '@/lib/api'; // Import sendNotification function from lib/api

// Function to fetch data from the API
const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

// VerifyDataPage Component
const VerifyDataPage = () => {
  // Accessing user account from context
  const { account } = useContext(UserContext);
  const [isDisabled, setIsDisabled] = useState(false); // State to disable the Select button
  const { AllIdentities, loadingAccount } = useContext(UserContext); // Accessing all identities from context
  const [receiverId, setReceiverId] = useState(''); // State for receiver ID
  const [requesterId, setRequesterId] = useState(''); // State for requester ID
  const [CIDmodalOpen, setCIDModalOpen] = useState(false); // State for CID modal
  const [contractModalOpen, setContractModalOpen] = useState(false); // State for contract modal
  const [contractResultModalOpen, setContractResultModalOpen] = useState(false); // State for contract result modal
  const [selectedIdentities, setSelectedIdentities] = useState(''); // State for selected identities
  const url = 'http://localhost:3000/api/fetchAll'; // API URL for data fetching
  const { data, error } = useSWR(url, fetcher); // Fetch data using SWR
  const [filteredRequests, setFilteredRequests] = useState([]); // State for filtered requests
  const prevFilteredRequestsLength = useRef(0); // Reference for previous filtered requests length
  const [filterOption, setFilterOption] = useState('All'); // Initialize filter option state

  // Function to check if a user exists
  const userExists = async (metamaskAddress) => {
    try {
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );
      const flag = await contract.methods.userExists(metamaskAddress).call({ from: account });
      return flag;
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Function to check if receiver Id is same as requester Id`
  const receiverIdSameAsRequesterId = (reciverId) => {
    if (reciverId === account) {
      return true;
    }
    return false;
  };

  // Handle direct request
  const handleDirectRequest = async () => {
    // Check if user exists
    const _userExists = await userExists(receiverId);
    // Check if receiver Id is same as requester Id
    const _receiverIdSameAsRequesterId = receiverIdSameAsRequesterId(receiverId);

    // If receiver Id is same as requester Id, show alert
    if (_receiverIdSameAsRequesterId) {
      alert('You cannot request verification from yourself');
      setReceiverId('');
    }
    else {
      // If user exists, open modal
      if (_userExists) {
        setSelectedIdentities('');
        setContractModalOpen(true);
        setRequesterId(account);
      } else {
        alert('User does not exist');
        setReceiverId('');
      }
    }
  };

  // Handle asking for CID
  const handleAskCID = async () => {
    // Check if user exists
    const _userExists = await userExists(receiverId);
    // Check if receiver Id is same as requester Id
    const _receiverIdSameAsRequesterId = receiverIdSameAsRequesterId(receiverId);

    // If receiver Id is same as requester Id, show alert
    if (_receiverIdSameAsRequesterId) {
      alert('You cannot request verification from yourself');
      setReceiverId('');
    }
    else {
      // If user exists, open modal
      if (_userExists) {
        setSelectedIdentities('');
        setCIDModalOpen(true);
        setRequesterId(account);
      } else {
        alert('User does not exist');
        setReceiverId('');
      }
    }
  };

  // Function to handle click and open URL in a new tab
  async function handleClick(cid) {
    try {
      const target_url = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${process.env.PINATA_URL_SECOND}`;
      window.open(target_url, '_blank');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Effect to filter and check for new requests
  useEffect(() => {
    if (account && data && data.length) {
      const newFilteredRequests = data.filter((request) => request.requesterId === account);
      setFilteredRequests(newFilteredRequests);

      // Check for new requests
      if (newFilteredRequests.length > prevFilteredRequestsLength.current) {
        alert("New Request");
      }

      // Update the previous length
      prevFilteredRequestsLength.current = newFilteredRequests.length;
    }
  }, [data, account]);

  // Disable Select button if no identities are selected
  useEffect(() => {
    if (selectedIdentities.length > 0) {
      setIsDisabled(false);
    }
    else {
      setIsDisabled(true);
    }
  }, [selectedIdentities]);

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  // Function to render the response for an identity
  const renderIdentityResponse = (request) => {
    const { status, response, details } = request;
    if (!details || details.length === 0) {
      return <p>No details provided</p>;
    }

    return details.map((identityIndex, index) => {
      const identity = AllIdentities[identityIndex];
      const [category, name] = identity.split(' - ');
      if (status === 'Accepted') {
        return (
          <div key={index}>
            {name ?
              <div>
                {response[index] === 'Access denied' || response[index] === 'Not verified yet'
                  ?
                  <p className={styles.text2} >{category} - {name} : {response[index]}</p>
                  :
                  <p className={styles.alignLeft}>
                    <p>{category} - {name} : </p>
                    <p className={styles.textCID} onClick={() => handleClick(response[index])}>{response[index]}</p>
                  </p>
                }
              </div>
              :
              <div>
                {response[index] === 'Access denied' || response[index] === 'Not verified yet'
                  ?
                  <p className={styles.text2} >{category} : {response[index]}</p>
                  :
                  <p className={styles.alignLeft}>
                    <p>{category} :</p>
                    <p className={styles.textCID} onClick={() => handleClick(response[index])}> {response[index]}</p>
                  </p>
                }
              </div>
            }
          </div>
        )
      } else {
        return (
          <div key={index}>
            {name ?
              <div>
                <p className={styles.text2} >{category} - {name} : {response[index]}</p>
              </div>
              :
              <div>
                <p className={styles.text2} >{category} : {response[index]}</p>
              </div>
            }
          </div>
        )
      }
    });
  };

  // Function to handle submission of new request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get indices of selected identities
      const indices = selectedIdentities.map(identity => AllIdentities.indexOf(identity));

      // Map indices to numbers
      const indicesAsNumbers = indices.map(index => Number(index));

      // Send a POST request to the API
      const response = await fetch('/api/newRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requesterId, receiverId, details: indicesAsNumbers }),
      });

      if (response.ok) {
        console.log('Verification request created successfully');
        const email = await getEmail(receiverId);
        sendNotification({ to: `${email}`, subject: `Verification request from user ${requesterId}`, text: `Dear user ${receiverId}, \nUser ${requesterId} has requested some verifications from you.\nRegards,\nTeam BlockCV` })
        mutate(url);
        // Handle success, if needed
      } else {
        console.error('Failed to create verification request');
        // Handle error, if needed
      }
    } catch (error) {
      console.error('Error creating verification request:', error);
    }
    setCIDModalOpen(false);
    setReceiverId('');
    setSelectedIdentities('');
  };

  // Handle submission of contract
  const handleSubmitOfContract = () => {
    setContractModalOpen(false);
    if (selectedIdentities.length > 0 && receiverId !== '') {
      setContractResultModalOpen(true);
    }
  }

  // Close contract result modal
  const closeResultContractModal = () => {
    setContractResultModalOpen(false);
    setReceiverId('');
    setSelectedIdentities('');
  }

  // Function to get email from smart contract
  const getEmail = async (metamaskAddress) => {
    try {
      const contract = new web3.eth.Contract(
        process.env.CONTRACT_ABI,
        process.env.CONTRACT_ADDRESS
      );
      const email = await contract.methods.getEmail(metamaskAddress).call({ from: account });
      return email;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Function to filter past requests based on status
  const filterPastRequests = () => {
    if (filterOption === 'All') {
      return filteredRequests; // Return all requests if 'All' is selected
    } else {
      return filteredRequests.filter(request => request.status === filterOption); // Filter requests based on status
    }
  };
  if (loadingAccount) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.heading}>New Verification Request</h1>
      <div className={styles.container2}>

        <div className={styles.alignlabel}>
          <label className={styles.label}>
            Receiver ID:
            <input
              className={styles.input}
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            />
          </label>
        </div>

        <div className={styles.container3}> </div>
        <div className={styles.container3}> </div>

        <div className={styles.buttonWrapper}>
          <>
            <button className={styles.button} onClick={handleDirectRequest}>Check</button>
            <button className={styles.button} onClick={handleAskCID}>Request CIDs</button>
          </>
        </div>

      </div>
      <Modal isOpen={contractModalOpen} className={styles.modalcontent} style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5', // Background color with opacity
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          padding: '20px', // Padding of the modal content
          width: '60%', // Set the width of the modal
          height: '60%', // Set the height of the modal
          margin: '20vh 20vw', // Center the modal horizontally
          background: '#1F2833', // Background color of the modal content
          borderRadius: '8px', // Rounded corners of the modal content
          border: '1px solid #ccc', // Border of the modal content
          overflowX: 'hidden', // Allow the modal content to scroll if needed
        }

      }}>
        <h2 className={styles.text3}>Choose Documents for Verification Request</h2>
        <MultiSelectDropdown
          options={AllIdentities}
          selectedValues={selectedIdentities}
          onChange={setSelectedIdentities}
        />
        <div className={styles.alignRight}>
          <button className={styles.buttonModal} disabled={isDisabled} onClick={handleSubmitOfContract}>Submit</button>
          <button className={styles.buttonModal} onClick={() => setContractModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
      {contractResultModalOpen && <ContractDataModal isOpen={contractResultModalOpen} onRequestClose={closeResultContractModal} userAddress={receiverId} indices={selectedIdentities.map(identity => AllIdentities.indexOf(identity))} />}

      {/* Ask CID Modal */}
      <Modal isOpen={CIDmodalOpen} className={styles.modalcontent} style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5', // Background color with opacity
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          padding: '20px', // Padding of the modal content
          width: '60%', // Set the width of the modal
          height: '60%', // Set the height of the modal
          margin: '20vh 20vw', // Center the modal horizontally
          background: '#1F2833', // Background color of the modal content
          borderRadius: '8px', // Rounded corners of the modal content
          border: '1px solid #ccc', // Border of the modal content
          overflowX: 'hidden', // Allow the modal content to scroll if needed
        }

      }}>
        <h2 className={styles.text3}>Choose Identities to Ask for CIDs</h2>
        <MultiSelectDropdown
          options={AllIdentities}
          selectedValues={selectedIdentities}
          onChange={setSelectedIdentities}
        />
        <div className={styles.alignRight}>
          <button className={styles.buttonModal} disabled={isDisabled} onClick={handleSubmit}>Submit</button>
          <button className={styles.buttonModal} onClick={() => setCIDModalOpen(false)}>Cancel</button>
        </div>
      </Modal>

      <div >
        <h1 className={styles.heading2}>Past Requests: </h1>
        {/* Filter dropdown */}
        <div className={styles.filter}>
          <label>Filter by Status:</label>
          <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
            <option value="All" className={styles.option} >All</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className={styles.alignCenter}>
        <ul>
          {filterPastRequests().map((request) => (

            <li key={request._id} >
              <div className={styles.tileWrapper}>
                <div className={styles.alignTopDown}>
                  <div className={styles.aligntext}>
                    <h3 className={styles.text1}>
                      Status :
                    </h3>
                    {request.status === 'Accepted' ?
                      <p className={styles.text2} style={{ color: 'green' }}>{request.status}</p>
                      : <p></p>}
                    {request.status === 'Rejected' ?
                      <p className={styles.text2} style={{ color: 'red' }}>{request.status}</p>
                      : <p></p>}
                    {request.status === 'Pending' ?
                      <p className={styles.text2} style={{ color: 'yellow' }}>{request.status}</p>
                      : <p></p>}
                  </div>

                  <div className={styles.aligntext}>
                    <h3 className={styles.text1}>
                      Receiver ID :
                    </h3>
                    <p className={styles.text2}>{request.receiverId}</p>
                  </div>
                  <div className={styles.container3}> </div>
                  <div className={styles.aligntext}>
                    <strong className={styles.text1}>Requested Identities</strong>
                  </div>
                  <div className={styles.aligntext}>
                    <div>{renderIdentityResponse(request)}</div>
                  </div>
                </div>
                <br />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VerifyDataPage;