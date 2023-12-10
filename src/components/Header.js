import React, { use, useEffect } from "react";
import Image from "next/image";
import Router from "next/router";
import Link from "next/link";
import axios from "axios";
import { BiMoneyWithdraw } from "react-icons/bi";

import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "anon-aadhaar-react";

function Header() {
  const [anonAadhaar] = useAnonAadhaar();

  const [address, setAddress] = React.useState("");
  const [balance, setBalance] = React.useState(0);

  useEffect(() => async () => {
    setAddress(localStorage.getItem("address"));
  }, []);


  useEffect(() => async () => {
    console.log("address", localStorage.getItem("address"));
    const res = await axios.post("http://localhost:3000/api/vote/getBalance", {
      walletAddress: localStorage.getItem("address")
    });
    console.log(res);
    setBalance(res.data.quadraticVoteBalance);
  }, []);


  return (
    <>
      <header className="top-0 z-50 grid grid-cols-2 bg-black drop-shadow-md p-5 md:px-10">
        {/* left */}
        <Link href="/home">
          <div className="relative flex items-center h-15 cursor-pointer my-auto">
            <h1 className="text-3xl font-bold text-white">CodeSafe</h1>
          </div>
        </Link>
        {/* right */}
        <div className="flex space-x-4 items-center justify-end text-gray-500">
          {
            address && (
              <div className="flex items-center">
                <BiMoneyWithdraw className="text-white text-2xl" />
                <p className="text-white text-lg px-2">{balance}</p>
              </div>
            )
          }
          <button
            onClick={() => Router.push("/createproject")}
            className="hidden md:inline-flex bg-[#0284c7] text-white text-lg px-3.5 py-1.5 rounded-xl"
          >
            Create Project
          </button>
          <button
            onClick={() => Router.push("/myprojects")}
            className="hidden md:flex items-center bg-transparent text-white text-lg px-3.5 py-1.5 border border-white-500 rounded-xl"
          >
            My Projects
          </button>
          {
            address ? (
              <p className="text-white">
                {localStorage.getItem("address").slice(0, 6)}...
                {localStorage.getItem("address").slice(-4)}
              </p>
            ) : (
              <button className="hidden md:inline-flex bg-transparent text-white text-lg px-5 py-2 border border-white-500 rounded-xl">
                Connect wallet
              </button>
            )
          }
          <p>✅</p>
          {/* {
            anonAadhaar?.status === "logged-out" && (
              <LogInWithAnonAadhaar />
            )
          } */}
          {/* {
            anonAadhaar?.status === "logged-in" &&
            //put a green tick here
            <>
              <p>✅</p>
              <LogInWithAnonAadhaar />
            </>
          } */}
        </div>
      </header>
    </>
  );
}

export default Header;
