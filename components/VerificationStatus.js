import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import web3 from '../contracts/web3';
import styles from './../styles/modal.module.css';

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
        <div className={styles.container}>
            <Modal isOpen={isOpen} className={styles.modalcontent} style={{
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
                <h2 className={styles.heading1}>Verification Status</h2>
                <div className={styles.container3}> </div>
                <ul>
                    {identityData.map((item, index) => (
                        <li key={index} className={styles.alignLeft}>
                            <strong className={styles.text1}>{item.identity} : </strong>
                            {item.verificationStatus.toString() === 'true' ? <p className={styles.text2} style={{ color: 'green' }}>Verified</p> : <p className={styles.text2} style={{ color: 'red' }}>Not Verified</p>}
                        </li>
                    ))}
                </ul>
                <div className={styles.alignRight}>
                    <button className={styles.buttonModal} onClick={onRequestClose}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default ContractDataModal;
