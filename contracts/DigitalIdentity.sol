// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract DigitalIdentity {

    string[] public AllIdentities;  // All Identities list
    bool[] public VerificationStatus;   // Verification Statuses list
    address[] public metamaskAddresses; // metamask address of user
    mapping(address => Identity[]) public userAccounts; // mapping of user address to identity

    mapping(address => string) public emailID;  // mapping of user address to email
    
    // struct Identity
    struct Identity {
        address _id;    // user address
        uint _certificateType;  // ceritificate type to indicate the type of certificate
        string _cid;    // cid if the document is stored in IPFS
        bool _isVerified;   // verified status - true or false
    }

   // constructor called
    constructor() {
        setAllIdentities(); // call setAllIdentities function
        setVerificationStatus(27);  // call setVerificationStatus function
    }

    // function to set all identities
    function setAllIdentities() public {

        AllIdentities.push("10th Board Certificate"); // 0

        AllIdentities.push("12th Board Certificate"); // 1

        AllIdentities.push("Voter Id");  // 2

        AllIdentities.push("Passport");  // 3

        AllIdentities.push("Bachelor's Degree - Technology"); // 4
        AllIdentities.push("Bachelor's Degree - Science"); // 4
        AllIdentities.push("Bachelor's Degree - Design"); // 4

        AllIdentities.push("Master's Degree - Technology"); // 5
        AllIdentities.push("Master's Degree - Science"); // 5
        AllIdentities.push("Master's Degree - Design"); // 5

        AllIdentities.push("Phd Degree - Science"); // 6
        AllIdentities.push("Phd Degree - Humanities"); // 6
        AllIdentities.push("Phd Degree - Commerce"); // 6
        AllIdentities.push("Phd Degree - Management"); // 6
        AllIdentities.push("Phd Degree - Law"); // 6

        AllIdentities.push("Courses Taken - Blockchain");   // 7
        AllIdentities.push("Courses Taken - Data Structures & Algorithms");   // 7
        AllIdentities.push("Courses Taken - Probability & Statistics");   // 7
        AllIdentities.push("Courses Taken - Machine Learning");   // 7
        AllIdentities.push("Courses Taken - Product Design");   // 7

        AllIdentities.push("Work Experience - Software Developer"); // 8
        AllIdentities.push("Work Experience - Data Scientist"); // 8
        AllIdentities.push("Work Experience - Product Manager"); // 8
        AllIdentities.push("Work Experience - Consultant"); // 8
        AllIdentities.push("Work Experience - Internship"); // 8

        AllIdentities.push("Achievements - GSoC Contributor");  // 9
        AllIdentities.push("Achievements - Inter IIT Paticipant");  // 9
        AllIdentities.push("Achievements - Institute Merit Scholar");  // 9
        AllIdentities.push("Achievements - KVPY");  // 9
        AllIdentities.push("Achievements - NTSE");  // 9
    }

    // funtion to set initial verification status array to false
    function setVerificationStatus(uint256 size) public {
        for(uint256 i = 0; i < size; i++) {
            VerificationStatus.push(false);
        }
    }

    // function to fetch all identities
    function getAllIdentities() public view returns(string[] memory) {
        return AllIdentities;
    }

    // function to fetch Verification Status array
    function getVerificationStatus() public returns(bool[] memory) {
        for (uint i = 0; i < userAccounts[msg.sender].length; i++) {
            if (userAccounts[msg.sender][i]._isVerified == true) {
                VerificationStatus[userAccounts[msg.sender][i]._certificateType] = true;
            }
        }
        return VerificationStatus;
    }

    // function to store user email in blockchain
    function addEmail (string memory email) public { 
        emailID[msg.sender]=email;
        metamaskAddresses.push(msg.sender);
    }

    // function to fetch user email
    function getEmail(address addr) public view returns (string memory) {
        return emailID[addr];
    }

    // function to fetch CID
    function getCID(uint index) public view returns (string memory _cid) {
        for(uint i = 0; i < 27; i++){
            if(userAccounts[msg.sender][i]._certificateType == index) {
                return userAccounts[msg.sender][i]._cid;
            }
        }
        return "";
    }

    // New function to retrieve identities
    function getIdentitiesByAccount() public view returns (string[] memory) {
        Identity[] storage userIdentities = userAccounts[msg.sender];
        string[] memory result = new string[](userIdentities.length);

        for (uint i = 0; i < userIdentities.length; i++) {
            result[i] = userIdentities[i]._cid;
        }
        return result;
    }

    // function to add Identity to blockchain
    function addIdentity(uint _certificateType, string memory _cid, bool _isVerified) public {
        address userAccount = msg.sender;
        // Store the MetaMask account address associated with the user's identities
        userAccounts[userAccount].push(Identity(
            userAccount,    // address
            _certificateType,   // document type
            _cid,   // cid from IPFS (or null otherwise)
            _isVerified // verified or not (true or false)
        ));
    }

    // function to update Identity if already exists
    function updateIdentity(uint _certificateType, string memory _cid, bool _isVerified) public {
        uint i = getIndex(_certificateType);    // get index
        userAccounts[msg.sender][i]._cid = _cid;    // update CID
        userAccounts[msg.sender][i]._isVerified = _isVerified;  // update verification status
    }

    // function to get index of the document type
    function getIndex(uint _certificateType) public view returns (uint) {
        for (uint i = 0; i < userAccounts[msg.sender].length; i++) {
            // match document type
            if (userAccounts[msg.sender][i]._certificateType == _certificateType) {
                return i;
            }
        }
        return 10000;
    }

    // function to remove an Item
    function removeItem(uint256 _index) public {
        require(_index < userAccounts[msg.sender].length, "Index out of bounds");

        // Move the last element to the position of the element to be removed
        userAccounts[msg.sender][_index] = userAccounts[msg.sender][userAccounts[msg.sender].length - 1];
        // Remove the last element
        userAccounts[msg.sender].pop();
    }

    // function to delete Identity
    function deleteIdentity(uint _certificateType) public {
        uint index = getIndex(_certificateType);    // fetch index
        removeItem(index);  // call remove function
    }

    // function to check if user exists
    function userExists (address metamaskAddress) public view returns (bool) {
        for(uint i=0;i<metamaskAddresses.length;i++){
            if(metamaskAddresses[i] == metamaskAddress) {
                return true;
            }
        }
        return false;
    }

    // function to verify Identity of sender
    function verifyIdentity(address _id, uint _certificateType) public view returns (bool) {
        uint i = getIndex(_certificateType);
        if (i == 10000) {
            return false;
        }
        return userAccounts[_id][i]._isVerified;
    }

    // function to verify Identity of receiver 
    function verifyReceiverIdentity(address _id, uint _certificateType) public view returns (bool) {
        for(uint i = 0; i < userAccounts[_id].length; i++) {
            if(userAccounts[_id][i]._certificateType == _certificateType) {
                return userAccounts[_id][i]._isVerified;
            }
        }
        return false;
    }

    // function to grant access to the receiver
    function grantAccess(uint _certificateType) public view returns (string memory) {
        // require(msg.sender == _id, "scanj");
        uint i = getIndex(_certificateType);
        if (i == 10000) {
            return "Not verified yet";
        }
        return userAccounts[msg.sender][i]._cid;
    }
    
}