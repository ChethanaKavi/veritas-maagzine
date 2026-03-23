import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router-dom";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Magazines } from "./pages/Magazines";
import { Articles } from "./pages/Articles";
import { About } from "./pages/About";
import { ArticleDetail } from "./pages/ArticleDetail";
import { MagazineDetail } from "./pages/MagazineDetail";
import { NotFound } from "./pages/NotFound";
import { AdminRoot } from "./components/admin/AdminRoot";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminMagazines } from "./pages/admin/AdminMagazines";
import { AdminArticles } from "./pages/admin/AdminArticles";
import { AdminAdvertisements } from "./pages/admin/AdminAdvertisements";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <NotFound />,
    children: [
      { index: true, Component: Home },
      { path: "magazines", Component: Magazines },
      { path: "magazines/:id", Component: MagazineDetail },
      { path: "articles", Component: Articles },
      { path: "articles/:id", Component: ArticleDetail },
      { path: "about", Component: About },
    ],
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminRoot />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", Component: AdminDashboard },
      { path: "magazines", Component: AdminMagazines },
      { path: "articles", Component: AdminArticles },
      { path: "advertisements", Component: AdminAdvertisements },
      { path: "analytics", Component: AdminAnalytics },
      { path: "*", element: <Navigate to="/admin/login" replace /> },
    ],
  },
]);
