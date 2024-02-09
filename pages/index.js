import { useState, useRef } from "react";
// pages/index.js
import Head from "next/head";
import Chatbot from "./chat";
import Navbar from "@/components/navbar";
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
        <Navbar />
      </div>
    </>
  );
};

export default Home;
