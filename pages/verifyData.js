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
    setRequesterId(userId);
  };

  const handleAskCID = () => {
    setSelectedIdentities('');
    setCIDModalOpen(true);
    setRequesterId(userId);
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

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  // Function to render the response for an identity
  const renderIdentityResponse = (request) => {
    const { status, response, details } = request;
    if (!details || details.length === 0) {
      return <p>No details provided</p>;
    }
    console.log('Details:', details);
    console.log('Response:', response);
    return details.map((identityIndex, index) => {
      const identity = fixedIdentities[identityIndex];
      const [category, name] = identity.split(' - ');
      if (status === 'Accepted') {
      return (
        <div key={index}>
          {name?
          <div>
            <p><strong>{category}</strong></p>
            <p>{name}: {response[index]}</p>
          </div>
            :
            <p>{category}: {response[index]}</p>
          }
        </div>
      )
      } else {
        return (
          <div key={index}>
          {name ?
          <div>
            <p><strong>{category}</strong></p>
            <p>{name}</p>
          </div>
            :
            <p>{category}</p>
          }
        </div>
        )
      }
  });
  };

//   new request

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setRequesterId(userId)
    try {
      console.log('Selected Identities:', selectedIdentities);
      const indices = selectedIdentities.map(identity => fixedIdentities.indexOf(identity));
      console.log('Indices:', indices);
      // Map indices to numbers
      const indicesAsNumbers = indices.map(index => Number(index));
      console.log('Indices as numbers:', indicesAsNumbers);
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
    setReceiverId('');
    setSelectedIdentities('');
  };

  const handleSubmitOfContract = () => {
    setContractModalOpen(false);
    // const indices = selectedIdentities.map(identity => fixedIdentities.indexOf(identity));
    // console.log('Indices:', indices);
    console.log('Selected Identities:', selectedIdentities);
    if (selectedIdentities.length > 0 && receiverId !== '') {
      setContractResultModalOpen(true);
      console.log('Receiver Address:', receiverId);
      // console.log('Selected Identities:', indices);
    }
  }

  const closeResultContractModal = () => {
    setContractResultModalOpen(false);
    setReceiverId('');
    setSelectedIdentities('');
  }

  return (
    <div>
        <h1>Create New Verification Request</h1>
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
      { contractResultModalOpen && <ContractDataModal isOpen={contractResultModalOpen} onRequestClose={closeResultContractModal} userAddress={receiverId} indices={selectedIdentities.map(identity => fixedIdentities.indexOf(identity))} /> }
      
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

      <h1>Verification Requests made by User {userId}</h1>
      <ul>
        {filteredRequests.map((request) => (
          <li key={request._id}>
            <h3>Status: {request.status}</h3>
            <p>ID: {request._id}</p>
            {/* <p>Requester ID: {request.requesterId}</p> */}
            <p>Receiver ID: {request.receiverId}</p>
            <div>
              <strong>Requested Identities:</strong>
              {renderIdentityResponse(request)}
            </div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifyDataPage;