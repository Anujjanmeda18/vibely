import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/userSlice";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import { setSelectedUser } from "../redux/messageSlice";

function Profile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sectionType, setSectionType] = useState("posts");

  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userName) handleProfile();
  }, [userName]);

  if (!profileData) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  const isOwnProfile = profileData._id === userData?._id;

  const userPosts = postData?.filter((p) => p.author?._id === profileData._id);
  const userLoops = loopData?.filter((l) => l.author?._id === profileData._id);
  const savedPosts =
    isOwnProfile && userData?.saved
      ? postData.filter((p) => userData.saved.includes(p._id))
      : [];

  let gridItems = [];
  if (sectionType === "posts") {
    gridItems = userPosts || [];
  } else if (sectionType === "loops") {
    gridItems = (userLoops || []).map((l) => ({ ...l, _type: "loop" }));
  } else if (sectionType === "saved" && isOwnProfile) {
    gridItems = savedPosts;
  }

  const showEmptyState =
    (sectionType === "posts" && (!userPosts || userPosts.length === 0)) ||
    (sectionType === "loops" && (!userLoops || userLoops.length === 0)) ||
    (sectionType === "saved" && isOwnProfile && savedPosts.length === 0);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      {/* Top bar */}
      <header className="w-full h-[70px] flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="w-6 h-6 text-slate-700" />
        </button>

        <h1 className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-xs text-center">
          {profileData.userName}
        </h1>

        <button
          type="button"
          onClick={handleLogOut}
          className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
        >
          Log out
        </button>
      </header>

      {/* Scrollable area */}
      <div className="w-full flex justify-center px-3 sm:px-6 pt-6 pb-28">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* Top section: avatar + bio */}
          <section className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
            <div className="flex justify-center sm:justify-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-sky-200 bg-slate-100 shadow-[0_0_35px_rgba(56,189,248,0.35)] overflow-hidden">
                <img
                  src={profileData.profileImage || dp}
                  alt={profileData.userName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-1 sm:pt-2">
              <h2 className="text-xl sm:text-2xl font-semibold">
                {profileData.name}
              </h2>
              <p className="text-sm text-slate-500">
                {profileData.profession || "New to Vibely"}
              </p>
              {profileData.bio && (
                <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">
                  {profileData.bio}
                </p>
              )}
            </div>
          </section>

          {/* Stats */}
          <section className="flex flex-wrap items-center justify-center sm:justify-start gap-8 sm:gap-12 pt-2">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-semibold">
                {userPosts?.length || 0}
              </p>
              <p className="text-xs sm:text-sm text-slate-500">Posts</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="flex relative w-[72px] h-8">
                  {profileData.followers?.slice(0, 3).map((user, index) => (
                    <div
                      key={user._id || index}
                      className="w-8 h-8 rounded-full border border-white overflow-hidden bg-slate-200 absolute shadow-sm"
                      style={{ left: `${index * 14}px` }}
                    >
                      <img
                        src={user.profileImage || dp}
                        alt={user.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xl sm:text-2xl font-semibold">
                  {profileData.followers?.length || 0}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">Followers</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <div className="flex relative w-[72px] h-8">
                  {profileData.following?.slice(0, 3).map((user, index) => (
                    <div
                      key={user._id || index}
                      className="w-8 h-8 rounded-full border border-white overflow-hidden bg-slate-200 absolute shadow-sm"
                      style={{ left: `${index * 14}px` }}
                    >
                      <img
                        src={user.profileImage || dp}
                        alt={user.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xl sm:text-2xl font-semibold">
                  {profileData.following?.length || 0}
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">Following</p>
            </div>
          </section>

          {/* Primary actions */}
          <section className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {isOwnProfile ? (
              <button
                className="px-5 min-w-[150px] h-10 rounded-2xl bg-slate-900 text-slate-50 text-sm font-semibold hover:bg-black shadow-[0_0_25px_rgba(15,23,42,0.45)] transition-colors"
                onClick={() => navigate("/editprofile")}
              >
                Edit profile
              </button>
            ) : (
              <>
                <FollowButton
                  targetUserId={profileData._id}
                  onFollowChange={handleProfile}
                  tailwind="
                    w-[160px]
                    h-10
                    rounded-full
                    text-sm
                    font-semibold
                    flex
                    items-center
                    justify-center
                  "
                />

                <button
                  className="px-5 min-w-[150px] h-10 rounded-2xl bg-white border border-sky-500/80 text-sky-600 text-sm font-semibold hover:bg-sky-50 transition-colors"
                  onClick={() => {
                    dispatch(setSelectedUser(profileData));
                    navigate("/messageArea");
                  }}
                >
                  Message
                </button>
              </>
            )}
          </section>

          {/* Posts surface (grid) */}
          <section className="w-full flex justify-center">
            <div className="w-full max-w-5xl bg-white rounded-t-[40px] shadow-[0_-20px_60px_rgba(15,23,42,0.15)] pt-5 pb-24 px-2 sm:px-4">
              {/* Tabs */}
              <div className="w-full flex justify-center mb-5">
                <div className="w-full max-w-sm h-11 bg-slate-100 rounded-full flex items-center p-1">
                  <button
                    type="button"
                    onClick={() => setSectionType("posts")}
                    className={`flex-1 h-full text-xs sm:text-sm font-semibold rounded-full transition-all ${
                      sectionType === "posts"
                        ? "bg-slate-900 text-slate-50 shadow-[0_0_20px_rgba(15,23,42,0.6)]"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Posts
                  </button>

                  <button
                    type="button"
                    onClick={() => setSectionType("loops")}
                    className={`flex-1 h-full text-xs sm:text-sm font-semibold rounded-full transition-all ${
                      sectionType === "loops"
                        ? "bg-slate-900 text-slate-50 shadow-[0_0_20px_rgba(15,23,42,0.6)]"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Loops
                  </button>

                  {isOwnProfile && (
                    <button
                      type="button"
                      onClick={() => setSectionType("saved")}
                      className={`flex-1 h-full text-xs sm:text-sm font-semibold rounded-full transition-all ${
                        sectionType === "saved"
                          ? "bg-slate-900 text-slate-50 shadow-[0_0_20px_rgba(15,23,42,0.6)]"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Saved
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full max-w-3xl mx-auto">
                {showEmptyState && (
                  <div className="w-full flex flex-col items-center justify-center py-10 gap-2 text-slate-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-xl">
                      📄
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {sectionType === "posts"
                        ? "No posts to show yet"
                        : sectionType === "loops"
                        ? "No loops to show yet"
                        : "No saved posts yet"}
                    </p>
                  </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-3 gap-[2px] sm:gap-1 md:gap-2">
                  {gridItems?.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => navigate(`/post/${item._id}`)}
                      className="relative w-full pt-[100%] overflow-hidden group bg-slate-200"
                    >
                      {item.mediaType === "image" ? (
                        <img
                          src={item.media}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <video
                          src={item.media}
                          muted
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center gap-3 text-[11px] text-slate-50 font-semibold opacity-0 group-hover:opacity-100">
                        <span>❤ {item.likes?.length || 0}</span>
                        <span>💬 {item.comments?.length || 0}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom nav */}
              <div className="mt-6">
                <Nav />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
