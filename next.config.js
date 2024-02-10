// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
// next.config.js
module.exports = {
  env: {
    CONTRACT_ABI: [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "email",
            "type": "string"
          }
        ],
        "name": "addEmail",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_cid",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "_isVerified",
            "type": "bool"
          }
        ],
        "name": "addIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          }
        ],
        "name": "deleteIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getVerificationStatus",
        "outputs": [
          {
            "internalType": "bool[]",
            "name": "",
            "type": "bool[]"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_index",
            "type": "uint256"
          }
        ],
        "name": "removeItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "setAllIdentities",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "size",
            "type": "uint256"
          }
        ],
        "name": "setVerificationStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_cid",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "_isVerified",
            "type": "bool"
          }
        ],
        "name": "updateIdentity",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "AllIdentities",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "emailID",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllIdentities",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "getCID",
        "outputs": [
          {
            "internalType": "string",
            "name": "_cid",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "getEmail",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getIdentitiesByAccount",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          }
        ],
        "name": "getIndex",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          }
        ],
        "name": "grantAccess",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "metamaskAddresses",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "userAccounts",
        "outputs": [
          {
            "internalType": "address",
            "name": "_id",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_cid",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "_isVerified",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "metamaskAddress",
            "type": "address"
          }
        ],
        "name": "userExists",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "VerificationStatus",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_id",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          }
        ],
        "name": "verifyIdentity",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_id",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_certificateType",
            "type": "uint256"
          }
        ],
        "name": "verifyReceiverIdentity",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    CONTRACT_ADDRESS: "0xa1c3d7d19ed1cfc5bdfa03d4f1dc652c8cad1a84",
    PINATA_URL_SECOND: "E6Gk5eF8TJOPMEJLJeN1MgR-6SVCBarJ8hvWcbo8RksJPp0mi1nt8bqiFzXSHv4C",
  },
};