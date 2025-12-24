import React, { useMemo } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoopCard from "../components/LoopCard";

// simple Fisher–Yates shuffle
function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
} // [web:356][web:365]

function Loops() {
  const navigate = useNavigate();
  const { loopData } = useSelector((state) => state.loop);

  const shuffledLoops = useMemo(
    () => (loopData ? shuffleArray(loopData) : []),
    [loopData]
  );

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">
      {/* Top bar */}
      <div className="w-full h-[72px] flex items-center gap-[16px] px-[20px] fixed top-[10px] left-0 z-[100]">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[26px] h-[26px]"
          onClick={() => navigate("/")}
        />
        <h1 className="text-white text-[20px] font-semibold">Loops</h1>
      </div>

      {/* Vertical scroll, snap each loop to viewport */}
      <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {shuffledLoops.map((loop) => (
          <div
            key={loop._id}
            className="h-screen snap-start snap-always flex justify-center items-center"
          >
            <LoopCard loop={loop} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Loops;
