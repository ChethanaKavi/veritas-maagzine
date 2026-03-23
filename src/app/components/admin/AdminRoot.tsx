import { Outlet } from "react-router";
import { AdminDataProvider } from "../../contexts/AdminDataContext";

export function AdminRoot() {
  return (
    <AdminDataProvider>
      <div>
        <main>
          <Outlet />
        </main>
      </div>
    </AdminDataProvider>
  );
}
