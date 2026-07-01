"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const cubeFaces = [
  {
    image: "/landing/shot1.png",
    transform: "rotateY(0deg) translateZ(72px)",
  },
  {
    image: "/landing/shot2.png",
    transform: "rotateY(180deg) translateZ(72px)",
  },
  {
    image: "/landing/shot3.png",
    transform: "rotateY(90deg) translateZ(72px)",
  },
  {
    image: "/landing/shot4.png",
    transform: "rotateY(-90deg) translateZ(72px)",
  },
  {
    image: "/landing/shot1.png",
    transform: "rotateX(90deg) translateZ(72px)",
  },
  {
    image: "/landing/shot4.png",
    transform: "rotateX(-90deg) translateZ(72px)",
  },
];

export default function StoryboardCubeIntro() {
  const [isOpening, setIsOpening] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    if (!isGone) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isGone]);

  function openIntro() {
    if (isOpening || isGone) {
      return;
    }

    setIsOpening(true);

    window.setTimeout(() => {
      setIsGone(true);
      document.body.style.overflow = "";
    }, 1200);
  }

  return (
    <AnimatePresence>
      {!isGone ? (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-black text-white"
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > 8) {
              openIntro();
            }
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            animate={isOpening ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 h-1/2 border-b border-purple-400/20 bg-black"
          />

          <motion.div
            animate={isOpening ? { y: "100%" } : { y: 0 }}
            transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 h-1/2 border-t border-pink-400/20 bg-black"
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#7c3aed55,transparent_35%),radial-gradient(circle_at_top_right,#ec489955,transparent_30%),radial-gradient(circle_at_bottom,#2563eb44,transparent_35%)]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.p
              animate={isOpening ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-5 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-purple-100"
            >
              FrameForge AI Engine
            </motion.p>

            <motion.h1
              animate={isOpening ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl"
            >
              Start with a screenplay.
              <br />
              Forge it into storyboard frames.
            </motion.h1>

            <motion.p
              animate={isOpening ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="mt-5 max-w-xl text-sm leading-6 text-white/50 md:text-base"
            >
              Scroll to open the storyboard engine.
            </motion.p>

            <div
              className="mt-14 h-36 w-36 md:h-44 md:w-44"
              style={{ perspective: "900px" }}
            >
              <motion.div
                animate={
                  isOpening
                    ? {
                        rotateX: 780,
                        rotateY: 1120,
                        rotateZ: 120,
                        scale: 0.12,
                        opacity: 0,
                      }
                    : {
                        rotateX: [0, 14, -10, 0],
                        rotateY: [0, 360],
                      }
                }
                transition={
                  isOpening
                    ? {
                        duration: 0.9,
                        ease: "easeInOut",
                      }
                    : {
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }
                }
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {cubeFaces.map((face) => (
                  <div
                    key={face.transform}
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl shadow-purple-500/20"
                    style={{
                      transform: face.transform,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      src={face.image}
                      alt="Storyboard cube face"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.button
              onClick={openIntro}
              animate={isOpening ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-12 rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
            >
              Open Storyboard Engine
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}