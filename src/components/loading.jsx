// src/components/LoadingScreen.jsx
import React from "react";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative w-10 h-10 rotate-[165deg] mb-4">
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-[0.25em] -translate-x-1/2 -translate-y-1/2 animate-before8" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-[0.25em] -translate-x-1/2 -translate-y-1/2 animate-after6" />
      </div>
      <div className="text-sm text-gray-600">{message}</div>
      {/* Inline style block for keyframes (can be moved to global CSS) */}
      <style>{`
        @keyframes before8 {
          0% {
            width: 0.5em;
            box-shadow:
              1em -0.5em rgba(0,123,255,0.75),
              -1em 0.5em rgba(0,123,255,0.75);
          }
          35% {
            width: 2.5em;
            box-shadow:
              0 -0.5em rgba(0,123,255,0.75),
              0 0.5em rgba(0,123,255,0.75);
          }
          70% {
            width: 0.5em;
            box-shadow:
              -1em -0.5em rgba(0,123,255,0.75),
              1em 0.5em rgba(0,123,255,0.75);
          }
          100% {
            box-shadow:
              1em -0.5em rgba(0,123,255,0.75),
              -1em 0.5em rgba(0,123,255,0.75);
          }
        }

        @keyframes after6 {
          0% {
            height: 0.5em;
            box-shadow:
              0.5em 1em rgba(0,123,255,0.75),
              -0.5em -1em rgba(0,123,255,0.75);
          }
          35% {
            height: 2.5em;
            box-shadow:
              0.5em 0 rgba(0,123,255,0.75),
              -0.5em 0 rgba(0,123,255,0.75);
          }
          70% {
            height: 0.5em;
            box-shadow:
              0.5em -1em rgba(0,123,255,0.75),
              -0.5em 1em rgba(0,123,255,0.75);
          }
          100% {
            box-shadow:
              0.5em 1em rgba(0,123,255,0.75),
              -0.5em -1em rgba(0,123,255,0.75);
          }
        }

        .animate-before8 {
          animation: before8 2s infinite;
        }
        .animate-after6 {
          animation: after6 2s infinite;
        }
      `}</style>
    </div>
  );
}
