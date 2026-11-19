import { createFileRoute, redirect } from "@tanstack/react-router";

// The map-first workspace is now the app's home screen ("/").
// This route keeps older links and bookmarks working.
export const Route = createFileRoute("/workspace")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
