"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { isValidSaveFile, readFileAsText } from "@/lib/utils";
import { validateSaveFile } from "@/lib/xml-parser";

interface FileUploadProps {
  onFileLoaded: (xmlContent: string, fileName: string) => void;
}

export function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsLoading(true);

      try {
        if (!isValidSaveFile(file)) {
          throw new Error("Invalid file type. Please upload an XML file.");
        }

        const content = await readFileAsText(file);
        const validation = validateSaveFile(content);

        if (!validation.valid) {
          throw new Error(validation.error);
        }

        onFileLoaded(content, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file");
      } finally {
        setIsLoading(false);
      }
    },
    [onFileLoaded],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
    },
    [processFile],
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative cursor-pointer
          holo-card
          p-12 rounded-sm
          transition-all duration-300
          ${isDragging ? "border-neon-cyan shadow-[0_0_30px_rgba(0,240,255,0.3)]" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Animated border on drag */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 rounded-sm border-2 border-neon-cyan pointer-events-none"
          />
        )}

        <div className="flex flex-col items-center justify-center gap-6 relative z-10">
          {/* Upload icon with animation */}
          <motion.div
            animate={{
              y: isDragging ? -5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 border border-neon-cyan/30 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              style={{ width: 80, height: 80, margin: -8 }}
            />

            <div
              className={`
              w-16 h-16 rounded-full
              flex items-center justify-center
              border-2 transition-colors duration-300
              ${
                isDragging
                  ? "border-neon-cyan bg-neon-cyan/10"
                  : "border-border bg-void-light"
              }
            `}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full"
                />
              ) : (
                <Upload
                  size={24}
                  className={
                    isDragging ? "text-neon-cyan" : "text-text-secondary"
                  }
                />
              )}
            </div>
          </motion.div>

          {/* Text */}
          <div className="text-center">
            <h3 className="text-lg font-display text-text-bright mb-2 tracking-wider">
              {isDragging ? "DROP FILE HERE" : "UPLOAD SAVE FILE"}
            </h3>
            <p className="text-text-secondary text-sm">
              Drag and drop{" "}
              <span className="text-neon-cyan font-semibold">
                UserProfile.xml
              </span>{" "}
              or click to browse
            </p>
          </div>

          {/* Action button */}
          <button
            type="button"
            className={`
              px-6 py-2 text-xs tracking-widest font-display
              border transition-all duration-200
              ${
                isDragging
                  ? "border-neon-cyan text-neon-cyan bg-neon-cyan/10"
                  : "border-border text-text-secondary hover:border-neon-cyan/50 hover:text-neon-cyan"
              }
            `}
            disabled={isLoading}
          >
            {isLoading ? "PROCESSING..." : "SELECT FILE"}
          </button>

          {/* Path hint */}
          <div className="text-center">
            <p className="text-text-muted text-[10px] tracking-wider mb-1">
              DEFAULT LOCATION
            </p>
            <code className="text-neon-cyan/60 text-[10px] block">
              Steam/userdata/[ID]/632360/remote/UserProfiles
            </code>
          </div>
        </div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4"
          >
            <div className="p-4 border border-neon-red/50 bg-neon-red/5 rounded-sm">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-neon-red flex-shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-neon-red font-display text-sm tracking-wider">
                    ERROR
                  </p>
                  <p className="text-text-secondary text-sm mt-1">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setError(null);
                  }}
                  className="text-text-muted hover:text-neon-red transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
