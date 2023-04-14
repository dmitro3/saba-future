import Head from "next/head";

import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import styles from "../styles/Home.module.css";

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Prediction World</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-5xl">
        <div className="w-full flex flex-col flex-grow pt-1">
          <div className="relative text-gray-500 focus-within:text-gray-400 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center px-3">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              name="q"
              className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md pl-10 focus:outline-none"
              placeholder="Search markets..."
              autoComplete="off"
            />
          </div>
          <div className="flex flex-row space-x-2 md:space-x-5 items-center flex-wrap mt-4">
            <Filter />
          </div>
        </div>
      </main>
    </div>
  );
}
