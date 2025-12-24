import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

function ReceiverMessage({ message }) {
  const { selectedUser } = useSelector((state) => state.message);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image]);

  return (
    <div className="w-full flex justify-start">
      <div
        ref={scrollRef}
        className="relative max-w-[80%] sm:max-w-[70%] flex items-end gap-2 sm:gap-3"
      >
        {/* Avatar */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
          <img
            src={selectedUser?.profileImage || dp}
            alt={selectedUser?.userName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bubble */}
        <div className="flex flex-col gap-1">
          <div className="w-fit max-w-full bg-white border border-gray-200 rounded-3xl rounded-bl-md px-3 py-2 shadow-sm">
            {message.image && (
              <div className="mb-2 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <img
                  src={message.image}
                  alt="attachment"
                  className="max-h-[260px] w-full object-cover"
                />
              </div>
            )}

            {message.message && (
              <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-900 break-words">
                {message.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiverMessage;
