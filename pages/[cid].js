/* [cid].js */

import Head from 'next/head'; // Import Head component from Next.js for managing document head
import React, { useRef, useState, useEffect } from 'react'; // Import necessary hooks from React
import mime from 'mime'; // Import mime library for MIME type detection

// Define the default gateway URL
const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL
  ? process.env.NEXT_PUBLIC_GATEWAY_URL
  : "https://gateway.pinata.cloud";

// CID component definition
const CID = ({ fileData }) => {
  // State variables for managing download link and error handling
  const [href, setHref] = useState(""); // State variable for download link
  const downloadRef = useRef(null); // Reference for download link

  // Effect hook to trigger download when href changes
  useEffect(() => {
    if(href) {
      downloadRef.current.click(); // Simulate click on download link
    }
  }, [href]);
  
  // Function to handle file download
  const download = async () => {
    const res = await fetch(`${GATEWAY_URL}/ipfs/${fileData.ipfs_pin_hash}?download=true`); // Fetch file from IPFS gateway    
    const extension = mime.getExtension(res.headers.get('content-type')); // Determine file extension from MIME type
    const blob = await res.blob(); // Convert response to blob

    // Check if the File System Access API is supported
    const supportsFileSystemAccess =
      'showSaveFilePicker' in window &&
      (() => {
        try {
          return window.self === window.top;
        } catch {
          return false;
        }
      })();

    // If the File System Access API is supported…
    if (supportsFileSystemAccess) {
      try {        
        const handle = await showSaveFilePicker({
          suggestedName: `${fileData.ipfs_pin_hash}.${extension}`,
        }); // Prompt user to select download location        
        const writable = await handle.createWritable(); // Create writable stream
        await writable.write(blob); // Write blob data to the stream
        await writable.close(); // Close the stream
        return;
      } catch (err) {        
        if (err.name !== 'AbortError') {
          console.error(err.name, err.message); // Log error details
          const blobUrl = URL.createObjectURL(blob); // Create object URL for blob
          setHref(blobUrl); // Set download link href with object URL  
        }
      }
    }
  }

  // Render the CID component
  return (
    <>
      {/* Head section for managing document head */}
      <Head>
        <title>Simple IPFS</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      {/* Main content of the CID component */}
      <main className="m-auto flex min-h-screen w-full flex-col items-center justify-center">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center bg-cover bg-center">
          <div className="h-full max-w-screen-xl">
            <div className="m-auto flex h-full w-full items-center justify-center">
              <div className="m-auto w-3/4 text-center">
                <h1>Download file</h1>
                <p className="mt-2">
                  Please make sure you trust the source of this link. If you don't know who sent you the link and are unsure what will be downloaded, do not click the download button.
                </p>
                {/* Hidden download link */}
                <a className="hidden" href={href} ref={downloadRef} download={fileData.originalName} />
                {/* File download button */}
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center align-center flex h-64 w-3/4 m-auto flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light">
                  <h2 className="text-3xl">{fileData.metadata.name}</h2>
                  <h3 className="mb-8">{fileData.metadata.keyvalues.description}</h3>
                  <button                    
                    onClick={download}
                    className="underline"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// Server-side function to fetch file data based on CID
export async function getServerSideProps(context) {
  const pinataSDK = require("@pinata/sdk"); // Require Pinata SDK
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT }); // Initialize Pinata SDK instance
  // Fetch data from Pinata API    
  const response = await pinata.pinList(    
    {
      hashContains: context.query.cid
    }
  );
  
  const fileData = response.rows[0]; // Extract file data from response
  return { props: { fileData } } // Return fileData as props
}

export default CID; // Export CID component
