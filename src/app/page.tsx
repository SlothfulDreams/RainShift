"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { SaveEditor } from "@/components/SaveEditor";
import type { RawUserProfile, SaveData } from "@/data/types";
import { loadSaveFile } from "@/lib/save-operations";

type AppState = "upload" | "editing";

interface LoadedSave {
  raw: RawUserProfile;
  saveData: SaveData;
  fileName: string;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("upload");
  const [loadedSave, setLoadedSave] = useState<LoadedSave | null>(null);

  const handleFileLoaded = useCallback(
    (xmlContent: string, fileName: string) => {
      try {
        const { raw, saveData } = loadSaveFile(xmlContent);
        setLoadedSave({ raw, saveData, fileName });
        setAppState("editing");
      } catch (error) {
        console.error("Failed to load save file:", error);
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    setLoadedSave(null);
    setAppState("upload");
  }, []);

  return (
    <div className="min-h-screen grid-bg">
      <AnimatePresence mode="wait">
        {appState === "upload" ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 -left-32 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-orange/3 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
              {/* Logo & Title */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-16"
              >
                {/* Enhanced Raindrop Logo - Cyberpunk Circuit Design */}
                <motion.div
                  className="relative inline-block mb-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="w-36 h-44 relative">
                    {/* Glitch layers - chromatic aberration effect */}
                    <motion.div
                      className="absolute inset-0 opacity-50"
                      animate={{
                        x: [0, -4, 0, 3, 0],
                        opacity: [0.5, 0.7, 0.5, 0.6, 0.5],
                      }}
                      transition={{
                        duration: 0.12,
                        repeat: Infinity,
                        repeatDelay: 4,
                      }}
                    >
                      <RaindropSVG color="#00f0ff" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 opacity-40"
                      animate={{
                        x: [0, 4, 0, -3, 0],
                        opacity: [0.4, 0.6, 0.4, 0.5, 0.4],
                      }}
                      transition={{
                        duration: 0.12,
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 0.03,
                      }}
                    >
                      <RaindropSVG color="#bf5fff" />
                    </motion.div>

                    {/* Main raindrop with animated circuit */}
                    <div className="absolute inset-0">
                      <AnimatedRaindropLogo />
                    </div>

                    {/* Scan line sweep effect */}
                    <div
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{
                        clipPath:
                          "path('M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z')",
                        transform: "scale(1.12) translate(-5.5%, -3%)",
                      }}
                    >
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent"
                        animate={{ top: ["-5%", "105%"] }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 2,
                        }}
                      />
                    </div>

                    {/* Edge traveling highlight */}
                    <svg
                      viewBox="0 0 100 130"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="edgeTravelGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00f0ff"
                            stopOpacity="0"
                          />
                          <stop
                            offset="50%"
                            stopColor="#00f0ff"
                            stopOpacity="1"
                          />
                          <stop
                            offset="100%"
                            stopColor="#00f0ff"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
                        fill="none"
                        stroke="url(#edgeTravelGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, pathOffset: 0 }}
                        animate={{ pathOffset: [0, 1] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ pathLength: 0.2 }}
                      />
                    </svg>
                  </div>

                  {/* Multi-layered glow effects */}
                  <div className="absolute inset-0 -z-10">
                    <motion.div
                      className="absolute inset-0 bg-neon-cyan/25 blur-2xl scale-110"
                      style={{ clipPath: "ellipse(42% 52% at 50% 50%)" }}
                      animate={{
                        opacity: [0.25, 0.4, 0.25],
                        scale: [1.1, 1.15, 1.1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-neon-purple/15 blur-3xl scale-125"
                      style={{ clipPath: "ellipse(38% 48% at 50% 50%)" }}
                      animate={{
                        opacity: [0.15, 0.25, 0.15],
                        scale: [1.25, 1.3, 1.25],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />
                  </div>

                  {/* Floating data particles */}
                  <div className="absolute inset-0 -z-5 overflow-visible">
                    {[
                      {
                        id: "p1",
                        left: 15,
                        top: 5,
                        color: "#00f0ff",
                        duration: 2.5,
                        delay: 0,
                      },
                      {
                        id: "p2",
                        left: 25,
                        top: 35,
                        color: "#bf5fff",
                        duration: 2.7,
                        delay: 0.3,
                      },
                      {
                        id: "p3",
                        left: 35,
                        top: 65,
                        color: "#00f0ff",
                        duration: 2.9,
                        delay: 0.6,
                      },
                      {
                        id: "p4",
                        left: 45,
                        top: 5,
                        color: "#bf5fff",
                        duration: 3.1,
                        delay: 0.9,
                      },
                      {
                        id: "p5",
                        left: 55,
                        top: 35,
                        color: "#00f0ff",
                        duration: 3.3,
                        delay: 1.2,
                      },
                      {
                        id: "p6",
                        left: 65,
                        top: 65,
                        color: "#bf5fff",
                        duration: 3.5,
                        delay: 1.5,
                      },
                      {
                        id: "p7",
                        left: 75,
                        top: 5,
                        color: "#00f0ff",
                        duration: 3.7,
                        delay: 1.8,
                      },
                      {
                        id: "p8",
                        left: 85,
                        top: 35,
                        color: "#bf5fff",
                        duration: 3.9,
                        delay: 2.1,
                      },
                    ].map((particle) => (
                      <motion.div
                        key={particle.id}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: `${particle.left}%`,
                          top: `${particle.top}%`,
                          backgroundColor: particle.color,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0, 0.8, 0],
                          scale: [0, 1.2, 0],
                        }}
                        transition={{
                          duration: particle.duration,
                          repeat: Infinity,
                          delay: particle.delay,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>

                  {/* Ripple effect at bottom */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-8 h-2 border border-neon-cyan/30 rounded-full"
                        style={{
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                        animate={{
                          scaleX: [1, 3, 4],
                          scaleY: [1, 0.5, 0.3],
                          opacity: [0.6, 0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-7xl font-display font-black text-text-bright mb-4 tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-glow-cyan animate-flicker">RAIN</span>
                  <span className="text-neon-orange text-glow-orange">
                    SHIFT
                  </span>
                </motion.h1>

                <motion.p
                  className="text-text-secondary text-lg tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-neon-cyan">[</span>
                  RISK OF RAIN 2 SAVE EDITOR
                  <span className="text-neon-cyan">]</span>
                </motion.p>
              </motion.div>

              {/* Feature tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 mb-12"
              >
                <FeatureTag text="CLIENT-SIDE" color="cyan" />
                <FeatureTag text="ALL DLCS" color="orange" />
                <FeatureTag text="OPEN SOURCE" color="purple" />
              </motion.div>

              {/* File upload */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full max-w-2xl"
              >
                <FileUpload onFileLoaded={handleFileLoaded} />
              </motion.div>

              {/* DLC badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-16 text-center"
              >
                <p className="text-text-muted text-sm mb-4 tracking-widest uppercase">
                  Supports all expansions
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <DLCTag name="BASE GAME" />
                  <DLCTag name="SURVIVORS OF THE VOID" color="purple" />
                  <DLCTag name="SEEKERS OF THE STORM" color="orange" />
                  <DLCTag name="ALLOYED COLLECTIVE" color="cyan" />
                </div>
              </motion.div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center border-t border-border/50 relative z-10">
              <p className="text-text-muted text-xs tracking-wider">
                NOT AFFILIATED WITH HOPOO GAMES OR GEARBOX PUBLISHING
              </p>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loadedSave && (
              <SaveEditor
                initialSaveData={loadedSave.saveData}
                rawProfile={loadedSave.raw}
                fileName={loadedSave.fileName}
                onReset={handleReset}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureTag({
  text,
  color,
}: {
  text: string;
  color: "cyan" | "orange" | "purple";
}) {
  const colorClasses = {
    cyan: "border-neon-cyan/40 text-neon-cyan bg-neon-cyan/5",
    orange: "border-neon-orange/40 text-neon-orange bg-neon-orange/5",
    purple: "border-neon-purple/40 text-neon-purple bg-neon-purple/5",
  };

  return (
    <div
      className={`px-4 py-2 border text-xs tracking-widest font-display ${colorClasses[color]}`}
    >
      {text}
    </div>
  );
}

function DLCTag({
  name,
  color = "default",
}: {
  name: string;
  color?: "default" | "purple" | "orange" | "cyan";
}) {
  const colorClasses = {
    default: "text-text-secondary border-border",
    purple: "text-neon-purple/80 border-neon-purple/30",
    orange: "text-neon-orange/80 border-neon-orange/30",
    cyan: "text-neon-cyan/80 border-neon-cyan/30",
  };

  return (
    <span
      className={`px-3 py-1 text-[10px] tracking-widest border ${colorClasses[color]}`}
    >
      {name}
    </span>
  );
}

// Animated raindrop logo with pulsing circuit nodes and data rain
function AnimatedRaindropLogo() {
  const cyanColor = "#00f0ff";

  // Node positions for pulsing animation - centered in raindrop (widest at y~82)
  const nodes = [
    { cx: 50, cy: 48, r: 2, delay: 0 }, // Top
    { cx: 38, cy: 62, r: 1.5, delay: 0.2 }, // Upper left
    { cx: 62, cy: 62, r: 1.5, delay: 0.4 }, // Upper right
    { cx: 30, cy: 82, r: 1.5, delay: 0.6 }, // Mid left (widest point)
    { cx: 70, cy: 82, r: 1.5, delay: 0.8 }, // Mid right (widest point)
    { cx: 36, cy: 100, r: 1.5, delay: 1.0 }, // Lower left
    { cx: 64, cy: 100, r: 1.5, delay: 1.2 }, // Lower right
    { cx: 50, cy: 110, r: 2, delay: 1.4 }, // Bottom
  ];

  // Data rain characters - centered positions
  const dataRain = [
    { char: "1", x: 42, baseY: 38, delay: 0 },
    { char: "0", x: 58, baseY: 42, delay: 0.5 },
    { char: "0", x: 36, baseY: 52, delay: 1.0 },
    { char: "1", x: 64, baseY: 50, delay: 1.5 },
    { char: "1", x: 50, baseY: 45, delay: 0.3 },
    { char: "0", x: 46, baseY: 58, delay: 0.8 },
  ];

  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      role="img"
      aria-label="Rainshift logo"
    >
      <defs>
        <clipPath id="raindropClip-animated">
          <path d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z" />
        </clipPath>

        <linearGradient
          id="dropGradient-animated"
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="0%" stopColor={cyanColor} stopOpacity="0.95" />
          <stop offset="40%" stopColor={cyanColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={cyanColor} stopOpacity="0.15" />
        </linearGradient>

        <radialGradient id="centerGlow-animated" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={cyanColor} stopOpacity="1" />
          <stop offset="60%" stopColor={cyanColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={cyanColor} stopOpacity="0" />
        </radialGradient>

        <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow */}
      <path
        d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
        fill="none"
        stroke={cyanColor}
        strokeWidth="6"
        strokeOpacity="0.15"
        style={{ filter: "blur(3px)" }}
      />

      {/* Main raindrop shape */}
      <path
        d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
        fill="url(#dropGradient-animated)"
        stroke={cyanColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <g clipPath="url(#raindropClip-animated)">
        {/* Data rain - falling binary characters */}
        {dataRain.map((item) => (
          <motion.text
            key={`rain-${item.x}-${item.baseY}`}
            x={item.x}
            fontFamily="JetBrains Mono, monospace"
            fontSize="7"
            fill={cyanColor}
            textAnchor="middle"
            initial={{ y: item.baseY, opacity: 0 }}
            animate={{
              y: [item.baseY, item.baseY + 80],
              opacity: [0, 0.4, 0.4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: item.delay,
              ease: "linear",
            }}
          >
            {item.char}
          </motion.text>
        ))}

        {/* Central hexagon core - centered at y=82 (widest point of raindrop) */}
        <g transform="translate(50, 82)">
          {/* Outer hexagon ring - smaller to fit */}
          <motion.polygon
            points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7"
            fill="none"
            stroke={cyanColor}
            strokeWidth="1.5"
            initial={{ strokeOpacity: 0.4 }}
            animate={{ strokeOpacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner hexagon */}
          <motion.polygon
            points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4"
            fill={cyanColor}
            stroke={cyanColor}
            strokeWidth="1"
            initial={{ fillOpacity: 0.1, strokeOpacity: 0.6 }}
            animate={{
              fillOpacity: [0.1, 0.25, 0.1],
              strokeOpacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          {/* Center node with glow */}
          <motion.circle
            cx="0"
            cy="0"
            r="3"
            fill="url(#centerGlow-animated)"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="0" cy="0" r="1.5" fill={cyanColor} />
        </g>

        {/* Circuit traces - adjusted to connect to new node positions */}
        <g
          stroke={cyanColor}
          strokeWidth="1"
          strokeOpacity="0.5"
          strokeLinecap="round"
        >
          {/* Top trace */}
          <path d="M50 68 L50 48" />
          {/* Upper diagonal traces */}
          <path d="M50 48 L38 62" />
          <path d="M50 48 L62 62" />
          {/* Side traces from hexagon */}
          <path d="M38 82 L30 82" />
          <path d="M62 82 L70 82" />
          {/* Lower diagonal traces */}
          <path d="M44 92 L36 100" />
          <path d="M56 92 L64 100" />
          {/* Bottom trace */}
          <path d="M50 96 L50 110" />
        </g>

        {/* Animated pulsing nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.cx}-${node.cy}`}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill={cyanColor}
            filter="url(#nodeGlow)"
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Traveling data dots along circuit paths */}
        <motion.circle
          cx="50"
          cy="68"
          r="1.5"
          fill={cyanColor}
          filter="url(#nodeGlow)"
          animate={{
            cy: [68, 48],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
        />
        <motion.circle
          cx="50"
          cy="96"
          r="1.5"
          fill={cyanColor}
          filter="url(#nodeGlow)"
          animate={{
            cy: [96, 110],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 2,
            delay: 0.5,
            ease: "easeOut",
          }}
        />

        {/* Highlight arcs at top */}
        <path
          d="M32 42 Q50 25 68 42"
          stroke={cyanColor}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M38 48 Q50 38 62 48"
          stroke={cyanColor}
          strokeWidth="0.75"
          strokeOpacity="0.25"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

// Static raindrop SVG for glitch layers (no animations)
function RaindropSVG({
  color,
  isMain = false,
}: {
  color: string;
  isMain?: boolean;
}) {
  const uniqueId = isMain ? "main" : color.replace("#", "");

  return (
    <svg
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        {/* Clip path for effects */}
        <clipPath id={`raindropClip-${uniqueId}`}>
          <path d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z" />
        </clipPath>

        {/* Main gradient - deeper, more dramatic */}
        <linearGradient
          id={`dropGradient-${uniqueId}`}
          x1="50%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="40%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.15" />
        </linearGradient>

        {/* Radial glow for center node */}
        <radialGradient id={`centerGlow-${uniqueId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="60%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        {/* Edge glow filter */}
        <filter
          id={`edgeGlow-${uniqueId}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow layer */}
      {isMain && (
        <path
          d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeOpacity="0.15"
          filter={`url(#edgeGlow-${uniqueId})`}
        />
      )}

      {/* Main raindrop shape */}
      <path
        d="M50 8C50 8 14 52 14 82C14 104 30 120 50 120C70 120 86 104 86 82C86 52 50 8 50 8Z"
        fill={isMain ? `url(#dropGradient-${uniqueId})` : "none"}
        stroke={color}
        strokeWidth={isMain ? "2.5" : "1.5"}
        strokeOpacity={isMain ? 1 : 0.5}
        strokeLinecap="round"
      />

      {isMain && (
        <g clipPath={`url(#raindropClip-${uniqueId})`}>
          {/* Central hexagon core - the focal point */}
          <g transform="translate(50, 75)">
            {/* Outer hexagon ring */}
            <polygon
              points="0,-18 15.6,-9 15.6,9 0,18 -15.6,9 -15.6,-9"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            {/* Inner hexagon */}
            <polygon
              points="0,-10 8.7,-5 8.7,5 0,10 -8.7,5 -8.7,-5"
              fill={color}
              fillOpacity="0.15"
              stroke={color}
              strokeWidth="1"
              strokeOpacity="0.8"
            />
            {/* Center node with glow */}
            <circle cx="0" cy="0" r="4" fill={`url(#centerGlow-${uniqueId})`} />
            <circle cx="0" cy="0" r="2" fill={color} />
          </g>

          {/* Circuit traces radiating from hexagon */}
          <g
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.5"
            strokeLinecap="round"
          >
            {/* Upward trace to tip */}
            <path d="M50 57 L50 35" />
            <circle cx="50" cy="35" r="2" fill={color} fillOpacity="0.6" />

            {/* Upper diagonal traces */}
            <path d="M50 35 L35 50" />
            <path d="M50 35 L65 50" />
            <circle cx="35" cy="50" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="65" cy="50" r="1.5" fill={color} fillOpacity="0.5" />

            {/* Side traces from hexagon */}
            <path d="M34.4 75 L22 75" />
            <path d="M65.6 75 L78 75" />
            <circle cx="22" cy="75" r="1.5" fill={color} fillOpacity="0.4" />
            <circle cx="78" cy="75" r="1.5" fill={color} fillOpacity="0.4" />

            {/* Lower diagonal traces */}
            <path d="M41.3 84 L30 100" />
            <path d="M58.7 84 L70 100" />
            <circle cx="30" cy="100" r="1.5" fill={color} fillOpacity="0.4" />
            <circle cx="70" cy="100" r="1.5" fill={color} fillOpacity="0.4" />

            {/* Downward trace */}
            <path d="M50 93 L50 108" />
            <circle cx="50" cy="108" r="2" fill={color} fillOpacity="0.5" />
          </g>

          {/* Data streams - binary rain effect inside drop */}
          <g
            fontFamily="JetBrains Mono, monospace"
            fontSize="6"
            fill={color}
            fillOpacity="0.25"
          >
            <text x="28" y="45">
              1
            </text>
            <text x="72" y="55">
              0
            </text>
            <text x="25" y="88">
              0
            </text>
            <text x="75" y="92">
              1
            </text>
            <text x="38" y="110">
              1
            </text>
            <text x="62" y="105">
              0
            </text>
          </g>

          {/* Highlight arc at top - glass reflection */}
          <path
            d="M32 42 Q50 25 68 42"
            stroke={color}
            strokeWidth="1.5"
            strokeOpacity="0.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Secondary inner arc */}
          <path
            d="M38 48 Q50 38 62 48"
            stroke={color}
            strokeWidth="0.75"
            strokeOpacity="0.25"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}
    </svg>
  );
}
