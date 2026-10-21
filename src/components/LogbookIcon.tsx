import Image from "next/image";
import type { ReactNode } from "react";
import type { LogbookEntry } from "@/data/types";

/**
 * A logbook entry's icon, filling a square. Stage previews are landscape
 * (96x58), so they fill the square by cropping the sides instead of being
 * letterboxed; other icons are square or transparent and are shown whole.
 */
export function LogbookIcon({
  entry,
  fallback,
}: {
  entry: LogbookEntry;
  fallback: ReactNode;
}) {
  if (!entry.image) return fallback;
  const fit =
    entry.category === "environments" ? "object-cover" : "object-contain";
  return (
    <Image
      src={entry.image}
      alt={entry.name}
      width={48}
      height={48}
      className={`${fit} w-full h-full`}
      unoptimized
    />
  );
}
