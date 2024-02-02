import useSWR from 'swr';
import { useEffect, useState, useRef } from 'react';

const fetcher = async (url) => {
  const response = await fetch(url);
  console.log('Response:', response);
  return response.json();
};

const userId = "rec6";

const YourComponent = () => {
  const url = 'http://localhost:3000/api/fetchAll';
  const { data, error } = useSWR(url, fetcher);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const prevFilteredRequestsLength = useRef(0);

  useEffect(() => {
    if (data) {
      const newFilteredRequests = data.filter((request) => request.receiverId === userId);
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

  return (
    <div>
      <h1>Verification Requests for User {userId}</h1>
      <ul>
        {filteredRequests.map((request) => (
          <li key={request._id}>
            <h3>Status: {request.status}</h3>
            <p>Details: {request.details}</p>
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
