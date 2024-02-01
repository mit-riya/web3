import { useState, useRef } from "react";
// pages/index.js
import Head from "next/head";
import FileUploader from "@/components/FileUploader";

const Home = () => {
  return (
    <>
      <Head>
        <title>Your Next.js App</title>
        {/* Add other head elements if needed */}
      </Head>
      <div>
        <h1>Your Home Page</h1>
        {/* Use the FileUploader component here */}
        <FileUploader />
      </div>
    </>
  );
};

export default Home;
