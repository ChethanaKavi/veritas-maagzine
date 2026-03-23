import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { MagazineDrawer } from "./MagazineDrawer";
import { Input } from "./ui/input";

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to articles page with search query as URL parameter
      navigate(`/articles?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 md:w-80"
                  />
                  {searchQuery && (
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-900 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  )}
                </form>
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
              <Link to="/" className="text-2xl font-bold tracking-tight text-blue-900 ml-4">
                Veritas
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <div className="w-6" /> {/* Spacer for balance */}
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