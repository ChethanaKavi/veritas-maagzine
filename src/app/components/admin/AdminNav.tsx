import { Link, useLocation } from "react-router-dom";

export function AdminNav() {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Magazines", path: "/admin/magazines" },
    { name: "Articles", path: "/admin/articles" },
    { name: "Advertisements", path: "/admin/advertisements" },
    { name: "Analytics", path: "/admin/analytics" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <div className="flex space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.path) ? "bg-gray-900" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
          View Site
        </Link>
      </div>
    </nav>
  );
}
