/* index.js */

import Head from "next/head";
import Login from "./login";

const Home = () => {
  return (
    <>
      <Head>
        <title>Your Next.js App</title>
      </Head>
      <div>
        <Login/>
      </div>
    </>
  );
};

export default Home;
