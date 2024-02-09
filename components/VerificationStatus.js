import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import web3 from '../contracts/web3';

const ContractDataModal = ({ isOpen, onRequestClose, userAddress, indices }) => {
  const [identityData, setIdentityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
        const myAddress = (await web3.eth.getAccounts())[0];
        const AllIdentities = await contract.methods.getAllIdentities().call({ from: myAddress });

        console.log('userAddress:', userAddress);
        console.log('indices:', indices);

        const data = [];
        for (let i = 0; i < indices.length; i++) {
          const index = indices[i];
          const verificationStatus = await contract.methods.verifyIdentity(userAddress, index).call({ from: myAddress });
          data.push({ identity: AllIdentities[index], verificationStatus });
        }

        setIdentityData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, userAddress, indices]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Verification Status</h2>
      <ul>
        {identityData.map((item, index) => (
          <li key={index}>
            <strong>{item.identity}</strong>: {item.verificationStatus.toString()}
          </li>
        ))}
      </ul>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ContractDataModal;
