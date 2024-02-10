/* VerificationStatus.js is a component that displays the verification status of user identities. It fetches the verification status from the blockchain and displays it in a modal. */

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import web3 from '../contracts/web3';
import styles from './../styles/modal.module.css';
import { useContext } from 'react';
import { UserContext } from './../pages/context/userContext';

// Component to display verification status of user identities
const ContractDataModal = ({ isOpen, onRequestClose, userAddress, indices }) => {
    // Accessing user identities from context
    const { AllIdentities } = useContext(UserContext);
    
    // Accessing the user account from context
    const { account } = useContext(UserContext);

    // State to store identity data
    const [identityData, setIdentityData] = useState([]);

    // Effect to fetch data when the modal is opened
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Creating a contract instance
                const contract = new web3.eth.Contract(process.env.CONTRACT_ABI, process.env.CONTRACT_ADDRESS);
                
                // Fetching verification status for each identity index
                const data = [];
                for (let i = 0; i < indices.length; i++) {
                    const index = indices[i];
                    const verificationStatus = await contract.methods.verifyReceiverIdentity(userAddress, index).call({ from: account });
                    data.push({ identity: AllIdentities[index], verificationStatus });
                }

                // Updating the state with fetched data
                setIdentityData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Fetch data when the modal is opened
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, userAddress, indices]);

    return (
        <div className={styles.container}>
            
            <Modal isOpen={isOpen} className={styles.modalcontent} style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5', // Background color with opacity
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                content: {
                    padding: '20px', 
                    width: '60%', 
                    height: '60%',
                    margin: '20vh 20vw', 
                    background: '#1F2833', 
                    borderRadius: '8px', 
                    border: '1px solid #ccc', 
                    overflowX: 'hidden',
                }

            }}>
                <h2 className={styles.heading1}>
                    Verification Status
                </h2>
                <div className={styles.container3}> </div>
                    {/* List to display identity verification status */}
                <ul>
                    {identityData.map((item, index) => (
                        <li key={index} className={styles.alignLeft}>
                            <strong className={styles.text1}>{item.identity} : </strong>
                            {/* Displaying verification status in green if true, red if false */}
                            {item.verificationStatus.toString() === 'true' ? <p className={styles.text2} style={{ color: 'green' }}>Verified</p> : <p className={styles.text2} style={{ color: 'red' }}>Not Verified</p>}
                        </li>
                    ))}
                </ul>
                
                {/* Close button */}
                <div className={styles.alignRight}>
                    <button className={styles.buttonModal} onClick={onRequestClose}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default ContractDataModal;
