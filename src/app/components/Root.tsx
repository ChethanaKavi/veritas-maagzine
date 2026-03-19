import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { GoogleAnalytics } from "./GoogleAnalytics";

export function Root() {
  return (
    <div className="min-h-screen bg-white">
      <GoogleAnalytics />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
