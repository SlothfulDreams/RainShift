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
                {/* Animated logo */}
                <motion.div
                  className="relative inline-block mb-8"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <div className="w-24 h-24 relative">
                    {/* Outer ring */}
                    <motion.div
                      className="absolute inset-0 border-2 border-neon-cyan/30 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    {/* Inner ring */}
                    <motion.div
                      className="absolute inset-2 border border-neon-purple/40 rounded-full"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-neon-cyan/10 rounded-lg rotate-45 border border-neon-cyan/50 flex items-center justify-center">
                        <span className="text-neon-cyan text-2xl -rotate-45 font-display font-bold">
                          R
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-full blur-2xl -z-10" />
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
