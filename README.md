# Trustfolio

## Introduction
This is a website for automated resume verification while protecting individuals' privacy by leveraging blockchain technology. Our solution involves securely storing and verifying documents, ensuring authenticity without compromising sensitive information. Third parties can access verification status without full document access, along with an option for requesting document access, enhancing privacy and user control. The immutability of blockchain assures trust in the verification process.

## Technologies used

  * Blockchain and smart contract
      * Solidity
      * Web3.js
  * IPFS (InterPlanetary File System)
  * Metamask
  * Next.js
  * MongoDB

## APIs used

  * Nodemailer api for sending email notifications
  * Pinata api for storing files on IPFS
  * OPENAI API for making customised chatbot
        
## Features

### Distributed storage of verified documents

IPFS generates unique hashes for user-uploaded documents, ensuring encryption and privacy. This distributed storage enhances data resilience and accessibility, aligning with our commitment to security and privacy.

### Verification of documents through blockchain

Transactions containing link for the verified documents are added to the blockchain. Recruiters can verify the resume by just checking the status of the document in the blockchain, instead of doing it manually.

### User-centric access control

Recruiters can check verification status directly through the smart contract or request access to full documents. Owners can then accept or reject requests, ensuring privacy and trust in document sharing.

### Email notifications

The blockchain-based verifier sends email notifications to users upon receiving new verification requests, ensuring prompt updates and user engagement.

### AI-supported chatbot assistance

An AI-powered chatbot provides real-time assistance for users navigating the platform, offering instant support and guidance on verification processes and inquiries.

## Demo

## How to run

### Step 1: Clone this repo
Clone this repo using

    git clone https://github.com/mit-riya/web3.git
  
And move to the folder using

    cd web3

### Step 2: Create .env file

    PINATA_JWT={PINATA_API_KEY}
    NEXT_PUBLIC_GATEWAY_URL={GATEWAY_URL}
    OPENAI_API_TOKEN={OPENAI_API_KEY}
    EMAIL = {EMAIL_FOR_SENDING_NOTIFICATIONS}
    EMAIL_PASS = {EMAIL_PASSWORD}
    MODEL_LOCATOR=gpt-3.5-turbo
    MONGODB_URI = {MONGODB_CONNECTION_URL}

### Step 3: Install all dependencies

Install dependencies using

    npm install

### Step 4: Run the project

Start server and client using

    npm run dev
