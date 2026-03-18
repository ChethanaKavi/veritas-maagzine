import { Outlet } from "react-router";

export function AdminRoot() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
