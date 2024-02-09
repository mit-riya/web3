import useSWR, {mutate} from 'swr';
import { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import DataModal from '../components/acceptRequest';
import web3 from '../contracts/web3';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

const userId = "req6";

const YourComponent = () => {
  const [selectedIdentities, setSelectedIdentities] = useState('');
  const url = 'http://localhost:3000/api/fetchAll';
  const { data, error } = useSWR(url, fetcher);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const prevFilteredRequestsLength = useRef(0);
  const [modalOpenState, setModalOpenState] = useState({});

  const toggleModal = (requestId) => {
    setModalOpenState((prevState) => ({
      ...prevState,
      [requestId]: !prevState[requestId],
    }));
    setSelectedIdentities('');
  };

  useEffect(() => {
    if (data) {
      const newFilteredRequests = data.filter((request) => ( request.receiverId === userId && request.status === "Pending"));
      setFilteredRequests(newFilteredRequests);

      // Check for new requests
      if (newFilteredRequests.length > prevFilteredRequestsLength.current) {
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
  }, [data, userId]);
 
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const handleAccept = async (formData) => {

    try {
      
      if (window.ethereum) {
        // const web3 = new Web3(window.ethereum);

        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];
        console.log("user address"); 
        console.log(userAddress);

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
        console.log("user address"); 

        formData.response = formData.response || [];

        const email = await contract.methods.getEmail(formData.requesterId).call({ from: userAddress });
            

      // Use Promise.all to handle asynchronous processing
      await Promise.all(formData.details.map(async (index) => {
        try {
          if (selectedIdentities.includes(index)) {
            const result = await contract.methods.grantAccess(index).call({ from: userAddress });
            // Use spread operator to create a new array
            formData.response = [...formData.response, result];
          } else {
            formData.response = [...formData.response, 'grant not given'];
          }
        } catch (error) {
          console.error('Error processing index:', error);
          // Handle error or append a default value
          formData.response = [...formData.response, 'error processing index'];
        }})).then(() => {
          // Code to execute after all promises inside Promise.all are resolved
          console.log('formData.details:', formData.details);
          console.log('formData.response:', formData.response);
  
          // Make the PUT request
          return fetch('/api/verifyRequest', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
        })
        .then((response) => {
          if (response.ok) {
            console.log('Verification request created successfully');
            
            console.log("email");
            console.log(email);
            mutate(url);
          } else {
            console.error('Failed to create verification request');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
          
      }
      else {
          console.error('MetaMask is not installed');
      }

      
    } catch (error) {
      console.error('Error creating verification request:', error);
    }
    
    setSelectedIdentities('');
  };


  const handleReject = async (formData) => {
    formData.response = [];
    console.log(formData);
    try {

      await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Load the user's Ethereum address
        const userAddress = (await web3.eth.getAccounts())[0];
        console.log("user address"); 
        console.log(userAddress);

        // Load the DigitalIdentity contract using the ABI and contract address
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
        console.log("user address"); 

      
      const response = await fetch('/api/verifyRequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Verification request rejected successfully');
        const email = await contract.methods.getEmail(formData.requesterId).call({ from: userAddress });
        console.log("email");
        console.log(email);

        mutate(url);
        // Handle success, if needed
      } else {
        console.error('Failed to reject verification request');
        // Handle error, if needed
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }

    setSelectedIdentities('');

  }

  return (
    <div>
        <h1>Verify Requests</h1>
      
        <ul>
          {filteredRequests.map((request) => (
            <li key={request._id}>

            <h3>Requested by:  {request.requesterId}</h3>
              
              {/* <button onClick={handleAskCID}>Grant CIDs</button> */}
              <button onClick={() => toggleModal(request._id)}>See details</button>


              {modalOpenState[request._id] && (
          

                <Modal isOpen={modalOpenState[request._id]} key={request._id}>
                  <h2>Choose Identities to grant access</h2>
                  <DataModal
                    options={request.details}
                    selectedValues={selectedIdentities}
                    onChange={setSelectedIdentities}
                  />
                  <button onClick={()=>{
                    handleAccept({_id: request._id, requesterId: request.requesterId, details: request.details, status: "Accepted", response: []});
                }}>Accept</button>
                  <button onClick={()=>{
                    handleReject({_id: request._id, requesterId: request.requesterId, status: "Rejected", response: []});
                }}>Reject</button>
                  <button onClick={() => toggleModal(request._id)}>Cancel</button>
                </Modal>

              )}

            </li>
          ))}

        </ul>
        
    </div>
  );
};

export default YourComponent;