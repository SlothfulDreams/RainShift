"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

interface ExportButtonProps {
  onExport: () => void;
  hasChanges: boolean;
  fileName: string;
}

export function ExportButton({
  onExport,
  hasChanges,
  fileName,
}: ExportButtonProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    if (!showWarning) {
      setShowWarning(true);
      return;
    }

    onExport();
    setExported(true);
    setShowWarning(false);

    // Reset exported state after 3 seconds
    setTimeout(() => setExported(false), 3000);
  };

  const handleCancel = () => {
    setShowWarning(false);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {showWarning ? (
          <motion.div
            key="warning"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="bg-secondary/10 border-secondary/30">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={20}
                  className="text-secondary flex-shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-medium text-secondary">Backup Reminder</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Make sure to backup your original save file before replacing
                    it. The game stores saves at:
                  </p>
                  <code className="block text-xs text-text-muted mt-2 p-2 bg-surface rounded">
                    Steam\userdata\[ID]\632360\remote\UserProfiles
                  </code>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <Download size={16} />
                  Download Anyway
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : exported ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="bg-success/10 border-success/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/20">
                  <Check size={20} className="text-success" />
                </div>
                <div>
                  <p className="font-medium text-success">Export Successful!</p>
                  <p className="text-sm text-text-secondary">
                    {fileName} has been downloaded
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleExport}
              disabled={!hasChanges}
              className="w-full"
            >
              <Download size={20} />
              {hasChanges ? "Export Modified Save" : "No Changes to Export"}
            </Button>
            {!hasChanges && (
              <p className="text-xs text-text-muted text-center mt-2">
                Make some changes to enable export
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
