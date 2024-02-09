import { useState, useRef } from "react";
// pages/index.js
import Head from "next/head";
import Chatbot from "./chat";
import Navbar from "@/components/navbar";
import Login from "./login";

const Home = () => {
  return (
    <>
      <Head>
        <title>Your Next.js App</title>
        {/* Add other head elements if needed */}
      </Head>
      <div>
        <Login/>
      </div>
    </>
  );
};

export default Home;
