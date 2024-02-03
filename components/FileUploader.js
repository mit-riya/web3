import { useState, useRef } from "react";
import Head from "next/head";
import Files from "@/components/Files";
import { VerifyIdentity } from "./Verify";
import { on } from "form-data";

const FileUploader = ({ identityType, onClose, handleAddOrUpdate }) => {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
  });

  const inputFile = useRef(null);

  const uploadFile = async (e) => {
    try {
      e.preventDefault();
      setUploading(true);
      const isVerified = VerifyIdentity(identityType);
      if (!isVerified) {
        throw new Error("File cannot be verified.");
      }
      if (!form.name) {
        throw new Error("Name field cannot be empty.");
      }
      const formData = new FormData();
      formData.append("file", file, { filename: file.name });
      formData.append("name", form.name);

      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const ipfsHash = await res.text();
      console.log("ipfsHash: ", ipfsHash);

      setCid(ipfsHash);

      setUploading(false);
      setForm({
        name: "",
      });
      setFile("");
    } catch (error) {
      console.error(error);
      if (form.name) {
        setForm({
          name: "",
        });
        setFile("");
      }
      if (error instanceof TypeError || error.message === 'Failed to fetch') {
        alert("Unable to connect to the server. Please check your internet connection or try again later.");
      } else if (error.message === "Name field cannot be empty.") {
        alert("Name field cannot be empty");
      } else if (error.message === "File cannot be verified.") {
        alert("File cannot be verified.");
      }
      else {
        alert("Trouble uploading file. Please try again.");
      }

      setUploading(false);
    }
  };


  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCID = (cid) => {
    console.log("CID in form component: ", cid);
    // onUploadSuccess(cid);
    handleAddOrUpdate(identityType, cid);
    onClose();
  }

  return (
    <>
      <Head>
        <title>Simple IPFS</title>
        <meta name="description" content="Generated with create-pinata-app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/pinnie.png" />
      </Head>
      <main className="m-auto flex min-h-screen w-full flex-col items-center justify-center">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center bg-cover bg-center">
          <div className="h-full max-w-screen-xl">
            <div className="m-auto flex h-full w-full items-center justify-center">
              <div className="m-auto w-3/4 text-center">

                <div className="file-uploader-header">
                  <button className="close-button" onClick={onClose}>X</button>
                </div>
                
                <h1>Upload File</h1>
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg bg-light p-2 text-center text-secondary">
                  <button
                    disabled={uploading}
                    onClick={() => inputFile.current.click()}
                    className="align-center flex h-64 w-3/4 flex-row items-center justify-center rounded-3xl bg-secondary px-4 py-2 text-light transition-all duration-300 ease-in-out hover:bg-accent hover:text-light"
                  >
                    {uploading ? (
                      "Uploading..."
                    ) : (
                      <div>
                        <p className="text-lg font-light">
                          {file ? `Selected file: ${file.name}` : "Select a file to upload to the IPFS network"}
                          {/* Select a file to upload to the IPFS network */}
                        </p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="m-auto mt-4 h-12 w-12 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
                {file && (
                  <form onSubmit={uploadFile}>
                    <div className="mb-2">
                      <label htmlFor="name">Name</label><br />
                      <input onChange={(e) => setForm({
                        ...form,
                        name: e.target.value
                      })} className="border border-secondary rounded-md p-2 outline-none" id="name" value={form.name} placeholder="Name" />
                    </div>
                    <button className="rounded-lg bg-secondary text-white w-auto p-4" type="submit">Upload</button>
                  </form>
                )}
                {/* {cid && <Files cid={cid} />} */}
                {cid ?
                  <p>File successfully uploaded!!</p>
                  :
                  null
                }
                {cid ? <button onClick={() => handleCID(cid)} className="rounded-lg bg-secondary text-white w-auto p-4">Done</button> : null}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default FileUploader;
