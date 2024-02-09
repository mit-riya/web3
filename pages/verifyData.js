import useSWR, { mutate } from 'swr';
import { useEffect, useState, useRef, useId } from 'react';
import MultiSelectDropdown from '../components/dropdown';
import Modal from 'react-modal';
import { set, syncIndexes } from 'mongoose';
import ContractDataModal from '../components/VerificationStatus';
import { useContext } from 'react';
import { UserContext } from './context/userContext';
import styles from './../styles/verifyData.module.css';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

const VerifyDataPage = () => {
  const { account } = useContext(UserContext);
  const userId = account.toString();
  const { AllIdentities } = useContext(UserContext);
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
      const identity = AllIdentities[identityIndex];
      const [category, name] = identity.split(' - ');
      if (status === 'Accepted') {
        return (
          <div key={index}>
            {name ?
              <div>
                <p className={styles.text2}>{category} - {name} : {response[index]}</p>
              </div>
              :
              <p className={styles.text2}>{category} : {response[index]}</p>
            }
          </div>
        )
      } else {
        return (
          <div key={index}>
            {name ?
              <div>
                <p className={styles.text2}>{category} - {name} : </p>
              </div>
              :
              <p className={styles.text2}>{category} : </p>
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
      const indices = selectedIdentities.map(identity => AllIdentities.indexOf(identity));
      console.log('Indices:', indices);
      // Map indices to numbers
      const indicesAsNumbers = indices.map(index => Number(index));
      console.log('Indices as numbers:', indicesAsNumbers);
      const response = await fetch('/api/newRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requesterId, receiverId, details: indicesAsNumbers }),
      });

      if (response.ok) {
        console.log('Verification request created successfully');
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

  const handleSubmitOfContract = () => {
    setContractModalOpen(false);
    // const indices = selectedIdentities.map(identity => AllIdentities.indexOf(identity));
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
    <div className={styles.container}>
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
      <Modal isOpen={contractModalOpen}>
        <h2>Choose Identities for Direct Request from smart contract</h2>
        <MultiSelectDropdown
          options={AllIdentities}
          selectedValues={selectedIdentities}
          onChange={setSelectedIdentities}
        />
        <button onClick={handleSubmitOfContract}>Submit Request</button>
        <button onClick={() => setContractModalOpen(false)}>Cancel</button>
      </Modal>
      {contractResultModalOpen && <ContractDataModal isOpen={contractResultModalOpen} onRequestClose={closeResultContractModal} userAddress={receiverId} indices={selectedIdentities.map(identity => AllIdentities.indexOf(identity))} />}

      {/* Ask CID Modal */}
      <Modal isOpen={CIDmodalOpen}>
        <h2>Choose Identities to Ask for CIDs</h2>
        <MultiSelectDropdown
          options={AllIdentities}
          selectedValues={selectedIdentities}
          onChange={setSelectedIdentities}
        />
        <button onClick={handleSubmit}>Submit Request</button>
        <button onClick={() => setCIDModalOpen(false)}>Cancel</button>
      </Modal>

      <h1 className={styles.heading2}>Past Requests: </h1>
      <div className={styles.alignCenter}>
        <ul>
          {filteredRequests.map((request) => (
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