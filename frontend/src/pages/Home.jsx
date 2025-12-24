import React from "react";
import LeftHome from "../components/LeftHome";
import Feed from "../components/Feed";
import RightHome from "../components/RightHome";

function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Outer shell */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
        {/* 3-column responsive layout */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left sidebar */}
          <aside className="hidden lg:block flex-[0.24] max-w-xs">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl bg-white/80 border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <LeftHome />
              </div>
            </div>
          </aside>

          {/* Center feed */}
          <main className="w-full lg:flex-[0.52] min-h-screen">
            <Feed />
          </main>

          {/* Right sidebar */}
          <aside className="hidden lg:block flex-[0.24] max-w-xs">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-3xl bg-white/80 border border-slate-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
                <RightHome />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Home;
