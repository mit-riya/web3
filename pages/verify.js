import useSWR, {mutate} from 'swr';
import { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import DataModal from '../components/acceptRequest';
import web3 from '../contracts/web3';
import styles from './../styles/verify.module.css';
import Navbar from '@/components/navbar';
import { useContext } from 'react';
import { UserContext } from './context/userContext';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

const YourComponent = () => {
  const [selectedIdentities, setSelectedIdentities] = useState('');
  const url = 'http://localhost:3000/api/fetchAll';
  const { data, error } = useSWR(url, fetcher);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const prevFilteredRequestsLength = useRef(0);
  const [modalOpenState, setModalOpenState] = useState({});
  const { account } = useContext(UserContext);

  const toggleModal = (requestId) => {
    setModalOpenState((prevState) => ({
      ...prevState,
      [requestId]: !prevState[requestId],
    }));
    setSelectedIdentities('');
  };

  useEffect(() => {
    if (account && data && data.length) {
      const newFilteredRequests = data.filter((request) =>( request.receiverId === account && request.status === "Pending"));
      setFilteredRequests(newFilteredRequests);

      // Check for new requests
      if (newFilteredRequests.length > prevFilteredRequestsLength.current && (prevFilteredRequestsLength.current != 0 || newFilteredRequests.length == 1)) {
        alert("New Request");
      }

      // Update the previous length
      prevFilteredRequestsLength.current = newFilteredRequests.length;

      const newModalOpenState = {};
      filteredRequests.forEach((request) => {
        newModalOpenState[request._id] = modalOpenState[request._id] || false;
      });
      setModalOpenState(newModalOpenState);

    }
  }, [data, account]);
 
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const handleAccept = async (formData) => {
    try {
      if (window.ethereum) {
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);

        const email = await contract.methods.getEmail(formData.requesterId).call({ from: account });
        console.log(email);

        // Use Promise.all to handle asynchronous processing
        await Promise.all(formData.details.map(async (option,index) => {
          try {
            if (selectedIdentities.includes(option)) {
              const result = await contract.methods.grantAccess(option).call({ from: account });
              // Use spread operator to create a new array
              formData.response[index] = result;
            } else {
              formData.response[index] = 'Access denied';
            }
          } catch (error) {
            console.error('Error processing index:', error);
            // Handle error or append a default value
            formData.response = [...formData.response, 'error processing index'];
          }
        })).then(() => {
          
          // Make the PUT request
          return fetch('/api/verifyRequest', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        }).then((response) => {
          if (response.ok) {
            console.log('Verification request created successfully');
            
            setModalOpenState((prevState) => ({
              ...prevState,
              [formData._requestId]: !prevState[formData._requestId],
            }));
            mutate(url);

          } else {
            console.error('Failed to create verification request');
          }
        }).catch((error) => {
          console.error('Error:', error);
        });
          
      } else {
          console.error('MetaMask is not installed');
      } 
    } catch (error) {
      console.error('Error creating verification request:', error);
    }
    
    setSelectedIdentities('');
  };


  const handleReject = async (formData) => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Load the DigitalIdentity contract using the ABI and contract address
      const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
        
      const response = await fetch('/api/verifyRequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Verification request rejected successfully');
        const email = await contract.methods.getEmail(formData.requesterId).call({ from: account });
        mutate(url);
        
        console.error('Failed to reject verification request');
        
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }

    setSelectedIdentities('');
  }

  return (
    <div className={styles.container}>
      <Navbar/>
        <h1 className={styles.heading}>
          Verify Requests
        </h1>

        <div className={styles.alignCenter}>
          <ul>
            {filteredRequests.map((request) => (

              <li key={request._id}>
              <div className={styles.tileWrapper}>
                <div>
                  <h3 className={styles.text1}>Requested by: </h3>
                  <h3 className={styles.text2}> {request.requesterId}</h3>
                </div>
                
                <div>
                  <button className={styles.button} onClick={() => toggleModal(request._id)}>See details</button>
                </div>

                {modalOpenState[request._id] && (
          

                  <Modal isOpen={modalOpenState[request._id]} key={request._id}  className={styles.modalcontent} style={{
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
                    <h2 className={styles.text3}>
                      Choose Identities to grant access
                    </h2>
                    <DataModal
                      options={request.details}
                      selectedValues={selectedIdentities}
                      onChange={setSelectedIdentities}
                    />
                    <div className={styles.buttonGroup}>
                      <button className={styles.buttonModal} onClick={()=>{
                        handleAccept({_id: request._id, requesterId: request.requesterId, details: request.details, status: "Accepted", response: []});
                      }}>Accept</button>
                      
                      <button className={styles.buttonModal} onClick={()=>{
                        handleReject({_id: request._id, requesterId: request.requesterId, status: "Rejected", response: []});
                      }}>Reject</button>
                      
                      <button className={styles.buttonModal} onClick={() => toggleModal(request._id)}>Cancel</button>

                    </div>
                  </Modal>

                )}
              </div>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
};

export default YourComponent;