import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RainShift - Risk of Rain 2 Save Editor",
    short_name: "RainShift",
    description: "Edit your Risk of Rain 2 profile in your browser.",
    start_url: "/",
    display: "standalone",
    background_color: "#131519",
    theme_color: "#131519",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
