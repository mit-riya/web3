/* FileUploader.js : Component to upload files with verification and CID display */

import { useState, useRef } from "react";
import { VerifyIdentity } from "./Verify";

// FileUploader Component: Allows users to upload files with verification and CID display
const FileUploader = ({ identityType, onClose, handleAddOrUpdate }) => {
  // State variables
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "" });
  const inputFile = useRef(null);

  // Function to handle file upload
  const uploadFile = async (e) => {
    try {
      e.preventDefault();
      setUploading(true);

      // Verify the identity type before proceeding
      const isVerified = VerifyIdentity(identityType);
      if (!isVerified) {
        throw new Error("File cannot be verified.");
      }

      // Check if the name field is empty
      if (!form.name) {
        throw new Error("Name field cannot be empty.");
      }

      // Create FormData object to send file and name
      const formData = new FormData();
      formData.append("file", file, { filename: file.name });
      formData.append("name", form.name);

      // Make a POST request to the server with the file
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      // Check if the response is OK
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Get the CID from the response
      const ipfsHash = await res.text();

      // Update the CID state and reset form values
      setCid(ipfsHash);
      setUploading(false);
      setForm({ name: "" });
      setFile("");
    } catch (error) {
      console.error(error);

      // Reset form values if the name is present
      if (form.name) {
        setForm({ name: "" });
        setFile("");
      }

      // Handle specific error cases and show alerts
      if (error instanceof TypeError || error.message === 'Failed to fetch') {
        alert("Unable to connect to the server. Please check your internet connection or try again later.");
      } else if (error.message === "Name field cannot be empty.") {
        alert("Name field cannot be empty");
      } else if (error.message === "File cannot be verified.") {
        alert("File cannot be verified.");
      } else {
        alert("Trouble uploading file. Please try again.");
      }

      // Reset the uploading state
      setUploading(false);
    }
  };

  // Function to handle file change
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle CID
  const handleCID = (cid) => {
    handleAddOrUpdate(identityType, cid);
    onClose();
  }

  // Render the FileUploader component
  return (
    <>
      {/* Modal overlay */}
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-gray-900 text-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Upload File</h1>
            <button className="p-2 rounded-full hover:bg-gray-700" onClick={onClose}>
              {/* Close button icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <input
            type="file"
            id="file"
            ref={inputFile}
            onChange={handleChange}
            className="hidden"
          />
          <div className="mt-8 flex flex-col items-center justify-center bg-gray-800 p-6 rounded-lg">
            {/* File selection button */}
            <button
              disabled={uploading}
              onClick={() => inputFile.current.click()}
              className="py-4 px-8 bg-blue-500 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out "
              style={{backgroundColor:'#66FCF1', color:'#1F2833'}}
            >
              {uploading ? "Uploading..." : (file ? `Selected file: ${file.name}` : "Select a file")}
            </button>
          </div>
          {file && (
            // File upload form
            <form onSubmit={uploadFile} className="mt-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                {/* Name input field */}
                <input
                  type="text"
                  id="name"
                  style={{ color: 'black' }} 
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Name"
                />
              </div>
              {/* Submit button for file upload */}
              <button
                type="submit"
                className="mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-blue-600"
              >
                Upload
              </button>
            </form>
          )}
          {cid && (
            // Display CID and done button
            <div className="mt-4">
              <p className="text-green-500">File successfully uploaded!!</p>
              <button
                onClick={() => handleCID(cid)}
                className="mt-2 py-2 px-4 bg-blue-500 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploader;
