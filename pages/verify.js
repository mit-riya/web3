import useSWR from 'swr';
import { useEffect, useState, useRef } from 'react';
import web3 from '../contracts/web3';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

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

const userId = "rec6";

const YourComponent = () => {
  const url = 'http://localhost:3000/api/fetchAll';
  const { data, error } = useSWR(url, fetcher);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [result, setResult] = useState("");
  const [checkboxStates, setCheckboxStates] = useState({}); // New state for checkbox states
  const prevFilteredRequestsLength = useRef(0);

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
    }
  }, [data, userId]);
  const [formData, setFormData] = useState()
  const handleFormSubmit = async (formData, index, checked) => {
    try {

      if(formData.status === "Accepted"){
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
  
            if (checked) {
                const esult = await contract.methods.grantAccess(index).call({ from: userAddress });
                setResult(esult);
                // Call function for checked state
                console.log('Checkbox is checked. Calling Function A.');
                // Replace the following line with the actual function you want to call for checked state
                // FunctionA();
            } else {
                const esult = await contract.methods.verifyIdentity(index).call({ from: userAddress });
                setResult(esult);
    
                // Call function for unchecked state
                console.log('Checkbox is unchecked. Calling Function B.');
                // Replace the following line with the actual function you want to call for unchecked state
                // FunctionB();
            }
  
  
  
        }
        else {
            console.error('MetaMask is not installed');
        }
  
        
      }
      else {
        setResult("");
      }

      console.log(result);
   
      
      formData.response = result;
      console.log(formData);

      const response = await fetch('/api/verifyRequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('PUT request successful');
        mutate();
        // Handle success
      } else {
        console.error('PUT request failed');
        // Handle error
      }
    } catch (error) {
      console.error('Error making PUT request:', error);
    }
  };

  const handleCheckboxChange = (requestId, checked) => {
    // Handle checkbox change, e.g., update formData or perform other actions
    setFormData({ _id: requestId, status: checked ? 'Accepted' : 'Rejected' });
    setCheckboxStates((prevStates) => ({
      ...prevStates,
      [requestId]: checked,
    }));
  };

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>Verification Requests for User {userId}</h1>
      <ul>
        {filteredRequests.map((request) => (
          <li key={request._id}>
            <h3>Status: {request.status}</h3>
            <p>ID: {request._id}</p>
            <p>Details: {fixedIdentities[request.details]}</p>
            <p>Requester ID: {request.requesterId}</p>
            <p>Receiver ID: {request.receiverId}</p>
            <input
              type="checkbox"
              id={`checkbox_${request._id}`}
              onChange={(e) => handleCheckboxChange(request._id, e.target.checked)}
            />
            <label htmlFor={`checkbox_${request._id}`}>Give access</label>
            <button onClick={()=>{
                handleFormSubmit({_id: request._id, status: "Accepted", response: ""}, request.details, checkboxStates[request._id]);
            }}>Accept</button>
            <button onClick={()=>{
                handleFormSubmit({_id: request._id, status: "Rejected", response: ""}, request.details,checkboxStates[request._id]);
            }}>Reject</button>
            {/* Add other properties as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
