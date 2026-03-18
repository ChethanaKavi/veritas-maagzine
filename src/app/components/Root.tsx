import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Root() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
