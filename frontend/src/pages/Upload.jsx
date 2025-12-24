import React, { useRef, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import VideoPlayer from "../components/VideoPlayer";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setCurrentUserStory } from "../redux/storySlice";
import { setLoopData } from "../redux/loopSlice";

function Upload() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [uploadType, setUploadType] = useState("post"); // post | story | loop
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState(""); // image | video
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const mediaInput = useRef(null);

  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);

  const handleMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // optional size check
    if (file.size > 20 * 1024 * 1024) {
      setErr("File must be smaller than 20MB.");
      return;
    }

    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
    setErr("");
  };

  const uploadPost = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("mediaType", mediaType);
    formData.append("media", backendMedia);
    const result = await axios.post(
      `${serverUrl}/api/post/upload`,
      formData,
      { withCredentials: true }
    );
    dispatch(setPostData([...(postData || []), result.data]));
  };

  const uploadStory = async () => {
    const formData = new FormData();
    formData.append("mediaType", mediaType);
    formData.append("media", backendMedia);
    const result = await axios.post(
      `${serverUrl}/api/story/upload`,
      formData,
      { withCredentials: true }
    );
    dispatch(setCurrentUserStory(result.data));
  };

  const uploadLoop = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("media", backendMedia);
    const result = await axios.post(
      `${serverUrl}/api/loop/upload`,
      formData,
      { withCredentials: true }
    );
    dispatch(setLoopData([...(loopData || []), result.data]));
  };

  const handleUpload = async () => {
    if (!backendMedia || loading) return;

    if (!mediaType) {
      setErr("Please select an image or video.");
      return;
    }
    if (uploadType !== "story" && !caption.trim()) {
      setErr("Add a caption or switch to Story.");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      if (uploadType === "post") {
        await uploadPost();
      } else if (uploadType === "story") {
        await uploadStory();
      } else {
        await uploadLoop();
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      setErr("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canAddCaption = uploadType !== "story";

  const resetMedia = () => {
    setFrontendMedia(null);
    setBackendMedia(null);
    setCaption("");
    setMediaType("");
    setErr("");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center text-slate-900">
      {/* Header */}
      <header className="w-full h-[70px] flex items-center gap-3 px-4 sm:px-8 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-full p-1.5 hover:bg-slate-100 transition-colors"
        >
          <MdOutlineKeyboardBackspace className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold">Upload media</h1>
      </header>

      {/* Content */}
      <main className="w-full flex justify-center px-3 sm:px-6 py-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-6">
          {/* Type selector */}
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-full shadow-sm px-1 py-1 flex items-center">
            {["post", "story", "loop"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setUploadType(type);
                  setErr("");
                }}
                className={`flex-1 h-10 text-sm sm:text-base font-semibold rounded-full transition-all ${
                  uploadType === type
                    ? "bg-slate-900 text-slate-50 shadow-[0_0_20px_rgba(15,23,42,0.35)]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {err && (
            <div className="w-full max-w-xl rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
              {err}
            </div>
          )}

          {/* Upload area */}
          {!frontendMedia && (
            <button
              type="button"
              className="w-full max-w-xl h-64 sm:h-72 rounded-3xl border border-dashed border-slate-300 bg-white hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-3 shadow-[0_10px_35px_rgba(15,23,42,0.12)]"
              onClick={() => mediaInput.current?.click()}
            >
              <input
                type="file"
                accept={uploadType === "loop" ? "video/*" : "image/*,video/*"}
                hidden
                ref={mediaInput}
                onChange={handleMedia}
              />
              <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-slate-100 border border-slate-200">
                <FiPlusSquare className="w-6 h-6 text-slate-700" />
              </div>
              <div className="text-sm sm:text-base font-semibold text-slate-900">
                Upload {uploadType}
              </div>
              <p className="text-xs text-slate-500">
                {uploadType === "loop"
                  ? "MP4, WebM or MOV · Up to a few minutes"
                  : "Image or video · JPG, PNG, MP4, WebM"}
              </p>
            </button>
          )}

          {/* Preview + caption */}
          {frontendMedia && (
            <div className="w-full max-w-xl flex flex-col gap-4">
              <div className="w-full rounded-3xl bg-white border border-slate-200 shadow-[0_10px_35px_rgba(15,23,42,0.12)] p-3 sm:p-4">
                {mediaType === "image" && (
                  <div className="w-full overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={frontendMedia}
                      alt="preview"
                      className="w-full max-h-[360px] object-cover"
                    />
                  </div>
                )}

                {mediaType === "video" && (
                  <div className="w-full rounded-2xl overflow-hidden bg-black">
                    <VideoPlayer media={frontendMedia} />
                  </div>
                )}
              </div>

              {canAddCaption && (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-600">
                      Caption
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {caption.length}/2200
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={2200}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 px-4 py-2 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 transition-colors resize-none"
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={loading || !backendMedia}
                className="mt-1 w-full h-11 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-sm font-semibold flex items-center justify-center shadow-[0_0_28px_rgba(56,189,248,0.65)] hover:from-sky-400 hover:to-cyan-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <ClipLoader size={22} color="#ffffff" />
                ) : (
                  `Upload ${uploadType}`
                )}
              </button>

              <button
                type="button"
                onClick={resetMedia}
                className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-4 self-center"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Upload;
