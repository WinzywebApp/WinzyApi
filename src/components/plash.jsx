import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const [phase, setPhase] = useState("idle");
  const circleCtrl = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("flyIn");
      circleCtrl.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      });
    }, 1000);

    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === "flyIn") {
      const t2 = setTimeout(() => {
        setPhase("expand");
        circleCtrl.start({
          scale: 28,
          transition: { duration: 1.0, ease: [0.34, 1.56, 0.64, 1] },
        }).then(() => {
          setPhase("content");
        });
      }, 950);
      return () => clearTimeout(t2);
    }
  }, [phase, circleCtrl]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white">
      <motion.div
        initial={{ y: "-55vh", opacity: 0, scale: 1 }}
        animate={circleCtrl}
        className="pointer-events-none absolute z-10 h-24 w-24 rounded-full bg-blue-600 shadow-2xl"
        style={{
          left: "50%",
          top: "50%",
          transformOrigin: "center center",
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      <div className="absolute inset-0 z-0" />

      {phase === "content" && (
        <div className="relative z-20 flex flex-col items-center justify-center gap-6">
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="flex flex-col items-center"
          >
            <img
              src="/logo.png"
              alt="App Logo"
              className="h-20 w-80 object-contain"
            />
          </motion.div>

          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.05 }}
            onClick={() => navigate("/auth")}
            className="rounded-2xl bg-white/95 px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg ring-1 ring-black/5 backdrop-blur hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 active:scale-[0.98]"
          >
            Continue
          </motion.button>
        </div>
      )}

      {phase === "idle" && (
        <div className="absolute bottom-10 text-xs text-gray-400">Loading…</div>
      )}

      <span className="sr-only">
        {phase === "idle" && "Starting"}
        {phase === "flyIn" && "Circle moving to center"}
        {phase === "expand" && "Expanding"}
        {phase === "content" && "Content ready"}
      </span>
    </div>
  );
}
