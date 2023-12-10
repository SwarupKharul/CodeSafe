import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaExternalLinkAlt } from "react-icons/fa";
import axios from 'axios';
import { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProjectCard({ project }) {

  const [voteCount, setVoteCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleQuadraticVote = async () => {
    //get a random string for the to address
    const to = project.id;
    const vote = {
      walletAddress: localStorage.getItem("address"),
      toAddress: to,
      voteCount: voteCount,
    }
    console.log(vote)
    const res = await axios.post("http://localhost:3000/api/vote/to", vote);
    console.log(res);
    if (res.data === "You don't have enough vote balance") {
      toast.error(res.data);
    } else if (res.data === "You are not registered") {
      toast.error(res.data);
    }
    else if (res.data === "You can't vote yourself") {
      toast.error(res.data);
    }
    else {
      toast.success("Vote successful");
    }
    setTimeout(() => {
      setOpenModal(false);
    }
      , 2000);
  };

  return (
    <div className="flex py-7 px-3 border-2 border-slate-700 rounded-xl m-5 hover:shadow-lg pr-4 transition duration-500 ease-in md:h-64" >
      {/* Just for image div-LHS */}
      < div className="relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0" >
        <Image
          src={`${project.image}/${project.title}.jpg`}
          alt="img"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div >
      {/* Content div-RHS */}
      < div className="flex flex-col pl-5" >
        <div className="flex">
          <h4 className="text-2xl font-bold">{project.title}</h4>
          <Link href={`/viewproject/${project.id}`}>
            <FaExternalLinkAlt className="text-white text-sm mt-2.5 mx-3" />
          </Link>
          <p className='text-white text-sm mt-2.5'>
            ({project.manager.slice(0, 6) + "..." + project.manager.slice(-4)} ✅)
          </p>
        </div>
        <div className="border-b w-10 pt-2" />
        <p className="pt-2 text-lg text-white">{project.description}</p>
        <div className="flex items-center mt-3">
          {project.taskCount > 0 ? (
            <h1 className="text-white text-lg font-bold">
              Ratings: &nbsp;
            </h1>
          ) : (
            <></>
          )}
          {project.taskCount > 0 ? (
            Array.from({ length: project.taskCount }, (_, i) => (
              <FaStar key="1" className="text-white" />
            ))
          ) : (
            <h1 className="text-white font-semibold text-lg">No ratings</h1>
          )}
        </div>
        <div className="relative pt-5">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-800">
            <div
              style={{ width: `${project.duration}` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white"
            ></div>
          </div>
        </div>
        {/* At the bottom of the card, category should be displayed */}
        <div className="flex items-center mt-2">
          <span className="text-white bg-slate-700 rounded-xl text-lg px-2 py-1">
            {project.category}
          </span>
          <button onClick={() => { setOpenModal(true) }
          } className="ml-3 hidden md:inline-flex bg-transparent text-white text-lg border border-white-500 rounded-xl
                            hover:bg-white hover:text-black rounded-xl text-lg px-2 py-1">
            Vote for this project
          </button>
        </div>
      </div >
      {/* Modal */}
      {
        openModal && (
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-filter backdrop-blur-sm ">
            <div className="relative w-auto my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-[30rem] h-[250px] bg-[#1a1e27] outline-none focus:outline-none ">
                <div className="flex items-center justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                  <h3 className="text-xl font-medium text-white text-center">Select the number of votes!</h3>
                  <div className="flex justify-between">
                    <button
                      className="bg-transparent border-0 text-black float-right"
                      onClick={() => setOpenModal(false)}
                    >
                      <span className="text-black opacity-7 h-8 w-8 text-xl block bg-gray-400 py-0 rounded-full">
                        x
                      </span>
                    </button>
                  </div>
                </div>
                {/* have two buttons + and - to increase and decrease the vote count */}
                <div className="flex justify-between items-center mt-8 mx-5">
                  {/* Buttons to edit project and view project */}
                  <div className="flex space-x-4 items-center justify-end text-gray-500">
                    <button
                      className="hidden md:inline-flex bg-transparent text-white text-lg px-5 py-2 border border-white-500 rounded-xl
                             hover:bg-white hover:text-black
                             "
                      onClick={() => setVoteCount(voteCount + 1)}
                    >
                      +
                    </button>
                    <h1 className="text-white text-lg font-bold">{voteCount}</h1>
                    <button
                      className="hidden md:inline-flex bg-transparent text-white text-lg px-5 py-2 border border-white-500 rounded-xl
                             hover:bg-white hover:text-black
                             "
                      onClick={() => setVoteCount(voteCount - 1)}
                    >
                      -
                    </button>
                  </div>
                </div>
                <div className="flex justify-start items-center mx-5">
                  <button onClick={handleQuadraticVote} className="bg-blue-600 w-[50%] my-5 text-white text-lg px-5 py-2 rounded-xl
                              hover:bg-white hover:text-black
                              ">
                    Confirm Vote!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <ToastContainer />
    </div >
  );
}