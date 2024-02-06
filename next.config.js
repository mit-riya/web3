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
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "name": "identityTypeToId",
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
      }
    ],
    CONTRACT_ADDRESS: "0x75d7a07fd06f595305bd68d5a273349c1f3e7930",
  },
};