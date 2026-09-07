import { redirect } from "next/navigation";

// This used to be a static design-preview page (hardcoded mock
// reconciliation data + a hardcoded fake user), never wired to real
// data or a real session — anyone landing on the bare "/" route while
// logged in saw fabricated numbers instead of their actual work.
// proxy.ts's middleware already keeps unauthenticated visitors off
// this route (redirected to /login), so the only real destination for
// an authenticated visit to "/" is the actual app — /reconcile.
export default function RootPage() {
  redirect("/reconcile");
}
