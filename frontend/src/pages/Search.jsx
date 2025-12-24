import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";

function Search() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search
  useEffect(() => {
    if (!input.trim()) {
      setSearchData([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/search?keyWord=${encodeURIComponent(
            input.trim()
          )}`,
          { withCredentials: true }
        );
        setSearchData(result.data || []);
      } catch (err) {
        console.log(err);
        setError("Something went wrong. Try again.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [input]);

  const handleClear = () => {
    setInput("");
    setSearchData([]);
    setError(null);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="w-full h-[70px] flex items-center gap-3 px-4 sm:px-6 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="text-slate-700 w-[24px] h-[24px]" />
        </button>
        <h1 className="text-slate-900 text-[20px] font-semibold tracking-wide">
          Search
        </h1>
      </header>

      {/* Search Bar */}
      <div className="w-full flex items-center justify-center px-4 sm:px-6 py-4">
        <div className="w-full max-w-[800px] h-[50px] rounded-full bg-white border border-slate-200 flex items-center px-4 gap-3 shadow-sm focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-200 transition-all">
          <FiSearch className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full h-full outline-0 bg-transparent text-slate-900 text-[15px] placeholder:text-slate-400"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            autoFocus
          />
          {input && (
            <button type="button" onClick={handleClear}>
              <IoCloseCircle className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="w-full flex-1 flex flex-col items-center px-4 sm:px-6 pb-8 gap-3 overflow-auto">
        {/* Loading */}
        {loading && (
          <div className="mt-10 text-slate-500 text-[14px]">Searching...</div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-10 text-red-500 text-[14px]">{error}</div>
        )}

        {/* Empty state */}
        {!input && !loading && !error && (
          <div className="mt-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FiSearch className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-900 text-[18px] font-semibold">
              Search for users
            </p>
            <p className="text-slate-500 text-[13px] mt-1">
              Find people by username or name.
            </p>
          </div>
        )}

        {/* No results */}
        {input && !loading && searchData.length === 0 && !error && (
          <div className="mt-10 text-slate-500 text-[14px]">
            No users found for <span className="font-semibold">"{input}"</span>
          </div>
        )}

        {/* Results list */}
        {searchData.length > 0 && (
          <div className="w-full max-w-[700px] flex flex-col gap-2">
            {searchData.map((user) => (
              <button
                key={user._id}
                type="button"
                className="w-full h-[70px] rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-sky-400/70 flex items-center gap-3 px-3.5 cursor-pointer transition-all shadow-sm hover:shadow-md"
                onClick={() => navigate(`/profile/${user.userName}`)}
              >
                <div className="w-[50px] h-[50px] rounded-full border border-slate-200 overflow-hidden bg-slate-100 shadow-sm">
                  <img
                    src={user.profileImage || dp}
                    alt={user.userName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col items-start min-w-0">
                  <span className="text-slate-900 text-[15px] font-semibold truncate">
                    {user.userName}
                  </span>
                  <span className="text-slate-500 text-[13px] truncate">
                    {user.name || "No name yet"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
