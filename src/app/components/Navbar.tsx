import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { MagazineDrawer } from "./MagazineDrawer";
import { Input } from "./ui/input";
import veritasLogo from "../../images/veritas.png";

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Magazines", path: "/magazines" },
    { name: "Articles", path: "/articles" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const parts = location.pathname.split('/').filter(Boolean);

  const nameFor = (seg: string) => {
    if (seg === 'magazines') return 'Magazines';
    if (seg === 'articles') return 'Articles';
    if (seg === 'about') return 'About';
    return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-md hover:bg-blue-50 transition-colors text-blue-900"
                aria-label="Open magazine archive"
              >
                <Menu className="w-6 h-6" />
              </button>
              {/* Search (placed after hamburger) */}
              <div className="hidden sm:block">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-48 md:w-80"
                />
              </div>
            </div>

            {/* Navigation Links - Right (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? "text-blue-900 border-b-2 border-blue-900 pb-1"
                      : "text-gray-600 hover:text-blue-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* Logo placed after nav links on desktop */}
              <Link to="/" className="ml-4 flex items-center">
                <img src={veritasLogo} alt="Veritas" className="h-9 w-auto object-contain" />
              </Link>
            </div>

            {/* Mobile Logo */}
            <div className="md:hidden">
              <Link to="/" className="flex items-center">
                <img src={veritasLogo} alt="Veritas" className="h-8 w-auto object-contain" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="md:hidden pb-4 flex justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-blue-900 border-b-2 border-blue-900"
                    : "text-gray-600 hover:text-blue-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Magazine Drawer */}
      <MagazineDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}