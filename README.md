## Trustfolio

This is a website for secure document verification while protecting individuals' privacy, and also leveraging blockchain technology. Our solution involves securely storing and verifying documents, ensuring authenticity without compromising sensitive information. Third parties can access verification status without full document access, along with an option for requesting document access, enhancing privacy and user control. The immutability of blockchain assures trust in the verification process, providing a reliable solution for identity verification while safeguarding personal data.

### How to run

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
