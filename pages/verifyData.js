import useSWR, {mutate} from 'swr';
import { useEffect, useState, useRef } from 'react';
import MultiSelectDropdown from '../components/dropdown';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

const userId = "req10";

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

const YourComponent = () => {
const [receiverId, setReceiverId] = useState('');
const [requesterId, setRequesterId] = useState('');
  // const [details, setDetails] = useState('');
  const [selectedIdentities, setSelectedIdentities] = useState('');
  const url = 'http://localhost:3000/api/fetchAll';
  const { data, error } = useSWR(url, fetcher);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const prevFilteredRequestsLength = useRef(0);

  useEffect(() => {
    if (data) {
      const newFilteredRequests = data.filter((request) => request.requesterId === userId);
      setFilteredRequests(newFilteredRequests);

      // Check for new requests
      if (newFilteredRequests.length > prevFilteredRequestsLength.current) {
        alert("New Request");
      }

      // Update the previous length
      prevFilteredRequestsLength.current = newFilteredRequests.length;
    }
  }, [data, userId]);
  // const [formData, setFormData] = useState()


  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

//   new request
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRequesterId(userId)
    try {
      const indices = selectedIdentities.map(identity => fixedIdentities.indexOf(identity));
      console.log('Indices:', indices);
      // Map indices to numbers
      const indicesAsNumbers = indices.map(index => Number(index));
      const response = await fetch('/api/newRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requesterId, receiverId, details: indicesAsNumbers}),
      });

      if (response.ok) {
        console.log('Verification request created successfully');
        // mutate(url);
        // Handle success, if needed
      } else {
        console.error('Failed to create verification request');
        // Handle error, if needed
      }
    } catch (error) {
      console.error('Error creating verification request:', error);
    }
  };

  // const handleCheckboxChange = (identity) => {
  //   const index = details.indexOf(identity);
  //   if (index === -1) {
  //     setDetails([...details, identity]);
  //   } else {
  //     setDetails(details.filter(item => item !== identity));
  //   }
  // };

  return (
    <div>
        <h1>Create New Verification Request</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Receiver ID:
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </label>
        <br />
        <label>
        Select Identities:
        <MultiSelectDropdown
            options={fixedIdentities}
            selectedValues={selectedIdentities}
            onChange={setSelectedIdentities}
          />
        </label>
        <br />
        <button type="submit">Submit Request</button>
      </form>
      <h1>Verification Requests made by User {userId}</h1>
      <ul>
        {filteredRequests.map((request) => (
          <li key={request._id}>
            <h3>Status: {request.status}</h3>
            <p>ID: {request._id}</p>
            <p>Details: {request.details.map(index => fixedIdentities[index]).join(', ')}</p>
            <p>Requester ID: {request.requesterId}</p>
            <p>Receiver ID: {request.receiverId}</p>
            {/* Add other properties as needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourComponent;
