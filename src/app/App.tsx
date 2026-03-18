import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

export default function App() {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
}
