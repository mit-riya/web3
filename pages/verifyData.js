import useSWR, {mutate} from 'swr';
import { useEffect, useState, useRef } from 'react';
import MultiSelectDropdown from '../components/dropdown';
import Modal from 'react-modal';
import { set } from 'mongoose';
import ContractDataModal from '../components/VerificationStatus';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

const userId = "req10";

const fixedIdentities = [
  "10th Board Certificate",
    "12th Board Certificate",
    "Voter ID",
    "Passport",
    "Bachelors Degree - Tech",
    "Bachelors Degree - Science",
    "Bachelors Degree - Design",
    "Masters Degree - Tech",
    "Masters Degree - Science",
    "Masters Degree - Design",
    "Phd Degree",
    "Courses - Blockchain",
    "Courses - DSA",
    "Courses - Probability",
    "Courses - Machine Learning",
    "Courses - Product Design",
    "Work Experience - Software developer",
    "Work Experience - Data scientist",
    "Work Experience - Product Manager",
    "Work Experience - Team lead",
    "Work Experience - Consultant",
    "Work Experience - Internship",
    "Achievements - Gsoc Contributor",
    "Achievements - Inter IIT Participant",
    "Achievements - KVPY",
    "Achievements - NTSE",
    "Achievements - IMS"
];

const VerifyDataPage = () => {
  const [receiverId, setReceiverId] = useState('');
  const [requesterId, setRequesterId] = useState('');
  const [CIDmodalOpen, setCIDModalOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [contractResultModalOpen, setContractResultModalOpen] = useState(false);
  const [selectedIdentities, setSelectedIdentities] = useState('');
  const url = 'http://localhost:3000/api/fetchAll';
  const { data, error } = useSWR(url, fetcher);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const prevFilteredRequestsLength = useRef(0);

  const handleDirectRequest = () => {
    setSelectedIdentities('');
    setContractModalOpen(true);
  };

  const handleAskCID = () => {
    setSelectedIdentities('');
    setCIDModalOpen(true);
  }

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
    setCIDModalOpen(false);
  };

  const handleSubmitOfContract = () => {
    setContractModalOpen(false);
    const indices = selectedIdentities.map(identity => fixedIdentities.indexOf(identity));

    if (selectedIdentities.length > 0 && receiverId !== '') {
      setContractResultModalOpen(true);
      console.log('Receiver Address:', receiverId);
      console.log('Selected Identities:', indices);
    }
  }

  return (
    <div>
        <h1>Create New Verification Request</h1>
      {/* <form onSubmit={handleSubmit}> */}
        <label>
          Receiver ID:
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </label>
        <br />
        <br />
        <button onClick={handleDirectRequest}>Make Direct Request</button>
        <button onClick={handleAskCID}>Ask for CIDs</button>
        
        <Modal isOpen={contractModalOpen}>
        <h2>Choose Identities for Direct Request from smart contract</h2>
        <MultiSelectDropdown
          options={fixedIdentities}
          selectedValues={selectedIdentities}
          onChange={setSelectedIdentities}
        />
        <button onClick={handleSubmitOfContract}>Submit Request</button>
        <button onClick={() => setContractModalOpen(false)}>Cancel</button>
      </Modal>
      { contractResultModalOpen && <ContractDataModal isOpen={contractResultModalOpen} onRequestClose={() => setContractResultModalOpen(false)} userAddress={receiverId} indices={selectedIdentities.map(identity => fixedIdentities.indexOf(identity))} /> }
      
      {/* Ask CID Modal */}
      <Modal isOpen={CIDmodalOpen}>
        <h2>Choose Identities to Ask for CIDs</h2>
        <MultiSelectDropdown
          options={fixedIdentities}
          selectedValues={selectedIdentities}
          onChange={setSelectedIdentities}
        />
        <button onClick={handleSubmit}>Submit Request</button>
        <button onClick={() => setCIDModalOpen(false)}>Cancel</button>
      </Modal>

        {/* <label>
        Select Identities:
        <MultiSelectDropdown
            options={fixedIdentities}
            selectedValues={selectedIdentities}
            onChange={setSelectedIdentities}
          />
        </label>
        <button type="submit">Submit Request</button> */}
      {/* </form> */}
      {/* <h1>Verification Requests made by User {userId}</h1>
      <ul>
        {filteredRequests.map((request) => (
          <li key={request._id}>
            <h3>Status: {request.status}</h3>
            <p>ID: {request._id}</p>
            <p>Details: {request.details.map(index => fixedIdentities[index]).join(', ')}</p>
            <p>Requester ID: {request.requesterId}</p>
            <p>Receiver ID: {request.receiverId}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default VerifyDataPage;